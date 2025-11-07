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

export default function StaffDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed" | "no-show">("all");
  const [sortBy, setSortBy] = useState<"time" | "name">("time");

  // Mock data
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

  // Filter and sort appointments
  const filteredAppointments = appointments
    .filter((apt) => {
      if (filterStatus !== "all" && apt.status !== filterStatus) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          apt.patientName.toLowerCase().includes(query) ||
          apt.nid.includes(query) ||
          apt.contact.includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "time") {
        return a.time.localeCompare(b.time);
      } else {
        return a.patientName.localeCompare(b.patientName);
      }
    });

  const stats = {
    total: appointments.length,
    completed: appointments.filter((a) => a.status === "completed").length,
    pending: appointments.filter((a) => a.status === "pending").length,
    noShow: appointments.filter((a) => a.status === "no-show").length,
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
                  key={appointment.id}
                  onClick={() => router.push(`/staff/appointment/${appointment.id}`)}
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
                              {appointment.patientName}
                            </h3>
                            <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <FaIdCard className="text-gray-500" />
                                {appointment.nid}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaPhone className="text-gray-500" />
                                {appointment.contact}
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
                              {appointment.vaccine}
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
      </div>
    </div>
  );
}
