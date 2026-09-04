"use client";

import { usePartner } from "@/components/partner/PartnerProvider";

export default function PartnerDocumentsPage() {
  const { kycDocuments, uploadKycDocument } = usePartner();

  const handleUploadClick = (docId: string) => {
    // Show a simulated alert and trigger status transition
    alert(`File selection dialog opened. Uploading document ${docId}...`);
    uploadKycDocument(docId);
  };

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>KYC Documents & Verification</h1>
          <p>Provide tax credentials and agreements to complete onboarding and enable payments.</p>
        </div>
      </div>

      <div className="portal-panel">
        <div className="portal-panel-header">
          <h2>Required Onboarding Documents</h2>
        </div>
        <table className="portal-table">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Status</th>
              <th>Uploaded Date</th>
              <th>Notes / Action</th>
            </tr>
          </thead>
          <tbody>
            {kycDocuments.map((doc) => {
              let statusBadgeClass = "badge-grey";
              if (doc.status === "Accepted") statusBadgeClass = "badge-green";
              else if (doc.status === "Under Review" || doc.status === "Uploaded") statusBadgeClass = "badge-blue";
              else if (doc.status === "Rejected") statusBadgeClass = "badge-amber";

              return (
                <tr key={doc.id}>
                  <td style={{ fontWeight: 500 }}>{doc.name}</td>
                  <td>
                    <span className={`badge ${statusBadgeClass}`}>{doc.status}</span>
                  </td>
                  <td>{doc.uploadedDate || "-"}</td>
                  <td>
                    {doc.status === "Accepted" && (
                      <span style={{ fontSize: "0.85rem", color: "green" }}>Verification Completed</span>
                    )}
                    {doc.status === "Under Review" && (
                      <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>Awaiting Admin approval</span>
                    )}
                    {(doc.status === "Requested" || doc.status === "Rejected") && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleUploadClick(doc.id)}
                          style={{ padding: "4px 10px", fontSize: "0.8rem", alignSelf: "flex-start" }}
                        >
                          Upload File
                        </button>
                        {doc.rejectionReason && (
                          <span style={{ fontSize: "0.75rem", color: "red" }}>{doc.rejectionReason}</span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="portal-panel" style={{ marginTop: "24px", padding: "20px" }}>
        <h3 style={{ marginBottom: "10px", fontSize: "1.1rem" }}>Why is KYC required?</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: "1.5" }}>
          Under Indian Tax laws, channel partner payouts are subject to Tax Deducted at Source (TDS). 
          To ensure correct calculations and direct bank transfers, we require a verified PAN Card and 
          cancelled cheque before payouts are released. For GST registered businesses, a GSTIN certificate 
          must be provided to prevent double taxation on commissions.
        </p>
      </div>
    </div>
  );
}
