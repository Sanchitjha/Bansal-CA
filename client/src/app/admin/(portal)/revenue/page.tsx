"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminTable, Tabs, Modal } from "@/components/admin/ui";
import { Payout, PayoutStatus, Dispute, LedgerEntry, Statement, RevenueShareRule } from "@/data/admin";
import { DollarSign, ShieldAlert, Award, FileText, CheckCircle, HelpCircle } from "lucide-react";

export default function RevenueSharePage() {
  const {
    ledgerEntries,
    statements,
    payouts,
    disputes,
    revenueShareRules,
    updatePayoutStatus,
    resolveDispute,
    logAction,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState("ledger");

  // Selected Dispute for modal
  const [targetDispute, setTargetDispute] = useState<Dispute | null>(null);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);

  // Selected Payout for status change
  const [targetPayout, setTargetPayout] = useState<Payout | null>(null);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [pendingPayoutStatus, setPendingPayoutStatus] = useState<PayoutStatus>("Paid");

  // Operations
  const handleResolveDispute = () => {
    if (!targetDispute) return;
    resolveDispute(targetDispute.id);
    logAction(`Resolved payout dispute ${targetDispute.id} for partner ${targetDispute.partnerName}`, "Dispute", targetDispute.id);
    alert(`Dispute ${targetDispute.id} resolved successfully!`);
    setResolveModalOpen(false);
    setTargetDispute(null);
  };

  const handleUpdatePayout = () => {
    if (!targetPayout) return;
    updatePayoutStatus(targetPayout.id, pendingPayoutStatus);
    logAction(`Updated payout status of ${targetPayout.id} to ${pendingPayoutStatus}`, "Payout", targetPayout.id);
    alert(`Payout ${targetPayout.id} status changed to ${pendingPayoutStatus}!`);
    setPayoutModalOpen(false);
    setTargetPayout(null);
  };

  const handleDownloadStatement = (id: string, type: "pdf" | "excel") => {
    logAction(`Downloaded Statement ${id} as ${type.toUpperCase()}`, "Statement", id);
    alert(`Downloading statement ${id} as ${type.toUpperCase()}...`);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Channel Commission &amp; Revenue Share</h1>
          <p className="admin-page-subtitle">Track referred case ledgers, issue weekly billing statements, resolve payout disputes, and process payouts.</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: "ledger", label: "Commission Ledger" },
          { id: "statements", label: "Weekly Statements" },
          { id: "payouts", label: "Payout Settlement" },
          { id: "disputes", label: "Payout Disputes" },
          { id: "rules", label: "Commission Rules" },
        ]}
      />

      {/* Tab Panel */}
      <div className="admin-panel" style={{ marginTop: "1.5rem", padding: "1rem" }}>
        {activeTab === "ledger" && (
          <div>
            <div style={{ padding: "0.5rem 0.5rem 1rem 0.5rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Case Commission Ledger</h3>
              <p className="admin-page-subtitle" style={{ margin: "0.25rem 0 0 0" }}>Ledger details for every referred client case and its corresponding commission share split.</p>
            </div>
            <AdminTable
              columns={[
                {
                  key: "partnerName",
                  header: "Partner Name",
                  render: (row: LedgerEntry) => <span style={{ fontWeight: 600 }}>{row.partnerName}</span>,
                  sortValue: (row) => row.partnerName,
                },
                {
                  key: "caseId",
                  header: "Case ID",
                  render: (row: LedgerEntry) => <Link href={`/admin/cases/${row.caseId}`} className="admin-table-link">{row.caseId}</Link>,
                  sortValue: (row) => row.caseId,
                },
                {
                  key: "serviceName",
                  header: "Service",
                  render: (row: LedgerEntry) => <span>{row.serviceName}</span>,
                  sortValue: (row) => row.serviceName,
                },
                {
                  key: "grossAmount",
                  header: "Case Value",
                  render: (row: LedgerEntry) => <span>${row.grossAmount}</span>,
                  sortValue: (row) => row.grossAmount,
                },
                {
                  key: "partnerShare",
                  header: "Share split",
                  render: (row: LedgerEntry) => <span>${row.partnerShare}</span>,
                  sortValue: (row) => row.partnerShare,
                },
                {
                  key: "tds",
                  header: "TDS (10%)",
                  render: (row: LedgerEntry) => <span style={{ color: "var(--color-text-secondary)" }}>${row.tds}</span>,
                  sortValue: (row) => row.tds,
                },
                {
                  key: "netPayable",
                  header: "Net Payable",
                  render: (row: LedgerEntry) => <strong style={{ color: "var(--color-navy)" }}>${row.netPayable}</strong>,
                  sortValue: (row) => row.netPayable,
                },
                {
                  key: "status",
                  header: "Ledger Status",
                  render: (row: LedgerEntry) => {
                    let badge = "badge-grey";
                    if (row.status === "Paid") badge = "badge-green";
                    else if (row.status === "Pending") badge = "badge-amber";
                    else if (row.status === "Included in Statement") badge = "badge-blue";
                    return <span className={`badge ${badge}`}>{row.status}</span>;
                  },
                  sortValue: (row) => row.status,
                },
                {
                  key: "date",
                  header: "Date Recorded",
                  render: (row: LedgerEntry) => <span>{row.date}</span>,
                  sortValue: (row) => row.date,
                },
              ]}
              rows={ledgerEntries}
              rowKey={(r) => r.id}
              pageSize={10}
              exportFilename="revenue_ledger"
            />
          </div>
        )}

        {activeTab === "statements" && (
          <div>
            <div style={{ padding: "0.5rem 0.5rem 1rem 0.5rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Weekly Partner Statements</h3>
              <p className="admin-page-subtitle" style={{ margin: "0.25rem 0 0 0" }}>Consolidated weekly summaries generated for partners to verify and sign-off payouts.</p>
            </div>
            <AdminTable
              columns={[
                {
                  key: "id",
                  header: "Statement ID",
                  render: (row: Statement) => <code>{row.id}</code>,
                  sortValue: (row) => row.id,
                },
                {
                  key: "partnerName",
                  header: "Partner Name",
                  render: (row: Statement) => <span style={{ fontWeight: 600 }}>{row.partnerName}</span>,
                  sortValue: (row) => row.partnerName,
                },
                {
                  key: "weekOf",
                  header: "Period Week",
                  render: (row: Statement) => <span>{row.weekOf}</span>,
                  sortValue: (row) => row.weekOf,
                },
                {
                  key: "totalAmount",
                  header: "Net Commission Payable",
                  render: (row: Statement) => <span style={{ fontWeight: 600 }}>${row.totalAmount}</span>,
                  sortValue: (row) => row.totalAmount,
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row: Statement) => {
                    let badge = "badge-grey";
                    if (row.status === "Paid") badge = "badge-green";
                    else if (["Partner Accepted", "Scheduled"].includes(row.status)) badge = "badge-green";
                    else if (["Issued", "Under Review", "Draft"].includes(row.status)) badge = "badge-amber";
                    else if (row.status === "Disputed") badge = "badge-red";
                    return <span className={`badge ${badge}`}>{row.status}</span>;
                  },
                  sortValue: (row) => row.status,
                },
                {
                  key: "actions",
                  header: "Actions / Export",
                  render: (row: Statement) => (
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => handleDownloadStatement(row.id, "pdf")}
                      >
                        PDF
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => handleDownloadStatement(row.id, "excel")}
                      >
                        Excel
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={statements}
              rowKey={(r) => r.id}
              pageSize={10}
              exportFilename="weekly_statements"
            />
          </div>
        )}

        {activeTab === "payouts" && (
          <div>
            <div style={{ padding: "0.5rem 0.5rem 1rem 0.5rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Payout Settlements</h3>
              <p className="admin-page-subtitle" style={{ margin: "0.25rem 0 0 0" }}>Process bank transfers, adjust holds, and record commission payouts.</p>
            </div>
            <AdminTable
              columns={[
                {
                  key: "id",
                  header: "Payout ID",
                  render: (row: Payout) => <code>{row.id}</code>,
                  sortValue: (row) => row.id,
                },
                {
                  key: "partnerName",
                  header: "Partner Name",
                  render: (row: Payout) => <span style={{ fontWeight: 600 }}>{row.partnerName}</span>,
                  sortValue: (row) => row.partnerName,
                },
                {
                  key: "statementId",
                  header: "Statement Reference",
                  render: (row: Payout) => <code>{row.statementId}</code>,
                  sortValue: (row) => row.statementId,
                },
                {
                  key: "amount",
                  header: "Commission Amount",
                  render: (row: Payout) => <strong style={{ color: "var(--color-navy)" }}>${row.amount}</strong>,
                  sortValue: (row) => row.amount,
                },
                {
                  key: "status",
                  header: "Payout Status",
                  render: (row: Payout) => {
                    let badge = "badge-grey";
                    if (row.status === "Paid") badge = "badge-green";
                    else if (row.status === "Scheduled") badge = "badge-blue";
                    else if (row.status === "Pending") badge = "badge-amber";
                    else if (row.status === "On Hold") badge = "badge-purple";
                    else if (row.status === "Failed") badge = "badge-red";
                    return <span className={`badge ${badge}`}>{row.status}</span>;
                  },
                  sortValue: (row) => row.status,
                },
                {
                  key: "scheduledDate",
                  header: "Scheduled Date",
                  render: (row: Payout) => <span>{row.scheduledDate || "—"}</span>,
                  sortValue: (row) => row.scheduledDate || "",
                },
                {
                  key: "paidDate",
                  header: "Settled Date",
                  render: (row: Payout) => <span>{row.paidDate || "—"}</span>,
                  sortValue: (row) => row.paidDate || "",
                },
                {
                  key: "actions",
                  header: "Actions",
                  render: (row: Payout) => (
                    <button
                      type="button"
                      className="btn btn-secondary btn-xs"
                      onClick={() => {
                        setTargetPayout(row);
                        setPendingPayoutStatus(row.status);
                        setPayoutModalOpen(true);
                      }}
                    >
                      Update Status
                    </button>
                  ),
                },
              ]}
              rows={payouts}
              rowKey={(r) => r.id}
              pageSize={10}
              exportFilename="payout_settlements"
            />
          </div>
        )}

        {activeTab === "disputes" && (
          <div>
            <div style={{ padding: "0.5rem 0.5rem 1rem 0.5rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Payout Disputes</h3>
              <p className="admin-page-subtitle" style={{ margin: "0.25rem 0 0 0" }}>Partner disputed statement cases and verification audits.</p>
            </div>
            <AdminTable
              columns={[
                {
                  key: "id",
                  header: "Dispute ID",
                  render: (row: Dispute) => <code>{row.id}</code>,
                },
                {
                  key: "partnerName",
                  header: "Partner Name",
                  render: (row: Dispute) => <span style={{ fontWeight: 600 }}>{row.partnerName}</span>,
                },
                {
                  key: "statementId",
                  header: "Statement Reference",
                  render: (row: Dispute) => <code>{row.statementId}</code>,
                },
                {
                  key: "amount",
                  header: "Disputed Amount",
                  render: (row: Dispute) => <span style={{ fontWeight: 600, color: "var(--color-error)" }}>${row.amount}</span>,
                },
                {
                  key: "reason",
                  header: "Dispute Reason",
                  render: (row: Dispute) => <span style={{ fontSize: "0.8125rem" }}>{row.reason}</span>,
                },
                {
                  key: "createdDate",
                  header: "Filed Date",
                  render: (row: Dispute) => <span>{row.createdDate}</span>,
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row: Dispute) => (
                    <span className={`badge ${row.status === "Resolved" ? "badge-green" : "badge-red"}`}>
                      {row.status}
                    </span>
                  ),
                },
                {
                  key: "actions",
                  header: "Actions",
                  render: (row: Dispute) => (
                    <button
                      type="button"
                      className="btn btn-primary btn-xs"
                      disabled={row.status === "Resolved"}
                      onClick={() => {
                        setTargetDispute(row);
                        setResolveModalOpen(true);
                      }}
                    >
                      Resolve Dispute
                    </button>
                  ),
                },
              ]}
              rows={disputes}
              rowKey={(r) => r.id}
              pageSize={10}
            />
          </div>
        )}

        {activeTab === "rules" && (
          <div>
            <div style={{ padding: "0.5rem 0.5rem 1rem 0.5rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Global Commission Contracts</h3>
              <p className="admin-page-subtitle" style={{ margin: "0.25rem 0 0 0" }}>Active referral contracts and default sharing metrics configured across services and partners.</p>
            </div>
            <AdminTable
              columns={[
                {
                  key: "id",
                  header: "Rule ID",
                  render: (row: RevenueShareRule) => <code>{row.id}</code>,
                },
                {
                  key: "partner",
                  header: "Partner Scope",
                  render: (row: RevenueShareRule) => (
                    <span style={{ fontWeight: 600, fontStyle: !row.partnerName ? "italic" : undefined }}>
                      {row.partnerName || "Global Default"}
                    </span>
                  ),
                },
                {
                  key: "service",
                  header: "Service Scope",
                  render: (row: RevenueShareRule) => (
                    <span style={{ fontStyle: !row.serviceName ? "italic" : undefined }}>
                      {row.serviceName || "All Services"}
                    </span>
                  ),
                },
                {
                  key: "share",
                  header: "Referral Commission Share",
                  render: (row: RevenueShareRule) => <span>{row.sharePct}% split</span>,
                },
                {
                  key: "tds",
                  header: "TDS Deduction",
                  render: (row: RevenueShareRule) => <span>{row.tdsPct}% rate</span>,
                },
                {
                  key: "effectiveDate",
                  header: "Effective From",
                  render: (row: RevenueShareRule) => <span>{row.effectiveDate}</span>,
                },
              ]}
              rows={revenueShareRules}
              rowKey={(r) => r.id}
              pageSize={10}
            />
          </div>
        )}
      </div>

      {/* Modal: Resolve dispute confirmation */}
      <Modal
        open={resolveModalOpen}
        title="Resolve commission dispute"
        confirmLabel="Mark Resolved"
        onConfirm={handleResolveDispute}
        onCancel={() => {
          setResolveModalOpen(false);
          setTargetDispute(null);
        }}
      >
        <p style={{ fontSize: "0.875rem" }}>
          Are you sure you want to mark dispute <strong>{targetDispute?.id}</strong> from{" "}
          <strong>{targetDispute?.partnerName}</strong> as <strong>RESOLVED</strong>?
          This confirms that the settlement calculation has been adjusted and verified with the partner.
        </p>
      </Modal>

      {/* Modal: Update payout status */}
      <Modal
        open={payoutModalOpen}
        title={`Settlement Status: ${targetPayout?.id}`}
        confirmLabel="Save Status"
        onConfirm={handleUpdatePayout}
        onCancel={() => {
          setPayoutModalOpen(false);
          setTargetPayout(null);
        }}
      >
        <div className="portal-form">
          <p style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>
            Select the payout status for <strong>{targetPayout?.partnerName}</strong> statement reference{" "}
            <strong>{targetPayout?.statementId}</strong>.
          </p>
          <div className="form-group">
            <label className="form-label">Payout Settlement Status</label>
            <select
              className="form-input"
              value={pendingPayoutStatus}
              onChange={(e) => setPendingPayoutStatus(e.target.value as PayoutStatus)}
            >
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Paid">Paid (Settled)</option>
              <option value="On Hold">On Hold (Verification check)</option>
              <option value="Failed">Failed (Invalid credentials)</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
