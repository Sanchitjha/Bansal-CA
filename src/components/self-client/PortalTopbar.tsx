"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelfClient } from "./SelfClientProvider";
import ThemeToggle from "@/components/ThemeToggle";

export default function PortalTopbar() {
  const router = useRouter();
  const { profile, notifications, logout } = useSelfClient();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    router.push("/self-client/login");
  };

  return (
    <header className="portal-topbar">
      <Link href="/self-client/profile" className="portal-topbar-profile" aria-label="My Profile">
        <span className="portal-topbar-profile-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75" />
            <path
              d="M4 20c0-4 3.5-7 8-7s8 3 8 7"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="portal-topbar-user">
          <span className="portal-topbar-user-name">{profile.name}</span>
        </span>
      </Link>
      <div className="portal-topbar-actions">
        <ThemeToggle className="portal-theme-toggle" />
        <Link href="/self-client/notifications" className="portal-topbar-bell" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {unreadCount > 0 && <span className="portal-topbar-bell-count">{unreadCount}</span>}
        </Link>
        <button type="button" className="btn btn-secondary portal-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
