// Core Data Types for Protirodh Vaccination Management System

export type VaccineType = 
  | "Pfizer-BioNTech" 
  | "Moderna" 
  | "AstraZeneca" 
  | "Sinopharm" 
  | "Sinovac";

export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "missed";

export type DoseNumber = 1 | 2 | 3 | "booster";

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";

export type Gender = "Male" | "Female" | "Other";

// Onboarding Data Structure
export interface OnboardingData {
  uid: string;
  nid: string;
  b_group?: BloodGroup;
  gender: Gender;
  name: string;
  dob: string;
  f_name: string;
  m_name: string;
  contact: {
    division?: string;
    zila?: string;
    upzila?: string;
    village?: string;
    house?: string;
  };
}

export interface Citizen {
  id: string;
  name: string;
  nid?: string; // National ID
  birthCertificate?: string;
  dateOfBirth: string;
  phone: string;
  email?: string;
  address: string;
  division: string;
  district: string;
  registeredAt: string;
  vaccinations: VaccinationRecord[];
}

export interface VaccinationRecord {
  id: string;
  citizenId: string;
  vaccineType: VaccineType;
  doseNumber: DoseNumber;
  vaccinationDate: string;
  centerId: string;
  centerName: string;
  batchNumber: string;
  verificationCode: string; // For QR code
}

export interface Appointment {
  id: string;
  citizenId: string;
  citizenName: string;
  centerId: string;
  centerName: string;
  vaccineType: VaccineType;
  doseNumber: DoseNumber;
  scheduledDate: string;
  timeSlot: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface VaccinationCenter {
  id: string;
  name: string;
  address: string;
  division: string;
  district: string;
  phone: string;
  dailyCapacity: number;
  staff: StaffMember[];
  vaccineStock: VaccineStock[];
  operatingHours: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: "doctor" | "nurse" | "administrator";
  phone: string;
}

export interface VaccineStock {
  vaccineType: VaccineType;
  totalDoses: number;
  usedDoses: number;
  remainingDoses: number;
  wastedDoses: number;
  expiryDate: string;
  lastUpdated: string;
}

export interface SupplyChainRecord {
  id: string;
  vaccineType: VaccineType;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  shippedDate: string;
  receivedDate?: string;
  status: "in-transit" | "delivered" | "delayed";
  batchNumber: string;
}

export interface DashboardStats {
  totalVaccinations: number;
  totalCitizensRegistered: number;
  totalCenters: number;
  vaccinationRate: number; // percentage
  todayAppointments: number;
  completedToday: number;
  stockAlerts: number;
}

export interface WastageReport {
  centerId: string;
  centerName: string;
  vaccineType: VaccineType;
  wastedDoses: number;
  reason: string;
  date: string;
}

export interface AnalyticsData {
  coverageByDivision: Record<string, number>;
  vaccineTypeDistribution: Record<VaccineType, number>;
  dailyVaccinations: { date: string; count: number }[];
  ageGroupDistribution: Record<string, number>;
}
