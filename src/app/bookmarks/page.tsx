"use client";
import Link from "next/link";
import { useBookmarkStore } from "@/lib/store/bookmarkStore";
import { NewsCard } from "@/components/dashboard/NewsCard";

export default function BookmarksPage() {
  const { bookmarks } = useBookmarkStore();

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
            <h1 className="text-lg font-bold text-gray-900">저장된 기사</h1>
            <span className="rounded-full bg-[#f0faf6] border border-[#c3e8da] px-2.5 py-0.5 text-xs text-[#00835b] font-medium">
              {bookmarks.length}개
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {bookmarks.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="text-4xl">☆</p>
            <p className="text-gray-400 text-sm">저장된 기사가 없어요</p>
            <Link
              href="/"
              className="inline-block rounded-xl bg-[#00835b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#006e4c] transition"
            >
              뉴스 보러가기
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {bookmarks.map((article, i) => (
              <NewsCard key={i} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
