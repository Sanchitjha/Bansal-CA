"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import {
  AdminTable,
  FilterBar,
  Kanban,
  KanbanColumnConfig,
  Modal,
  Drawer,
} from "@/components/admin/ui";
import { Lead, LeadStatus, LeadSource } from "@/data/admin";
import { Plus, List, LayoutGrid, CheckCircle, Edit, User, Mail, Phone, Calendar, Tag } from "lucide-react";

export default function LeadsPage() {
  const {
    leads,
    services,
    teamUsers,
    partners,
    updateLeadStatus,
    logAction,
  } = useAdmin();

  // Page states
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [assignedFilter, setAssignedFilter] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("");

  // Add Lead Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    serviceId: "",
    source: "Website" as LeadSource,
    partnerId: "",
    assignedTo: "",
    notes: "",
  });

  // Selected Lead Drawer State (for viewing/editing details)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Filters application
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.id.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || lead.status === statusFilter;
      const matchesSource = !sourceFilter || lead.source === sourceFilter;
      const matchesService = !serviceFilter || lead.serviceId === serviceFilter;
      const matchesAssigned = !assignedFilter || lead.assignedTo === assignedFilter;
      const matchesPartner =
        !partnerFilter ||
        (partnerFilter === "none" ? !lead.partnerId : lead.partnerId === partnerFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSource &&
        matchesService &&
        matchesAssigned &&
        matchesPartner
      );
    });
  }, [leads, search, statusFilter, sourceFilter, serviceFilter, assignedFilter, partnerFilter]);

  // Kanban config
  const kanbanColumns = useMemo<KanbanColumnConfig<Lead>[]>(() => {
    const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Converted", "Lost"];
    return statuses.map((status) => ({
      id: status,
      label: status.toUpperCase(),
      items: filteredLeads.filter((l) => l.status === status),
    }));
  }, [filteredLeads]);

  // Handlers
  const handleAddLeadSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newLead.name || !newLead.email || !newLead.phone || !newLead.serviceId) {
      alert("Please fill in all required fields.");
      return;
    }

    const selectedService = services.find((s) => s.id === newLead.serviceId);
    const selectedPartner = partners.find((p) => p.id === newLead.partnerId);

    // Call context logger to log action since there's no actual API
    const leadId = `LEAD-${Date.now().toString().slice(-4)}`;
    logAction(`Created new lead ${leadId} for client ${newLead.name}`, "Lead", leadId);

    alert(`Lead ${leadId} created successfully! (Simulated local action)`);
    setAddModalOpen(false);
    // Reset state
    setNewLead({
      name: "",
      email: "",
      phone: "",
      serviceId: "",
      source: "Website",
      partnerId: "",
      assignedTo: "",
      notes: "",
    });
  };

  const handleStatusChange = (leadId: string, status: LeadStatus) => {
    updateLeadStatus(leadId, status);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status } : null));
    }
  };

  // Table Columns Setup
  const columns = useMemo(() => {
    return [
      {
        key: "id",
        header: "Lead ID",
        render: (row: Lead) => (
          <span
            className="admin-table-link"
            onClick={() => setSelectedLead(row)}
            style={{ cursor: "pointer" }}
          >
            {row.id}
          </span>
        ),
        sortValue: (row: Lead) => row.id,
        csvValue: (row: Lead) => row.id,
      },
      {
        key: "name",
        header: "Name",
        render: (row: Lead) => (
          <div>
            <div style={{ fontWeight: 500 }}>{row.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>{row.email}</div>
          </div>
        ),
        sortValue: (row: Lead) => row.name,
        csvValue: (row: Lead) => row.name,
      },
      {
        key: "contact",
        header: "Contact",
        render: (row: Lead) => <span>{row.phone}</span>,
        csvValue: (row: Lead) => row.phone,
      },
      {
        key: "serviceName",
        header: "Service Requested",
        render: (row: Lead) => <span>{row.serviceName}</span>,
        sortValue: (row: Lead) => row.serviceName,
        csvValue: (row: Lead) => row.serviceName,
      },
      {
        key: "source",
        header: "Source",
        render: (row: Lead) => <span>{row.source}</span>,
        sortValue: (row: Lead) => row.source,
        csvValue: (row: Lead) => row.source,
      },
      {
        key: "partnerName",
        header: "Referral Partner",
        render: (row: Lead) => (
          <span style={{ fontStyle: !row.partnerName ? "italic" : undefined }}>
            {row.partnerName || "Direct Client"}
          </span>
        ),
        sortValue: (row: Lead) => row.partnerName || "",
        csvValue: (row: Lead) => row.partnerName || "Direct",
      },
      {
        key: "assignedTo",
        header: "Assigned To",
        render: (row: Lead) => (
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <User size={13} style={{ color: "var(--color-text-secondary)" }} />
            <span>{row.assignedTo || "Unassigned"}</span>
          </div>
        ),
        sortValue: (row: Lead) => row.assignedTo || "",
        csvValue: (row: Lead) => row.assignedTo || "Unassigned",
      },
      {
        key: "status",
        header: "Status",
        render: (row: Lead) => {
          let badgeClass = "badge-grey";
          if (row.status === "New") badgeClass = "badge-blue";
          else if (row.status === "Contacted") badgeClass = "badge-amber";
          else if (row.status === "Qualified") badgeClass = "badge-purple";
          else if (row.status === "Converted") badgeClass = "badge-green";
          else if (row.status === "Lost") badgeClass = "badge-red";
          return <span className={`badge ${badgeClass}`}>{row.status}</span>;
        },
        sortValue: (row: Lead) => row.status,
        csvValue: (row: Lead) => row.status,
      },
      {
        key: "createdDate",
        header: "Created",
        render: (row: Lead) => <span>{row.createdDate}</span>,
        sortValue: (row: Lead) => row.createdDate,
        csvValue: (row: Lead) => row.createdDate,
      },
      {
        key: "actions",
        header: "Actions",
        render: (row: Lead) => (
          <button
            type="button"
            className="btn btn-secondary btn-xs"
            onClick={() => setSelectedLead(row)}
          >
            Manage
          </button>
        ),
      },
    ];
  }, [updateLeadStatus]);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Leads Management</h1>
          <p className="admin-page-subtitle">Track and qualify prospective business client leads.</p>
        </div>
        <div className="admin-page-header-actions">
          <div className="btn-group" style={{ marginRight: "0.75rem" }}>
            <button
              type="button"
              className={`btn btn-secondary ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              <List size={16} /> Table
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${viewMode === "kanban" ? "active" : ""}`}
              onClick={() => setViewMode("kanban")}
              title="Kanban View"
            >
              <LayoutGrid size={16} /> Kanban
            </button>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
            <Plus size={16} /> Add Lead
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by name, ID or email...">
        <div className="filter-group">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>

          <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
            <option value="">All Services</option>
            {services.map((srv) => (
              <option key={srv.id} value={srv.id}>
                {srv.name}
              </option>
            ))}
          </select>

          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Partner Referral">Partner Referral</option>
            <option value="Phone Enquiry">Phone Enquiry</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Referral">Referral</option>
          </select>

          <select value={assignedFilter} onChange={(e) => setAssignedFilter(e.target.value)}>
            <option value="">All Assignees</option>
            {teamUsers.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>

          <select value={partnerFilter} onChange={(e) => setPartnerFilter(e.target.value)}>
            <option value="">All Partners</option>
            <option value="none">Direct (No Partner)</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </FilterBar>

      {/* Main View Area */}
      <div className="admin-panel" style={{ marginTop: "1.5rem", padding: "1rem" }}>
        {viewMode === "table" ? (
          <AdminTable
            columns={columns}
            rows={filteredLeads}
            rowKey={(r) => r.id}
            pageSize={10}
            selectable
            exportFilename="leads_export"
          />
        ) : (
          <Kanban
            columns={kanbanColumns}
            onCardClick={(item) => setSelectedLead(item)}
            renderCard={(item) => (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-orange)" }}>{item.id}</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--color-text-secondary)" }}>{item.createdDate}</span>
                </div>
                <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-primary)", margin: "0 0 0.25rem 0" }}>
                  {item.name}
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", margin: "0 0 0.5rem 0" }}>
                  {item.serviceName}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-border)", paddingTop: "0.35rem", marginTop: "0.35rem", fontSize: "0.7rem" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>Src: {item.source}</span>
                  <span style={{ fontWeight: 500 }}>{item.assignedTo || "Unassigned"}</span>
                </div>
              </div>
            )}
          />
        )}
      </div>

      {/* Add Lead Form Modal */}
      <Modal
        open={addModalOpen}
        title="Add New prospective Lead"
        onCancel={() => setAddModalOpen(false)}
        onConfirm={() => handleAddLeadSubmit()}
        confirmLabel="Save Lead"
      >
        <form className="portal-form" onSubmit={handleAddLeadSubmit}>
          <div className="form-group">
            <label className="form-label">Client Name *</label>
            <input
              type="text"
              className="form-input"
              required
              value={newLead.name}
              onChange={(e) => setNewLead((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Kavita Rao"
            />
          </div>

          <div className="admin-grid-2">
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-input"
                required
                value={newLead.email}
                onChange={(e) => setNewLead((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="client@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                type="text"
                className="form-input"
                required
                value={newLead.phone}
                onChange={(e) => setNewLead((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 90000 12345"
              />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="form-group">
              <label className="form-label">Service Request *</label>
              <select
                className="form-input"
                required
                value={newLead.serviceId}
                onChange={(e) => setNewLead((prev) => ({ ...prev, serviceId: e.target.value }))}
              >
                <option value="">Select Service</option>
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Lead Source</label>
              <select
                className="form-input"
                value={newLead.source}
                onChange={(e) => setNewLead((prev) => ({ ...prev, source: e.target.value as LeadSource }))}
              >
                <option value="Website">Website</option>
                <option value="Phone Enquiry">Phone Enquiry</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Partner Referral">Partner Referral</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
          </div>

          {newLead.source === "Partner Referral" && (
            <div className="form-group">
              <label className="form-label">Referring Partner</label>
              <select
                className="form-input"
                value={newLead.partnerId}
                onChange={(e) => setNewLead((prev) => ({ ...prev, partnerId: e.target.value }))}
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

          <div className="form-group">
            <label className="form-label">Assign To</label>
            <select
              className="form-input"
              value={newLead.assignedTo}
              onChange={(e) => setNewLead((prev) => ({ ...prev, assignedTo: e.target.value }))}
            >
              <option value="">Select Staff member</option>
              {teamUsers
                .filter((u) => u.status === "Active")
                .map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name} ({u.role})
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={newLead.notes}
              onChange={(e) => setNewLead((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Any details about the enquiry..."
            />
          </div>
        </form>
      </Modal>

      {/* Lead Detail Drawer (Manage Actions) */}
      <Drawer
        open={selectedLead !== null}
        title={`Manage Lead: ${selectedLead?.id}`}
        onClose={() => setSelectedLead(null)}
      >
        {selectedLead && (
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Contact Details */}
            <div className="admin-panel" style={{ padding: "1rem" }}>
              <h3 style={{ fontSize: "0.875rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem", margin: "0 0 1rem 0" }}>
                <User size={15} /> Lead Details
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem" }}>
                <div>
                  <span style={{ color: "var(--color-text-secondary)" }}>Name:</span>
                  <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{selectedLead.name}</div>
                </div>
                <div>
                  <span style={{ color: "var(--color-text-secondary)" }}><Mail size={12} style={{ display: "inline", marginRight: "4px" }} /> Email:</span>
                  <div>{selectedLead.email}</div>
                </div>
                <div>
                  <span style={{ color: "var(--color-text-secondary)" }}><Phone size={12} style={{ display: "inline", marginRight: "4px" }} /> Phone:</span>
                  <div>{selectedLead.phone}</div>
                </div>
                <div>
                  <span style={{ color: "var(--color-text-secondary)" }}><Calendar size={12} style={{ display: "inline", marginRight: "4px" }} /> Created:</span>
                  <div>{selectedLead.createdDate}</div>
                </div>
              </div>
            </div>

            {/* Service & Context */}
            <div className="admin-panel" style={{ padding: "1rem" }}>
              <h3 style={{ fontSize: "0.875rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem", margin: "0 0 1rem 0" }}>
                <Tag size={15} /> Service & Referral Context
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem" }}>
                <div>
                  <span style={{ color: "var(--color-text-secondary)" }}>Service Requested:</span>
                  <div style={{ fontWeight: 500 }}>{selectedLead.serviceName}</div>
                </div>
                <div>
                  <span style={{ color: "var(--color-text-secondary)" }}>Source:</span>
                  <div>{selectedLead.source}</div>
                </div>
                {selectedLead.partnerName && (
                  <div>
                    <span style={{ color: "var(--color-text-secondary)" }}>Referral Partner:</span>
                    <div>{selectedLead.partnerName}</div>
                  </div>
                )}
                {selectedLead.notes && (
                  <div>
                    <span style={{ color: "var(--color-text-secondary)" }}>Notes:</span>
                    <p style={{ margin: "0.25rem 0 0 0", fontStyle: "italic", whiteSpace: "pre-line" }}>
                      &quot;{selectedLead.notes}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Change Status & Assignment */}
            <div className="admin-panel" style={{ padding: "1rem" }}>
              <h3 style={{ fontSize: "0.875rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem", margin: "0 0 1rem 0" }}>
                <Edit size={15} /> Operations Actions
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Change Status</label>
                  <select
                    className="form-input"
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Assign Operations Agent</label>
                  <select
                    className="form-input"
                    value={selectedLead.assignedTo}
                    onChange={(e) => {
                      logAction(`Reassigned Lead ${selectedLead.id} to ${e.target.value}`, "Lead", selectedLead.id);
                      setSelectedLead((prev) => (prev ? { ...prev, assignedTo: e.target.value } : null));
                      // We also update it locally in the state since we can't change lead agent via context method
                      leads.forEach((l) => {
                        if (l.id === selectedLead.id) l.assignedTo = e.target.value;
                      });
                    }}
                  >
                    <option value="">Unassigned</option>
                    {teamUsers
                      .filter((u) => u.status === "Active")
                      .map((u) => (
                        <option key={u.id} value={u.name}>
                          {u.name}
                        </option>
                      ))}
                  </select>
                </div>

                {selectedLead.status === "Qualified" && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: "0.5rem" }}
                    onClick={() => {
                      handleStatusChange(selectedLead.id, "Converted");
                      logAction(`Converted Lead ${selectedLead.id} to active client case`, "Lead", selectedLead.id);
                      alert("Successfully converted lead to active customer! (A case record is created)");
                      setSelectedLead(null);
                    }}
                  >
                    <CheckCircle size={15} /> Convert to Active Client
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
