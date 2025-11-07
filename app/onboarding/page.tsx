"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSyringe, FaMapMarkerAlt, FaCalendar, FaCheckCircle, FaArrowRight, FaArrowLeft, FaSignOutAlt } from "react-icons/fa";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    address: "",
    division: "",
    district: "",
    emergencyContact: "",
    medicalConditions: "",
    allergies: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("needsOnboarding");
    router.push("/login");
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      localStorage.setItem("needsOnboarding", "false");
      localStorage.setItem("onboardingCompleted", "true");
      router.push("/portal");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600">
                <FaSyringe className="text-xl text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Protirodh</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <div className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step >= 1 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > 1 ? <FaCheckCircle /> : "1"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Personal Info</p>
              </div>
              <div className="flex-1 border-t-2 border-gray-300"></div>
            </div>

            <div className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step >= 2 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > 2 ? <FaCheckCircle /> : "2"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Address</p>
              </div>
              <div className="flex-1 border-t-2 border-gray-300"></div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step >= 3 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > 3 ? <FaCheckCircle /> : "3"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Medical Info</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          {step === 1 && (
            <div>
              <div className="mb-8">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  Personal Information
                </h2>
                <p className="text-gray-600">
                  Let&apos;s start with your basic information
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaCalendar className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData({ ...formData, dateOfBirth: e.target.value })
                      }
                      className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {["Male", "Female", "Other"].map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender })}
                        className={`rounded-lg border-2 py-3 font-medium transition-all ${
                          formData.gender === gender
                            ? "border-green-600 bg-green-50 text-green-600"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Emergency Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+880 1XXX-XXXXXX"
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyContact: e.target.value })
                    }
                    className="block w-full rounded-lg border border-gray-300 py-3 px-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-8">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Address Information</h2>
                <p className="text-gray-600">Where can we reach you?</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute top-3 left-3">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <textarea
                      placeholder="Enter your complete address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      rows={3}
                      className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Division <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.division}
                      onChange={(e) =>
                        setFormData({ ...formData, division: e.target.value })
                      }
                      className="block w-full rounded-lg border border-gray-300 py-3 px-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                      District <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your district"
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                      className="block w-full rounded-lg border border-gray-300 py-3 px-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mb-8">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Medical Information</h2>
                <p className="text-gray-600">
                  Help us provide better care (Optional)
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Known Medical Conditions
                  </label>
                  <textarea
                    placeholder="E.g., Diabetes, Hypertension, Asthma (Leave blank if none)"
                    value={formData.medicalConditions}
                    onChange={(e) =>
                      setFormData({ ...formData, medicalConditions: e.target.value })
                    }
                    rows={3}
                    className="block w-full rounded-lg border border-gray-300 py-3 px-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Known Allergies
                  </label>
                  <textarea
                    placeholder="E.g., Penicillin, Eggs, Latex (Leave blank if none)"
                    value={formData.allergies}
                    onChange={(e) =>
                      setFormData({ ...formData, allergies: e.target.value })
                    }
                    rows={3}
                    className="block w-full rounded-lg border border-gray-300 py-3 px-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-green-900">
                    <strong>Note:</strong> This information helps vaccination centers provide better care
                    and identify any potential contraindications. All data is kept confidential.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between gap-4">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <FaArrowLeft />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className={`ml-auto flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 ${
                step === 1 && "w-full justify-center"
              }`}
            >
              {step === 3 ? "Complete Setup" : "Continue"}
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
