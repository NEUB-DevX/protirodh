"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaUserShield, FaHospital, FaUserMd } from "react-icons/fa";
import { API_URL } from "../const/config";
import { useGlobal } from "../context/GlobalContext";

type Role = "hub" | "center" | "staff";

export default function AdminLogin() {
  const [role, setRole] = useState<Role>("hub");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const { admin_login } = useGlobal();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {

      await admin_login(loginId, password, role);

     //  const endpoint = `${API_URL}/auth/${role}/login`;
     //  const body = role === "hub" 
     //    ? { username: loginId, password }
     //    : role === "center"
     //    ? { centerId: loginId, password }
     //    : { staffId: loginId, password };

     //  const response = await fetch(endpoint, {
     //    method: "POST",
     //    headers: { "Content-Type": "application/json" },
     //    body: JSON.stringify(body),
     //  });

     //  const data = await response.json();

     //  if (data.success) {
     //    // Store token based on role
     // //    const tokenKey = role === "hub" ? "adminToken" : role === "center" ? "centerToken" : "staffToken";
     //    localStorage.setItem("token", data.data.token);
     //    console.log(data.data.token)
     //    // Redirect based on role
     //    const redirectPath = role === "hub" ? "/hub" : role === "center" ? "/center" : "/staff";
     //    router.push(redirectPath);
     //  } else {
     //    setError(data.message || "Login failed. Please check your credentials.");
     //  }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const roleConfig = {
    hub: {
      icon: FaUserShield,
      label: "Hub Admin",
      placeholder: "Admin Username",
      color: "blue",
    },
    center: {
      icon: FaHospital,
      label: "Vaccination Center",
      placeholder: "Center ID",
      color: "green",
    },
    staff: {
      icon: FaUserMd,
      label: "Staff Member",
      placeholder: "Staff ID",
      color: "purple",
    },
  };

  const config = roleConfig[role];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <FaUserShield className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Sign in to your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(roleConfig) as Role[]).map((r) => {
                const RoleIcon = roleConfig[r].icon;
                const isActive = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      isActive
                        ? `border-${roleConfig[r].color}-600 bg-${roleConfig[r].color}-50`
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RoleIcon className={`text-2xl ${isActive ? `text-${roleConfig[r].color}-600` : "text-gray-400"}`} />
                    <span className={`text-xs font-medium ${isActive ? `text-${roleConfig[r].color}-900` : "text-gray-600"}`}>
                      {roleConfig[r].label.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {config.placeholder}
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder={config.placeholder}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Need help? Contact your administrator
        </p>
      </div>
    </div>
  );
}
