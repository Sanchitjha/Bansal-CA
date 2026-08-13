"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminTable, FilterBar } from "@/components/admin/ui";
import { AuditLog, AuditResult } from "@/data/admin";

export default function AuditLogsPage() {
  const { auditLogs } = useAdmin();

  // Filters State
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("");

  // Extract unique users & entities
  const users = useMemo(() => {
    return Array.from(new Set(auditLogs.map((log) => log.user)));
  }, [auditLogs]);

  const entities = useMemo(() => {
    return Array.from(new Set(auditLogs.map((log) => log.entity)));
  }, [auditLogs]);

  // Apply filters
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.entityId.toLowerCase().includes(search.toLowerCase()) ||
        log.ip.toLowerCase().includes(search.toLowerCase());
      const matchesUser = !userFilter || log.user === userFilter;
      const matchesEntity = !entityFilter || log.entity === entityFilter;
      const matchesResult = !resultFilter || log.result === resultFilter;

      return matchesSearch && matchesUser && matchesEntity && matchesResult;
    });
  }, [auditLogs, search, userFilter, entityFilter, resultFilter]);

  const columns = useMemo(() => {
    return [
      {
        key: "timestamp",
        header: "Timestamp",
        render: (row: AuditLog) => <span>{new Date(row.timestamp).toLocaleString()}</span>,
        sortValue: (row: AuditLog) => row.timestamp,
        csvValue: (row: AuditLog) => row.timestamp,
      },
      {
        key: "user",
        header: "User (Actor)",
        render: (row: AuditLog) => (
          <div>
            <span style={{ fontWeight: 600 }}>{row.user}</span>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>{row.role}</div>
          </div>
        ),
        sortValue: (row: AuditLog) => row.user,
        csvValue: (row: AuditLog) => row.user,
      },
      {
        key: "action",
        header: "Action Performed",
        render: (row: AuditLog) => <span>{row.action}</span>,
        sortValue: (row: AuditLog) => row.action,
        csvValue: (row: AuditLog) => row.action,
      },
      {
        key: "entity",
        header: "Target Entity",
        render: (row: AuditLog) => (
          <div>
            <span className="badge badge-grey">{row.entity}</span>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginTop: "0.15rem" }}>
              ID: <code>{row.entityId}</code>
            </div>
          </div>
        ),
        sortValue: (row: AuditLog) => row.entity,
        csvValue: (row: AuditLog) => `${row.entity}:${row.entityId}`,
      },
      {
        key: "ip",
        header: "IP Address",
        render: (row: AuditLog) => <code>{row.ip}</code>,
        sortValue: (row: AuditLog) => row.ip,
        csvValue: (row: AuditLog) => row.ip,
      },
      {
        key: "result",
        header: "Result",
        render: (row: AuditLog) => (
          <span className={`badge ${row.result === "Success" ? "badge-green" : "badge-red"}`}>
            {row.result}
          </span>
        ),
        sortValue: (row: AuditLog) => row.result,
        csvValue: (row: AuditLog) => row.result,
      },
    ];
  }, []);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Platform Audit Logs</h1>
          <p className="admin-page-subtitle">Dense immutable security logs recording staff actions, KYC review outcomes, payouts and portal authentication history.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search action, IP or Entity ID...">
        <div className="filter-group">
          <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
            <option value="">All Users</option>
            {users.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)}>
            <option value="">All Entities</option>
            {entities.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>

          <select value={resultFilter} onChange={(e) => setResultFilter(e.target.value)}>
            <option value="">All Results</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </FilterBar>

      {/* Table grid */}
      <div className="admin-panel" style={{ marginTop: "1.5rem", padding: "1rem" }}>
        <AdminTable
          columns={columns}
          rows={filteredLogs}
          rowKey={(r) => r.id}
          pageSize={12}
          selectable={false}
          exportFilename="audit_logs_export"
        />
      </div>
    </div>
  );
}
