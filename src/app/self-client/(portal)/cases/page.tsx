"use client";

import Link from "next/link";
import { useSelfClient } from "@/components/self-client/SelfClientProvider";
import StatusBadge from "@/components/self-client/StatusBadge";

export default function SelfClientCasesPage() {
  const { cases } = useSelfClient();

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>My Services / Cases</h1>
          <p>Every service you&apos;ve requested, with its current status and payment state.</p>
        </div>
        <Link href="/self-client/new-request" className="btn btn-primary">
          New Service Request
        </Link>
      </div>

      <div className="portal-panel">
        <table className="portal-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Service</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Created</th>
              <th>Due</th>
              <th>Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link href={`/self-client/cases/${c.id}`}>{c.id}</Link>
                </td>
                <td>{c.serviceName}</td>
                <td><StatusBadge status={c.status} /></td>
                <td><StatusBadge status={c.paymentStatus} /></td>
                <td>{c.createdDate}</td>
                <td>{c.dueDate || "—"}</td>
                <td>{c.assignedTeamMember || "Unassigned"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
