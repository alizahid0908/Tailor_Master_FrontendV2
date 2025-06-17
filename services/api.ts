import API_CONFIG from '@/config/api';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Platform-specific storage implementation
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private async getAuthToken(): Promise<string | null> {
    return await storage.getItem('auth_token');
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const token = await this.getAuthToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(identifier: string, password: string) {
    const response = await this.makeRequest(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    
    if (response.token) {
      await storage.setItem('auth_token', response.token);
    }
    
    return response;
  }

  async register(name: string, email: string, phone: string, password: string) {
    const response = await this.makeRequest(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password }),
    });
    
    if (response.token) {
      await storage.setItem('auth_token', response.token);
    }
    
    return response;
  }

  async logout() {
    await storage.removeItem('auth_token');
  }

  // Customer methods
  async getCustomers() {
    return this.makeRequest(API_CONFIG.ENDPOINTS.CUSTOMER.LIST);
  }

  async getCustomer(id: string) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.CUSTOMER.DETAIL(id));
  }

  async createCustomer(data: { name: string; phone: string; email?: string; address?: string; notes?: string }) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.CUSTOMER.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(id: string, data: { name: string; phone: string; email?: string; address?: string; notes?: string }) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.CUSTOMER.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCustomer(id: string) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.CUSTOMER.DELETE(id), {
      method: 'DELETE',
    });
  }

  // Size/Measurements methods
  async getSizes() {
    return this.makeRequest(API_CONFIG.ENDPOINTS.SIZE.LIST);
  }

  async getSize(id: string) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.SIZE.DETAIL(id));
  }

  async getSizesByCustomer(customerId: string) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.SIZE.BY_CUSTOMER(customerId));
  }

  async createSize(data: {
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
  }) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.SIZE.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSize(id: string, data: {
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
  }) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.SIZE.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSize(id: string) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.SIZE.DELETE(id), {
      method: 'DELETE',
    });
  }

  // Order methods
  async getOrders() {
    return this.makeRequest(API_CONFIG.ENDPOINTS.ORDER.LIST);
  }

  async getOrder(id: string) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.ORDER.DETAIL(id));
  }

  async createOrder(data: {
    customer_id: number;
    size_id: number[];
    quantity: number[];
    price: number;
  }) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.ORDER.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrder(id: string, data: {
    customer_id: number;
    size_id: number[];
    quantity: number[];
    price: number;
    status?: string;
  }) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.ORDER.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.ORDER.UPDATE_STATUS(id), {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteOrder(id: string) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.ORDER.DELETE(id), {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;