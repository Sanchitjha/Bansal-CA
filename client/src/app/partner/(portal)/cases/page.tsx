"use client";

import { usePartner } from "@/components/partner/PartnerProvider";
import StatusBadge from "@/components/self-client/StatusBadge";

export default function ReferredCasesPage() {
  const { profile, referredCases } = usePartner();

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>Referred Cases Tracker</h1>
          <p>Track the progress of services for your referred clients and your accrued share.</p>
        </div>
      </div>

      <div className="portal-panel">
        {referredCases.length === 0 ? (
          <div className="empty-state" style={{ padding: "60px" }}>
            <h3>No cases found</h3>
            <p>Cases will appear here once your referred clients initiate service requests.</p>
          </div>
        ) : (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Case Number</th>
                <th>Client Name</th>
                <th>Service Name</th>
                <th>Opened Date</th>
                <th>Service Value</th>
                <th>Commission Payout</th>
                <th>Service Status</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {referredCases.map((c) => {
                const commission = c.amount * (profile?.revenueSharePct || 10) / 100;
                return (
                  <tr key={c.id}>
                    <td><code>{c.id}</code></td>
                    <td style={{ fontWeight: 500 }}>{c.clientName}</td>
                    <td>{c.serviceName}</td>
                    <td>{c.createdDate}</td>
                    <td>₹{c.amount.toFixed(2)}</td>
                    <td style={{ fontWeight: 600, color: "var(--color-accent, #0066cc)" }}>
                      ₹{commission.toFixed(2)}
                    </td>
                    <td><StatusBadge status={c.status} /></td>
                    <td><StatusBadge status={c.paymentStatus} /></td>
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
