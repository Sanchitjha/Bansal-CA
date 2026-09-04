"use client";

import { usePartner } from "@/components/partner/PartnerProvider";

export default function PartnerPayoutsPage() {
  const { ledgerEntries } = usePartner();

  // Calculations
  const totalEarning = ledgerEntries
    .filter((l) => l.type === "EARNING" && l.status === "CLEARED")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const pendingAccrual = ledgerEntries
    .filter((l) => l.type === "EARNING" && l.status === "PENDING")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalPayout = ledgerEntries
    .filter((l) => l.type === "PAYOUT" && l.status === "CLEARED")
    .reduce((sum, entry) => sum + Math.abs(entry.amount), 0);

  const currentAccruedBalance = totalEarning - totalPayout;

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>Payouts & Earnings</h1>
          <p>Track your commission ledger, accrued earnings, and history of transfers.</p>
        </div>
      </div>

      <div className="portal-cards-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", marginBottom: "24px" }}>
        <div className="portal-stat-card">
          <span className="portal-stat-value">₹{totalEarning.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          <span className="portal-stat-label">Total Commission Earned</span>
        </div>
        <div className="portal-stat-card">
          <span className="portal-stat-value">₹{totalPayout.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          <span className="portal-stat-label">Total Payouts Settled</span>
        </div>
        <div className="portal-stat-card">
          <span className="portal-stat-value">₹{currentAccruedBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          <span className="portal-stat-label">Accrued Balance (Available)</span>
        </div>
        <div className="portal-stat-card">
          <span className="portal-stat-value">₹{pendingAccrual.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          <span className="portal-stat-label">Pending Clearances</span>
        </div>
      </div>

      <div className="portal-panel">
        <div className="portal-panel-header">
          <h2>Ledger History</h2>
        </div>
        {ledgerEntries.length === 0 ? (
          <div className="empty-state" style={{ padding: "40px" }}>
            <p>No transaction history found on your ledger.</p>
          </div>
        ) : (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Entry ID</th>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {ledgerEntries.map((entry) => {
                const isPayout = entry.type === "PAYOUT";
                return (
                  <tr key={entry.id}>
                    <td><code>{entry.id}</code></td>
                    <td>{entry.date}</td>
                    <td>{entry.description}</td>
                    <td>
                      <span className={`badge ${isPayout ? "badge-blue" : "badge-green"}`}>
                        {entry.type}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${entry.status === "CLEARED" ? "badge-green" : entry.status === "PENDING" ? "badge-blue" : "badge-amber"}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td style={{
                      fontWeight: 600,
                      color: isPayout ? "var(--color-text-primary)" : "green"
                    }}>
                      {isPayout ? "-" : "+"}₹{Math.abs(entry.amount).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
