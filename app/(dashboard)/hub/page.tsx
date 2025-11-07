"use client";

import { useState, useEffect } from "react";
import {
  FaSyringe,
  FaHospital,
  FaBoxes,
  FaTruck,
  FaChartLine,
  FaUsers,
  FaExclamationTriangle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
  FaUserCircle,
  FaEye,
  FaEyeSlash,
  FaCopy,
} from "react-icons/fa";
import { useGlobal } from "../../context/GlobalContext";
import { vaccineApi, centerApi, stockRequestApi, analyticsApi } from "../../../lib/api/hubApi";
import type { Vaccine, Center, StockRequest, Analytics } from "../../../lib/types/hub.types";

export default function HubDashboard() {
  const [activeTab, setActiveTab] = useState<
    "vaccines" | "centers" | "stocks" | "movement" | "analytics"
  >("vaccines");

  // Modal states
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [showCenterModal, setShowCenterModal] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState<Vaccine | null>(null);
  const [editingCenter, setEditingCenter] = useState<Center | null>(null);

  // Data states
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [stockRequests, setStockRequests] = useState<StockRequest[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalVaccinated: 0,
    totalStocks: 0,
    wastage: 0,
    coverage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Password visibility state for each center
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<number, boolean>
  >({});

  const { logout } = useGlobal();

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [vaccinesRes, centersRes, stocksRes, analyticsRes] = await Promise.all([
        vaccineApi.getAll(),
        centerApi.getAll(),
        stockRequestApi.getAll(),
        analyticsApi.getDashboard(),
      ]);

      if (vaccinesRes.data) setVaccines(vaccinesRes.data);
      if (centersRes.data) setCenters(centersRes.data);
      if (stocksRes.data) setStockRequests(stocksRes.data);
      if (analyticsRes.data) setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Form states
  const [vaccineForm, setVaccineForm] = useState({
    name: "",
    manufacturer: "",
    doses: 2,
    temperature: "",
    efficacy: "",
  });

  const [centerForm, setCenterForm] = useState({
    name: "",
    address: "",
    division: "",
    capacity: 0,
    staff: 0,
    status: "active" as "active" | "inactive" | "maintenance",
    password: "",
  });

  // Mock data for movement log (not yet implemented in backend)
  const movementLog = [
    {
      id: 1,
      from: "Central Hub",
      to: "Dhaka Medical College",
      vaccine: "Pfizer",
      quantity: 1000,
      date: "2024-11-01",
      status: "delivered",
    },
    {
      id: 2,
      from: "Central Hub",
      to: "Chittagong Medical",
      vaccine: "Moderna",
      quantity: 500,
      date: "2024-11-03",
      status: "in-transit",
    },
    {
      id: 3,
      from: "Central Hub",
      to: "Mirpur Community",
      vaccine: "AstraZeneca",
      quantity: 300,
      date: "2024-11-05",
      status: "delivered",
    },
  ];

  // Utility functions
  const togglePasswordVisibility = (centerId: number) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [centerId]: !prev[centerId],
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

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Modal handlers
  const openVaccineModal = (vaccine?: Vaccine) => {
    setEditingVaccine(vaccine || null);
    if (vaccine) {
      setVaccineForm({
        name: vaccine.name,
        manufacturer: vaccine.manufacturer,
        doses: vaccine.doses,
        temperature: vaccine.temperature,
        efficacy: vaccine.efficacy,
      });
    } else {
      setVaccineForm({
        name: "",
        manufacturer: "",
        doses: 2,
        temperature: "",
        efficacy: "",
      });
    }
    setShowVaccineModal(true);
  };

  const openCenterModal = (center?: Center) => {
    setEditingCenter(center || null);
    if (center) {
      setCenterForm({
        name: center.name,
        address: center.address,
        division: center.division,
        capacity: center.capacity,
        staff: center.staff,
        status: center.status,
        password: center.password || '',
      });
    } else {
      setCenterForm({
        name: "",
        address: "",
        division: "",
        capacity: 0,
        staff: 0,
        status: "active",
        password: generatePassword(),
      });
    }
    setShowCenterModal(true);
  };

  const closeVaccineModal = () => {
    setShowVaccineModal(false);
    setEditingVaccine(null);
  };

  const closeCenterModal = () => {
    setShowCenterModal(false);
    setEditingCenter(null);
  };

  const handleVaccineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVaccine) {
        const id = editingVaccine._id || editingVaccine.id?.toString() || '';
        await vaccineApi.update(id, vaccineForm);
      } else {
        await vaccineApi.create(vaccineForm);
      }
      await loadAllData();
      closeVaccineModal();
    } catch (err) {
      console.error('Error saving vaccine:', err);
      alert(err instanceof Error ? err.message : 'Failed to save vaccine');
    }
  };

  const handleCenterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCenter) {
        const id = editingCenter._id || editingCenter.id?.toString() || '';
        await centerApi.update(id, centerForm);
      } else {
        await centerApi.create(centerForm);
      }
      await loadAllData();
      closeCenterModal();
    } catch (err) {
      console.error('Error saving center:', err);
      alert(err instanceof Error ? err.message : 'Failed to save center');
    }
  };

  const handleDeleteVaccine = async (vaccine: Vaccine) => {
    if (!confirm(`Are you sure you want to delete ${vaccine.name}?`)) return;
    
    try {
      const id = vaccine._id || vaccine.id?.toString() || '';
      await vaccineApi.delete(id);
      await loadAllData();
    } catch (err) {
      console.error('Error deleting vaccine:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete vaccine');
    }
  };

  const handleDeleteCenter = async (center: Center) => {
    if (!confirm(`Are you sure you want to delete ${center.name}?`)) return;
    
    try {
      const id = center._id || center.id?.toString() || '';
      await centerApi.delete(id);
      await loadAllData();
    } catch (err) {
      console.error('Error deleting center:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete center');
    }
  };

  const handleApproveRequest = async (request: StockRequest) => {
    try {
      const id = request._id || request.id?.toString() || '';
      await stockRequestApi.approve(id, {
        approvedQuantity: request.quantity,
      });
      await loadAllData();
    } catch (err) {
      console.error('Error approving request:', err);
      alert(err instanceof Error ? err.message : 'Failed to approve request');
    }
  };

  const handleRejectRequest = async (request: StockRequest) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      const id = request._id || request.id?.toString() || '';
      await stockRequestApi.reject(id, { reason });
      await loadAllData();
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert(err instanceof Error ? err.message : 'Failed to reject request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <FaSyringe className="text-xl text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">
                  Protirodh Hub
                </span>
                <p className="text-xs text-gray-500">Central Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-2xl text-gray-600" />
                <span className="font-medium text-gray-900">Admin User</span>
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
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="text-red-600" />
              <p className="text-red-800 font-medium">Error: {error}</p>
            </div>
            <button
              onClick={loadAllData}
              className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && (
          <>
        {/* Stats Overview */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">
                Total Vaccinated
              </span>
              <FaUsers className="text-2xl text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-900">
              {analytics.totalVaccinated.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-blue-600">+5% from last month</p>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">
                Total Stock
              </span>
              <FaBoxes className="text-2xl text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900">
              {analytics.totalStocks.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-green-600">Doses available</p>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-red-700">
                Wastage Rate
              </span>
              <FaExclamationTriangle className="text-2xl text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-900">
              {analytics.wastage}%
            </p>
            <p className="mt-1 text-xs text-red-600">-0.5% improvement</p>
          </div>

          <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-purple-700">
                Coverage
              </span>
              <FaChartLine className="text-2xl text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-900">
              {analytics.coverage}%
            </p>
            <p className="mt-1 text-xs text-purple-600">Population coverage</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          {[
            { id: "vaccines", label: "Vaccines", icon: FaSyringe },
            { id: "centers", label: "Centers", icon: FaHospital },
            { id: "stocks", label: "Stock Requests", icon: FaBoxes },
            { id: "movement", label: "Movement", icon: FaTruck },
            { id: "analytics", label: "Analytics", icon: FaChartLine },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Vaccines Tab */}
        {activeTab === "vaccines" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Vaccine Management
              </h2>
              <button
                onClick={() => openVaccineModal()}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <FaPlus />
                Add Vaccine
              </button>
            </div>
            <div className="space-y-4">
              {vaccines.map((vaccine) => (
                <div
                  key={vaccine._id || vaccine.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 text-lg font-bold text-gray-900">
                        {vaccine.name}
                      </h3>
                      <p className="mb-3 text-sm text-gray-600">
                        {vaccine.manufacturer}
                      </p>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div>
                          <p className="text-xs text-gray-500">
                            Number of Doses
                          </p>
                          <p className="font-semibold text-gray-900">
                            {vaccine.doses}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Storage Temp</p>
                          <p className="font-semibold text-gray-900">
                            {vaccine.temperature}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Efficacy</p>
                          <p className="font-semibold text-gray-900">
                            {vaccine.efficacy}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openVaccineModal(vaccine)}
                        className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 hover:bg-gray-50"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteVaccine(vaccine)}
                        className="rounded-lg border border-red-300 bg-white p-2 text-red-600 hover:bg-red-50"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Centers Tab */}
        {activeTab === "centers" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Vaccination Centers
              </h2>
              <button
                onClick={() => openCenterModal()}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <FaPlus />
                Add Center
              </button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {centers.map((center) => {
                const centerId = center._id || center.id?.toString() || '';
                const displayId = center.id || 0;
                return (
                <div
                  key={centerId}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-lg font-bold text-gray-900">
                        {center.name}
                      </h3>
                      <p className="text-sm text-gray-600">{center.address}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Division: {center.division}
                      </p>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      {center.status}
                    </span>
                  </div>

                  {/* Center Credentials */}
                  <div className="mb-4 rounded-lg bg-gray-50 p-4">
                    <h4 className="mb-3 text-sm font-medium text-gray-700">
                      Login Credentials
                    </h4>

                    {/* Center ID */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Center ID:
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(centerId, "Center ID")
                          }
                          className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200"
                        >
                          <FaCopy className="text-xs" />
                          Copy
                        </button>
                      </div>
                      <p className="font-mono text-sm font-semibold text-gray-900">
                        {centerId}
                      </p>
                    </div>

                    {/* Password */}
                    {center.password && (
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Password:</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => togglePasswordVisibility(displayId)}
                            className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200"
                          >
                            {visiblePasswords[displayId] ? (
                              <FaEyeSlash className="text-xs" />
                            ) : (
                              <FaEye className="text-xs" />
                            )}
                            {visiblePasswords[displayId] ? "Hide" : "Show"}
                          </button>
                          <button
                            onClick={() =>
                              copyToClipboard(center.password!, "Password")
                            }
                            className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200"
                          >
                            <FaCopy className="text-xs" />
                            Copy
                          </button>
                        </div>
                      </div>
                      <p className="font-mono font-semibold text-gray-900">
                        {visiblePasswords[displayId]
                          ? center.password
                          : "••••••••••••"}
                      </p>
                    </div>
                    )}
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                    <div>
                      <p className="text-xs text-gray-500">Daily Capacity</p>
                      <p className="font-semibold text-gray-900">
                        {center.capacity}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Staff Count</p>
                      <p className="font-semibold text-gray-900">
                        {center.staff}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openCenterModal(center)}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <FaEdit className="mr-2 inline" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteCenter(center)}
                      className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      <FaTrash className="mr-2 inline" />
                      Delete
                    </button>
                  </div>
                </div>
              )})}
            </div>
          </div>
        )}

        {/* Stock Requests Tab */}
        {activeTab === "stocks" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Stock Requests & Supply Chain
            </h2>
            <div className="space-y-4">
              {stockRequests.map((request) => (
                <div
                  key={request._id || request.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">
                          {request.center}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-xs text-gray-500">Vaccine</p>
                          <p className="font-semibold text-gray-900">
                            {request.vaccine}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Quantity</p>
                          <p className="font-semibold text-gray-900">
                            {request.quantity} doses
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            Requested Date
                          </p>
                          <p className="font-semibold text-gray-900">
                            {request.requested || request.requestDate}
                          </p>
                        </div>
                      </div>
                    </div>
                    {request.status === "pending" && (
                      <div className="ml-4 flex gap-2">
                        <button 
                          onClick={() => handleApproveRequest(request)}
                          className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleRejectRequest(request)}
                          className="rounded-lg border border-red-300 bg-white px-6 py-2 font-semibold text-red-700 hover:bg-red-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Movement Tab */}
        {activeTab === "movement" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Vaccine Movement Tracking
            </h2>
            <div className="space-y-4">
              {movementLog.map((log) => (
                <div
                  key={log.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <FaTruck className="text-xl text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">
                          {log.from} → {log.to}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            log.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-xs text-gray-500">Vaccine</p>
                          <p className="font-semibold text-gray-900">
                            {log.vaccine}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Quantity</p>
                          <p className="font-semibold text-gray-900">
                            {log.quantity} doses
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="font-semibold text-gray-900">
                            {log.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Smart Insights & Analytics
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Coverage by Region */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-bold text-gray-900">
                  Coverage by Division
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Dhaka", coverage: 75, color: "bg-blue-600" },
                    { name: "Chittagong", coverage: 68, color: "bg-green-600" },
                    { name: "Rajshahi", coverage: 62, color: "bg-purple-600" },
                    { name: "Khulna", coverage: 58, color: "bg-yellow-600" },
                  ].map((division) => (
                    <div key={division.name}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">
                          {division.name}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {division.coverage}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full ${division.color}`}
                          style={{ width: `${division.coverage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demographics */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-bold text-gray-900">
                  Age Demographics
                </h3>
                <div className="space-y-3">
                  {[
                    { age: "18-30", percentage: 25, vaccinated: 31250 },
                    { age: "31-45", percentage: 35, vaccinated: 43750 },
                    { age: "46-60", percentage: 28, vaccinated: 35000 },
                    { age: "60+", percentage: 12, vaccinated: 15000 },
                  ].map((demo) => (
                    <div
                      key={demo.age}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {demo.age} years
                        </p>
                        <p className="text-xs text-gray-600">
                          {demo.vaccinated.toLocaleString()} vaccinated
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        {demo.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ML Insights */}
              <div className="rounded-xl border border-purple-200 bg-purple-50 p-6 md:col-span-2">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                  <FaChartLine className="text-purple-600" />
                  AI-Powered Insights
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-white p-4">
                    <p className="mb-2 text-sm font-medium text-gray-600">
                      Predicted Demand
                    </p>
                    <p className="text-2xl font-bold text-purple-600">+15%</p>
                    <p className="mt-1 text-xs text-gray-500">Next 30 days</p>
                  </div>
                  <div className="rounded-lg bg-white p-4">
                    <p className="mb-2 text-sm font-medium text-gray-600">
                      Optimal Stock Level
                    </p>
                    <p className="text-2xl font-bold text-purple-600">45,000</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Recommended doses
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-4">
                    <p className="mb-2 text-sm font-medium text-gray-600">
                      Wastage Reduction
                    </p>
                    <p className="text-2xl font-bold text-purple-600">-18%</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Potential savings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </div>

      {/* Vaccine Modal */}
      {showVaccineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingVaccine ? "Edit Vaccine" : "Add New Vaccine"}
                </h3>
                <button
                  onClick={closeVaccineModal}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <svg
                    className="h-5 w-5"
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

            <form onSubmit={handleVaccineSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Vaccine Name
                  </label>
                  <input
                    type="text"
                    required
                    value={vaccineForm.name}
                    onChange={(e) =>
                      setVaccineForm({ ...vaccineForm, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    placeholder="e.g., Pfizer-BioNTech"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    required
                    value={vaccineForm.manufacturer}
                    onChange={(e) =>
                      setVaccineForm({
                        ...vaccineForm,
                        manufacturer: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    placeholder="e.g., Pfizer Inc."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Number of Doses
                  </label>
                  <select
                    value={vaccineForm.doses}
                    onChange={(e) =>
                      setVaccineForm({
                        ...vaccineForm,
                        doses: parseInt(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  >
                    <option value={1}>1 dose</option>
                    <option value={2}>2 doses</option>
                    <option value={3}>3 doses</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Storage Temperature
                  </label>
                  <input
                    type="text"
                    required
                    value={vaccineForm.temperature}
                    onChange={(e) =>
                      setVaccineForm({
                        ...vaccineForm,
                        temperature: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    placeholder="e.g., -70°C"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Efficacy Rate
                  </label>
                  <input
                    type="text"
                    required
                    value={vaccineForm.efficacy}
                    onChange={(e) =>
                      setVaccineForm({
                        ...vaccineForm,
                        efficacy: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    placeholder="e.g., 95%"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={closeVaccineModal}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                  {editingVaccine ? "Update" : "Add"} Vaccine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Center Modal */}
      {showCenterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingCenter ? "Edit Center" : "Add New Center"}
                </h3>
                <button
                  onClick={closeCenterModal}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <svg
                    className="h-5 w-5"
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

            <form onSubmit={handleCenterSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Center Name
                  </label>
                  <input
                    type="text"
                    required
                    value={centerForm.name}
                    onChange={(e) =>
                      setCenterForm({ ...centerForm, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    placeholder="e.g., Dhaka Medical College Center"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={centerForm.address}
                    onChange={(e) =>
                      setCenterForm({ ...centerForm, address: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    placeholder="e.g., Bakshibazar, Dhaka-1000"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Division
                  </label>
                  <select
                    value={centerForm.division}
                    onChange={(e) =>
                      setCenterForm({ ...centerForm, division: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    required
                  >
                    <option value="">Select Division</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Daily Capacity
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={centerForm.capacity}
                    onChange={(e) =>
                      setCenterForm({
                        ...centerForm,
                        capacity: parseInt(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    placeholder="e.g., 500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Staff Count
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={centerForm.staff}
                    onChange={(e) =>
                      setCenterForm({
                        ...centerForm,
                        staff: parseInt(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    placeholder="e.g., 12"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={centerForm.status}
                    onChange={(e) =>
                      setCenterForm({ ...centerForm, status: e.target.value as 'active' | 'inactive' | 'maintenance' })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Login Password
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={centerForm.password}
                      onChange={(e) =>
                        setCenterForm({
                          ...centerForm,
                          password: e.target.value,
                        })
                      }
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      placeholder="Center login password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCenterForm({
                          ...centerForm,
                          password: generatePassword(),
                        })
                      }
                      className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                      Generate
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    This password will be used for center login authentication
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={closeCenterModal}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                  {editingCenter ? "Update" : "Add"} Center
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
