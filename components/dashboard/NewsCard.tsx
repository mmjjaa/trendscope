"use client";
import { memo } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { useBookmarkStore } from "@/lib/store/bookmarkStore";
import type { NewsArticle } from "@/types";

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard = memo(function NewsCard({ article }: NewsCardProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  const bookmarked = isBookmarked(article.url);

  return (
    <Card className="flex flex-col gap-3 group cursor-pointer">
      {article.urlToImage && (
        <div className="overflow-hidden rounded-xl relative h-40 w-full">
          <Image
            src={article.urlToImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium leading-snug text-gray-800 hover:text-[#00835b] transition-colors"
      >
        {article.title}
      </a>
      {article.description && (
        <p className="line-clamp-2 text-sm text-gray-500">
          {article.description}
        </p>
      )}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
        <span>{article.source.name}</span>
        <div className="flex items-center gap-2">
          <span>{formatDate(article.publishedAt)}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              bookmarked ? removeBookmark(article.url) : addBookmark(article);
            }}
            className={[
              "rounded-full px-2 py-0.5 text-xs font-medium transition cursor-pointer active:scale-95",
              bookmarked
                ? "bg-[#00835b] text-white"
                : "bg-gray-100 text-gray-400 hover:bg-[#f0faf6] hover:text-[#00835b]",
            ].join(" ")}
          >
            {bookmarked ? "★ 저장됨" : "☆ 저장"}
          </button>
        </div>
      </div>
    </Card>
  );
});
