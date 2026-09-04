"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminTable, Modal } from "@/components/admin/ui";
import { AdminCaseStatus, CasePriority, AdminDocument } from "@/data/admin";
import {
  ArrowLeft,
  User,
  ShieldCheck,
  CheckSquare,
  Square,
  Send,
  MessageSquare,
  Clock,
  Briefcase,
  AlertTriangle,
  FolderOpen,
  DollarSign,
  UserPlus,
  RefreshCw,
} from "lucide-react";

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const caseId = resolvedParams.id;

  const {
    cases,
    caseTasks,
    caseMessages,
    documents,
    invoices,
    teamUsers,
    auditLogs,
    profile,
    updateCaseStatus,
    assignCase,
    toggleCaseTask,
    sendCaseMessage,
    reviewDocument,
    logAction,
  } = useAdmin();

  // Find target case
  const currentCase = useMemo(() => {
    return cases.find((c) => c.id === caseId);
  }, [cases, caseId]);

  // States
  const [chatInput, setChatInput] = useState("");
  const [statusNote, setStatusNote] = useState("");

  // Modals state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<AdminCaseStatus | null>(null);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [pendingAssignee, setPendingAssignee] = useState("");

  const [docRejectModalOpen, setDocRejectModalOpen] = useState(false);
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);

  const [reqDocModalOpen, setReqDocModalOpen] = useState(false);
  const [reqDocName, setReqDocName] = useState("");

  // Filter tasks & messages
  const tasks = useMemo(() => {
    return caseTasks.filter((t) => t.caseId === caseId);
  }, [caseTasks, caseId]);

  const messages = useMemo(() => {
    return caseMessages.filter((m) => m.caseId === caseId);
  }, [caseMessages, caseId]);

  const caseDocs = useMemo(() => {
    return documents.filter((d) => d.relatedCaseId === caseId);
  }, [documents, caseId]);

  const caseInvoices = useMemo(() => {
    return invoices.filter((i) => i.caseId === caseId);
  }, [invoices, caseId]);

  const caseLogs = useMemo(() => {
    return auditLogs.filter((log) => log.entityId === caseId);
  }, [auditLogs, caseId]);

  // Active status timeline index helper
  // Timeline nodes: Lead -> Payment -> Documents -> Processing -> Review -> Completed -> Closed
  const activeTimelineIndex = useMemo(() => {
    if (!currentCase) return 0;
    const status = currentCase.status;
    if (status === "New") return 0;
    if (status === "Payment Pending") return 1;
    if (status === "Documents Pending") return 2;
    if (status === "In Progress" || status === "Waiting for Client") return 3;
    if (status === "Review") return 4;
    if (status === "Completed") return 5;
    if (status === "Closed" || status === "Cancelled") return 6;
    return 0;
  }, [currentCase]);

  if (!currentCase) {
    return (
      <div className="admin-page-container">
        <Link href="/admin/cases" className="admin-back-btn">
          <ArrowLeft size={16} /> Back to Cases Board
        </Link>
        <div className="admin-panel" style={{ marginTop: "2rem", padding: "3rem", textAlign: "center" }}>
          <h2>Case Record Not Found</h2>
          <p className="empty-state">No operations case with ID &quot;{caseId}&quot; exists.</p>
        </div>
      </div>
    );
  }

  // Handlers
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendCaseMessage(currentCase.id, chatInput.trim());
    logAction(`Sent communication message on case ${currentCase.id}`, "Case", currentCase.id);
    setChatInput("");
  };

  const handleOpenStatusChange = (status: AdminCaseStatus) => {
    setPendingStatus(status);
    setStatusModalOpen(true);
  };

  const handleConfirmStatusChange = (reason?: string) => {
    if (!pendingStatus) return;
    updateCaseStatus(currentCase.id, pendingStatus, reason || statusNote || undefined);
    setStatusModalOpen(false);
    setPendingStatus(null);
    setStatusNote("");
    alert(`Case status updated to ${pendingStatus}!`);
  };

  const handleOpenAssign = () => {
    setPendingAssignee(currentCase.assignedTo);
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = () => {
    assignCase(currentCase.id, pendingAssignee);
    setAssignModalOpen(false);
    alert(`Case assigned to ${pendingAssignee || "Unassigned"}!`);
  };

  const handleApproveDocument = (docId: string) => {
    reviewDocument(docId, "Accepted", profile.name);
    logAction(`Approved document ${docId} on case ${currentCase.id}`, "Case", currentCase.id);
    alert("Document approved successfully!");
  };

  const handleOpenRejectDoc = (docId: string) => {
    setRejectingDocId(docId);
    setDocRejectModalOpen(true);
  };

  const handleConfirmRejectDoc = (reason?: string) => {
    if (!rejectingDocId) return;
    reviewDocument(rejectingDocId, "Rejected", profile.name, reason);
    logAction(`Rejected document ${rejectingDocId} on case ${currentCase.id}. Reason: ${reason}`, "Case", currentCase.id);
    alert("Document rejected successfully!");
    setDocRejectModalOpen(false);
    setRejectingDocId(null);
  };

  const handleRequestDocument = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!reqDocName.trim()) return;

    logAction(`Requested document "${reqDocName}" on case ${currentCase.id}`, "Case", currentCase.id);
    alert(`Requested document "${reqDocName}" successfully!`);
    setReqDocModalOpen(false);
    setReqDocName("");
  };

  return (
    <div className="admin-page-container">
      {/* Back button */}
      <div style={{ marginBottom: "1rem" }}>
        <Link href="/admin/cases" className="admin-back-btn" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-secondary)", fontSize: "0.8125rem", textDecoration: "none" }}>
          <ArrowLeft size={14} /> Back to Cases Board
        </Link>
      </div>

      {/* Case Header Details */}
      <div className="admin-page-header" style={{ alignItems: "flex-start", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1 className="admin-page-title">{currentCase.id}</h1>
            <span className={`badge ${
              currentCase.status === "Completed" ? "badge-green" :
              ["In Progress", "Review"].includes(currentCase.status) ? "badge-blue" :
              currentCase.status === "Cancelled" ? "badge-red" : "badge-amber"
            }`}>
              {currentCase.status}
            </span>
            <span className="badge badge-grey">Priority: {currentCase.priority}</span>
          </div>
          <p className="admin-page-subtitle" style={{ marginTop: "0.25rem" }}>
            Client: <strong>{currentCase.clientName}</strong> ({currentCase.clientId}) • Service: <strong>{currentCase.serviceName}</strong>
            {currentCase.partnerName && (
              <span> • Referred by: <strong>{currentCase.partnerName}</strong></span>
            )}
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="admin-grid-3-1" style={{ marginTop: "1.5rem" }}>
        {/* Left Column (Timeline, Tasks, Docs, Messages, Logs) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Workflow Timeline Panel */}
          <div className="admin-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 1.5rem 0" }}>Workflow Timeline</h3>
            <div className="workflow-timeline" style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
              {["Lead", "Payment", "Documents", "Processing", "Review", "Completed", "Closed"].map((stage, idx) => {
                const isPassed = idx < activeTimelineIndex;
                const isActive = idx === activeTimelineIndex;
                return (
                  <div
                    key={stage}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: isActive ? "var(--color-orange)" : isPassed ? "var(--color-navy)" : "var(--color-border)",
                        color: isActive || isPassed ? "#ffffff" : "var(--color-text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {isPassed ? "✓" : idx + 1}
                    </div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "var(--color-orange)" : isPassed ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                      }}
                    >
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tasks checklist */}
          <div className="admin-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 1rem 0" }}>Checklist / Tasks</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {tasks.map((task) => {
                const done = task.status === "Completed";
                return (
                  <div
                    key={task.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 1rem",
                      border: "1px solid var(--color-border)",
                      borderRadius: "6px",
                      backgroundColor: done ? "rgba(46, 204, 113, 0.02)" : undefined,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
                      onClick={() => toggleCaseTask(task.id)}
                    >
                      {done ? (
                        <CheckSquare className="text-green" size={18} />
                      ) : (
                        <Square className="text-muted" size={18} />
                      )}
                      <span style={{ fontSize: "0.875rem", textDecoration: done ? "line-through" : undefined, color: done ? "var(--color-text-secondary)" : undefined }}>
                        {task.title}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.75rem" }}>
                      <span className="badge badge-grey">Due: {task.dueDate}</span>
                      <span className={`badge ${task.priority === "High" ? "badge-red" : "badge-grey"}`}>{task.priority}</span>
                    </div>
                  </div>
                );
              })}
              {tasks.length === 0 && <p className="empty-state">No checklist tasks configured for this case.</p>}
            </div>
          </div>

          {/* Case Documents Checklist */}
          <div className="admin-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "0.875rem", fontWeight: 700, margin: 0 }}>Documents Verification</h3>
              <button type="button" className="btn btn-secondary btn-xs" onClick={() => setReqDocModalOpen(true)}>
                Request Document
              </button>
            </div>
            <div className="admin-table-wrap">
              <table className="portal-table">
                <thead>
                  <tr>
                    <th>Document Requirement</th>
                    <th>Uploaded Date</th>
                    <th>Status</th>
                    <th>Reviewed By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {caseDocs.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{doc.name}</div>
                        {doc.rejectionReason && (
                          <div style={{ fontSize: "0.7rem", color: "var(--color-error)", marginTop: "0.15rem" }}>
                            Reason: &quot;{doc.rejectionReason}&quot;
                          </div>
                        )}
                      </td>
                      <td>{doc.uploadedDate || "Awaiting Client Upload"}</td>
                      <td>
                        <span className={`badge ${
                          doc.status === "Accepted" ? "badge-green" :
                          doc.status === "Under Review" ? "badge-blue" :
                          doc.status === "Rejected" ? "badge-red" : "badge-amber"
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td>{doc.reviewedBy || "—"}</td>
                      <td>
                        {doc.status === "Under Review" && (
                          <div style={{ display: "flex", gap: "0.25rem" }}>
                            <button
                              type="button"
                              className="btn btn-primary btn-xs"
                              onClick={() => handleApproveDocument(doc.id)}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              style={{ backgroundColor: "rgba(192, 57, 43, 0.1)", color: "var(--color-error)" }}
                              onClick={() => handleOpenRejectDoc(doc.id)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {doc.status === "Accepted" && (
                          <span style={{ fontSize: "0.75rem", color: "var(--color-success)", fontWeight: 600 }}>Verified</span>
                        )}
                        {doc.status === "Requested" && (
                          <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", fontStyle: "italic" }}>Requested</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {caseDocs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="empty-state" style={{ textAlign: "center" }}>
                        No files uploaded or requested yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Direct Chat / Communication thread */}
          <div className="admin-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 1rem 0" }}><MessageSquare size={16} style={{ display: "inline", marginRight: "4px" }} /> Client Communication thread</h3>
            <div
              style={{
                height: "260px",
                overflowY: "auto",
                border: "1px solid var(--color-border)",
                borderRadius: "6px",
                padding: "1rem",
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                backgroundColor: "var(--color-bg-neutral)",
              }}
            >
              {messages.map((msg) => {
                const isAdmin = msg.sender === "admin";
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isAdmin ? "flex-end" : "flex-start",
                      maxWidth: "75%",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.6rem 0.85rem",
                        borderRadius: "8px",
                        backgroundColor: isAdmin ? "var(--color-navy)" : "var(--color-bg-white)",
                        color: isAdmin ? "#ffffff" : "var(--color-text-primary)",
                        border: !isAdmin ? "1px solid var(--color-border)" : undefined,
                        fontSize: "0.8125rem",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      }}
                    >
                      {msg.text}
                    </div>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--color-text-secondary)",
                        marginTop: "0.25rem",
                        textAlign: isAdmin ? "right" : "left",
                      }}
                    >
                      {isAdmin ? "You" : msg.senderName} • {new Date(msg.date).toLocaleTimeString()}
                    </div>
                  </div>
                );
              })}
              {messages.length === 0 && (
                <p className="empty-state" style={{ margin: "auto", textAlign: "center" }}>
                  No messages. Type below to start consulting.
                </p>
              )}
            </div>
            <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                className="form-input"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type operational update message to client..."
              />
              <button type="submit" className="btn btn-primary">
                <Send size={15} />
              </button>
            </form>
          </div>

          {/* Activity Timeline logs */}
          <div className="admin-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: "1rem" }}><Clock size={16} style={{ display: "inline", marginRight: "4px" }} /> Case Audit Timeline</h3>
            <div className="activity-timeline">
              {caseLogs.map((log) => (
                <div key={log.id} className="activity-timeline-item">
                  <div className="activity-timeline-marker" />
                  <div className="activity-timeline-content">
                    <div className="activity-timeline-header">
                      <span className="activity-timeline-title">{log.action}</span>
                      <span className="activity-timeline-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="activity-timeline-meta">
                      <span>By: {log.user} ({log.role})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info & Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Operations Details */}
          <div className="admin-panel" style={{ padding: "1.25rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 1rem 0" }}>Operations Status</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem" }}>
              <div>
                <span style={{ color: "var(--color-text-secondary)" }}>Assigned Agent:</span>
                <div style={{ fontWeight: 600, fontSize: "0.875rem", marginTop: "0.15rem" }}>
                  {currentCase.assignedTo || "Unassigned"}
                </div>
              </div>
              <div>
                <span style={{ color: "var(--color-text-secondary)" }}>SLA Due Date:</span>
                <div style={{ fontWeight: 500, color: currentCase.priority === "High" ? "var(--color-error)" : undefined }}>
                  {currentCase.slaDueDate}
                </div>
              </div>
              <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.75rem", marginTop: "0.25rem" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Filing Payment:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.15rem" }}>
                  <span className={`badge ${currentCase.paymentStatus === "Paid" ? "badge-green" : "badge-amber"}`}>
                    {currentCase.paymentStatus}
                  </span>
                  <span>(${currentCase.amount})</span>
                </div>
              </div>
              {currentCase.invoiceId && (
                <div>
                  <span style={{ color: "var(--color-text-secondary)" }}>Invoice ID:</span>
                  <div>
                    <Link href="/admin/invoices" style={{ color: "var(--color-navy)", fontWeight: 600 }}>{currentCase.invoiceId}</Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Client Details Card */}
          <div className="admin-panel" style={{ padding: "1.25rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 1rem 0" }}>Client Profile</h3>
            <div style={{ fontSize: "0.8125rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{currentCase.clientName}</div>
              <div>ID: <code>{currentCase.clientId}</code></div>
              <Link href={`/admin/clients/${currentCase.clientId}`} className="admin-table-link" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                View Full Client Profile →
              </Link>
            </div>
          </div>

          {/* Operational Actions */}
          <div className="admin-panel" style={{ padding: "1.25rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 1rem 0" }}>Operational Controls</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button type="button" className="btn btn-secondary" style={{ width: "100%", justifyContent: "flex-start" }} onClick={handleOpenAssign}>
                <UserPlus size={14} style={{ marginRight: "0.5rem" }} /> Assign Case Agent
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: "100%", justifyContent: "flex-start" }}
                onClick={() => handleOpenStatusChange("In Progress")}
              >
                <RefreshCw size={14} style={{ marginRight: "0.5rem" }} /> Start Processing
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: "100%", justifyContent: "flex-start" }}
                onClick={() => handleOpenStatusChange("Review")}
              >
                Submit for Final Review
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: "100%", justifyContent: "flex-start" }}
                onClick={() => handleOpenStatusChange("Completed")}
              >
                Mark Case Completed
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: "100%", justifyContent: "flex-start" }}
                onClick={() => handleOpenStatusChange("Closed")}
              >
                Close & Archive Case
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Status Change */}
      <Modal
        open={statusModalOpen}
        title="Update Case Status"
        confirmLabel="Confirm Update"
        onConfirm={handleConfirmStatusChange}
        onCancel={() => {
          setStatusModalOpen(false);
          setPendingStatus(null);
          setStatusNote("");
        }}
      >
        <div className="portal-form">
          <p style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>
            Are you sure you want to transition case <strong>{currentCase.id}</strong> status to <strong>{pendingStatus}</strong>?
          </p>
          <div className="form-group">
            <label className="form-label">Audit History Note (Optional)</label>
            <input
              type="text"
              className="form-input"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="e.g. Document reviews finished, ready for tax filing."
            />
          </div>
        </div>
      </Modal>

      {/* Modal: Assign Agent */}
      <Modal
        open={assignModalOpen}
        title="Assign Agent"
        confirmLabel="Assign"
        onConfirm={handleConfirmAssign}
        onCancel={() => setAssignModalOpen(false)}
      >
        <div className="form-group">
          <label className="form-label">Select Agent</label>
          <select
            className="form-input"
            value={pendingAssignee}
            onChange={(e) => setPendingAssignee(e.target.value)}
          >
            <option value="">Unassigned</option>
            {teamUsers
              .filter((u) => u.status === "Active")
              .map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name} ({u.role})
                </option>
              ))}
          </select>
        </div>
      </Modal>

      {/* Modal: Reject Case Document */}
      <Modal
        open={docRejectModalOpen}
        title="Reject Client Document"
        confirmLabel="Reject Document"
        danger
        requireReason
        reasonLabel="Reason for Rejection"
        onConfirm={handleConfirmRejectDoc}
        onCancel={() => {
          setDocRejectModalOpen(false);
          setRejectingDocId(null);
        }}
      />

      {/* Modal: Request document */}
      <Modal
        open={reqDocModalOpen}
        title="Request Case Document"
        confirmLabel="Send Request"
        onConfirm={() => handleRequestDocument()}
        onCancel={() => setReqDocModalOpen(false)}
      >
        <form onSubmit={handleRequestDocument}>
          <div className="form-group">
            <label className="form-label">Document Name *</label>
            <input
              type="text"
              className="form-input"
              required
              value={reqDocName}
              onChange={(e) => setReqDocName(e.target.value)}
              placeholder="e.g. FY 25 Form 26AS Statement"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
