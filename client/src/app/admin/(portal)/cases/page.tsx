"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminTable, FilterBar, Modal } from "@/components/admin/ui";
import { AdminCase, AdminCaseStatus, CasePriority } from "@/data/admin";
import { Plus, User, AlertTriangle } from "lucide-react";

export default function CasesPage() {
  const {
    cases,
    clients,
    services,
    partners,
    teamUsers,
    logAction,
  } = useAdmin();

  // Page filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("");
  const [assignedFilter, setAssignedFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // Create Case Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCase, setNewCase] = useState({
    clientId: "",
    serviceId: "",
    assignedTo: "",
    priority: "Medium" as CasePriority,
    amount: "75",
  });

  // Filter application
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch =
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.clientName.toLowerCase().includes(search.toLowerCase()) ||
        c.serviceName.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = !statusFilter || c.status === statusFilter;
      const matchesService = !serviceFilter || c.serviceId === serviceFilter;
      const matchesClient = !clientFilter || c.clientId === clientFilter;
      const matchesPartner =
        !partnerFilter ||
        (partnerFilter === "none" ? !c.partnerId : c.partnerId === partnerFilter);
      const matchesAssigned = !assignedFilter || c.assignedTo === assignedFilter;
      const matchesPriority = !priorityFilter || c.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesService &&
        matchesClient &&
        matchesPartner &&
        matchesAssigned &&
        matchesPriority
      );
    });
  }, [
    cases,
    search,
    statusFilter,
    serviceFilter,
    clientFilter,
    partnerFilter,
    assignedFilter,
    priorityFilter,
  ]);

  // Submit Handler
  const handleCreateCaseSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCase.clientId || !newCase.serviceId) {
      alert("Please fill in required fields.");
      return;
    }

    const clientObj = clients.find((cl) => cl.id === newCase.clientId);
    const serviceObj = services.find((sr) => sr.id === newCase.serviceId);
    
    if (!clientObj || !serviceObj) return;

    const caseId = `AA-CASE-${1000 + cases.length + 1}`;
    logAction(`Created new operations case ${caseId} for client ${clientObj.name}`, "Case", caseId);
    
    alert(`Case ${caseId} initialized successfully! (Simulated local action)`);
    setCreateModalOpen(false);
    setNewCase({
      clientId: "",
      serviceId: "",
      assignedTo: "",
      priority: "Medium",
      amount: "75",
    });
  };

  const columns = useMemo(() => {
    return [
      {
        key: "id",
        header: "Case ID",
        render: (row: AdminCase) => (
          <Link href={`/admin/cases/${row.id}`} className="admin-table-link" style={{ fontWeight: 600 }}>
            {row.id}
          </Link>
        ),
        sortValue: (row: AdminCase) => row.id,
        csvValue: (row: AdminCase) => row.id,
      },
      {
        key: "client",
        header: "Client",
        render: (row: AdminCase) => (
          <div>
            <Link href={`/admin/clients/${row.clientId}`} className="admin-table-link">
              {row.clientName}
            </Link>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>{row.clientId}</div>
          </div>
        ),
        sortValue: (row: AdminCase) => row.clientName,
        csvValue: (row: AdminCase) => row.clientName,
      },
      {
        key: "partner",
        header: "Referred Partner",
        render: (row: AdminCase) => (
          <span style={{ fontStyle: !row.partnerName ? "italic" : undefined }}>
            {row.partnerName || "Direct"}
          </span>
        ),
        sortValue: (row: AdminCase) => row.partnerName || "",
        csvValue: (row: AdminCase) => row.partnerName || "Direct",
      },
      {
        key: "service",
        header: "Service",
        render: (row: AdminCase) => <span>{row.serviceName}</span>,
        sortValue: (row: AdminCase) => row.serviceName,
        csvValue: (row: AdminCase) => row.serviceName,
      },
      {
        key: "assignedTo",
        header: "Assigned To",
        render: (row: AdminCase) => (
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <User size={13} style={{ color: "var(--color-text-secondary)" }} />
            <span>{row.assignedTo || "Unassigned"}</span>
          </div>
        ),
        sortValue: (row: AdminCase) => row.assignedTo || "",
        csvValue: (row: AdminCase) => row.assignedTo || "Unassigned",
      },
      {
        key: "status",
        header: "Status",
        render: (row: AdminCase) => {
          let badge = "badge-grey";
          if (row.status === "Completed") badge = "badge-green";
          else if (["In Progress", "Review"].includes(row.status)) badge = "badge-blue";
          else if (["Payment Pending", "Documents Pending", "Waiting for Client"].includes(row.status)) badge = "badge-amber";
          else if (row.status === "Closed") badge = "badge-grey";
          else if (row.status === "Cancelled") badge = "badge-red";
          return <span className={`badge ${badge}`}>{row.status}</span>;
        },
        sortValue: (row: AdminCase) => row.status,
        csvValue: (row: AdminCase) => row.status,
      },
      {
        key: "priority",
        header: "Priority",
        render: (row: AdminCase) => {
          let color = "var(--color-text-secondary)";
          if (row.priority === "High") color = "var(--color-error)";
          else if (row.priority === "Medium") color = "var(--color-orange)";
          return <span style={{ color, fontWeight: row.priority === "High" ? 600 : undefined }}>{row.priority}</span>;
        },
        sortValue: (row: AdminCase) => row.priority,
        csvValue: (row: AdminCase) => row.priority,
      },
      {
        key: "slaDueDate",
        header: "SLA Due Date",
        render: (row: AdminCase) => (
          <span style={{ color: row.priority === "High" ? "var(--color-error)" : undefined }}>
            {row.slaDueDate}
          </span>
        ),
        sortValue: (row: AdminCase) => row.slaDueDate,
        csvValue: (row: AdminCase) => row.slaDueDate,
      },
      {
        key: "created",
        header: "Created",
        render: (row: AdminCase) => <span>{row.createdDate}</span>,
        sortValue: (row: AdminCase) => row.createdDate,
        csvValue: (row: AdminCase) => row.createdDate,
      },
      {
        key: "actions",
        header: "Actions",
        render: (row: AdminCase) => (
          <Link href={`/admin/cases/${row.id}`} className="btn btn-secondary btn-xs">
            Review
          </Link>
        ),
      },
    ];
  }, []);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Operations Cases Board</h1>
          <p className="admin-page-subtitle">Track, assign, and process filing applications and compliance returns.</p>
        </div>
        <div className="admin-page-header-actions">
          <button type="button" className="btn btn-primary" onClick={() => setCreateModalOpen(true)}>
            <Plus size={16} /> Create Case
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by Case ID, client or service name...">
        <div className="filter-group">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Payment Pending">Payment Pending</option>
            <option value="Documents Pending">Documents Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting for Client">Waiting for Client</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
            <option value="Closed">Closed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
            <option value="">All Services</option>
            {services.map((srv) => (
              <option key={srv.id} value={srv.id}>
                {srv.name}
              </option>
            ))}
          </select>

          <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}>
            <option value="">All Clients</option>
            {clients.map((cl) => (
              <option key={cl.id} value={cl.id}>
                {cl.name}
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

          <select value={assignedFilter} onChange={(e) => setAssignedFilter(e.target.value)}>
            <option value="">All Agents</option>
            {teamUsers.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>

          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </FilterBar>

      {/* Main Table view */}
      <div className="admin-panel" style={{ marginTop: "1.5rem", padding: "1rem" }}>
        <AdminTable
          columns={columns}
          rows={filteredCases}
          rowKey={(r) => r.id}
          pageSize={10}
          selectable
          exportFilename="cases_board_export"
        />
      </div>

      {/* Create Case Modal */}
      <Modal
        open={createModalOpen}
        title="Initialize New Operations Case"
        onCancel={() => setCreateModalOpen(false)}
        onConfirm={() => handleCreateCaseSubmit()}
        confirmLabel="Initialize Case"
      >
        <form className="portal-form" onSubmit={handleCreateCaseSubmit}>
          <div className="form-group">
            <label className="form-label">Client Name *</label>
            <select
              className="form-input"
              required
              value={newCase.clientId}
              onChange={(e) => setNewCase((prev) => ({ ...prev, clientId: e.target.value }))}
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
            <label className="form-label">Select Service deliverables *</label>
            <select
              className="form-input"
              required
              value={newCase.serviceId}
              onChange={(e) => {
                setNewCase((prev) => ({ ...prev, serviceId: e.target.value }));
                const targetSrv = services.find((s) => s.id === e.target.value);
                if (targetSrv && targetSrv.price) {
                  setNewCase((prev) => ({ ...prev, amount: String(targetSrv.price) }));
                }
              }}
            >
              <option value="">Select Service</option>
              {services.map((srv) => (
                <option key={srv.id} value={srv.id}>
                  {srv.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-grid-2">
            <div className="form-group">
              <label className="form-label">Assign Agent</label>
              <select
                className="form-input"
                value={newCase.assignedTo}
                onChange={(e) => setNewCase((prev) => ({ ...prev, assignedTo: e.target.value }))}
              >
                <option value="">Select Agent</option>
                {teamUsers
                  .filter((u) => u.status === "Active")
                  .map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-input"
                value={newCase.priority}
                onChange={(e) => setNewCase((prev) => ({ ...prev, priority: e.target.value as CasePriority }))}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Filing Charge / Base Fee ($)</label>
            <input
              type="number"
              className="form-input"
              value={newCase.amount}
              onChange={(e) => setNewCase((prev) => ({ ...prev, amount: e.target.value }))}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
