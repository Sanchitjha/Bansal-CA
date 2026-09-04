"use client";

import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

export interface KpiCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
  trendLabel?: string;
  sparkline?: number[];
}

export default function KpiCard({
  label,
  value,
  icon,
  trend,
  trendValue,
  trendLabel = "vs last month",
  sparkline,
}: KpiCardProps) {
  const sparkData = sparkline?.map((v, i) => ({ i, v }));
  const gradientId = `kpi-spark-${label.replace(/[^a-zA-Z0-9]+/g, "")}`;

  return (
    <div className="kpi-card">
      <div className="kpi-card-top">
        <div>
          <div className="kpi-card-label">{label}</div>
          <div className="kpi-card-value">{value}</div>
        </div>
        {icon && <div className="kpi-card-icon">{icon}</div>}
      </div>
      {trend && trendValue && (
        <div className={`kpi-card-trend ${trend}`}>
          {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}
          <span className="kpi-card-trend-label">{trendLabel}</span>
        </div>
      )}
      {sparkData && sparkData.length > 1 && (
        <div className="kpi-card-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-orange)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-orange)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="var(--color-orange)" strokeWidth={2} fill={`url(#${gradientId})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
