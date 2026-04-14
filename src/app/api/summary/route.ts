import Anthropic from "@anthropic-ai/sdk";
import type { NewsArticle, SummaryResponse } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  try {
    const { articles, keyword }: { articles: NewsArticle[]; keyword: string } =
      await request.json();

    if (!articles || articles.length === 0) {
      return Response.json({ error: "No articles provided" }, { status: 400 });
    }

    const articleText = articles
      .slice(0, 5)
      .map((a, i) => `[${i + 1}] ${a.title}\n${a.description ?? ""}`)
      .join("\n\n");

    const message = await client.messages.create({
      model: "claude-haiku-4-5",

      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `다음 "${keyword}" 관련 뉴스 기사들을 분석하고 반드시 한국어로 JSON만 응답해줘 (마크다운 없이):
{
  "summary": "주요 트렌드를 2-3문장으로 요약 (한국어)",
  "keywords": ["핵심키워드1", "핵심키워드2", "핵심키워드3"],
  "sentiment": "positive" | "negative" | "neutral"
}

기사 목록:
${articleText}`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    const parsed: SummaryResponse = JSON.parse(cleaned);
    return Response.json(parsed);
  } catch (e) {
    console.error("Summary error:", e);
    return Response.json(
      { error: "Failed to generate summary" },
      { status: 500 },
    );
  }
}
