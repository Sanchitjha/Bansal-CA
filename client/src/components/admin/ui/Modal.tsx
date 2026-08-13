"use client";

import { useState } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  requireReason?: boolean;
  reasonLabel?: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

export default function Modal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  requireReason = false,
  reasonLabel = "Reason",
  onConfirm,
  onCancel,
}: ModalProps) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  const disabled = requireReason && !reason.trim();

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className={`modal ${danger ? "danger" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{title}</div>
        {description && <p className="modal-body">{description}</p>}
        {requireReason && (
          <div className="form-group">
            <label className="form-label">
              {reasonLabel} <span style={{ color: "#C0392B" }}>*</span>
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the reason..."
            />
          </div>
        )}
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={disabled}
            onClick={() => {
              onConfirm(requireReason ? reason.trim() : undefined);
              setReason("");
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
