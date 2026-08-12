"use client";

import Link from "next/link";
import { useSelfClient } from "@/components/self-client/SelfClientProvider";
import StatusBadge from "@/components/self-client/StatusBadge";

const UPLOADABLE_STATUSES = ["Requested", "Re-upload Required"];

export default function DocumentsPage() {
  const { documents, cases, markDocumentUploaded } = useSelfClient();

  const caseNameFor = (caseId: string) => cases.find((c) => c.id === caseId)?.serviceName || caseId;

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>Documents</h1>
          <p>Upload requested documents and track review status across all your cases.</p>
        </div>
      </div>

      <div className="portal-panel">
        <table className="portal-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Case</th>
              <th>Status</th>
              <th>Requested</th>
              <th>Uploaded</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>
                  <Link href={`/self-client/cases/${doc.caseId}`}>{caseNameFor(doc.caseId)}</Link>
                </td>
                <td><StatusBadge status={doc.status} /></td>
                <td>{doc.requestedDate}</td>
                <td>{doc.uploadedDate || "—"}</td>
                <td>
                  {UPLOADABLE_STATUSES.includes(doc.status) && (
                    <button
                      type="button"
                      className="btn btn-secondary doc-upload-btn"
                      onClick={() => markDocumentUploaded(doc.id)}
                    >
                      Upload
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
