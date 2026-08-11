"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelfClient } from "@/components/self-client/SelfClientProvider";
import PortalSidebar from "@/components/self-client/PortalSidebar";
import PortalTopbar from "@/components/self-client/PortalTopbar";

export default function SelfClientPortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isCheckingSession } = useSelfClient();

  useEffect(() => {
    if (!isCheckingSession && !isAuthenticated) {
      router.replace("/self-client/login");
    }
  }, [isCheckingSession, isAuthenticated, router]);

  if (isCheckingSession || !isAuthenticated) {
    return (
      <div className="portal-loading-screen">
        <span>Loading your portal…</span>
      </div>
    );
  }

  return (
    <div className="portal-shell">
      <PortalSidebar />
      <div className="portal-content">
        <PortalTopbar />
        <main className="portal-main">{children}</main>
      </div>
    </div>
  );
}
