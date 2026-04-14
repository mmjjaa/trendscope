import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NewsArticle } from "@/types";

interface BookmarkState {
  bookmarks: NewsArticle[];
  addBookmark: (article: NewsArticle) => void;
  removeBookmark: (url: string) => void;
  isBookmarked: (url: string) => boolean;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (article) =>
        set((state) => ({ bookmarks: [...state.bookmarks, article] })),
      removeBookmark: (url) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.url !== url),
        })),
      isBookmarked: (url) => get().bookmarks.some((b) => b.url === url),
    }),
    { name: "trendscope-bookmarks" },
  ),
);
