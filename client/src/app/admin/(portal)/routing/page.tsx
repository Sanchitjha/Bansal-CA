"use client";

import React, { useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Filter
} from "lucide-react";
import { toast } from "sonner";

export default function AdminRoutingEnginePage() {
  const { cases, partners, assignCase } = useAdmin();

  // Routing Strategy state
  const [activeStrategy, setActiveStrategy] = useState<"ROUND_ROBIN" | "LEAST_LOADED" | "WEIGHTED" | "GEOGRAPHIC" | "PRIORITY">("LEAST_LOADED");
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
      status: "EXCEPTION",
    },
  ]);

  const handleManualAssign = (excId: string, partnerName: string, caseId: string) => {
    setExceptionQueue((prev) => prev.filter((item) => item.id !== excId));
    setRoutingLogs((prev) => [
      {
        id: `RL-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        caseId,
        service: "Specialized Service",
        strategy: "ADMIN_OVERRIDE",
        matchedPartner: partnerName,
        decision: `Manually routed by Admin to ${partnerName}`,
        status: "SUCCESS",
      },
      ...prev,
    ]);
    toast.success(`Case ${caseId} assigned to ${partnerName}`);
  };

  const handleSaveStrategy = () => {
    toast.success(`Routing Engine updated: ${activeStrategy} strategy is now live!`);
  };

  const handleSimulateRouting = () => {
    toast.info("Simulating automatic allocation for all unassigned pending cases...");
    setTimeout(() => {
      toast.success("Routing simulation complete: 4 cases assigned, 0 new exceptions.");
    }, 1200);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Section 6 & 15 Blueprint Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GitFork className="w-6 h-6 text-blue-600" />
            Automatic Routing & Assignment Engine
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Rule-driven allocation of incoming service requests to eligible partners and franchise processors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleSimulateRouting} className="text-xs">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Run Allocation Cycle
          </Button>
          <Button onClick={handleSaveStrategy} className="bg-[#0B1528] hover:bg-[#1e293b] text-xs">
            Save Strategy Settings
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Active Strategy</div>
              <div className="text-lg font-bold text-slate-900 mt-1">{activeStrategy.replace("_", " ")}</div>
              <div className="text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Auto-allocation online
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Sliders className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Eligible Partner Pool</div>
              <div className="text-lg font-bold text-slate-900 mt-1">{partners.length || 3} Active</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Verified KYC status</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Routing Exception Queue</div>
              <div className="text-lg font-bold text-amber-600 mt-1">{exceptionQueue.length} Unassigned</div>
              <div className="text-[11px] text-amber-700 mt-0.5">Requires manual assignment</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Automated Match Rate</div>
              <div className="text-lg font-bold text-slate-900 mt-1">94.8%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Across last 120 submissions</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Strategy Config & Exception Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Strategy Selector & Rules */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border border-slate-200 shadow-sm bg-white">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                Select Routing Strategy
              </h2>
              <span className="text-xs text-slate-400">Section 6 Strategy Pipeline</span>
            </div>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: "LEAST_LOADED",
                    name: "Least-Loaded (Recommended)",
                    desc: "Assigns to eligible partner with lowest active case volume to ensure fast turnaround.",
                  },
                  {
                    id: "ROUND_ROBIN",
                    name: "Round-Robin",
                    desc: "Even distribution of requests in sequential turn-based rotation across partners.",
                  },
                  {
                    id: "WEIGHTED",
                    name: "Weighted Capacity",
                    desc: "Allocates proportional share based on partner team size and handling capacity.",
                  },
                  {
                    id: "GEOGRAPHIC",
                    name: "Geographic Territory",
                    desc: "Routes based on client State / GST jurisdiction matching partner office location.",
                  },
                  {
                    id: "PRIORITY",
                    name: "Tiered Priority",
                    desc: "Always dispatches to Tier 1 Premium partners first, falling back to Tier 2 on max capacity.",
                  },
                ].map((strat) => {
                  const isSelected = activeStrategy === strat.id;
                  return (
                    <div
                      key={strat.id}
                      onClick={() => setActiveStrategy(strat.id as any)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs font-bold text-slate-900">{strat.name}</div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{strat.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Advanced Parameter Controls */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Capacity & Fallback Constraints
                </h3>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Max Active Workload per Partner</div>
                    <div className="text-[11px] text-slate-500">Exceeding this limit redirects to Exception Queue</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={capacityThreshold}
                      onChange={(e) => setCapacityThreshold(Number(e.target.value))}
                      className="w-16 h-8 text-center text-xs border border-slate-300 rounded bg-white"
                    />
                    <span className="text-xs text-slate-500">cases</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">State / Territory Geographic Filtering</div>
                    <div className="text-[11px] text-slate-500">Require partner presence in client's registration state</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={geoRoutingEnabled}
                    onChange={(e) => setGeoRoutingEnabled(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Automatic Retry on Inactive Partner</div>
                    <div className="text-[11px] text-slate-500">Re-route if partner fails to acknowledge case within 24h</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoReassignEnabled}
                    onChange={(e) => setAutoReassignEnabled(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Routing Exception Queue */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border border-amber-200 shadow-sm bg-white overflow-hidden">
            <div className="bg-amber-50 p-4 border-b border-amber-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Routing Exception Queue
                </h2>
                <p className="text-[11px] text-amber-700">Requests requiring administrative assignment intervention</p>
              </div>
              <span className="bg-amber-200 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
                {exceptionQueue.length}
              </span>
            </div>

            <CardContent className="p-4 space-y-3">
              {exceptionQueue.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  No routing exceptions! All cases allocated successfully.
                </div>
              ) : (
                exceptionQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/30 space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.caseId}</span>
                      <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">
                        UNROUTABLE
                      </span>
                    </div>

                    <div>
                      <div className="font-semibold text-slate-800">{item.clientName}</div>
                      <div className="text-[11px] text-slate-500">{item.serviceName}</div>
                    </div>

                    <div className="text-[11px] text-red-600 bg-white p-2 rounded border border-red-100">
                      <strong>Reason:</strong> {item.reason}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[10px] text-slate-400">Suggested: {item.suggestedPartner}</div>
                      <Button
                        size="sm"
                        onClick={() => handleManualAssign(item.id, item.suggestedPartner, item.caseId)}
                        className="h-7 text-[11px] bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        Assign to {item.suggestedPartner.split(" ")[0]}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Routing Audit Logs */}
      <Card className="border border-slate-200 shadow-sm bg-white">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Routing Execution & Audit Logs</h2>
            <p className="text-xs text-slate-500">Immutable trace of automatic matching decisions</p>
          </div>
          <span className="text-xs text-slate-400">System Trace Engine</span>
        </div>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-4">Log ID</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Case ID</th>
                <th className="py-2.5 px-4">Service</th>
                <th className="py-2.5 px-4">Strategy Applied</th>
                <th className="py-2.5 px-4">Matched Destination</th>
                <th className="py-2.5 px-4">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {routingLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{log.id}</td>
                  <td className="py-3 px-4 text-slate-600">{log.timestamp}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{log.caseId}</td>
                  <td className="py-3 px-4 text-slate-700">{log.service}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {log.strategy}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium">{log.matchedPartner}</td>
                  <td className="py-3 px-4">
                    {log.status === "SUCCESS" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {log.decision}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 font-medium text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" /> {log.decision}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
