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

  return (
    <div className="dropdown" ref={ref}>
      <button type="button" onClick={() => setOpen((p) => !p)} style={{ background: "none", display: "flex" }}>
        {trigger}
      </button>
      {open && (
        <div className="dropdown-menu" style={align === "left" ? { left: 0, right: "auto" } : undefined}>
          {header}
          {header && <div className="dropdown-divider" />}
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`dropdown-item ${item.danger ? "danger" : ""}`}
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
