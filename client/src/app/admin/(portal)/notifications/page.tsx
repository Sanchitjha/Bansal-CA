"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminNotification, NotificationCategory } from "@/data/admin";
import { Bell, CheckCircle, MailOpen, AlertCircle, ArrowRight, Check } from "lucide-react";

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    logAction,
  } = useAdmin();

  // Page States
  const [activeFilter, setActiveFilter] = useState<NotificationCategory | "All" | "Unread">("All");

  // Apply filters
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeFilter === "Unread") return !n.read;
      if (activeFilter === "All") return true;
      return n.category === activeFilter;
    });
  }, [notifications, activeFilter]);

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    logAction("Marked all admin notifications as read", "Notifications", "all");
    alert("All notifications marked as read!");
  };

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Notification Center</h1>
          <p className="admin-page-subtitle">Track operational activities, document submissions, KYC status changes, and payment settlements.</p>
        </div>
        <div className="admin-page-header-actions">
          <button type="button" className="btn btn-secondary" onClick={handleMarkAllRead}>
            <MailOpen size={15} style={{ marginRight: "0.35rem" }} /> Mark All Read
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="tabs" role="tablist" style={{ marginBottom: "1.5rem" }}>
        {[
          { id: "All", label: "All Alerts" },
          { id: "Unread", label: "Unread" },
          { id: "Payments", label: "Payments" },
          { id: "Cases", label: "Cases" },
          { id: "Documents", label: "Documents" },
          { id: "Partners", label: "Partners" },
          { id: "System", label: "System Alerts" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeFilter === tab.id}
            className={`tab-btn ${activeFilter === tab.id ? "active" : ""}`}
            onClick={() => setActiveFilter(tab.id as NotificationCategory | "All" | "Unread")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List items */}
      <div className="admin-panel" style={{ padding: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filteredNotifications.map((n) => {
            let color = "var(--color-navy)";
            if (n.category === "Payments") color = "var(--color-success)";
            if (n.category === "Cases") color = "var(--color-orange)";
            if (n.category === "System") color = "#7F8C8D";

            return (
              <div
                key={n.id}
                className="admin-action-item"
                style={{
                  padding: "1rem 1.25rem",
                  backgroundColor: n.read ? undefined : "rgba(227, 90, 55, 0.02)",
                  borderColor: n.read ? undefined : "rgba(227, 90, 55, 0.2)",
                  opacity: n.read ? 0.85 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1.5rem",
                }}
              >
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: n.read ? "var(--color-border)" : "rgba(227, 90, 55, 0.1)",
                      color: n.read ? "var(--color-text-secondary)" : "var(--color-orange)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "0.15rem",
                    }}
                  >
                    <Bell size={16} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {n.category}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "var(--color-text-secondary)" }}>
                        {new Date(n.date).toLocaleString()}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0.25rem 0 0.15rem 0", color: "var(--color-text-primary)" }}>
                      {n.title}
                    </h3>
                    <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", margin: 0 }}>
                      {n.message}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {!n.read && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-xs"
                      title="Mark as read"
                      onClick={() => handleMarkRead(n.id)}
                    >
                      <Check size={14} />
                    </button>
                  )}
                  {n.actionHref && (
                    <Link href={n.actionHref} className="btn btn-primary btn-xs" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                      {n.actionLabel || "Resolve"} <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
          {filteredNotifications.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem" }}>
              <CheckCircle size={32} className="text-green" style={{ marginBottom: "1rem" }} />
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>All Clean!</h3>
              <p className="empty-state" style={{ marginTop: "0.25rem" }}>No alerts found in the selected category filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
