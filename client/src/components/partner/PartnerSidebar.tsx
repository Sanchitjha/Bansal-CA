"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeIndianRupee,
  BriefcaseBusiness,
  ClipboardCheck,
  FileCheck2,
  LayoutDashboard,
  UsersRound,
  UserRound,
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      { href: "/partner", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/partner/clients", label: "Referred Clients", icon: UsersRound },
      { href: "/partner/cases", label: "Referred Cases", icon: BriefcaseBusiness },
      { href: "/partner/tasks", label: "Tasks", icon: ClipboardCheck },
    ],
  },
  {
    label: "Earnings",
    items: [
      { href: "/partner/payouts", label: "Payouts & Earnings", icon: BadgeIndianRupee },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/partner/documents", label: "KYC Documents", icon: FileCheck2 },
      { href: "/partner/profile", label: "Partner Profile", icon: UserRound },
    ],
  },
];

export default function PartnerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="portal-sidebar">
      <Link href="/" className="portal-sidebar-logo">
        A&A<span>.</span>
      </Link>
      <nav className="portal-nav" aria-label="Partner portal navigation">
        {NAV_GROUPS.map((group) => (
          <div className="portal-nav-group" key={group.label}>
            <p className="portal-nav-group-label">{group.label}</p>
            {group.items.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`portal-nav-link ${isActive ? "active" : ""}`}
                >
                  <Icon aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
