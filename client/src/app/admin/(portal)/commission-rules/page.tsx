"use client";

import React, { useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Coins,
  Percent,
  Calculator,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  FileSpreadsheet,
  ArrowRight
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

  // Calculate live preview based on Blueprint Section 7 Formula
  const calculateCommission = (rev: number, adj: number) => {
    let grossShare = 0;
    if (rev <= slabThreshold) {
      grossShare = (rev * baseRatePct) / 100;
    } else {
      const slab1 = (slabThreshold * baseRatePct) / 100;
      const slab2 = ((rev - slabThreshold) * slab2RatePct) / 100;
      grossShare = slab1 + slab2;
    }
    const withBonus = grossShare + fixedBonus;
    const grossAfterAdj = Math.max(0, withBonus - adj);
    const tdsAmount = (grossAfterAdj * tdsPct) / 100;
    const netPayable = grossAfterAdj - tdsAmount;

    return {
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
      revenue: 75000,
      rate: "10%",
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
      revenue: 50000,
      rate: "10%",
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
      revenue: 30000,
      rate: "10%",
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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Section 7 & 9 Financial Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Coins className="w-6 h-6 text-emerald-600" />
            Commission Automation & Tiered Slabs
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure commission formulas, tiered volume slabs, statutory TDS withholding, and audit settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSaveRules} className="bg-[#0B1528] hover:bg-[#1e293b] text-xs">
            Save Commission Rules
          </Button>
        </div>
      </div>

      {/* Grid: Formula Config & Interactive Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Config Panel */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border border-slate-200 shadow-sm bg-white">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Commission Formula Architecture
              </h2>
              <code className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                Rev × Rate + Bonus − Adj
              </code>
            </div>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Base Commission Rate (%)</label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={baseRatePct}
                      onChange={(e) => setBaseRatePct(Number(e.target.value))}
                      className="h-9 text-xs pl-8"
                    />
                    <Percent className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                  <span className="text-[10px] text-slate-400">Default rate on standard revenue</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Fixed Acquisition Bonus (₹)</label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={fixedBonus}
                      onChange={(e) => setFixedBonus(Number(e.target.value))}
                      className="h-9 text-xs pl-8"
                    />
                    <Coins className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                  <span className="text-[10px] text-slate-400">Credited per successfully closed referral</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Tiered Slab Threshold (₹)</label>
                  <Input
                    type="number"
                    value={slabThreshold}
                    onChange={(e) => setSlabThreshold(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                  <span className="text-[10px] text-slate-400">Revenue limit for Tier 1 base rate</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Tier 2 Accelerated Rate (%)</label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={slab2RatePct}
                      onChange={(e) => setSlab2RatePct(Number(e.target.value))}
                      className="h-9 text-xs pl-8"
                    />
                    <Percent className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                  <span className="text-[10px] text-slate-400">Applies to incremental revenue &gt; slab</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Statutory TDS Withholding (%)</label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={tdsPct}
                      onChange={(e) => setTdsPct(Number(e.target.value))}
                      className="h-9 text-xs pl-8"
                    />
                    <Percent className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                  <span className="text-[10px] text-slate-400">Section 194H Brokerage/Commission TDS</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Commission Trigger Event</label>
                  <select
                    value={autoApproveTrigger}
                    onChange={(e) => setAutoApproveTrigger(e.target.value)}
                    className="w-full h-9 px-3 text-xs border border-slate-200 rounded-md bg-white"
                  >
                    <option value="PAYMENT_CONFIRMED">Client Payment Confirmed</option>
                    <option value="CASE_COMPLETED">Case Completed & Verified</option>
                    <option value="MANUAL_APPROVAL">Manual Admin Approval Required</option>
                  </select>
                  <span className="text-[10px] text-slate-400">Event that transitions status to APPROVED</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Formula Preview Calculator */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border border-slate-200 shadow-sm bg-slate-900 text-white overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-amber-400" />
                Live Commission Simulation
              </h2>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                Formula Validator
              </span>
            </div>

            <CardContent className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-[11px]">Test Revenue (₹)</label>
                  <input
                    type="number"
                    value={calcRevenue}
                    onChange={(e) => setCalcRevenue(Number(e.target.value))}
                    className="w-full mt-1 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px]">Adjustments (₹)</label>
                  <input
                    type="number"
                    value={calcAdjustments}
                    onChange={(e) => setCalcAdjustments(Number(e.target.value))}
                    className="w-full mt-1 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-xs"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-lg space-y-2 border border-slate-700">
                <div className="flex justify-between text-slate-300">
                  <span>Gross Commission Share:</span>
                  <span className="font-mono">₹{calcResult.grossShare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Fixed Bonus Component:</span>
                  <span className="font-mono">+₹{calcResult.fixedBonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-300">
                  <span>TDS Withholding ({tdsPct}%):</span>
                  <span className="font-mono">-₹{calcResult.tdsAmount.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-700 pt-2 flex justify-between text-emerald-400 font-bold text-sm">
                  <span>Net Partner Payout:</span>
                  <span className="font-mono">₹{calcResult.netPayable.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                *Uses <strong>{baseRatePct}%</strong> on the first ₹{slabThreshold.toLocaleString()}, and{" "}
                <strong>{slab2RatePct}%</strong> on the incremental ₹{(calcRevenue > slabThreshold ? calcRevenue - slabThreshold : 0).toLocaleString()}.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Commission Ledger Transactions Table */}
      <Card className="border border-slate-200 shadow-sm bg-white">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Immutable Commission Transactions Ledger</h2>
            <p className="text-xs text-slate-500">
              Complete lifecycle tracking: PENDING → APPROVED → PAYABLE → PAID (with DISPUTED/REVERSED handling)
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">Financial Core</span>
        </div>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-4">Transaction ID</th>
                <th className="py-2.5 px-4">Case ID</th>
                <th className="py-2.5 px-4">Partner</th>
                <th className="py-2.5 px-4">Revenue</th>
                <th className="py-2.5 px-4">Rule Used</th>
                <th className="py-2.5 px-4">Gross Share</th>
                <th className="py-2.5 px-4">TDS (10%)</th>
                <th className="py-2.5 px-4">Net Payout</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => {
                const badgeColor =
                  tx.status === "PAID"
                    ? "bg-emerald-100 text-emerald-800"
                    : tx.status === "APPROVED"
                    ? "bg-blue-100 text-blue-800"
                    : tx.status === "DISPUTED"
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800";

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{tx.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{tx.caseId}</td>
                    <td className="py-3 px-4 text-slate-700">{tx.partnerName}</td>
                    <td className="py-3 px-4 font-mono">₹{tx.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{tx.rate}</td>
                    <td className="py-3 px-4 font-mono">₹{tx.gross.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-red-600">-₹{tx.tds.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">₹{tx.net.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeColor}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      {tx.status === "PENDING" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(tx.id, "APPROVED")}
                          className="h-6 text-[10px] text-blue-600 border-blue-200"
                        >
                          Approve
                        </Button>
                      )}
                      {tx.status === "APPROVED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(tx.id, "PAID")}
                          className="h-6 text-[10px] text-emerald-600 border-emerald-200"
                        >
                          Settle Payout
                        </Button>
                      )}
                      {tx.status === "DISPUTED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(tx.id, "APPROVED")}
                          className="h-6 text-[10px] text-amber-600 border-amber-200"
                        >
                          Resolve Dispute
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
