"use client";

import { ReactNode, useMemo, useState, useEffect } from "react";
import { 
  ChevronUp, 
  ChevronDown, 
  Columns, 
  Download, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  SlidersHorizontal
} from "lucide-react";

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
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [jumpPage, setJumpPage] = useState("1");
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

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / currentPageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * currentPageSize, currentPage * currentPageSize);

  // Sync jumpPage state with page changes
  useEffect(() => {
    setJumpPage(String(currentPage));
  }, [currentPage]);

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

  const startRow = sortedRows.length === 0 ? 0 : (currentPage - 1) * currentPageSize + 1;
  const endRow = Math.min(currentPage * currentPageSize, sortedRows.length);

  return (
    <div className="table-layout-wrapper">
      <div className="table-layout-toolbar">
        <div className="table-layout-toolbar-left">
          <span className="table-records-count">
            {sortedRows.length} record{sortedRows.length === 1 ? "" : "s"} found
          </span>
        </div>
        <div className="table-layout-toolbar-right">
          <div className="table-select-row-wrapper">
            <select
              value={currentPageSize}
              onChange={(e) => {
                setCurrentPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="table-row-selector"
            >
              <option value={5}>Show 5 Rows</option>
              <option value={10}>Show 10 Rows</option>
              <option value={15}>Show 15 Rows</option>
              <option value={20}>Show 20 Rows</option>
              <option value={50}>Show 50 Rows</option>
            </select>
          </div>

          <div style={{ position: "relative" }}>
            <button 
              type="button" 
              className="btn btn-secondary btn-icon-text" 
              onClick={() => setColMenuOpen((p) => !p)}
            >
              <Columns size={14} />
              <span>Manage Columns</span>
            </button>
            {colMenuOpen && (
              <div className="table-col-popover">
                <div className="table-col-popover-header">
                  <h4>Columns</h4>
                </div>
                <div className="table-col-popover-body">
                  {columns.map((c) => (
                    <label key={c.key} className="table-col-label">
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
                      <span>{c.header}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button type="button" className="btn btn-secondary btn-icon-text" onClick={exportCsv}>
            <Download size={14} />
            <span>Export Data</span>
          </button>

          <button type="button" className="table-action-menu-btn">
            <SlidersHorizontal size={14} />
          </button>

          <button type="button" className="table-action-menu-btn">
            <MoreVertical size={14} />
          </button>
        </div>
      </div>

      {selectable && selected.size > 0 && (
        <div className="admin-table-bulkbar">
          <span>{selected.size} items selected</span>
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

      <div className="table-grid-container">
        <table className="portal-table">
          <thead>
            <tr>
              {selectable && (
                <th className="admin-table-checkbox-cell">
                  <input
                    type="checkbox"
                    className="table-checkbox-input"
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
                      {sortKey === col.key ? (
                        sortDir === "asc" ? <ChevronUp size={13} style={{ marginLeft: "4px" }} /> : <ChevronDown size={13} style={{ marginLeft: "4px" }} />
                      ) : (
                        <ArrowUpDown size={12} style={{ marginLeft: "4px", opacity: 0.5 }} />
                      )}
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
                      <input 
                        type="checkbox" 
                        className="table-checkbox-input" 
                        checked={selected.has(key)} 
                        onChange={() => toggleSelectRow(key)} 
                      />
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
          <p className="empty-state" style={{ padding: "2.5rem 1rem", textAlign: "center" }}>
            {emptyMessage}
          </p>
        )}
      </div>

      {sortedRows.length > 0 && (
        <div className="table-layout-pagination">
          <div className="table-pagination-info">
            Showing <span style={{ fontWeight: 600 }}>{startRow}</span> to <span style={{ fontWeight: 600 }}>{endRow}</span> of <span style={{ fontWeight: 600 }}>{sortedRows.length}</span> records
          </div>
          
          <div className="table-pagination-controls-wrapper">
            <div className="table-pagination-pills">
              <button
                type="button"
                className="pagination-pill-btn"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // Only show active page and neighbors if too many pages
                if (totalPages > 5 && Math.abs(currentPage - pageNum) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                  if (pageNum === 2 || pageNum === totalPages - 1) {
                    return <span key={pageNum} className="pagination-pill-dots">...</span>;
                  }
                  return null;
                }

                return (
                  <button
                    key={pageNum}
                    type="button"
                    className={`pagination-pill-number ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                className="pagination-pill-btn"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="table-pagination-jump">
              <span>Go to page</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={jumpPage}
                onChange={(e) => {
                  setJumpPage(e.target.value);
                  const num = Number(e.target.value);
                  if (num >= 1 && num <= totalPages) {
                    setPage(num);
                  }
                }}
                className="table-pagination-jump-input"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
