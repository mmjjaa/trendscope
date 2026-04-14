"use client";
import { memo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useKeywordStore } from "@/lib/store/keywordStore";
import type { TrendKeyword } from "@/types";

interface KeywordCardProps {
  keyword: TrendKeyword;
}

export const KeywordCard = memo(function KeywordCard({
  keyword,
}: KeywordCardProps) {
  const removeKeyword = useKeywordStore((s) => s.removeKeyword);

  return (
    <Card className="flex items-center justify-between gap-3">
      <div>
        <Link
          href={"/keyword/" + keyword.id}
          className="font-semibold text-gray-800 hover:text-[#00835b] transition-colors"
        >
          {keyword.keyword}
        </Link>
        <div className="mt-1.5">
          <Badge>{keyword.category}</Badge>
        </div>
      </div>
      <button
        onClick={() => removeKeyword(keyword.id)}
        className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs text-rose-500 hover:bg-rose-100 transition cursor-pointer active:scale-95"
      >
        삭제
      </button>
    </Card>
  );
});
