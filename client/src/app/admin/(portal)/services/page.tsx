"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminTable, FilterBar, Modal } from "@/components/admin/ui";
import { Service, ServiceStatus, PricingModel, PaymentRule } from "@/data/admin";
import { Plus, Tag, ShieldCheck, HelpCircle } from "lucide-react";

export default function ServicesPage() {
  const { services, logAction } = useAdmin();

  // Filter States
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Add Service State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    category: "Income Tax",
    description: "",
    pricingModel: "Fixed" as PricingModel,
    price: "",
    paymentRule: "100% Advance" as PaymentRule,
    partnerSharePct: "10",
    slaDays: "5",
  });

  // Extract unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(services.map((s) => s.category)));
  }, [services]);

  // Apply filters
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || s.category === categoryFilter;
      const matchesStatus = !statusFilter || s.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, search, categoryFilter, statusFilter]);

  // Add service submit handler
  const handleAddServiceSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newService.name || !newService.description) {
      alert("Please fill in all required fields.");
      return;
    }

    const serviceId = newService.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    logAction(`Created new draft compliance service: ${newService.name}`, "Service", serviceId);
    alert(`Service "${newService.name}" created successfully as draft! (Simulated local action)`);
    setAddModalOpen(false);
    setNewService({
      name: "",
      category: "Income Tax",
      description: "",
      pricingModel: "Fixed",
      price: "",
      paymentRule: "100% Advance",
      partnerSharePct: "10",
      slaDays: "5",
    });
  };

  const columns = useMemo(() => {
    return [
      {
        key: "name",
        header: "Service",
        render: (row: Service) => (
          <div>
            <Link href={`/admin/services/${row.id}`} className="admin-table-link" style={{ fontWeight: 600 }}>
              {row.name}
            </Link>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }} className="text-truncate">
              {row.description}
            </div>
          </div>
        ),
        sortValue: (row: Service) => row.name,
        csvValue: (row: Service) => row.name,
      },
      {
        key: "category",
        header: "Category",
        render: (row: Service) => <span className="badge badge-grey">{row.category}</span>,
        sortValue: (row: Service) => row.category,
        csvValue: (row: Service) => row.category,
      },
      {
        key: "pricing",
        header: "Pricing Rule",
        render: (row: Service) => (
          <span>
            {row.pricingModel === "Fixed" && row.price ? `$${row.price}` : ""}
            {row.pricingModel === "Starting From" && row.price ? `Starts at $${row.price}` : ""}
            {row.pricingModel === "Quote Based" ? "Quote Required" : ""}
          </span>
        ),
        sortValue: (row: Service) => row.price || 0,
        csvValue: (row: Service) => (row.price ? `${row.pricingModel} ${row.price}` : "Quote Based"),
      },
      {
        key: "paymentRule",
        header: "Payment Rule",
        render: (row: Service) => <span>{row.paymentRule}</span>,
        sortValue: (row: Service) => row.paymentRule,
        csvValue: (row: Service) => row.paymentRule,
      },
      {
        key: "partnerShare",
        header: "Partner Share",
        render: (row: Service) => <span>{row.partnerSharePct}%</span>,
        sortValue: (row: Service) => row.partnerSharePct,
        csvValue: (row: Service) => row.partnerSharePct,
      },
      {
        key: "sla",
        header: "SLA",
        render: (row: Service) => <span>{row.slaDays} days</span>,
        sortValue: (row: Service) => row.slaDays,
        csvValue: (row: Service) => row.slaDays,
      },
      {
        key: "status",
        header: "Status",
        render: (row: Service) => {
          let badge = "badge-grey";
          if (row.status === "Active") badge = "badge-green";
          else if (row.status === "Hidden") badge = "badge-amber";
          else if (row.status === "Draft") badge = "badge-grey";
          return <span className={`badge ${badge}`}>{row.status}</span>;
        },
        sortValue: (row: Service) => row.status,
        csvValue: (row: Service) => row.status,
      },
      {
        key: "updatedDate",
        header: "Updated Date",
        render: (row: Service) => <span>{row.updatedDate}</span>,
        sortValue: (row: Service) => row.updatedDate,
        csvValue: (row: Service) => row.updatedDate,
      },
      {
        key: "actions",
        header: "Actions",
        render: (row: Service) => (
          <Link href={`/admin/services/${row.id}`} className="btn btn-secondary btn-xs">
            Edit
          </Link>
        ),
      },
    ];
  }, []);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Services Master</h1>
          <p className="admin-page-subtitle">Configure available corporate services, billing structures, document requirements, and referral payout variables.</p>
        </div>
        <div className="admin-page-header-actions">
          <button type="button" className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
            <Plus size={16} /> Add Service
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by service name, code, description...">
        <div className="filter-group">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Hidden">Hidden</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </FilterBar>

      {/* Table view */}
      <div className="admin-panel" style={{ marginTop: "1.5rem", padding: "1rem" }}>
        <AdminTable
          columns={columns}
          rows={filteredServices}
          rowKey={(r) => r.id}
          pageSize={10}
          selectable
          exportFilename="services_master_export"
        />
      </div>

      {/* Add Service Modal */}
      <Modal
        open={addModalOpen}
        title="Add New Compliance Service"
        onCancel={() => setAddModalOpen(false)}
        onConfirm={() => handleAddServiceSubmit()}
        confirmLabel="Save Service"
      >
        <form className="portal-form" onSubmit={handleAddServiceSubmit}>
          <div className="form-group">
            <label className="form-label">Service Title *</label>
            <input
              type="text"
              className="form-input"
              required
              value={newService.name}
              onChange={(e) => setNewService((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Corporate Tax Return Filing"
            />
          </div>

          <div className="admin-grid-2">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-input"
                required
                value={newService.category}
                onChange={(e) => setNewService((prev) => ({ ...prev, category: e.target.value }))}
              >
                <option value="Income Tax">Income Tax</option>
                <option value="GST">GST</option>
                <option value="Company Law">Company Law</option>
                <option value="Accounting">Accounting</option>
                <option value="Payroll">Payroll</option>
                <option value="International">International</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Expected SLA (Days) *</label>
              <input
                type="number"
                className="form-input"
                required
                min={1}
                value={newService.slaDays}
                onChange={(e) => setNewService((prev) => ({ ...prev, slaDays: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Service Description *</label>
            <textarea
              className="form-textarea"
              required
              rows={2}
              value={newService.description}
              onChange={(e) => setNewService((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Provide a detailed description of the service deliverables..."
            />
          </div>

          <div className="admin-grid-2">
            <div className="form-group">
              <label className="form-label">Pricing Model *</label>
              <select
                className="form-input"
                required
                value={newService.pricingModel}
                onChange={(e) => setNewService((prev) => ({ ...prev, pricingModel: e.target.value as PricingModel }))}
              >
                <option value="Fixed">Fixed Price</option>
                <option value="Starting From">Starting From</option>
                <option value="Quote Based">Quote / Custom Pricing</option>
              </select>
            </div>
            {newService.pricingModel !== "Quote Based" && (
              <div className="form-group">
                <label className="form-label">Base Price ($) *</label>
                <input
                  type="number"
                  className="form-input"
                  required
                  min={1}
                  value={newService.price}
                  onChange={(e) => setNewService((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g. 150"
                />
              </div>
            )}
          </div>

          <div className="admin-grid-2">
            <div className="form-group">
              <label className="form-label">Payment Milestone rule</label>
              <select
                className="form-input"
                value={newService.paymentRule}
                onChange={(e) => setNewService((prev) => ({ ...prev, paymentRule: e.target.value as PaymentRule }))}
              >
                <option value="100% Advance">Full Advance (100%)</option>
                <option value="Partial Advance">Partial Advance (50/50)</option>
                <option value="Quote Required">Quote Required</option>
                <option value="Manual">Manual Settlement</option>
                <option value="Milestone">Milestone Invoicing</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Referred Partner Commission Share (%)</label>
              <input
                type="number"
                className="form-input"
                min={0}
                max={100}
                value={newService.partnerSharePct}
                onChange={(e) => setNewService((prev) => ({ ...prev, partnerSharePct: e.target.value }))}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
