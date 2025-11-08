"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaCalendarCheck,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaUser,
  FaSyringe,
  FaClock,
  FaSignOutAlt,
  FaUserCircle,
  FaIdCard,
  FaPhone,
  FaSort,
} from "react-icons/fa";
import { useGlobal } from "@/app/context/GlobalContext";

// Mock data for appointments
const mockAppointments = [
  {
    _id: "1",
    userId: {
      uid: "user1",
      name: "Ahmed Hassan",
      nid: "1234567890123",
      contact: "+880 1712-345678",
      email: "ahmed.hassan@email.com",
      age: 35,
      gender: "Male",
      address: "123 Mirpur Road, Dhaka-1216",
    },
    vaccineId: {
      _id: "v1",
      name: "Pfizer-BioNTech",
      manufacturer: "Pfizer Inc.",
    },
    centerId: "c1",
    dateSlotId: "ds1",
    timeSlotId: "ts1",
    dose: 1,
    date: "2024-11-08",
    time: "09:00",
    status: "pending" as const,
    notes: "First dose. Patient has no known allergies.",
    createdAt: "2024-11-07T10:00:00Z",
  },
  {
    _id: "2",
    userId: {
      uid: "user2",
      name: "Fatima Rahman",
      nid: "9876543210987",
      contact: "+880 1812-987654",
      email: "fatima.rahman@email.com",
      age: 28,
      gender: "Female",
      address: "45 Dhanmondi, Dhaka-1209",
    },
    vaccineId: {
      _id: "v2",
      name: "Moderna",
      manufacturer: "Moderna Inc.",
    },
    centerId: "c1",
    dateSlotId: "ds1",
    timeSlotId: "ts2",
    dose: 2,
    date: "2024-11-08",
    time: "10:30",
    status: "completed" as const,
    notes: "Second dose completed successfully.",
    completedAt: "2024-11-08T10:45:00Z",
    createdAt: "2024-11-07T11:00:00Z",
  },
  {
    _id: "3",
    userId: {
      uid: "user3",
      name: "Mohammad Ali",
      nid: "5555666677778",
      contact: "+880 1912-555666",
      email: "mohammad.ali@email.com",
      age: 42,
      gender: "Male",
      address: "78 Gulshan Avenue, Dhaka-1212",
    },
    vaccineId: {
      _id: "v3",
      name: "AstraZeneca",
      manufacturer: "AstraZeneca",
    },
    centerId: "c1",
    dateSlotId: "ds1",
    timeSlotId: "ts3",
    dose: 1,
    date: "2024-11-08",
    time: "11:00",
    status: "pending" as const,
    notes: "Patient requested morning slot.",
    createdAt: "2024-11-07T09:30:00Z",
  },
  {
    _id: "4",
    userId: {
      uid: "user4",
      name: "Ayesha Siddique",
      nid: "1111222233334",
      contact: "+880 1712-111222",
      email: "ayesha.siddique@email.com",
      age: 31,
      gender: "Female",
      address: "22 Banani, Dhaka-1213",
    },
    vaccineId: {
      _id: "v1",
      name: "Pfizer-BioNTech",
      manufacturer: "Pfizer Inc.",
    },
    centerId: "c1",
    dateSlotId: "ds1",
    timeSlotId: "ts4",
    dose: 2,
    date: "2024-11-08",
    time: "14:00",
    status: "pending" as const,
    notes: "Completing second dose. No adverse reactions from first dose.",
    createdAt: "2024-11-07T14:00:00Z",
  },
  {
    _id: "5",
    userId: {
      uid: "user5",
      name: "Karim Hossain",
      nid: "4444555566667",
      contact: "+880 1612-444555",
      email: "karim.hossain@email.com",
      age: 55,
      gender: "Male",
      address: "90 Uttara, Dhaka-1230",
    },
    vaccineId: {
      _id: "v2",
      name: "Moderna",
      manufacturer: "Moderna Inc.",
    },
    centerId: "c1",
    dateSlotId: "ds1",
    timeSlotId: "ts5",
    dose: 1,
    date: "2024-11-08",
    time: "15:30",
    status: "no-show" as const,
    notes: "Patient did not arrive for scheduled appointment.",
    createdAt: "2024-11-07T12:00:00Z",
  },
  {
    _id: "6",
    userId: {
      uid: "user6",
      name: "Nadia Islam",
      nid: "7777888899990",
      contact: "+880 1812-777888",
      email: "nadia.islam@email.com",
      age: 26,
      gender: "Female",
      address: "34 Mohammadpur, Dhaka-1207",
    },
    vaccineId: {
      _id: "v3",
      name: "AstraZeneca",
      manufacturer: "AstraZeneca",
    },
    centerId: "c1",
    dateSlotId: "ds1",
    timeSlotId: "ts6",
    dose: 1,
    date: "2024-11-08",
    time: "16:00",
    status: "completed" as const,
    notes: "First dose administered. Patient tolerated well.",
    completedAt: "2024-11-08T16:15:00Z",
    createdAt: "2024-11-07T15:00:00Z",
  },
];

// Export for use in other components
export { mockAppointments };

export default function StaffDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed" | "no-show">("all");
  const [sortBy, setSortBy] = useState<"time" | "name">("time");

  const {logout, user} = useGlobal();

  // Use mock data
  const appointments = mockAppointments;

  // Staff info from user context or defaults
  const staffInfo = {
    name: user?.name || "Dr. Sarah Ahmed",
    role: "Vaccinator",
    center: "Dhaka Medical College Hospital",
    shift: "09:00 AM - 05:00 PM",
  };

  // Calculate stats from mock data
  const stats = {
    total: appointments.length,
    completed: appointments.filter(a => a.status === "completed").length,
    pending: appointments.filter(a => a.status === "pending").length,
    noShow: appointments.filter(a => a.status === "no-show").length,
  };

  // Filter and sort appointments locally
  const filteredAppointments = appointments
    .filter((apt) => {
      // Filter by status
      if (filterStatus !== "all" && apt.status !== filterStatus) {
        return false;
      }
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          apt.userId?.name?.toLowerCase().includes(query) ||
          apt.userId?.nid?.includes(query) ||
          apt.userId?.contact?.includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "time") {
        return a.time.localeCompare(b.time);
      } else {
        return (a.userId?.name || "").localeCompare(b.userId?.name || "");
      }
    });

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
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50" onClick={()=>logout()}>
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Content */}
        <>
        {/* Stats Overview */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">Total Assigned</span>
              <FaCalendarCheck className="text-2xl text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            <p className="mt-1 text-xs text-blue-600">Today&apos;s appointments</p>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">Completed</span>
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
            <p className="mt-1 text-xs text-green-600">Vaccinations done</p>
          </div>

          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-yellow-700">Pending</span>
              <FaClock className="text-2xl text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
            <p className="mt-1 text-xs text-yellow-600">Awaiting vaccination</p>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-red-700">No-Show</span>
              <FaUser className="text-2xl text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-900">{stats.noShow}</p>
            <p className="mt-1 text-xs text-red-600">Missed appointments</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, NID, or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="no-show">No-Show</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <FaSort className="text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                <option value="time">Sort by Time</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Appointments ({filteredAppointments.length})
          </h2>
          {filteredAppointments.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <FaCalendarCheck className="mx-auto mb-4 text-5xl text-gray-400" />
              <p className="text-lg font-medium text-gray-600">No appointments found</p>
              <p className="mt-2 text-sm text-gray-500">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "You have no appointments for today"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  onClick={() => router.push(`/staff/appointment/${appointment._id}`)}
                  className={`cursor-pointer rounded-xl border p-6 shadow-sm transition-all ${
                    appointment.status === "completed"
                      ? "border-green-200 bg-green-50 hover:border-green-300"
                      : appointment.status === "no-show"
                        ? "border-red-200 bg-red-50 hover:border-red-300"
                        : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-1 items-start gap-4">
                      {/* Avatar */}
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-full ${
                          appointment.status === "completed"
                            ? "bg-green-200"
                            : appointment.status === "no-show"
                              ? "bg-red-200"
                              : "bg-gray-200"
                        }`}
                      >
                        <FaUser className="text-2xl text-gray-700" />
                      </div>

                      {/* Patient Info */}
                      <div className="flex-1">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {appointment.userId?.name || "Unknown Patient"}
                            </h3>
                            <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <FaIdCard className="text-gray-500" />
                                {appointment.userId?.nid || "N/A"}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaPhone className="text-gray-500" />
                                {appointment.userId?.contact || "N/A"}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              appointment.status === "completed"
                                ? "bg-green-600 text-white"
                                : appointment.status === "no-show"
                                  ? "bg-red-600 text-white"
                                  : "bg-yellow-500 text-white"
                            }`}
                          >
                            {appointment.status === "pending"
                              ? "Pending"
                              : appointment.status === "completed"
                                ? "Completed"
                                : "No Show"}
                          </span>
                        </div>

                        {/* Appointment Details */}
                        <div className="grid gap-4 md:grid-cols-4">
                          <div className="rounded-lg bg-white p-3">
                            <p className="mb-1 text-xs text-gray-500">Vaccine</p>
                            <p className="flex items-center gap-1 font-semibold text-gray-900">
                              <FaSyringe className="text-green-600" />
                              {appointment.vaccineId?.name || "Unknown"}
                            </p>
                          </div>
                          <div className="rounded-lg bg-white p-3">
                            <p className="mb-1 text-xs text-gray-500">Dose Number</p>
                            <p className="font-semibold text-gray-900">Dose {appointment.dose}</p>
                          </div>
                          <div className="rounded-lg bg-white p-3">
                            <p className="mb-1 text-xs text-gray-500">Date</p>
                            <p className="font-semibold text-gray-900">{appointment.date}</p>
                          </div>
                          <div className="rounded-lg bg-white p-3">
                            <p className="mb-1 text-xs text-gray-500">Time</p>
                            <p className="flex items-center gap-1 font-semibold text-gray-900">
                              <FaClock className="text-blue-600" />
                              {appointment.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge - Navigate to detail page */}
                    <div className="ml-4">
                      <div className="text-sm text-gray-500">Click to view details →</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
      </div>
    </div>
  );
}
