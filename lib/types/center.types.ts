// Center Profile types
export interface CenterProfile {
  _id?: string;
  id?: string;
  name: string;
  address: string;
  division: string;
  capacity: number;
  staff: number;
  status: 'active' | 'inactive' | 'maintenance';
  contactNumber?: string;
  email?: string;
}

// Stock Request types
export interface StockRequest {
  _id?: string;
  id?: string;
  centerId?: string;
  center?: string;
  vaccineId?: string | { _id: string; name: string };
  vaccine: string;
  quantity: number;
  urgency: 'low' | 'medium' | 'high';
  notes?: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  requestDate?: string;
  approvedDate?: string;
  approvedBy?: string;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Vaccine types
export interface Vaccine {
  _id?: string;
  id?: string;
  name: string;
  manufacturer: string;
  doses: number;
  temperature: string;
  efficacy: string;
  description?: string;
  storageRequirements?: string;
  sideEffects?: string[];
  isActive?: boolean;
}

// Dashboard types
export interface CenterDashboard {
  center: {
    name: string;
    division: string;
    capacity: number;
    staff: number;
    status: string;
  };
  stockRequests: {
    total: number;
    pending: number;
    approved: number;
    fulfilled: number;
  };
  inventory: {
    totalReceived: number;
  };
}

// Date Slot types (for schedule management - to be implemented)
export interface DateSlot {
  _id?: string;
  id?: string;
  date: string;
  capacity: number;
  booked: number;
  status: 'active' | 'closed';
  centerId?: string;
}

// Time Slot types
export interface TimeSlot {
  _id?: string;
  id?: string;
  time: string;
  capacity: number;
  booked: number;
  appointments: number;
  assignedStaff: {
    id: number;
    name: string;
  } | null;
  dateSlotId?: string;
}

// Staff types
export interface Staff {
  _id?: string;
  id?: number;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive';
  centerId?: string;
}

// Form data types
export interface StockRequestFormData {
  vaccine: string;
  quantity: number;
  urgency: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface DateSlotFormData {
  date: string;
  capacity: number;
  status: 'active' | 'closed';
}

export interface StaffFormData {
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

export interface TimeSlotFormData {
  time: string;
  capacity: number;
  booked: number;
  assignedStaffId: number | null;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
