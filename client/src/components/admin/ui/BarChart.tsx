"use client";

import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export interface BarPoint {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarPoint[];
  height?: number;
  color?: string;
  horizontal?: boolean;
}

export default function BarChart({ data, height = 260, color = "var(--color-navy)", horizontal = false }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={data} layout={horizontal ? "vertical" : "horizontal"} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--color-border)" vertical={horizontal} horizontal={!horizontal} />
        {horizontal ? (
          <>
            <XAxis type="number" tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={140}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickLine={false}
            />
            <YAxis tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-bg-white)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--color-text-primary)",
          }}
          cursor={{ fill: "rgba(11,21,40,0.04)" }}
        />
        <Bar dataKey="value" radius={[4, 4, 4, 4]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color || color} />
          ))}
        </Bar>
      </ReBarChart>
    </ResponsiveContainer>
  );
}
