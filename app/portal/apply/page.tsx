"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaSyringe,
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";

const availableVaccines = [
  {
    id: "pfizer",
    name: "Pfizer-BioNTech",
    description: "mRNA vaccine, highly effective against COVID-19",
    availability: "Available",
    doses: 2,
  },
  {
    id: "moderna",
    name: "Moderna",
    description: "mRNA vaccine with strong protection",
    availability: "Available",
    doses: 2,
  },
  {
    id: "astrazeneca",
    name: "AstraZeneca",
    description: "Viral vector vaccine, widely used",
    availability: "Limited",
    doses: 2,
  },
];

const vaccinationCenters = [
  {
    id: "vc001",
    name: "Dhaka Medical College Vaccination Center",
    address: "Bakshibazar, Dhaka-1000",
    division: "Dhaka",
    zila: "Dhaka",
    upzila: "Mohammadpur",
  },
  {
    id: "vc002",
    name: "Chittagong Medical College Center",
    address: "K.B. Fazlul Kader Road, Chittagong",
    division: "Chittagong",
    zila: "Chittagong",
    upzila: "Panchlaish",
  },
  {
    id: "vc003",
    name: "Rajshahi Medical College Center",
    address: "Laxmipur, Rajshahi",
    division: "Rajshahi",
    zila: "Rajshahi",
    upzila: "Boalia",
  },
  {
    id: "vc004",
    name: "Mirpur Community Health Center",
    address: "Mirpur-10, Dhaka",
    division: "Dhaka",
    zila: "Dhaka",
    upzila: "Mirpur",
  },
  {
    id: "vc005",
    name: "Uttara Modern Medical Center",
    address: "Sector-7, Uttara, Dhaka",
    division: "Dhaka",
    zila: "Dhaka",
    upzila: "Uttara",
  },
];

// Mock function to get available date slots for a center
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAvailableDateSlots = (_centerId: string) => {
  const today = new Date();
  const slots: Array<{
    id: string;
    date: string;
    available: boolean;
    slotsLeft: number;
  }> = [];
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    // Mock: Skip some dates to simulate unavailability
    if (i !== 3 && i !== 7 && i !== 10) {
      slots.push({
        id: `date-${i}`,
        date: date.toISOString().split("T")[0],
        available: true,
        slotsLeft: Math.floor(Math.random() * 20) + 5,
      });
    }
  }
  return slots;
};

// Mock function to get time slots for a specific date
const getTimeSlots = (_centerId: string, date: string) => {
  // Mock: Return different availability based on date
  const dayOfWeek = new Date(date).getDay();
  return [
    { id: "slot1", time: "9:00 AM - 10:00 AM", available: dayOfWeek !== 0 },
    { id: "slot2", time: "10:00 AM - 11:00 AM", available: true },
    { id: "slot3", time: "11:00 AM - 12:00 PM", available: dayOfWeek !== 5 },
    { id: "slot4", time: "12:00 PM - 1:00 PM", available: true },
    { id: "slot5", time: "2:00 PM - 3:00 PM", available: dayOfWeek !== 6 },
    { id: "slot6", time: "3:00 PM - 4:00 PM", available: true },
    { id: "slot7", time: "4:00 PM - 5:00 PM", available: dayOfWeek !== 0 },
  ];
};

export default function ApplyVaccine() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showManualCenterForm, setShowManualCenterForm] = useState(false);
  const [availableDates, setAvailableDates] = useState<
    Array<{
      id: string;
      date: string;
      available: boolean;
      slotsLeft: number;
    }>
  >([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<
    Array<{
      id: string;
      time: string;
      available: boolean;
    }>
  >([]);
  const [formData, setFormData] = useState({
    vaccine: "",
    doseNumber: "",
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

  // Mock user data - get from localStorage in real app
  const userData = {
    division: "Dhaka",
    zila: "Dhaka",
    upzila: "Mirpur",
  };

  // Get suggested centers based on user location
  const suggestedCenters = vaccinationCenters.filter(
    (center) =>
      center.division === userData.division &&
      (center.zila === userData.zila || center.upzila === userData.upzila)
  );

  const otherCenters = vaccinationCenters.filter(
    (center) => !suggestedCenters.includes(center)
  );

  // Update available dates when center is selected
  const handleCenterSelect = (centerId: string) => {
    setFormData({ ...formData, center: centerId, date: "", timeSlot: "" });
    setShowManualCenterForm(false);
    const dates = getAvailableDateSlots(centerId);
    setAvailableDates(dates);
    setAvailableTimeSlots([]);
  };

  // Handle manual center form submission
  const handleManualCenterSubmit = () => {
    if (
      formData.manualCenterName &&
      formData.manualCenterAddress &&
      formData.manualCenterDivision
    ) {
      // Mock: Set a dummy center ID for manual entry
      setFormData({ ...formData, center: "manual-center" });
      const dates = getAvailableDateSlots("manual-center");
      setAvailableDates(dates);
      setAvailableTimeSlots([]);
      setStep(4); // Move to date selection
    }
  };

  // Update available time slots when date is selected
  const handleDateSelect = (date: string) => {
    setFormData({ ...formData, date, timeSlot: "" });
    const slots = getTimeSlots(formData.center, date);
    setAvailableTimeSlots(slots);
  };

  const handleSubmit = () => {
    // Mock submission
    router.push("/portal?applied=true");
  };

  const selectedVaccine = availableVaccines.find((v) => v.id === formData.vaccine);
  const selectedCenter = vaccinationCenters.find((c) => c.id === formData.center);
  
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
            <div className="text-sm font-medium text-gray-600">Step {step} of 4</div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Apply for Vaccine</h1>
          <p className="text-gray-600">Select your preferences and book your vaccination</p>
        </div>

        {/* Step 1: Select Vaccine */}
        {step === 1 && (
          <div>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Choose Your Vaccine
            </h2>
            <div className="space-y-4">
              {availableVaccines.map((vaccine) => (
                <button
                  key={vaccine.id}
                  onClick={() => {
                    setFormData({ ...formData, vaccine: vaccine.id });
                    setStep(2);
                  }}
                  className={`w-full rounded-xl border-2 p-6 text-left transition-all ${
                    formData.vaccine === vaccine.id
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
                      <p className="mb-2 text-sm text-gray-600">{vaccine.description}</p>
                      <p className="text-xs text-gray-500">
                        Requires {vaccine.doses} doses
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        vaccine.availability === "Available"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {vaccine.availability}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Dose */}
        {step === 2 && selectedVaccine && (
          <div>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Select Dose Number
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, "Booster"].map((dose) => (
                <button
                  key={dose}
                  onClick={() => {
                    setFormData({ ...formData, doseNumber: dose.toString() });
                    setStep(3);
                  }}
                  className="rounded-xl border-2 border-gray-200 bg-white p-6 text-center transition-all hover:border-green-600 hover:bg-green-50"
                >
                  <div className="mb-3 text-3xl font-bold text-green-600">{dose}</div>
                  <p className="text-sm text-gray-600">
                    {typeof dose === "number" ? `Dose ${dose}` : "Booster Shot"}
                  </p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft />
              Change vaccine
            </button>
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
                      key={center.id}
                      onClick={() => handleCenterSelect(center.id)}
                      className={`w-full rounded-xl border-2 p-5 text-left transition-all ${
                        formData.center === center.id
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
                            {center.upzila}, {center.zila}, {center.division}
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
                      key={center.id}
                      onClick={() => handleCenterSelect(center.id)}
                      className={`w-full rounded-xl border-2 p-5 text-left transition-all ${
                        formData.center === center.id
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
                            {center.upzila}, {center.zila}, {center.division}
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
                      key={dateSlot.id}
                      onClick={() => handleDateSelect(dateSlot.date)}
                      className={`rounded-lg border-2 p-3 text-center transition-all ${
                        formData.date === dateSlot.date
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
                        {dateSlot.slotsLeft} slots
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
              onClick={() => setStep(2)}
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
                    {new Date(formData.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            )}

            <div className="mb-6 grid gap-4 md:grid-cols-2">
              {availableTimeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => {
                    if (slot.available) {
                      setFormData({ ...formData, timeSlot: slot.time });
                    }
                  }}
                  disabled={!slot.available}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    !slot.available
                      ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-50"
                      : formData.timeSlot === slot.time
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

            {availableTimeSlots.length === 0 && (
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
                    <span className="text-gray-600">Dose:</span>
                    <span className="font-medium text-gray-900">{formData.doseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Center:</span>
                    <span className="font-medium text-gray-900">{getSelectedCenterName()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(formData.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium text-gray-900">{formData.timeSlot}</span>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
                >
                  <FaCheckCircle />
                  Confirm Application
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
