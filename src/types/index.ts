export type Role = 'customer' | 'organizer';

export interface User {
  id: number; // or string depending on API, API says ID? assuming number
  email: string;
  role: Role;
  name?: string;
  avatarUrl?: string; // from picture
  points?: number; // for customer
  referralCode?: string;
}

// Common Wrapper from API requirement: res.data?.data
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export type EventStatus = 'active' | 'inactive' | 'draft';

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  endDate: string;
  location: string;
  eventPrice: string;
  capacity: number;
  image: string;
  eventType: string;
  eventPaid: boolean;
  rating: number;
  archived: false;
  deleted: false;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  eventId: number;
  customerId: number;
  rating: number;
  comment: string;
  createdAt: string;
  customer?: {
    name: string;
  };
}

export type OrderStatus = 'waiting_payment' | 'waiting_confirmation' | 'done' | 'rejected' | 'expired' | 'canceled';

export interface Order {
  id: number;
  eventId: number;
  customerId: number;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  paymentProofUrl?: string;
  createdAt: string;
  event?: Event;
}

export interface DashboardStats {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  activeOrders: number;
}
