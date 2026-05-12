"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useCartStore } from "@/store/cartStore";

export default function CartInitializer() {
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Cart is already persisted in localStorage via zustand persist
      // No need to sync from server since we use mock data
    }
  }, [isAuthenticated]);

  return null;
}