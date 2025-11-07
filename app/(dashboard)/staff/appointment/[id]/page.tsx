"use client";

import { useParams, useRouter } from "next/navigation";
import {
  FaCalendarCheck,
  FaCheckCircle,
  FaUser,
  FaSyringe,
  FaClock,
  FaSignOutAlt,
  FaUserCircle,
  FaIdCard,
  FaPhone,
  FaArrowLeft,
} from "react-icons/fa";

interface Appointment {
  id: number;
  patientName: string;
  nid: string;
  contact: string;
  vaccine: string;
  dose: number;
  time: string;
  date: string;
  status: "pending" | "completed" | "no-show";
}

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = parseInt(params.id as string);

  // Mock data - in real app, this would be fetched based on the ID
  const staffInfo = {
    name: "Dr. Kamal Ahmed",
    role: "Vaccinator",
    center: "Dhaka Medical College Center",
    shift: "09:00 AM - 04:00 PM",
  };

  const appointments: Appointment[] = [
    {
      id: 1,
      patientName: "Rahima Begum",
      nid: "1234567890123",
      contact: "+8801712345678",
      vaccine: "Pfizer-BioNTech",
      dose: 1,
      time: "09:15 AM",
      date: "2024-11-08",
      status: "completed",
    },
    {
      id: 2,
      patientName: "Abdul Karim",
      nid: "2345678901234",
      contact: "+8801812345679",
      vaccine: "Moderna",
      dose: 2,
      time: "09:30 AM",
      date: "2024-11-08",
      status: "completed",
    },
    {
      id: 3,
      patientName: "Fatima Akter",
      nid: "3456789012345",
      contact: "+8801912345680",
      vaccine: "Pfizer-BioNTech",
      dose: 1,
      time: "09:45 AM",
      date: "2024-11-08",
      status: "pending",
    },
    {
      id: 4,
      patientName: "Mohammad Hasan",
      nid: "4567890123456",
      contact: "+8801612345681",
      vaccine: "AstraZeneca",
      dose: 1,
      time: "10:00 AM",
      date: "2024-11-08",
      status: "pending",
    },
    {
      id: 5,
      patientName: "Nasrin Sultana",
      nid: "5678901234567",
      contact: "+8801512345682",
      vaccine: "Moderna",
      dose: 2,
      time: "10:15 AM",
      date: "2024-11-08",
      status: "pending",
    },
    {
      id: 6,
      patientName: "Khaled Ahmed",
      nid: "6789012345678",
      contact: "+8801712345683",
      vaccine: "Pfizer-BioNTech",
      dose: 2,
      time: "10:30 AM",
      date: "2024-11-08",
      status: "pending",
    },
    {
      id: 7,
      patientName: "Sharmin Islam",
      nid: "7890123456789",
      contact: "+8801812345684",
      vaccine: "AstraZeneca",
      dose: 1,
      time: "10:45 AM",
      date: "2024-11-08",
      status: "pending",
    },
  ];

  const appointment = appointments.find(apt => apt.id === appointmentId);

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="border-b border-gray-200 bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600">
                  <FaSyringe className="text-xl text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">Staff Portal</span>
                  <p className="text-xs text-gray-500">{staffInfo.center}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium text-gray-900">{staffInfo.name}</p>
                  <p className="text-xs text-gray-500">
                    {staffInfo.role} • {staffInfo.shift}
                  </p>
                </div>
                <FaUserCircle className="text-3xl text-gray-600" />
                <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Appointment Not Found</h1>
            <p className="mt-2 text-gray-600">The appointment you&apos;re looking for doesn&apos;t exist.</p>
            <button
              onClick={() => router.push('/staff')}
              className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Back to Appointments
            </button>
          </div>
        </div>
      </div>
    );
  }

  const markAsCompleted = (id: number) => {
    // In real app, this would update the backend
    alert(`Appointment #${id} marked as completed!`);
    router.push('/staff');
  };

  const markAsNoShow = (id: number) => {
    // In real app, this would update the backend
    alert(`Appointment #${id} marked as no-show!`);
    router.push('/staff');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600">
                <FaSyringe className="text-xl text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Staff Portal</span>
                <p className="text-xs text-gray-500">{staffInfo.center}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">{staffInfo.name}</p>
                <p className="text-xs text-gray-500">
                  {staffInfo.role} • {staffInfo.shift}
                </p>
              </div>
              <FaUserCircle className="text-3xl text-gray-600" />
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/staff')}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <FaArrowLeft />
            Back to Appointments
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Appointment Details</h1>
          <p className="mt-2 text-lg text-gray-600">ID: #{appointment.id}</p>
        </div>

        {/* Status Banner */}
        <div
          className={`mb-8 rounded-xl p-6 ${
            appointment.status === "completed"
              ? "bg-green-100"
              : appointment.status === "no-show"
                ? "bg-red-100"
                : "bg-yellow-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-2xl font-bold ${
                appointment.status === "completed"
                  ? "text-green-900"
                  : appointment.status === "no-show"
                    ? "text-red-900"
                    : "text-yellow-900"
              }`}
            >
              Status: {appointment.status === "pending" ? "Pending Vaccination" : appointment.status === "completed" ? "Completed" : "No Show"}
            </span>
            <span
              className={`rounded-full px-6 py-3 text-lg font-semibold ${
                appointment.status === "completed"
                  ? "bg-green-600 text-white"
                  : appointment.status === "no-show"
                    ? "bg-red-600 text-white"
                    : "bg-yellow-500 text-white"
              }`}
            >
              {appointment.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Patient Information */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Patient Information</h2>
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                <FaUser className="text-4xl text-gray-700" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{appointment.patientName}</h3>
                <p className="text-lg text-gray-600">Patient</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <FaIdCard />
                  National ID
                </p>
                <p className="text-xl font-semibold text-gray-900">{appointment.nid}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <FaPhone />
                  Contact Number
                </p>
                <p className="text-xl font-semibold text-gray-900">{appointment.contact}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vaccination Details */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Vaccination Details</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
              <p className="mb-3 flex items-center gap-2 text-lg font-medium text-blue-700">
                <FaSyringe />
                Vaccine
              </p>
              <p className="text-2xl font-bold text-blue-900">{appointment.vaccine}</p>
            </div>
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
              <p className="mb-3 text-lg font-medium text-purple-700">Dose Number</p>
              <p className="text-2xl font-bold text-purple-900">Dose {appointment.dose}</p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 p-6">
              <p className="mb-3 flex items-center gap-2 text-lg font-medium text-green-700">
                <FaCalendarCheck />
                Date
              </p>
              <p className="text-2xl font-bold text-green-900">{appointment.date}</p>
            </div>
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
              <p className="mb-3 flex items-center gap-2 text-lg font-medium text-orange-700">
                <FaClock />
                Time
              </p>
              <p className="text-2xl font-bold text-orange-900">{appointment.time}</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Additional Information</h2>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-lg text-gray-600">Center:</span>
                <span className="text-lg font-semibold text-gray-900">{staffInfo.center}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg text-gray-600">Assigned Staff:</span>
                <span className="text-lg font-semibold text-gray-900">{staffInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg text-gray-600">Appointment ID:</span>
                <span className="font-mono text-lg font-semibold text-gray-900">#{appointment.id.toString().padStart(6, '0')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {appointment.status === "pending" && (
          <div className="space-y-4">
            <button
              onClick={() => markAsCompleted(appointment.id)}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-8 py-6 text-xl font-semibold text-white transition-colors hover:bg-green-700"
            >
              <FaCheckCircle className="text-2xl" />
              Mark Vaccination as Completed
            </button>
            <button
              onClick={() => markAsNoShow(appointment.id)}
              className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-red-300 bg-white px-8 py-6 text-xl font-semibold text-red-700 transition-colors hover:bg-red-50"
            >
              Mark as No-Show
            </button>
          </div>
        )}

        {appointment.status === "completed" && (
          <div className="rounded-xl bg-green-100 p-8 text-center">
            <FaCheckCircle className="mx-auto mb-4 text-6xl text-green-600" />
            <p className="text-xl font-semibold text-green-900">This vaccination has been completed</p>
          </div>
        )}

        {appointment.status === "no-show" && (
          <div className="rounded-xl bg-red-100 p-8 text-center">
            <p className="text-xl font-semibold text-red-900">Patient did not show up for this appointment</p>
          </div>
        )}
      </div>
    </div>
  );
}