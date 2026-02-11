export interface ProductCardProps {
  _id: string; // maps to MongoDB _id
  name: string;
  description?: string;
  price: number; // stored in minor units (e.g., cents/kobo)
  imageUrl: string;
  rating?: number; // 0–5
  isAvailable: boolean;
  salePrice?: number;
  tags?: string[]; // array of tags
  brand?: string;
  category?: string;
  quantity: number;
  sku?: string; // optional stock keeping unit
  createdAt?: Date;
  updatedAt?: Date;
  averageRating?: number;
  reviewCount?: number;
}


export interface LayoutProps {
  children: React.ReactNode
}

export interface RegisterUserProps {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export interface loginUserProps {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordprops {
  userName?: string;
  email?: string;
}

//cart item interface
export interface CartItem {
  _id: string; // item id inside cart
  productId: ProductCardProps; // populated product document
  quantity: number;
}

export interface Cart {
  _id: string;
  token?: string | null;
  userId?: string | null;
  items: CartItem[];

}

export interface ShippingResponse {
  fee: number;
};

export interface ShippingRule {
  _id: string;
  state: string;
  price: number;
  freeShippingThreshold?: number;
}

export interface Address { 
  recipientName: string;
  phone: string; 
  street: string; 
  nearestBustop?: string;
  city: string; state: 
  string; postalCode?: 
  string; country: string; 
}


export type OrderItem = {
  productId: string;   // MongoDB ObjectId as string
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
};

export type ShippingAddress = {
  recipientName: string;
  phone: string;
  street: string;
  nearestBustop?: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  email?: string;
};

interface user {
  id: string;
  userName: string;
  email: string;
}
interface guestInfo {
  name: string;
  email: string;
  phone: string;
}
export interface Payment {
  provider?: string;
  method?: string;
  transactionId?: string;
  txRef?: string;
  chargedAmount?: number;
  currency?: string;
  raw?: any;
  confirmedAt?: string; // ISO date string
}


export type Order = {
  _id: string; // _id from MongoDB
  user?: user; // user id
  items: OrderItem[];
  guestInfo?: guestInfo;
  shippingAddress: ShippingAddress;
  shippingFee: number;
  subtotal: number;
  total: number;
  paymentMethod: "flutterwave" | "bank_transfer";
  paymentStatus: "unpaid" | "awaiting_confirmation" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  orderNumber: string;
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deliveredAt?: string; // ISO date string
  payment: Payment;
};


export interface FlutterwaveConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: "NGN" | "USD" | "GHS" | "KES";
  payment_options: string;
  customer: {
    email: string;
    phone_number?: string;
    name?: string;
  };
  customizations?: {
    title?: string;
    description?: string;
    logo?: string;
  };
}
