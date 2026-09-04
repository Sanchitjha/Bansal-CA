"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminTable, FilterBar, Modal } from "@/components/admin/ui";
import { Invoice, InvoiceStatus } from "@/data/admin";
import { FileText, Plus, AlertCircle, CheckCircle, Mail, Download, Ban } from "lucide-react";

export default function InvoicesPage() {
  const {
    invoices,
    clients,
    cases,
    recordInvoicePayment,
    cancelInvoice,
    logAction,
  } = useAdmin();

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");

  // Create Invoice Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    clientId: "",
    caseId: "",
    amount: "",
    dueDate: "2026-08-30",
  });

  // Record Payment Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [targetInvoice, setTargetInvoice] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState("");

  // Apply filters
  const filteredInvoices = useMemo(() => {
    return invoices.filter((i) => {
      const matchesSearch =
        i.id.toLowerCase().includes(search.toLowerCase()) ||
        i.clientName.toLowerCase().includes(search.toLowerCase()) ||
        i.caseId.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || i.status === statusFilter;
      const matchesClient = !clientFilter || i.clientId === clientFilter;

      return matchesSearch && matchesStatus && matchesClient;
    });
  }, [invoices, search, statusFilter, clientFilter]);

  // Operations handlers
  const handleCreateInvoiceSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const amountVal = parseFloat(newInvoice.amount);
    if (!newInvoice.clientId || !newInvoice.caseId || isNaN(amountVal) || amountVal <= 0) {
      alert("Please fill in all required fields.");
      return;
    }

    const clientObj = clients.find((c) => c.id === newInvoice.clientId);
    if (!clientObj) return;

    const invId = `INV-${5000 + invoices.length + 1}`;
    logAction(`Created invoice ${invId} for client ${clientObj.name}`, "Invoice", invId);
    alert(`Invoice ${invId} created successfully! (Simulated local action)`);
    setCreateModalOpen(false);
    setNewInvoice({
      clientId: "",
      caseId: "",
      amount: "",
      dueDate: "2026-08-30",
    });
  };

  const handleOpenRecordPayment = (inv: Invoice) => {
    setTargetInvoice(inv);
    setPayAmount(String(inv.amount - inv.paidAmount));
    setPayModalOpen(true);
  };

  const handleConfirmRecordPayment = () => {
    if (!targetInvoice) return;
    const amountVal = parseFloat(payAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    recordInvoicePayment(targetInvoice.id, amountVal);
    logAction(`Recorded payment of $${amountVal} for invoice ${targetInvoice.id}`, "Invoice", targetInvoice.id);
    alert(`Recorded payment of $${amountVal} against invoice ${targetInvoice.id}!`);
    setPayModalOpen(false);
    setTargetInvoice(null);
  };

  const handleCancelInvoice = (invId: string) => {
    if (confirm(`Are you sure you want to cancel invoice ${invId}? This action cannot be undone.`)) {
      cancelInvoice(invId);
      logAction(`Cancelled invoice ${invId}`, "Invoice", invId);
      alert(`Invoice ${invId} has been cancelled.`);
    }
  };

  const handleSendInvoice = (invId: string, email: string) => {
    logAction(`Emailed invoice ${invId} to client`, "Invoice", invId);
    alert(`Invoice ${invId} has been successfully sent to ${email}!`);
  };

  const handleDownloadInvoice = (invId: string) => {
    logAction(`Downloaded PDF copy of invoice ${invId}`, "Invoice", invId);
    alert(`Downloading PDF copy of invoice ${invId}...`);
  };

  const columns = useMemo(() => {
    return [
      {
        key: "id",
        header: "Invoice Number",
        render: (row: Invoice) => <strong style={{ color: "var(--color-navy)" }}>{row.id}</strong>,
        sortValue: (row: Invoice) => row.id,
        csvValue: (row: Invoice) => row.id,
      },
      {
        key: "client",
        header: "Client Name",
        render: (row: Invoice) => (
          <div>
            <Link href={`/admin/clients/${row.clientId}`} className="admin-table-link">
              {row.clientName}
            </Link>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>{row.clientId}</div>
          </div>
        ),
        sortValue: (row: Invoice) => row.clientName,
        csvValue: (row: Invoice) => row.clientName,
      },
      {
        key: "case",
        header: "Case ID",
        render: (row: Invoice) => (
          <Link href={`/admin/cases/${row.caseId}`} className="admin-table-link">
            {row.caseId}
          </Link>
        ),
        sortValue: (row: Invoice) => row.caseId,
        csvValue: (row: Invoice) => row.caseId,
      },
      {
        key: "amount",
        header: "Total Amount",
        render: (row: Invoice) => <span style={{ fontWeight: 600 }}>${row.amount}</span>,
        sortValue: (row: Invoice) => row.amount,
        csvValue: (row: Invoice) => row.amount,
      },
      {
        key: "paid",
        header: "Paid Amount",
        render: (row: Invoice) => <span style={{ color: "var(--color-success)" }}>${row.paidAmount}</span>,
        sortValue: (row: Invoice) => row.paidAmount,
        csvValue: (row: Invoice) => row.paidAmount,
      },
      {
        key: "balance",
        header: "Balance Due",
        render: (row: Invoice) => (
          <span style={{ fontWeight: 600, color: row.amount - row.paidAmount > 0 ? "var(--color-orange)" : undefined }}>
            ${row.amount - row.paidAmount}
          </span>
        ),
        sortValue: (row: Invoice) => row.amount - row.paidAmount,
        csvValue: (row: Invoice) => row.amount - row.paidAmount,
      },
      {
        key: "status",
        header: "Status",
        render: (row: Invoice) => {
          let badge = "badge-grey";
          if (row.status === "Paid") badge = "badge-green";
          else if (row.status === "Issued") badge = "badge-blue";
          else if (row.status === "Partially Paid") badge = "badge-amber";
          else if (row.status === "Overdue") badge = "badge-red";
          else if (row.status === "Cancelled") badge = "badge-grey";
          return <span className={`badge ${badge}`}>{row.status}</span>;
        },
        sortValue: (row: Invoice) => row.status,
        csvValue: (row: Invoice) => row.status,
      },
      {
        key: "dueDate",
        header: "Due Date",
        render: (row: Invoice) => <span>{row.dueDate}</span>,
        sortValue: (row: Invoice) => row.dueDate,
        csvValue: (row: Invoice) => row.dueDate,
      },
      {
        key: "actions",
        header: "Actions",
        render: (row: Invoice) => {
          const clientEmail = clients.find((c) => c.id === row.clientId)?.email || "";
          return (
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button
                type="button"
                className="btn btn-secondary btn-xs"
                title="Download PDF"
                onClick={() => handleDownloadInvoice(row.id)}
              >
                <Download size={13} />
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-xs"
                title="Send Email"
                onClick={() => handleSendInvoice(row.id, clientEmail)}
              >
                <Mail size={13} />
              </button>
              {row.status !== "Paid" && row.status !== "Cancelled" && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary btn-xs"
                    onClick={() => handleOpenRecordPayment(row)}
                  >
                    Pay
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    style={{ color: "var(--color-error)" }}
                    title="Cancel Invoice"
                    onClick={() => handleCancelInvoice(row.id)}
                  >
                    <Ban size={13} />
                  </button>
                </>
              )}
            </div>
          );
        },
      },
    ];
  }, [clients]);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Invoices Directory</h1>
          <p className="admin-page-subtitle">Generate client invoices, view outstanding corporate account statements, and record manual check credits.</p>
        </div>
        <div className="admin-page-header-actions">
          <button type="button" className="btn btn-primary" onClick={() => setCreateModalOpen(true)}>
            <Plus size={16} /> Create Invoice
          </button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search Invoice number, Client name, Case ID...">
        <div className="filter-group">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Issued">Issued</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}>
            <option value="">All Clients</option>
            {clients.map((cl) => (
              <option key={cl.id} value={cl.id}>
                {cl.name}
              </option>
            ))}
          </select>
        </div>
      </FilterBar>

      {/* Main Table view */}
      <div className="admin-panel" style={{ marginTop: "1.5rem", padding: "1rem" }}>
        <AdminTable
          columns={columns}
          rows={filteredInvoices}
          rowKey={(r) => r.id}
          pageSize={10}
          selectable
          exportFilename="invoices_directory_export"
        />
      </div>

      {/* Modal: Create Invoice */}
      <Modal
        open={createModalOpen}
        title="Generate Invoice"
        onCancel={() => setCreateModalOpen(false)}
        onConfirm={() => handleCreateInvoiceSubmit()}
        confirmLabel="Generate Invoice"
      >
        <form className="portal-form" onSubmit={handleCreateInvoiceSubmit}>
          <div className="form-group">
            <label className="form-label">Client Name *</label>
            <select
              className="form-input"
              required
              value={newInvoice.clientId}
              onChange={(e) => {
                setNewInvoice((prev) => ({ ...prev, clientId: e.target.value }));
                // Default to first case for this client if any
                const clientCases = cases.filter((c) => c.clientId === e.target.value);
                if (clientCases.length > 0) {
                  setNewInvoice((prev) => ({ ...prev, caseId: clientCases[0].id }));
                }
              }}
            >
              <option value="">Select Client</option>
              {clients.map((cl) => (
                <option key={cl.id} value={cl.id}>
                  {cl.name} ({cl.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Associated Case Deliverable *</label>
            <select
              className="form-input"
              required
              value={newInvoice.caseId}
              onChange={(e) => setNewInvoice((prev) => ({ ...prev, caseId: e.target.value }))}
            >
              <option value="">Select Case</option>
              {cases
                .filter((c) => c.clientId === newInvoice.clientId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} — {c.serviceName}
                  </option>
                ))}
            </select>
          </div>

          <div className="admin-grid-2">
            <div className="form-group">
              <label className="form-label">Billing Amount ($) *</label>
              <input
                type="number"
                className="form-input"
                required
                min={1}
                value={newInvoice.amount}
                onChange={(e) => setNewInvoice((prev) => ({ ...prev, amount: e.target.value }))}
                placeholder="e.g. 150"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date *</label>
              <input
                type="date"
                className="form-input"
                required
                value={newInvoice.dueDate}
                onChange={(e) => setNewInvoice((prev) => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal: Record Invoice Payment */}
      <Modal
        open={payModalOpen}
        title={`Record Payment for: ${targetInvoice?.id}`}
        onCancel={() => {
          setPayModalOpen(false);
          setTargetInvoice(null);
        }}
        onConfirm={handleConfirmRecordPayment}
        confirmLabel="Record Payment"
      >
        <div className="portal-form">
          <p style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>
            Enter the amount received from client <strong>{targetInvoice?.clientName}</strong> for invoice{" "}
            <strong>{targetInvoice?.id}</strong>. Maximum required is{" "}
            <strong>${targetInvoice ? targetInvoice.amount - targetInvoice.paidAmount : 0}</strong>.
          </p>
          <div className="form-group">
            <label className="form-label">Amount Paid ($) *</label>
            <input
              type="number"
              className="form-input"
              required
              min={1}
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
