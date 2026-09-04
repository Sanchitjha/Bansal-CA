"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePartner } from "@/components/partner/PartnerProvider";

export default function PartnerLoginPage() {
  const router = useRouter();
  const { isAuthenticated, isCheckingSession, login } = usePartner();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isCheckingSession && isAuthenticated) {
      router.replace("/partner");
    }
  }, [isCheckingSession, isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password.trim());
      router.push("/partner");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link href="/" className="logo login-logo">
          A&A<span>.</span>
        </Link>
        <h1 className="login-title">Partner Portal Login</h1>
        <p className="login-subtitle">
          Sign in to manage your referrals, track case progress, and view revenue share payouts.
        </p>

        <form className="portal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="partner@example.com"
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
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
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="login-footer-note">
          Interested in partnering with us? <Link href="/partner/signup">Register here</Link> to start earning referral commissions.
        </p>
      </div>
    </div>
  );
}
