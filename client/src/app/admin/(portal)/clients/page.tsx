"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminTable, FilterBar, Modal } from "@/components/admin/ui";
import { AdminClient, ClientType, ClientStatus } from "@/data/admin";
import { Plus, User, FileText, CheckCircle } from "lucide-react";

export default function ClientsPage() {
  const { clients, partners, services, logAction } = useAdmin();
  
  // Page states
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("");

  // Add Client Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Self Client" as ClientType,
    partnerId: "",
    address: "",
  });

  // Filter application
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.id.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase());
      const matchesType = !typeFilter || client.type === typeFilter;
      const matchesStatus = !statusFilter || client.status === statusFilter;
      const matchesPartner = !partnerFilter || client.partnerId === partnerFilter;

      return matchesSearch && matchesType && matchesStatus && matchesPartner;
    });
  }, [clients, search, typeFilter, statusFilter, partnerFilter]);

  // Add client submit handler
  const handleAddClientSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newClient.name || !newClient.email || !newClient.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    const clientId = `CLT-${2000 + clients.length + 1}`;
    logAction(`Created new client profile ${clientId} — ${newClient.name}`, "Client", clientId);
    alert(`Client profile ${clientId} created successfully! (Simulated local action)`);
    setAddModalOpen(false);
    setNewClient({
      name: "",
      email: "",
      phone: "",
      type: "Self Client",
      partnerId: "",
      address: "",
    });
  };

  // Columns definition
  const columns = useMemo(() => {
    return [
      {
        key: "name",
        header: "Client",
        render: (row: AdminClient) => (
          <div>
            <Link href={`/admin/clients/${row.id}`} className="admin-table-link" style={{ fontWeight: 600 }}>
              {row.name}
            </Link>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>{row.email}</div>
          </div>
        ),
        sortValue: (row: AdminClient) => row.name,
        csvValue: (row: AdminClient) => row.name,
      },
      {
        key: "id",
        header: "Client ID",
        render: (row: AdminClient) => <code style={{ fontSize: "0.8rem" }}>{row.id}</code>,
        sortValue: (row: AdminClient) => row.id,
        csvValue: (row: AdminClient) => row.id,
      },
      {
        key: "type",
        header: "Client Type",
        render: (row: AdminClient) => (
          <span className={`badge ${row.type === "Self Client" ? "badge-blue" : "badge-purple"}`}>
            {row.type}
          </span>
        ),
        sortValue: (row: AdminClient) => row.type,
        csvValue: (row: AdminClient) => row.type,
      },
      {
        key: "partner",
        header: "Referral Partner",
        render: (row: AdminClient) => (
          <span style={{ fontStyle: !row.partnerName ? "italic" : undefined }}>
            {row.partnerName || "None (Direct)"}
          </span>
        ),
        sortValue: (row: AdminClient) => row.partnerName || "",
        csvValue: (row: AdminClient) => row.partnerName || "Direct",
      },
      {
        key: "activeCases",
        header: "Active Cases",
        render: (row: AdminClient) => (
          <span style={{ fontWeight: row.activeCases > 0 ? 600 : undefined }}>
            {row.activeCases}
          </span>
        ),
        sortValue: (row: AdminClient) => row.activeCases,
        csvValue: (row: AdminClient) => row.activeCases,
      },
      {
        key: "services",
        header: "Services Registered",
        render: (row: AdminClient) => (
          <span className="text-truncate" style={{ maxWidth: "200px" }}>
            {row.services.join(", ") || "None"}
          </span>
        ),
        csvValue: (row: AdminClient) => row.services.join(";"),
      },
      {
        key: "status",
        header: "Status",
        render: (row: AdminClient) => (
          <span className={`badge ${row.status === "Active" ? "badge-green" : "badge-grey"}`}>
            {row.status}
          </span>
        ),
        sortValue: (row: AdminClient) => row.status,
        csvValue: (row: AdminClient) => row.status,
      },
      {
        key: "createdDate",
        header: "Created Date",
        render: (row: AdminClient) => <span>{row.createdDate}</span>,
        sortValue: (row: AdminClient) => row.createdDate,
        csvValue: (row: AdminClient) => row.createdDate,
      },
      {
        key: "actions",
        header: "Actions",
        render: (row: AdminClient) => (
          <div style={{ display: "flex", gap: "0.25rem" }}>
            <Link href={`/admin/clients/${row.id}`} className="btn btn-secondary btn-xs">
              Profile
            </Link>
          </div>
        ),
      },
    ];
  }, []);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Clients Directory</h1>
          <p className="admin-page-subtitle">Manage client profiles, corporate entities, referred channel clients, and case compliance histories.</p>
        </div>
        <div className="admin-page-header-actions">
          <button type="button" className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
            <Plus size={16} /> Add Client
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by name, ID or email...">
        <div className="filter-group">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="Self Client">Self Client</option>
            <option value="Partner Client">Partner Client</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select value={partnerFilter} onChange={(e) => setPartnerFilter(e.target.value)}>
            <option value="">All Partners</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </FilterBar>

      {/* Table Panel */}
      <div className="admin-panel" style={{ marginTop: "1.5rem", padding: "1rem" }}>
        <AdminTable
          columns={columns}
          rows={filteredClients}
          rowKey={(r) => r.id}
          pageSize={10}
          selectable
          exportFilename="clients_directory_export"
        />
      </div>

      {/* Add Client Modal */}
      <Modal
        open={addModalOpen}
        title="Add New Client Profile"
        onCancel={() => setAddModalOpen(false)}
        onConfirm={() => handleAddClientSubmit()}
        confirmLabel="Save Client"
      >
        <form className="portal-form" onSubmit={handleAddClientSubmit}>
          <div className="form-group">
            <label className="form-label">Client/Company Name *</label>
            <input
              type="text"
              className="form-input"
              required
              value={newClient.name}
              onChange={(e) => setNewClient((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Rohan Mehta or Alpha Retail Private Ltd"
            />
          </div>

          <div className="admin-grid-2">
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-input"
                required
                value={newClient.email}
                onChange={(e) => setNewClient((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="accounts@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                type="text"
                className="form-input"
                required
                value={newClient.phone}
                onChange={(e) => setNewClient((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="form-group">
              <label className="form-label">Client Type</label>
              <select
                className="form-input"
                value={newClient.type}
                onChange={(e) => setNewClient((prev) => ({ ...prev, type: e.target.value as ClientType }))}
              >
                <option value="Self Client">Self Client</option>
                <option value="Partner Client">Partner Client</option>
              </select>
            </div>
            {newClient.type === "Partner Client" && (
              <div className="form-group">
                <label className="form-label">Referring Partner</label>
                <select
                  className="form-input"
                  required
                  value={newClient.partnerId}
                  onChange={(e) => setNewClient((prev) => ({ ...prev, partnerId: e.target.value }))}
                >
                  <option value="">Select Partner</option>
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={newClient.address}
              onChange={(e) => setNewClient((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Full business or communication address..."
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
