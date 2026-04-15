"use client";
import { useEffect, useState, useMemo } from "react";
import { useKeywordStore } from "@/lib/store/keywordStore";
import { useNews, useLastUpdated } from "@/lib/queries/useNews";
import { useSummary } from "@/lib/queries/useSummary";
import { KeywordCard } from "@/components/dashboard/KeywordCard";
import { NewsCard } from "@/components/dashboard/NewsCard";
import { SummaryPanel } from "@/components/dashboard/SummaryPanel";
import { AddKeywordForm } from "@/components/dashboard/AddKeywordForm";
import { NewsCardSkeleton } from "@/components/ui/Skeleton";
import { generateTrendData } from "@/lib/utils";
import Link from "next/link";
import dynamic from "next/dynamic";
import { LoginButton } from "@/components/dashboard/LoginButton";
const TrendChart = dynamic(
  () =>
    import("@/components/charts/TrendChart").then((m) => ({
      default: m.TrendChart,
    })),
  { ssr: false },
);
const CompareChart = dynamic(
  () =>
    import("@/components/charts/CompareChart").then((m) => ({
      default: m.CompareChart,
    })),
  { ssr: false },
);

const DEFAULT_KEYWORDS = [
  { keyword: "AI", category: "기술" },
  { keyword: "주식", category: "경제" },
  { keyword: "부동산", category: "경제" },
];

export default function DashboardPage() {
  const keywords = useKeywordStore((s) => s.keywords);
  const fetchKeywords = useKeywordStore((s) => s.fetchKeywords);
  const addKeyword = useKeywordStore((s) => s.addKeyword);

  const [activeId, setActiveId] = useState<string>(keywords[0]?.id ?? "");
  const activeKeyword = keywords.find((k) => k.id === activeId) ?? keywords[0];

  useEffect(() => {
    fetchKeywords().then(() => {
      const current = useKeywordStore.getState().keywords;
      if (current.length === 0) {
        DEFAULT_KEYWORDS.forEach(({ keyword, category }) =>
          addKeyword(keyword, category),
        );
      }
    });
  }, []);

  const { data: newsData, isLoading: newsLoading } = useNews(
    activeKeyword?.keyword ?? "",
  );
  const { elapsed } = useLastUpdated();
  const {
    mutate: summarize,
    data: summary,
    isPending: summaryLoading,
  } = useSummary();
  const trendData = useMemo(() => generateTrendData(7), [activeId]);

  useEffect(() => {
    if (newsData?.articles && activeKeyword) {
      summarize({
        keyword: activeKeyword.keyword,
        articles: newsData.articles,
      });
    }
  }, [newsData, activeId]);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header className="border-b border-gray-200 bg-white px-8 py-4 sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <div className="h-9 w-9 rounded-xl bg-[#00835b] flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">TS</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">
                TrendScope
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                키워드 트렌드 추적 + AI 요약
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/bookmarks"
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 hover:border-[#00835b] hover:text-[#00835b] transition"
            >
              ☆ 저장된 기사
            </Link>
            <div className="flex items-center gap-1.5 rounded-full bg-[#f0faf6] border border-[#c3e8da] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00835b] animate-pulse" />
              <span className="text-xs text-[#00835b] font-medium">
                {elapsed || "실시간"}
              </span>
            </div>
            <LoginButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <AddKeywordForm />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
            추적 중인 키워드
          </p>
          <div className="space-y-2">
            {keywords.map((kw) => (
              <div
                key={kw.id}
                onClick={() => setActiveId(kw.id)}
                className={[
                  "cursor-pointer rounded-2xl border p-1 transition-all duration-200",
                  activeId === kw.id
                    ? "border-[#00835b]/30 bg-[#f0faf6] shadow-sm"
                    : "border-transparent hover:border-gray-200",
                ].join(" ")}
              >
                <KeywordCard keyword={kw} />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {activeKeyword && (
            <>
              <TrendChart data={trendData} keyword={activeKeyword.keyword} />
              <CompareChart keywords={keywords} />

              {summary && (
                <SummaryPanel
                  summary={summary}
                  isLoading={summaryLoading}
                  onRefresh={() =>
                    newsData?.articles &&
                    summarize({
                      keyword: activeKeyword.keyword,
                      articles: newsData.articles,
                    })
                  }
                />
              )}
              <div>
                <h2 className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  최신 뉴스
                </h2>
                {newsLoading ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <NewsCardSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {newsData?.articles.slice(0, 6).map((article, i) => (
                      <NewsCard key={i} article={article} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
