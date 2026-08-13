"use client";

import { useState } from "react";
import { usePartner } from "@/components/partner/PartnerProvider";

export default function ReferredClientsPage() {
  const { referredClients, addReferralClient } = usePartner();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    legalName: "",
    clientType: "INDIVIDUAL" as "INDIVIDUAL" | "BUSINESS",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("First Name, Last Name, and Email are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await addReferralClient(formData);
      setModalOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        legalName: "",
        clientType: "INDIVIDUAL",
      });
    } catch (err: any) {
      setError(err.message || "Failed to add referral client. Email may be already taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>My Referred Clients</h1>
          <p>View and manage client businesses referred by you.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          Refer New Client
        </button>
      </div>

      <div className="portal-panel">
        {referredClients.length === 0 ? (
          <div className="empty-state" style={{ padding: "60px" }}>
            <h3>No referred clients found</h3>
            <p>Get started by referring your first client using the button above.</p>
          </div>
        ) : (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Client Code</th>
                <th>Client Name / Legal Entity</th>
                <th>Type</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Referred Date</th>
                <th>Active Services</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {referredClients.map((client) => (
                <tr key={client.id}>
                  <td><code>{client.clientCode}</code></td>
                  <td style={{ fontWeight: 600 }}>{client.name}</td>
                  <td>{client.clientType}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td>{client.createdDate}</td>
                  <td>{client.casesCount} case(s)</td>
                  <td>
                    <span className={`badge ${client.status === "ACTIVE" ? "badge-green" : "badge-grey"}`}>
                      {client.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div className="login-card" style={{ maxWidth: "500px", margin: "20px", width: "100%", position: "relative" }}>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: "absolute", top: "15px", right: "20px",
                border: "none", background: "none", fontSize: "1.5rem",
                cursor: "pointer", color: "var(--color-text-secondary)"
              }}
            >
              &times;
            </button>
            <h2 style={{ fontSize: "1.4rem", marginBottom: "8px" }}>Refer a New Client</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "20px" }}>
              Provide details below. A client profile will be created and associated with your partner commissions.
            </p>

            <form className="portal-form" onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    name="firstName"
                    type="text"
                    className="form-input"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    name="lastName"
                    type="text"
                    className="form-input"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  name="email"
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="client@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  name="phone"
                  type="text"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Legal Company Name</label>
                  <input
                    name="legalName"
                    type="text"
                    className="form-input"
                    value={formData.legalName}
                    onChange={handleInputChange}
                    placeholder="e.g. Acme Corporation"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Client Type</label>
                  <select
                    name="clientType"
                    className="form-select"
                    value={formData.clientType}
                    onChange={handleInputChange}
                  >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="BUSINESS">Business</option>
                  </select>
                </div>
              </div>

              {error && <p className="form-error">{error}</p>}

              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Client Referral"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
