"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSyringe, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

// Mock data
const VACCINES = [
  { id: 1, name: "Pfizer-BioNTech", description: "mRNA vaccine", available: true },
  { id: 2, name: "Moderna", description: "mRNA vaccine", available: true },
  { id: 3, name: "AstraZeneca", description: "Viral vector vaccine", available: true },
  { id: 4, name: "Sinopharm", description: "Inactivated vaccine", available: false },
];

const CENTERS = {
  1: [
    { id: 101, name: "Dhaka Medical College", location: "Dhaka", distance: "2.5 km" },
    { id: 102, name: "Bangabandhu Medical College", location: "Dhaka", distance: "3.8 km" },
    { id: 103, name: "Sir Salimullah Medical College", location: "Dhaka", distance: "5.2 km" },
  ],
  2: [
    { id: 201, name: "Square Hospital", location: "Dhaka", distance: "1.8 km" },
    { id: 202, name: "United Hospital", location: "Dhaka", distance: "4.2 km" },
    { id: 203, name: "Apollo Hospital", location: "Dhaka", distance: "6.1 km" },
  ],
  3: [
    { id: 301, name: "Chittagong Medical College", location: "Chittagong", distance: "3.1 km" },
    { id: 302, name: "Evercare Hospital Chittagong", location: "Chittagong", distance: "4.5 km" },
    { id: 303, name: "CSCR Hospital", location: "Chittagong", distance: "5.8 km" },
  ],
};

const DATE_SLOTS = [
  { id: 1, date: "2024-11-10", day: "Sunday", available: 15 },
  { id: 2, date: "2024-11-11", day: "Monday", available: 20 },
  { id: 3, date: "2024-11-12", day: "Tuesday", available: 8 },
  { id: 4, date: "2024-11-13", day: "Wednesday", available: 25 },
  { id: 5, date: "2024-11-14", day: "Thursday", available: 0 },
  { id: 6, date: "2024-11-15", day: "Friday", available: 18 },
];

const TIME_SLOTS = [
  { id: 1, time: "09:00 AM", available: true },
  { id: 2, time: "10:00 AM", available: true },
  { id: 3, time: "11:00 AM", available: false },
  { id: 4, time: "12:00 PM", available: true },
  { id: 5, time: "02:00 PM", available: true },
  { id: 6, time: "03:00 PM", available: true },
  { id: 7, time: "04:00 PM", available: false },
  { id: 8, time: "05:00 PM", available: true },
];

export default function ApplyVaccine() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedVaccine, setSelectedVaccine] = useState<number | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVaccineSelect = (vaccineId: number) => {
    setSelectedVaccine(vaccineId);
    setSelectedCenter(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleCenterSelect = (centerId: number) => {
    setSelectedCenter(centerId);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setStep(5);
  };

  const getSelectedVaccineName = () => {
    return VACCINES.find(v => v.id === selectedVaccine)?.name || "";
  };

  const getSelectedCenterName = () => {
    const allCenters = Object.values(CENTERS).flat();
    return allCenters.find(c => c.id === selectedCenter)?.name || "";
  };

  const getSelectedDate = () => {
    return DATE_SLOTS.find(d => d.id === selectedDate)?.date || "";
  };

  const getSelectedTime = () => {
    return TIME_SLOTS.find(t => t.id === selectedTime)?.time || "";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <button
            onClick={() => router.push("/portal")}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft />
            Back to Portal
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Apply for Vaccine</h1>
          <p className="mt-2 text-gray-600">Complete the steps below to book your appointment</p>
        </div>

        {step < 5 && (
          <div className="mb-8 flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                    step >= s ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`h-1 w-20 ${
                      step > s ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <FaSyringe className="text-2xl text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Select Vaccine</h2>
            </div>
            <div className="space-y-3">
              {VACCINES.map((vaccine) => (
                <button
                  key={vaccine.id}
                  disabled={!vaccine.available}
                  onClick={() => handleVaccineSelect(vaccine.id)}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                    selectedVaccine === vaccine.id
                      ? "border-green-600 bg-green-50"
                      : vaccine.available
                      ? "border-gray-200 hover:border-green-300"
                      : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{vaccine.name}</h3>
                      <p className="text-sm text-gray-600">{vaccine.description}</p>
                    </div>
                    {!vaccine.available && (
                      <span className="text-xs font-medium text-red-600">Unavailable</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!selectedVaccine}
              className="mt-6 w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next: Select Center
            </button>
          </div>
        )}

        {step === 2 && selectedVaccine && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <FaMapMarkerAlt className="text-2xl text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Select Center</h2>
            </div>
            <div className="mb-4 rounded-lg bg-green-50 p-3">
              <p className="text-sm text-green-800">
                Vaccine: <span className="font-semibold">{getSelectedVaccineName()}</span>
              </p>
            </div>
            <div className="space-y-3">
              {CENTERS[selectedVaccine as keyof typeof CENTERS]?.map((center) => (
                <button
                  key={center.id}
                  onClick={() => handleCenterSelect(center.id)}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                    selectedCenter === center.id
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{center.name}</h3>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                    <span>{center.location}</span>
                    <span>•</span>
                    <span>{center.distance} away</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedCenter}
                className="flex-1 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next: Select Date
              </button>
            </div>
          </div>
        )}

        {step === 3 && selectedCenter && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <FaCalendarAlt className="text-2xl text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Select Date</h2>
            </div>
            <div className="mb-4 rounded-lg bg-green-50 p-3">
              <p className="text-sm text-green-800">
                Center: <span className="font-semibold">{getSelectedCenterName()}</span>
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {DATE_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  disabled={slot.available === 0}
                  onClick={() => setSelectedDate(slot.id)}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    selectedDate === slot.id
                      ? "border-green-600 bg-green-50"
                      : slot.available > 0
                      ? "border-gray-200 hover:border-green-300"
                      : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="font-semibold text-gray-900">{slot.day}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(slot.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="mt-2 text-xs">
                    {slot.available > 0 ? (
                      <span className="text-green-600">{slot.available} slots available</span>
                    ) : (
                      <span className="text-red-600">No slots</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!selectedDate}
                className="flex-1 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next: Select Time
              </button>
            </div>
          </div>
        )}

        {step === 4 && selectedDate && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <FaClock className="text-2xl text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Select Time</h2>
            </div>
            <div className="mb-4 rounded-lg bg-green-50 p-3">
              <p className="text-sm text-green-800">
                Date: <span className="font-semibold">{new Date(getSelectedDate()).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}</span>
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.id)}
                  className={`rounded-xl border-2 p-4 text-center font-semibold transition-all ${
                    selectedTime === slot.id
                      ? "border-green-600 bg-green-50 text-green-900"
                      : slot.available
                      ? "border-gray-200 text-gray-900 hover:border-green-300"
                      : "border-gray-200 bg-gray-50 text-gray-400 opacity-50 cursor-not-allowed"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedTime || isSubmitting}
                className="flex-1 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <FaCheckCircle className="text-4xl text-green-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
            <p className="mb-8 text-gray-600">Your vaccination appointment has been successfully booked</p>
            
            <div className="mb-8 space-y-4 rounded-xl bg-gray-50 p-6 text-left">
              <div className="flex justify-between border-b border-gray-200 pb-3">
                <span className="text-gray-600">Vaccine</span>
                <span className="font-semibold text-gray-900">{getSelectedVaccineName()}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-3">
                <span className="text-gray-600">Center</span>
                <span className="font-semibold text-gray-900">{getSelectedCenterName()}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-3">
                <span className="text-gray-600">Date</span>
                <span className="font-semibold text-gray-900">
                  {new Date(getSelectedDate()).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time</span>
                <span className="font-semibold text-gray-900">{getSelectedTime()}</span>
              </div>
            </div>

            <button
              onClick={() => router.push("/portal")}
              className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-green-700"
            >
              Back to Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
