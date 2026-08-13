"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminTable, Tabs, Modal } from "@/components/admin/ui";
import { PartnerStatus, KYCDocStatus } from "@/data/admin";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Briefcase,
  FileText,
  FileCheck,
  TrendingUp,
  Clock,
  ArrowLeft,
  XCircle,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

export default function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const partnerId = resolvedParams.id;

  const {
    partners,
    clients,
    cases,
    ledgerEntries,
    statements,
    payouts,
    auditLogs,
    profile,
    reviewKycDocument,
    updatePartnerStatus,
    logAction,
  } = useAdmin();

  // Find partner
  const partner = useMemo(() => {
    return partners.find((p) => p.id === partnerId);
  }, [partners, partnerId]);

  const [activeTab, setActiveTab] = useState("overview");

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);

  // Status Change Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<PartnerStatus | null>(null);

  // Computations
  const partnerClients = useMemo(() => {
    return clients.filter((c) => c.partnerId === partnerId);
  }, [clients, partnerId]);

  const partnerCases = useMemo(() => {
    return cases.filter((c) => c.partnerId === partnerId);
  }, [cases, partnerId]);

  const partnerLedger = useMemo(() => {
    return ledgerEntries.filter((l) => l.partnerId === partnerId);
  }, [ledgerEntries, partnerId]);

  const partnerStatements = useMemo(() => {
    return statements.filter((s) => s.partnerId === partnerId);
  }, [statements, partnerId]);

  const partnerPayouts = useMemo(() => {
    return payouts.filter((p) => p.partnerId === partnerId);
  }, [payouts, partnerId]);

  const accruedRev = useMemo(() => {
    return partnerLedger.reduce((sum, entry) => sum + entry.netPayable, 0);
  }, [partnerLedger]);

  const paidRev = useMemo(() => {
    return partnerPayouts.filter((p) => p.status === "Paid").reduce((sum, entry) => sum + entry.amount, 0);
  }, [partnerPayouts]);

  const pendingRev = useMemo(() => {
    return accruedRev - paidRev;
  }, [accruedRev, paidRev]);

  const partnerActivity = useMemo(() => {
    return auditLogs.filter(
      (log) => log.entityId === partnerId || log.action.includes(partnerId)
    );
  }, [auditLogs, partnerId]);

  if (!partner) {
    return (
      <div className="admin-page-container">
        <Link href="/admin/partners" className="admin-back-btn">
          <ArrowLeft size={16} /> Back to Partners
        </Link>
        <div className="admin-panel" style={{ marginTop: "2rem", padding: "3rem", textAlign: "center" }}>
          <h2>Partner Profile Not Found</h2>
          <p className="empty-state">No channel partner found with ID {partnerId}.</p>
        </div>
      </div>
    );
  }

  // Operation Handlers
  const handleApproveDoc = (docId: string) => {
    reviewKycDocument(partner.id, docId, "Accepted", profile.name);
    logAction(`KYC document ${docId} approved for partner ${partner.name}`, "Partner", partner.id);
    alert("Document approved successfully!");
  };

  const handleOpenRejectDoc = (docId: string) => {
    setRejectingDocId(docId);
    setRejectModalOpen(true);
  };

  const handleConfirmRejectDoc = (reason?: string) => {
    if (!rejectingDocId) return;
    reviewKycDocument(partner.id, rejectingDocId, "Rejected", profile.name, reason);
    logAction(`KYC document ${rejectingDocId} rejected for partner ${partner.name}. Reason: ${reason}`, "Partner", partner.id);
    alert("Document rejected successfully.");
    setRejectModalOpen(false);
    setRejectingDocId(null);
  };

  const handleRequestDocChanges = (docId: string) => {
    reviewKycDocument(partner.id, docId, "Requested", profile.name);
    logAction(`KYC document changes requested for document ${docId}`, "Partner", partner.id);
    alert("Changes requested successfully.");
  };

  const handleOpenStatusChange = (status: PartnerStatus) => {
    setPendingStatusChange(status);
    setStatusModalOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (!pendingStatusChange) return;
    updatePartnerStatus(partner.id, pendingStatusChange);
    setStatusModalOpen(false);
    setPendingStatusChange(null);
    alert("Partner status updated successfully!");
  };

  return (
    <div className="admin-page-container">
      {/* Back link */}
      <div style={{ marginBottom: "1rem" }}>
        <Link href="/admin/partners" className="admin-back-btn" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-secondary)", fontSize: "0.8125rem", textDecoration: "none" }}>
          <ArrowLeft size={14} /> Back to Partners
        </Link>
      </div>

      {/* Header Info */}
      <div className="admin-page-header" style={{ alignItems: "flex-start", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1 className="admin-page-title">{partner.name}</h1>
            <span className={`badge ${
              partner.status === "Active" ? "badge-green" :
              partner.status === "Pending Verification" ? "badge-amber" : "badge-red"
            }`}>
              {partner.status}
            </span>
          </div>
          <p className="admin-page-subtitle" style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
            <span>Partner ID: <code>{partner.id}</code></span>
            <span>•</span>
            <span>Accrued share: <strong>${accruedRev.toFixed(2)}</strong></span>
            <span>•</span>
            <span>Onboarded: {partner.createdDate}</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "kyc", label: "KYC & Verification" },
          { id: "services", label: "Permitted Services" },
          { id: "clients", label: "Clients referred" },
          { id: "cases", label: "Referred Cases" },
          { id: "revenue", label: "Revenue Share Ledger" },
          { id: "statements", label: "Statements" },
          { id: "payouts", label: "Payout History" },
          { id: "activity", label: "Logs" },
        ]}
      />

      {/* Two Column Layout: Tabs content + quick action info sidebar */}
      <div className="admin-grid-3-1" style={{ marginTop: "1.5rem" }}>
        {/* Main Content Pane */}
        <div className="admin-panel" style={{ padding: "1.5rem", minHeight: "450px" }}>
          {activeTab === "overview" && (
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 1.25rem 0" }}>Partner Profile</h3>
              <div className="admin-grid-2" style={{ gap: "1.5rem 1rem", fontSize: "0.875rem" }}>
                <div>
                  <span style={{ color: "var(--color-text-secondary)", display: "block", marginBottom: "0.25rem" }}>Business Name</span>
                  <span style={{ fontWeight: 600 }}>{partner.name}</span>
                </div>
                <div>
                  <span style={{ color: "var(--color-text-secondary)", display: "block", marginBottom: "0.25rem" }}>Primary Contact Person</span>
                  <span>{partner.contactPerson}</span>
                </div>
                <div>
                  <span style={{ color: "var(--color-text-secondary)", display: "block", marginBottom: "0.25rem" }}>GSTIN Number</span>
                  <span>{partner.gstin || "Not Registered"}</span>
                </div>
                <div>
                  <span style={{ color: "var(--color-text-secondary)", display: "block", marginBottom: "0.25rem" }}>PAN Number</span>
                  <code>{partner.pan}</code>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--color-border)", marginTop: "2rem", paddingTop: "1.5rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 1.25rem 0" }}>Bank Account & Payout Info</h3>
                <div className="admin-grid-2" style={{ gap: "1.5rem 1rem", fontSize: "0.875rem" }}>
                  <div>
                    <span style={{ color: "var(--color-text-secondary)", display: "block", marginBottom: "0.25rem" }}>Bank Name / Account Name</span>
                    <span>{partner.bankAccountName}</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--color-text-secondary)", display: "block", marginBottom: "0.25rem" }}>Account Number</span>
                    <code>{partner.bankAccountNumber}</code>
                  </div>
                  <div>
                    <span style={{ color: "var(--color-text-secondary)", display: "block", marginBottom: "0.25rem" }}>IFSC Code</span>
                    <code>{partner.bankIfsc}</code>
                  </div>
                  <div>
                    <span style={{ color: "var(--color-text-secondary)", display: "block", marginBottom: "0.25rem" }}>Accrual commission share</span>
                    <span>{partner.revenueSharePct}% split (TDS {partner.tdsPct}%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "kyc" && (
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>KYC & Identity Documents Verification</h3>
              <div className="admin-table-wrap">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Document Name</th>
                      <th>Uploaded Date</th>
                      <th>Status</th>
                      <th>Reviewed By</th>
                      <th>Reviewed At</th>
                      <th>Expiry Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partner.kycDocuments.map((doc) => (
                      <tr key={doc.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{doc.name}</div>
                          {doc.rejectionReason && (
                            <div style={{ fontSize: "0.75rem", color: "var(--color-error)", marginTop: "0.25rem" }}>
                              Rejection Reason: &quot;{doc.rejectionReason}&quot;
                            </div>
                          )}
                        </td>
                        <td>{doc.uploadedDate || "Awaiting upload"}</td>
                        <td>
                          <span className={`badge ${
                            doc.status === "Accepted" ? "badge-green" :
                            doc.status === "Under Review" ? "badge-blue" :
                            doc.status === "Rejected" ? "badge-red" : "badge-amber"
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td>{doc.reviewedBy || "—"}</td>
                        <td>{doc.reviewedAt || "—"}</td>
                        <td>{doc.expiryDate || "—"}</td>
                        <td>
                          {doc.status === "Under Review" && (
                            <div style={{ display: "flex", gap: "0.25rem" }}>
                              <button
                                type="button"
                                className="btn btn-primary btn-xs"
                                onClick={() => handleApproveDoc(doc.id)}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-xs"
                                style={{ backgroundColor: "rgba(192, 57, 43, 0.1)", color: "var(--color-error)" }}
                                onClick={() => handleOpenRejectDoc(doc.id)}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {doc.status === "Rejected" && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              onClick={() => handleRequestDocChanges(doc.id)}
                            >
                              Request Re-upload
                            </button>
                          )}
                          {doc.status === "Accepted" && (
                            <span style={{ fontSize: "0.75rem", color: "var(--color-success)", fontWeight: 600 }}>Verified</span>
                          )}
                          {doc.status === "Requested" && (
                            <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", fontStyle: "italic" }}>Awaiting Document</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 1rem 0" }}>Permitted Services</h3>
              <p className="admin-page-subtitle" style={{ marginBottom: "1.5rem" }}>Permitted referral services for which this channel partner accrues commissions.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {partner.services.map((srv) => (
                  <div key={srv} className="admin-action-item" style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <FileCheck size={16} className="text-green" />
                      <span style={{ fontWeight: 500 }}>{srv}</span>
                    </div>
                    <span className="badge badge-green" style={{ fontSize: "0.7rem" }}>Allowed Referral</span>
                  </div>
                ))}
                {partner.services.length === 0 && (
                  <p className="empty-state">No specific permitted services configured. Partner cannot accrue commissions.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "clients" && (
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Referred Clients</h3>
              <AdminTable
                columns={[
                  {
                    key: "name",
                    header: "Client Name",
                    render: (row) => <Link href={`/admin/clients/${row.id}`} className="admin-table-link">{row.name}</Link>,
                  },
                  {
                    key: "id",
                    header: "Client ID",
                    render: (row) => <code>{row.id}</code>,
                  },
                  {
                    key: "email",
                    header: "Email",
                    render: (row) => <span>{row.email}</span>,
                  },
                  {
                    key: "activeCases",
                    header: "Active Cases",
                    render: (row) => <span>{row.activeCases}</span>,
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => (
                      <span className={`badge ${row.status === "Active" ? "badge-green" : "badge-grey"}`}>
                        {row.status}
                      </span>
                    ),
                  },
                ]}
                rows={partnerClients}
                rowKey={(r) => r.id}
                pageSize={5}
              />
            </div>
          )}

          {activeTab === "cases" && (
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Referred Client Cases</h3>
              <AdminTable
                columns={[
                  {
                    key: "id",
                    header: "Case ID",
                    render: (row) => <Link href={`/admin/cases/${row.id}`} className="admin-table-link">{row.id}</Link>,
                  },
                  {
                    key: "clientName",
                    header: "Client",
                    render: (row) => <span>{row.clientName}</span>,
                  },
                  {
                    key: "serviceName",
                    header: "Service",
                    render: (row) => <span>{row.serviceName}</span>,
                  },
                  {
                    key: "status",
                    header: "Case Status",
                    render: (row) => {
                      let badge = "badge-grey";
                      if (row.status === "Completed") badge = "badge-green";
                      else if (["In Progress", "Review"].includes(row.status)) badge = "badge-blue";
                      else if (["Payment Pending", "Documents Pending", "Waiting for Client"].includes(row.status)) badge = "badge-amber";
                      return <span className={`badge ${badge}`}>{row.status}</span>;
                    },
                  },
                  {
                    key: "amount",
                    header: "Gross Case Value",
                    render: (row) => <span>${row.amount}</span>,
                  },
                ]}
                rows={partnerCases}
                rowKey={(r) => r.id}
                pageSize={5}
              />
            </div>
          )}

          {activeTab === "revenue" && (
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Revenue Share Ledger Entries</h3>
              <AdminTable
                columns={[
                  {
                    key: "id",
                    header: "Ledger ID",
                    render: (row) => <code>{row.id}</code>,
                  },
                  {
                    key: "caseId",
                    header: "Case ID",
                    render: (row) => <Link href={`/admin/cases/${row.caseId}`} className="admin-table-link">{row.caseId}</Link>,
                  },
                  {
                    key: "serviceName",
                    header: "Service Name",
                    render: (row) => <span>{row.serviceName}</span>,
                  },
                  {
                    key: "grossAmount",
                    header: "Gross Value",
                    render: (row) => <span>${row.grossAmount}</span>,
                  },
                  {
                    key: "partnerShare",
                    header: "Share Payout",
                    render: (row) => <span>${row.partnerShare}</span>,
                  },
                  {
                    key: "tds",
                    header: "TDS Deducted",
                    render: (row) => <span>${row.tds}</span>,
                  },
                  {
                    key: "netPayable",
                    header: "Net Payable",
                    render: (row) => <span style={{ fontWeight: 600 }}>${row.netPayable}</span>,
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => {
                      let badge = "badge-grey";
                      if (row.status === "Paid") badge = "badge-green";
                      else if (row.status === "Pending") badge = "badge-amber";
                      else if (row.status === "Included in Statement") badge = "badge-blue";
                      return <span className={`badge ${badge}`}>{row.status}</span>;
                    },
                  },
                ]}
                rows={partnerLedger}
                rowKey={(r) => r.id}
                pageSize={5}
              />
            </div>
          )}

          {activeTab === "statements" && (
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Weekly Commission Statements</h3>
              <AdminTable
                columns={[
                  {
                    key: "id",
                    header: "Statement ID",
                    render: (row) => <code>{row.id}</code>,
                  },
                  {
                    key: "weekOf",
                    header: "Billing Period Week",
                    render: (row) => <span>{row.weekOf}</span>,
                  },
                  {
                    key: "totalAmount",
                    header: "Statement Total",
                    render: (row) => <span style={{ fontWeight: 600 }}>${row.totalAmount}</span>,
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => {
                      let badge = "badge-grey";
                      if (row.status === "Paid") badge = "badge-green";
                      else if (["Partner Accepted", "T+2 Eligible", "Scheduled"].includes(row.status)) badge = "badge-blue";
                      else if (row.status === "Issued" || row.status === "Draft" || row.status === "Under Review") badge = "badge-amber";
                      else if (row.status === "Disputed") badge = "badge-red";
                      return <span className={`badge ${badge}`}>{row.status}</span>;
                    },
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    render: (row) => (
                      <Link href="/admin/revenue" className="btn btn-secondary btn-xs">
                        View Statement
                      </Link>
                    ),
                  },
                ]}
                rows={partnerStatements}
                rowKey={(r) => r.id}
                pageSize={5}
              />
            </div>
          )}

          {activeTab === "payouts" && (
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Partner Commission Payouts</h3>
              <AdminTable
                columns={[
                  {
                    key: "id",
                    header: "Payout ID",
                    render: (row) => <code>{row.id}</code>,
                  },
                  {
                    key: "statementId",
                    header: "Statement ID",
                    render: (row) => <span>{row.statementId}</span>,
                  },
                  {
                    key: "amount",
                    header: "Payout Amount",
                    render: (row) => <span style={{ fontWeight: 600 }}>${row.amount}</span>,
                  },
                  {
                    key: "status",
                    header: "Payout Status",
                    render: (row) => {
                      let badge = "badge-grey";
                      if (row.status === "Paid") badge = "badge-green";
                      else if (row.status === "Scheduled" || row.status === "Pending") badge = "badge-amber";
                      else if (row.status === "On Hold") badge = "badge-purple";
                      else if (row.status === "Failed") badge = "badge-red";
                      return <span className={`badge ${badge}`}>{row.status}</span>;
                    },
                  },
                  {
                    key: "scheduledDate",
                    header: "Scheduled Date",
                    render: (row) => <span>{row.scheduledDate || "—"}</span>,
                  },
                  {
                    key: "paidDate",
                    header: "Settled Date",
                    render: (row) => <span>{row.paidDate || "—"}</span>,
                  },
                ]}
                rows={partnerPayouts}
                rowKey={(r) => r.id}
                pageSize={5}
              />
            </div>
          )}

          {activeTab === "activity" && (
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Partner Logs</h3>
              <div className="activity-timeline">
                {partnerActivity.map((log) => (
                  <div key={log.id} className="activity-timeline-item">
                    <div className="activity-timeline-marker" />
                    <div className="activity-timeline-content">
                      <div className="activity-timeline-header">
                        <span className="activity-timeline-title">{log.action}</span>
                        <span className="activity-timeline-time">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="activity-timeline-meta">
                        <span>By: {log.user} ({log.role})</span>
                        <span>•</span>
                        <span>IP: {log.ip}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {partnerActivity.length === 0 && (
                  <p className="empty-state">No logged audit actions found for this channel partner.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info & Partner Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Stats Info */}
          <div className="admin-panel" style={{ padding: "1.25rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 1rem 0" }}>Financial Snapshot</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block" }}>Accrued Commission</span>
                <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-navy)" }}>${accruedRev.toFixed(2)}</span>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block" }}>Paid Out Commission</span>
                <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-success)" }}>${paidRev.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.75rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block" }}>Pending Settlement</span>
                <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-orange)" }}>${pendingRev.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Contact Person Details */}
          <div className="admin-panel" style={{ padding: "1.25rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 1rem 0" }}>Contact Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <User size={15} style={{ flexShrink: 0, color: "var(--color-text-secondary)" }} />
                <span>{partner.contactPerson}</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Mail size={15} style={{ flexShrink: 0, color: "var(--color-text-secondary)" }} />
                <a href={`mailto:${partner.email}`} style={{ color: "var(--color-navy)", wordBreak: "break-all" }}>
                  {partner.email}
                </a>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Phone size={15} style={{ flexShrink: 0, color: "var(--color-text-secondary)" }} />
                <span>{partner.phone}</span>
              </div>
            </div>
          </div>

          {/* Partner Status Control */}
          <div className="admin-panel" style={{ padding: "1.25rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 1rem 0" }}>Partner Operations</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {partner.status !== "Active" && (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => handleOpenStatusChange("Active")}
                >
                  <CheckCircle size={14} style={{ marginRight: "0.5rem" }} /> Approve & Activate
                </button>
              )}
              {partner.status === "Pending Verification" && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: "100%", justifyContent: "center", backgroundColor: "rgba(192, 57, 43, 0.1)", color: "var(--color-error)" }}
                  onClick={() => handleOpenStatusChange("Rejected")}
                >
                  <XCircle size={14} style={{ marginRight: "0.5rem" }} /> Reject Partner
                </button>
              )}
              {partner.status === "Active" && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: "100%", justifyContent: "center", backgroundColor: "rgba(192, 57, 43, 0.1)", color: "var(--color-error)" }}
                  onClick={() => handleOpenStatusChange("Suspended")}
                >
                  <ShieldAlert size={14} style={{ marginRight: "0.5rem" }} /> Suspend Partner
                </button>
              )}
              {partner.status === "Suspended" && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => handleOpenStatusChange("Active")}
                >
                  Re-activate Partner
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: KYC Rejection Reason */}
      <Modal
        open={rejectModalOpen}
        title="Reject KYC Document"
        confirmLabel="Reject Document"
        danger
        requireReason
        reasonLabel="Rejection Reason"
        onConfirm={handleConfirmRejectDoc}
        onCancel={() => {
          setRejectModalOpen(false);
          setRejectingDocId(null);
        }}
      />

      {/* Modal: Status Change Confirmation */}
      <Modal
        open={statusModalOpen}
        title="Confirm Status Change"
        confirmLabel="Confirm"
        onConfirm={handleConfirmStatusChange}
        onCancel={() => {
          setStatusModalOpen(false);
          setPendingStatusChange(null);
        }}
      >
        <p style={{ fontSize: "0.875rem" }}>
          Are you sure you want to change this partner&apos;s status to <strong>{pendingStatusChange}</strong>?
          This will affect their referrals and settlements.
        </p>
      </Modal>
    </div>
  );
}
