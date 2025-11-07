import { API_URL } from '@/app/const/config';
import type {
  Vaccine,
  Center,
  StockRequest,
  Analytics,
  VaccineFormData,
  CenterFormData,
  ApprovalData,
  RejectionData,
  ApiResponse,
} from '../types/hub.types';



// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('adminToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// Vaccine API
export const vaccineApi = {
  getAll: async (): Promise<ApiResponse<Vaccine[]>> => {
    return apiCall('/hub/vaccines');
  },

  getById: async (id: string): Promise<ApiResponse<Vaccine>> => {
    return apiCall(`/hub/vaccines/${id}`);
  },

  create: async (vaccineData: VaccineFormData): Promise<ApiResponse<Vaccine>> => {
    return apiCall('/hub/vaccines', {
      method: 'POST',
      body: JSON.stringify(vaccineData),
    });
  },

  update: async (id: string, vaccineData: VaccineFormData): Promise<ApiResponse<Vaccine>> => {
    return apiCall(`/hub/vaccines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vaccineData),
    });
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiCall(`/hub/vaccines/${id}`, {
      method: 'DELETE',
    });
  },
};

// Center API
export const centerApi = {
  getAll: async (): Promise<ApiResponse<Center[]>> => {
    return apiCall('/hub/centers');
  },

  getById: async (id: string): Promise<ApiResponse<Center>> => {
    return apiCall(`/hub/centers/${id}`);
  },

  create: async (centerData: CenterFormData): Promise<ApiResponse<Center>> => {
    return apiCall('/hub/centers', {
      method: 'POST',
      body: JSON.stringify(centerData),
    });
  },

  update: async (id: string, centerData: CenterFormData): Promise<ApiResponse<Center>> => {
    return apiCall(`/hub/centers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(centerData),
    });
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiCall(`/hub/centers/${id}`, {
      method: 'DELETE',
    });
  },
};

// Stock Request API
export const stockRequestApi = {
  getAll: async (): Promise<ApiResponse<StockRequest[]>> => {
    return apiCall('/hub/stock-requests');
  },

  getById: async (id: string): Promise<ApiResponse<StockRequest>> => {
    return apiCall(`/hub/stock-requests/${id}`);
  },

  approve: async (id: string, approvalData: ApprovalData): Promise<ApiResponse<StockRequest>> => {
    return apiCall(`/hub/stock-requests/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify(approvalData),
    });
  },

  reject: async (id: string, rejectionData: RejectionData): Promise<ApiResponse<StockRequest>> => {
    return apiCall(`/hub/stock-requests/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify(rejectionData),
    });
  },
};

// Analytics API
export const analyticsApi = {
  getDashboard: async (): Promise<ApiResponse<Analytics>> => {
    return apiCall('/hub/analytics/dashboard');
  },
};
