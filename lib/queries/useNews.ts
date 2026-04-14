import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type { NewsResponse } from "@/types";

async function fetchNews(keyword: string): Promise<NewsResponse> {
  const res = await fetch(
    `/api/news?keyword=${encodeURIComponent(keyword)}&pageSize=10`,
  );
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
}

export function useNews(keyword: string) {
  return useQuery({
    queryKey: ["news", keyword],
    queryFn: () => fetchNews(keyword),
    enabled: !!keyword,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useLastUpdated() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    if (!lastUpdated) return;
    const update = () => {
      const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      if (diff < 60) setElapsed(`${diff}초 전 업데이트`);
      else setElapsed(`${Math.floor(diff / 60)}분 전 업데이트`);
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  return { lastUpdated, elapsed, refresh: () => setLastUpdated(new Date()) };
}
