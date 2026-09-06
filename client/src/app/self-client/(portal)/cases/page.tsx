"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelfClient } from "@/components/self-client/SelfClientProvider";
import StatusBadge from "@/components/self-client/StatusBadge";
import { CertificateGenerator, CertificateData } from "@/components/documents/CertificateGenerator";
import { FileCheck, Download } from "lucide-react";

export default function SelfClientCasesPage() {
  const { cases, profile } = useSelfClient();
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  const handleOpenCertificate = (c: any) => {
    setSelectedCert({
      caseId: c.id,
      clientName: profile.name || "Rohan Mehta",
      serviceName: c.serviceName,
      completionDate: c.dueDate || "2026-08-30",
      panOrGstin: "AAACZ1234M",
      acknowledgmentNumber: `ACK-ITR-${c.id.replace("AA-CASE-", "")}-2026`,
      assignedCA: c.assignedTeamMember || "Priya Sharma, FCA",
      verificationHash: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
    });
  };

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>My Services / Cases</h1>
          <p>Every service you&apos;ve requested, with its current status, payment state, and completion certificates.</p>
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
              <th>Assigned To</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link href={`/self-client/cases/${c.id}`} className="font-semibold text-blue-600">
                    {c.id}
                  </Link>
                </td>
                <td>{c.serviceName}</td>
                <td><StatusBadge status={c.status} /></td>
                <td><StatusBadge status={c.paymentStatus} /></td>
                <td>{c.createdDate}</td>
                <td>{c.assignedTeamMember || "Unassigned"}</td>
                <td>
                  {c.status === "Closed" || c.status === "Completed" ? (
                    <button
                      onClick={() => handleOpenCertificate(c)}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold"
                    >
                      <FileCheck className="w-3.5 h-3.5" /> Certificate
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">In Progress</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCert && (
        <CertificateGenerator
          data={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
}
