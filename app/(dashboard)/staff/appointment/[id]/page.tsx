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
import { mockAppointments } from "../../page";

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  // Find the appointment from mock data
  const appointment = mockAppointments.find(apt => apt._id === appointmentId);

  // Staff info
  const staffInfo = {
    name: "Dr. Sarah Ahmed",
    role: "Vaccinator",
    center: "Dhaka Medical College Hospital",
    shift: "09:00 AM - 05:00 PM",
  };

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaCalendarCheck className="mx-auto mb-4 text-5xl text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Not Found</h2>
          <p className="text-gray-600 mb-4">The requested appointment could not be found.</p>
          <button
            onClick={() => router.push("/staff")}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = (appointmentId: string, newStatus: "completed" | "no-show") => {
    // Simulate status update (in production, this would update mockAppointments or call an API)
    alert(`Appointment ${appointmentId} marked as ${newStatus}!`);
    router.push("/staff");
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
          <p className="mt-2 text-lg text-gray-600">ID: #{appointment._id}</p>
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
                <h3 className="text-3xl font-bold text-gray-900">{appointment.userId?.name || 'N/A'}</h3>
                <p className="text-lg text-gray-600">Patient</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <FaIdCard />
                  National ID
                </p>
                <p className="text-xl font-semibold text-gray-900">{appointment.userId?.nid || 'N/A'}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <FaPhone />
                  Contact Number
                </p>
                <p className="text-xl font-semibold text-gray-900">{appointment.userId?.contact || 'N/A'}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <FaUser />
                  Email
                </p>
                <p className="text-xl font-semibold text-gray-900">{appointment.userId?.email || 'N/A'}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <FaUser />
                  Age
                </p>
                <p className="text-xl font-semibold text-gray-900">{appointment.userId?.age || 'N/A'} years</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <FaUser />
                  Gender
                </p>
                <p className="text-xl font-semibold text-gray-900">{appointment.userId?.gender || 'N/A'}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <FaUser />
                  Address
                </p>
                <p className="text-xl font-semibold text-gray-900">{appointment.userId?.address || 'N/A'}</p>
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
              <p className="text-2xl font-bold text-blue-900">{appointment.vaccineId?.name || 'N/A'}</p>
              <p className="text-sm text-blue-600 mt-1">Manufacturer: {appointment.vaccineId?.manufacturer || 'N/A'}</p>
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
                <span className="font-mono text-lg font-semibold text-gray-900">#{appointment._id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {appointment.status === "pending" && (
          <div className="space-y-4">
            <button
              onClick={() => handleStatusUpdate(appointment._id, "completed")}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-8 py-6 text-xl font-semibold text-white transition-colors hover:bg-green-700"
            >
              <FaCheckCircle className="text-2xl" />
              Mark Vaccination as Completed
            </button>
            <button
              onClick={() => handleStatusUpdate(appointment._id, "no-show")}
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