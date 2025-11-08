// User-related types for the portal

export interface User {
  _id: string;
  nid: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  division: string;
  district: string;
  upazila: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vaccine {
  _id: string;
  name: string;
  manufacturer: string;
  doses: number;
  temperature: string;
  efficacy: string;
  description?: string;
  isActive: boolean;
}

export interface Center {
  _id: string;
  name: string;
  address: string;
  division: string;
  district: string;
  upazila: string;
  capacity: number;
  contactNumber?: string;
  email?: string;
  status: "active" | "inactive" | "maintenance";
}

export interface DateSlot {
  _id: string;
  centerId: string;
  date: string;
  capacity: number;
  booked: number;
  status: "active" | "closed";
  availableSlots: number;
}

export interface TimeSlot {
  _id: string;
  dateSlotId: string;
  time: string;
  capacity: number;
  booked: number;
  available: boolean;
  assignedStaff?: {
    _id: string;
    name: string;
    role: string;
  };
}

export interface Appointment {
  _id: string;
  userId: string;
  centerId: string;
  vaccineId: string;
  dateSlotId: string;
  timeSlotId: string;
  dose: number;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  center?: {
    name: string;
    address: string;
  };
  vaccine?: {
    name: string;
    manufacturer: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VaccinationRecord {
  _id: string;
  userId: string;
  appointmentId: string;
  vaccineId: string;
  dose: number;
  vaccinationDate: string;
  centerId: string;
  staffId: string;
  batchNumber?: string;
  certificateId?: string;
  vaccine?: {
    name: string;
    manufacturer: string;
  };
  center?: {
    name: string;
    address: string;
  };
  staff?: {
    name: string;
    role: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Form data interfaces
export interface AppointmentFormData {
  vaccineId: string;
  centerId: string;
  dateSlotId: string;
  timeSlotId: string;
  notes?: string;
}

export interface UserRegistrationData {
  nid: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  division: string;
  district: string;
  upazila: string;
  password: string;
}