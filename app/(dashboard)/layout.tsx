"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  return <div>{children}</div>;
}
