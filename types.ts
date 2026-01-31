/* =========================
   USER & ROLES
   ========================= */
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

/* =========================
   TICKETS & STATUSES
   ========================= */
export enum TicketStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum TradeInStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED'
}

/* =========================
   PRODUCTS & CART
   ========================= */
export interface Product {
  id: string;
  name: string;
  category: string; // Internal category
  type: 'Laptop' | 'Component' | 'Accessory' | 'Software';
  brand: 'Dell' | 'HP' | 'Lenovo' | 'Samsung' | 'Kingston' | 'Other';
  condition: 'New' | 'Refurbished';
  price: number;
  stock: number;
  image: string;
  description: string;
  specs?: {
    cpu?: string;
    ram?: string;
    storage?: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

/* =========================
   SERVICES (CATALOG)
   ========================= */
export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  serviceType: string;
  description: string;
  services: ServiceItem[];
}

/* =========================
   SERVICE REQUESTS (TICKETS)
   ========================= */
export interface ServiceRequest {
  id: string;
  customerName: string;
  contactMethod: string;
  contactValue: string;
  serviceType: string;
  description: string;
  status: TicketStatus;
  dateCreated: string;
  notes?: string;
  aiAnalysis?: string;
  assignedTo?: string;
}

/* =========================
   TRADE-INS
   ========================= */
export interface TradeInRequest {
  id: string;
  customerName: string;
  contact: string;
  deviceModel: string;
  specs: string;
  condition: string;
  conditionRating: 'Functional' | 'Minor Issues' | 'Dead/Parts';
  expectedPrice: number;
  status: TradeInStatus;
  dateSubmitted: string;
  imageNames?: string[];
  adminNotes?: string;
}

/* =========================
   ORDERS
   ========================= */
export interface Order {
  id: string;
  customerName: string;
  email: string;
  address: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  paymentMethod: 'Stripe' | 'PayPal';
}

/* =========================
   USERS & PROMOS
   ========================= */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Promotion {
  id: string;
  title: string;
  active: boolean;
}
