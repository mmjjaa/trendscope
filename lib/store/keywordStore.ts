import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface TrendKeyword {
  id: string;
  keyword: string;
  category: string;
  createdAt?: string;
}

interface KeywordStore {
  keywords: TrendKeyword[];
  fetchKeywords: () => Promise<void>;
  addKeyword: (keyword: string, category: string) => Promise<void>;
  removeKeyword: (id: string) => Promise<void>;
}

const API_URL = "http://localhost:8080/api/keywords";

export const useKeywordStore = create<KeywordStore>()(
  immer((set) => ({
    keywords: [],

    fetchKeywords: async () => {
      const res = await fetch(API_URL);
      const data = await res.json();
      set((s) => {
        s.keywords = data;
      });
    },

    addKeyword: async (keyword, category) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, category }),
      });
      const created = await res.json();
      set((s) => {
        s.keywords.unshift(created);
      });
    },

    removeKeyword: async (id) => {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      set((s) => {
        s.keywords = s.keywords.filter((k) => k.id !== id);
      });
    },
  })),
);
