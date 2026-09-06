"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Filter,
  X,
  Calendar,
  Download,
  RotateCcw,
  SlidersHorizontal,
  Search,
  CheckCircle2
} from "lucide-react";
import { BlueprintRequestStatus, STATUS_METADATA } from "@/data/stateMachine";

export interface ComposableFilterCriteria {
  searchQuery: string;
  startDate: string;
  endDate: string;
  status: BlueprintRequestStatus | "ALL";
  serviceCategory: string;
  partnerId: string;
  paymentStatus: string;
  commissionStatus: string;
}

export const INITIAL_FILTER_CRITERIA: ComposableFilterCriteria = {
  searchQuery: "",
  startDate: "",
  endDate: "",
  status: "ALL",
  serviceCategory: "ALL",
  partnerId: "ALL",
  paymentStatus: "ALL",
  commissionStatus: "ALL",
};

interface ComposableFilterProps {
  criteria: ComposableFilterCriteria;
  onChange: (criteria: ComposableFilterCriteria) => void;
  partnersList?: { id: string; name: string }[];
  servicesList?: { id: string; name: string }[];
  onExport?: () => void;
  totalMatches: number;
}

export function ComposableFilter({
  criteria,
  onChange,
  partnersList = [],
  servicesList = [],
  onExport,
  totalMatches,
}: ComposableFilterProps) {
  const [expanded, setExpanded] = useState(false);

  const updateField = (field: keyof ComposableFilterCriteria, value: string) => {
    onChange({
      ...criteria,
      [field]: value,
    });
  };

  const handleReset = () => {
    onChange(INITIAL_FILTER_CRITERIA);
  };

  const activeFiltersCount = Object.entries(criteria).filter(([k, v]) => {
    if (k === "searchQuery") return !!v;
    return v !== "ALL" && v !== "";
  }).length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
      {/* Primary Search & Quick Toggles */}
      <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-100">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <Input
            placeholder="Search by Request ID, client name, PAN or service..."
            value={criteria.searchQuery}
            onChange={(e) => updateField("searchQuery", e.target.value)}
            className="pl-9 h-9 text-xs"
          />
          {criteria.searchQuery && (
            <button
              onClick={() => updateField("searchQuery", "")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{totalMatches}</strong> matching records
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className={`h-9 text-xs flex items-center gap-1.5 ${
                expanded || activeFiltersCount > 0 ? "border-blue-300 bg-blue-50/50 text-blue-700" : ""
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center ml-0.5">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-9 text-xs text-slate-500 hover:text-slate-900"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
              </Button>
            )}

            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="h-9 text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Composable Filter Criteria */}
      {expanded && (
        <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Status Machine Filter */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Request Lifecycle Status</label>
            <select
              value={criteria.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full h-8 px-2.5 border border-slate-300 rounded bg-white text-slate-800 text-xs"
            >
              <option value="ALL">All Lifecycle States (11)</option>
              {Object.entries(STATUS_METADATA).map(([st, meta]) => (
                <option key={st} value={st}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>

          {/* Service Filter */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Service Offering</label>
            <select
              value={criteria.serviceCategory}
              onChange={(e) => updateField("serviceCategory", e.target.value)}
              className="w-full h-8 px-2.5 border border-slate-300 rounded bg-white text-slate-800 text-xs"
            >
              <option value="ALL">All Services</option>
              {servicesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Partner Filter */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Assigned Partner / Processor</label>
            <select
              value={criteria.partnerId}
              onChange={(e) => updateField("partnerId", e.target.value)}
              className="w-full h-8 px-2.5 border border-slate-300 rounded bg-white text-slate-800 text-xs"
            >
              <option value="ALL">All Partners & Direct</option>
              <option value="DIRECT">Direct / Website (No Partner)</option>
              {partnersList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Payment Status</label>
            <select
              value={criteria.paymentStatus}
              onChange={(e) => updateField("paymentStatus", e.target.value)}
              className="w-full h-8 px-2.5 border border-slate-300 rounded bg-white text-slate-800 text-xs"
            >
              <option value="ALL">All Payment States</option>
              <option value="Paid">Paid / Settled</option>
              <option value="Pending">Payment Pending</option>
              <option value="Refunded">Refunded / Cancelled</option>
            </select>
          </div>

          {/* Commission State */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Commission Ledger State</label>
            <select
              value={criteria.commissionStatus}
              onChange={(e) => updateField("commissionStatus", e.target.value)}
              className="w-full h-8 px-2.5 border border-slate-300 rounded bg-white text-slate-800 text-xs"
            >
              <option value="ALL">All Commission States</option>
              <option value="PENDING">Pending Approval</option>
              <option value="APPROVED">Approved (Ready for Settlement)</option>
              <option value="PAID">Settled / Paid</option>
              <option value="DISPUTED">Disputed</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Submitted From</label>
            <Input
              type="date"
              value={criteria.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
              className="h-8 text-xs bg-white"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Submitted To</label>
            <Input
              type="date"
              value={criteria.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
              className="h-8 text-xs bg-white"
            />
          </div>

          {/* Active Quick Badges */}
          <div className="flex items-end">
            <div className="w-full p-2 rounded bg-white border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 text-[11px]">Active Filters:</span>
              <span className="font-bold text-slate-800">{activeFiltersCount} applied</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
