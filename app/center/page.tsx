"use client";

import { useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaBoxes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
  FaUserCircle,
  FaThermometerHalf,
  FaBook,
} from "react-icons/fa";

export default function CenterDashboard() {
  const [activeTab, setActiveTab] = useState<"schedule" | "staff" | "stock" | "guidelines">("schedule");
  const [selectedDate, setSelectedDate] = useState("2024-11-08");

  // Mock data
  const centerInfo = {
    name: "Dhaka Medical College Center",
    address: "Bakshibazar, Dhaka-1000",
    dailyCapacity: 500,
    staffCount: 12,
  };

  const stockData = {
    vaccines: [
      { name: "Pfizer-BioNTech", total: 2000, used: 1200, remaining: 750, wasted: 50, temp: "-70°C" },
      { name: "Moderna", total: 1500, used: 900, remaining: 580, wasted: 20, temp: "-20°C" },
      { name: "AstraZeneca", total: 1000, used: 600, remaining: 390, wasted: 10, temp: "2-8°C" },
    ],
  };

  const dateSlots = [
    { date: "2024-11-08", capacity: 500, booked: 380, status: "active" },
    { date: "2024-11-09", capacity: 500, booked: 420, status: "active" },
    { date: "2024-11-10", capacity: 500, booked: 150, status: "active" },
    { date: "2024-11-11", capacity: 0, booked: 0, status: "closed" },
  ];

  const timeSlots = [
    { time: "09:00 AM - 10:00 AM", capacity: 50, booked: 45, appointments: 45 },
    { time: "10:00 AM - 11:00 AM", capacity: 50, booked: 48, appointments: 48 },
    { time: "11:00 AM - 12:00 PM", capacity: 50, booked: 42, appointments: 42 },
    { time: "12:00 PM - 01:00 PM", capacity: 50, booked: 35, appointments: 35 },
    { time: "02:00 PM - 03:00 PM", capacity: 50, booked: 40, appointments: 40 },
    { time: "03:00 PM - 04:00 PM", capacity: 50, booked: 38, appointments: 38 },
  ];

  const staffMembers = [
    { id: 1, name: "Dr. Kamal Ahmed", role: "Vaccinator", assigned: 45, completed: 40, status: "active" },
    { id: 2, name: "Nurse Fatima Khan", role: "Vaccinator", assigned: 48, completed: 48, status: "active" },
    { id: 3, name: "Dr. Rahman", role: "Vaccinator", assigned: 42, completed: 38, status: "active" },
    { id: 4, name: "Nurse Sultana", role: "Vaccinator", assigned: 35, completed: 32, status: "active" },
  ];

  const preservationGuidelines = [
    {
      vaccine: "Pfizer-BioNTech",
      storage: "-70°C ± 10°C",
      thawedStability: "5 days at 2-8°C",
      roomTemp: "2 hours at room temperature",
      handling: "Do not refreeze once thawed. Gently invert 10 times, do not shake.",
    },
    {
      vaccine: "Moderna",
      storage: "-20°C ± 5°C",
      thawedStability: "30 days at 2-8°C",
      roomTemp: "12 hours at room temperature",
      handling: "Do not refreeze. Swirl gently, do not shake.",
    },
    {
      vaccine: "AstraZeneca",
      storage: "2-8°C",
      thawedStability: "6 months at 2-8°C",
      roomTemp: "6 hours at room temperature",
      handling: "Store upright. Gently invert, do not shake.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600">
                <FaUsers className="text-xl text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">{centerInfo.name}</span>
                <p className="text-xs text-gray-500">Center Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-2xl text-gray-600" />
                <span className="font-medium text-gray-900">Center Admin</span>
              </div>
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
          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">Daily Capacity</span>
              <FaUsers className="text-2xl text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900">{centerInfo.dailyCapacity}</p>
            <p className="mt-1 text-xs text-green-600">Per day</p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">Total Stock</span>
              <FaBoxes className="text-2xl text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-900">
              {stockData.vaccines.reduce((sum, v) => sum + v.remaining, 0)}
            </p>
            <p className="mt-1 text-xs text-blue-600">Doses available</p>
          </div>

          <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-purple-700">Staff Members</span>
              <FaUsers className="text-2xl text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-900">{centerInfo.staffCount}</p>
            <p className="mt-1 text-xs text-purple-600">Active staff</p>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-red-700">Wasted Doses</span>
              <FaExclamationTriangle className="text-2xl text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-900">
              {stockData.vaccines.reduce((sum, v) => sum + v.wasted, 0)}
            </p>
            <p className="mt-1 text-xs text-red-600">This month</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          {[
            { id: "schedule", label: "Schedule", icon: FaCalendarAlt },
            { id: "staff", label: "Staff", icon: FaUsers },
            { id: "stock", label: "Stock", icon: FaBoxes },
            { id: "guidelines", label: "Guidelines", icon: FaBook },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Schedule Management</h2>
              <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700">
                <FaPlus />
                Add Date Slot
              </button>
            </div>

            {/* Date Slots */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Available Dates</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {dateSlots.map((slot) => (
                  <div
                    key={slot.date}
                    className={`rounded-xl border p-6 shadow-sm ${
                      slot.status === "active"
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaCalendarAlt
                          className={`text-2xl ${
                            slot.status === "active" ? "text-green-600" : "text-gray-400"
                          }`}
                        />
                        <div>
                          <h4 className="font-bold text-gray-900">{slot.date}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(slot.date).toLocaleDateString("en-US", {
                              weekday: "long",
                            })}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          slot.status === "active"
                            ? "bg-green-600 text-white"
                            : "bg-gray-400 text-white"
                        }`}
                      >
                        {slot.status}
                      </span>
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-white p-4">
                      <div>
                        <p className="text-xs text-gray-500">Capacity</p>
                        <p className="font-semibold text-gray-900">{slot.capacity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Booked</p>
                        <p className="font-semibold text-gray-900">{slot.booked}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-gray-600">Occupancy</span>
                        <span className="font-semibold text-gray-900">
                          {slot.capacity > 0 ? Math.round((slot.booked / slot.capacity) * 100) : 0}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full ${
                            slot.status === "active" ? "bg-green-600" : "bg-gray-400"
                          }`}
                          style={{
                            width: `${
                              slot.capacity > 0 ? (slot.booked / slot.capacity) * 100 : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedDate(slot.date)}
                        className="flex-1 rounded-lg border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
                      >
                        Manage Time Slots
                      </button>
                      <button className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 hover:bg-gray-50">
                        <FaEdit />
                      </button>
                      <button className="rounded-lg border border-red-300 bg-white p-2 text-red-600 hover:bg-red-50">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slots for Selected Date */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Time Slots for {selectedDate}
              </h3>
              <div className="mb-4">
                <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700">
                  <FaPlus />
                  Add Time Slot
                </button>
              </div>
              <div className="space-y-3">
                {timeSlots.map((slot, index) => (
                  <div key={index} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-1 items-center gap-4">
                        <FaClock className="text-2xl text-green-600" />
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{slot.time}</p>
                          <div className="mt-2 flex items-center gap-6">
                            <div>
                              <p className="text-xs text-gray-500">Capacity</p>
                              <p className="font-semibold text-gray-900">{slot.capacity}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Booked</p>
                              <p className="font-semibold text-gray-900">{slot.booked}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Appointments</p>
                              <p className="font-semibold text-gray-900">{slot.appointments}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32">
                          <div className="mb-1 text-right text-sm font-semibold text-gray-900">
                            {Math.round((slot.booked / slot.capacity) * 100)}%
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-green-600"
                              style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                            />
                          </div>
                        </div>
                        <button className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 hover:bg-gray-50">
                          <FaEdit />
                        </button>
                        <button className="rounded-lg border border-red-300 bg-white p-2 text-red-600 hover:bg-red-50">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Staff Tab */}
        {activeTab === "staff" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
              <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700">
                <FaPlus />
                Add Staff
              </button>
            </div>
            <div className="space-y-4">
              {staffMembers.map((staff) => (
                <div key={staff.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                        <FaUserCircle className="text-3xl text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">{staff.name}</h3>
                            <p className="text-sm text-gray-600">{staff.role}</p>
                          </div>
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                            {staff.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="rounded-lg bg-blue-50 p-3">
                            <p className="text-xs text-blue-700">Assigned</p>
                            <p className="text-xl font-bold text-blue-900">{staff.assigned}</p>
                          </div>
                          <div className="rounded-lg bg-green-50 p-3">
                            <p className="text-xs text-green-700">Completed</p>
                            <p className="text-xl font-bold text-green-900">{staff.completed}</p>
                          </div>
                          <div className="rounded-lg bg-yellow-50 p-3">
                            <p className="text-xs text-yellow-700">Pending</p>
                            <p className="text-xl font-bold text-yellow-900">
                              {staff.assigned - staff.completed}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <FaEdit className="inline mr-2" />
                        Edit
                      </button>
                      <button className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
                        <FaTrash className="inline mr-2" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stock Tab */}
        {activeTab === "stock" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Stock Management</h2>
            <div className="space-y-6">
              {stockData.vaccines.map((vaccine) => (
                <div key={vaccine.name} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{vaccine.name}</h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                        <FaThermometerHalf className="text-blue-600" />
                        <span>Storage: {vaccine.temp}</span>
                      </div>
                    </div>
                    <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                      Request Stock
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-blue-50 p-4">
                      <p className="mb-1 text-xs text-blue-700">Total Received</p>
                      <p className="text-2xl font-bold text-blue-900">{vaccine.total}</p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4">
                      <p className="mb-1 text-xs text-green-700">Used</p>
                      <p className="text-2xl font-bold text-green-900">{vaccine.used}</p>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-4">
                      <p className="mb-1 text-xs text-purple-700">Remaining</p>
                      <p className="text-2xl font-bold text-purple-900">{vaccine.remaining}</p>
                    </div>
                    <div className="rounded-lg bg-red-50 p-4">
                      <p className="mb-1 text-xs text-red-700">Wasted</p>
                      <p className="text-2xl font-bold text-red-900">{vaccine.wasted}</p>
                      <p className="text-xs text-red-600">
                        {((vaccine.wasted / vaccine.total) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-gray-600">Usage Rate</span>
                      <span className="font-semibold text-gray-900">
                        {Math.round((vaccine.used / vaccine.total) * 100)}%
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-gray-200">
                      <div
                        className="h-3 rounded-full bg-linear-to-r from-green-500 to-blue-500"
                        style={{ width: `${(vaccine.used / vaccine.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guidelines Tab */}
        {activeTab === "guidelines" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Vaccine Preservation Guidelines</h2>
            <div className="space-y-6">
              {preservationGuidelines.map((guideline) => (
                <div
                  key={guideline.vaccine}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <FaThermometerHalf className="text-2xl text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{guideline.vaccine}</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-blue-50 p-4">
                      <p className="mb-2 flex items-center gap-2 font-semibold text-blue-900">
                        <FaThermometerHalf />
                        Storage Temperature
                      </p>
                      <p className="text-gray-700">{guideline.storage}</p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4">
                      <p className="mb-2 flex items-center gap-2 font-semibold text-green-900">
                        <FaCheckCircle />
                        Thawed Stability
                      </p>
                      <p className="text-gray-700">{guideline.thawedStability}</p>
                    </div>
                    <div className="rounded-lg bg-yellow-50 p-4">
                      <p className="mb-2 flex items-center gap-2 font-semibold text-yellow-900">
                        <FaClock />
                        Room Temperature
                      </p>
                      <p className="text-gray-700">{guideline.roomTemp}</p>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-4">
                      <p className="mb-2 flex items-center gap-2 font-semibold text-purple-900">
                        <FaBook />
                        Handling Instructions
                      </p>
                      <p className="text-gray-700">{guideline.handling}</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                    <p className="flex items-center gap-2 font-semibold text-red-900">
                      <FaExclamationTriangle />
                      Important Warning
                    </p>
                    <p className="mt-1 text-sm text-red-700">
                      Always monitor temperature logs. Report any deviations immediately. Expired or
                      improperly stored vaccines must be properly documented and disposed of.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
