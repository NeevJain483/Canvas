"use client";

import { useEffect } from "react";
import { useAuthStore } from "@lib/store/authStore";
import apiClient from "@lib/api/client";
import { useRouter } from "next/navigation";

export default function ClientStateInitializer() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
    
    if (user) {
      console.log("Authenticated User loaded on client boot:", user);
    }
  }, [user, accessToken,router]);

  return null; 
}