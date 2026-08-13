"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAuthenticated, isCheckingSession, login } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isCheckingSession && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isCheckingSession, isAuthenticated, router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    login(email.trim());
    router.push("/admin");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link href="/" className="logo login-logo">
          A&A<span>.</span>
        </Link>
        <h1 className="login-title">Admin Panel Login</h1>
        <p className="login-subtitle">
          Sign in to manage cases, clients, partners, payments and content across A&amp;A.
        </p>

        <p className="login-demo-note">
          Demo mode: this admin panel runs on mock data with no backend yet. Any email and password will sign you in.
        </p>

        <form className="portal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="amit.bansal@aa.com"
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-primary login-submit-btn">
            Login
          </button>
        </form>

        <p className="login-footer-note">
          Looking for the client portal instead? <Link href="/self-client/login">Sign in here</Link>.
        </p>
      </div>
    </div>
  );
}
