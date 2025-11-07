// Mock Data Store for Protirodh MVP

import {
  Citizen,
  Appointment,
  VaccinationCenter,
  DashboardStats,
  WastageReport,
  SupplyChainRecord,
} from "./types";

export const mockCitizens: Citizen[] = [
  {
    id: "C001",
    name: "Rahim Ahmed",
    nid: "1234567890123",
    dateOfBirth: "1990-05-15",
    phone: "+8801712345678",
    email: "rahim@example.com",
    address: "123 Mirpur Road, Dhaka",
    division: "Dhaka",
    district: "Dhaka",
    registeredAt: "2024-01-15T10:00:00Z",
    vaccinations: [
      {
        id: "V001",
        citizenId: "C001",
        vaccineType: "Pfizer-BioNTech",
        doseNumber: 1,
        vaccinationDate: "2024-02-01",
        centerId: "VC001",
        centerName: "Dhaka Medical College Vaccination Center",
        batchNumber: "PF2024-001",
        verificationCode: "QR-V001-2024",
      },
      {
        id: "V002",
        citizenId: "C001",
        vaccineType: "Pfizer-BioNTech",
        doseNumber: 2,
        vaccinationDate: "2024-03-15",
        centerId: "VC001",
        centerName: "Dhaka Medical College Vaccination Center",
        batchNumber: "PF2024-002",
        verificationCode: "QR-V002-2024",
      },
    ],
  },
  {
    id: "C002",
    name: "Fatema Begum",
    nid: "9876543210987",
    dateOfBirth: "1985-08-22",
    phone: "+8801823456789",
    address: "45 Agrabad, Chittagong",
    division: "Chittagong",
    district: "Chittagong",
    registeredAt: "2024-01-20T14:30:00Z",
    vaccinations: [
      {
        id: "V003",
        citizenId: "C002",
        vaccineType: "Moderna",
        doseNumber: 1,
        vaccinationDate: "2024-02-10",
        centerId: "VC002",
        centerName: "Chittagong Medical College Center",
        batchNumber: "MD2024-001",
        verificationCode: "QR-V003-2024",
      },
    ],
  },
];

export const mockVaccinationCenters: VaccinationCenter[] = [
  {
    id: "VC001",
    name: "Dhaka Medical College Vaccination Center",
    address: "Bakshibazar, Dhaka-1000",
    division: "Dhaka",
    district: "Dhaka",
    phone: "+8802-9668690",
    dailyCapacity: 500,
    operatingHours: "9:00 AM - 5:00 PM",
    staff: [
      {
        id: "S001",
        name: "Dr. Kamal Hossain",
        role: "doctor",
        phone: "+8801712345001",
      },
      {
        id: "S002",
        name: "Nurse Ayesha Rahman",
        role: "nurse",
        phone: "+8801712345002",
      },
      {
        id: "S003",
        name: "Abdul Jabbar",
        role: "administrator",
        phone: "+8801712345003",
      },
    ],
    vaccineStock: [
      {
        vaccineType: "Pfizer-BioNTech",
        totalDoses: 5000,
        usedDoses: 3200,
        remainingDoses: 1750,
        wastedDoses: 50,
        expiryDate: "2025-06-30",
        lastUpdated: "2024-11-07T08:00:00Z",
      },
      {
        vaccineType: "Moderna",
        totalDoses: 3000,
        usedDoses: 1800,
        remainingDoses: 1180,
        wastedDoses: 20,
        expiryDate: "2025-08-15",
        lastUpdated: "2024-11-07T08:00:00Z",
      },
      {
        vaccineType: "AstraZeneca",
        totalDoses: 2000,
        usedDoses: 1500,
        remainingDoses: 480,
        wastedDoses: 20,
        expiryDate: "2025-04-30",
        lastUpdated: "2024-11-07T08:00:00Z",
      },
    ],
  },
  {
    id: "VC002",
    name: "Chittagong Medical College Center",
    address: "K.B. Fazlul Kader Road, Chittagong",
    division: "Chittagong",
    district: "Chittagong",
    phone: "+8801812345678",
    dailyCapacity: 400,
    operatingHours: "9:00 AM - 5:00 PM",
    staff: [
      {
        id: "S004",
        name: "Dr. Nasrin Akter",
        role: "doctor",
        phone: "+8801812345004",
      },
      {
        id: "S005",
        name: "Nurse Jahura Khatun",
        role: "nurse",
        phone: "+8801812345005",
      },
    ],
    vaccineStock: [
      {
        vaccineType: "Moderna",
        totalDoses: 4000,
        usedDoses: 2100,
        remainingDoses: 1850,
        wastedDoses: 50,
        expiryDate: "2025-07-20",
        lastUpdated: "2024-11-07T08:00:00Z",
      },
      {
        vaccineType: "Sinopharm",
        totalDoses: 3000,
        usedDoses: 2200,
        remainingDoses: 780,
        wastedDoses: 20,
        expiryDate: "2025-05-30",
        lastUpdated: "2024-11-07T08:00:00Z",
      },
    ],
  },
  {
    id: "VC003",
    name: "Rajshahi Medical College Center",
    address: "Laxmipur, Rajshahi",
    division: "Rajshahi",
    district: "Rajshahi",
    phone: "+8801712345100",
    dailyCapacity: 300,
    operatingHours: "9:00 AM - 5:00 PM",
    staff: [
      {
        id: "S006",
        name: "Dr. Shahidul Islam",
        role: "doctor",
        phone: "+8801712345006",
      },
    ],
    vaccineStock: [
      {
        vaccineType: "AstraZeneca",
        totalDoses: 2500,
        usedDoses: 1600,
        remainingDoses: 880,
        wastedDoses: 20,
        expiryDate: "2025-03-30",
        lastUpdated: "2024-11-07T08:00:00Z",
      },
    ],
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "A001",
    citizenId: "C001",
    citizenName: "Rahim Ahmed",
    centerId: "VC001",
    centerName: "Dhaka Medical College Vaccination Center",
    vaccineType: "Pfizer-BioNTech",
    doseNumber: "booster",
    scheduledDate: "2024-11-15",
    timeSlot: "10:00 AM - 11:00 AM",
    status: "scheduled",
    createdAt: "2024-11-05T10:00:00Z",
  },
  {
    id: "A002",
    citizenId: "C002",
    citizenName: "Fatema Begum",
    centerId: "VC002",
    centerName: "Chittagong Medical College Center",
    vaccineType: "Moderna",
    doseNumber: 2,
    scheduledDate: "2024-11-10",
    timeSlot: "2:00 PM - 3:00 PM",
    status: "scheduled",
    createdAt: "2024-11-03T14:30:00Z",
  },
  {
    id: "A003",
    citizenId: "C003",
    citizenName: "Karim Mia",
    centerId: "VC001",
    centerName: "Dhaka Medical College Vaccination Center",
    vaccineType: "AstraZeneca",
    doseNumber: 1,
    scheduledDate: "2024-11-08",
    timeSlot: "11:00 AM - 12:00 PM",
    status: "completed",
    createdAt: "2024-10-28T09:00:00Z",
  },
];

export const mockDashboardStats: DashboardStats = {
  totalVaccinations: 12500,
  totalCitizensRegistered: 8900,
  totalCenters: 3,
  vaccinationRate: 78.5,
  todayAppointments: 45,
  completedToday: 32,
  stockAlerts: 2,
};

export const mockWastageReports: WastageReport[] = [
  {
    centerId: "VC001",
    centerName: "Dhaka Medical College Vaccination Center",
    vaccineType: "Pfizer-BioNTech",
    wastedDoses: 50,
    reason: "Vial breakage during handling",
    date: "2024-11-05",
  },
  {
    centerId: "VC002",
    centerName: "Chittagong Medical College Center",
    vaccineType: "Moderna",
    wastedDoses: 50,
    reason: "Power outage - cold chain breach",
    date: "2024-11-03",
  },
];

export const mockSupplyChain: SupplyChainRecord[] = [
  {
    id: "SC001",
    vaccineType: "Pfizer-BioNTech",
    quantity: 2000,
    fromLocation: "National Vaccine Storage - Dhaka",
    toLocation: "Dhaka Medical College Vaccination Center",
    shippedDate: "2024-11-01",
    receivedDate: "2024-11-01",
    status: "delivered",
    batchNumber: "PF2024-005",
  },
  {
    id: "SC002",
    vaccineType: "Moderna",
    quantity: 1500,
    fromLocation: "National Vaccine Storage - Dhaka",
    toLocation: "Chittagong Medical College Center",
    shippedDate: "2024-11-05",
    status: "in-transit",
    batchNumber: "MD2024-008",
  },
];

// Helper functions to simulate data operations
export const getCitizenById = (id: string) => 
  mockCitizens.find((c) => c.id === id);

export const getCenterById = (id: string) => 
  mockVaccinationCenters.find((c) => c.id === id);

export const getAppointmentsByCitizen = (citizenId: string) =>
  mockAppointments.filter((a) => a.citizenId === citizenId);

export const getAppointmentsByCenter = (centerId: string) =>
  mockAppointments.filter((a) => a.centerId === centerId);

export const getTodayAppointments = () => {
  const today = new Date().toISOString().split("T")[0];
  return mockAppointments.filter((a) => a.scheduledDate === today);
};
