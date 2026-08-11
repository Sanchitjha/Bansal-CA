"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelfClient } from "./SelfClientProvider";

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
      <div className="portal-topbar-title">
        <span className="portal-badge-selfclient">Self Client</span>
      </div>
      <div className="portal-topbar-actions">
        <Link href="/self-client/notifications" className="portal-topbar-bell" aria-label="Notifications">
          Notifications
          {unreadCount > 0 && <span className="portal-topbar-bell-count">{unreadCount}</span>}
        </Link>
        <div className="portal-topbar-user">
          <span className="portal-topbar-user-name">{profile.name}</span>
          <span className="portal-topbar-user-email">{profile.email}</span>
        </div>
        <button type="button" className="btn btn-secondary portal-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
