"use client";

import Link from "next/link";
import { FaHome, FaUsers, FaHospital, FaSyringe, FaChartLine, FaExclamationCircle } from "react-icons/fa";
import { Card, StatCard, Table, Badge } from "@/components/ui";
import {
  mockDashboardStats,
  mockVaccinationCenters,
  mockWastageReports,
  mockSupplyChain,
} from "@/lib/mockData";

export default function AuthorityDashboard() {
  const stats = mockDashboardStats;

  // Calculate totals
  const totalStock = mockVaccinationCenters.reduce(
    (sum, center) =>
      sum +
      center.vaccineStock.reduce(
        (stockSum, stock) => stockSum + stock.remainingDoses,
        0
      ),
    0
  );

  const totalWastage = mockVaccinationCenters.reduce(
    (sum, center) =>
      sum +
      center.vaccineStock.reduce(
        (stockSum, stock) => stockSum + stock.wastedDoses,
        0
      ),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
              <FaHome className="text-xl" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Authority Dashboard</h1>
              <p className="text-sm text-gray-600">Vaccination Management Overview</p>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Key Metrics */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <StatCard
            title="Total Vaccinations"
            value={stats.totalVaccinations.toLocaleString()}
            icon={<FaSyringe className="text-2xl" />}
            trend="+12% from last month"
            trendUp={true}
          />
          <StatCard
            title="Citizens Registered"
            value={stats.totalCitizensRegistered.toLocaleString()}
            icon={<FaUsers className="text-2xl" />}
            trend="+8% from last month"
            trendUp={true}
          />
          <StatCard
            title="Vaccination Centers"
            value={stats.totalCenters}
            icon={<FaHospital className="text-2xl" />}
          />
          <StatCard
            title="Coverage Rate"
            value={`${stats.vaccinationRate}%`}
            icon={<FaChartLine className="text-2xl" />}
            trend="+3.2% from last month"
            trendUp={true}
          />
        </div>

        {/* Quick Stats Row */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="bg-blue-50">
            <h4 className="mb-2 text-sm font-medium text-gray-600">
              Today&apos;s Appointments
            </h4>
            <p className="text-3xl font-bold text-blue-600">
              {stats.todayAppointments}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {stats.completedToday} completed
            </p>
          </Card>

          <Card className="bg-green-50">
            <h4 className="mb-2 text-sm font-medium text-gray-600">
              Total Stock Available
            </h4>
            <p className="text-3xl font-bold text-green-600">
              {totalStock.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-gray-600">doses across all centers</p>
          </Card>

          <Card className="bg-red-50">
            <h4 className="mb-2 text-sm font-medium text-gray-600">
              Total Wastage
            </h4>
            <p className="text-3xl font-bold text-red-600">{totalWastage}</p>
            <p className="mt-1 text-sm text-gray-600">
              {((totalWastage / (totalStock + totalWastage)) * 100).toFixed(2)}%
              wastage rate
            </p>
          </Card>
        </div>

        {/* Alerts */}
        {stats.stockAlerts > 0 && (
          <Card className="mb-8 border-l-4 border-red-500 bg-red-50">
            <div className="flex items-start gap-3">
              <FaExclamationCircle className="mt-1 text-2xl text-red-600" />
              <div>
                <h3 className="mb-1 font-semibold text-gray-900">
                  {stats.stockAlerts} Stock Alerts
                </h3>
                <p className="text-sm text-gray-700">
                  Some vaccination centers are running low on vaccine stock. Immediate action required.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Vaccination Centers Overview */}
          <Card>
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Vaccination Centers
            </h3>
            <div className="space-y-3">
              {mockVaccinationCenters.map((center) => {
                const centerStock = center.vaccineStock.reduce(
                  (sum, stock) => sum + stock.remainingDoses,
                  0
                );
                const hasLowStock = center.vaccineStock.some(
                  (stock) => stock.remainingDoses < 500
                );

                return (
                  <div
                    key={center.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {center.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {center.division} • {center.district}
                        </p>
                      </div>
                      {hasLowStock && (
                        <Badge variant="warning">Low Stock</Badge>
                      )}
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Stock</p>
                        <p className="font-medium text-gray-900">
                          {centerStock} doses
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Capacity</p>
                        <p className="font-medium text-gray-900">
                          {center.dailyCapacity}/day
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Staff</p>
                        <p className="font-medium text-gray-900">
                          {center.staff.length}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Supply Chain Status */}
          <Card>
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Supply Chain Status
            </h3>
            <div className="space-y-3">
              {mockSupplyChain.map((shipment) => (
                <div
                  key={shipment.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {shipment.vaccineType}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {shipment.quantity} doses
                      </p>
                    </div>
                    <Badge
                      variant={
                        shipment.status === "delivered"
                          ? "success"
                          : shipment.status === "in-transit"
                            ? "info"
                            : "warning"
                      }
                    >
                      {shipment.status}
                    </Badge>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    <p>From: {shipment.fromLocation}</p>
                    <p>To: {shipment.toLocation}</p>
                    <p>Shipped: {new Date(shipment.shippedDate).toLocaleDateString()}</p>
                    {shipment.receivedDate && (
                      <p>Received: {new Date(shipment.receivedDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Wastage Reports */}
        <Card className="mt-8">
          <h3 className="mb-4 text-xl font-bold text-gray-900">
            Recent Wastage Reports
          </h3>
          <Table
            headers={["Date", "Center", "Vaccine Type", "Wasted Doses", "Reason"]}
            rows={mockWastageReports.map((report) => [
              new Date(report.date).toLocaleDateString(),
              report.centerName,
              report.vaccineType,
              <span key={report.centerId} className="font-semibold text-red-600">
                {report.wastedDoses}
              </span>,
              report.reason,
            ])}
          />
        </Card>

        {/* Coverage by Division (Simple Visualization) */}
        <Card className="mt-8">
          <h3 className="mb-4 text-xl font-bold text-gray-900">
            Coverage by Division
          </h3>
          <div className="space-y-4">
            {[
              { division: "Dhaka", coverage: 85 },
              { division: "Chittagong", coverage: 78 },
              { division: "Rajshahi", coverage: 72 },
              { division: "Khulna", coverage: 68 },
              { division: "Sylhet", coverage: 65 },
            ].map((item) => (
              <div key={item.division}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {item.division}
                  </span>
                  <span className="text-sm font-semibold text-gray-600">
                    {item.coverage}%
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-200">
                  <div
                    className="h-3 rounded-full bg-blue-600"
                    style={{ width: `${item.coverage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Vaccine Distribution */}
        <Card className="mt-8">
          <h3 className="mb-4 text-xl font-bold text-gray-900">
            Vaccine Type Distribution
          </h3>
          <div className="grid gap-4 md:grid-cols-5">
            {[
              { name: "Pfizer-BioNTech", count: 4200, color: "bg-blue-600" },
              { name: "Moderna", count: 3800, color: "bg-green-600" },
              { name: "AstraZeneca", count: 2100, color: "bg-purple-600" },
              { name: "Sinopharm", count: 1600, color: "bg-yellow-600" },
              { name: "Sinovac", count: 800, color: "bg-red-600" },
            ].map((vaccine) => (
              <div key={vaccine.name} className="text-center">
                <div
                  className={`mx-auto mb-2 h-24 w-24 rounded-full ${vaccine.color} flex items-center justify-center text-white`}
                >
                  <div>
                    <p className="text-2xl font-bold">{vaccine.count}</p>
                    <p className="text-xs">doses</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {vaccine.name}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Insights & Recommendations */}
        <Card className="mt-8 bg-purple-50">
          <h3 className="mb-3 text-lg font-bold text-gray-900">
            Key Insights & Recommendations
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-green-600">✓</span>
              <span>Vaccination rate has increased by 12% compared to last month</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-orange-600">!</span>
              <span>2 centers require immediate vaccine stock replenishment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-600">ℹ</span>
              <span>Peak vaccination hours are between 10 AM - 2 PM across all centers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-600">⚠</span>
              <span>Wastage rate is at 1.2%, focus on cold chain management</span>
            </li>
          </ul>
        </Card>
      </main>
    </div>
  );
}
