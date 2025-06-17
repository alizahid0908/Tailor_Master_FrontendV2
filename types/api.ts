// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// Auth Types
export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

// Customer Types
export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  sizes?: Size[];
  orders?: Order[];
}

export interface CreateCustomerRequest {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface UpdateCustomerRequest {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}

// Size/Measurements Types
export interface Size {
  id: number;
  customer_id: number;
  size_name: string;
  collar_size?: number;
  chest_size?: number;
  sleeve_length?: number;
  cuff_size?: number;
  shoulder_size?: number;
  waist_size?: number;
  shirt_length?: number;
  legs_length?: number;
  description?: string;
  category: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
}

export interface CreateSizeRequest {
  customer_id: number;
  size_name: string;
  collar_size?: number;
  chest_size?: number;
  sleeve_length?: number;
  cuff_size?: number;
  shoulder_size?: number;
  waist_size?: number;
  shirt_length?: number;
  legs_length?: number;
  description?: string;
  category: string;
}

export interface UpdateSizeRequest {
  customer_id: number;
  size_name: string;
  collar_size?: number;
  chest_size?: number;
  sleeve_length?: number;
  cuff_size?: number;
  shoulder_size?: number;
  waist_size?: number;
  shirt_length?: number;
  legs_length?: number;
  description?: string;
  category: string;
}

// Order Types
export interface Order {
  id: number;
  customer_id: number;
  size_id: number[];
  quantity: number[];
  price: number;
  status: 'pending' | 'in_progress' | 'completed' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
  customer?: Customer;
  sizes?: Size[];
}

export interface CreateOrderRequest {
  customer_id: number;
  size_id: number[];
  quantity: number[];
  price: number;
}

export interface UpdateOrderRequest {
  customer_id: number;
  size_id: number[];
  quantity: number[];
  price: number;
  status?: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
}