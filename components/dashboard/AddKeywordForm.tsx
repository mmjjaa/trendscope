"use client";
import { useState } from "react";
import { useKeywordStore } from "@/lib/store/keywordStore";

const CATEGORIES = ["기술", "금융", "환경", "건강", "정치", "스포츠"];

export function AddKeywordForm() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const addKeyword = useKeywordStore((s) => s.addKeyword);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!keyword.trim()) return;
    addKeyword(keyword.trim(), category);
    setKeyword("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="키워드 입력..."
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#00835b] focus:ring-2 focus:ring-[#00835b]/10 transition"
        />
        <button
          type="submit"
          className="shrink-0 whitespace-nowrap rounded-xl bg-[#00835b] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#006e4c] active:scale-95 transition-all"
        >
          추가
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={[
              "rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer active:scale-95",
              category === c
                ? "bg-[#00835b] text-white shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200",
            ].join(" ")}
          >
            {c}
          </button>
        ))}
      </div>
    </form>
  );
}
