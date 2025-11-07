"use client";

import { useState } from "react";
import Link from "next/link";

import {
  FaSyringe,
  FaUserCircle,
  FaSignOutAlt,
  FaCalendarPlus,
  FaHistory,
  FaIdCard,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimes,
} from "react-icons/fa";
import { useGlobal } from "../context/GlobalContext";

export default function Portal() {

  const {logout, user} = useGlobal();

  const [applications] = useState([
    {
      id: "APP001",
      vaccine: "Pfizer-BioNTech",
      dose: 1,
      center: "Dhaka Medical College",
      date: "2024-11-15",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: "APP002",
      vaccine: "Moderna",
      dose: 1,
      center: "Chittagong Medical College",
      date: "2024-11-20",
      time: "2:00 PM",
      status: "pending",
    },
  ]);


  // const handleLogout = () => {
  //   localStorage.clear();
  //   router.push("/");
  // };

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };

    const icons = {
      confirmed: <FaCheckCircle />,
      pending: <FaHourglassHalf />,
      completed: <FaCheckCircle />,
      cancelled: <FaTimes />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
          styles[status as keyof typeof styles]
        }`}
      >
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
              <span className="text-xl font-bold text-gray-900">Protirodh</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-2xl text-gray-600" />
                <span className="font-medium text-gray-900">{user?.name}</span>
              </div>
              <button
                onClick={() => logout()}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your vaccination journey here</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Link
            href="/portal/apply"
            className="group rounded-2xl border-2 border-green-200 bg-linear-to-br from-green-50 to-green-100 p-6 shadow-sm transition-all hover:scale-105 hover:border-green-300 hover:shadow-md"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-600">
              <FaCalendarPlus className="text-xl text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Apply for Vaccine
            </h3>
            <p className="text-sm text-gray-600">
              Browse available vaccines and book your slot
            </p>
          </Link>

          <Link
            href="/portal/history"
            className="group rounded-2xl border-2 border-purple-200 bg-linear-to-br from-purple-50 to-purple-100 p-6 shadow-sm transition-all hover:scale-105 hover:border-purple-300 hover:shadow-md"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600">
              <FaHistory className="text-xl text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              View History
            </h3>
            <p className="text-sm text-gray-600">
              Check your complete vaccination history
            </p>
          </Link>

          <Link
            href="/portal/certificate"
            className="group rounded-2xl border-2 border-green-200 bg-linear-to-br from-green-50 to-green-100 p-6 shadow-sm transition-all hover:scale-105 hover:border-green-300 hover:shadow-md"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-600">
              <FaIdCard className="text-xl text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              My Certificate
            </h3>
            <p className="text-sm text-gray-600">
              Access your digital vaccination certificate
            </p>
          </Link>
        </div>

        {/* Application Status */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">My Applications</h2>
            <Link
              href="/portal/apply"
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              Apply for new vaccine →
            </Link>
          </div>

          {applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-xl border border-gray-200 p-5 transition-all hover:border-gray-300 hover:shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-gray-900">
                        {app.vaccine} - Dose {app.dose}
                      </h3>
                      <p className="text-sm text-gray-600">{app.center}</p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FaCalendarPlus className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(app.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <FaClock className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-medium text-gray-900">{app.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <FaSyringe className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Application ID</p>
                        <p className="font-medium text-gray-900">{app.id}</p>
                      </div>
                    </div>
                  </div>

                  {app.status === "pending" && (
                    <div className="mt-4 flex gap-3">
                      <button className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
                        View Details
                      </button>
                      <button className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <FaSyringe className="mx-auto mb-4 text-5xl text-gray-300" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No Applications Yet
              </h3>
              <p className="mb-6 text-gray-600">
                Start by applying for your first vaccine
              </p>
              <Link
                href="/portal/apply"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
              >
                <FaCalendarPlus />
                Apply Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
