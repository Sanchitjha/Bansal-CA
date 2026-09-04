"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminTable, Tabs } from "@/components/admin/ui";
import { Lock, Save, ShieldAlert, Key, Globe, Mail, Landmark } from "lucide-react";

export default function SettingsPage() {
  const {
    teamUsers,
    roles,
    orgInfo,
    logAction,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState("organization");

  // Local state forms
  const [orgForm, setOrgForm] = useState({
    name: orgInfo.name,
    email: orgInfo.email,
    phone: orgInfo.phone,
    address: orgInfo.address,
    gstin: orgInfo.gstin || "27AAAB1234C1Z0",
    pan: orgInfo.pan || "AAAB1234C",
  });

  const [gatewayForm, setGatewayForm] = useState({
    razorpayKey: "rzp_live_key12345",
    razorpaySecret: "••••••••••••••••••••••••",
    mode: "Sandbox",
  });

  const [smtpForm, setSmtpForm] = useState({
    smtpHost: "smtp.mailgun.org",
    smtpPort: "587",
    smtpUser: "postmaster@aa.com",
    smtpPass: "••••••••••••••••",
    senderName: "A&A Admin Team",
  });

  const [securityForm, setSecurityForm] = useState({
    mfaEnabled: true,
    sessionTimeout: "30",
    passwordAge: "90",
  });

  // Handlers
  const handleSaveSettings = (section: string) => {
    logAction(`Updated platform settings for section "${section}"`, "Settings", "settings");
    alert(`Settings for ${section.toUpperCase()} saved successfully! (Simulated local action)`);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Platform Settings</h1>
          <p className="admin-page-subtitle">Configure organization metadata, manage staff permissions, payment credentials, and security parameters.</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: "organization", label: "Organization Info" },
          { id: "users", label: "Staff Users" },
          { id: "roles", label: "Roles & Permissions" },
          { id: "payment", label: "Payment Gateways" },
          { id: "notification", label: "SMTP & Alerts" },
          { id: "security", label: "Portal Security" },
          { id: "system", label: "System Parameters" },
        ]}
      />

      {/* Tab Panel */}
      <div className="admin-panel" style={{ marginTop: "1.5rem", padding: "2rem", minHeight: "450px" }}>
        {activeTab === "organization" && (
          <div style={{ maxWidth: "600px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1.5rem" }}>
              <Landmark size={18} /> Organization Information
            </h3>
            <div className="portal-form">
              <div className="form-group">
                <label className="form-label">Company / Legal Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="admin-grid-2">
                <div className="form-group">
                  <label className="form-label">Support Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={orgForm.email}
                    onChange={(e) => setOrgForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Support Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={orgForm.phone}
                    onChange={(e) => setOrgForm((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="admin-grid-2">
                <div className="form-group">
                  <label className="form-label">Tax GSTIN Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={orgForm.gstin}
                    onChange={(e) => setOrgForm((prev) => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Firm PAN Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={orgForm.pan}
                    onChange={(e) => setOrgForm((prev) => ({ ...prev, pan: e.target.value.toUpperCase() }))}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Registered Office Address</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={orgForm.address}
                  onChange={(e) => setOrgForm((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <button type="button" className="btn btn-primary" onClick={() => handleSaveSettings("organization")}>
                <Save size={14} style={{ marginRight: "4px" }} /> Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Portal Staff Directory</h3>
              <button type="button" className="btn btn-secondary btn-xs" onClick={() => alert("Invite staff flow simulated!")}>
                Invite Staff Member
              </button>
            </div>
            <AdminTable
              columns={[
                {
                  key: "name",
                  header: "Staff Name",
                  render: (row) => <span style={{ fontWeight: 600 }}>{row.name}</span>,
                },
                {
                  key: "email",
                  header: "Access Email",
                  render: (row) => <span>{row.email}</span>,
                },
                {
                  key: "role",
                  header: "Assigned Role",
                  render: (row) => <span className="badge badge-grey">{row.role}</span>,
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => (
                    <span className={`badge ${row.status === "Active" ? "badge-green" : "badge-red"}`}>
                      {row.status}
                    </span>
                  ),
                },
                {
                  key: "lastLogin",
                  header: "Last Login Date",
                  render: (row) => <span>{new Date(row.lastLogin).toLocaleString()}</span>,
                },
              ]}
              rows={teamUsers}
              rowKey={(r) => r.id}
              pageSize={10}
            />
          </div>
        )}

        {activeTab === "roles" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Roles &amp; Module Permissions</h3>
              <button type="button" className="btn btn-secondary btn-xs" onClick={() => alert("Create role flow simulated!")}>
                Add Custom Role
              </button>
            </div>
            <AdminTable
              columns={[
                {
                  key: "name",
                  header: "Role Title",
                  render: (row) => <strong style={{ color: "var(--color-navy)" }}>{row.name}</strong>,
                },
                {
                  key: "description",
                  header: "Description",
                  render: (row) => <span style={{ fontSize: "0.8125rem" }}>{row.description}</span>,
                },
                {
                  key: "modules",
                  header: "Authorized Modules",
                  render: (row) => (
                    <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                      {row.modules.map((m) => (
                        <span key={m} className="badge badge-grey" style={{ fontSize: "0.75rem" }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  ),
                },
                {
                  key: "userCount",
                  header: "Active Users",
                  render: (row) => <span>{row.userCount} users</span>,
                },
              ]}
              rows={roles}
              rowKey={(r) => r.id}
              pageSize={10}
            />
          </div>
        )}

        {activeTab === "payment" && (
          <div style={{ maxWidth: "500px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1.5rem" }}>
              <Key size={18} /> Gateway Provider Setup
            </h3>
            <div className="portal-form">
              <div className="form-group">
                <label className="form-label">Gateway Environment Mode</label>
                <select
                  className="form-input"
                  value={gatewayForm.mode}
                  onChange={(e) => setGatewayForm((prev) => ({ ...prev, mode: e.target.value }))}
                >
                  <option value="Sandbox">Sandbox / Test Mode</option>
                  <option value="Live">Live / Production Mode</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Razorpay Live Key ID</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  value={gatewayForm.razorpayKey}
                  onChange={(e) => setGatewayForm((prev) => ({ ...prev, razorpayKey: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Razorpay Live Secret Hash</label>
                <input
                  type="password"
                  className="form-input font-mono"
                  value={gatewayForm.razorpaySecret}
                  onChange={(e) => setGatewayForm((prev) => ({ ...prev, razorpaySecret: e.target.value }))}
                />
              </div>
              <button type="button" className="btn btn-primary" onClick={() => handleSaveSettings("payment")}>
                <Save size={14} style={{ marginRight: "4px" }} /> Save Credentials
              </button>
            </div>
          </div>
        )}

        {activeTab === "notification" && (
          <div style={{ maxWidth: "500px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1.5rem" }}>
              <Mail size={18} /> SMTP Server Settings
            </h3>
            <div className="portal-form">
              <div className="admin-grid-3-1" style={{ gap: "0.75rem", gridTemplateColumns: "3fr 1fr" }}>
                <div className="form-group">
                  <label className="form-label">Outgoing SMTP Host</label>
                  <input
                    type="text"
                    className="form-input"
                    value={smtpForm.smtpHost}
                    onChange={(e) => setSmtpForm((prev) => ({ ...prev, smtpHost: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Port</label>
                  <input
                    type="text"
                    className="form-input"
                    value={smtpForm.smtpPort}
                    onChange={(e) => setSmtpForm((prev) => ({ ...prev, smtpPort: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">SMTP Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={smtpForm.smtpUser}
                  onChange={(e) => setSmtpForm((prev) => ({ ...prev, smtpUser: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">SMTP Secret Password</label>
                <input
                  type="password"
                  className="form-input font-mono"
                  value={smtpForm.smtpPass}
                  onChange={(e) => setSmtpForm((prev) => ({ ...prev, smtpPass: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">System Sender Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={smtpForm.senderName}
                  onChange={(e) => setSmtpForm((prev) => ({ ...prev, senderName: e.target.value }))}
                />
              </div>
              <button type="button" className="btn btn-primary" onClick={() => handleSaveSettings("notification")}>
                <Save size={14} style={{ marginRight: "4px" }} /> Save Server Setup
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div style={{ maxWidth: "500px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1.5rem" }}>
              <Lock size={18} /> Platform Security Policies
            </h3>
            <div className="portal-form">
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "1.5rem" }}>
                <input
                  type="checkbox"
                  id="chk-mfa"
                  checked={securityForm.mfaEnabled}
                  onChange={(e) => setSecurityForm((prev) => ({ ...prev, mfaEnabled: e.target.checked }))}
                />
                <label htmlFor="chk-mfa" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                  Enforce Multi-Factor Authentication (MFA) for all Staff users
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Active Session Idle Timeout (Minutes)</label>
                <select
                  className="form-input"
                  value={securityForm.sessionTimeout}
                  onChange={(e) => setSecurityForm((prev) => ({ ...prev, sessionTimeout: e.target.value }))}
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes (Recommended)</option>
                  <option value="60">60 Minutes</option>
                  <option value="120">2 Hours</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Enforce Staff Password Rotation cycle</label>
                <select
                  className="form-input"
                  value={securityForm.passwordAge}
                  onChange={(e) => setSecurityForm((prev) => ({ ...prev, passwordAge: e.target.value }))}
                >
                  <option value="30">Every 30 Days</option>
                  <option value="90">Every 90 Days</option>
                  <option value="180">Every 180 Days</option>
                  <option value="never">Never expire passwords</option>
                </select>
              </div>

              <button type="button" className="btn btn-primary" onClick={() => handleSaveSettings("security")}>
                <Save size={14} style={{ marginRight: "4px" }} /> Update Policies
              </button>
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div style={{ maxWidth: "500px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1.5rem" }}>
              <Globe size={18} /> System Parameters
            </h3>
            <div className="portal-form">
              <div className="form-group">
                <label className="form-label">System Timezone</label>
                <select className="form-select" defaultValue="Asia/Kolkata">
                  <option value="Asia/Kolkata">Asia/Kolkata (IST - GMT+5:30)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Default Table Row Pages size</label>
                <select className="form-select" defaultValue="10">
                  <option value="10">10 Rows per page</option>
                  <option value="25">25 Rows per page</option>
                  <option value="50">50 Rows per page</option>
                </select>
              </div>
              <button type="button" className="btn btn-primary" onClick={() => handleSaveSettings("system")}>
                <Save size={14} style={{ marginRight: "4px" }} /> Save System Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
