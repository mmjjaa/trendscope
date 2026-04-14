"use client";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { SummaryResponse } from "@/types";

interface SummaryPanelProps {
  summary: SummaryResponse;
  isLoading: boolean;
  onRefresh: () => void;
}

export function SummaryPanel({
  summary,
  isLoading,
  onRefresh,
}: SummaryPanelProps) {
  const sentimentLabel: Record<string, string> = {
    positive: "긍정",
    negative: "부정",
    neutral: "중립",
  };

  return (
    <Card className="flex flex-col gap-4 border-l-4 border-l-[#00835b]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-[#f0faf6] flex items-center justify-center">
            <span className="text-[#00835b] text-xs font-bold">AI</span>
          </div>
          <h2 className="font-semibold text-gray-800">AI 요약</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={summary.sentiment as "positive" | "negative" | "neutral"}
          >
            {sentimentLabel[summary.sentiment] ?? summary.sentiment}
          </Badge>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="rounded-xl border border-[#c3e8da] bg-[#f0faf6] px-3 py-1 text-xs text-[#00835b] font-medium hover:bg-[#e0f5ec] disabled:opacity-40 transition"
          >
            {isLoading ? "생성 중..." : "새로고침"}
          </button>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-gray-600">{summary.summary}</p>
      <div className="flex flex-wrap gap-1.5">
        {summary.keywords.map((kw) => (
          <Badge key={kw}>{kw}</Badge>
        ))}
      </div>
    </Card>
  );
}
