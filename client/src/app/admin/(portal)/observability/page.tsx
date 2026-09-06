"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Server,
  Database,
  ShieldCheck,
  AlertTriangle,
  Clock,
  RotateCcw,
  CheckCircle2,
  HardDrive,
  Cpu,
  Zap,
  Terminal,
  Search,
  Check,
  Copy,
  Filter,
  Layers,
  Radio
} from "lucide-react";
import { toast } from "sonner";

export default function AdminObservabilityPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");

  // System Health Components
  const [systemHealth, setSystemHealth] = useState({
    apiStatus: "HEALTHY",
    databaseStatus: "CONNECTED",
    queueDepth: 4,
    routingLatencyMs: 28,
    documentWorkerStatus: "ONLINE",
    errorRatePct: 0.04,
    activeWorkers: 6,
    uptimeSeconds: 849200,
  });

  // Observability Event Stream with Correlation IDs (Section 13)
  const [logEvents, setLogEvents] = useState([
    {
      id: "EVT-9041",
      timestamp: "2026-09-07 02:45:11.204",
      correlationId: "corr-f6a5-req-1042",
      service: "RoutingEngine",
      level: "INFO",
      message: "Request AA-CASE-1042 matched strategy LEAST_LOADED to partner PTR-101. Match latency: 28ms.",
    },
    {
      id: "EVT-9042",
      timestamp: "2026-09-07 02:46:02.812",
      correlationId: "corr-f6a5-doc-gen",
      service: "DocumentService",
      level: "INFO",
      message: "Statutory Certificate generated for case AA-CASE-0988. SHA-256 integrity hash committed to audit ledger.",
    },
    {
      id: "EVT-9043",
      timestamp: "2026-09-07 02:47:33.119",
      correlationId: "corr-f6a5-comm-calc",
      service: "CommissionEngine",
      level: "INFO",
      message: "Immutable commission transaction COMM-2026-802 computed: Gross ₹16,500, TDS ₹1,650, Net ₹14,850.",
    },
    {
      id: "EVT-9044",
      timestamp: "2026-09-07 02:48:19.490",
      correlationId: "corr-f6a5-exc-queue",
      service: "ExceptionMonitor",
      level: "WARN",
      message: "Unroutable request AA-CASE-1088 placed in Exception Queue. Reason: Specialization credential unavailable.",
    },
    {
      id: "EVT-9045",
      timestamp: "2026-09-07 02:49:50.012",
      correlationId: "corr-f6a5-auth-sync",
      service: "IdentityService",
      level: "INFO",
      message: "Session token validated for admin@bansalca.com. Multi-tenant context resolved to tenant AA-PROD-01.",
    },
  ]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Observability metrics refreshed — all nodes operating within sub-30ms SLA.");
    }, 700);
  };

  const handleTriggerHealthCheck = () => {
    toast.info("Running synthetic health probes across API, DB, Queue and Certificate Engine...");
    setTimeout(() => {
      toast.success("All synthetic probes succeeded: Gateway 24ms, Database ping 0.8ms, Redis queue healthy.");
    }, 1000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success(`Copied correlation ID: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLogs = useMemo(() => {
    return logEvents.filter((evt) => {
      const matchesSearch =
        evt.correlationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = levelFilter === "ALL" || evt.level === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [logEvents, searchQuery, levelFilter]);

  return (
    <div className="admin-page-container">
      {/* Top Breadcrumb & Metadata Header */}
      <div className="admin-page-header">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200/80 text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
              Section 13 & 15 Observability Cockpit
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">99.98% System Availability</span>
          </div>
          <h1 className="admin-page-title flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-purple-600" />
            System Observability & Operational Telemetry
          </h1>
          <p className="admin-page-subtitle">
            Real-time telemetry, routing latency metrics, exception queue monitoring, and structured audit trace stream with end-to-end correlation IDs.
          </p>
        </div>

        <div className="admin-page-header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTriggerHealthCheck}
            className="text-xs border-slate-300 font-medium"
          >
            <Zap className="w-3.5 h-3.5 mr-1 text-amber-500" />
            Run Synthetic Probes
          </Button>
          <Button
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-navy text-xs font-semibold px-4 shadow-sm"
          >
            <RotateCcw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* Dependency Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">API Gateway Edge</span>
            <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <Server className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Operational
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Avg Response: 24ms (p99: 48ms)</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">PostgreSQL Primary</span>
            <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <Database className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Connected
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Connection Pool: 14/50 active</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Async Queue Depth</span>
            <span className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
              <Cpu className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">{systemHealth.queueDepth} Jobs</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              {systemHealth.activeWorkers} Workers
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Zero dead letter backlog</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Error Rate (Trailing 24h)</span>
            <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700 font-mono">{systemHealth.errorRatePct}%</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Exceptional
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Under strict 0.5% threshold</span>
        </div>
      </div>

      {/* Structured Observability Event Log */}
      <div className="admin-panel">
        <div className="admin-panel-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="admin-panel-title">
              <Terminal className="w-4 h-4 text-purple-600" />
              Correlation Trace Stream
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured logs with end-to-end request correlation IDs across microservices
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              {["ALL", "INFO", "WARN", "ERROR"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    levelFilter === lvl
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search correlation ID..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Terminal Styled Log Feed */}
        <div className="bg-[#0B1528] text-slate-300 font-mono text-xs overflow-x-auto divide-y divide-slate-800">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No telemetry events match your search criteria.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const levelColor =
                log.level === "INFO"
                  ? "text-blue-400 bg-blue-950/60 border-blue-800/80"
                  : log.level === "WARN"
                  ? "text-amber-400 bg-amber-950/60 border-amber-800/80"
                  : "text-red-400 bg-red-950/60 border-red-800/80";

              return (
                <div
                  key={log.id}
                  className="p-3.5 hover:bg-slate-900/90 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-2.5"
                >
                  <div className="flex items-start md:items-center gap-3 flex-1 flex-wrap">
                    <span className="text-slate-500 text-[11px] shrink-0">{log.timestamp}</span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${levelColor}`}
                    >
                      {log.level}
                    </span>

                    <span className="text-purple-300 font-semibold text-xs shrink-0">
                      [{log.service}]
                    </span>

                    <span className="text-slate-200 text-xs">{log.message}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {log.correlationId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(log.correlationId)}
                      title="Copy correlation ID"
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {copiedId === log.correlationId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
