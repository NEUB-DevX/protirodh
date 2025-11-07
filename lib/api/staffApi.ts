import { API_URL } from "@/app/const/config";

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

// Authentication API
export const staffAuthApi = {
  login: async (staffId: string, password: string) => {
    return apiCall("/auth/staff/login", {
      method: "POST",
      body: JSON.stringify({ staffId, password }),
    });
  },

  verifyToken: async () => {
    return apiCall("/auth/staff/verify-token", {
      method: "POST",
    });
  },

  logout: async () => {
    return apiCall("/auth/staff/logout", {
      method: "POST",
    });
  },
};

// Staff Profile API
export const staffProfileApi = {
  get: async () => {
    return apiCall("/staff/profile");
  },
};

// Staff Dashboard API
export const staffDashboardApi = {
  get: async () => {
    return apiCall("/staff/dashboard");
  },
};

// Appointments API
export const appointmentsApi = {
  getAll: async (params?: {
    date?: string;
    status?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.date) queryParams.append("date", params.date);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    return apiCall(`/staff/appointments${queryString ? `?${queryString}` : ""}`);
  },

  getById: async (id: string) => {
    return apiCall(`/staff/appointments/${id}`);
  },

  complete: async (id: string, data: {
    notes?: string;
    vaccineBatch?: string;
    sideEffects?: string;
  }) => {
    return apiCall(`/staff/appointments/${id}/complete`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  markAsNoShow: async (id: string, notes?: string) => {
    return apiCall(`/staff/appointments/${id}/no-show`, {
      method: "PUT",
      body: JSON.stringify({ notes }),
    });
  },

  updateNotes: async (id: string, notes: string) => {
    return apiCall(`/staff/appointments/${id}/notes`, {
      method: "PUT",
      body: JSON.stringify({ notes }),
    });
  },
};
