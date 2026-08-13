"use client";

import { usePartner } from "@/components/partner/PartnerProvider";

export default function PartnerTasksPage() {
  const { tasks, markTaskDone } = usePartner();

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>My Checklist Tasks</h1>
          <p>Actions required on your account to verify your partnership status.</p>
        </div>
      </div>

      <div className="portal-panel">
        <div className="portal-panel-header">
          <h2>Task Checklist</h2>
        </div>
        {tasks.length === 0 ? (
          <p className="empty-state" style={{ padding: "40px" }}>No tasks assigned.</p>
        ) : (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Task Details</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{task.title}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                      {task.description}
                    </div>
                  </td>
                  <td>{task.dueDate}</td>
                  <td>
                    <span className={`badge ${task.status === "Completed" ? "badge-green" : "badge-amber"}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    {task.status === "Pending" ? (
                      <button
                        className="btn btn-primary"
                        style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                        onClick={() => markTaskDone(task.id)}
                      >
                        Mark Done
                      </button>
                    ) : (
                      <span style={{ fontSize: "0.85rem", color: "green" }}>✓ Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
