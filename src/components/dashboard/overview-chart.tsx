"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useTheme } from "next-themes";

interface OverviewChartProps {
  data: {
    date: string;
    total: number;
  }[];
}

export function OverviewChart({ data }: OverviewChartProps) {
  const { theme } = useTheme();

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} min`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--background)",
            borderRadius: "8px",
            border: "1px solid var(--border)",
          }}
          itemStyle={{ color: "var(--foreground)" }}
          cursor={{ fill: "var(--muted)" }}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          className="fill-primary"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
