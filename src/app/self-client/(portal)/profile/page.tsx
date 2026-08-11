"use client";

import { useState } from "react";
import { useSelfClient } from "@/components/self-client/SelfClientProvider";

export default function ProfilePage() {
  const { profile } = useSelfClient();
  const [mfaEnabled, setMfaEnabled] = useState(false);

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>My Profile</h1>
          <p>Your account details and security settings.</p>
        </div>
      </div>

      <div className="portal-two-col">
        <div className="portal-panel">
          <div className="portal-panel-header">
            <h2>Account Details</h2>
          </div>
          <dl className="portal-detail-list">
            <div>
              <dt>Name</dt>
              <dd>{profile.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{profile.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{profile.phone}</dd>
            </div>
            <div>
              <dt>Client Type</dt>
              <dd><span className="portal-badge-selfclient">{profile.clientType}</span></dd>
            </div>
            <div>
              <dt>Member Since</dt>
              <dd>{profile.memberSince}</dd>
            </div>
          </dl>
        </div>

        <div className="portal-panel">
          <div className="portal-panel-header">
            <h2>Security</h2>
          </div>
          <form className="portal-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label" htmlFor="new-password">Change Password</label>
              <input id="new-password" type="password" className="form-input" placeholder="New password" />
            </div>
            <button type="submit" className="btn btn-secondary">Update Password</button>
          </form>

          <div className="portal-mfa-row">
            <div>
              <p className="task-item-title">Two-Factor Authentication</p>
              <p className="task-item-desc">Add an extra layer of security to your account.</p>
            </div>
            <button
              type="button"
              className={`btn ${mfaEnabled ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setMfaEnabled((v) => !v)}
            >
              {mfaEnabled ? "Enabled" : "Enable"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
