"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSyringe, FaIdCard, FaKey, FaCheckCircle } from "react-icons/fa";

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState<"id" | "otp">("id");
  const [idType, setIdType] = useState<"nid" | "birth">("nid");
  const [idNumber, setIdNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Call API to send OTP
    // const response = await fetch('/api/auth/send-otp', {
    //   method: 'POST',
    //   body: JSON.stringify({ idType, idNumber })
    // });
    
    // Mock: Simulate API call delay
    setTimeout(() => {
      // Mock email associated with the ID
      setEmail("u***r@example.com");
      setStep("otp");
      setIsLoading(false);
    }, 1500);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Call API to verify OTP and get token
    // const response = await fetch('/api/auth/verify-otp', {
    //   method: 'POST',
    //   body: JSON.stringify({ idType, idNumber, otp })
    // });
    
    // Mock: Simulate API call and store token
    setTimeout(() => {
      localStorage.setItem("authToken", "mock-token-" + Date.now());
      localStorage.setItem(
        "user",
        JSON.stringify({
          idType,
          idNumber,
          email,
        })
      );
      router.push("/portal");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600">
                <FaSyringe className="text-xl text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Protirodh</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600">
                <FaSyringe className="text-3xl text-white" />
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {step === "id" ? "Login to Protirodh" : "Verify OTP"}
              </h1>
              <p className="text-gray-600">
                {step === "id" 
                  ? "Enter your NID or Birth Certificate ID" 
                  : `Enter the OTP sent to ${email}`}
              </p>
            </div>

            {/* Step 1: ID Entry */}
            {step === "id" && (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    ID Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setIdType("nid")}
                      className={`rounded-lg border-2 py-3 font-medium transition-all ${
                        idType === "nid"
                          ? "border-green-600 bg-green-50 text-green-600"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      National ID
                    </button>
                    <button
                      type="button"
                      onClick={() => setIdType("birth")}
                      className={`rounded-lg border-2 py-3 font-medium transition-all ${
                        idType === "birth"
                          ? "border-green-600 bg-green-50 text-green-600"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      Birth Certificate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {idType === "nid" ? "National ID Number" : "Birth Certificate Number"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaIdCard className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={
                        idType === "nid" 
                          ? "Enter your NID number" 
                          : "Enter your Birth Certificate number"
                      }
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      required
                      minLength={10}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    We&apos;ll send an OTP to the email associated with this ID
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="mt-0.5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        OTP Sent Successfully
                      </p>
                      <p className="mt-1 text-xs text-green-700">
                        Check your email: {email}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Enter OTP <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaKey className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-center text-2xl font-semibold tracking-widest focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      required
                      maxLength={6}
                      pattern="\d{6}"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Didn&apos;t receive the code?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => setIsLoading(false), 1500);
                      }}
                      className="font-medium text-green-600 hover:text-green-700"
                    >
                      Resend OTP
                    </button>
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("id");
                      setOtp("");
                    }}
                    className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Verifying..." : "Verify & Login"}
                  </button>
                </div>
              </form>
            )}

            {/* Info Box */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> Your {idType === "nid" ? "National ID" : "Birth Certificate"} must be registered in the system. If you&apos;re unable to login, please contact your nearest vaccination center.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            By logging in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
