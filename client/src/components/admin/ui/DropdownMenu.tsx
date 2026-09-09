"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

export interface DropdownItemConfig {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownItemConfig[];
  header?: ReactNode;
  align?: "left" | "right";
}

export default function DropdownMenu({ trigger, items, header, align = "right" }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        style={{ background: "none", display: "flex" }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
      </button>
      {open && (
        <div className="dropdown-menu" role="menu" style={align === "left" ? { left: 0, right: "auto" } : undefined}>
          {header}
          {header && <div className="dropdown-divider" />}
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`dropdown-item ${item.danger ? "danger" : ""}`}
              role="menuitem"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
