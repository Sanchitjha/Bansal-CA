"use client";

import React, { useState, useMemo } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Coins,
  Percent,
  Calculator,
  Layers,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Search,
  Download,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Check,
  Sparkles,
  DollarSign,
  Briefcase
} from "lucide-react";
import { toast } from "sonner";

export default function AdminCommissionRulesPage() {
  const { revenueShareRules, partners, payouts } = useAdmin();

  // Commission Plan parameters
  const [baseRatePct, setBaseRatePct] = useState(10);
  const [fixedBonus, setFixedBonus] = useState(500);
  const [tdsPct, setTdsPct] = useState(10);
  const [slabThreshold, setSlabThreshold] = useState(100000);
  const [slab2RatePct, setSlab2RatePct] = useState(15);
  const [autoApproveTrigger, setAutoApproveTrigger] = useState("PAYMENT_CONFIRMED");

  // Calculator test state
  const [calcRevenue, setCalcRevenue] = useState(150000);
  const [calcAdjustments, setCalcAdjustments] = useState(0);

  // Table search & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Calculate live preview based on Blueprint Section 7 Formula
  const calculateCommission = (rev: number, adj: number) => {
    let slab1Share = 0;
    let slab2Share = 0;

    if (rev <= slabThreshold) {
      slab1Share = (rev * baseRatePct) / 100;
      slab2Share = 0;
    } else {
      slab1Share = (slabThreshold * baseRatePct) / 100;
      slab2Share = ((rev - slabThreshold) * slab2RatePct) / 100;
    }

    const grossShare = slab1Share + slab2Share;
    const withBonus = grossShare + fixedBonus;
    const grossAfterAdj = Math.max(0, withBonus - adj);
    const tdsAmount = (grossAfterAdj * tdsPct) / 100;
    const netPayable = grossAfterAdj - tdsAmount;

    return {
      slab1Share,
      slab2Share,
      grossShare,
      fixedBonus,
      grossTotal: withBonus,
      adj,
      tdsAmount,
      netPayable,
    };
  };

  const calcResult = calculateCommission(calcRevenue, calcAdjustments);

  // Active Commission Transactions with full lifecycle states (Section 7)
  const [transactions, setTransactions] = useState([
    {
      id: "COMM-2026-801",
      caseId: "AA-CASE-1042",
      partnerName: "Zenith Advisors",
      partnerCode: "ZA",
      revenue: 75000,
      rate: "10% Standard",
      bonus: 500,
      gross: 8000,
      tds: 800,
      net: 7200,
      status: "PAID",
      date: "2026-08-15",
    },
    {
      id: "COMM-2026-802",
      caseId: "AA-CASE-1051",
      partnerName: "Zenith Advisors",
      partnerCode: "ZA",
      revenue: 140000,
      rate: "Tiered (10% & 15%)",
      bonus: 500,
      gross: 16500,
      tds: 1650,
      net: 14850,
      status: "APPROVED",
      date: "2026-09-02",
    },
    {
      id: "COMM-2026-803",
      caseId: "AA-CASE-1063",
      partnerName: "Northgate Advisory",
      partnerCode: "NA",
      revenue: 50000,
      rate: "10% Standard",
      bonus: 500,
      gross: 5500,
      tds: 550,
      net: 4950,
      status: "PENDING",
      date: "2026-09-05",
    },
    {
      id: "COMM-2026-804",
      caseId: "AA-CASE-1011",
      partnerName: "Bluepeak Consultants",
      partnerCode: "BC",
      revenue: 30000,
      rate: "10% Standard",
      bonus: 0,
      gross: 3000,
      tds: 300,
      net: 2700,
      status: "DISPUTED",
      date: "2026-08-28",
    },
  ]);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    toast.success(`Transaction ${id} transitioned to ${newStatus}`);
  };

  const handleSaveRules = () => {
    toast.success("Commission plans and tiered slabs successfully saved to ledger config!");
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.partnerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  return (
    <div className="admin-page-container">
      {/* Top Breadcrumb & Metadata Header */}
      <div className="admin-page-header">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Section 7 & 9 Financial Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Statutory Section 194H Compliant</span>
          </div>
          <h1 className="admin-page-title flex items-center gap-2.5">
            <Coins className="w-7 h-7 text-emerald-600" />
            Commission Automation & Tiered Slabs
          </h1>
          <p className="admin-page-subtitle">
            Configure commission formulas, tiered volume slabs, statutory TDS withholding, and audit settlements.
          </p>
        </div>

        <div className="admin-page-header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCalcRevenue(150000);
              toast.info("Reset simulator to ₹1,50,000 baseline");
            }}
            className="text-xs border-slate-300"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Reset Defaults
          </Button>
          <Button
            onClick={handleSaveRules}
            className="btn-navy text-xs font-semibold px-4 shadow-sm"
          >
            <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            Save Commission Rules
          </Button>
        </div>
      </div>

      {/* Top Financial KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Accrued Share</span>
            <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <Coins className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">₹33,000</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              +14.2% MoM
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Across 4 referral partners</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Settleable Net Payout</span>
            <span className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">₹29,700</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              Net of TDS
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Post ₹3,300 statutory withholding</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Statutory TDS (Sec 194H)</span>
            <span className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">10.0%</span>
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              Mandatory
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Govt remittance due by 7th monthly</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tier 2 Accelerated Threshold</span>
            <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">₹1,00,000</span>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              {slab2RatePct}% Boost
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Accelerates after ₹1.00L rev</span>
        </div>
      </div>

      {/* Grid: Formula Architecture & High-End Financial Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Config Panel */}
        <div className="lg:col-span-7">
          <div className="admin-panel h-full flex flex-col justify-between">
            <div className="admin-panel-header">
              <div>
                <h2 className="admin-panel-title">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Commission Formula Architecture
                </h2>
                <span className="text-xs text-slate-400 block mt-0.5">
                  Automated computation formula & statutory volume triggers
                </span>
              </div>
              <div className="bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-mono font-semibold px-2.5 py-1 rounded-md">
                Gross = (Rev × Rate) + Bonus − Adj
              </div>
            </div>

            <div className="admin-panel-body space-y-5 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Base Commission Rate */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">
                      Base Commission Rate (%)
                    </label>
                    <span className="text-[11px] font-mono text-emerald-600 font-bold">{baseRatePct}%</span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={baseRatePct}
                      onChange={(e) => setBaseRatePct(Number(e.target.value))}
                      className="pl-8 text-xs font-medium"
                      min="1"
                      max="50"
                    />
                    <Percent className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                  <span className="text-[10px] text-slate-500">Standard Tier 1 rate applied to baseline volume</span>
                </div>

                {/* Fixed Acquisition Bonus */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">
                      Fixed Acquisition Bonus (₹)
                    </label>
                    <span className="text-[11px] font-mono text-emerald-600 font-bold">₹{fixedBonus}</span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={fixedBonus}
                      onChange={(e) => setFixedBonus(Number(e.target.value))}
                      className="pl-8 text-xs font-medium"
                      min="0"
                      step="100"
                    />
                    <span className="text-xs font-bold text-slate-400 absolute left-3 top-2.5">₹</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Credited per successfully closed referral case</span>
                </div>

                {/* Tiered Slab Threshold */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">
                      Tier 1 Volume Cap / Threshold (₹)
                    </label>
                    <span className="text-[11px] font-mono text-blue-600 font-bold">₹{slabThreshold.toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={slabThreshold}
                      onChange={(e) => setSlabThreshold(Number(e.target.value))}
                      className="pl-8 text-xs font-medium"
                      step="10000"
                    />
                    <span className="text-xs font-bold text-slate-400 absolute left-3 top-2.5">₹</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Revenue limit for Tier 1 base rate</span>
                </div>

                {/* Tier 2 Accelerated Rate */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">
                      Tier 2 Accelerated Rate (%)
                    </label>
                    <span className="text-[11px] font-mono text-indigo-600 font-bold">{slab2RatePct}%</span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={slab2RatePct}
                      onChange={(e) => setSlab2RatePct(Number(e.target.value))}
                      className="pl-8 text-xs font-medium"
                      min="1"
                      max="70"
                    />
                    <Percent className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                  <span className="text-[10px] text-slate-500">Applies to incremental revenue &gt; threshold</span>
                </div>
              </div>

              {/* Tier Progress Visualizer */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Tier Slabs Architecture</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Tier 1: <strong>{baseRatePct}%</strong> ≤ ₹{slabThreshold.toLocaleString()} | Tier 2: <strong>{slab2RatePct}%</strong> &gt; ₹{slabThreshold.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 flex overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full text-[9px] text-white flex items-center justify-center font-bold"
                    style={{ width: "66%" }}
                  >
                    Tier 1: {baseRatePct}%
                  </div>
                  <div
                    className="bg-indigo-600 h-full text-[9px] text-white flex items-center justify-center font-bold"
                    style={{ width: "34%" }}
                  >
                    Tier 2: {slab2RatePct}% Accelerated
                  </div>
                </div>
              </div>

              {/* Statutory TDS & Governance Triggers */}
              <div className="border-t border-slate-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">
                      Statutory TDS Withholding (%)
                    </label>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                      Sec 194H
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={tdsPct}
                      onChange={(e) => setTdsPct(Number(e.target.value))}
                      className="pl-8 text-xs font-medium"
                    />
                    <Percent className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                  <span className="text-[10px] text-slate-500">Government TDS deduction on commission income</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Commission Trigger Event
                  </label>
                  <select
                    value={autoApproveTrigger}
                    onChange={(e) => setAutoApproveTrigger(e.target.value)}
                    className="w-full h-10 px-3 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B1528]/15"
                  >
                    <option value="PAYMENT_CONFIRMED">Client Payment Confirmed (Recommended)</option>
                    <option value="CASE_COMPLETED">Case Completed & Verified</option>
                    <option value="MANUAL_APPROVAL">Manual CA Admin Sign-Off Required</option>
                  </select>
                  <span className="text-[10px] text-slate-500">Lifecycle state transition from PENDING to APPROVED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Formula Preview Simulator */}
        <div className="lg:col-span-5">
          <div
            className="rounded-2xl p-6 text-white h-full flex flex-col justify-between relative overflow-hidden shadow-lg"
            style={{
              background: "linear-gradient(145deg, #0B1528 0%, #111F38 50%, #0B1528 100%)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-400/10 rounded-lg text-amber-400 border border-amber-400/20">
                    <Calculator className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                      Live Commission Simulator
                    </h2>
                    <span className="text-[11px] text-slate-400">Sandbox formula validator</span>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Real-Time
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="mb-4">
                <span className="text-[11px] text-slate-400 block mb-1.5">Quick Revenue Presets:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[50000, 100000, 150000, 250000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCalcRevenue(preset)}
                      className={`text-[11px] py-1 px-1.5 rounded-md font-mono border transition-all ${
                        calcRevenue === preset
                          ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold"
                          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      ₹{(preset / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Inputs */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-slate-300 text-xs font-medium block mb-1">Test Revenue (₹)</label>
                  <input
                    type="number"
                    value={calcRevenue}
                    onChange={(e) => setCalcRevenue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                    step="5000"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-xs font-medium block mb-1">Discounts / Adj (₹)</label>
                  <input
                    type="number"
                    value={calcAdjustments}
                    onChange={(e) => setCalcAdjustments(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                    step="500"
                  />
                </div>
              </div>

              {/* Step by Step Breakdown */}
              <div className="bg-slate-900/70 border border-white/10 rounded-xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Tier 1 Base Share ({baseRatePct}% on ₹{Math.min(calcRevenue, slabThreshold).toLocaleString()}):
                  </span>
                  <span className="font-mono font-semibold text-white">₹{calcResult.slab1Share.toLocaleString()}</span>
                </div>

                {calcRevenue > slabThreshold && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                      Tier 2 Accelerated ({slab2RatePct}% on ₹{(calcRevenue - slabThreshold).toLocaleString()}):
                    </span>
                    <span className="font-mono font-semibold text-indigo-300">+₹{calcResult.slab2Share.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Fixed Partner Acquisition Bonus:
                  </span>
                  <span className="font-mono font-semibold text-amber-300">+₹{calcResult.fixedBonus.toLocaleString()}</span>
                </div>

                <div className="border-t border-white/10 pt-2 flex justify-between items-center text-slate-300">
                  <span>Gross Share Component:</span>
                  <span className="font-mono font-semibold text-white">₹{calcResult.grossTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-red-300">
                  <span>Statutory TDS Withholding ({tdsPct}% Sec 194H):</span>
                  <span className="font-mono font-semibold">-₹{calcResult.tdsAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Net Payout Hero Display */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900/80 border border-emerald-500/40 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase block">
                    Net Partner Payout
                  </span>
                  <span className="text-2xl font-black text-emerald-300 font-mono">
                    ₹{calcResult.netPayable.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-200 bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    <Check className="w-3 h-3 text-emerald-400" />
                    Verified Formula
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Immutable Commission Transactions Ledger */}
      <div className="admin-panel">
        <div className="admin-panel-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="admin-panel-title">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Immutable Commission Transactions Ledger
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete lifecycle tracking: PENDING → APPROVED → PAYABLE → PAID (with DISPUTED handling)
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search partner, case..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
              />
            </div>

            {/* Export CSV */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Commission ledger exported to CSV successfully.")}
              className="text-xs shrink-0"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Filter Status Tabs */}
        <div className="px-6 py-2.5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Filter:</span>
          {["ALL", "PENDING", "APPROVED", "PAID", "DISPUTED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                statusFilter === st
                  ? "bg-[#0B1528] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              {st === "ALL" ? `All (${transactions.length})` : st}
            </button>
          ))}
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-5">Transaction ID</th>
                <th className="py-3 px-4">Case Reference</th>
                <th className="py-3 px-4">Partner</th>
                <th className="py-3 px-4 text-right">Case Revenue</th>
                <th className="py-3 px-4">Rule Applied</th>
                <th className="py-3 px-4 text-right">Gross Share</th>
                <th className="py-3 px-4 text-right">TDS (10%)</th>
                <th className="py-3 px-4 text-right">Net Payout</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No transactions match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const badgeStyle =
                    tx.status === "PAID"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                      : tx.status === "APPROVED"
                      ? "bg-blue-50 text-blue-700 border-blue-200/80"
                      : tx.status === "DISPUTED"
                      ? "bg-red-50 text-red-700 border-red-200/80"
                      : "bg-amber-50 text-amber-700 border-amber-200/80";

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5 font-mono text-[11px] font-medium text-slate-700">
                        {tx.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <span className="inline-flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                          {tx.caseId}
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                            {tx.partnerCode}
                          </span>
                          <span className="font-medium text-slate-800">{tx.partnerName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-800">
                        ₹{tx.revenue.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200/60">
                          {tx.rate}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-800">
                        ₹{tx.gross.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-red-600 font-medium">
                        -₹{tx.tds.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 text-sm">
                        ₹{tx.net.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeStyle}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              tx.status === "PAID"
                                ? "bg-emerald-500"
                                : tx.status === "APPROVED"
                                ? "bg-blue-500"
                                : tx.status === "DISPUTED"
                                ? "bg-red-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {tx.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(tx.id, "APPROVED")}
                            className="btn-xs bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm transition-all inline-flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Approve
                          </button>
                        )}
                        {tx.status === "APPROVED" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(tx.id, "PAID")}
                            className="btn-xs bg-emerald-600 text-white hover:bg-emerald-700 font-medium shadow-sm transition-all inline-flex items-center gap-1"
                          >
                            <Coins className="w-3 h-3" />
                            Settle Payout
                          </button>
                        )}
                        {tx.status === "DISPUTED" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(tx.id, "APPROVED")}
                            className="btn-xs bg-amber-600 text-white hover:bg-amber-700 font-medium shadow-sm transition-all inline-flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Resolve Dispute
                          </button>
                        )}
                        {tx.status === "PAID" && (
                          <span className="text-[11px] text-slate-400 font-medium">Settled</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
