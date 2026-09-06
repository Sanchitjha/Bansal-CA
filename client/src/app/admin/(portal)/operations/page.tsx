"use client";

import React, { useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  MessageSquare
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
      notes: "Requested rent agreement and utility bill for principal place of business.",
    },
    {
      id: "OP-403",
      caseId: "AA-CASE-1063",
      clientName: "Apex Legal Services",
      serviceName: "Company Incorporation & Registrations",
      status: "PROCESSING" as BlueprintRequestStatus,
      priority: "HIGH",
      assignedTo: "Amit Bansal",
      slaDue: "2026-09-15",
      notes: "SPICe+ Part A approved. Filing Part B with DSC authorization today.",
    },
    {
      id: "OP-404",
      caseId: "AA-CASE-0988",
      clientName: "Nexus Fintech Pvt Ltd",
      serviceName: "Accounting & Bookkeeping",
      status: "COMPLETED" as BlueprintRequestStatus,
      priority: "LOW",
      assignedTo: "Priya Sharma, FCA",
      slaDue: "2026-09-01",
      notes: "Statutory statements finalized and completion certificate issued.",
    },
  ]);

  const [activeTaskModal, setActiveTaskModal] = useState<any | null>(null);
  const [modalAction, setModalAction] = useState<"MORE_INFO" | "PROCESSING" | "COMPLETE" | null>(null);
  const [noteContent, setNoteContent] = useState("");

  const handleAdvanceStatus = (task: any, newStatus: BlueprintRequestStatus) => {
    setOperationalTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );
    updateCaseStatus(task.caseId, (newStatus === "COMPLETED" ? "Closed" : "In Progress") as any);
    toast.success(`Case ${task.caseId} transitioned to ${STATUS_METADATA[newStatus]?.label || newStatus}`);
    setActiveTaskModal(null);
    setNoteContent("");
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Section 2.1 & 14 Operational Workspace
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            Operational Queue & Processing Workbench
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Workbench for compliance officers and processors to advance state machine workflows, request customer info, and generate completion artifacts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Active Queue Workload:</span>
          <span className="font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
            {operationalTasks.length} Active Tasks
          </span>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {operationalTasks.map((task) => {
          const meta = STATUS_METADATA[task.status] || STATUS_METADATA.IN_REVIEW;
          return (
            <Card key={task.id} className="border border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs font-mono">{task.caseId}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.bg} ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      task.priority === "HIGH"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {task.priority} PRIORITY
                  </span>
                </div>

                <CardContent className="p-5 space-y-3 text-xs">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{task.clientName}</h3>
                    <div className="text-slate-500 mt-0.5">{task.serviceName}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">Operational Log:</strong> {task.notes}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400">Assigned Officer:</span>{" "}
                      <strong className="text-slate-700">{task.assignedTo}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">SLA Due Date:</span>{" "}
                      <strong className="text-slate-700">{task.slaDue}</strong>
                    </div>
                  </div>
                </CardContent>
              </div>

              {/* State Machine Transition Toolbar */}
              <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-slate-400">Advance Workflow:</span>
                <div className="flex items-center gap-1.5">
                  {task.status === "IN_REVIEW" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAdvanceStatus(task, "MORE_INFO")}
                        className="h-7 text-[11px] text-amber-700 border-amber-200 hover:bg-amber-50"
                      >
                        Request Info
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAdvanceStatus(task, "PROCESSING")}
                        className="h-7 text-[11px] bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Start Processing
                      </Button>
                    </>
                  )}

                  {task.status === "MORE_INFO" && (
                    <Button
                      size="sm"
                      onClick={() => handleAdvanceStatus(task, "IN_REVIEW")}
                      className="h-7 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Client Responded → In Review
                    </Button>
                  )}

                  {task.status === "PROCESSING" && (
                    <Button
                      size="sm"
                      onClick={() => handleAdvanceStatus(task, "COMPLETED")}
                      className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Complete & Generate Certificate
                    </Button>
                  )}

                  {task.status === "COMPLETED" && (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Filing Verified & Certificate Ready
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
