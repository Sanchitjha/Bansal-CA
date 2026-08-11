"use client";

import Link from "next/link";
import { useSelfClient } from "@/components/self-client/SelfClientProvider";
import StatusBadge from "@/components/self-client/StatusBadge";

const CLOSED_STATUSES = ["Closed"];

export default function SelfClientDashboardPage() {
  const { profile, cases, tasks, notifications } = useSelfClient();

  const activeCases = cases.filter((c) => !CLOSED_STATUSES.includes(c.status));
  const pendingTasks = tasks.filter((t) => t.status === "Pending");
  const unreadNotifications = notifications.filter((n) => !n.read);
  const paymentsDue = cases.filter((c) => c.paymentStatus === "Pending" || c.paymentStatus === "Partially Paid");

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>Welcome back, {profile.name.split(" ")[0]}</h1>
          <p>Here&apos;s an overview of your services with Amit Bansal &amp; Associates.</p>
        </div>
        <Link href="/self-client/new-request" className="btn btn-primary">
          New Service Request
        </Link>
      </div>

      <div className="portal-cards-grid">
        <div className="portal-stat-card">
          <span className="portal-stat-value">{activeCases.length}</span>
          <span className="portal-stat-label">Active Services</span>
        </div>
        <div className="portal-stat-card">
          <span className="portal-stat-value">{pendingTasks.length}</span>
          <span className="portal-stat-label">Pending Actions</span>
        </div>
        <div className="portal-stat-card">
          <span className="portal-stat-value">{paymentsDue.length}</span>
          <span className="portal-stat-label">Payments Due</span>
        </div>
        <div className="portal-stat-card">
          <span className="portal-stat-value">{unreadNotifications.length}</span>
          <span className="portal-stat-label">Unread Notifications</span>
        </div>
      </div>

      <div className="portal-panel">
        <div className="portal-panel-header">
          <h2>Recent Services / Cases</h2>
          <Link href="/self-client/cases" className="btn-link">View all</Link>
        </div>
        <table className="portal-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Service</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {cases.slice(0, 4).map((c) => (
              <tr key={c.id}>
                <td>
                  <Link href={`/self-client/cases/${c.id}`}>{c.id}</Link>
                </td>
                <td>{c.serviceName}</td>
                <td><StatusBadge status={c.status} /></td>
                <td><StatusBadge status={c.paymentStatus} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="portal-panel">
        <div className="portal-panel-header">
          <h2>Pending Actions</h2>
          <Link href="/self-client/tasks" className="btn-link">View all</Link>
        </div>
        {pendingTasks.length === 0 ? (
          <p className="empty-state">No pending actions right now.</p>
        ) : (
          <ul className="portal-simple-list">
            {pendingTasks.slice(0, 4).map((task) => (
              <li key={task.id}>
                <span className="portal-simple-list-title">{task.title}</span>
                <span className="portal-simple-list-meta">
                  {task.caseId} · Due {task.dueDate}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
