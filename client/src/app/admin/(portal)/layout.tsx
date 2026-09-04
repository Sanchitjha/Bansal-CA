"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/components/admin/AdminProvider";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isCheckingSession } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isCheckingSession && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isCheckingSession, isAuthenticated, router]);

  if (isCheckingSession || !isAuthenticated) {
    return (
      <div className="portal-loading-screen">
        <span>Loading the admin panel…</span>
      </div>
    );
  }

  return (
    <div className="portal-shell">
      <AdminSidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      {mobileOpen && <div className="admin-main-overlay" onClick={() => setMobileOpen(false)} />}
      <div className="portal-content">
        <AdminTopbar onMenuClick={() => setMobileOpen((prev) => !prev)} />
        <main className="portal-main admin-main">{children}</main>
      </div>
    </div>
  );
}
