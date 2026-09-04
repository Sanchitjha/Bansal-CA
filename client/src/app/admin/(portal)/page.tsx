"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  UserPlus,
  FolderOpen,
  CreditCard,
  TrendingUp,
  Handshake,
  AlertCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useAdmin } from "@/components/admin/AdminProvider";
import {
  KpiCard,
  DonutChart,
  BarChart,
  TrendChart,
  AdminTable,
  AdminTableColumn,
} from "@/components/admin/ui";
import { AdminCase } from "@/data/admin";

export default function AdminDashboard() {
  const router = useRouter();
  const {
    profile,
    leads,
    cases,
    documents,
    payments,
    payouts,
    disputes,
    partners,
  } = useAdmin();

  // Dynamic KPI Counts
  const newLeadsCount = useMemo(() => {
    return leads.filter((l) => l.status === "New").length;
  }, [leads]);

  const activeCasesCount = useMemo(() => {
    const activeStatuses = [
      "New",
      "Payment Pending",
      "Documents Pending",
      "In Progress",
      "Waiting for Client",
      "Review",
    ];
    return cases.filter((c) => activeStatuses.includes(c.status)).length;
  }, [cases]);

  const pendingDocsCount = useMemo(() => {
    // Both case documents and partner KYC documents awaiting review
    const caseDocsPending = documents.filter((d) => d.status === "Under Review").length;
    const partnerDocsPending = partners.reduce(
      (acc, p) => acc + p.kycDocuments.filter((d) => d.status === "Under Review").length,
      0
    );
    return caseDocsPending + partnerDocsPending;
  }, [documents, partners]);

  const pendingPaymentsCount = useMemo(() => {
    return payments.filter(
      (p) => p.status === "Manual Verification" || p.status === "Pending"
    ).length;
  }, [payments]);

  const revenueThisMonth = useMemo(() => {
    // Sum of paid amounts in August 2026 (based on mock data month)
    const augPaid = payments
      .filter(
        (p) =>
          p.status === "Paid" &&
          p.date.startsWith("2026-08")
      )
      .reduce((sum, p) => sum + p.amount, 0);
    return augPaid;
  }, [payments]);

  const pendingPayoutsCount = useMemo(() => {
    return payouts.filter((p) => p.status === "Pending" || p.status === "Scheduled").length;
  }, [payouts]);

  const slaApproachingCount = useMemo(() => {
    // Approximate case SLA warning (high priority or close due date in August)
    return cases.filter(
      (c) =>
        c.priority === "High" &&
        ["In Progress", "Documents Pending", "Review"].includes(c.status)
    ).length;
  }, [cases]);

  const openDisputesCount = useMemo(() => {
    return disputes.filter((d) => d.status === "Open").length;
  }, [disputes]);

  // Donut Chart Data — Case Statuses
  const caseStatusData = useMemo(() => {
    const counts: Record<string, number> = {
      "New": 0,
      "In Progress": 0,
      "Waiting for Client": 0,
      "Review": 0,
      "Completed": 0,
      "Closed": 0,
    };
    cases.forEach((c) => {
      if (c.status in counts) {
        counts[c.status]++;
      }
    });
    return [
      { label: "New", value: counts["New"], color: "#7F8C8D" },
      { label: "In Progress", value: counts["In Progress"], color: "var(--color-navy)" },
      { label: "Waiting for Client", value: counts["Waiting for Client"], color: "#F39C12" },
      { label: "Review", value: counts["Review"], color: "#9B59B6" },
      { label: "Completed", value: counts["Completed"], color: "var(--color-success)" },
      { label: "Closed", value: counts["Closed"], color: "#34495E" },
    ].filter((slice) => slice.value > 0);
  }, [cases]);

  // Bar Chart Data — Lead Pipeline Stages
  const leadPipelineData = useMemo(() => {
    const counts: Record<string, number> = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Converted: 0,
      Lost: 0,
    };
    leads.forEach((l) => {
      if (l.status in counts) {
        counts[l.status]++;
      }
    });
    return [
      { label: "New", value: counts.New, color: "var(--color-navy)" },
      { label: "Contacted", value: counts.Contacted, color: "#3498DB" },
      { label: "Qualified", value: counts.Qualified, color: "#9B59B6" },
      { label: "Converted", value: counts.Converted, color: "var(--color-success)" },
      { label: "Lost", value: counts.Lost, color: "var(--color-error)" },
    ];
  }, [leads]);

  // Revenue Overview Chart Data (Sorted by Month)
  const revenueChartData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sums: Record<number, number> = {};

    payments.forEach((p) => {
      if (p.status === "Paid" || p.status === "Partially Refunded") {
        const date = new Date(p.date);
        const m = date.getMonth();
        const amt = p.status === "Partially Refunded" ? p.amount - (p.refundAmount || 0) : p.amount;
        sums[m] = (sums[m] || 0) + amt;
      }
    });

    // Populate all months up to August (since mock data goes to Aug)
    const result = [];
    for (let i = 2; i <= 7; i++) { // show Mar - Aug (when we have data)
      result.push({
        label: monthNames[i],
        value: sums[i] || 0,
      });
    }
    return result;
  }, [payments]);

  // Recent Cases
  const recentCases = useMemo(() => {
    return [...cases]
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      .slice(0, 5);
  }, [cases]);

  const recentCasesColumns: AdminTableColumn<AdminCase>[] = [
    {
      key: "id",
      header: "Case ID",
      render: (row) => (
        <Link href={`/admin/cases/${row.id}`} className="admin-table-link">
          {row.id}
        </Link>
      ),
      sortValue: (row) => row.id,
      csvValue: (row) => row.id,
    },
    {
      key: "clientName",
      header: "Client",
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.clientName}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>{row.clientId}</div>
        </div>
      ),
      sortValue: (row) => row.clientName,
      csvValue: (row) => row.clientName,
    },
    {
      key: "serviceName",
      header: "Service",
      render: (row) => <span className="text-truncate">{row.serviceName}</span>,
      sortValue: (row) => row.serviceName,
      csvValue: (row) => row.serviceName,
    },
    {
      key: "assignedTo",
      header: "Assigned To",
      render: (row) => <span>{row.assignedTo}</span>,
      sortValue: (row) => row.assignedTo,
      csvValue: (row) => row.assignedTo,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        let badgeClass = "badge-grey";
        if (row.status === "Completed") badgeClass = "badge-green";
        else if (["In Progress", "Review"].includes(row.status)) badgeClass = "badge-blue";
        else if (["Payment Pending", "Documents Pending", "Waiting for Client"].includes(row.status)) badgeClass = "badge-amber";
        else if (row.status === "Cancelled") badgeClass = "badge-red";
        return <span className={`badge ${badgeClass}`}>{row.status}</span>;
      },
      sortValue: (row) => row.status,
      csvValue: (row) => row.status,
    },
    {
      key: "createdDate",
      header: "Created",
      render: (row) => <span>{row.createdDate}</span>,
      sortValue: (row) => row.createdDate,
      csvValue: (row) => row.createdDate,
    },
    {
      key: "slaDueDate",
      header: "SLA Due",
      render: (row) => (
        <span style={{ color: row.priority === "High" ? "var(--color-error)" : undefined }}>
          {row.slaDueDate}
        </span>
      ),
      sortValue: (row) => row.slaDueDate,
      csvValue: (row) => row.slaDueDate,
    },
  ];

  // Specific Actionable Items
  const pendingKYC = useMemo(() => {
    return partners.reduce(
      (acc, p) => acc + p.kycDocuments.filter((d) => d.status === "Under Review").length,
      0
    );
  }, [partners]);

  const pendingPayments = useMemo(() => {
    return payments.filter((p) => p.status === "Manual Verification").length;
  }, [payments]);

  const pendingReviewCases = useMemo(() => {
    return cases.filter((c) => c.status === "Review").length;
  }, [cases]);

  const openDisputes = useMemo(() => {
    return disputes.filter((d) => d.status === "Open").length;
  }, [disputes]);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Good morning, {profile.name.split(" ")[0]}</h1>
          <p className="admin-page-subtitle">Here&apos;s what&apos;s happening across A&amp;A today.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <KpiCard
          label="New Leads"
          value={String(newLeadsCount)}
          icon={<UserPlus size={18} />}
          trend={newLeadsCount > 3 ? "up" : "down"}
          trendValue="8.2%"
          sparkline={[3, 5, 2, 8, 5, newLeadsCount]}
        />
        <KpiCard
          label="Active Cases"
          value={String(activeCasesCount)}
          icon={<Briefcase size={18} />}
          trend="up"
          trendValue="12.4%"
          sparkline={[110, 115, 120, 122, 125, activeCasesCount]}
        />
        <KpiCard
          label="Pending Documents"
          value={String(pendingDocsCount)}
          icon={<FolderOpen size={18} />}
          trend={pendingDocsCount > 10 ? "up" : "down"}
          trendValue="4.1%"
          sparkline={[12, 15, 10, 8, 14, pendingDocsCount]}
        />
        <KpiCard
          label="Pending Payments"
          value={String(pendingPaymentsCount)}
          icon={<CreditCard size={18} />}
          trend="down"
          trendValue="15.0%"
          sparkline={[8, 7, 5, 9, 4, pendingPaymentsCount]}
        />
        <KpiCard
          label="Revenue This Month"
          value={`$${revenueThisMonth}`}
          icon={<TrendingUp size={18} />}
          trend="up"
          trendValue="24.8%"
          sparkline={[300, 320, 390, 420, 480, revenueThisMonth]}
        />
        <KpiCard
          label="Partner Payouts Pending"
          value={String(pendingPayoutsCount)}
          icon={<Handshake size={18} />}
          trend="up"
          trendValue="1.5%"
          sparkline={[2, 3, 2, 4, 3, pendingPayoutsCount]}
        />
        <KpiCard
          label="Cases Nearing SLA"
          value={String(slaApproachingCount)}
          icon={<AlertCircle size={18} />}
          trend="down"
          trendValue="18.2%"
          sparkline={[9, 8, 6, 7, 5, slaApproachingCount]}
        />
        <KpiCard
          label="Open Disputes"
          value={String(openDisputesCount)}
          icon={<AlertTriangle size={18} />}
          trend="down"
          trendValue="50.0%"
          sparkline={[2, 2, 1, 3, 2, openDisputesCount]}
        />
      </div>

      {/* Grid for Charts & Action items */}
      <div className="admin-grid-2" style={{ margin: "2rem 0" }}>
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2 className="admin-panel-title">Revenue Overview</h2>
            <span className="empty-state" style={{ fontSize: "0.75rem" }}>Last 6 months ($)</span>
          </div>
          <div style={{ padding: "1.25rem 0.5rem" }}>
            <TrendChart data={revenueChartData} valueFormatter={(v) => `$${v}`} />
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2 className="admin-panel-title">Pending Actions</h2>
          </div>
          <div className="admin-action-list">
            {pendingKYC > 0 && (
              <div className="admin-action-item">
                <div className="admin-action-item-left">
                  <AlertCircle className="text-amber" size={16} />
                  <span>{pendingKYC} partner KYC documents awaiting verification</span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => router.push("/admin/partners")}
                >
                  Verify
                </button>
              </div>
            )}
            {pendingPayments > 0 && (
              <div className="admin-action-item">
                <div className="admin-action-item-left">
                  <CreditCard className="text-amber" size={16} />
                  <span>{pendingPayments} payments awaiting manual review</span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => router.push("/admin/payments")}
                >
                  Review
                </button>
              </div>
            )}
            {pendingReviewCases > 0 && (
              <div className="admin-action-item">
                <div className="admin-action-item-left">
                  <Briefcase className="text-blue" size={16} />
                  <span>{pendingReviewCases} cases require final review</span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => router.push("/admin/cases")}
                >
                  Review
                </button>
              </div>
            )}
            {openDisputes > 0 && (
              <div className="admin-action-item">
                <div className="admin-action-item-left">
                  <AlertTriangle className="text-red" size={16} />
                  <span>{openDisputes} partner disputes require action</span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => router.push("/admin/revenue")}
                >
                  Resolve
                </button>
              </div>
            )}
            {pendingKYC === 0 && pendingPayments === 0 && pendingReviewCases === 0 && openDisputes === 0 && (
              <p className="empty-state" style={{ padding: "2rem", textAlign: "center" }}>
                All caught up! No pending actions require attention.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="admin-grid-2" style={{ margin: "2rem 0" }}>
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2 className="admin-panel-title">Case Overview</h2>
            <span className="empty-state" style={{ fontSize: "0.75rem" }}>By Status</span>
          </div>
          <div style={{ padding: "1.25rem 0.5rem" }}>
            <DonutChart data={caseStatusData} />
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2 className="admin-panel-title">Lead Pipeline</h2>
            <span className="empty-state" style={{ fontSize: "0.75rem" }}>Conversion Stages</span>
          </div>
          <div style={{ padding: "1.25rem 0.5rem" }}>
            <BarChart data={leadPipelineData} />
          </div>
        </div>
      </div>

      {/* Recent Cases Panel */}
      <div className="admin-panel" style={{ margin: "2rem 0" }}>
        <div className="admin-panel-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="admin-panel-title">Recent Cases</h2>
          <Link href="/admin/cases" className="admin-panel-link" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            View All Cases <ExternalLink size={12} />
          </Link>
        </div>
        <div style={{ padding: "1rem" }}>
          <AdminTable
            columns={recentCasesColumns}
            rows={recentCases}
            rowKey={(r) => r.id}
            pageSize={5}
            selectable={false}
            exportFilename="recent_cases"
          />
        </div>
      </div>
    </div>
  );
}
