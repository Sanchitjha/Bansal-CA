"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelfClient } from "@/components/self-client/SelfClientProvider";

export default function SelfClientSignupPage() {
  const router = useRouter();
  const { isAuthenticated, isCheckingSession, signup } = useSelfClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [clientType, setClientType] = useState<"INDIVIDUAL" | "BUSINESS">("INDIVIDUAL");
  const [legalName, setLegalName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isCheckingSession && isAuthenticated) {
      router.replace("/self-client");
    }
  }, [isCheckingSession, isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signup({
        email: email.trim(),
        password: password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
        legalName: legalName.trim() || `${firstName.trim()} ${lastName.trim()}`,
        clientType,
      });
      router.push("/self-client");
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: "500px" }}>
        <Link href="/" className="logo login-logo">
          A&A<span>.</span>
        </Link>
        <h1 className="login-title">Create Client Account</h1>
        <p className="login-subtitle">
          Register to access your self-service dashboard, view quotes, and track updates.
        </p>

        <form className="portal-form" onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                type="text"
                className="form-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                disabled={loading}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="lastName">Last Name *</label>
              <input
                id="lastName"
                type="text"
                className="form-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@example.com"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              disabled={loading}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="clientType">Client Type *</label>
              <select
                id="clientType"
                className="form-select"
                value={clientType}
                onChange={(e) => setClientType(e.target.value as "INDIVIDUAL" | "BUSINESS")}
                disabled={loading}
                required
              >
                <option value="INDIVIDUAL">Individual</option>
                <option value="BUSINESS">Business Entity</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="legalName">
              {clientType === "BUSINESS" ? "Company / Legal Name *" : "Legal Name (for filings)"}
            </label>
            <input
              id="legalName"
              type="text"
              className="form-input"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              placeholder={clientType === "BUSINESS" ? "Acme Corp Ltd" : "John Doe (leave blank to use First + Last Name)"}
              disabled={loading}
              required={clientType === "BUSINESS"}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password *</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="login-footer-note">
          Already have an account? <Link href="/self-client/login">Sign in here</Link>.
        </p>
      </div>
    </div>
  );
}
