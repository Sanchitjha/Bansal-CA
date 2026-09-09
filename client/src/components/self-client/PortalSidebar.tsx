"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  ClipboardCheck,
  FolderOpen,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  UserRound,
  WalletCards,
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      { href: "/self-client", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/self-client/new-request", label: "New Service Request", icon: PlusCircle },
      { href: "/self-client/cases", label: "My Services & Cases", icon: BriefcaseBusiness },
      { href: "/self-client/tasks", label: "Tasks", icon: ClipboardCheck },
    ],
  },
  {
    label: "Records",
    items: [
      { href: "/self-client/documents", label: "Documents", icon: FolderOpen },
      { href: "/self-client/payments", label: "Payments & Invoices", icon: WalletCards },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/self-client/messages", label: "Messages", icon: MessageSquare },
      { href: "/self-client/notifications", label: "Notifications", icon: Bell },
      { href: "/self-client/profile", label: "My Profile", icon: UserRound },
    ],
  },
];

export default function PortalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="portal-sidebar">
      <Link href="/" className="portal-sidebar-logo">
        A&A<span>.</span>
      </Link>
      <nav className="portal-nav" aria-label="Client portal navigation">
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
