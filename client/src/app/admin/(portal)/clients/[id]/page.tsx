"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminTable, Tabs, Modal } from "@/components/admin/ui";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FolderOpen,
  CreditCard,
  FileText,
  Clock,
  ArrowLeft,
  Plus,
  Trash2,
} from "lucide-react";

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const clientId = resolvedParams.id;

  const {
    clients,
    cases,
    documents,
    payments,
    invoices,
    auditLogs,
    recordInvoicePayment,
    logAction,
  } = useAdmin();

  // Find target client
  const client = useMemo(() => {
    return clients.find((c) => c.id === clientId);
  }, [clients, clientId]);

  const [activeTab, setActiveTab] = useState("overview");

  // Modals state
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [reqDocName, setReqDocName] = useState("");
  const [reqDocType, setReqDocType] = useState("Tax Document");

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invAmount, setInvAmount] = useState("");
  const [invDueDate, setInvDueDate] = useState("2026-08-30");
  const [invCaseId, setInvCaseId] = useState("");

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payInvoiceId, setPayInvoiceId] = useState("");
  const [payAmount, setPayAmount] = useState("");

  // Target client calculations
  const clientCases = useMemo(() => {
    return cases.filter((c) => c.clientId === clientId);
  }, [cases, clientId]);

  const clientDocuments = useMemo(() => {
    return documents.filter((d) => d.ownerId === clientId);
  }, [documents, clientId]);

  const clientPayments = useMemo(() => {
    return payments.filter((p) => p.clientId === clientId);
  }, [payments, clientId]);

  const clientInvoices = useMemo(() => {
    return invoices.filter((i) => i.clientId === clientId);
  }, [invoices, clientId]);

  const clientActivity = useMemo(() => {
    return auditLogs.filter(
      (log) =>
        log.entityId === clientId ||
        (log.entity === "Case" && clientCases.some((c) => c.id === log.entityId))
    );
  }, [auditLogs, clientId, clientCases]);

  if (!client) {
    return (
      <div className="admin-page-container">
        <Link href="/admin/clients" className="admin-back-btn">
          <ArrowLeft size={16} /> Back to Directory
        </Link>
        <div className="admin-panel" style={{ marginTop: "2rem", padding: "3rem", textAlign: "center" }}>
          <h2>Client Profile Not Found</h2>
          <p className="empty-state">The client record with ID {clientId} does not exist.</p>
        </div>
      </div>
    );
  }

  // Quick Action Handlers
  const handleRequestDoc = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!reqDocName.trim()) return;

    logAction(`Requested document "${reqDocName}" from client ${client.name}`, "Client", client.id);
    alert(`Requested document "${reqDocName}" successfully!`);
    setDocModalOpen(false);
    setReqDocName("");
  };

  const handleCreateInvoice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const amountVal = parseFloat(invAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      alert("Please enter a valid invoice amount.");
      return;
    }

    const invId = `INV-${Date.now().toString().slice(-4)}`;
    logAction(`Created invoice ${invId} for $${amountVal} to client ${client.name}`, "Client", client.id);
    alert(`Invoice ${invId} created successfully! (Simulated)`);
    setInvoiceModalOpen(false);
    setInvAmount("");
  };

  const handleRecordPayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const amountVal = parseFloat(payAmount);
    if (!payInvoiceId || isNaN(amountVal) || amountVal <= 0) {
      alert("Please fill in all payment fields.");
      return;
    }

    recordInvoicePayment(payInvoiceId, amountVal);
    logAction(`Manual payment of $${amountVal} recorded for invoice ${payInvoiceId}`, "Invoice", payInvoiceId);
    alert(`Payment of $${amountVal} successfully recorded!`);
    setPaymentModalOpen(false);
    setPayAmount("");
    setPayInvoiceId("");
  };

  return (
    <div className="admin-page-container">
      {/* Back button and title header */}
      <div style={{ marginBottom: "1rem" }}>
        <Link href="/admin/clients" className="admin-back-btn" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-secondary)", fontSize: "0.8125rem", textDecoration: "none" }}>
          <ArrowLeft size={14} /> Back to Directory
        </Link>
      </div>

      <div className="admin-page-header" style={{ alignItems: "flex-start", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1 className="admin-page-title">{client.name}</h1>
            <span className={`badge ${client.status === "Active" ? "badge-green" : "badge-grey"}`}>
              {client.status}
            </span>
          </div>
          <p className="admin-page-subtitle" style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
            <span>Client ID: <code>{client.id}</code></span>
            <span>•</span>
            <span>Type: {client.type}</span>
            {client.partnerName && (
              <>
                <span>•</span>
                <span>Referral Partner: <Link href={`/admin/partners/${client.partnerId}`} style={{ color: "var(--color-navy)", fontWeight: 600 }}>{client.partnerName}</Link></span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "cases", label: "Cases" },
          { id: "documents", label: "Documents" },
          { id: "payments", label: "Payments" },
          { id: "invoices", label: "Invoices" },
          { id: "activity", label: "Activity Timeline" },
        ]}
      />

      {/* Two Column Layout: Main content + Sidebar info */}
      <div className="admin-grid-3-1" style={{ marginTop: "1.5rem" }}>
        {/* Left Area (Tab contents) */}
        <div className="admin-panel" style={{ padding: "1.5rem", minHeight: "400px" }}>
          {activeTab === "overview" && (
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 1rem 0" }}>Profile Details</h3>
              <div className="admin-grid-2" style={{ gap: "1.5rem", fontSize: "0.875rem" }}>
                <div>
                  <span style={{ color: "var(--color-text-secondary)", display: "block", marginBottom: "0.25rem" }}>Legal Name</span>
                  <span style={{ fontWeight: 600 }}>{client.name}</span>
                </div>
                <div>
                  <span style={{ color: "var(--color-text-secondary)", display: "block", marginBottom: "0.25rem" }}>Created Date</span>
                  <span>{client.createdDate}</span>
                </div>
                <div>
                  <span style={{ color: "var(--color-text-secondary)", display: "block", marginBottom: "0.25rem" }}>Client Type</span>
                  <span>{client.type}</span>
                </div>
                {client.partnerName && (
                  <div>
                    <span style={{ color: "var(--color-text-secondary)", display: "block", marginBottom: "0.25rem" }}>Channel Partner</span>
                    <Link href={`/admin/partners/${client.partnerId}`} style={{ color: "var(--color-navy)", fontWeight: 600 }}>
                      {client.partnerName}
                    </Link>
                  </div>
                )}
                <div style={{ gridColumn: "span 2" }}>
                  <span style={{ color: "var(--color-text-secondary)", display: "block", marginBottom: "0.25rem" }}>Address</span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <MapPin size={16} style={{ flexShrink: 0, marginTop: "0.15rem", color: "var(--color-text-secondary)" }} />
                    <span>{client.address || "No address provided."}</span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--color-border)", marginTop: "2rem", paddingTop: "1.5rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 1rem 0" }}>Registered Services</h3>
                {client.services.length > 0 ? (
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {client.services.map((srv) => (
                      <span key={srv} className="badge badge-grey" style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}>
                        {srv}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">No services registered for this client yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "cases" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Client Cases ({clientCases.length})</h3>
                <Link href={`/admin/cases`} className="btn btn-secondary btn-xs">
                  + Create Case
                </Link>
              </div>
              <AdminTable
                columns={[
                  {
                    key: "id",
                    header: "Case ID",
                    render: (row) => <Link href={`/admin/cases/${row.id}`} className="admin-table-link">{row.id}</Link>,
                  },
                  {
                    key: "serviceName",
                    header: "Service",
                    render: (row) => <span>{row.serviceName}</span>,
                  },
                  {
                    key: "assignedTo",
                    header: "Assigned To",
                    render: (row) => <span>{row.assignedTo}</span>,
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => {
                      let badge = "badge-grey";
                      if (row.status === "Completed") badge = "badge-green";
                      else if (["In Progress", "Review"].includes(row.status)) badge = "badge-blue";
                      else if (["Payment Pending", "Documents Pending", "Waiting for Client"].includes(row.status)) badge = "badge-amber";
                      return <span className={`badge ${badge}`}>{row.status}</span>;
                    },
                  },
                  {
                    key: "priority",
                    header: "Priority",
                    render: (row) => <span>{row.priority}</span>,
                  },
                  {
                    key: "slaDueDate",
                    header: "SLA Due",
                    render: (row) => <span>{row.slaDueDate}</span>,
                  },
                ]}
                rows={clientCases}
                rowKey={(r) => r.id}
                pageSize={5}
              />
            </div>
          )}

          {activeTab === "documents" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Documents ({clientDocuments.length})</h3>
                <button type="button" className="btn btn-secondary btn-xs" onClick={() => setDocModalOpen(true)}>
                  Request Document
                </button>
              </div>
              <AdminTable
                columns={[
                  {
                    key: "name",
                    header: "Document Name",
                    render: (row) => <span style={{ fontWeight: 500 }}>{row.name}</span>,
                  },
                  {
                    key: "type",
                    header: "Document Type",
                    render: (row) => <span>{row.type}</span>,
                  },
                  {
                    key: "uploadedDate",
                    header: "Uploaded Date",
                    render: (row) => <span>{row.uploadedDate || "Awaiting upload"}</span>,
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => {
                      let badge = "badge-grey";
                      if (row.status === "Accepted") badge = "badge-green";
                      else if (row.status === "Under Review") badge = "badge-blue";
                      else if (row.status === "Rejected") badge = "badge-red";
                      else if (row.status === "Requested") badge = "badge-amber";
                      return <span className={`badge ${badge}`}>{row.status}</span>;
                    },
                  },
                  {
                    key: "expiryDate",
                    header: "Expiry",
                    render: (row) => <span>{row.expiryDate || "—"}</span>,
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    render: (row) => (
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        <Link href="/admin/documents" className="btn btn-secondary btn-xs">
                          Review
                        </Link>
                      </div>
                    ),
                  },
                ]}
                rows={clientDocuments}
                rowKey={(r) => r.id}
                pageSize={5}
              />
            </div>
          )}

          {activeTab === "payments" && (
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Payment History</h3>
              <AdminTable
                columns={[
                  {
                    key: "id",
                    header: "Payment ID",
                    render: (row) => <code>{row.id}</code>,
                  },
                  {
                    key: "caseId",
                    header: "Related Case",
                    render: (row) => <Link href={`/admin/cases/${row.caseId}`} className="admin-table-link">{row.caseId}</Link>,
                  },
                  {
                    key: "amount",
                    header: "Amount",
                    render: (row) => <span>${row.amount}</span>,
                  },
                  {
                    key: "method",
                    header: "Method",
                    render: (row) => <span>{row.method}</span>,
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => {
                      let badge = "badge-grey";
                      if (row.status === "Paid") badge = "badge-green";
                      else if (row.status === "Pending" || row.status === "Manual Verification") badge = "badge-amber";
                      else if (row.status === "Failed") badge = "badge-red";
                      return <span className={`badge ${badge}`}>{row.status}</span>;
                    },
                  },
                  {
                    key: "date",
                    header: "Payment Date",
                    render: (row) => <span>{new Date(row.date).toLocaleString()}</span>,
                  },
                ]}
                rows={clientPayments}
                rowKey={(r) => r.id}
                pageSize={5}
              />
            </div>
          )}

          {activeTab === "invoices" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Invoices & Billings</h3>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="button" className="btn btn-secondary btn-xs" onClick={() => setPaymentModalOpen(true)}>
                    Record Payment
                  </button>
                  <button type="button" className="btn btn-primary btn-xs" onClick={() => setInvoiceModalOpen(true)}>
                    + Create Invoice
                  </button>
                </div>
              </div>
              <AdminTable
                columns={[
                  {
                    key: "id",
                    header: "Invoice No",
                    render: (row) => <span style={{ fontWeight: 600 }}>{row.id}</span>,
                  },
                  {
                    key: "amount",
                    header: "Total",
                    render: (row) => <span>${row.amount}</span>,
                  },
                  {
                    key: "paidAmount",
                    header: "Paid",
                    render: (row) => <span>${row.paidAmount}</span>,
                  },
                  {
                    key: "balance",
                    header: "Balance",
                    render: (row) => <span>${row.amount - row.paidAmount}</span>,
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => {
                      let badge = "badge-grey";
                      if (row.status === "Paid") badge = "badge-green";
                      else if (row.status === "Issued" || row.status === "Partially Paid") badge = "badge-amber";
                      else if (row.status === "Cancelled") badge = "badge-grey";
                      else if (row.status === "Overdue") badge = "badge-red";
                      return <span className={`badge ${badge}`}>{row.status}</span>;
                    },
                  },
                  {
                    key: "issuedDate",
                    header: "Issued",
                    render: (row) => <span>{row.issuedDate}</span>,
                  },
                  {
                    key: "dueDate",
                    header: "Due Date",
                    render: (row) => <span>{row.dueDate}</span>,
                  },
                ]}
                rows={clientInvoices}
                rowKey={(r) => r.id}
                pageSize={5}
              />
            </div>
          )}

          {activeTab === "activity" && (
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Activity Timeline</h3>
              <div className="activity-timeline">
                {clientActivity.map((log) => (
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
                {clientActivity.length === 0 && (
                  <p className="empty-state">No recorded activity for this client.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Info Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Info Card */}
          <div className="admin-panel" style={{ padding: "1.25rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 1rem 0" }}>Contact Information</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Mail size={15} style={{ flexShrink: 0, color: "var(--color-text-secondary)" }} />
                <a href={`mailto:${client.email}`} style={{ color: "var(--color-navy)", wordBreak: "break-all" }}>
                  {client.email}
                </a>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Phone size={15} style={{ flexShrink: 0, color: "var(--color-text-secondary)" }} />
                <span>{client.phone}</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid var(--color-border)", paddingTop: "0.75rem", marginTop: "0.25rem" }}>
                <Clock size={15} style={{ flexShrink: 0, color: "var(--color-text-secondary)" }} />
                <span>Registered: {client.createdDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="admin-panel" style={{ padding: "1.25rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 1rem 0" }}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ justifyContent: "flex-start", width: "100%" }}
                onClick={() => setDocModalOpen(true)}
              >
                <FolderOpen size={14} style={{ marginRight: "0.5rem" }} /> Request Document
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ justifyContent: "flex-start", width: "100%" }}
                onClick={() => setInvoiceModalOpen(true)}
              >
                <FileText size={14} style={{ marginRight: "0.5rem" }} /> Create Invoice
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ justifyContent: "flex-start", width: "100%" }}
                disabled={clientInvoices.filter((i) => i.status !== "Paid" && i.status !== "Cancelled").length === 0}
                onClick={() => setPaymentModalOpen(true)}
              >
                <CreditCard size={14} style={{ marginRight: "0.5rem" }} /> Record Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Request Document */}
      <Modal
        open={docModalOpen}
        title="Request Client Document"
        onCancel={() => setDocModalOpen(false)}
        onConfirm={() => handleRequestDoc()}
        confirmLabel="Send Request"
      >
        <form onSubmit={handleRequestDoc}>
          <div className="form-group">
            <label className="form-label">Document Name *</label>
            <input
              type="text"
              className="form-input"
              required
              value={reqDocName}
              onChange={(e) => setReqDocName(e.target.value)}
              placeholder="e.g. GST Certificate 2025-26"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={reqDocType} onChange={(e) => setReqDocType(e.target.value)}>
              <option value="Tax Document">Tax Document</option>
              <option value="Financial Statement">Financial Statement</option>
              <option value="Identity Proof">Identity Proof</option>
              <option value="Address Proof">Address Proof</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Invoice */}
      <Modal
        open={invoiceModalOpen}
        title="Create Invoice"
        onCancel={() => setInvoiceModalOpen(false)}
        onConfirm={() => handleCreateInvoice()}
        confirmLabel="Generate Invoice"
      >
        <form onSubmit={handleCreateInvoice}>
          <div className="form-group">
            <label className="form-label">Amount ($) *</label>
            <input
              type="number"
              className="form-input"
              required
              min={1}
              value={invAmount}
              onChange={(e) => setInvAmount(e.target.value)}
              placeholder="e.g. 150"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Due Date *</label>
            <input
              type="date"
              className="form-input"
              required
              value={invDueDate}
              onChange={(e) => setInvDueDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Associated Case (Optional)</label>
            <select className="form-input" value={invCaseId} onChange={(e) => setInvCaseId(e.target.value)}>
              <option value="">No case associated</option>
              {clientCases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.serviceName}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      {/* Modal: Record Payment */}
      <Modal
        open={paymentModalOpen}
        title="Record Manual Invoice Payment"
        onCancel={() => setPaymentModalOpen(false)}
        onConfirm={() => handleRecordPayment()}
        confirmLabel="Record Payment"
      >
        <form onSubmit={handleRecordPayment}>
          <div className="form-group">
            <label className="form-label">Select Unpaid Invoice *</label>
            <select
              className="form-input"
              required
              value={payInvoiceId}
              onChange={(e) => {
                setPayInvoiceId(e.target.value);
                const target = clientInvoices.find((i) => i.id === e.target.value);
                if (target) setPayAmount(String(target.amount - target.paidAmount));
              }}
            >
              <option value="">Select Invoice</option>
              {clientInvoices
                .filter((i) => i.status !== "Paid" && i.status !== "Cancelled")
                .map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.id} — Bal: ${i.amount - i.paidAmount} (Total: ${i.amount})
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Amount Paid ($) *</label>
            <input
              type="number"
              className="form-input"
              required
              min={1}
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              placeholder="e.g. 50"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
