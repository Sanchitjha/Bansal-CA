"use client";

import { use } from "react";
import Link from "next/link";
import { useSelfClient } from "@/components/self-client/SelfClientProvider";
import StatusBadge from "@/components/self-client/StatusBadge";

export default function SelfClientCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { cases, documents, payments, tasks, messages } = useSelfClient();

  const caseItem = cases.find((c) => c.id === id);
  const caseDocuments = documents.filter((d) => d.caseId === id);
  const casePayments = payments.filter((p) => p.caseId === id);
  const caseTasks = tasks.filter((t) => t.caseId === id);
  const caseMessages = messages.filter((m) => m.caseId === id);

  if (!caseItem) {
    return (
      <div className="portal-panel">
        <p className="empty-state">
          We couldn&apos;t find case <strong>{id}</strong>.{" "}
          <Link href="/self-client/cases">Back to My Services / Cases</Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>{caseItem.serviceName}</h1>
          <p>
            Case ID <strong>{caseItem.id}</strong> · Created {caseItem.createdDate}
            {caseItem.dueDate ? ` · Due ${caseItem.dueDate}` : ""}
          </p>
        </div>
        <div className="portal-case-header-badges">
          <StatusBadge status={caseItem.status} />
          <StatusBadge status={caseItem.paymentStatus} />
        </div>
      </div>

      <div className="portal-two-col">
        <div className="portal-panel">
          <div className="portal-panel-header">
            <h2>Status Timeline</h2>
          </div>
          <ol className="timeline">
            {caseItem.statusHistory.map((event, idx) => (
              <li key={`${event.status}-${event.date}-${idx}`} className="timeline-item">
                <span className="timeline-dot" />
                <div className="timeline-content">
                  <span className="timeline-status">{event.status}</span>
                  <span className="timeline-date">{event.date}</span>
                  {event.note && <p className="timeline-note">{event.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="portal-panel">
          <div className="portal-panel-header">
            <h2>Case Details</h2>
          </div>
          <dl className="portal-detail-list">
            <div>
              <dt>Assigned Team Member</dt>
              <dd>{caseItem.assignedTeamMember || "Not yet assigned"}</dd>
            </div>
            <div>
              <dt>Priority</dt>
              <dd>{caseItem.priority}</dd>
            </div>
            <div>
              <dt>Amount</dt>
              <dd>${caseItem.amount}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="portal-panel">
        <div className="portal-panel-header">
          <h2>Documents ({caseDocuments.length})</h2>
          <Link href="/self-client/documents" className="btn-link">Manage documents</Link>
        </div>
        {caseDocuments.length === 0 ? (
          <p className="empty-state">No documents linked to this case yet.</p>
        ) : (
          <ul className="portal-simple-list">
            {caseDocuments.map((doc) => (
              <li key={doc.id}>
                <span className="portal-simple-list-title">{doc.name}</span>
                <StatusBadge status={doc.status} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="portal-panel">
        <div className="portal-panel-header">
          <h2>Payments ({casePayments.length})</h2>
          <Link href="/self-client/payments" className="btn-link">View payments</Link>
        </div>
        {casePayments.length === 0 ? (
          <p className="empty-state">No payments linked to this case yet.</p>
        ) : (
          <ul className="portal-simple-list">
            {casePayments.map((p) => (
              <li key={p.id}>
                <span className="portal-simple-list-title">{p.description} — ${p.amount}</span>
                <StatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="portal-panel">
        <div className="portal-panel-header">
          <h2>Tasks ({caseTasks.length})</h2>
          <Link href="/self-client/tasks" className="btn-link">View tasks</Link>
        </div>
        {caseTasks.length === 0 ? (
          <p className="empty-state">No tasks assigned for this case.</p>
        ) : (
          <ul className="portal-simple-list">
            {caseTasks.map((task) => (
              <li key={task.id}>
                <span className="portal-simple-list-title">{task.title}</span>
                <StatusBadge status={task.status} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="portal-panel">
        <div className="portal-panel-header">
          <h2>Messages ({caseMessages.length})</h2>
          <Link href={`/self-client/messages?case=${caseItem.id}`} className="btn-link">Open thread</Link>
        </div>
        {caseMessages.length === 0 ? (
          <p className="empty-state">No messages yet for this case.</p>
        ) : (
          <p className="empty-state">
            Latest: &ldquo;{caseMessages[caseMessages.length - 1].text}&rdquo; — {caseMessages[caseMessages.length - 1].senderName}
          </p>
        )}
      </div>
    </div>
  );
}
