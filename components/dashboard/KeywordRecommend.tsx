"use client";
import { useState } from "react";
import { useKeywordStore } from "@/lib/store/keywordStore";

interface KeywordRecommendProps {
  keyword: string;
}

export function KeywordRecommend({ keyword }: KeywordRecommendProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const addKeyword = useKeywordStore((s) => s.addKeyword);

  async function fetchRecommendations() {
    setLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      setRecommendations(data.keywords ?? []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">
          AI 연관 키워드 추천
        </h3>
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="rounded-xl bg-[#00835b] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#006e4c] disabled:opacity-50 transition cursor-pointer active:scale-95"
        >
          {loading ? "분석 중..." : "추천 받기"}
        </button>
      </div>
      {recommendations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recommendations.map((rec) => (
            <button
              key={rec}
              onClick={() => addKeyword(rec, "기술")}
              className="rounded-full border border-[#c3e8da] bg-[#f0faf6] px-3 py-1 text-xs text-[#00835b] font-medium hover:bg-[#e0f5ec] transition"
            >
              + {rec}
            </button>
          ))}
        </div>
      )}
      {recommendations.length === 0 && !loading && (
        <p className="text-xs text-gray-400">
          추천 받기 버튼을 눌러 연관 키워드를 확인하세요
        </p>
      )}
    </div>
  );
}
