// Vaccine types
export interface Vaccine {
  _id?: string;
  id?: number;
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

// Center types
export interface Center {
  _id?: string;
  id?: number;
  name: string;
  address: string;
  division: string;
  capacity: number;
  staff: number;
  status: 'active' | 'inactive' | 'maintenance';
  password?: string;
  contactNumber?: string;
  email?: string;
}

// Stock Request types
export interface StockRequest {
  _id?: string;
  id?: number;
  center: string;
  centerId?: string;
  vaccine: string;
  vaccineId?: string;
  quantity: number;
  requested: string;
  requestDate?: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  urgency?: 'low' | 'medium' | 'high';
  notes?: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

// Vaccine Movement types
export interface VaccineMovement {
  _id?: string;
  id?: number;
  from: string;
  to: string;
  vaccine: string;
  vaccineId?: string;
  quantity: number;
  date: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: string;
}

// Analytics types
export interface Analytics {
  totalVaccinated: number;
  totalStocks: number;
  wastage: number;
  coverage: number;
  totalCenters?: number;
  activeCenters?: number;
  pendingRequests?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Form data types
export interface VaccineFormData {
  name: string;
  manufacturer: string;
  doses: number;
  temperature: string;
  efficacy: string;
  description?: string;
}

export interface CenterFormData {
  name: string;
  address: string;
  division: string;
  capacity: number;
  staff: number;
  status: 'active' | 'inactive' | 'maintenance';
  password: string;
  contactNumber?: string;
  email?: string;
}

export interface ApprovalData {
  approvedQuantity?: number;
  notes?: string;
  estimatedDelivery?: string;
}

export interface RejectionData {
  reason: string;
  notes?: string;
}
