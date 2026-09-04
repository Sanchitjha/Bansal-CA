"use client";

import Link from "next/link";
import { usePartner } from "@/components/partner/PartnerProvider";
import StatusBadge from "@/components/self-client/StatusBadge";

export default function PartnerDashboardPage() {
  const { profile, referredClients, referredCases, ledgerEntries, tasks } = usePartner();

  // Metrics
  const activeCases = referredCases.filter((c) => c.status !== "Closed" && c.status !== "CANCELLED");
  const pendingTasks = tasks.filter((t) => t.status === "Pending");
  
  // Calculate total earnings from Ledger
  const totalEarning = ledgerEntries
    .filter((l) => l.type === "EARNING" && l.status === "CLEARED")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const pendingPayout = ledgerEntries
    .filter((l) => l.type === "EARNING" && l.status === "PENDING")
    .reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>Welcome, {profile?.name.split(" ")[0]}</h1>
          <p>Partner Code: <strong>{profile?.partnerCode}</strong> · Review referrals, payouts, and action items.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/partner/clients" className="btn btn-primary">
            Refer a Client
          </Link>
        </div>
      </div>

      <div className="portal-cards-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div className="portal-stat-card">
          <span className="portal-stat-value">{referredClients.length}</span>
          <span className="portal-stat-label">Total Referrals</span>
        </div>
        <div className="portal-stat-card">
          <span className="portal-stat-value">{activeCases.length}</span>
          <span className="portal-stat-label">Active Cases</span>
        </div>
        <div className="portal-stat-card">
          <span className="portal-stat-value">₹{totalEarning.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          <span className="portal-stat-label">Earnings Paid</span>
        </div>
        <div className="portal-stat-card">
          <span className="portal-stat-value">₹{pendingPayout.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          <span className="portal-stat-label">Accrued (Pending)</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginTop: "24px" }}>
        {/* Cases Panel */}
        <div className="portal-panel">
          <div className="portal-panel-header">
            <h2>Recent Referred Cases</h2>
            <Link href="/partner/cases" className="btn-link">View all</Link>
          </div>
          {referredCases.length === 0 ? (
            <p className="empty-state" style={{ padding: "40px" }}>No referred cases found. Add referrals to begin tracking.</p>
          ) : (
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Commission</th>
                </tr>
              </thead>
              <tbody>
                {referredCases.slice(0, 5).map((c) => (
                  <tr key={c.id}>
                    <td><code>{c.id}</code></td>
                    <td>{c.clientName}</td>
                    <td>{c.serviceName}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td style={{ fontWeight: 600 }}>₹{(c.amount * (profile?.revenueSharePct || 10) / 100).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Actions panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Quick Tasks */}
          <div className="portal-panel">
            <div className="portal-panel-header">
              <h2>Action Items</h2>
              <Link href="/partner/tasks" className="btn-link">View all</Link>
            </div>
            {pendingTasks.length === 0 ? (
              <p className="empty-state" style={{ padding: "20px" }}>All tasks complete!</p>
            ) : (
              <ul className="portal-simple-list">
                {pendingTasks.slice(0, 3).map((task) => (
                  <li key={task.id}>
                    <span className="portal-simple-list-title">{task.title}</span>
                    <span className="portal-simple-list-meta">Due: {task.dueDate}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* KYC Status panel */}
          <div className="portal-panel" style={{ padding: "20px" }}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "12px", borderBottom: "1px solid var(--color-border)", paddingBottom: "8px" }}>KYC Onboarding</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0" }}>
              <span className={`badge ${profile?.status === "ACTIVE" ? "badge-green" : profile?.status === "PENDING_VERIFICATION" ? "badge-blue" : "badge-amber"}`}>
                {profile?.status === "ACTIVE" ? "KYC Verified" : profile?.status === "PENDING_VERIFICATION" ? "Docs Under Review" : "KYC Incomplete"}
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
              {profile?.status === "ACTIVE" 
                ? "Your bank and business identification details are verified. You are active to receive payouts." 
                : "Submit tax identifications and cancelled cheques in the KYC tab to unlock revenue payouts."}
            </p>
            <Link href="/partner/documents" className="btn btn-secondary" style={{ width: "100%", textAlign: "center", marginTop: "12px" }}>
              Manage Documents
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
