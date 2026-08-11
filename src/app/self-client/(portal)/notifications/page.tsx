"use client";

import Link from "next/link";
import { useSelfClient } from "@/components/self-client/SelfClientProvider";

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useSelfClient();
  const sorted = [...notifications].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>Notifications</h1>
          <p>New tasks, document requests, payments, status changes, and completions.</p>
        </div>
        {unreadCount > 0 && (
          <button type="button" className="btn btn-secondary" onClick={markAllNotificationsRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="portal-panel">
        {sorted.length === 0 ? (
          <p className="empty-state">No notifications yet.</p>
        ) : (
          <ul className="notification-list">
            {sorted.map((n) => (
              <li key={n.id} className={`notification-item ${n.read ? "" : "unread"}`}>
                <div>
                  <span className="notification-type">{n.type}</span>
                  <p className="notification-message">
                    {n.caseId ? <Link href={`/self-client/cases/${n.caseId}`}>{n.message}</Link> : n.message}
                  </p>
                  <span className="notification-date">{new Date(n.date).toLocaleString()}</span>
                </div>
                {!n.read && (
                  <button type="button" className="btn-link" onClick={() => markNotificationRead(n.id)}>
                    Mark as read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
