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

// User Authentication API
export const userAuthApi = {
  login: async (nid: string, password: string) => {
    return apiCall("/auth/user/login", {
      method: "POST",
      body: JSON.stringify({ nid, password }),
    });
  },

  register: async (userData: {
    nid: string;
    name: string;
    phone: string;
    email?: string;
    address: string;
    division: string;
    district: string;
    upazila: string;
    password: string;
  }) => {
    return apiCall("/auth/user/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  verifyToken: async () => {
    return apiCall("/auth/user/verify-token", {
      method: "POST",
    });
  },

  logout: async () => {
    return apiCall("/auth/user/logout", {
      method: "POST",
    });
  },
};

// Vaccines API
export const vaccinesApi = {
  getAll: async () => {
    return apiCall("/hub/vaccines");
  },

  getById: async (id: string) => {
    return apiCall(`/user/vaccines/${id}`);
  },
};

// Centers API
export const centersApi = {
  getAll: async () => {
    return apiCall("/user/centers");
  },

  getById: async (id: string) => {
    return apiCall(`/user/centers/${id}`);
  },

  getNearby: async (division: string, district?: string, upazila?: string) => {
    const params = new URLSearchParams({ division });
    if (district) params.append("district", district);
    if (upazila) params.append("upazila", upazila);
    
    return apiCall(`/hub/centers/`);
  },
};

// Date Slots API
export const dateSlotsApi = {
  getByCenterId: async (centerId: string) => {
    return apiCall(`/date-slots/`);
  },
};

// Time Slots API
export const timeSlotsApi = {
  getByDateSlot: async (dateSlotId: string) => {
    return apiCall(`/user/date-slots/${dateSlotId}/time-slots`);
  },
};

// Appointments API
export const appointmentsApi = {
  getAll: async () => {
    return apiCall("/user/appointments");
  },

  getById: async (id: string) => {
    return apiCall(`/user/appointments/${id}`);
  },

  create: async (appointmentData: {
    centerId: string;
    vaccineId: string;
    dateSlotId: string;
    timeSlotId: string;
    notes?: string;
  }) => {
    return apiCall("/user/appointments", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    });
  },

  cancel: async (id: string, reason?: string) => {
    return apiCall(`/user/appointments/${id}/cancel`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    });
  },
};

// User Profile API
export const userProfileApi = {
  get: async () => {
    return apiCall("/user/profile");
  },

  update: async (profileData: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
  }) => {
    return apiCall("/user/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },
};

// Vaccination History API
export const vaccinationHistoryApi = {
  get: async () => {
    return apiCall("/user/vaccination-history");
  },
};