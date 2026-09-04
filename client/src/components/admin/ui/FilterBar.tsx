"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
}

export default function FilterBar({ searchValue, onSearchChange, searchPlaceholder = "Search...", children }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="filter-bar">
      <div className="filter-bar-search">
        <Search size={15} />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
        />
      </div>

      {children && (
        <div className="filter-dropdown-container" ref={dropdownRef}>
          <button
            type="button"
            className={`filter-toggle-btn ${isOpen ? "active" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <SlidersHorizontal size={15} />
            <span>Filters</span>
          </button>

          {isOpen && (
            <div className="filter-popover">
              <div className="filter-popover-header">
                <h3>Filter Options</h3>
                <button type="button" className="filter-close-btn" onClick={() => setIsOpen(false)}>
                  <X size={15} />
                </button>
              </div>
              <div className="filter-popover-body">
                {children}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
