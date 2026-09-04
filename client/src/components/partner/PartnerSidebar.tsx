"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/partner", label: "Dashboard", exact: true },
  { href: "/partner/clients", label: "My Referred Clients" },
  { href: "/partner/cases", label: "Referred Cases" },
  { href: "/partner/payouts", label: "Payouts & Earnings" },
  { href: "/partner/documents", label: "KYC Documents" },
  { href: "/partner/tasks", label: "Tasks" },
  { href: "/partner/profile", label: "Partner Profile" },
];

export default function PartnerSidebar() {
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
