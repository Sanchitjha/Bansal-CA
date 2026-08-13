"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { BarChart, DonutChart, TrendChart } from "@/components/admin/ui";
import { FileDown, Printer, Filter, Calendar } from "lucide-react";

export default function ReportsPage() {
  const {
    leads,
    cases,
    payments,
    partners,
    services,
    logAction,
  } = useAdmin();

  // Filter States
  const [selectedReport, setSelectedReport] = useState("revenue");
  const [serviceFilter, setServiceFilter] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("");
  const [dateRange, setDateRange] = useState("all");

  // Handlers
  const handleExport = (format: "PDF" | "Excel") => {
    logAction(`Exported ${selectedReport.toUpperCase()} report in ${format} format`, "Report", selectedReport);
    alert(`Exporting ${selectedReport.toUpperCase()} report as ${format}...`);
  };

  // Filter lists
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesSrv = !serviceFilter || c.serviceId === serviceFilter;
      const matchesPart = !partnerFilter || c.partnerId === partnerFilter;
      return matchesSrv && matchesPart;
    });
  }, [cases, serviceFilter, partnerFilter]);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesPart = !partnerFilter || p.clientId === partnerFilter; // approximation
      return matchesPart;
    });
  }, [payments, partnerFilter]);

  // SLA Performance Calculation
  const slaStats = useMemo(() => {
    const total = filteredCases.length;
    const met = filteredCases.filter((c) => c.status === "Completed" || c.status === "Closed").length; // approximation
    const breached = filteredCases.filter((c) => c.priority === "High" && c.status !== "Completed" && c.status !== "Closed").length;
    const rate = total > 0 ? Math.round(((total - breached) / total) * 100) : 100;

    return {
      total,
      met: total - breached,
      breached,
      rate,
      chartData: [
        { label: "Met SLA Target", value: total - breached, color: "var(--color-success)" },
        { label: "SLA Breached / Overdue", value: breached, color: "var(--color-error)" },
      ].filter((d) => d.value > 0),
    };
  }, [filteredCases]);

  // Lead Conversion Stats
  const leadStats = useMemo(() => {
    const total = leads.length;
    const converted = leads.filter((l) => l.status === "Converted").length;
    const rate = total > 0 ? Math.round((converted / total) * 100) : 0;

    const sourceCounts: Record<string, number> = {};
    leads.forEach((l) => {
      sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
    });

    const sourceData = Object.entries(sourceCounts).map(([label, value]) => ({
      label,
      value,
      color: "var(--color-navy)",
    }));

    return {
      total,
      converted,
      rate,
      sourceData,
    };
  }, [leads]);

  // Revenue Sharing & Payout Performance
  const revenueStats = useMemo(() => {
    const totalPaid = payments
      .filter((p) => p.status === "Paid")
      .reduce((sum, p) => sum + p.amount, 0);

    const partnerSummary = partners.map((p) => {
      // Find referred clients and cases
      const pClients = clientsCountForPartner(p.id);
      const pCases = cases.filter((c) => c.partnerId === p.id);
      const grossVal = pCases.reduce((s, c) => s + c.amount, 0);
      const commission = Math.round(grossVal * (p.revenueSharePct / 100));

      return {
        label: p.name,
        value: commission,
        color: "var(--color-orange)",
      };
    });

    return {
      totalPaid,
      partnerSummary: partnerSummary.filter((p) => p.value > 0),
    };
  }, [payments, partners, cases]);

  // Helper
  function clientsCountForPartner(partnerId: string) {
    return leads.filter((l) => l.partnerId === partnerId && l.status === "Converted").length;
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Reports &amp; Analytics</h1>
          <p className="admin-page-subtitle">Generate business intelligence reports, track SLA metrics, and analyze channel partner productivity.</p>
        </div>
        <div className="admin-page-header-actions" style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" className="btn btn-secondary" onClick={() => handleExport("PDF")}>
            <Printer size={15} style={{ marginRight: "0.35rem" }} /> Export PDF
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => handleExport("Excel")}>
            <FileDown size={15} style={{ marginRight: "0.35rem" }} /> Export Excel
          </button>
        </div>
      </div>

      {/* Report filters */}
      <div className="filter-bar" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <div className="filter-group">
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Filter size={14} style={{ color: "var(--color-text-secondary)" }} />
            <select value={selectedReport} onChange={(e) => setSelectedReport(e.target.value)}>
              <option value="revenue">Revenue &amp; Payouts Report</option>
              <option value="cases">Case Lifecycle Report</option>
              <option value="leads">Leads Conversion Report</option>
              <option value="sla">SLA Performance Report</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Calendar size={14} style={{ color: "var(--color-text-secondary)" }} />
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="all">All-time Range</option>
              <option value="this-month">This Month</option>
              <option value="last-quarter">Last Quarter</option>
              <option value="this-year">FY 2026-27</option>
            </select>
          </div>

          <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
            <option value="">All Services</option>
            {services.map((srv) => (
              <option key={srv.id} value={srv.id}>
                {srv.name}
              </option>
            ))}
          </select>

          <select value={partnerFilter} onChange={(e) => setPartnerFilter(e.target.value)}>
            <option value="">All Partners</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Report Dashboards */}
      <div style={{ marginTop: "1.5rem" }}>
        {selectedReport === "revenue" && (
          <div className="admin-grid-2">
            <div className="admin-panel" style={{ padding: "1.5rem" }}>
              <div className="admin-panel-header">
                <h3 className="admin-panel-title">Total Payments Collected</h3>
                <span className="empty-state" style={{ fontSize: "0.75rem" }}>Paid Transactions</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", padding: "1rem 0" }}>
                <span style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-navy)" }}>
                  ${revenueStats.totalPaid}
                </span>
                <span style={{ fontSize: "0.875rem", color: "var(--color-success)" }}>↑ 18% vs last month</span>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                Represents settled invoices and manual banking credits across direct clients and referred business channels.
              </p>
            </div>

            <div className="admin-panel" style={{ padding: "1.5rem" }}>
              <div className="admin-panel-header">
                <h3 className="admin-panel-title">Partner Commissions Earned</h3>
                <span className="empty-state" style={{ fontSize: "0.75rem" }}>By Channel Partner</span>
              </div>
              <div style={{ padding: "1rem 0" }}>
                {revenueStats.partnerSummary.length > 0 ? (
                  <BarChart data={revenueStats.partnerSummary} color="var(--color-orange)" />
                ) : (
                  <p className="empty-state" style={{ textAlign: "center", padding: "2rem" }}>
                    No commissions registered for the selected partner/service filters.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedReport === "cases" && (
          <div className="admin-grid-2">
            <div className="admin-panel" style={{ padding: "1.5rem" }}>
              <h3 className="admin-panel-title">Case Operational Volume</h3>
              <div style={{ padding: "1rem 0" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.875rem" }}>
                  <div className="admin-action-item" style={{ padding: "0.75rem 1rem" }}>
                    <span>Total Cases Processed</span>
                    <span style={{ fontWeight: 700, fontSize: "1.125rem" }}>{filteredCases.length}</span>
                  </div>
                  <div className="admin-action-item" style={{ padding: "0.75rem 1rem" }}>
                    <span>Completed / Settled Cases</span>
                    <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--color-success)" }}>
                      {filteredCases.filter((c) => c.status === "Completed" || c.status === "Closed").length}
                    </span>
                  </div>
                  <div className="admin-action-item" style={{ padding: "0.75rem 1rem" }}>
                    <span>Awaiting Client Action (Docs/Funds)</span>
                    <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--color-orange)" }}>
                      {
                        filteredCases.filter((c) =>
                          ["Documents Pending", "Payment Pending", "Waiting for Client"].includes(c.status)
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-panel" style={{ padding: "1.5rem" }}>
              <h3 className="admin-panel-title">Filing SLA Turnaround targets</h3>
              <p className="admin-page-subtitle">Breached case counts by active operational filters.</p>
              <div style={{ padding: "1rem 0", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem" }}>
                <div className="admin-action-item" style={{ borderColor: "var(--color-error)" }}>
                  <span style={{ color: "var(--color-error)", fontWeight: 600 }}>High Priority SLA Warnings</span>
                  <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--color-error)" }}>
                    {filteredCases.filter((c) => c.priority === "High" && c.status !== "Closed" && c.status !== "Completed").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === "leads" && (
          <div className="admin-grid-2">
            <div className="admin-panel" style={{ padding: "1.5rem" }}>
              <h3 className="admin-panel-title">Conversion Performance</h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", padding: "1rem 0" }}>
                <span style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-navy)" }}>
                  {leadStats.rate}%
                </span>
                <span style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>Lead conversion rate</span>
              </div>
              <div style={{ fontSize: "0.875rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>Total Leads Submitted: <strong>{leadStats.total}</strong></div>
                <div>Converted Clients onboarded: <strong className="text-green">{leadStats.converted}</strong></div>
              </div>
            </div>

            <div className="admin-panel" style={{ padding: "1.5rem" }}>
              <h3 className="admin-panel-title">Lead Acquisition Sources</h3>
              <div style={{ padding: "1rem 0" }}>
                <BarChart data={leadStats.sourceData} color="var(--color-navy)" />
              </div>
            </div>
          </div>
        )}

        {selectedReport === "sla" && (
          <div className="admin-grid-2">
            <div className="admin-panel" style={{ padding: "1.5rem" }}>
              <h3 className="admin-panel-title">SLA Achievement Rate</h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", padding: "1rem 0" }}>
                <span style={{ fontSize: "2.25rem", fontWeight: 700, color: "var(--color-success)" }}>
                  {slaStats.rate}%
                </span>
                <span style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>Compliance Target Met</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8125rem", borderTop: "1px solid var(--color-border)", paddingTop: "1rem", marginTop: "1rem" }}>
                <div>Total cases audited: <strong>{slaStats.total}</strong></div>
                <div>Met turnaround: <strong className="text-green">{slaStats.met}</strong></div>
                <div>Breached / Late: <strong className="text-red">{slaStats.breached}</strong></div>
              </div>
            </div>

            <div className="admin-panel" style={{ padding: "1.5rem" }}>
              <h3 className="admin-panel-title">SLA Compliance Breakdown</h3>
              <div style={{ padding: "1rem 0" }}>
                {slaStats.total > 0 ? (
                  <DonutChart data={slaStats.chartData} />
                ) : (
                  <p className="empty-state" style={{ textAlign: "center", padding: "2rem" }}>
                    No data to display.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
