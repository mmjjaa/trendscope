"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TrendKeyword } from "@/types";
import { generateTrendData } from "@/lib/utils";
import dynamic from "next/dynamic";

interface CompareChartProps {
  keywords: TrendKeyword[];
}

const COLORS = [
  "#00835b",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export function CompareChart({ keywords }: CompareChartProps) {
  if (keywords.length < 2) return null;

  const days = 7;
  const dates = generateTrendData(days).map((d) => d.date);

  const data = dates.map((date, i) => {
    const entry: Record<string, string | number> = { date };
    keywords.forEach((kw) => {
      entry[kw.keyword] = Math.floor(Math.random() * 50) + 10;
    });
    return entry;
  });

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">키워드 비교</h3>
        <span className="text-xs text-gray-400">최근 7일</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
          {keywords.map((kw, i) => (
            <Line
              key={kw.id}
              type="monotone"
              dataKey={kw.keyword}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
