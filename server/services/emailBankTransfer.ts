// server/services/emailBankTransfer.ts
import { ImapFlow } from "imapflow";
import { htmlToText } from "html-to-text";
import crypto from "crypto";
import Order from "@/models/order";

type ParsedAlert = {
  orderNumber?: string;
  amount?: number;
  currency?: string;
  sender?: string;
  subject?: string;
  date?: Date;
  rawText: string;
};

const narrationRegexes = [
  /ORD[-\s:]?([A-Za-z0-9]+)\b/g,            // ORD-696A9C37
  /\bOrder\s*#\s*([A-Za-z0-9]+)\b/g,        // Order #696A9C37
  /\bRef(?:erence)?[:\s-]*([A-Za-z0-9-]+)\b/g,
];

const amountRegexes = [
  /\b(?:NGN|₦)\s?([\d,]+(?:\.\d{1,2})?)\b/g,
  /\bAmount[:\s-]*([\d,]+(?:\.\d{1,2})?)\b/g,
];

// Parse email text to extract order number and amount
function parseAlertText(text: string): ParsedAlert {
  const out: ParsedAlert = { rawText: text };
  out.currency = process.env.CURRENCY || "NGN";

  for (const rx of narrationRegexes) {
    const m = rx.exec(text);
    if (m?.[1]) {
      const candidate = m[1].toUpperCase();
      out.orderNumber = candidate.startsWith("ORD") ? candidate : `ORD-${candidate}`;
      break;
    }
  }

  for (const rx of amountRegexes) {
    const m = rx.exec(text);
    if (m?.[1]) {
      out.amount = Number(String(m[1]).replace(/,/g, ""));
      break;
    }
  }

  return out;
}

function computeDeliveryDate(): Date {
  const days = Number(process.env.DELIVERY_LEAD_DAYS || 3);
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function markOrderPaid(orderId: string, parsed: ParsedAlert, lockKey: string) {
  const order = await Order.findOne({ orderNumber: orderId });
  if (!order) throw new Error(`Order not found: ${orderId}`);

  if (order.paymentStatus === "paid") return order;
  if (order.paymentLockKey && order.paymentLockKey === lockKey) return order;

  if (parsed.amount == null) throw new Error("Amount missing in alert");
  if (order.totalAmount !== parsed.amount) {
    throw new Error(`Amount mismatch: expected ${order.totalAmount}, got ${parsed.amount}`);
  }
  const currency = parsed.currency || process.env.CURRENCY || "NGN";
  if ((order.currency || "NGN") !== currency) {
    throw new Error(`Currency mismatch: expected ${order.currency}, got ${currency}`);
  }

  order.paymentStatus = "paid";
  order.orderStatus = "processing";
  order.payment = {
    provider: "bank",
    method: "bank_transfer",
    transactionId: undefined,
    txRef: order.orderNumber,
    chargedAmount: parsed.amount,
    currency,
    raw: parsed,
    confirmedAt: new Date(),
  };
  order.deliveryDate = computeDeliveryDate();
  order.paymentLockKey = lockKey;

  await order.save();
  return order;
}

export async function startEmailBankTransferPoller() {
  const client = new ImapFlow({
    host: process.env.EMAIL_HOST!,
    port: Number(process.env.EMAIL_PORT || 993),
    secure: String(process.env.EMAIL_SECURE || "true") === "true",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
    logger: false,
  });

  await client.connect();

  const folder = process.env.EMAIL_FOLDER || "INBOX";
  await client.mailboxOpen(folder);

  const officialFrom = (process.env.EMAIL_FROM_FILTER || "").toLowerCase();
  const bankNameKeyword = (process.env.EMAIL_BANK_NAME_FILTER || "").toLowerCase();
  const moveProcessed = process.env.EMAIL_MOVE_PROCESSED;
  const moveFailed = process.env.EMAIL_MOVE_FAILED;

  async function processMessage(uid: number) {
    const msg = await client.fetchOne(uid, {
      envelope: true,
      source: true,
      bodyStructure: true,
      bodyParts: ["1", "TEXT"],
      uid: true,
    });

    if (!msg) return;

    const fromAddr = (msg.envelope?.from?.[0]?.address || "").toLowerCase();
    const fromName = (msg.envelope?.from?.[0]?.name || "").toLowerCase();
    const subject = (msg.envelope?.subject || "").toLowerCase();
    const date = msg.envelope?.date || new Date();

    let isCandidate = false;
    if (officialFrom && fromAddr.includes(officialFrom)) {
      isCandidate = true;
    }

    let rawText = "";
    try {
      const source = msg.source?.toString() || "";
      rawText = htmlToText(source, { wordwrap: false }).toLowerCase();
    } catch {
      rawText = ((msg.source?.toString() || "") + " " + subject).toLowerCase();
    }

    if (!isCandidate && bankNameKeyword) {
      const bodyHasKeyword = rawText.includes(bankNameKeyword);
      const nameHasKeyword = fromName.includes(bankNameKeyword);
      const subjectHasKeyword = subject.includes(bankNameKeyword);
      isCandidate = bodyHasKeyword || nameHasKeyword || subjectHasKeyword;
    }

    if (!isCandidate) return;

    const parsed = parseAlertText(htmlToText(msg.source?.toString() || "", { wordwrap: false }));
    parsed.sender = fromAddr || fromName;
    parsed.subject = msg.envelope?.subject || "";
    parsed.date = date;

    const lockKey = crypto
      .createHash("sha256")
      .update(`${msg.uid}-${parsed.subject}-${parsed.orderNumber || ""}-${parsed.amount || ""}`)
      .digest("hex");

    try {
      if (!parsed.orderNumber) throw new Error("No order number found in narration");
      const updated = await markOrderPaid(parsed.orderNumber, parsed, lockKey);

      if (moveProcessed) {
        await client.messageMove({ uid: msg.uid }, moveProcessed).catch(() => {});
      }

      console.log(`[bank-transfer] Marked paid: ${updated.orderNumber} amount=${parsed.amount}`);
    } catch (err) {
      console.error("[bank-transfer] Failed to process email:", err);

      if (moveFailed) {
        await client.messageMove({ uid: msg.uid }, moveFailed).catch(() => {});
      }
    }
  }

  // Initial scan: unseen messages
  for await (const msg of client.fetch({ seen: false }, { uid: true })) {
    if (!msg) continue;
    await processMessage(msg.uid);
  }

  // Polling loop
  const interval = Number(process.env.EMAIL_POLL_INTERVAL_MS || 30000);
  setInterval(async () => {
    try {
      for await (const msg of client.fetch({ seen: false }, { uid: true })) {
        if (!msg) continue;
        await processMessage(msg.uid);
      }
    } catch (err) {
      console.error("[bank-transfer] Poll error:", err);
      try { await client.logout(); } catch {}
      try {
        await client.connect();
        await client.mailboxOpen(folder);
      } catch (e) {
        console.error("[bank-transfer] Reconnect failed:", e);
      }
    }
  }, interval);

  console.log(`[bank-transfer] Poller started on ${folder}, interval=${interval}ms`);
}
