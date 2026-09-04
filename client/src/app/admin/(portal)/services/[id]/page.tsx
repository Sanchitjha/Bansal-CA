"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Tabs, Modal } from "@/components/admin/ui";
import { ServiceStatus, PricingModel, PaymentRule } from "@/data/admin";
import {
  FileText,
  DollarSign,
  FileCheck,
  Clock,
  Briefcase,
  Layers,
  ArrowLeft,
  Users,
  Settings,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.id;

  const { services, partners, logAction } = useAdmin();

  // Find target service
  const service = useMemo(() => {
    return services.find((s) => s.id === serviceId);
  }, [services, serviceId]);

  const [activeTab, setActiveTab] = useState("general");

  // Local Form state
  const [formData, setFormData] = useState(() => {
    if (!service) return null;
    return {
      name: service.name,
      category: service.category,
      description: service.description,
      pricingModel: service.pricingModel,
      price: service.price || 0,
      paymentRule: service.paymentRule,
      slaDays: service.slaDays,
      partnerSharePct: service.partnerSharePct,
      tdsPct: service.tdsPct,
      publicVisibility: service.publicVisibility,
      status: service.status,
    };
  });

  // Local lists for document config / workflows
  const [requiredDocs, setRequiredDocs] = useState<string[]>(() => {
    return service?.requiredDocuments || [];
  });

  const [workflowStages, setWorkflowStages] = useState<string[]>(() => {
    return service?.workflow || [];
  });

  // Partner access selection
  const [permittedPartners, setPermittedPartners] = useState<string[]>(() => {
    // Simulated default allowed: Zenith Advisors, Northgate, Bluepeak
    return ["PTR-101", "PTR-102", "PTR-103"];
  });

  // Form input helper
  const [newDocText, setNewDocText] = useState("");
  const [newStageText, setNewStageText] = useState("");

  if (!service || !formData) {
    return (
      <div className="admin-page-container">
        <Link href="/admin/services" className="admin-back-btn">
          <ArrowLeft size={16} /> Back to Services
        </Link>
        <div className="admin-panel" style={{ marginTop: "2rem", padding: "3rem", textAlign: "center" }}>
          <h2>Service Profile Not Found</h2>
          <p className="empty-state">No service record with ID &quot;{serviceId}&quot; found.</p>
        </div>
      </div>
    );
  }

  // Handle Saves
  const handleSaveConfig = () => {
    logAction(`Updated configuration parameters for service "${formData.name}"`, "Service", service.id);
    alert("Configuration parameters saved successfully! (Simulated local action)");
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocText.trim()) return;
    setRequiredDocs((prev) => [...prev, newDocText.trim()]);
    logAction(`Added document requirement "${newDocText}" to service "${formData.name}"`, "Service", service.id);
    setNewDocText("");
  };

  const handleRemoveDocument = (doc: string) => {
    setRequiredDocs((prev) => prev.filter((d) => d !== doc));
    logAction(`Removed document requirement "${doc}" from service "${formData.name}"`, "Service", service.id);
  };

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageText.trim()) return;
    setWorkflowStages((prev) => [...prev, newStageText.trim()]);
    logAction(`Added workflow stage "${newStageText}" to service "${formData.name}"`, "Service", service.id);
    setNewStageText("");
  };

  const handleRemoveStage = (stage: string) => {
    setWorkflowStages((prev) => prev.filter((s) => s !== stage));
    logAction(`Removed workflow stage "${stage}" from service "${formData.name}"`, "Service", service.id);
  };

  const togglePartnerAccess = (pId: string) => {
    setPermittedPartners((prev) => {
      const next = prev.includes(pId) ? prev.filter((id) => id !== pId) : [...prev, pId];
      logAction(`Updated partner referral access list for service "${formData.name}"`, "Service", service.id);
      return next;
    });
  };

  return (
    <div className="admin-page-container">
      {/* Back link */}
      <div style={{ marginBottom: "1rem" }}>
        <Link href="/admin/services" className="admin-back-btn" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-secondary)", fontSize: "0.8125rem", textDecoration: "none" }}>
          <ArrowLeft size={14} /> Back to Services
        </Link>
      </div>

      <div className="admin-page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1 className="admin-page-title">{formData.name}</h1>
            <span className={`badge ${
              formData.status === "Active" ? "badge-green" :
              formData.status === "Hidden" ? "badge-amber" : "badge-grey"
            }`}>
              {formData.status}
            </span>
          </div>
          <p className="admin-page-subtitle">Category: {formData.category} • Expected SLA: {formData.slaDays} days</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleSaveConfig}>
          Save Configuration
        </button>
      </div>

      {/* Tabs */}
      <Tabs
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: "general", label: "General" },
          { id: "pricing", label: "Pricing & Billing" },
          { id: "payments", label: "Payment Rules" },
          { id: "documents", label: "Required Documents" },
          { id: "sla", label: "SLA Matrix" },
          { id: "workflow", label: "Workflow Stages" },
          { id: "partner", label: "Partner Referrals" },
          { id: "revenue", label: "Revenue Sharing" },
        ]}
      />

      <div className="admin-panel" style={{ marginTop: "1.5rem", padding: "2rem", minHeight: "400px" }}>
        {activeTab === "general" && (
          <div style={{ maxWidth: "600px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem" }}>General Information</h3>
            <div className="portal-form">
              <div className="form-group">
                <label className="form-label">Service Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => prev ? { ...prev, category: e.target.value } : null)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Service Deliverables Description</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => prev ? { ...prev, description: e.target.value } : null)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Service Status</label>
                <select
                  className="form-input"
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => prev ? { ...prev, status: e.target.value as ServiceStatus } : null)}
                >
                  <option value="Active">Active / Publicly Visible</option>
                  <option value="Hidden">Hidden / Internal Only</option>
                  <option value="Draft">Draft / Construction</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "1rem" }}>
                <input
                  type="checkbox"
                  id="visibility"
                  checked={formData.publicVisibility}
                  onChange={(e) => setFormData((prev) => prev ? { ...prev, publicVisibility: e.target.checked } : null)}
                />
                <label htmlFor="visibility" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                  Show on public client marketing website
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pricing" && (
          <div style={{ maxWidth: "500px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Pricing Setup</h3>
            <div className="portal-form">
              <div className="form-group">
                <label className="form-label">Pricing Model</label>
                <select
                  className="form-input"
                  value={formData.pricingModel}
                  onChange={(e) => setFormData((prev) => prev ? { ...prev, pricingModel: e.target.value as PricingModel } : null)}
                >
                  <option value="Fixed">Fixed Price</option>
                  <option value="Starting From">Starting From (Variable)</option>
                  <option value="Quote Based">Quote Required (Consultation First)</option>
                </select>
              </div>
              {formData.pricingModel !== "Quote Based" && (
                <div className="form-group">
                  <label className="form-label">Base Rate Amount ($)</label>
                  <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                    <DollarSign size={16} style={{ position: "absolute", left: "0.75rem", color: "var(--color-text-secondary)" }} />
                    <input
                      type="number"
                      className="form-input"
                      style={{ paddingLeft: "1.75rem" }}
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null)}
                    />
                  </div>
                </div>
              )}
              <div className="alert alert-secondary" style={{ display: "flex", gap: "0.5rem", fontSize: "0.8125rem", margin: "1.5rem 0 0 0" }}>
                <Clock size={16} style={{ flexShrink: 0, marginTop: "0.1rem", color: "var(--color-text-secondary)" }} />
                <span>Modifying pricing setup only changes future quotes and invoices; active client cases and ledger rules retain prior rates.</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div style={{ maxWidth: "500px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Milestone Invoicing Rules</h3>
            <div className="portal-form">
              <div className="form-group">
                <label className="form-label">Default Payment Rule</label>
                <select
                  className="form-input"
                  value={formData.paymentRule}
                  onChange={(e) => setFormData((prev) => prev ? { ...prev, paymentRule: e.target.value as PaymentRule } : null)}
                >
                  <option value="100% Advance">Full Advance (100% upfront payment before case processing)</option>
                  <option value="Partial Advance">Partial Advance (50% upfront payment, 50% on completion)</option>
                  <option value="Quote Required">Quote Required (Invoicing based on consultation agreement)</option>
                  <option value="Manual">Manual Settlement (Custom invoice cycles)</option>
                  <option value="Milestone">Milestone Invoicing (Linked to custom tasks)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div style={{ maxWidth: "600px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Required Documents Checklist</h3>
            <p className="admin-page-subtitle" style={{ marginBottom: "1.5rem" }}>Configure the KYC and identity files required from the customer to process this service.</p>

            <form onSubmit={handleAddDocument} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <input
                type="text"
                className="form-input"
                required
                value={newDocText}
                onChange={(e) => setNewDocText(e.target.value)}
                placeholder="e.g. Scanned Income Certificate"
              />
              <button type="submit" className="btn btn-secondary">
                Add Requirement
              </button>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {requiredDocs.map((doc) => (
                <div key={doc} className="admin-action-item" style={{ padding: "0.75rem 1rem" }}>
                  <span>{doc}</span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    style={{ backgroundColor: "rgba(192, 57, 43, 0.1)", color: "var(--color-error)" }}
                    onClick={() => handleRemoveDocument(doc)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {requiredDocs.length === 0 && (
                <p className="empty-state">No document requirements configured for this service yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "sla" && (
          <div style={{ maxWidth: "450px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Service SLA Matrix</h3>
            <div className="portal-form">
              <div className="form-group">
                <label className="form-label">Turnaround Turn SLA (Days)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.slaDays}
                  onChange={(e) => setFormData((prev) => prev ? { ...prev, slaDays: parseInt(e.target.value) || 0 } : null)}
                />
              </div>
              <p className="admin-page-subtitle" style={{ marginTop: "1rem" }}>
                Active SLA alerts trigger on the Case Board if this turnaround target is breached.
              </p>
            </div>
          </div>
        )}

        {activeTab === "workflow" && (
          <div style={{ maxWidth: "600px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Workflow Stages / Checklist Tasks</h3>
            <p className="admin-page-subtitle" style={{ marginBottom: "1.5rem" }}>Manage the operational process stages a client case progresses through.</p>

            <form onSubmit={handleAddStage} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <input
                type="text"
                className="form-input"
                required
                value={newStageText}
                onChange={(e) => setNewStageText(e.target.value)}
                placeholder="e.g. Document Verification by Tax agent"
              />
              <button type="submit" className="btn btn-secondary">
                Add Stage
              </button>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {workflowStages.map((stage, idx) => (
                <div key={stage} className="admin-action-item" style={{ padding: "0.75rem 1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className="badge badge-grey" style={{ minWidth: "24px", textAlign: "center" }}>{idx + 1}</span>
                    <span>{stage}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    style={{ backgroundColor: "rgba(192, 57, 43, 0.1)", color: "var(--color-error)" }}
                    onClick={() => handleRemoveStage(stage)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {workflowStages.length === 0 && (
                <p className="empty-state">No custom stages. Uses default timeline: Lead → Processing → Review → Completed.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "partner" && (
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Channel Partner Access Rules</h3>
            <p className="admin-page-subtitle" style={{ marginBottom: "1.5rem" }}>Select which channel partners are permitted to refer clients for this service.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {partners
                .filter((p) => p.status === "Active")
                .map((p) => {
                  const allowed = permittedPartners.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      className="admin-action-item"
                      style={{
                        padding: "0.75rem 1rem",
                        backgroundColor: allowed ? "rgba(46, 204, 113, 0.04)" : undefined,
                        borderColor: allowed ? "var(--color-success)" : undefined,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                          Referred: {p.clientsCount} clients
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <input
                          type="checkbox"
                          checked={allowed}
                          id={`chk-${p.id}`}
                          onChange={() => togglePartnerAccess(p.id)}
                        />
                        <label htmlFor={`chk-${p.id}`} style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                          {allowed ? "Access Granted" : "Revoked"}
                        </label>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {activeTab === "revenue" && (
          <div style={{ maxWidth: "500px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Revenue Sharing Configuration</h3>
            <div className="portal-form">
              <div className="form-group">
                <label className="form-label">Default Partner Payout Share (%)</label>
                <input
                  type="number"
                  className="form-input"
                  min={0}
                  max={100}
                  value={formData.partnerSharePct}
                  onChange={(e) => setFormData((prev) => prev ? { ...prev, partnerSharePct: parseFloat(e.target.value) || 0 } : null)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Default TDS Deduction Rate (%)</label>
                <input
                  type="number"
                  className="form-input"
                  min={0}
                  max={100}
                  value={formData.tdsPct}
                  onChange={(e) => setFormData((prev) => prev ? { ...prev, tdsPct: parseFloat(e.target.value) || 0 } : null)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Effective Date</label>
                <input type="date" className="form-input" defaultValue="2026-08-12" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
