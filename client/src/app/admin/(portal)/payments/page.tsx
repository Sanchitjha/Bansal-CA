"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminTable, KpiCard, FilterBar, Drawer, Modal } from "@/components/admin/ui";
import { AdminPayment, AdminPaymentStatus } from "@/data/admin";
import { DollarSign, Eye, ShieldAlert, CreditCard, RefreshCw } from "lucide-react";

export default function PaymentsPage() {
  const {
    payments,
    markPaymentReviewed,
    refundPayment,
    logAction,
  } = useAdmin();

  // Page States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  // Selected Payment Drawer State
  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(null);

  // Refund Modal State
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundAmountVal, setRefundAmountVal] = useState("");

  // Calculate dynamic KPIs
  const kpis = useMemo(() => {
    const paid = payments.filter((p) => p.status === "Paid");
    const pendingVerif = payments.filter((p) => p.status === "Manual Verification");
    const failed = payments.filter((p) => p.status === "Failed");
    const refunded = payments.filter((p) => ["Refunded", "Partially Refunded"].includes(p.status));
    const manual = payments.filter((p) => p.method === "Manual");

    return {
      totalCollected: paid.reduce((s, p) => s + p.amount, 0),
      pendingVerification: pendingVerif.length,
      failed: failed.length,
      refunded: refunded.reduce((s, p) => s + (p.refundAmount || 0), 0),
      manualPayments: manual.length,
    };
  }, [payments]);

  // Apply filters
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.clientName.toLowerCase().includes(search.toLowerCase()) ||
        p.caseId.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || p.status === statusFilter;
      const matchesMethod = !methodFilter || p.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, search, statusFilter, methodFilter]);

  // Drawer Action Handlers
  const handleVerifyPayment = (pId: string) => {
    markPaymentReviewed(pId);
    if (selectedPayment && selectedPayment.id === pId) {
      setSelectedPayment((prev) => (prev ? { ...prev, status: "Paid", webhookStatus: "Verified" } : null));
    }
    alert("Payment verified successfully!");
  };

  const handleOpenRefund = () => {
    if (!selectedPayment) return;
    setRefundAmountVal(String(selectedPayment.amount - (selectedPayment.refundAmount || 0)));
    setRefundModalOpen(true);
  };

  const handleConfirmRefund = () => {
    if (!selectedPayment) return;
    const amountVal = parseFloat(refundAmountVal);
    if (isNaN(amountVal) || amountVal <= 0 || amountVal > selectedPayment.amount) {
      alert("Please enter a valid refund amount.");
      return;
    }

    refundPayment(selectedPayment.id, amountVal);
    // Sync local selected payment state
    setSelectedPayment((prev) => {
      if (!prev) return null;
      const nextStatus = amountVal >= prev.amount ? "Refunded" : "Partially Refunded";
      return { ...prev, status: nextStatus, refundAmount: amountVal };
    });
    setRefundModalOpen(false);
    alert(`Refund of $${amountVal} processed!`);
  };

  const columns = useMemo(() => {
    return [
      {
        key: "id",
        header: "Payment ID",
        render: (row: AdminPayment) => (
          <span
            className="admin-table-link"
            onClick={() => setSelectedPayment(row)}
            style={{ cursor: "pointer", fontWeight: 600 }}
          >
            {row.id}
          </span>
        ),
        sortValue: (row: AdminPayment) => row.id,
        csvValue: (row: AdminPayment) => row.id,
      },
      {
        key: "client",
        header: "Client Name",
        render: (row: AdminPayment) => (
          <div>
            <Link href={`/admin/clients/${row.clientId}`} className="admin-table-link">
              {row.clientName}
            </Link>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>{row.clientId}</div>
          </div>
        ),
        sortValue: (row: AdminPayment) => row.clientName,
        csvValue: (row: AdminPayment) => row.clientName,
      },
      {
        key: "case",
        header: "Related Case",
        render: (row: AdminPayment) => (
          <Link href={`/admin/cases/${row.caseId}`} className="admin-table-link">
            {row.caseId}
          </Link>
        ),
        sortValue: (row: AdminPayment) => row.caseId,
        csvValue: (row: AdminPayment) => row.caseId,
      },
      {
        key: "invoice",
        header: "Invoice ID",
        render: (row: AdminPayment) => (
          <span>{row.invoiceId ? <Link href="/admin/invoices" className="admin-table-link">{row.invoiceId}</Link> : "—"}</span>
        ),
        sortValue: (row: AdminPayment) => row.invoiceId || "",
        csvValue: (row: AdminPayment) => row.invoiceId || "",
      },
      {
        key: "amount",
        header: "Amount",
        render: (row: AdminPayment) => <span style={{ fontWeight: 600 }}>${row.amount}</span>,
        sortValue: (row: AdminPayment) => row.amount,
        csvValue: (row: AdminPayment) => row.amount,
      },
      {
        key: "method",
        header: "Gateway Method",
        render: (row: AdminPayment) => <span>{row.method}</span>,
        sortValue: (row: AdminPayment) => row.method,
        csvValue: (row: AdminPayment) => row.method,
      },
      {
        key: "status",
        header: "Status",
        render: (row: AdminPayment) => {
          let badge = "badge-grey";
          if (row.status === "Paid") badge = "badge-green";
          else if (row.status === "Pending") badge = "badge-amber";
          else if (row.status === "Manual Verification") badge = "badge-purple";
          else if (row.status === "Failed") badge = "badge-red";
          else if (["Refunded", "Partially Refunded"].includes(row.status)) badge = "badge-grey";
          return <span className={`badge ${badge}`}>{row.status}</span>;
        },
        sortValue: (row: AdminPayment) => row.status,
        csvValue: (row: AdminPayment) => row.status,
      },
      {
        key: "date",
        header: "Date Time",
        render: (row: AdminPayment) => <span>{new Date(row.date).toLocaleString()}</span>,
        sortValue: (row: AdminPayment) => row.date,
        csvValue: (row: AdminPayment) => row.date,
      },
      {
        key: "actions",
        header: "Actions",
        render: (row: AdminPayment) => (
          <button type="button" className="btn btn-secondary btn-xs" onClick={() => setSelectedPayment(row)}>
            <Eye size={13} style={{ marginRight: "2px" }} /> Detail
          </button>
        ),
      },
    ];
  }, []);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Payments Dashboard</h1>
          <p className="admin-page-subtitle">Track incoming client payments, resolve bank verification holds, and audit gateway settlements.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <KpiCard label="Total Collected" value={`$${kpis.totalCollected}`} icon={<DollarSign size={18} />} />
        <KpiCard label="Pending Verification" value={String(kpis.pendingVerification)} icon={<RefreshCw size={18} />} trend="down" trendValue="25.0%" />
        <KpiCard label="Failed Payments" value={String(kpis.failed)} icon={<ShieldAlert size={18} />} />
        <KpiCard label="Total Refunded" value={`$${kpis.refunded}`} icon={<CreditCard size={18} />} />
        <KpiCard label="Manual Deposits" value={String(kpis.manualPayments)} icon={<DollarSign size={18} />} />
      </div>

      {/* Filter Bar */}
      <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by Payment ID, Case ID, Client Name...">
        <div className="filter-group">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Manual Verification">Manual Verification</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
            <option value="Partially Refunded">Partially Refunded</option>
          </select>

          <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
            <option value="">All Methods</option>
            <option value="Card">Credit/Debit Card</option>
            <option value="UPI">UPI Payment</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Manual">Manual / Bank Transfer</option>
          </select>
        </div>
      </FilterBar>

      {/* Main Table Panel */}
      <div className="admin-panel" style={{ marginTop: "1.5rem", padding: "1rem" }}>
        <AdminTable
          columns={columns}
          rows={filteredPayments}
          rowKey={(r) => r.id}
          pageSize={10}
          selectable
          exportFilename="payments_dashboard_export"
        />
      </div>

      {/* Payment Detail Drawer */}
      <Drawer open={selectedPayment !== null} title={`Payment Logs: ${selectedPayment?.id}`} onClose={() => setSelectedPayment(null)}>
        {selectedPayment && (
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Transaction Data */}
            <div className="admin-panel" style={{ padding: "1rem" }}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 1rem 0" }}>Transaction Metadata</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem" }}>
                <div>
                  <span style={{ color: "var(--color-text-secondary)" }}>Client</span>
                  <div style={{ fontWeight: 600 }}>{selectedPayment.clientName} (<code>{selectedPayment.clientId}</code>)</div>
                </div>
                <div>
                  <span style={{ color: "var(--color-text-secondary)" }}>Case Deliverable</span>
                  <div>{selectedPayment.caseId}</div>
                </div>
                <div>
                  <span style={{ color: "var(--color-text-secondary)" }}>Transaction Amount</span>
                  <div style={{ fontWeight: 700, fontSize: "1rem" }}>${selectedPayment.amount}</div>
                </div>
                {selectedPayment.refundAmount && (
                  <div>
                    <span style={{ color: "var(--color-text-secondary)" }}>Refunded Amount</span>
                    <div style={{ color: "var(--color-error)", fontWeight: 700 }}>${selectedPayment.refundAmount}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Gateway Information */}
            <div className="admin-panel" style={{ padding: "1rem" }}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 1rem 0" }}>Gateway Settlement Logs</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem" }}>
                <div>
                  <span style={{ color: "var(--color-text-secondary)" }}>Payment Gateway Reference</span>
                  <div><code>{selectedPayment.gatewayRef || "Manual Entry / Awaiting Hook"}</code></div>
                </div>
                <div>
                  <span style={{ color: "var(--color-text-secondary)" }}>Payment Method Used</span>
                  <div>{selectedPayment.method}</div>
                </div>
                <div>
                  <span style={{ color: "var(--color-text-secondary)" }}>Webhook Verification Status</span>
                  <div>
                    <span className={`badge ${
                      selectedPayment.webhookStatus === "Verified" ? "badge-green" : "badge-amber"
                    }`}>
                      {selectedPayment.webhookStatus || "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="admin-panel" style={{ padding: "1rem" }}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 1rem 0" }}>Settlement Actions</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {selectedPayment.status === "Manual Verification" && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => handleVerifyPayment(selectedPayment.id)}
                  >
                    Approve Manual Deposit
                  </button>
                )}
                {["Paid", "Partially Refunded"].includes(selectedPayment.status) && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: "100%", justifyContent: "center", backgroundColor: "rgba(192, 57, 43, 0.1)", color: "var(--color-error)" }}
                    onClick={handleOpenRefund}
                  >
                    Issue Refund
                  </button>
                )}
                {selectedPayment.status === "Refunded" && (
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", textAlign: "center", margin: 0 }}>
                    This transaction has been fully refunded.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Modal: Process Refund */}
      <Modal
        open={refundModalOpen}
        title="Confirm Payment Refund"
        confirmLabel="Issue Refund"
        onConfirm={handleConfirmRefund}
        onCancel={() => setRefundModalOpen(false)}
      >
        <div className="portal-form">
          <p style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>
            Enter the amount to refund for transaction <strong>{selectedPayment?.id}</strong>. Maximum refundable is{" "}
            <strong>${selectedPayment ? selectedPayment.amount - (selectedPayment.refundAmount || 0) : 0}</strong>.
          </p>
          <div className="form-group">
            <label className="form-label">Refund Amount ($) *</label>
            <input
              type="number"
              className="form-input"
              required
              min={1}
              value={refundAmountVal}
              onChange={(e) => setRefundAmountVal(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
