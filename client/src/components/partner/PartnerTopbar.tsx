"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePartner } from "./PartnerProvider";
import ThemeToggle from "@/components/ThemeToggle";

export default function PartnerTopbar() {
  const router = useRouter();
  const { profile, notifications, logout } = usePartner();
  
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    router.push("/partner/login");
  };

  return (
    <header className="portal-topbar">
      <Link href="/partner/profile" className="portal-topbar-profile" aria-label="Partner Profile">
        <span className="portal-topbar-profile-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
            <path d="M7 21v-4a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.75" />
            <circle cx="11" cy="10" r="3" stroke="currentColor" strokeWidth="1.75" />
          </svg>
        </span>
        <span className="portal-topbar-user">
          <span className="portal-topbar-user-name">{profile?.name || "Partner"}</span>
          {profile?.partnerCode && (
            <span className="portal-topbar-user-role" style={{ fontSize: "0.75rem", opacity: 0.7 }}>
              {profile.partnerCode}
            </span>
          )}
        </span>
      </Link>
      <div className="portal-topbar-actions">
        <ThemeToggle className="portal-theme-toggle" />
        <Link href="/partner/profile" style={{ textDecoration: "none" }}>
          <span className="badge badge-blue" style={{ cursor: "pointer", marginRight: "10px" }}>
            Rev Share: {profile?.revenueSharePct || 10}%
          </span>
        </Link>
        <button type="button" className="btn btn-secondary portal-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
