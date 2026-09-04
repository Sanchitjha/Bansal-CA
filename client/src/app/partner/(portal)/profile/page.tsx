"use client";

import { useState } from "react";
import { usePartner } from "@/components/partner/PartnerProvider";

export default function PartnerProfilePage() {
  const { profile, updateBankAccount } = usePartner();
  
  const [bankData, setBankData] = useState({
    bankName: profile?.bankName || "",
    branchName: profile?.branchName || "",
    accountHolderName: profile?.bankAccountName || "",
    accountNumber: profile?.bankAccountNumber || "",
    ifsc: profile?.bankIfsc || "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);

    try {
      await updateBankAccount(bankData);
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
      {/* Profile Details Panel */}
      <div className="portal-panel" style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "16px" }}>Business Profile Details</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "4px" }}>
              Partner Code
            </label>
            <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>{profile?.partnerCode}</span>
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "4px" }}>
              Legal Business Name
            </label>
            <span style={{ fontSize: "1rem" }}>{profile?.name}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "4px" }}>
                Partner Type
              </label>
              <span style={{ fontSize: "1rem" }}>{profile?.partnerType}</span>
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "4px" }}>
                Status
              </label>
              <span className={`badge ${profile?.status === "ACTIVE" ? "badge-green" : "badge-blue"}`} style={{ display: "inline-block" }}>
                {profile?.status}
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "4px" }}>
                Contact Email
              </label>
              <span style={{ fontSize: "1rem" }}>{profile?.email}</span>
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "4px" }}>
                Phone Number
              </label>
              <span style={{ fontSize: "1rem" }}>{profile?.phone || "-"}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "4px" }}>
                PAN Card
              </label>
              <span style={{ fontSize: "1rem" }}>{profile?.pan}</span>
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "4px" }}>
                GSTIN (Optional)
              </label>
              <span style={{ fontSize: "1rem" }}>{profile?.gstin || "Not provided"}</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "4px" }}>
              Member Since
            </label>
            <span style={{ fontSize: "1rem" }}>{profile?.memberSince}</span>
          </div>
        </div>
      </div>

      {/* Bank Details Config Panel */}
      <div className="portal-panel" style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>Bank Payout Settings</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "20px" }}>
          Configure bank account details below to route commission payouts.
        </p>

        <form className="portal-form" onSubmit={handleBankSubmit}>
          <div className="form-group">
            <label className="form-label">Bank Name</label>
            <input
              name="bankName"
              type="text"
              className="form-input"
              value={bankData.bankName}
              onChange={handleBankChange}
              placeholder="e.g. HDFC Bank"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Branch Name</label>
            <input
              name="branchName"
              type="text"
              className="form-input"
              value={bankData.branchName}
              onChange={handleBankChange}
              placeholder="e.g. Connaught Place, Delhi"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Holder Name</label>
            <input
              name="accountHolderName"
              type="text"
              className="form-input"
              value={bankData.accountHolderName}
              onChange={handleBankChange}
              placeholder="e.g. Zenith Advisors LLP"
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input
                name="accountNumber"
                type="text"
                className="form-input"
                value={bankData.accountNumber}
                onChange={handleBankChange}
                placeholder="e.g. 501002930219"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">IFSC Code</label>
              <input
                name="ifsc"
                type="text"
                className="form-input"
                value={bankData.ifsc}
                onChange={handleBankChange}
                placeholder="e.g. HDFC0000123"
                required
              />
            </div>
          </div>

          {success && (
            <p style={{ color: "green", fontSize: "0.9rem", margin: "10px 0" }}>
              ✓ Bank settings saved successfully.
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "16px" }}
            disabled={loading}
          >
            {loading ? "Saving Settings..." : "Save Bank Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}
