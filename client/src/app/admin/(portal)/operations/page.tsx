"use client";

import React, { useState, useMemo } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Send,
  Upload,
  ArrowRight,
  ShieldAlert,
  MessageSquare,
  Search,
  Check,
  Filter,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { BlueprintRequestStatus, STATUS_METADATA } from "@/data/stateMachine";
import { toast } from "sonner";

export default function AdminOperationsQueuePage() {
  const { cases, updateCaseStatus } = useAdmin();

  // Operational Queue Cases with rich state machine items
  const [operationalTasks, setOperationalTasks] = useState([
    {
      id: "OP-401",
      caseId: "AA-CASE-1042",
      clientName: "Rohan Mehta",
      serviceName: "Income Tax Return Filing",
      status: "IN_REVIEW" as BlueprintRequestStatus,
      priority: "HIGH",
      assignedTo: "Priya Sharma, FCA",
      slaDue: "2026-09-10",
      progressPct: 75,
      notes: "AIS/TIS verified against Form 16. Draft tax computation ready for client approval.",
    },
    {
      id: "OP-402",
      caseId: "AA-CASE-1051",
      clientName: "Harish Gupta",
      serviceName: "GST Registration & Compliance",
      status: "MORE_INFO" as BlueprintRequestStatus,
      priority: "MEDIUM",
      assignedTo: "Arjun Nair",
      slaDue: "2026-09-12",
      progressPct: 40,
      notes: "Requested electricity bill and landlord NOC for principal place of business.",
    },
    {
      id: "OP-403",
      caseId: "AA-CASE-1063",
      clientName: "Apex Legal Services",
      serviceName: "Company Incorporation & Registrations",
      status: "PROCESSING" as BlueprintRequestStatus,
      priority: "HIGH",
      assignedTo: "Amit Bansal, CA",
      slaDue: "2026-09-15",
      progressPct: 60,
      notes: "SPICe+ Part A approved. Filing Part B with DSC authorization today.",
    },
    {
      id: "OP-404",
      caseId: "AA-CASE-0988",
      clientName: "Nexus Fintech Pvt Ltd",
      serviceName: "Statutory Accounting & Audit",
      status: "COMPLETED" as BlueprintRequestStatus,
      priority: "LOW",
      assignedTo: "Priya Sharma, FCA",
      slaDue: "2026-09-01",
      progressPct: 100,
      notes: "Statutory statements finalized and completion certificate issued.",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeTaskModal, setActiveTaskModal] = useState<any | null>(null);
  const [modalAction, setModalAction] = useState<"MORE_INFO" | "PROCESSING" | "COMPLETE" | null>(null);
  const [noteContent, setNoteContent] = useState("");

  const handleAdvanceStatus = (task: any, newStatus: BlueprintRequestStatus) => {
    setOperationalTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus, progressPct: newStatus === "COMPLETED" ? 100 : t.progressPct } : t))
    );
    updateCaseStatus(task.caseId, (newStatus === "COMPLETED" ? "Closed" : "In Progress") as any);
    toast.success(`Case ${task.caseId} transitioned to ${STATUS_METADATA[newStatus]?.label || newStatus}`);
    setActiveTaskModal(null);
    setNoteContent("");
  };

  const filteredTasks = useMemo(() => {
    return operationalTasks.filter((t) => {
      const matchesSearch =
        t.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [operationalTasks, searchQuery, statusFilter]);

  return (
    <div className="admin-page-container">
      {/* Top Breadcrumb & Metadata Header */}
      <div className="admin-page-header">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Section 2.1 & 14 Operational Workbench
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Compliance & Fulfillment Queue</span>
          </div>
          <h1 className="admin-page-title flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-indigo-600" />
            Operational Queue & Processing Workbench
          </h1>
          <p className="admin-page-subtitle">
            Workbench for chartered accountants and processors to advance state machine workflows, request customer info, and generate statutory completion artifacts.
          </p>
        </div>

        <div className="admin-page-header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Queue refreshed with latest client submissions.")}
            className="text-xs border-slate-300 font-medium"
          >
            <Clock className="w-3.5 h-3.5 mr-1 text-indigo-600" />
            Refresh Queue
          </Button>
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            {operationalTasks.filter((t) => t.status !== "COMPLETED").length} In-Flight Tasks
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">In CA Final Review</span>
            <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {operationalTasks.filter((t) => t.status === "IN_REVIEW").length} Cases
            </span>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              Ready for Sign-Off
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Awaiting partner digital signature</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Awaiting Client Info</span>
            <span className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
              <MessageSquare className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700 font-mono">
              {operationalTasks.filter((t) => t.status === "MORE_INFO").length} Cases
            </span>
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              Blocked on Client
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Auto-reminders active</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active In Processing</span>
            <span className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {operationalTasks.filter((t) => t.status === "PROCESSING").length} Cases
            </span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              Filing / Drafting
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">SPICe+ / GST portal submittals</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Statutory SLA Compliance</span>
            <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">100.0%</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Zero Breaches
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">All cases inside designated SLA window</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Status:</span>
          {["ALL", "IN_REVIEW", "MORE_INFO", "PROCESSING", "COMPLETED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                statusFilter === st
                  ? "bg-[#0B1528] text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {st === "ALL" ? `All (${operationalTasks.length})` : st.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search case, client..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Tasks Workbench Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTasks.map((task) => {
          const meta = STATUS_METADATA[task.status] || STATUS_METADATA.IN_REVIEW;

          return (
            <div
              key={task.id}
              className="admin-panel flex flex-col justify-between hover:border-slate-300 transition-all hover:shadow-md"
            >
              <div>
                {/* Card Header */}
                <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      {task.caseId}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.bg} ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.priority === "HIGH"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {task.priority} PRIORITY
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{task.clientName}</h3>
                    <span className="text-xs text-indigo-600 font-medium">{task.serviceName}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Fulfillment Progress</span>
                      <span className="font-mono font-bold text-slate-700">{task.progressPct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          task.progressPct === 100
                            ? "bg-emerald-500"
                            : task.progressPct > 50
                            ? "bg-indigo-600"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${task.progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Notes Callout */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 text-xs text-slate-700 leading-relaxed">
                    <span className="font-semibold text-slate-900 block mb-0.5">Fulfillment Notes:</span>
                    {task.notes}
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Assigned Lead</span>
                      <span className="font-medium text-slate-800">{task.assignedTo}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">SLA Commitment Due</span>
                      <span className="font-medium text-slate-800 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {task.slaDue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar Footer */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-mono">{task.id}</span>

                <div className="flex items-center gap-2">
                  {task.status === "MORE_INFO" && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus(task, "PROCESSING")}
                      className="btn-xs bg-indigo-600 text-white hover:bg-indigo-700 font-medium inline-flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3 h-3" /> Mark Info Received
                    </button>
                  )}

                  {task.status === "PROCESSING" && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTaskModal(task);
                          setModalAction("MORE_INFO");
                        }}
                        className="btn-xs bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 font-medium inline-flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3 text-amber-500" /> Request Info
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus(task, "IN_REVIEW")}
                        className="btn-xs bg-blue-600 text-white hover:bg-blue-700 font-medium inline-flex items-center gap-1 shadow-sm"
                      >
                        <ArrowRight className="w-3 h-3" /> Ready for Review
                      </button>
                    </>
                  )}

                  {task.status === "IN_REVIEW" && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus(task, "COMPLETED")}
                      className="btn-xs bg-emerald-600 text-white hover:bg-emerald-700 font-medium inline-flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3 h-3" /> Approve & Issue Certificate
                    </button>
                  )}

                  {task.status === "COMPLETED" && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                      <Check className="w-3 h-3" /> Completed & Sealed
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Request Modal */}
      {activeTaskModal && modalAction === "MORE_INFO" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">Request Client Clarification</h3>
              <p className="text-xs text-slate-500 mt-1">
                Case {activeTaskModal.caseId} ({activeTaskModal.clientName})
              </p>
            </div>

            <textarea
              rows={4}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Specify the exact document, clarification, or signature needed..."
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveTaskModal(null);
                  setNoteContent("");
                }}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleAdvanceStatus(activeTaskModal, "MORE_INFO");
                  toast.success(`Clarification request dispatched to ${activeTaskModal.clientName}`);
                }}
                className="btn-navy text-xs"
              >
                <Send className="w-3.5 h-3.5 mr-1" /> Send to Client
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
