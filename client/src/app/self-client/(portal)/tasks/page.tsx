"use client";

import Link from "next/link";
import { useSelfClient } from "@/components/self-client/SelfClientProvider";
import StatusBadge from "@/components/self-client/StatusBadge";

export default function TasksPage() {
  const { tasks, cases, markTaskDone } = useSelfClient();

  const caseNameFor = (caseId: string) => cases.find((c) => c.id === caseId)?.serviceName || caseId;
  const pending = tasks.filter((t) => t.status === "Pending");
  const completed = tasks.filter((t) => t.status === "Completed");

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>Tasks / Action Required</h1>
          <p>Items that need your response — document uploads, approvals, or information.</p>
        </div>
      </div>

      <div className="portal-panel">
        <div className="portal-panel-header">
          <h2>Pending ({pending.length})</h2>
        </div>
        {pending.length === 0 ? (
          <p className="empty-state">You&apos;re all caught up — no pending actions.</p>
        ) : (
          <ul className="task-list">
            {pending.map((task) => (
              <li key={task.id} className="task-item">
                <div>
                  <p className="task-item-title">{task.title}</p>
                  <p className="task-item-desc">{task.description}</p>
                  <p className="portal-simple-list-meta">
                    <Link href={`/self-client/cases/${task.caseId}`}>{caseNameFor(task.caseId)}</Link> · Due {task.dueDate}
                  </p>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => markTaskDone(task.id)}>
                  Mark Complete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="portal-panel">
        <div className="portal-panel-header">
          <h2>Completed ({completed.length})</h2>
        </div>
        {completed.length === 0 ? (
          <p className="empty-state">No completed tasks yet.</p>
        ) : (
          <ul className="portal-simple-list">
            {completed.map((task) => (
              <li key={task.id}>
                <span className="portal-simple-list-title">{task.title}</span>
                <StatusBadge status={task.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
