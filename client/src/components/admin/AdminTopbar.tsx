"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Bell, Menu, User, ShieldCheck, SlidersHorizontal, LogOut } from "lucide-react";
import { useAdmin } from "./AdminProvider";
import ThemeToggle from "@/components/ThemeToggle";
import DropdownMenu from "./ui/DropdownMenu";

interface AdminTopbarProps {
  onMenuClick: () => void;
}

interface SearchResult {
  type: string;
  label: string;
  href: string;
}

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const router = useRouter();
  const { profile, notifications, logout, clients, partners, leads, cases, invoices, payments } = useAdmin();
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;
      event.preventDefault();
      searchRef.current?.focus();
    };

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const matches: SearchResult[] = [];
    clients.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)) {
        matches.push({ type: "Client", label: c.name, href: `/admin/clients/${c.id}` });
      }
    });
    partners.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) {
        matches.push({ type: "Partner", label: p.name, href: `/admin/partners/${p.id}` });
      }
    });
    leads.forEach((l) => {
      if (l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q)) {
        matches.push({ type: "Lead", label: l.name, href: `/admin/leads` });
      }
    });
    cases.forEach((c) => {
      if (c.clientName.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)) {
        matches.push({ type: "Case", label: `${c.id} — ${c.clientName}`, href: `/admin/cases/${c.id}` });
      }
    });
    invoices.forEach((i) => {
      if (i.clientName.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)) {
        matches.push({ type: "Invoice", label: `${i.id} — ${i.clientName}`, href: `/admin/invoices` });
      }
    });
    payments.forEach((p) => {
      if (p.clientName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) {
        matches.push({ type: "Payment", label: `${p.id} — ${p.clientName}`, href: `/admin/payments` });
      }
    });
    return matches.slice(0, 8);
  }, [query, clients, partners, leads, cases, invoices, payments]);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button type="button" className="icon-btn admin-topbar-menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={18} />
        </button>
        <div className="admin-search">
          <Search className="admin-search-icon" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients, cases, partners..."
            aria-label="Search clients, cases, partners, invoices, and payments"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={query.trim().length > 0}
            aria-controls="admin-search-results"
          />
          <kbd className="admin-search-shortcut" aria-hidden="true">/</kbd>
          {query.trim() && (
            <div className="admin-search-results" id="admin-search-results" role="listbox">
              {results.length === 0 ? (
                <div className="admin-search-empty">No results found.</div>
              ) : (
                results.map((r, idx) => (
                  <Link
                    key={`${r.type}-${idx}`}
                    href={r.href}
                    className="admin-search-result"
                    onClick={() => setQuery("")}
                    role="option"
                  >
                    <span className="admin-search-result-type">{r.type}</span>
                    <span className="admin-search-result-title">{r.label}</span>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <div className="admin-topbar-actions">
        <ThemeToggle />
        <DropdownMenu
          trigger={
            <span className="icon-btn" aria-label="Notifications">
              <Bell size={18} />
              {unreadCount > 0 && <span className="icon-btn-badge">{unreadCount}</span>}
            </span>
          }
          header={
            <div className="dropdown-header">
              <span className="dropdown-header-name">Notifications</span>
              <span className="dropdown-header-role">{unreadCount} unread</span>
            </div>
          }
          items={[
            ...notifications.slice(0, 5).map((n) => ({
              label: n.title,
              onClick: () => router.push(n.actionHref || "/admin/notifications"),
            })),
            { label: "View all notifications", onClick: () => router.push("/admin/notifications") },
          ]}
        />
        <DropdownMenu
          trigger={
            <span className="portal-topbar-profile" style={{ padding: "0.25rem 0.5rem" }}>
              <span className="portal-topbar-profile-icon">
                <User size={18} />
              </span>
              <span className="portal-topbar-user">
                <span className="portal-topbar-user-name">{profile.name}</span>
                <span className="portal-topbar-user-email">{profile.role}</span>
              </span>
            </span>
          }
          items={[
            { label: "Profile", icon: <User size={15} />, onClick: () => router.push("/admin/settings") },
            { label: "Security", icon: <ShieldCheck size={15} />, onClick: () => router.push("/admin/settings") },
            { label: "Preferences", icon: <SlidersHorizontal size={15} />, onClick: () => router.push("/admin/settings") },
            { label: "Logout", icon: <LogOut size={15} />, onClick: handleLogout, danger: true },
          ]}
        />
      </div>
    </header>
  );
}
