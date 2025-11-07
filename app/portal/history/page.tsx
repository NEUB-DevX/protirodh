"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaSyringe,
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaIdCard,
  FaFilter,
} from "react-icons/fa";

type VaccinationStatus = "completed" | "scheduled" | "cancelled" | "missed";

interface VaccinationRecord {
  id: string;
  vaccine: string;
  manufacturer: string;
  dose: number;
  batchNumber: string;
  center: string;
  centerAddress: string;
  date: string;
  time: string;
  status: VaccinationStatus;
  administeredBy?: string;
  nextDoseDate?: string;
  sideEffects?: string;
}

export default function VaccinationHistory() {
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Mock vaccination history data
  const vaccinationHistory: VaccinationRecord[] = [
    {
      id: "VAC001",
      vaccine: "Pfizer-BioNTech",
      manufacturer: "Pfizer Inc.",
      dose: 2,
      batchNumber: "EK9788",
      center: "Dhaka Medical College Vaccination Center",
      centerAddress: "Bakshibazar, Dhaka-1000",
      date: "2024-10-15",
      time: "10:30 AM",
      status: "completed",
      administeredBy: "Dr.Rahim Khan",
      sideEffects: "None reported",
    },
    {
      id: "VAC002",
      vaccine: "Pfizer-BioNTech",
      manufacturer: "Pfizer Inc.",
      dose: 1,
      batchNumber: "EK9234",
      center: "Dhaka Medical College Vaccination Center",
      centerAddress: "Bakshibazar, Dhaka-1000",
      date: "2024-09-15",
      time: "2:00 PM",
      status: "completed",
      administeredBy: "Dr. Fatima Ahmed",
      nextDoseDate: "2024-10-15",
      sideEffects: "Mild fever for 1 day",
    },
    {
      id: "VAC003",
      vaccine: "Moderna",
      manufacturer: "Moderna Inc.",
      dose: 1,
      batchNumber: "MD3456",
      center: "Mirpur Community Health Center",
      centerAddress: "Mirpur-10, Dhaka",
      date: "2024-11-20",
      time: "11:00 AM",
      status: "scheduled",
    },
  ];

  const filteredHistory =
    filterStatus === "all"
      ? vaccinationHistory
      : vaccinationHistory.filter((record) => record.status === filterStatus);

  const getStatusStyles = (status: VaccinationStatus) => {
    const styles = {
      completed: "bg-green-50 border-green-200 text-green-700",
      scheduled: "bg-blue-50 border-blue-200 text-blue-700",
      cancelled: "bg-red-50 border-red-200 text-red-700",
      missed: "bg-gray-50 border-gray-200 text-gray-700",
    };
    return styles[status];
  };

  const getStatusIcon = (status: VaccinationStatus) => {
    const icons = {
      completed: <FaCheckCircle />,
      scheduled: <FaClock />,
      cancelled: <FaCheckCircle />,
      missed: <FaClock />,
    };
    return icons[status];
  };

  const stats = {
    total: vaccinationHistory.length,
    completed: vaccinationHistory.filter((r) => r.status === "completed").length,
    scheduled: vaccinationHistory.filter((r) => r.status === "scheduled").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/portal"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <FaArrowLeft />
                <span className="font-medium">Back to Portal</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600">
                <FaSyringe className="text-xl text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Vaccination History</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Vaccination History
          </h1>
          <p className="text-gray-600">
            Complete record of your vaccination journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Vaccines</span>
              <FaSyringe className="text-2xl text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">Completed</span>
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">Scheduled</span>
              <FaClock className="text-2xl text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-900">{stats.scheduled}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
          <FaFilter className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          <div className="flex gap-2">
            {["all", "completed", "scheduled", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* History Records */}
        <div className="space-y-6">
          {filteredHistory.map((record) => (
            <div
              key={record.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="mb-1 text-xl font-bold text-gray-900">
                    {record.vaccine} - Dose {record.dose}
                  </h3>
                  <p className="text-sm text-gray-600">{record.manufacturer}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${getStatusStyles(
                    record.status
                  )}`}
                >
                  {getStatusIcon(record.status)}
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
              </div>

              <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="mt-1 text-lg text-purple-600" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">Date & Time</p>
                    <p className="font-medium text-gray-900">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-600">{record.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="mt-1 text-lg text-purple-600" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">Center</p>
                    <p className="font-medium text-gray-900">{record.center}</p>
                    <p className="text-sm text-gray-600">{record.centerAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaIdCard className="mt-1 text-lg text-purple-600" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">Batch Number</p>
                    <p className="font-medium text-gray-900">{record.batchNumber}</p>
                    <p className="text-sm text-gray-600">Record ID: {record.id}</p>
                  </div>
                </div>

                {record.administeredBy && (
                  <div className="flex items-start gap-3">
                    <FaSyringe className="mt-1 text-lg text-purple-600" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Administered By</p>
                      <p className="font-medium text-gray-900">{record.administeredBy}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              {(record.nextDoseDate || record.sideEffects) && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-gray-900">
                    Additional Information
                  </h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {record.nextDoseDate && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">Next Dose Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(record.nextDoseDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    )}
                    {record.sideEffects && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">Side Effects</p>
                        <p className="font-medium text-gray-900">{record.sideEffects}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button for Scheduled */}
              {record.status === "scheduled" && (
                <div className="mt-4 flex gap-3">
                  <button className="flex-1 rounded-lg bg-purple-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-purple-700">
                    View Details
                  </button>
                  <button className="rounded-lg border-2 border-red-300 bg-white px-4 py-2.5 font-semibold text-red-700 transition-colors hover:bg-red-50">
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <FaSyringe className="mx-auto mb-4 text-5xl text-gray-300" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No records found
              </h3>
              <p className="text-gray-600">
                No vaccination records match the selected filter
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-blue-900">
            <FaIdCard />
            Need your vaccination certificate?
          </h3>
          <p className="mb-4 text-sm text-blue-800">
            Access your digital vaccination certificate with QR code verification.
          </p>
          <Link
            href="/portal/certificate"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <FaIdCard />
            View Certificate
          </Link>
        </div>
      </div>
    </div>
  );
}
