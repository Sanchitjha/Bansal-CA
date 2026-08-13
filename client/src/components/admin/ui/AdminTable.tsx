"use client";

import { ReactNode, useMemo, useState } from "react";
import { ChevronUp, ChevronDown, Columns3, Download } from "lucide-react";

export interface AdminTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  csvValue?: (row: T) => string | number;
  hideByDefault?: boolean;
}

export interface AdminTableBulkAction<T> {
  label: string;
  onClick: (rows: T[]) => void;
  danger?: boolean;
}

interface AdminTableProps<T> {
  columns: AdminTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  pageSize?: number;
  selectable?: boolean;
  bulkActions?: AdminTableBulkAction<T>[];
  emptyMessage?: string;
  exportFilename?: string;
}

export default function AdminTable<T>({
  columns,
  rows,
  rowKey,
  pageSize = 10,
  selectable = false,
  bulkActions = [],
  emptyMessage = "No records found.",
  exportFilename = "export",
}: AdminTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hidden, setHidden] = useState<Set<string>>(
    new Set(columns.filter((c) => c.hideByDefault).map((c) => c.key))
  );
  const [colMenuOpen, setColMenuOpen] = useState(false);

  const visibleColumns = columns.filter((c) => !hidden.has(c.key));

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return rows;
    return [...rows].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleSelectAll = () => {
    const next = new Set(selected);
    const allSelected = pageRows.length > 0 && pageRows.every((r) => next.has(rowKey(r)));
    pageRows.forEach((r) => (allSelected ? next.delete(rowKey(r)) : next.add(rowKey(r))));
    setSelected(next);
  };

  const toggleSelectRow = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelected(next);
  };

  const selectedRows = rows.filter((r) => selected.has(rowKey(r)));

  const exportCsv = () => {
    const header = columns.map((c) => c.header).join(",");
    const lines = sortedRows.map((row) =>
      columns
        .map((c) => `"${String(c.csvValue ? c.csvValue(row) : "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportFilename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="admin-table-toolbar">
        <div className="admin-table-toolbar-left">
          <span className="empty-state">
            {sortedRows.length} record{sortedRows.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="admin-table-toolbar-right">
          <div style={{ position: "relative" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setColMenuOpen((p) => !p)}>
              <Columns3 size={14} /> Columns
            </button>
            {colMenuOpen && (
              <div className="admin-table-col-menu">
                {columns.map((c) => (
                  <label key={c.key}>
                    <input
                      type="checkbox"
                      checked={!hidden.has(c.key)}
                      onChange={() => {
                        const next = new Set(hidden);
                        if (next.has(c.key)) next.delete(c.key);
                        else next.add(c.key);
                        setHidden(next);
                      }}
                    />
                    {c.header}
                  </label>
                ))}
              </div>
            )}
          </div>
          <button type="button" className="btn btn-secondary" onClick={exportCsv}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {selectable && selected.size > 0 && (
        <div className="admin-table-bulkbar">
          <span>{selected.size} selected</span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {bulkActions.map((action) => (
              <button
                key={action.label}
                type="button"
                className={`btn ${action.danger ? "btn-secondary" : "btn-primary"}`}
                onClick={() => {
                  action.onClick(selectedRows);
                  setSelected(new Set());
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="portal-table">
          <thead>
            <tr>
              {selectable && (
                <th className="admin-table-checkbox-cell">
                  <input
                    type="checkbox"
                    checked={pageRows.length > 0 && pageRows.every((r) => selected.has(rowKey(r)))}
                    onChange={toggleSelectAll}
                  />
                </th>
              )}
              {visibleColumns.map((col) => (
                <th key={col.key}>
                  {col.sortValue ? (
                    <span className="admin-table-sortable" onClick={() => toggleSort(col.key)}>
                      {col.header}
                      {sortKey === col.key && (sortDir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
                    </span>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => {
              const key = rowKey(row);
              return (
                <tr key={key}>
                  {selectable && (
                    <td className="admin-table-checkbox-cell">
                      <input type="checkbox" checked={selected.has(key)} onChange={() => toggleSelectRow(key)} />
                    </td>
                  )}
                  {visibleColumns.map((col) => (
                    <td key={col.key}>{col.render(row)}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        {pageRows.length === 0 && (
          <p className="empty-state" style={{ padding: "1.5rem 0.5rem" }}>
            {emptyMessage}
          </p>
        )}
      </div>

      {sortedRows.length > pageSize && (
        <div className="admin-table-pagination">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="admin-table-pagination-controls">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
