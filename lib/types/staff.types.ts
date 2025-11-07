// Staff types
export interface StaffProfile {
  _id?: string;
  id: string;
  staffId: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  status: string;
  center: {
    _id: string;
    name: string;
    address: string;
  };
  lastLogin?: string;
}

// Appointment types
export interface Appointment {
  _id: string;
  id?: string;
  userId: {
    _id: string;
    nid: string;
    name: string;
    contact: string;
    dob?: string;
    gender?: string;
    b_group?: string;
  };
  centerId: string;
  dateSlotId: {
    _id: string;
    date: string;
  };
  timeSlotId: {
    _id: string;
    time: string;
    capacity: number;
  };
  staffId: string;
  vaccineId: {
    _id: string;
    name: string;
    manufacturer: string;
    temperature?: string;
    description?: string;
  };
  dose: number;
  date: string;
  time: string;
  status: "pending" | "completed" | "no-show" | "cancelled";
  completedAt?: string;
  completedBy?: {
    _id: string;
    name: string;
    staffId: string;
  };
  notes?: string;
  vaccineBatch?: string;
  sideEffects?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Dashboard stats types
export interface StaffDashboard {
  today: {
    total: number;
    completed: number;
    pending: number;
    noShow: number;
  };
  weeklyCompleted: number;
  date: string;
}

// Form data types
export interface CompleteAppointmentData {
  notes?: string;
  vaccineBatch?: string;
  sideEffects?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
