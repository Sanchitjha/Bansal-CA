"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  Briefcase,
  Users,
  Handshake,
  Layers,
  CreditCard,
  FileText,
  PieChart,
  FolderOpen,
  BarChart3,
  LayoutTemplate,
  History,
  Settings as SettingsIcon,
  ChevronsLeft,
  ChevronsRight,
  GitFork,
  Coins,
  Activity,
  ClipboardList,
} from "lucide-react";
import { useAdmin } from "./AdminProvider";

const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/operations", label: "Operations Queue", icon: ClipboardList },
      { href: "/admin/cases", label: "Cases & Requests", icon: Briefcase },
      { href: "/admin/leads", label: "Leads", icon: UserPlus },
      { href: "/admin/documents", label: "Documents", icon: FolderOpen },
    ],
  },
  {
    label: "Network",
    items: [
      { href: "/admin/clients", label: "Clients", icon: Users },
      { href: "/admin/partners", label: "Partners", icon: Handshake },
      { href: "/admin/services", label: "Services", icon: Layers },
      { href: "/admin/routing", label: "Routing Engine", icon: GitFork },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
      { href: "/admin/invoices", label: "Invoices", icon: FileText },
      { href: "/admin/revenue", label: "Revenue Share", icon: PieChart },
      { href: "/admin/commission-rules", label: "Commission Rules", icon: Coins },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/reports", label: "Reports", icon: BarChart3 },
      { href: "/admin/observability", label: "Observability", icon: Activity },
      { href: "/admin/cms", label: "CMS", icon: LayoutTemplate },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: History },
      { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onNavigate: () => void;
}

export default function AdminSidebar({ mobileOpen, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAdmin();

  return (
    <aside className="admin-sidebar" data-collapsed={sidebarCollapsed} data-mobile-open={mobileOpen}>
      <div className="admin-sidebar-header">
        <Link href="/admin" className="admin-sidebar-logo">
          A&A<span>.</span>
          <span className="admin-sidebar-logo-text">&nbsp;Admin</span>
        </Link>
        <button
          type="button"
          className="admin-sidebar-collapse-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
      </div>
      <nav className="admin-nav" aria-label="Admin navigation">
        {NAV_GROUPS.map((group) => (
          <div className="admin-nav-group" key={group.label}>
            <p className="admin-nav-group-label">{group.label}</p>
            {group.items.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-link ${isActive ? "active" : ""}`}
                  onClick={onNavigate}
                  title={sidebarCollapsed ? item.label : undefined}
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
