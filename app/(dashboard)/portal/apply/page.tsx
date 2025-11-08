"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { vaccinesApi, centersApi } from "@/lib/api/userApi";
import { API_URL } from "@/app/const/config";
import { useGlobal } from "@/app/context/GlobalContext";

export default function ApplyVaccine() {
  const router = useRouter();
  const { user } = useGlobal();
  const [loading, setLoading] = useState(false);
  //eslint-disable-next-line
  const [vaccines, setVaccines] = useState<any[]>([]);
  //eslint-disable-next-line
  const [centers, setCenters] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  // eslint-disable-next-line
  const [dateLists, setDateLists] = useState<any[]>([]);


  const [formData, setFormData] = useState({
    vaccineId: "",
    centerId: "",
    preferredDate: "",
    notes: "",
  });

  // Fetch vaccines and centers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // await fetch(`${API_URL}/all-info`,{
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({centerId:"690e7d14e53cceed86707edb"}),
        // });

        // Fetch vaccines
        const vaccinesResponse = await vaccinesApi.getAll();
        if (vaccinesResponse.data) {
          setVaccines(vaccinesResponse.data);
        }

        // Fetch centers
        const centersResponse = await centersApi.getAll();
        if (centersResponse.data) {
          setCenters(centersResponse.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get userId from context or localStorage
      let userId = user?.id || user?.uid;
      
      if (!userId) {
        // Fallback to localStorage
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            userId = userData._id || userData.id || userData.uid;
          } catch (err) {
            console.error("Error parsing user data:", err);
          }
        }
      }
      
      if (!userId) {
        setError("User not authenticated. Please login again.");
        return;
      }

      // Submit directly to the new appointments endpoint
      const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          vaccineId: formData.vaccineId,
          centerId: formData.centerId,
          dateSlotId: formData.preferredDate,
          notes: formData.notes || "",
        }),
      });

      const data = await response.json();

      if (data.success) {
        const timeSlot = data.data.timeSlot;
        alert(
          `Appointment created successfully!\n\n` +
          `Date: ${new Date(data.data.appointment.date).toLocaleDateString()}\n` +
          `Time: ${timeSlot.startTime} - ${timeSlot.endTime}\n\n` +
          `You will receive a confirmation email shortly.`
        );
        router.push("/portal");
      } else {
        setError(data.message || "Failed to create appointment");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
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
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Apply for Vaccine
          </h1>
          <p className="text-gray-600">
            Fill out the form below to request vaccination
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && !vaccines.length && !centers.length && (
          <div className="mb-6 flex items-center justify-center py-8">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        )}

        {/* Simple Form */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="vaccineId"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Vaccine Name <span className="text-red-500">*</span>
              </label>
              <select
                id="vaccineId"
                value={formData.vaccineId}
                onChange={(e) =>
                  setFormData({ ...formData, vaccineId: e.target.value })
                }
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                required
              >
                <option value="">Select a vaccine</option>
                {vaccines.map((vaccine) => (
                  <option key={vaccine.id || vaccine._id} value={vaccine.id || vaccine._id}>
                    {vaccine.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="centerId"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Vaccination Center <span className="text-red-500">*</span>
              </label>
              <select
                id="centerId"
                value={formData.centerId}
                onChange={async (e) =>{
                  setFormData({ ...formData, centerId: e.target.value })
                  console.log(e.target.value)
                  try {
                    const res = await fetch(`${API_URL}/get-all-dates`,{
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({centerId:e.target.value}),
                    });

                    const data = await res.json();
                    if (data.success && data.data.dateSlots) {
                      setDateLists(data.data.dateSlots);
                    } else {
                      setDateLists([]);
                      console.error("Failed to fetch date slots:", data.message);
                    }
                  } catch (error) {
                    console.error("Error fetching date slots:", error);
                    setDateLists([]);
                  }
                }}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                required
              >
                <option value="">Select a center</option>
                {centers.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.id} - {center.name} - {center.address}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="preferredDate"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <select
                  id="preferredDate"
                  value={formData.preferredDate}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredDate: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                  required
                  disabled={!formData.centerId}
                >
                  <option value="">
                    {!formData.centerId 
                      ? "Please select a center first" 
                      : dateLists.length === 0 
                      ? "No available dates" 
                      : "Select a date"}
                  </option>
                  {dateLists.map((dateSlot) => (
                    <option key={dateSlot._id} value={dateSlot._id}>
                      {new Date(dateSlot.date).toLocaleDateString()} 
                      {dateSlot.capacity && dateSlot.booked !== undefined 
                        ? ` (${dateSlot.capacity - dateSlot.booked} slots available)` 
                        : ''}
                    </option>
                  ))}
                </select>
              </div>

            </div>


            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-green-400"
            >
              <FaCheckCircle />
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
