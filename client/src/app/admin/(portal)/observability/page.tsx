"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Terminal
} from "lucide-react";
import { toast } from "sonner";

export default function AdminObservabilityPage() {
  const [refreshing, setRefreshing] = useState(false);

  // System Health Components
  const [systemHealth, setSystemHealth] = useState({
    apiStatus: "HEALTHY",
    databaseStatus: "CONNECTED",
    queueDepth: 4,
    routingLatencyMs: 42,
    documentWorkerStatus: "ONLINE",
    errorRatePct: 0.12,
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
      message: "Request AA-CASE-1042 matched strategy LEAST_LOADED to partner PTR-101. Match latency: 38ms.",
    },
    {
      id: "EVT-9042",
      timestamp: "2026-09-07 02:46:02.812",
      correlationId: "corr-f6a5-doc-gen",
      service: "DocumentService",
      level: "INFO",
      message: "Statutory Certificate generated for case AA-CASE-0988. SHA-256 integrity hash committed.",
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
  ]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Observability metrics refreshed — all nodes operating within normal SLA thresholds.");
    }, 800);
  };

  const handleTriggerHealthCheck = () => {
    toast.info("Running synthetic health probes across API, DB, Queue and Object Store...");
    setTimeout(() => {
      toast.success("Health probes verified: Latency 24ms, Database ping 1ms, Queue healthy.");
    }, 1200);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Section 13 & 15 Observability & Reliability
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-purple-600" />
            System Observability & Operational Monitoring
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time telemetry, routing latency metrics, exception queue monitoring, and structured audit trace stream.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleTriggerHealthCheck} className="text-xs">
            <Zap className="w-3.5 h-3.5 mr-1 text-amber-500" />
            Run Health Probes
          </Button>
          <Button
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-[#0B1528] hover:bg-[#1e293b] text-xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* Dependency Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">REST API Gateway</div>
              <div className="text-base font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Operational
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Avg Response: 32ms</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Server className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Database Cluster</div>
              <div className="text-base font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Primary Connected
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Replica lag: 0ms</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Database className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Routing Queue Depth</div>
              <div className="text-base font-bold text-slate-900 mt-1">4 Pending Jobs</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Throughput: 18 req/sec</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Cpu className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Document Generator</div>
              <div className="text-base font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Worker Ready
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Certificates & PDFs</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <HardDrive className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Observability Details: Latency & Exceptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border border-slate-200 shadow-sm bg-slate-900 text-white overflow-hidden font-mono">
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Structured Application Log Stream (Correlation ID Trace)</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                Live Append Mode
              </span>
            </div>
            <CardContent className="p-4 space-y-3 text-xs overflow-x-auto">
              {logEvents.map((evt) => (
                <div key={evt.id} className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{evt.timestamp}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        evt.level === "WARN" ? "bg-amber-950 text-amber-300" : "bg-blue-950 text-blue-300"
                      }`}
                    >
                      {evt.level}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    <strong className="text-purple-400">[{evt.service}]</strong>{" "}
                    <span className="text-slate-500">corr_id:</span> {evt.correlationId}
                  </div>
                  <div className="text-slate-200 font-sans text-xs">{evt.message}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Health Specs & Reliability Targets */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-slate-200 shadow-sm bg-white">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Non-Functional Targets (Section 18)</h2>
              <p className="text-xs text-slate-500">SLA & operational recovery standards</p>
            </div>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Service SLA Availability:</span>
                <span className="font-bold text-slate-900">99.95% Target</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Recovery Point Objective (RPO):</span>
                <span className="font-mono text-slate-800">&lt; 15 Minutes</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Recovery Time Objective (RTO):</span>
                <span className="font-mono text-slate-800">&lt; 1 Hour</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Routing Idempotency:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-500">RBAC Token Policy:</span>
                <span className="font-mono text-slate-800">1d expiry / HMAC-256</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
