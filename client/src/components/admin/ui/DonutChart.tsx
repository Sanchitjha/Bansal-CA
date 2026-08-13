"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  height?: number;
}

export default function DonutChart({ data, height = 260 }: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius="58%" outerRadius="85%" paddingAngle={2}>
          {data.map((slice) => (
            <Cell key={slice.label} fill={slice.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-bg-white)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--color-text-primary)",
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={48}
          formatter={(value: string) => <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
