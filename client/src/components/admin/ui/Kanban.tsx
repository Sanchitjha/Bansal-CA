"use client";

import { ReactNode } from "react";

export interface KanbanColumnConfig<T> {
  id: string;
  label: string;
  items: T[];
}

interface KanbanProps<T> {
  columns: KanbanColumnConfig<T>[];
  renderCard: (item: T) => ReactNode;
  onCardClick?: (item: T) => void;
}

export default function Kanban<T>({ columns, renderCard, onCardClick }: KanbanProps<T>) {
  return (
    <div className="kanban-board">
      {columns.map((col) => (
        <div className="kanban-column" key={col.id}>
          <div className="kanban-column-header">
            <span>{col.label}</span>
            <span className="kanban-count">{col.items.length}</span>
          </div>
          <div className="kanban-cards">
            {col.items.map((item, idx) => (
              <div
                className="kanban-card"
                key={idx}
                onClick={() => onCardClick?.(item)}
                style={{ cursor: onCardClick ? "pointer" : undefined }}
              >
                {renderCard(item)}
              </div>
            ))}
            {col.items.length === 0 && <p className="empty-state">No items</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
