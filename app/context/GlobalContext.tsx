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

type User = {
  uid: string;
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

  // Login function
  const verify_otp = async (idNumber: string, otp: string, type: "nid" | "bid") => {
    setLoading(true);
    try {
      const res = await fetch(`api/auth/verify-otp`, {
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

        const res = await fetch(`api/user/get-user`, {
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
