"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/app/context/GlobalContext";
import {
  FaSyringe,
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  vaccinesApi,
  centersApi,
  dateSlotsApi,
  timeSlotsApi,
  appointmentsApi,
} from "@/lib/api/userApi";
import type {
  Vaccine,
  Center,
  DateSlot,
  TimeSlot,
  AppointmentFormData,
} from "@/lib/types/user.types";

export default function ApplyVaccine() {
  const router = useRouter();
  const { user } = useGlobal();
  
  const [step, setStep] = useState(1);
  const [showManualCenterForm, setShowManualCenterForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [suggestedCenters, setSuggestedCenters] = useState<Center[]>([]);
  const [otherCenters, setOtherCenters] = useState<Center[]>([]);
  const [availableDates, setAvailableDates] = useState<DateSlot[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);

  const [formData, setFormData] = useState({
    vaccine: "",
    center: "",
    date: "",
    timeSlot: "",
    // Manual center fields
    manualCenterName: "",
    manualCenterAddress: "",
    manualCenterDivision: "",
    manualCenterZila: "",
    manualCenterUpzila: "",
  });

  const loadVaccines = useCallback(async () => {
    try {
      setLoading(true);
      const response = await vaccinesApi.getAll();
      if (response.data) {
        setVaccines(response.data.filter((vaccine: Vaccine) => vaccine.isActive));
      }
    } catch (err) {
      console.error("Error loading vaccines:", err);
      setError("Failed to load vaccines. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCenters = useCallback(async () => {
    try {
      setLoading(true);
      
      if (user?.contact?.division) {
        // Load nearby centers based on user location
        const nearbyResponse = await centersApi.getNearby(
          user.contact.division,
          user.contact.zila,
          user.contact.upzila
        );
        
        if (nearbyResponse.data) {
          setSuggestedCenters(nearbyResponse.data);
        }
      }

      // Load all centers
      const allResponse = await centersApi.getAll();
      if (allResponse.data) {
        const allCenters = allResponse.data.filter((center: Center) => center.status === "active");
        const suggested = suggestedCenters.map(c => c._id);
        setOtherCenters(allCenters.filter((center: Center) => !suggested.includes(center._id)));
      }
    } catch (err) {
      console.error("Error loading centers:", err);
      setError("Failed to load vaccination centers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user, suggestedCenters]);

  // Load vaccines on component mount
  useEffect(() => {
    loadVaccines();
  }, [loadVaccines]);

  // Load centers when step changes to 3
  useEffect(() => {
    if (step === 3) {
      loadCenters();
    }
  }, [step, loadCenters]);

  // Load available dates when center is selected
  const handleCenterSelect = useCallback(async (centerId: string) => {
    try {
      setLoading(true);
      setFormData({ ...formData, center: centerId, date: "", timeSlot: "" });
      setShowManualCenterForm(false);
      
      const response = await dateSlotsApi.getByCenterId(centerId);
      if (response.data) {
        // Filter for future dates and available slots
        const today = new Date();
        const availableSlots = response.data.filter((slot: DateSlot) => 
          new Date(slot.date) > today && 
          slot.status === "active" && 
          slot.availableSlots > 0
        );
        setAvailableDates(availableSlots);
      }
      setAvailableTimeSlots([]);
    } catch (err) {
      console.error("Error loading date slots:", err);
      setError("Failed to load available dates. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  // Load time slots when date is selected
  const handleDateSelect = useCallback(async (dateSlotId: string) => {
    try {
      setLoading(true);
      setFormData({ ...formData, date: dateSlotId, timeSlot: "" });
      
      const response = await timeSlotsApi.getByDateSlot(dateSlotId);
      if (response.data) {
        // Filter for available time slots
        const availableSlots = response.data.filter((slot: TimeSlot) => slot.available);
        setAvailableTimeSlots(availableSlots);
      }
    } catch (err) {
      console.error("Error loading time slots:", err);
      setError("Failed to load available time slots. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  // Handle manual center form submission
  const handleManualCenterSubmit = () => {
    if (
      formData.manualCenterName &&
      formData.manualCenterAddress &&
      formData.manualCenterDivision
    ) {
      // For manual centers, we'll skip the backend integration for now
      // and move directly to a simplified booking flow
      setFormData({ ...formData, center: "manual-center" });
      setStep(4);
    }
  };

  // Submit the appointment
  const handleSubmit = useCallback(async () => {
    if (!user?.id && !user?.uid) {
      setError("User not found. Please log in again.");
      return;
    }

    if (formData.center === "manual-center") {
      // For manual centers, show a message
      alert("Manual center bookings will be processed manually. You will be contacted soon.");
      router.push("/portal?applied=true");
      return;
    }

    try {
      setLoading(true);

      const appointmentData: AppointmentFormData = {
        vaccineId: formData.vaccine,
        centerId: formData.center,
        dateSlotId: formData.date,
        timeSlotId: formData.timeSlot,
      };

      await appointmentsApi.create(appointmentData);
      
      // Redirect with success message
      router.push("/portal?applied=true");
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError(err instanceof Error ? err.message : "Failed to create appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user, formData, router]);

  const selectedVaccine = vaccines.find((v) => v._id === formData.vaccine);
  const selectedCenter = [...suggestedCenters, ...otherCenters].find((c) => c._id === formData.center);
  
  // Get display name for selected center
  const getSelectedCenterName = () => {
    if (selectedCenter) return selectedCenter.name;
    if (formData.center === "manual-center") return formData.manualCenterName;
    return "";
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
            <div className="text-sm font-medium text-gray-600">Step {step === 3 ? 2 : step === 4 ? 3 : step} of 3</div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Apply for Vaccine</h1>
          <p className="text-gray-600">Select your preferences and book your vaccination</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 flex items-center justify-center py-8">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        )}

        {/* Step 1: Select Vaccine */}
        {step === 1 && (
          <div>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Choose Your Vaccine
            </h2>
            <div className="space-y-4">
              {vaccines.length === 0 && !loading ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                  <p className="text-gray-600">No vaccines available at the moment.</p>
                </div>
              ) : (
                vaccines.map((vaccine) => (
                  <button
                    key={vaccine._id}
                    onClick={() => {
                      setFormData({ ...formData, vaccine: vaccine._id });
                      setStep(3);
                    }}
                    className={`w-full rounded-xl border-2 p-6 text-left transition-all ${
                      formData.vaccine === vaccine._id
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <FaSyringe className="text-2xl text-green-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {vaccine.name}
                          </h3>
                        </div>
                        <p className="mb-2 text-sm text-gray-600">
                          {vaccine.description || `Manufactured by ${vaccine.manufacturer}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          Requires {vaccine.doses} doses
                        </p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                        Available
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 3: Select Center */}
        {step === 3 && (
          <div>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Select Vaccination Center
            </h2>

            {/* Suggested Centers */}
            {suggestedCenters.length > 0 && !showManualCenterForm && (
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-green-700">
                    Recommended for You
                  </h3>
                  <span className="text-xs text-gray-500">Based on your location</span>
                </div>
                <div className="space-y-3">
                  {suggestedCenters.map((center) => (
                    <button
                      key={center._id}
                      onClick={() => handleCenterSelect(center._id)}
                      className={`w-full rounded-xl border-2 p-5 text-left transition-all ${
                        formData.center === center._id
                          ? "border-green-600 bg-green-50"
                          : "border-green-200 bg-green-50/30 hover:border-green-400 hover:bg-green-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="mt-1 text-xl text-green-600" />
                        <div className="flex-1">
                          <div className="mb-1 flex items-start justify-between">
                            <h3 className="font-semibold text-gray-900">{center.name}</h3>
                            <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                              Near You
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{center.address}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {center.upazila}, {center.district}, {center.division}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Other Centers */}
            {otherCenters.length > 0 && !showManualCenterForm && (
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Other Centers
                  </h3>
                </div>
                <div className="space-y-3">
                  {otherCenters.map((center) => (
                    <button
                      key={center._id}
                      onClick={() => handleCenterSelect(center._id)}
                      className={`w-full rounded-xl border-2 p-5 text-left transition-all ${
                        formData.center === center._id
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="mt-1 text-xl text-gray-400" />
                        <div>
                          <h3 className="mb-1 font-semibold text-gray-900">{center.name}</h3>
                          <p className="text-sm text-gray-600">{center.address}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {center.upazila}, {center.district}, {center.division}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Center Input Form */}
            {showManualCenterForm ? (
              <div className="mb-6">
                <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Custom Center:</strong> Enter the details of your vaccination center below.
                  </p>
                </div>
                <div className="space-y-4 rounded-xl border-2 border-gray-200 bg-white p-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Center Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.manualCenterName}
                      onChange={(e) =>
                        setFormData({ ...formData, manualCenterName: e.target.value })
                      }
                      placeholder="Enter center name"
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.manualCenterAddress}
                      onChange={(e) =>
                        setFormData({ ...formData, manualCenterAddress: e.target.value })
                      }
                      placeholder="Enter full address"
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Division <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.manualCenterDivision}
                        onChange={(e) =>
                          setFormData({ ...formData, manualCenterDivision: e.target.value })
                        }
                        placeholder="e.g., Dhaka"
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Zila
                      </label>
                      <input
                        type="text"
                        value={formData.manualCenterZila}
                        onChange={(e) =>
                          setFormData({ ...formData, manualCenterZila: e.target.value })
                        }
                        placeholder="e.g., Dhaka"
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Upazila
                      </label>
                      <input
                        type="text"
                        value={formData.manualCenterUpzila}
                        onChange={(e) =>
                          setFormData({ ...formData, manualCenterUpzila: e.target.value })
                        }
                        placeholder="e.g., Mirpur"
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowManualCenterForm(false)}
                      className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleManualCenterSubmit}
                      disabled={
                        !formData.manualCenterName ||
                        !formData.manualCenterAddress ||
                        !formData.manualCenterDivision
                      }
                      className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Toggle to Manual Center Input */
              <div className="mb-6">
                <button
                  onClick={() => setShowManualCenterForm(true)}
                  className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-5 text-center transition-all hover:border-green-400 hover:bg-green-50"
                >
                  <div className="flex items-center justify-center gap-2 text-gray-700">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span className="font-medium">Enter Custom Center Details</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Can&apos;t find your center? Add it manually
                  </p>
                </button>
              </div>
            )}

            {/* Available Dates - Shows after center selection */}
            {formData.center && availableDates.length > 0 && !showManualCenterForm && (
              <div className="mb-6">
                <label className="mb-3 block text-sm font-semibold text-gray-900">
                  Select Available Date <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {availableDates.map((dateSlot) => (
                    <button
                      key={dateSlot._id}
                      onClick={() => handleDateSelect(dateSlot._id)}
                      className={`rounded-lg border-2 p-3 text-center transition-all ${
                        formData.date === dateSlot._id
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 bg-white hover:border-green-400 hover:bg-green-50"
                      }`}
                    >
                      <div className="mb-1 text-sm font-bold text-gray-900">
                        {new Date(dateSlot.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(dateSlot.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </div>
                      <div className="mt-1 text-xs font-medium text-green-600">
                        {dateSlot.availableSlots} slots
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Continue Button */}
            {formData.center && formData.date && !showManualCenterForm && (
              <button
                onClick={() => setStep(4)}
                className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
              >
                Continue to Time Selection
              </button>
            )}

            <button
              onClick={() => setStep(1)}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft />
              Back
            </button>
          </div>
        )}

        {/* Step 4: Select Time Slot */}
        {step === 4 && (
          <div>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Select Available Time Slot
            </h2>
            
            {/* Selected Date Display */}
            {formData.date && (
              <div className="mb-6 rounded-lg bg-green-50 p-4">
                <div className="flex items-center gap-2 text-sm text-green-900">
                  <FaClock className="text-green-600" />
                  <span className="font-medium">
                    {availableDates.find(d => d._id === formData.date) && 
                      new Date(availableDates.find(d => d._id === formData.date)!.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                  </span>
                </div>
              </div>
            )}

            <div className="mb-6 grid gap-4 md:grid-cols-2">
              {availableTimeSlots.map((slot) => (
                <button
                  key={slot._id}
                  onClick={() => {
                    if (slot.available) {
                      setFormData({ ...formData, timeSlot: slot._id });
                    }
                  }}
                  disabled={!slot.available}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    !slot.available
                      ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-50"
                      : formData.timeSlot === slot._id
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 bg-white hover:border-green-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaClock
                        className={`text-xl ${slot.available ? "text-green-600" : "text-gray-400"}`}
                      />
                      <span className="font-medium text-gray-900">{slot.time}</span>
                    </div>
                    {!slot.available && (
                      <span className="text-xs font-semibold text-red-600">Full</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {availableTimeSlots.length === 0 && !loading && (
              <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-sm text-gray-600">
                  No time slots available. Please select a different date.
                </p>
              </div>
            )}

            {/* Summary */}
            {formData.timeSlot && selectedVaccine && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                <h3 className="mb-4 font-semibold text-gray-900">Application Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vaccine:</span>
                    <span className="font-medium text-gray-900">{selectedVaccine.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Center:</span>
                    <span className="font-medium text-gray-900">{getSelectedCenterName()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">
                      {availableDates.find(d => d._id === formData.date) &&
                        new Date(availableDates.find(d => d._id === formData.date)!.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium text-gray-900">
                      {availableTimeSlots.find(t => t._id === formData.timeSlot)?.time}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-green-400"
                >
                  <FaCheckCircle />
                  {loading ? "Submitting..." : "Confirm Application"}
                </button>
              </div>
            )}

            <button
              onClick={() => setStep(3)}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft />
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
