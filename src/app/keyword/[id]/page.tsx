"use client";
import { use, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useKeywordStore } from "@/lib/store/keywordStore";
import { useNews } from "@/lib/queries/useNews";
import { useSummary } from "@/lib/queries/useSummary";
import { NewsCard } from "@/components/dashboard/NewsCard";
import { SummaryPanel } from "@/components/dashboard/SummaryPanel";
import { NewsCardSkeleton } from "@/components/ui/Skeleton";
import { generateTrendData } from "@/lib/utils";
import { KeywordRecommend } from "@/components/dashboard/KeywordRecommend";

const TrendChart = dynamic(
  () =>
    import("@/components/charts/TrendChart").then((m) => ({
      default: m.TrendChart,
    })),
  { ssr: false },
);

export default function KeywordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const keywords = useKeywordStore((s) => s.keywords);
  const keyword = keywords.find((k) => k.id === id);

  const { data: newsData, isLoading: newsLoading } = useNews(
    keyword?.keyword ?? "",
  );
  const {
    mutate: summarize,
    data: summary,
    isPending: summaryLoading,
  } = useSummary();

  const trendData = generateTrendData(14);

  useEffect(() => {
    if (newsData?.articles && keyword) {
      summarize({ keyword: keyword.keyword, articles: newsData.articles });
    }
  }, [newsData]);

  if (!keyword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
        <div className="text-center space-y-3">
          <p className="text-4xl">🔍</p>
          <p className="text-gray-500">키워드를 찾을 수 없어요.</p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-[#00835b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#006e4c] transition"
          >
            대시보드로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const totalArticles = newsData?.totalResults ?? 0;
  const sources = [
    ...new Set(newsData?.articles.map((a) => a.source.name) ?? []),
  ].slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header className="border-b border-gray-200 bg-white px-8 py-4 sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-4xl flex items-center gap-3">
          <Link
            href="/"
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 hover:border-[#00835b] hover:text-[#00835b] transition"
          >
            ← 대시보드
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900">
              {keyword.keyword}
            </h1>
            <span className="rounded-full bg-[#f0faf6] border border-[#c3e8da] px-2.5 py-0.5 text-xs text-[#00835b] font-medium">
              {keyword.category}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-[#00835b]">
              {totalArticles.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-1">총 뉴스 수</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-[#00835b]">
              {sources.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">언론사</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-[#00835b]">14</p>
            <p className="text-xs text-gray-400 mt-1">추적 일수</p>
          </div>
        </div>

        {sources.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              주요 언론사
            </p>
            <div className="flex flex-wrap gap-2">
              {sources.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-[#f0faf6] border border-[#c3e8da] px-3 py-1 text-xs text-[#00835b] font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <TrendChart data={trendData} keyword={keyword.keyword} />
        <KeywordRecommend keyword={keyword.keyword} />

        {summary && (
          <SummaryPanel
            summary={summary}
            isLoading={summaryLoading}
            onRefresh={() =>
              newsData?.articles &&
              summarize({
                keyword: keyword.keyword,
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
              {newsData?.articles.map((article, i) => (
                <NewsCard key={i} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
