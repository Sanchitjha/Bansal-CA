"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminTable, Tabs, Modal } from "@/components/admin/ui";
import { AdminDocument, DocumentStatus } from "@/data/admin";
import { Download, FileText, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function DocumentsPage() {
  const {
    documents,
    profile,
    reviewDocument,
    logAction,
  } = useAdmin();

  // Tab State
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);

  // Apply filters based on tab selected
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Search matches
      const matchesSearch =
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.ownerName.toLowerCase().includes(search.toLowerCase()) ||
        doc.id.toLowerCase().includes(search.toLowerCase()) ||
        (doc.relatedCaseId && doc.relatedCaseId.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;

      // Tab filters
      if (activeTab === "pending") return doc.status === "Under Review" || doc.status === "Uploaded";
      if (activeTab === "accepted") return doc.status === "Accepted";
      if (activeTab === "rejected") return doc.status === "Rejected";
      if (activeTab === "expiring") {
        return doc.status === "Accepted" && doc.expiryDate;
      }
      return true; // "all"
    });
  }, [documents, activeTab, search]);

  // Document action handlers
  const handleApproveDocument = (docId: string) => {
    reviewDocument(docId, "Accepted", profile.name);
    logAction(`Approved document ${docId}`, "Document", docId);
    alert("Document approved successfully!");
  };

  const handleOpenReject = (docId: string) => {
    setRejectingDocId(docId);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (reason?: string) => {
    if (!rejectingDocId) return;
    reviewDocument(rejectingDocId, "Rejected", profile.name, reason);
    logAction(`Rejected document ${rejectingDocId}. Reason: ${reason}`, "Document", rejectingDocId);
    alert("Document rejected successfully!");
    setRejectModalOpen(false);
    setRejectingDocId(null);
  };

  const handleRequestReupload = (docId: string) => {
    reviewDocument(docId, "Requested", profile.name);
    logAction(`Requested document re-upload for ${docId}`, "Document", docId);
    alert("Re-upload request sent to client/partner.");
  };

  const handleDownload = (doc: AdminDocument) => {
    logAction(`Downloaded file for document ${doc.id} (${doc.name})`, "Document", doc.id);
    alert(`Downloading document ${doc.name}...`);
  };

  const columns = useMemo(() => {
    return [
      {
        key: "name",
        header: "Document Description",
        render: (row: AdminDocument) => (
          <div>
            <div style={{ fontWeight: 600 }}>{row.name}</div>
            {row.rejectionReason && (
              <div style={{ fontSize: "0.75rem", color: "var(--color-error)", marginTop: "0.15rem" }}>
                Reason: &quot;{row.rejectionReason}&quot;
              </div>
            )}
          </div>
        ),
        sortValue: (row: AdminDocument) => row.name,
        csvValue: (row: AdminDocument) => row.name,
      },
      {
        key: "owner",
        header: "Uploaded By (Owner)",
        render: (row: AdminDocument) => (
          <div>
            {row.ownerType === "Client" ? (
              <Link href={`/admin/clients/${row.ownerId}`} className="admin-table-link">
                {row.ownerName}
              </Link>
            ) : (
              <Link href={`/admin/partners/${row.ownerId}`} className="admin-table-link">
                {row.ownerName}
              </Link>
            )}
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
              {row.ownerType} ID: {row.ownerId}
            </div>
          </div>
        ),
        sortValue: (row: AdminDocument) => row.ownerName,
        csvValue: (row: AdminDocument) => row.ownerName,
      },
      {
        key: "case",
        header: "Associated Case",
        render: (row: AdminDocument) => (
          <span>{row.relatedCaseId ? <Link href={`/admin/cases/${row.relatedCaseId}`} className="admin-table-link">{row.relatedCaseId}</Link> : "—"}</span>
        ),
        sortValue: (row: AdminDocument) => row.relatedCaseId || "",
        csvValue: (row: AdminDocument) => row.relatedCaseId || "",
      },
      {
        key: "type",
        header: "File Type",
        render: (row: AdminDocument) => <span className="badge badge-grey">{row.type}</span>,
        sortValue: (row: AdminDocument) => row.type,
        csvValue: (row: AdminDocument) => row.type,
      },
      {
        key: "uploaded",
        header: "Uploaded Date",
        render: (row: AdminDocument) => <span>{row.uploadedDate || "Awaiting upload"}</span>,
        sortValue: (row: AdminDocument) => row.uploadedDate || "",
        csvValue: (row: AdminDocument) => row.uploadedDate || "",
      },
      {
        key: "status",
        header: "Status",
        render: (row: AdminDocument) => {
          let badge = "badge-grey";
          if (row.status === "Accepted") badge = "badge-green";
          else if (row.status === "Under Review") badge = "badge-blue";
          else if (row.status === "Rejected") badge = "badge-red";
          else if (row.status === "Requested") badge = "badge-amber";
          return <span className={`badge ${badge}`}>{row.status}</span>;
        },
        sortValue: (row: AdminDocument) => row.status,
        csvValue: (row: AdminDocument) => row.status,
      },
      {
        key: "reviewedBy",
        header: "Reviewer",
        render: (row: AdminDocument) => (
          <span>
            {row.reviewedBy ? (
              <span style={{ fontSize: "0.8125rem" }}>
                {row.reviewedBy} <span style={{ color: "var(--color-text-secondary)", fontSize: "0.7rem" }}>({row.reviewedAt})</span>
              </span>
            ) : (
              "—"
            )}
          </span>
        ),
        sortValue: (row: AdminDocument) => row.reviewedBy || "",
        csvValue: (row: AdminDocument) => row.reviewedBy || "",
      },
      {
        key: "expiry",
        header: "Expiry Date",
        render: (row: AdminDocument) => (
          <span style={{ color: row.expiryDate ? "var(--color-orange)" : undefined }}>
            {row.expiryDate || "—"}
          </span>
        ),
        sortValue: (row: AdminDocument) => row.expiryDate || "",
        csvValue: (row: AdminDocument) => row.expiryDate || "",
      },
      {
        key: "actions",
        header: "Actions",
        render: (row: AdminDocument) => (
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {row.uploadedDate && (
              <button
                type="button"
                className="btn btn-secondary btn-xs"
                title="Download file"
                onClick={() => handleDownload(row)}
              >
                <Download size={13} />
              </button>
            )}
            {row.status === "Under Review" && (
              <>
                <button
                  type="button"
                  className="btn btn-primary btn-xs"
                  onClick={() => handleApproveDocument(row.id)}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  style={{ backgroundColor: "rgba(192, 57, 43, 0.1)", color: "var(--color-error)" }}
                  onClick={() => handleOpenReject(row.id)}
                >
                  Reject
                </button>
              </>
            )}
            {row.status === "Rejected" && (
              <button
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={() => handleRequestReupload(row.id)}
              >
                <RefreshCw size={13} style={{ marginRight: "2px" }} /> Re-request
              </button>
            )}
          </div>
        ),
      },
    ];
  }, []);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Document Repository</h1>
          <p className="admin-page-subtitle">Verify corporate registrations, PAN proofs, GSTIN filings, bank checks and client case files.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" role="tablist" style={{ marginBottom: "1.5rem" }}>
        {[
          { id: "all", label: "All Documents" },
          { id: "pending", label: "Pending Review" },
          { id: "accepted", label: "Accepted" },
          { id: "rejected", label: "Rejected" },
          { id: "expiring", label: "Expiring Soon" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter search */}
      <div className="filter-bar" style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          className="form-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents by name, owner, Case ID..."
          style={{ maxWidth: "400px" }}
        />
      </div>

      {/* Table grid */}
      <div className="admin-panel" style={{ marginTop: "1.5rem", padding: "1rem" }}>
        <AdminTable
          columns={columns}
          rows={filteredDocuments}
          rowKey={(r) => r.id}
          pageSize={10}
          selectable
          exportFilename="documents_repository_export"
        />
      </div>

      {/* Modal: Document Rejection Reason */}
      <Modal
        open={rejectModalOpen}
        title="Reject Client Document"
        confirmLabel="Reject Document"
        danger
        requireReason
        reasonLabel="Specify Rejection Reason"
        onConfirm={handleConfirmReject}
        onCancel={() => {
          setRejectModalOpen(false);
          setRejectingDocId(null);
        }}
      />
    </div>
  );
}
