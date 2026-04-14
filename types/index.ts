export interface NewsArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface TrendKeyword {
  id: string;
  keyword: string;
  category: string;
  createdAt?: string;
}

export interface SummaryResponse {
  summary: string;
  keywords: string[];
  sentiment: "positive" | "negative" | "neutral";
}

export interface TrendData {
  date: string;
  count: number;
}
