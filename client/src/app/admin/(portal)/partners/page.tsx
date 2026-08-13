"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminTable, FilterBar, Modal } from "@/components/admin/ui";
import { Partner, PartnerStatus } from "@/data/admin";
import { Plus, UserCheck, ShieldAlert, Award } from "lucide-react";

export default function PartnersPage() {
  const { partners, logAction } = useAdmin();

  // Page states
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<PartnerStatus | "All">("All");

  // Add Partner Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    pan: "",
    gstin: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankIfsc: "",
    revenueSharePct: "10",
    tdsPct: "10",
  });

  // Filter partners
  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.contactPerson.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === "All" || p.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [partners, search, activeTab]);

  // Submit Handler
  const handleAddPartnerSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (
      !newPartner.name ||
      !newPartner.contactPerson ||
      !newPartner.email ||
      !newPartner.phone ||
      !newPartner.pan ||
      !newPartner.bankAccountName ||
      !newPartner.bankAccountNumber ||
      !newPartner.bankIfsc
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const partnerId = `PTR-${100 + partners.length + 1}`;
    logAction(`Created new channel partner profile ${partnerId} — ${newPartner.name}`, "Partner", partnerId);
    alert(`Partner profile ${partnerId} submitted successfully! (Awaiting KYC verification)`);
    setAddModalOpen(false);
    setNewPartner({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      pan: "",
      gstin: "",
      bankAccountName: "",
      bankAccountNumber: "",
      bankIfsc: "",
      revenueSharePct: "10",
      tdsPct: "10",
    });
  };

  const columns = useMemo(() => {
    return [
      {
        key: "name",
        header: "Partner",
        render: (row: Partner) => (
          <div>
            <Link href={`/admin/partners/${row.id}`} className="admin-table-link" style={{ fontWeight: 600 }}>
              {row.name}
            </Link>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
              Contact: {row.contactPerson}
            </div>
          </div>
        ),
        sortValue: (row: Partner) => row.name,
        csvValue: (row: Partner) => row.name,
      },
      {
        key: "id",
        header: "Partner ID",
        render: (row: Partner) => <code>{row.id}</code>,
        sortValue: (row: Partner) => row.id,
        csvValue: (row: Partner) => row.id,
      },
      {
        key: "email",
        header: "Contact Email",
        render: (row: Partner) => <span>{row.email}</span>,
        csvValue: (row: Partner) => row.email,
      },
      {
        key: "kyc",
        header: "KYC Status",
        render: (row: Partner) => {
          const totalDocs = row.kycDocuments.length;
          const accepted = row.kycDocuments.filter((d) => d.status === "Accepted").length;
          const underReview = row.kycDocuments.filter((d) => d.status === "Under Review").length;

          let badgeClass = "badge-grey";
          let label = "Pending Upload";

          if (totalDocs > 0) {
            if (accepted === totalDocs) {
              badgeClass = "badge-green";
              label = "KYC Verified";
            } else if (underReview > 0) {
              badgeClass = "badge-blue";
              label = "Docs Under Review";
            } else {
              badgeClass = "badge-amber";
              label = "KYC Incomplete";
            }
          }
          return <span className={`badge ${badgeClass}`}>{label}</span>;
        },
      },
      {
        key: "clientsCount",
        header: "Clients Referred",
        render: (row: Partner) => <span>{row.clientsCount} clients</span>,
        sortValue: (row: Partner) => row.clientsCount,
        csvValue: (row: Partner) => row.clientsCount,
      },
      {
        key: "revenueShare",
        header: "Rev Share %",
        render: (row: Partner) => <span>{row.revenueSharePct}%</span>,
        sortValue: (row: Partner) => row.revenueSharePct,
        csvValue: (row: Partner) => row.revenueSharePct,
      },
      {
        key: "status",
        header: "Status",
        render: (row: Partner) => {
          let badge = "badge-grey";
          if (row.status === "Active") badge = "badge-green";
          else if (row.status === "Pending Verification") badge = "badge-amber";
          else if (row.status === "Suspended") badge = "badge-red";
          else if (row.status === "Rejected") badge = "badge-red";
          return <span className={`badge ${badge}`}>{row.status}</span>;
        },
        sortValue: (row: Partner) => row.status,
        csvValue: (row: Partner) => row.status,
      },
      {
        key: "createdDate",
        header: "Onboarded",
        render: (row: Partner) => <span>{row.createdDate}</span>,
        sortValue: (row: Partner) => row.createdDate,
        csvValue: (row: Partner) => row.createdDate,
      },
      {
        key: "actions",
        header: "Actions",
        render: (row: Partner) => (
          <Link href={`/admin/partners/${row.id}`} className="btn btn-secondary btn-xs">
            Manage
          </Link>
        ),
      },
    ];
  }, []);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Channel Partners</h1>
          <p className="admin-page-subtitle">Verify partner KYC submissions, referrals, commission share agreements, and payout settlements.</p>
        </div>
        <div className="admin-page-header-actions">
          <button type="button" className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
            <Plus size={16} /> Add Partner
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" role="tablist" style={{ marginBottom: "1.5rem" }}>
        {["All", "Pending Verification", "Active", "Suspended", "Rejected"].map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab as PartnerStatus | "All")}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter search */}
      <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by partner name, ID or contact person..." />

      {/* Table view */}
      <div className="admin-panel" style={{ marginTop: "1.5rem", padding: "1rem" }}>
        <AdminTable
          columns={columns}
          rows={filteredPartners}
          rowKey={(r) => r.id}
          pageSize={10}
          selectable
          exportFilename="partners_list_export"
        />
      </div>

      {/* Add Partner Modal */}
      <Modal
        open={addModalOpen}
        title="Add Channel Partner Profile"
        onCancel={() => setAddModalOpen(false)}
        onConfirm={() => handleAddPartnerSubmit()}
        confirmLabel="Register Partner"
      >
        <form className="portal-form" onSubmit={handleAddPartnerSubmit}>
          <div className="form-group">
            <label className="form-label">Business / Firm Name *</label>
            <input
              type="text"
              className="form-input"
              required
              value={newPartner.name}
              onChange={(e) => setNewPartner((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Zenith Advisors LLP"
            />
          </div>

          <div className="admin-grid-2">
            <div className="form-group">
              <label className="form-label">Contact Person *</label>
              <input
                type="text"
                className="form-input"
                required
                value={newPartner.contactPerson}
                onChange={(e) => setNewPartner((prev) => ({ ...prev, contactPerson: e.target.value }))}
                placeholder="e.g. Kunal Shah"
              />
            </div>
            <div className="form-group">
              <label className="form-label">PAN Number *</label>
              <input
                type="text"
                className="form-input"
                required
                value={newPartner.pan}
                onChange={(e) => setNewPartner((prev) => ({ ...prev, pan: e.target.value.toUpperCase() }))}
                placeholder="ABCDE1234F"
              />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                required
                value={newPartner.email}
                onChange={(e) => setNewPartner((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="partner@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                className="form-input"
                required
                value={newPartner.phone}
                onChange={(e) => setNewPartner((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 98200 12345"
              />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="form-group">
              <label className="form-label">GSTIN (Optional)</label>
              <input
                type="text"
                className="form-input"
                value={newPartner.gstin}
                onChange={(e) => setNewPartner((prev) => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                placeholder="27AAZPS1234C1Z8"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rev Share Split (%) *</label>
              <input
                type="number"
                className="form-input"
                required
                min={0}
                max={100}
                value={newPartner.revenueSharePct}
                onChange={(e) => setNewPartner((prev) => ({ ...prev, revenueSharePct: e.target.value }))}
              />
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--color-border)", marginTop: "1rem", paddingTop: "1rem" }}>
            <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, margin: "0 0 0.75rem 0" }}>Settlement Bank Details</h4>
            <div className="form-group">
              <label className="form-label">Bank Account Name *</label>
              <input
                type="text"
                className="form-input"
                required
                value={newPartner.bankAccountName}
                onChange={(e) => setNewPartner((prev) => ({ ...prev, bankAccountName: e.target.value }))}
                placeholder="e.g. Zenith Advisors Account"
              />
            </div>
            <div className="admin-grid-2">
              <div className="form-group">
                <label className="form-label">Account Number *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={newPartner.bankAccountNumber}
                  onChange={(e) => setNewPartner((prev) => ({ ...prev, bankAccountNumber: e.target.value }))}
                  placeholder="e.g. 10023024212"
                />
              </div>
              <div className="form-group">
                <label className="form-label">IFSC Code *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={newPartner.bankIfsc}
                  onChange={(e) => setNewPartner((prev) => ({ ...prev, bankIfsc: e.target.value.toUpperCase() }))}
                  placeholder="HDFC0000123"
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
