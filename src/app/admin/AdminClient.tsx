"use client";

import { AdminPanel } from "@/components/AdminPanel";
import { Toaster } from "@/components/ui/sonner";

export default function AdminClient() {
  const handleBackToSite = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminPanel onBackToSite={handleBackToSite} />
      <Toaster />
    </div>
  );
}
