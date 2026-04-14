import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  try {
    const { keyword }: { keyword: string } = await request.json();

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `"${keyword}" 키워드와 관련된 트렌드 검색 키워드 5개를 JSON 배열로만 응답하세요. 마크다운 없이 순수 JSON만:
["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"]`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "[]";
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    const keywords = JSON.parse(cleaned);
    return Response.json({ keywords });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Recommend error:", msg);
    return Response.json({ error: msg, keywords: [] }, { status: 500 });
  }
}
