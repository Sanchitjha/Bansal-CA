"use client";

import { ReactNode } from "react";
import { Search } from "lucide-react";

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
}

export default function FilterBar({ searchValue, onSearchChange, searchPlaceholder = "Search...", children }: FilterBarProps) {
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
      {children}
    </div>
  );
}
