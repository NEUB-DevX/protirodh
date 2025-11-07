"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { API_URL } from "../const/config";

type User = {
  id?: string;
  uid?: string;
  centerId?: string;
  staffId?: string;
  hubId?: string;
  nid?: string;
  b_group?: string;
  gender?: string;
  name: string;
  dob?: string;
  f_name?: string;
  m_name?: string;
  contact?: {
    division?: string;
    zila?: string;
    upzila?: string;
    village?: string;
    house?: string;
  };
};

interface GlobalContextType {
  user: User | null;
  isAuthenticated: boolean;
  admin_login: (loginId: string, password: string, role: "hub" | "center" | "staff") => Promise<void>;
  verify_otp: (idNumber: string, otp: string, type: "nid" | "bid") => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Admin login function
  const admin_login = async (loginId: string, password: string, role: "hub" | "center" | "staff") => {
    setLoading(true);
    try {
      const endpoint = `${API_URL}/auth/${role}/login`;
      const body = role === "hub" 
        ? { username: loginId, password }
        : role === "center"
        ? { centerId: loginId, password }
        : { staffId: loginId, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data.message || "Login failed. Please check your credentials.";
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      if (!data.data.token) {
        toast.error("Login failed - no token received");
        throw new Error("Login failed - no token received");
      }

      // Store token
      localStorage.setItem("token", data.data.token);

      // Set user data
      setUser(data.data.user || data.data.center || data.data.staff || { name: role });

      // Redirect based on role
      const redirectPath = role === "hub" ? "/hub" : role === "center" ? "/center" : "/staff";
      router.push(redirectPath);
      
      toast.success(`Welcome ${role === "hub" ? "Admin" : role === "center" ? "Center" : "Staff"}!`);
    } catch (error) {
      console.error("Admin login error:", error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const verify_otp = async (idNumber: string, otp: string, type: "nid" | "bid") => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idNumber, code: otp, type }),
      });

      if (!res.ok) {
        const errorText = await res.json();
        const errorMsg = errorText.data.message || "Login failed";
        console.log(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      const data = await res.json();
      if (!data.data.token) {
        toast.error("Login failed");
        throw new Error("Login failed");
      }

      // Store token
      localStorage.setItem("token", data.data.token);

      setUser(data.data.user);

      location.reload();
    } catch (error) {
      console.error("Login error:", error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = React.useCallback(async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      router.push("/login");
      setLoading(false);
    }
  }, [router]);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/user/get-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          throw new Error("Authentication failed");
        }

        const data = await res.json();
        setUser(data.data.user);
      } catch (error) {
        console.error("Auth check failed:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [logout]);

  return (
    <GlobalContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        admin_login,
        verify_otp,
        logout,
        loading,
        setLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
