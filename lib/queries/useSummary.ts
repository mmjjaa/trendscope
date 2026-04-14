import { useMutation } from "@tanstack/react-query";
import type { NewsArticle, SummaryResponse } from "@/types";

async function fetchSummary(
  keyword: string,
  articles: NewsArticle[],
): Promise<SummaryResponse> {
  const res = await fetch("/api/summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword, articles }),
  });
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export function useSummary() {
  return useMutation({
    mutationFn: ({
      keyword,
      articles,
    }: {
      keyword: string;
      articles: NewsArticle[];
    }) => fetchSummary(keyword, articles),
  });
}
