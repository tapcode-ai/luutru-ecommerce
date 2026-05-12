"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useCartStore } from "@/store/cartStore";

export default function CartInitializer() {
  const { isAuthenticated, token } = useUserStore();
  const syncFromServer = useCartStore((state) => state.syncFromServer);

  useEffect(() => {
    if (isAuthenticated && token) {
      syncFromServer();
    }
  }, [isAuthenticated, token, syncFromServer]);

  return null;
}