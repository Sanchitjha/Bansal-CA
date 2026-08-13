"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminTable, Drawer, Modal } from "@/components/admin/ui";
import { CMSPage } from "@/data/admin";
import { Eye, Edit3, CheckCircle, ArrowLeft, History, FileText } from "lucide-react";

export default function CMSPageEditor() {
  const { cmsPages, profile, saveCmsDraft, publishCmsPage, logAction } = useAdmin();

  // Drawer page selected state
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(null);

  // Edit fields
  const [pageSummary, setPageSummary] = useState("");
  const [updateNote, setUpdateNote] = useState("");

  const handleOpenEdit = (page: CMSPage) => {
    setSelectedPage(page);
    setPageSummary(page.summary);
    setUpdateNote("");
  };

  const handleSaveDraft = () => {
    if (!selectedPage) return;
    saveCmsDraft(selectedPage.id, updateNote || "Updated content draft", profile.name);
    // Refresh selected page
    setSelectedPage((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: "Draft",
        summary: pageSummary,
        version: prev.version + 1,
        lastUpdated: new Date().toISOString().slice(0, 10),
        updatedBy: profile.name,
        history: [
          {
            version: prev.version + 1,
            updatedBy: profile.name,
            updatedDate: new Date().toISOString().slice(0, 10),
            note: updateNote || "Updated content draft",
          },
          ...prev.history,
        ],
      };
    });
    setUpdateNote("");
    alert("Draft saved successfully!");
  };

  const handlePublish = () => {
    if (!selectedPage) return;
    publishCmsPage(selectedPage.id, profile.name);
    setSelectedPage((prev) => {
      if (!prev) return null;
      return { ...prev, status: "Published", lastUpdated: new Date().toISOString().slice(0, 10), updatedBy: profile.name };
    });
    alert("CMS Page published successfully to live website!");
  };

  const handlePreview = () => {
    if (!selectedPage) return;
    logAction(`Triggered live website layout preview for "${selectedPage.name}"`, "CMS", selectedPage.id);
    alert(`Opening preview frame for page "${selectedPage.name}"...`);
  };

  const columns = useMemo(() => {
    return [
      {
        key: "name",
        header: "Page Section",
        render: (row: CMSPage) => <strong style={{ color: "var(--color-navy)" }}>{row.name}</strong>,
        sortValue: (row: CMSPage) => row.name,
      },
      {
        key: "summary",
        header: "Description / Editable Content",
        render: (row: CMSPage) => <span>{row.summary}</span>,
      },
      {
        key: "version",
        header: "Active Version",
        render: (row: CMSPage) => <span>v{row.version}</span>,
        sortValue: (row: CMSPage) => row.version,
      },
      {
        key: "lastUpdated",
        header: "Last Modified",
        render: (row: CMSPage) => (
          <div>
            <span>{row.lastUpdated}</span>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>by {row.updatedBy}</div>
          </div>
        ),
        sortValue: (row: CMSPage) => row.lastUpdated,
      },
      {
        key: "status",
        header: "Status",
        render: (row: CMSPage) => {
          let badge = "badge-grey";
          if (row.status === "Published") badge = "badge-green";
          else if (row.status === "Draft") badge = "badge-grey";
          else if (row.status === "Preview") badge = "badge-blue";
          return <span className={`badge ${badge}`}>{row.status}</span>;
        },
        sortValue: (row: CMSPage) => row.status,
      },
      {
        key: "actions",
        header: "Actions",
        render: (row: CMSPage) => (
          <button type="button" className="btn btn-secondary btn-xs" onClick={() => handleOpenEdit(row)}>
            <Edit3 size={13} style={{ marginRight: "2px" }} /> Edit Section
          </button>
        ),
      },
    ];
  }, []);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Content Management (CMS)</h1>
          <p className="admin-page-subtitle">Refreshed SEO metadata, edited FAQ accordions, and updated public announcement highlights.</p>
        </div>
      </div>

      {/* Table grid of page sections */}
      <div className="admin-panel" style={{ marginTop: "1.5rem", padding: "1rem" }}>
        <AdminTable columns={columns} rows={cmsPages} rowKey={(r) => r.id} pageSize={10} />
      </div>

      {/* Editor Drawer */}
      <Drawer open={selectedPage !== null} title={`Edit Section: ${selectedPage?.name}`} onClose={() => setSelectedPage(null)}>
        {selectedPage && (
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Editor fields */}
            <div className="admin-panel" style={{ padding: "1rem" }}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 1rem 0" }}>Update Section Content</h4>
              <div className="portal-form">
                <div className="form-group">
                  <label className="form-label">Display Content Text</label>
                  <textarea
                    className="form-textarea"
                    rows={5}
                    value={pageSummary}
                    onChange={(e) => setPageSummary(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Modification Note (for Version history) *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={updateNote}
                    onChange={(e) => setUpdateNote(e.target.value)}
                    placeholder="e.g. Updated tax season deadlines."
                  />
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={handleSaveDraft}>
                    Save Draft
                  </button>
                  <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={handlePublish}>
                    <CheckCircle size={14} style={{ marginRight: "4px" }} /> Publish Live
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: "100%", marginTop: "0.5rem", justifyContent: "center" }}
                  onClick={handlePreview}
                >
                  <Eye size={14} style={{ marginRight: "4px" }} /> Live Preview
                </button>
              </div>
            </div>

            {/* Version History */}
            <div className="admin-panel" style={{ padding: "1rem" }}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem", margin: "0 0 1rem 0" }}>
                <History size={16} /> Version History log
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {selectedPage.history.map((hist, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderBottom: idx < selectedPage.history.length - 1 ? "1px solid var(--color-border)" : undefined,
                      paddingBottom: idx < selectedPage.history.length - 1 ? "0.5rem" : undefined,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700 }}>
                      <span style={{ color: "var(--color-orange)" }}>Version {hist.version}</span>
                      <span style={{ color: "var(--color-text-secondary)" }}>{hist.updatedDate}</span>
                    </div>
                    <p style={{ fontSize: "0.8125rem", margin: "0.25rem 0", color: "var(--color-text-primary)" }}>
                      &quot;{hist.note}&quot;
                    </p>
                    <span style={{ fontSize: "0.7rem", color: "var(--color-text-secondary)" }}>by {hist.updatedBy}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
