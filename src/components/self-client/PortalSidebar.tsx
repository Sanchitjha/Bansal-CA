"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/self-client", label: "Dashboard", exact: true },
  { href: "/self-client/cases", label: "My Services / Cases" },
  { href: "/self-client/new-request", label: "New Service Request" },
  { href: "/self-client/documents", label: "Documents" },
  { href: "/self-client/payments", label: "Payments & Invoices" },
  { href: "/self-client/tasks", label: "Tasks" },
  { href: "/self-client/messages", label: "Messages" },
  { href: "/self-client/notifications", label: "Notifications" },
  { href: "/self-client/profile", label: "My Profile" },
];

export default function PortalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="portal-sidebar">
      <Link href="/" className="portal-sidebar-logo">
        A&A<span>.</span>
      </Link>
      <nav className="portal-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`portal-nav-link ${isActive ? "active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
