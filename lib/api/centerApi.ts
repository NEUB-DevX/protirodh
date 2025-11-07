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
export const centerAuthApi = {
  login: async (centerId: string, password: string) => {
    return apiCall("/auth/center/login", {
      method: "POST",
      body: JSON.stringify({ centerId, password }),
    });
  },

  verifyToken: async () => {
    return apiCall("/auth/center/verify-token", {
      method: "POST",
    });
  },

  logout: async () => {
    return apiCall("/auth/center/logout", {
      method: "POST",
    });
  },
};

// Stock Request API
export const stockRequestApi = {
  getAll: async () => {
    return apiCall("/center/stock-requests");
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
    return apiCall("/center/stock-requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  },
};

// Vaccine API
export const vaccineApi = {
  getAll: async () => {
    return apiCall("/center/vaccines");
  },

  getById: async (id: string) => {
    return apiCall(`/center/vaccines/${id}`);
  },
};

// Profile API
export const profileApi = {
  get: async () => {
    return apiCall("/center/profile");
  },

  update: async (profileData: {
    name?: string;
    address?: string;
    capacity?: number;
    staff?: number;
  }) => {
    return apiCall("/center/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },
};

// Dashboard API
export const dashboardApi = {
  get: async () => {
    return apiCall("/center/dashboard");
  },
};

// Staff API
export const staffApi = {
  getAll: async () => {
    return apiCall(`/center/staff/`);
  },

  create: async (staffData: {
    staffId: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    password: string;
  }) => {
    return apiCall("/center/staff", {
      method: "POST",
      body: JSON.stringify(staffData),
    });
  },

  update: async (
    id: string,
    staffData: Partial<{
      staffId: string;
      name: string;
      email: string;
      phone: string;
      role: string;
      password: string;
      status: string;
    }>,
  ) => {
    return apiCall(`/center/staff/${id}`, {
      method: "PUT",
      body: JSON.stringify(staffData),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/center/staff/${id}`, {
      method: "DELETE",
    });
  },
};

// Date Slot API
export const dateSlotApi = {
  getAll: async () => {
    return apiCall(`/center/date-slots/`);
  },

  create: async (dateSlotData: {
    date: string;
    capacity: number;
    status: string;
  }) => {
    return apiCall("/center/date-slots", {
      method: "POST",
      body: JSON.stringify(dateSlotData),
    });
  },

  update: async (
    id: string,
    dateSlotData: Partial<{
      date: string;
      capacity: number;
      status: string;
    }>,
  ) => {
    return apiCall(`/center/date-slots/${id}`, {
      method: "PUT",
      body: JSON.stringify(dateSlotData),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/center/date-slots/${id}`, {
      method: "DELETE",
    });
  },
};

// Time Slot API
export const timeSlotApi = {
  getByDateSlot: async (dateSlotId: string) => {
    return apiCall(`/center/date-slots/${dateSlotId}/time-slots`);
  },

  create: async (timeSlotData: {
    dateSlotId: string;
    time: string;
    capacity: number;
    assignedStaffId?: string;
  }) => {
    return apiCall("/center/time-slots", {
      method: "POST",
      body: JSON.stringify(timeSlotData),
    });
  },

  update: async (
    id: string,
    timeSlotData: Partial<{
      time: string;
      capacity: number;
      assignedStaffId?: string | null;
    }>,
  ) => {
    return apiCall(`/center/time-slots/${id}`, {
      method: "PUT",
      body: JSON.stringify(timeSlotData),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/center/time-slots/${id}`, {
      method: "DELETE",
    });
  },
};
