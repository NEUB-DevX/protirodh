"use client";

import Link from "next/link";
import { FaHome, FaCalendar, FaSyringe, FaUsers, FaExclamationTriangle } from "react-icons/fa";
import { Card, StatCard, Table, Badge } from "@/components/ui";
import { mockVaccinationCenters, mockAppointments } from "@/lib/mockData";

export default function CenterPortal() {
  // Using first center from mock data
  const center = mockVaccinationCenters[0];
  const centerAppointments = mockAppointments.filter(
    (apt) => apt.centerId === center.id
  );

  const todayAppointments = centerAppointments.filter((apt) => {
    const today = new Date().toISOString().split("T")[0];
    return apt.scheduledDate >= today;
  });

  const completedToday = todayAppointments.filter(
    (apt) => apt.status === "completed"
  ).length;

  const totalStock = center.vaccineStock.reduce(
    (sum, stock) => sum + stock.remainingDoses,
    0
  );

  const lowStockAlerts = center.vaccineStock.filter(
    (stock) => stock.remainingDoses < 500
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-green-600 hover:text-green-700">
              <FaHome className="text-xl" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">{center.name}</h1>
              <p className="text-sm text-gray-600">{center.division}</p>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <StatCard
            title="Today's Appointments"
            value={todayAppointments.length}
            icon={<FaCalendar className="text-2xl" />}
          />
          <StatCard
            title="Completed Today"
            value={completedToday}
            icon={<FaSyringe className="text-2xl" />}
          />
          <StatCard
            title="Total Stock"
            value={`${totalStock} doses`}
            icon={<FaSyringe className="text-2xl" />}
          />
          <StatCard
            title="Staff Members"
            value={center.staff.length}
            icon={<FaUsers className="text-2xl" />}
          />
        </div>

        {/* Stock Alerts */}
        {lowStockAlerts.length > 0 && (
          <Card className="mb-8 border-l-4 border-orange-500 bg-orange-50">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="mt-1 text-2xl text-orange-600" />
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Low Stock Alert
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  {lowStockAlerts.map((stock) => (
                    <li key={stock.vaccineType}>
                      {stock.vaccineType}: Only {stock.remainingDoses} doses remaining
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Today's Appointments */}
          <Card>
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Today&apos;s Appointments
            </h3>
            {todayAppointments.length > 0 ? (
              <div className="space-y-3">
                {todayAppointments.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {appointment.citizenName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.vaccineType} - Dose {appointment.doseNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {appointment.timeSlot}
                      </p>
                    </div>
                    <Badge
                      variant={
                        appointment.status === "completed"
                          ? "success"
                          : appointment.status === "scheduled"
                            ? "info"
                            : "default"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No appointments for today</p>
            )}
          </Card>

          {/* Vaccine Stock */}
          <Card>
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Vaccine Inventory
            </h3>
            <div className="space-y-4">
              {center.vaccineStock.map((stock) => (
                <div key={stock.vaccineType} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="font-semibold text-gray-900">
                      {stock.vaccineType}
                    </h4>
                    <Badge
                      variant={stock.remainingDoses < 500 ? "warning" : "success"}
                    >
                      {stock.remainingDoses} left
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Total</p>
                      <p className="font-medium text-gray-900">{stock.totalDoses}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Used</p>
                      <p className="font-medium text-gray-900">{stock.usedDoses}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Wasted</p>
                      <p className="font-medium text-red-600">{stock.wastedDoses}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Expires: {new Date(stock.expiryDate).toLocaleDateString()}
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-600"
                      style={{
                        width: `${(stock.remainingDoses / stock.totalDoses) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Staff Members */}
        <Card className="mt-8">
          <h3 className="mb-4 text-xl font-bold text-gray-900">Staff Members</h3>
          <Table
            headers={["Name", "Role", "Phone"]}
            rows={center.staff.map((staff) => [
              staff.name,
              <Badge
                key={staff.id}
                variant={
                  staff.role === "doctor"
                    ? "info"
                    : staff.role === "nurse"
                      ? "success"
                      : "default"
                }
              >
                {staff.role}
              </Badge>,
              staff.phone,
            ])}
          />
        </Card>

        {/* Center Information */}
        <Card className="mt-8 bg-green-50">
          <h3 className="mb-3 text-lg font-bold text-gray-900">Center Information</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium text-gray-900">{center.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{center.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Operating Hours</p>
              <p className="font-medium text-gray-900">{center.operatingHours}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Daily Capacity</p>
              <p className="font-medium text-gray-900">
                {center.dailyCapacity} vaccinations
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Division</p>
              <p className="font-medium text-gray-900">{center.division}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">District</p>
              <p className="font-medium text-gray-900">{center.district}</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
