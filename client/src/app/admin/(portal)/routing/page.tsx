"use client";

import React, { useState, useMemo } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Button } from "@/components/ui/button";
import {
  GitFork,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Users,
  MapPin,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Filter,
  Search,
  Check,
  Zap,
  Activity,
  UserCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

export default function AdminRoutingEnginePage() {
  const { cases, partners, assignCase } = useAdmin();

  // Routing Strategy state
  const [activeStrategy, setActiveStrategy] = useState<
    "ROUND_ROBIN" | "LEAST_LOADED" | "WEIGHTED" | "GEOGRAPHIC" | "PRIORITY"
  >("LEAST_LOADED");
  const [capacityThreshold, setCapacityThreshold] = useState(10);
  const [geoRoutingEnabled, setGeoRoutingEnabled] = useState(true);
  const [autoReassignEnabled, setAutoReassignEnabled] = useState(true);

  // Exception queue state
  const [exceptionQueue, setExceptionQueue] = useState([
    {
      id: "EXC-101",
      caseId: "AA-CASE-1088",
      clientName: "Siddharth Malhotra",
      serviceName: "Transfer Pricing Study",
      reason: "No partner with specialized International Tax credential active",
      failedAt: "2026-09-06 18:30",
      status: "PENDING_MANUAL_ASSIGNMENT",
      priority: "HIGH",
      suggestedPartner: "Zenith Advisors",
    },
    {
      id: "EXC-102",
      caseId: "AA-CASE-1094",
      clientName: "Vanguard Exports LLP",
      serviceName: "GST Audit Special Assessment",
      reason: "Partner capacity exceeded (Current: 12/10 cases)",
      failedAt: "2026-09-06 20:15",
      status: "PENDING_MANUAL_ASSIGNMENT",
      priority: "CRITICAL",
      suggestedPartner: "Apex Legal Services",
    },
  ]);

  // Routing Logs state
  const [routingLogs, setRoutingLogs] = useState([
    {
      id: "RL-501",
      timestamp: "2026-09-07 01:15:20",
      caseId: "AA-CASE-1042",
      service: "Income Tax Return",
      strategy: "LEAST_LOADED",
      matchedPartner: "Zenith Advisors (PTR-101)",
      decision: "Assigned (Workload: 2 active cases)",
      latency: "28ms",
      status: "SUCCESS",
    },
    {
      id: "RL-502",
      timestamp: "2026-09-07 01:25:44",
      caseId: "AA-CASE-1051",
      service: "GST Registration & Compliance",
      strategy: "GEOGRAPHIC",
      matchedPartner: "Northgate Financial (PTR-102)",
      decision: "Assigned (Territory match: Maharashtra)",
      latency: "34ms",
      status: "SUCCESS",
    },
    {
      id: "RL-503",
      timestamp: "2026-09-07 01:40:12",
      caseId: "AA-CASE-1088",
      service: "Transfer Pricing Study",
      strategy: "HYBRID",
      matchedPartner: "None",
      decision: "Exception created: No certified provider",
      latency: "19ms",
      status: "EXCEPTION",
    },
  ]);

  const [searchLog, setSearchLog] = useState("");

  const handleManualAssign = (excId: string, partnerName: string, caseId: string) => {
    setExceptionQueue((prev) => prev.filter((item) => item.id !== excId));
    setRoutingLogs((prev) => [
      {
        id: `RL-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        caseId,
        service: "Specialized Service",
        strategy: "ADMIN_OVERRIDE",
        matchedPartner: partnerName,
        decision: `Manually routed by Admin to ${partnerName}`,
        latency: "12ms",
        status: "SUCCESS",
      },
      ...prev,
    ]);
    toast.success(`Case ${caseId} assigned successfully to ${partnerName}`);
  };

  const handleSaveStrategy = () => {
    toast.success(`Routing Engine updated: ${activeStrategy.replace("_", " ")} strategy is now live!`);
  };

  const handleSimulateRouting = () => {
    toast.info("Simulating automatic allocation cycle for pending unassigned cases...");
    setTimeout(() => {
      toast.success("Routing simulation completed: 4 cases assigned, 0 new exceptions.");
    }, 1000);
  };

  const filteredLogs = useMemo(() => {
    return routingLogs.filter(
      (log) =>
        log.caseId.toLowerCase().includes(searchLog.toLowerCase()) ||
        log.matchedPartner.toLowerCase().includes(searchLog.toLowerCase()) ||
        log.strategy.toLowerCase().includes(searchLog.toLowerCase())
    );
  }, [routingLogs, searchLog]);

  return (
    <div className="admin-page-container">
      {/* Top Breadcrumb & Metadata Header */}
      <div className="admin-page-header">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200/80 text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Section 6 & 15 Blueprint Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Auto-Assignment Pipeline</span>
          </div>
          <h1 className="admin-page-title flex items-center gap-2.5">
            <GitFork className="w-7 h-7 text-blue-600" />
            Automatic Routing & Allocation Engine
          </h1>
          <p className="admin-page-subtitle">
            Rule-driven dispatch of incoming service requests to eligible partners, certified specialists, and franchise nodes.
          </p>
        </div>

        <div className="admin-page-header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulateRouting}
            className="text-xs border-slate-300 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            Run Allocation Cycle
          </Button>
          <Button
            onClick={handleSaveStrategy}
            className="btn-navy text-xs font-semibold px-4 shadow-sm"
          >
            <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            Save Strategy Settings
          </Button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Strategy</span>
            <span className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
              <Sliders className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">{activeStrategy.replace("_", " ")}</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Auto-allocation online
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Eligible Partner Pool</span>
            <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">{partners.length || 3} Active</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Verified
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Full KYC & statutory verification</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Routing Exception Queue</span>
            <span className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 font-mono">{exceptionQueue.length} Pending</span>
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              Requires CA Sign-off
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Fallbacks awaiting manual assignment</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Automated Match Rate</span>
            <span className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">96.4%</span>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
              +1.6%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Avg latency: 27ms per request</span>
        </div>
      </div>

      {/* Main Grid: Strategy Selector & Exception Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Strategy Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h2 className="admin-panel-title">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Select Routing Algorithm
                </h2>
                <span className="text-xs text-slate-400 block mt-0.5">
                  Choose the primary matching strategy for automated client assignment
                </span>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
                Blueprint §6
              </span>
            </div>

            <div className="admin-panel-body space-y-3">
              {[
                {
                  id: "LEAST_LOADED",
                  badge: "Recommended",
                  name: "Least-Loaded Capacity Balancer",
                  desc: "Automatically routes requests to the certified partner with lowest current case backlog to minimize turnaround times.",
                },
                {
                  id: "ROUND_ROBIN",
                  badge: "Equitable",
                  name: "Sequential Round-Robin Rotation",
                  desc: "Evenly cycles assignments across all verified partners in sequential order.",
                },
                {
                  id: "WEIGHTED",
                  badge: "Team-Scaled",
                  name: "Weighted Seniority & Team Capacity",
                  desc: "Routes proportional case volume matching partner firm size and staff capacity ratings.",
                },
                {
                  id: "GEOGRAPHIC",
                  badge: "Jurisdiction",
                  name: "Territorial Jurisdiction Matching",
                  desc: "Assigns based on client State and GST tax circle proximity to local partner offices.",
                },
                {
                  id: "PRIORITY",
                  badge: "Tier-Based",
                  name: "Tier 1 Priority Escalation",
                  desc: "Directs high-value corporate filings to Senior Partner firms first, spilling over to Tier 2 on max threshold.",
                },
              ].map((strat) => {
                const isSelected = activeStrategy === strat.id;
                return (
                  <div
                    key={strat.id}
                    onClick={() => setActiveStrategy(strat.id as any)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/40 shadow-sm"
                        : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                        isSelected ? "bg-blue-600 text-white" : "border-2 border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">{strat.name}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {strat.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{strat.desc}</p>
                    </div>
                  </div>
                );
              })}

              {/* Advanced Threshold Controls */}
              <div className="border-t border-slate-200 pt-4 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800">
                    Max Partner Case Cap (Cases)
                  </label>
                  <input
                    type="number"
                    value={capacityThreshold}
                    onChange={(e) => setCapacityThreshold(Number(e.target.value))}
                    className="w-full h-9 px-3 text-xs border border-slate-300 rounded-lg bg-white font-medium"
                    min="1"
                    max="50"
                  />
                  <span className="text-[10px] text-slate-400">Cases over this create an exception</span>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="text-xs font-semibold text-slate-800 block">
                    Automation Fallbacks
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="geo"
                      checked={geoRoutingEnabled}
                      onChange={(e) => setGeoRoutingEnabled(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="geo" className="text-xs text-slate-700 cursor-pointer">
                      Enable Geographic Proximity Fallback
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoReassign"
                      checked={autoReassignEnabled}
                      onChange={(e) => setAutoReassignEnabled(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="autoReassign" className="text-xs text-slate-700 cursor-pointer">
                      Auto-Reassign on 24h Partner Inactivity
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Routing Exception Queue */}
        <div className="lg:col-span-5 space-y-6">
          <div className="admin-panel border-amber-200/80 bg-amber-50/20">
            <div className="admin-panel-header bg-amber-50/60 border-amber-200/80">
              <div>
                <h2 className="admin-panel-title text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Routing Exception Queue ({exceptionQueue.length})
                </h2>
                <span className="text-xs text-amber-700 mt-0.5 block">
                  Requests that could not be auto-matched by policy rules
                </span>
              </div>
              <span className="text-[11px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                Action Required
              </span>
            </div>

            <div className="admin-panel-body space-y-3.5">
              {exceptionQueue.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-slate-800 text-sm">Exception Queue Clear</h3>
                  <p className="text-xs text-slate-500 mt-1">All service requests have been dispatched successfully.</p>
                </div>
              ) : (
                exceptionQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block">{item.id}</span>
                        <h3 className="font-bold text-sm text-slate-900 mt-0.5">{item.clientName}</h3>
                        <span className="text-xs text-blue-600 font-medium">{item.serviceName}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                        {item.priority}
                      </span>
                    </div>

                    <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-lg text-xs text-amber-900 leading-snug">
                      <strong>Exception Reason:</strong> {item.reason}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 text-[11px]">Suggested: <strong>{item.suggestedPartner}</strong></span>
                      <button
                        type="button"
                        onClick={() => handleManualAssign(item.id, item.suggestedPartner, item.caseId)}
                        className="btn-xs bg-[#0B1528] text-white hover:bg-slate-800 font-medium transition-colors shadow-sm inline-flex items-center gap-1"
                      >
                        <UserCheck className="w-3 h-3" />
                        Assign to {item.suggestedPartner.split(" ")[0]}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Routing Audit Log Ledger */}
      <div className="admin-panel">
        <div className="admin-panel-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="admin-panel-title">
              <Activity className="w-4 h-4 text-blue-600" />
              Real-Time Dispatch Audit Log
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live immutable log of automated routing matches, rule executions, and latency metrics
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchLog}
              onChange={(e) => setSearchLog(e.target.value)}
              placeholder="Search case, partner..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-5">Timestamp</th>
                <th className="py-3 px-4">Case Reference</th>
                <th className="py-3 px-4">Service Required</th>
                <th className="py-3 px-4">Matched Strategy</th>
                <th className="py-3 px-4">Assigned Partner</th>
                <th className="py-3 px-4">Decision Output</th>
                <th className="py-3 px-4 text-center">Latency</th>
                <th className="py-3 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-5 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{log.caseId}</td>
                  <td className="py-3 px-4 text-slate-700">{log.service}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-200/60">
                      {log.strategy}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{log.matchedPartner}</td>
                  <td className="py-3 px-4 text-slate-600">{log.decision}</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-500 text-[11px]">{log.latency}</td>
                  <td className="py-3 px-5 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        log.status === "SUCCESS"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          log.status === "SUCCESS" ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
