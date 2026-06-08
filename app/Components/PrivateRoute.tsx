"use client";
import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/Admin/login");
    }
  }, [user, router]);

  if (!user) return null;

  return <>{children}</>;
}
