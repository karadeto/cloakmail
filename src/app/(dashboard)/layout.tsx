"use client";

import { useUserStore } from "@/store/useUserStore";
import React, { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchUser } = useUserStore();

  useEffect(() => {
    const initializeData = async () => {
      await fetchUser();
    };
    initializeData();
  }, [fetchUser]);
  return (
    <div className="h-full relative">
      <main>
        <div>{children}</div>
      </main>
    </div>
  );
}
