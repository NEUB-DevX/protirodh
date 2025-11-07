import { API_URL } from "@/app/const/config";


// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
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

// Authentication API
export const centerAuthApi = {
  login: async (centerId: string, password: string) => {
    return apiCall('/auth/center/login', {
      method: 'POST',
      body: JSON.stringify({ centerId, password }),
    });
  },

  verifyToken: async () => {
    return apiCall('/auth/center/verify-token', {
      method: 'POST',
    });
  },

  logout: async () => {
    return apiCall('/auth/center/logout', {
      method: 'POST',
    });
  },
};

// Stock Request API
export const stockRequestApi = {
  getAll: async () => {
    return apiCall('/center/stock-requests');
  },

  getById: async (id: string) => {
    return apiCall(`/center/stock-requests/${id}`);
  },

  create: async (requestData: {
    vaccine: string;
    quantity: number;
    urgency: string;
    notes?: string;
  }) => {
    return apiCall('/center/stock-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },
};

// Vaccine API
export const vaccineApi = {
  getAll: async () => {
    return apiCall('/center/vaccines');
  },

  getById: async (id: string) => {
    return apiCall(`/center/vaccines/${id}`);
  },
};

// Profile API
export const profileApi = {
  get: async () => {
    return apiCall('/center/profile');
  },

  update: async (profileData: {
    name?: string;
    address?: string;
    capacity?: number;
    staff?: number;
  }) => {
    return apiCall('/center/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Dashboard API
export const dashboardApi = {
  get: async () => {
    return apiCall('/center/dashboard');
  },
};
