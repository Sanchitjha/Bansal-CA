"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePartner } from "@/components/partner/PartnerProvider";

export default function PartnerSignupPage() {
  const router = useRouter();
  const { isAuthenticated, isCheckingSession, signup } = usePartner();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    legalName: "",
    displayName: "",
    partnerType: "INDIVIDUAL",
    pan: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isCheckingSession && isAuthenticated) {
      router.replace("/partner");
    }
  }, [isCheckingSession, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.pan
    ) {
      setError("Please fill in all required fields (Email, Password, First & Last Name, and PAN).");
      return;
    }

    setLoading(true);

    try {
      await signup(formData);
      router.push("/partner");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ padding: "40px 20px" }}>
      <div className="login-card" style={{ maxWidth: "600px" }}>
        <Link href="/" className="logo login-logo">
          A&A<span>.</span>
        </Link>
        <h1 className="login-title">Partner Registration</h1>
        <p className="login-subtitle" style={{ marginBottom: "24px" }}>
          Join our channel partner program to refer clients and earn a share of active service revenues.
        </p>

        <form className="portal-form" onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className="form-input"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                disabled={loading}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="lastName">Last Name *</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="form-input"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                disabled={loading}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="text"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Create Password *</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          <div className="portal-divider" style={{ margin: "24px 0 16px", borderBottom: "1px solid var(--color-border)", opacity: 0.3 }}></div>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "16px", color: "var(--color-text-primary)" }}>Business & Payout Details</h2>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="legalName">Legal Business / Entity Name</label>
              <input
                id="legalName"
                name="legalName"
                type="text"
                className="form-input"
                value={formData.legalName}
                onChange={handleChange}
                placeholder="John Doe Consulting LLP"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="partnerType">Partner Type</label>
              <select
                id="partnerType"
                name="partnerType"
                className="form-select"
                value={formData.partnerType}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="INDIVIDUAL">Individual</option>
                <option value="AGENCY">Agency</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="displayName">Display Name / Brand</label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                className="form-input"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="John Doe Services"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pan">PAN Card Number *</label>
              <input
                id="pan"
                name="pan"
                type="text"
                className="form-input"
                value={formData.pan}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="addressLine1">Address Line 1</label>
            <input
              id="addressLine1"
              name="addressLine1"
              type="text"
              className="form-input"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="123 Corporate Tower, Sector 62"
              disabled={loading}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                className="form-input"
                value={formData.city}
                onChange={handleChange}
                placeholder="Noida"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="state">State</label>
              <input
                id="state"
                name="state"
                type="text"
                className="form-input"
                value={formData.state}
                onChange={handleChange}
                placeholder="Uttar Pradesh"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="postalCode">Postal Code</label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                className="form-input"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="201301"
                disabled={loading}
              />
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={loading}
            style={{ marginTop: "16px" }}
          >
            {loading ? "Registering Account..." : "Register as Partner"}
          </button>
        </form>

        <p className="login-footer-note" style={{ marginTop: "24px" }}>
          Already have a partner account? <Link href="/partner/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
