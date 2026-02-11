// services/accountService.ts
import api from "@/utils/axiosInstance";

// -------------------- TYPES --------------------
export type Preferences = {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  theme?: "light" | "dark";
};

export type User = {
  id: string;
  userName: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  preferences?: Preferences; // <-- add this
};

export type Order = {
  id: string;
  number: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  placedAt: string;
};

export type Address = {
  recipientName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  label?: string;
};

export type PaymentMethod = {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
};

// -------------------- USER PROFILE --------------------
export async function fetchUser(): Promise<User> {
  const { data } = await api.get<User>("/api/user/me");
  return data;
}

export async function updateProfile(payload: {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}): Promise<User> {
  const { data } = await api.put<User>("/api/user/profile", payload);
  return data;
}

// -------------------- ORDERS --------------------
export async function fetchOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>("/api/orders/mine");
  return data;
}

// -------------------- ADDRESSES --------------------
export async function fetchAddresses(): Promise<Address[]> {
  const { data } = await api.get<Address[]>("/api/addresses");
  return data;
}

export async function saveAddress(address: Address): Promise<Address> {
  const { data } = await api.post<Address>("/api/addresses", address);
  return data;
}

// -------------------- PAYMENTS --------------------
export async function fetchPayments(): Promise<PaymentMethod[]> {
  const { data } = await api.get<PaymentMethod[]>("/api/payments");
  return data;
}

export async function savePayment(payment: PaymentMethod): Promise<PaymentMethod> {
  const { data } = await api.post<PaymentMethod>("/api/payments", payment);
  return data;
}

// -------------------- SECURITY --------------------
export async function updatePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/api/user/password", payload);
  return data;
}

// -------------------- PREFERENCES --------------------
export async function updatePreferences(payload: Preferences): Promise<Preferences> {
  const { data } = await api.put<Preferences>("/api/user/preferences", payload);
  return data;
}


// -------------------- LOGOUT --------------------
export async function logout(): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/api/auth/logout");
  return data;
}
