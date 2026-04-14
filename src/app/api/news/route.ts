import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function translateToEnglish(keyword: string): Promise<string> {
  const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(keyword);
  if (!isKorean) return keyword;

  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 50,
    messages: [
      {
        role: "user",
        content: `Translate this Korean keyword to English for news search. Reply with only the English translation, nothing else: "${keyword}"`,
      },
    ],
  });

  return message.content[0].type === "text"
    ? message.content[0].text.trim()
    : keyword;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") ?? "technology";
  const pageSize = searchParams.get("pageSize") ?? "10";

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "NEWS_API_KEY not configured" },
      { status: 500 },
    );
  }

  const searchKeyword = await translateToEnglish(keyword);

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", searchKeyword);
  url.searchParams.set("pageSize", pageSize);
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("language", "en");
  url.searchParams.set("apiKey", apiKey);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) {
      const err = await res.json();
      return Response.json(
        { error: err.message ?? "NewsAPI error" },
        { status: res.status },
      );
    }
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
