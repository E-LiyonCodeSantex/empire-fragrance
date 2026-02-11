import { Request, Response } from "express";
import Contact from "@/models/contact";

// ✅ User submits a message
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, phone, message } = req.body;
    const newMessage = await Contact.create({ name, email, subject, phone, message });
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error creating message:", err);
    res.status(500).json({ message: "Failed to submit message" });
  }
};

// ✅ Admin fetches all messages 
export const getMessages = async (req: Request, res: Response) => { 
  try { 
    // Before returning, clean up resolved messages older than 30 days 
    const thirtyDaysAgo = new Date(); 
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); 
    
    await Contact.deleteMany({
      status: "resolved", 
      updatedAt: { $lte: thirtyDaysAgo }, 
    }); 

    const messages = await Contact.find().sort({ createdAt: -1 }); 
    res.json(messages); 
  } catch (err) { 
    console.error("Error fetching messages:", err); 
    res.status(500).json({ message: "Failed to fetch messages" });
   } 
  };

// ✅ Admin marks message as resolved
export const resolveMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Contact.findByIdAndUpdate(
      id,
      { status: "resolved", resolvedAt: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Error resolving message:", err);
    res.status(500).json({ message: "Failed to resolve message" });
  }
};
