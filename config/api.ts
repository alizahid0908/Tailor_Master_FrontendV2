const API_BASE_URL = 'https://tailormaster-backwardobservations.koyeb.app/api/';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: 'user/login',
      REGISTER: 'user/register',
    },
    // Customer endpoints
    CUSTOMER: {
      LIST: 'customer',
      DETAIL: (id: string) => `customer/${id}`,
      CREATE: 'customer',
      UPDATE: (id: string) => `customer/${id}`,
      DELETE: (id: string) => `customer/${id}`,
    },
    // Size/Measurements endpoints
    SIZE: {
      LIST: 'customer/size',
      DETAIL: (id: string) => `customer/size/${id}`,
      CREATE: 'customer/size',
      UPDATE: (id: string) => `customer/size/${id}`,
      DELETE: (id: string) => `customer/size/${id}`,
      BY_CUSTOMER: (customerId: string) => `customer/size/getByCustomer/${customerId}`,
    },
    // Order endpoints
    ORDER: {
      LIST: 'order',
      DETAIL: (id: string) => `order/${id}`,
      CREATE: 'order',
      UPDATE: (id: string) => `order/${id}`,
      DELETE: (id: string) => `order/${id}`,
      UPDATE_STATUS: (id: string) => `order/${id}`,
    },
  },
};

export default API_CONFIG;