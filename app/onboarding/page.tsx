"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSyringe, FaMapMarkerAlt, FaCalendar, FaCheckCircle, FaArrowRight, FaArrowLeft, FaSignOutAlt } from "react-icons/fa";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    uid: "",
    nid: "",
    name: "",
    dob: "",
    gender: "",
    b_group: "",
    f_name: "",
    m_name: "",
    // Contact Information
    division: "",
    zila: "",
    upzila: "",
    village: "",
    house: "",
    // Additional
    emergencyContact: "",
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
      // Complete onboarding - save to localStorage
      const onboardingData = {
        uid: formData.uid,
        nid: formData.nid,
        b_group: formData.b_group,
        gender: formData.gender,
        name: formData.name,
        dob: formData.dob,
        f_name: formData.f_name,
        m_name: formData.m_name,
        contact: {
          division: formData.division,
          zila: formData.zila,
          upzila: formData.upzila,
          village: formData.village,
          house: formData.house,
        },
      };
      
      localStorage.setItem("onboardingData", JSON.stringify(onboardingData));
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
                <p className="text-sm font-medium text-gray-900">Contact Info</p>
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
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="block w-full rounded-lg border border-gray-300 py-3 px-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Father&apos;s Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Father's name"
                      value={formData.f_name}
                      onChange={(e) =>
                        setFormData({ ...formData, f_name: e.target.value })
                      }
                      className="block w-full rounded-lg border border-gray-300 py-3 px-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Mother&apos;s Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Mother's name"
                      value={formData.m_name}
                      onChange={(e) =>
                        setFormData({ ...formData, m_name: e.target.value })
                      }
                      className="block w-full rounded-lg border border-gray-300 py-3 px-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      National ID (NID) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your NID number"
                      value={formData.nid}
                      onChange={(e) =>
                        setFormData({ ...formData, nid: e.target.value })
                      }
                      className="block w-full rounded-lg border border-gray-300 py-3 px-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      UID
                    </label>
                    <input
                      type="text"
                      placeholder="Unique ID (if available)"
                      value={formData.uid}
                      onChange={(e) =>
                        setFormData({ ...formData, uid: e.target.value })
                      }
                      className="block w-full rounded-lg border border-gray-300 py-3 px-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
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
                        value={formData.dob}
                        onChange={(e) =>
                          setFormData({ ...formData, dob: e.target.value })
                        }
                        className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Blood Group
                    </label>
                    <select
                      value={formData.b_group}
                      onChange={(e) =>
                        setFormData({ ...formData, b_group: e.target.value })
                      }
                      className="block w-full rounded-lg border border-gray-300 py-3 px-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
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
                      Zila (District) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your district"
                      value={formData.zila}
                      onChange={(e) =>
                        setFormData({ ...formData, zila: e.target.value })
                      }
                      className="block w-full rounded-lg border border-gray-300 py-3 px-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Upazila
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your upazila"
                      value={formData.upzila}
                      onChange={(e) =>
                        setFormData({ ...formData, upzila: e.target.value })
                      }
                      className="block w-full rounded-lg border border-gray-300 py-3 px-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Village/Area
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your village or area"
                      value={formData.village}
                      onChange={(e) =>
                        setFormData({ ...formData, village: e.target.value })
                      }
                      className="block w-full rounded-lg border border-gray-300 py-3 px-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    House/Holding Number
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute top-3 left-3">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter house/holding number"
                      value={formData.house}
                      onChange={(e) =>
                        setFormData({ ...formData, house: e.target.value })
                      }
                      className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mb-8">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Contact & Emergency</h2>
                <p className="text-gray-600">
                  Final step - emergency contact information
                </p>
              </div>

              <div className="space-y-6">
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
                  <p className="mt-1 text-xs text-gray-500">
                    This number will be used in case of emergency
                  </p>
                </div>

                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-green-900">
                    <strong>Review your information:</strong>
                  </p>
                  <div className="mt-3 space-y-1 text-sm text-green-800">
                    <p><strong>Name:</strong> {formData.name || "Not provided"}</p>
                    <p><strong>NID:</strong> {formData.nid || "Not provided"}</p>
                    <p><strong>Date of Birth:</strong> {formData.dob || "Not provided"}</p>
                    <p><strong>Gender:</strong> {formData.gender || "Not provided"}</p>
                    <p><strong>Blood Group:</strong> {formData.b_group || "Not provided"}</p>
                    <p><strong>Division:</strong> {formData.division || "Not provided"}</p>
                    <p><strong>District:</strong> {formData.zila || "Not provided"}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> All information will be kept confidential and used only for vaccination purposes. You can update this information later from your profile settings.
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
