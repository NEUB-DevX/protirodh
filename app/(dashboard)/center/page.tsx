"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { useState, useEffect, useCallback } from "react";
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
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaCopy,
} from "react-icons/fa";
import {
  stockRequestApi,
  vaccineApi,
  profileApi,
  dashboardApi,
  staffApi,
  dateSlotApi,
  timeSlotApi,
} from "@/lib/api/centerApi";
import type {
  StockRequest,
  Vaccine,
  CenterProfile,
  CenterDashboard,
  Staff as StaffType,
  DateSlot as DateSlotType,
} from "@/lib/types/center.types";

// TypeScript interfaces
interface DateSlotForm {
  date: string;
  capacity: number;
  status: "active" | "closed";
}

interface StaffForm {
  name: string;
  role: string;
  email: string;
  phone: string;
  staffId: string;
  password: string;
  status: "active" | "inactive";
}

interface StockRequestForm {
  vaccine: string;
  quantity: number;
  urgency: "low" | "medium" | "high";
  notes: string;
}

interface TimeSlotForm {
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  assignedStaffId: string | null;
}

interface DateSlot {
  _id?: string;
  date: string;
  capacity: number;
  booked: number;
  status: "active" | "closed";
}

interface Staff {
  _id?: string;
  id?: number;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  staffId: string;
  password: string;
  status: string;
}

interface TimeSlot {
  _id?: string;
  id?: string;
  time: string;
  capacity: number;
  booked: number;
  appointments: number;
  assignedStaff: { id: number; name: string } | null;
  dateSlotId?: string;
}

export default function CenterDashboard() {
  const [activeTab, setActiveTab] = useState<
    "schedule" | "staff" | "stock" | "guidelines"
  >("schedule");
  const [selectedDate, setSelectedDate] = useState("2024-11-08");
  const [selectedDateSlotId, setSelectedDateSlotId] = useState<string | null>(null);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);

  // Modal states
  const [showDateSlotModal, setShowDateSlotModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showStockRequestModal, setShowStockRequestModal] = useState(false);
  const [showTimeSlotEditModal, setShowTimeSlotEditModal] = useState(false);

  // Edit states
  const [editingDateSlot, setEditingDateSlot] = useState<DateSlot | null>(null);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);

  // Data states
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [stockRequests, setStockRequests] = useState<StockRequest[]>([]);
  const [centerProfile, setCenterProfile] = useState<CenterProfile | null>(
    null,
  );
  const [dashboard, setDashboard] = useState<CenterDashboard | null>(null);
  const [staffList, setStaffList] = useState<StaffType[]>([]);
  const [dateSlotsList, setDateSlotsList] = useState<DateSlotType[]>([]);
  const [timeSlotsList, setTimeSlotsList] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [centerId, setCenterId] = useState<string>("");

  // Password visibility state for each staff member
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<number, boolean>
  >({});

  const { logout, user } = useGlobal();

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(user);

      const [
        vaccinesRes,
        stockRes,
        profileRes,
        dashboardRes,
        staffRes,
        dateSlotsRes,
      ] = await Promise.all([
        vaccineApi.getAll(),
        stockRequestApi.getAll(),
        profileApi.get(),
        dashboardApi.get(),
        staffApi.getAll(),
        dateSlotApi.getAll(),
      ]);

      if (vaccinesRes.data) setVaccines(vaccinesRes.data);
      if (stockRes.data) setStockRequests(stockRes.data);
      if (profileRes.data) {
        setCenterProfile(profileRes.data);
      }
      if (dashboardRes.data) setDashboard(dashboardRes.data);
      if (staffRes.data) setStaffList(staffRes.data);
      if (dateSlotsRes.data) setDateSlotsList(dateSlotsRes.data);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Load time slots for selected date slot
  const loadTimeSlots = useCallback(async (dateSlotId: string) => {
    try {
      const timeSlotsRes = await timeSlotApi.getByDateSlot(dateSlotId);
      if (timeSlotsRes.data) {
        setTimeSlotsList(timeSlotsRes.data);
      }
    } catch (err) {
      console.error("Error loading time slots:", err);
      setError(err instanceof Error ? err.message : "Failed to load time slots");
    }
  }, []);

  // Utility functions
  const togglePasswordVisibility = (staffId: number) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [staffId]: !prev[staffId],
    }));
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${type} copied to clipboard!`);
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy to clipboard");
    }
  };

  // Form states
  const [dateSlotForm, setDateSlotForm] = useState<DateSlotForm>({
    date: "",
    capacity: 500,
    status: "active",
  });

  const [staffForm, setStaffForm] = useState<StaffForm>({
    name: "",
    role: "Vaccinator",
    email: "",
    phone: "",
    staffId: "",
    password: "",
    status: "active",
  });

  const [stockRequestForm, setStockRequestForm] = useState<StockRequestForm>({
    vaccine: "",
    quantity: 100,
    urgency: "medium",
    notes: "",
  });

  const [timeSlotForm, setTimeSlotForm] = useState<TimeSlotForm>({
    startTime: "",
    endTime: "",
    capacity: 50,
    booked: 0,
    assignedStaffId: null,
  });

  // Modal handlers
  const openDateSlotModal = (dateSlot?: DateSlot) => {
    setEditingDateSlot(dateSlot || null);
    if (dateSlot) {
      setDateSlotForm({
        date: dateSlot.date,
        capacity: dateSlot.capacity,
        status: dateSlot.status,
      });
    } else {
      setDateSlotForm({
        date: "",
        capacity: 500,
        status: "active",
      });
    }
    setShowDateSlotModal(true);
  };

  const openStaffModal = (staff?: Staff) => {
    setEditingStaff(staff || null);
    if (staff) {
      setStaffForm({
        name: staff.name,
        role: staff.role,
        email: staff.email || "",
        phone: staff.phone || "",
        staffId: staff.staffId,
        password: staff.password,
        status: staff.status as "active" | "inactive",
      });
    } else {
      setStaffForm({
        name: "",
        role: "Vaccinator",
        email: "",
        phone: "",
        staffId: "",
        password: "",
        status: "active",
      });
    }
    setShowStaffModal(true);
  };

  const closeDateSlotModal = () => {
    setShowDateSlotModal(false);
    setEditingDateSlot(null);
    setDateSlotForm({ date: "", capacity: 500, status: "active" });
  };

  const closeStaffModal = () => {
    setShowStaffModal(false);
    setEditingStaff(null);
    setStaffForm({
      name: "",
      role: "Vaccinator",
      email: "",
      phone: "",
      staffId: "",
      password: "",
      status: "active",
    });
  };

  const closeStockRequestModal = () => {
    setShowStockRequestModal(false);
    setStockRequestForm({
      vaccine: "",
      quantity: 100,
      urgency: "medium",
      notes: "",
    });
  };

  const openTimeSlotModal = (timeSlot?: TimeSlot & { startTime?: string; endTime?: string }) => {
    setEditingTimeSlot(timeSlot || null);
    if (timeSlot) {
      // Parse the time string (format: "HH:MM-HH:MM") or use provided startTime/endTime
      let startTime = '';
      let endTime = '';
      
      if (timeSlot.startTime && timeSlot.endTime) {
        startTime = timeSlot.startTime;
        endTime = timeSlot.endTime;
      } else if (timeSlot.time) {
        [startTime, endTime] = timeSlot.time.split('-');
      }
      
      setTimeSlotForm({
        startTime,
        endTime,
        capacity: timeSlot.capacity,
        booked: timeSlot.booked,
        assignedStaffId: timeSlot.assignedStaff
          ? timeSlot.assignedStaff.id.toString()
          : null,
      });
    } else {
      setTimeSlotForm({
        startTime: "",
        endTime: "",
        capacity: 50,
        booked: 0,
        assignedStaffId: null,
      });
    }
    setShowTimeSlotEditModal(true);
  };

  const closeTimeSlotModal = () => {
    setShowTimeSlotEditModal(false);
    setEditingTimeSlot(null);
    setTimeSlotForm({
      startTime: "",
      endTime: "",
      capacity: 50,
      booked: 0,
      assignedStaffId: null,
    });
  };

  // Form submit handlers
  const handleDateSlotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) {
        alert("User not found. Please refresh the page.");
        return;
      }

      if (!user.id) {
        alert("Center ID not found. Please refresh the page.");
        return;
      }

      const dateSlotData = {
        ...dateSlotForm,
        centerId: user.id,
      };

      if (editingDateSlot) {
        await dateSlotApi.update(
          editingDateSlot._id || editingDateSlot.date,
          dateSlotData,
        );
        alert("Date slot updated successfully!");
      } else {
        await dateSlotApi.create(dateSlotData);
        alert("Date slot created successfully!");
      }
      await loadAllData();
      closeDateSlotModal();
    } catch (err) {
      console.error("Error saving date slot:", err);
      alert(err instanceof Error ? err.message : "Failed to save date slot");
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user?.id) {
        alert("Center ID not found. Please refresh the page.");
        return;
      }

      const staffData = {
        ...staffForm,
        centerId: user.id,
      };

      if (editingStaff) {
        await staffApi.update(
          editingStaff._id || String(editingStaff.id),
          staffData,
        );
        alert("Staff member updated successfully!");
      } else {
        await staffApi.create(staffData);
        alert("Staff member created successfully!");
      }
      await loadAllData();
      closeStaffModal();
    } catch (err) {
      console.error("Error saving staff:", err);
      alert(err instanceof Error ? err.message : "Failed to save staff member");
    }
  };

  const handleStockRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await stockRequestApi.create({
        vaccine: stockRequestForm.vaccine,
        quantity: stockRequestForm.quantity,
        urgency: stockRequestForm.urgency,
        notes: stockRequestForm.notes,
      });
      await loadAllData();
      closeStockRequestModal();
      alert("Stock request submitted successfully!");
    } catch (err) {
      console.error("Error submitting stock request:", err);
      alert(
        err instanceof Error ? err.message : "Failed to submit stock request",
      );
    }
  };

  const handleTimeSlotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedDateSlotId) {
        alert("No date slot selected. Please select a date first.");
        return;
      }

      // Validation
      if (timeSlotForm.startTime >= timeSlotForm.endTime) {
        alert("Start time must be before end time.");
        return;
      }

      const timeSlotData = {
        dateSlotId: selectedDateSlotId,
        time: `${timeSlotForm.startTime}-${timeSlotForm.endTime}`,
        capacity: timeSlotForm.capacity,
        assignedStaffId: timeSlotForm.assignedStaffId || undefined,
      };

      if (editingTimeSlot) {
        // For updating, we need the time slot ID (this would need to be added to the TimeSlot interface)
        console.log("Updating Time Slot:", {
          ...editingTimeSlot,
          ...timeSlotForm,
        });
        alert("Time slot update functionality will be implemented soon.");
      } else {
        await timeSlotApi.create(timeSlotData);
        alert("Time slot created successfully!");
        await loadTimeSlots(selectedDateSlotId);
      }
      closeTimeSlotModal();
    } catch (err) {
      console.error("Error saving time slot:", err);
      alert(err instanceof Error ? err.message : "Failed to save time slot");
    }
  };

  // Computed data from state
  const centerInfo = {
    name: centerProfile?.name || "Loading...",
    address: centerProfile?.address || "Loading...",
    dailyCapacity: centerProfile?.capacity || 0,
    staffCount: centerProfile?.staff || 0,
  };

  // Stock data calculated from real inventory (to be implemented)
  const stockData = {
    vaccines: vaccines.map((vaccine) => ({
      name: vaccine.name,
      total: 0, // To be calculated from inventory
      used: 0, // To be calculated from vaccination records
      remaining: 0, // To be calculated from inventory
      wasted: 0, // To be calculated from wastage records
      temp: vaccine.temperature,
    })),
  };

  const preservationGuidelines = [
    {
      vaccine: "Pfizer-BioNTech",
      storage: "-70°C ± 10°C",
      thawedStability: "5 days at 2-8°C",
      roomTemp: "2 hours at room temperature",
      handling:
        "Do not refreeze once thawed. Gently invert 10 times, do not shake.",
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
                <span className="text-xl font-bold text-gray-900">
                  {centerInfo.name}
                </span>
                <p className="text-xs text-gray-500">Center Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-2xl text-gray-600" />
                <span className="font-medium text-gray-900">Center Admin</span>
              </div>
              <button
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                onClick={() => logout()}
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
              <p className="text-gray-600">Loading center data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="text-red-600" />
              <p className="font-medium text-red-800">Error: {error}</p>
            </div>
            <button
              onClick={loadAllData}
              className="mt-2 text-sm text-red-600 underline hover:text-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && (
          <>
            {/* Stats Overview */}
            <div className="mb-8 grid gap-6 md:grid-cols-4">
              <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">
                    Daily Capacity
                  </span>
                  <FaUsers className="text-2xl text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-900">
                  {centerInfo.dailyCapacity}
                </p>
                <p className="mt-1 text-xs text-green-600">Per day</p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">
                    Total Stock
                  </span>
                  <FaBoxes className="text-2xl text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-900">
                  {dashboard?.inventory.totalReceived || 0}
                </p>
                <p className="mt-1 text-xs text-blue-600">Doses received</p>
              </div>

              <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-700">
                    Staff Members
                  </span>
                  <FaUsers className="text-2xl text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-900">
                  {centerInfo.staffCount}
                </p>
                <p className="mt-1 text-xs text-purple-600">Active staff</p>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-red-700">
                    Pending Requests
                  </span>
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
                  <h2 className="text-2xl font-bold text-gray-900">
                    Schedule Management
                  </h2>
                  <button
                    onClick={() => openDateSlotModal()}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
                  >
                    <FaPlus />
                    Add Date Slot
                  </button>
                </div>

                {/* Date Slots */}
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">
                    Available Dates
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {dateSlotsList.map((slot) => (
                      <div
                        key={slot._id || slot.date}
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
                                slot.status === "active"
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            />
                            <div>
                              <h4 className="font-bold text-gray-900">
                                {new Date(slot.date).toLocaleDateString()}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {new Date(slot.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                  },
                                )}
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
                            <p className="font-semibold text-gray-900">
                              {slot.capacity}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Booked</p>
                            <p className="font-semibold text-gray-900">
                              {slot.booked}
                            </p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="text-gray-600">Occupancy</span>
                            <span className="font-semibold text-gray-900">
                              {slot.capacity > 0
                                ? Math.round(
                                    (slot.booked / slot.capacity) * 100,
                                  )
                                : 0}
                              %
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                              className={`h-2 rounded-full ${
                                slot.status === "active"
                                  ? "bg-green-600"
                                  : "bg-gray-400"
                              }`}
                              style={{
                                width: `${
                                  slot.capacity > 0
                                    ? (slot.booked / slot.capacity) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedDate(slot.date);
                              setSelectedDateSlotId(slot._id || slot.date);
                              setShowTimeSlotModal(true);
                              if (slot._id) {
                                loadTimeSlots(slot._id);
                              }
                            }}
                            className="flex-1 rounded-lg border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
                          >
                            Manage Time Slots
                          </button>
                          <button
                            onClick={() => openDateSlotModal(slot as DateSlot)}
                            className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 hover:bg-gray-50"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={async () => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this date slot?",
                                )
                              ) {
                                try {
                                  await dateSlotApi.delete(
                                    slot._id || slot.date,
                                  );
                                  await loadAllData();
                                  alert("Date slot deleted successfully!");
                                } catch (err) {
                                  alert(
                                    err instanceof Error
                                      ? err.message
                                      : "Failed to delete date slot",
                                  );
                                }
                              }
                            }}
                            className="rounded-lg border border-red-300 bg-white p-2 text-red-600 hover:bg-red-50"
                          >
                            <FaTrash />
                          </button>
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
                  <h2 className="text-2xl font-bold text-gray-900">
                    Staff Management
                  </h2>
                  <button
                    onClick={() => openStaffModal()}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
                  >
                    <FaPlus />
                    Add Staff
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {staffList.map((staff) => (
                    <div
                      key={staff._id || staff.id}
                      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                          <FaUserCircle className="text-3xl text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">
                            {staff.name}
                          </h3>
                          <p className="text-sm text-gray-600">{staff.role}</p>
                        </div>
                      </div>

                      {/* Staff Credentials */}
                      <div className="mb-4 rounded-lg bg-gray-50 p-4">
                        <h4 className="mb-3 text-sm font-medium text-gray-700">
                          Login Credentials
                        </h4>

                        {/* Staff ID */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Staff ID:
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(staff.staffId, "Staff ID")
                              }
                              className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200"
                            >
                              <FaCopy className="text-xs" />
                              Copy
                            </button>
                          </div>
                          <p className="font-mono text-sm font-semibold text-gray-900">
                            {staff.staffId}
                          </p>
                        </div>

                        {/* Password */}
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Password:
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  togglePasswordVisibility(
                                    Number(staff._id || staff.id),
                                  )
                                }
                                className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200"
                              >
                                {visiblePasswords[
                                  Number(staff._id || staff.id)
                                ] ? (
                                  <FaEyeSlash className="text-xs" />
                                ) : (
                                  <FaEye className="text-xs" />
                                )}
                                {visiblePasswords[Number(staff._id || staff.id)]
                                  ? "Hide"
                                  : "Show"}
                              </button>
                              <button
                                onClick={() =>
                                  copyToClipboard(staff.password, "Password")
                                }
                                className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200"
                              >
                                <FaCopy className="text-xs" />
                                Copy
                              </button>
                            </div>
                          </div>
                          <p className="font-mono text-sm font-semibold text-gray-900">
                            {visiblePasswords[Number(staff._id || staff.id)]
                              ? staff.password
                              : "••••••••••••"}
                          </p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      {(staff.email || staff.phone) && (
                        <div className="mb-4 space-y-1 text-xs text-gray-600">
                          {staff.email && (
                            <p>
                              <span className="font-medium">Email:</span>{" "}
                              {staff.email}
                            </p>
                          )}
                          {staff.phone && (
                            <p>
                              <span className="font-medium">Phone:</span>{" "}
                              {staff.phone}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="mb-4">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                          {staff.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openStaffModal(staff)}
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <FaEdit className="mr-2 inline" />
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (
                              confirm(
                                "Are you sure you want to delete this staff member?",
                              )
                            ) {
                              try {
                                await staffApi.delete(
                                  staff._id || String(staff.id),
                                );
                                await loadAllData();
                                alert("Staff member deleted successfully!");
                              } catch (err) {
                                alert(
                                  err instanceof Error
                                    ? err.message
                                    : "Failed to delete staff member",
                                );
                              }
                            }
                          }}
                          className="rounded-lg border border-red-300 bg-white p-2 text-sm font-medium text-red-700 hover:bg-red-50"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Tab */}
            {activeTab === "stock" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Stock Management
                  </h2>
                  <button
                    onClick={() => setShowStockRequestModal(true)}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    New Stock Request
                  </button>
                </div>

                {/* Stock Requests */}
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">
                    Stock Requests
                  </h3>
                  {stockRequests.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                      <p className="text-gray-500">No stock requests yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {stockRequests.map((request) => (
                        <div
                          key={request._id}
                          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-3">
                                <h4 className="text-lg font-bold text-gray-900">
                                  {typeof request.vaccineId === "object"
                                    ? request.vaccineId.name
                                    : request.vaccine || "Unknown Vaccine"}
                                </h4>
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    request.status === "approved"
                                      ? "bg-green-100 text-green-700"
                                      : request.status === "rejected"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {request.status.charAt(0).toUpperCase() +
                                    request.status.slice(1)}
                                </span>
                              </div>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>
                                  <span className="font-semibold">
                                    Quantity:
                                  </span>{" "}
                                  {request.quantity} doses
                                </p>
                                {(request.reason || request.notes) && (
                                  <p>
                                    <span className="font-semibold">
                                      Reason:
                                    </span>{" "}
                                    {request.reason || request.notes}
                                  </p>
                                )}
                                {request.createdAt && (
                                  <p>
                                    <span className="font-semibold">
                                      Requested:
                                    </span>{" "}
                                    {new Date(
                                      request.createdAt,
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Current Inventory */}
                <div>
                  <h3 className="mb-4 text-lg font-bold text-gray-900">
                    Current Inventory
                  </h3>
                  <div className="space-y-6">
                    {stockData.vaccines.map((vaccine) => (
                      <div
                        key={vaccine.name}
                        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {vaccine.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                              <FaThermometerHalf className="text-blue-600" />
                              <span>Storage: {vaccine.temp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-4">
                          <div className="rounded-lg bg-blue-50 p-4">
                            <p className="mb-1 text-xs text-blue-700">
                              Total Received
                            </p>
                            <p className="text-2xl font-bold text-blue-900">
                              {vaccine.total}
                            </p>
                          </div>
                          <div className="rounded-lg bg-green-50 p-4">
                            <p className="mb-1 text-xs text-green-700">Used</p>
                            <p className="text-2xl font-bold text-green-900">
                              {vaccine.used}
                            </p>
                          </div>
                          <div className="rounded-lg bg-purple-50 p-4">
                            <p className="mb-1 text-xs text-purple-700">
                              Remaining
                            </p>
                            <p className="text-2xl font-bold text-purple-900">
                              {vaccine.remaining}
                            </p>
                          </div>
                          <div className="rounded-lg bg-red-50 p-4">
                            <p className="mb-1 text-xs text-red-700">Wasted</p>
                            <p className="text-2xl font-bold text-red-900">
                              {vaccine.wasted}
                            </p>
                            <p className="text-xs text-red-600">
                              {vaccine.total > 0
                                ? (
                                    (vaccine.wasted / vaccine.total) *
                                    100
                                  ).toFixed(1)
                                : 0}
                              %
                            </p>
                          </div>
                        </div>
                        {vaccine.total > 0 && (
                          <div className="mt-4">
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span className="text-gray-600">Usage Rate</span>
                              <span className="font-semibold text-gray-900">
                                {Math.round(
                                  (vaccine.used / vaccine.total) * 100,
                                )}
                                %
                              </span>
                            </div>
                            <div className="h-3 w-full rounded-full bg-gray-200">
                              <div
                                className="h-3 rounded-full bg-linear-to-r from-green-500 to-blue-500"
                                style={{
                                  width: `${(vaccine.used / vaccine.total) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Guidelines Tab */}
            {activeTab === "guidelines" && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Vaccine Preservation Guidelines
                </h2>
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
                        <h3 className="text-xl font-bold text-gray-900">
                          {guideline.vaccine}
                        </h3>
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
                          <p className="text-gray-700">
                            {guideline.thawedStability}
                          </p>
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
                          Always monitor temperature logs. Report any deviations
                          immediately. Expired or improperly stored vaccines
                          must be properly documented and disposed of.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Time Slot Management Modal */}
      {showTimeSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Time Slots Management
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedDate} •{" "}
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowTimeSlotModal(false);
                    setTimeSlotsList([]);
                    setSelectedDateSlotId(null);
                  }}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-6">
                <button
                  onClick={() => openTimeSlotModal()}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                >
                  <FaPlus />
                  Add Time Slot
                </button>
              </div>

              <div className="space-y-3">
                {timeSlotsList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12">
                    <FaClock className="mb-3 text-4xl text-gray-400" />
                    <p className="text-lg font-semibold text-gray-700">
                      No Time Slots Yet
                    </p>
                    <p className="mt-2 text-center text-sm text-gray-500">
                      Create your first time slot for this date using the Add Time Slot button above.
                    </p>
                  </div>
                ) : (
                  timeSlotsList.map((timeSlot, index) => {
                    // Parse the time field (format: "HH:MM-HH:MM")
                    const [startTime, endTime] = timeSlot.time ? timeSlot.time.split('-') : ['', ''];
                    
                    return (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FaClock className="text-2xl text-blue-600" />
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {startTime} - {endTime}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {timeSlot.booked} / {timeSlot.capacity} appointments
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openTimeSlotModal({
                              ...timeSlot,
                              startTime,
                              endTime
                            } as TimeSlot & { startTime: string; endTime: string })}
                            className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 hover:bg-gray-50"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="rounded-lg border border-red-300 bg-white p-2 text-red-600 hover:bg-red-50"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      {timeSlot.assignedStaff && (
                        <div className="mt-3 rounded-lg bg-green-50 p-3">
                          <p className="text-sm text-green-700">
                            <span className="font-semibold">Assigned Staff:</span>{" "}
                            {timeSlot.assignedStaff.name}
                          </p>
                        </div>
                      )}
                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-gray-600">Occupancy</span>
                          <span className="font-semibold text-gray-900">
                            {timeSlot.capacity > 0
                              ? Math.round((timeSlot.booked / timeSlot.capacity) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{
                              width: `${
                                timeSlot.capacity > 0
                                  ? (timeSlot.booked / timeSlot.capacity) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowTimeSlotModal(false);
                    setTimeSlotsList([]);
                    setSelectedDateSlotId(null);
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Close
                </button>
                {/* <button className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-green-700">
                  Save Changes
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Date Slot Modal */}
      {showDateSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingDateSlot ? "Edit Date Slot" : "Add Date Slot"}
                </h3>
                <button
                  onClick={closeDateSlotModal}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleDateSlotSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={dateSlotForm.date}
                    onChange={(e) =>
                      setDateSlotForm({ ...dateSlotForm, date: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Daily Capacity
                  </label>
                  <input
                    type="number"
                    value={dateSlotForm.capacity}
                    onChange={(e) =>
                      setDateSlotForm({
                        ...dateSlotForm,
                        capacity: parseInt(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={dateSlotForm.status}
                    onChange={(e) =>
                      setDateSlotForm({
                        ...dateSlotForm,
                        status: e.target.value as "active" | "closed",
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDateSlotModal}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
                >
                  <FaSave />
                  {editingDateSlot ? "Update Date Slot" : "Save Date Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingStaff ? "Edit Staff Member" : "Add Staff Member"}
                </h3>
                <button
                  onClick={closeStaffModal}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleStaffSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={staffForm.name}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    value={staffForm.role}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, role: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                  >
                    <option value="Vaccinator">Vaccinator</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={staffForm.email}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, email: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={staffForm.phone}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, phone: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="rounded-lg bg-blue-50 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-blue-900">
                    Login Credentials
                  </h4>

                  <div className="mb-3">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Staff ID
                    </label>
                    <input
                      type="text"
                      value={staffForm.staffId}
                      onChange={(e) =>
                        setStaffForm({ ...staffForm, staffId: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                      placeholder="e.g., STAFF001"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="text"
                      value={staffForm.password}
                      onChange={(e) =>
                        setStaffForm({ ...staffForm, password: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                      placeholder="Enter password"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      This password will be used for staff login
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={staffForm.status}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        status: e.target.value as "active" | "inactive",
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeStaffModal}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
                >
                  <FaSave />
                  {editingStaff ? "Update Staff" : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Request Modal */}
      {showStockRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Request Vaccine Stock
                </h3>
                <button
                  onClick={closeStockRequestModal}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleStockRequestSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Vaccine Type
                  </label>
                  <select
                    value={stockRequestForm.vaccine}
                    onChange={(e) =>
                      setStockRequestForm({
                        ...stockRequestForm,
                        vaccine: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                    required
                  >
                    <option value="">Select vaccine type</option>
                    {vaccines.map((vaccine) => (
                      <option key={vaccine.id || vaccine._id} value={vaccine.id || vaccine._id}>
                        {vaccine.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Quantity (Doses)
                  </label>
                  <input
                    type="number"
                    value={stockRequestForm.quantity}
                    onChange={(e) =>
                      setStockRequestForm({
                        ...stockRequestForm,
                        quantity: parseInt(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                    min="1"
                    placeholder="Enter quantity"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Urgency Level
                  </label>
                  <select
                    value={stockRequestForm.urgency}
                    onChange={(e) =>
                      setStockRequestForm({
                        ...stockRequestForm,
                        urgency: e.target.value as "low" | "medium" | "high",
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                  >
                    <option value="low">Low - Within 2 weeks</option>
                    <option value="medium">Medium - Within 1 week</option>
                    <option value="high">High - Within 2-3 days</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                  <textarea
                    value={stockRequestForm.notes}
                    onChange={(e) =>
                      setStockRequestForm({
                        ...stockRequestForm,
                        notes: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                    rows={3}
                    placeholder="Any additional information or special requirements..."
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeStockRequestModal}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
                >
                  <FaBoxes />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Time Slot Modal */}
      {showTimeSlotEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingTimeSlot ? "Edit Time Slot" : "Add Time Slot"}
                </h3>
                <button
                  onClick={closeTimeSlotModal}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleTimeSlotSubmit} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={timeSlotForm.startTime}
                      onChange={(e) =>
                        setTimeSlotForm({ ...timeSlotForm, startTime: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={timeSlotForm.endTime}
                      onChange={(e) =>
                        setTimeSlotForm({ ...timeSlotForm, endTime: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={timeSlotForm.capacity}
                    onChange={(e) =>
                      setTimeSlotForm({
                        ...timeSlotForm,
                        capacity: parseInt(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                    min="1"
                    required
                  />
                </div>

                {editingTimeSlot && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Current Bookings
                    </label>
                    <input
                      type="number"
                      value={timeSlotForm.booked}
                      onChange={(e) =>
                        setTimeSlotForm({
                          ...timeSlotForm,
                          booked: parseInt(e.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                      min="0"
                      max={timeSlotForm.capacity}
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Assigned Staff
                  </label>
                  <select
                    value={timeSlotForm.assignedStaffId || ""}
                    onChange={(e) =>
                      setTimeSlotForm({
                        ...timeSlotForm,
                        assignedStaffId: e.target.value || null,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                  >
                    <option value="">No staff assigned</option>
                    {staffList.map((staff) => (
                      <option
                        key={staff._id || staff.id}
                        value={staff._id || staff.id}
                      >
                        {staff.name} ({staff.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeTimeSlotModal}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
                >
                  <FaSave />
                  {editingTimeSlot ? "Update Time Slot" : "Add Time Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
