"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePartner } from "@/components/partner/PartnerProvider";
import PartnerSidebar from "@/components/partner/PartnerSidebar";
import PartnerTopbar from "@/components/partner/PartnerTopbar";

export default function PartnerPortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isCheckingSession } = usePartner();

  useEffect(() => {
    if (!isCheckingSession && !isAuthenticated) {
      router.replace("/partner/login");
    }
  }, [isCheckingSession, isAuthenticated, router]);

  if (isCheckingSession || !isAuthenticated) {
    return (
      <div className="portal-loading-screen">
        <span>Loading Partner Portal…</span>
      </div>
    );
  }

  return (
    <div className="portal-shell">
      <PartnerSidebar />
      <div className="portal-content">
        <PartnerTopbar />
        <main className="portal-main">{children}</main>
      </div>
    </div>
  );
}
