import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      books: [],
      addBook: (book) => set((s) => ({ books: [book, ...s.books] })),
      removeBook: (id) => set((s) => ({ books: s.books.filter((b) => b.id !== id) })),

      activeBookId: null,
      openReader: (id) => set({ activeBookId: id }),
      closeReader: () => set({ activeBookId: null }),

      theme: 'light',
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
      },
      fontSize: 20,
      setFontSize: (n) => set({ fontSize: Math.max(12, Math.min(36, n)) }),
      lineHeight: 1.75,
      setLineHeight: (n) => set({ lineHeight: n }),
      viewMode: 'single',
      setViewMode: (v) => set({ viewMode: v }),
      isFullscreen: false,
      setFullscreen: (v) => set({ isFullscreen: v }),
      pageAnimation: 'slide',
      setPageAnimation: (v) => set({ pageAnimation: v }),

      readingStates: {},
      getCurrentPage: (id) => get().readingStates[id]?.page || 1,
      getBookmarks: (id) => get().readingStates[id]?.bookmarks || [],
      setPage: (id, page) =>
        set((s) => ({
          readingStates: {
            ...s.readingStates,
            [id]: { ...(s.readingStates[id] || {}), page },
          },
        })),
      toggleBookmark: (id, page) =>
        set((s) => {
          const rs = s.readingStates[id] || {};
          const bm = rs.bookmarks || [];
          const has = bm.includes(page);
          return {
            readingStates: {
              ...s.readingStates,
              [id]: { ...rs, bookmarks: has ? bm.filter((p) => p !== page) : [...bm, page].sort((a, b) => a - b) },
            },
          };
        }),
      syncProgress: (id, page, totalPages) =>
        set((s) => ({
          books: s.books.map((b) =>
            b.id === id
              ? { ...b, lastPage: page, totalPages, lastRead: Date.now(), progress: totalPages ? Math.round((page / totalPages) * 100) : 0 }
              : b
          ),
          readingStates: { ...s.readingStates, [id]: { ...(s.readingStates[id] || {}), page } },
        })),

      isTocOpen: false,
      setTocOpen: (v) => set({ isTocOpen: v }),
      isSettingsOpen: false,
      setSettingsOpen: (v) => set({ isSettingsOpen: v }),
      isBookmarksOpen: false,
      setBookmarksOpen: (v) => set({ isBookmarksOpen: v }),
    }),
    {
      name: 'luxreader-v1',
      partialize: (s) => ({
        books: s.books.map((b) => ({ ...b, pdfData: undefined })),
        theme: s.theme,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        viewMode: s.viewMode,
        pageAnimation: s.pageAnimation,
        readingStates: s.readingStates,
      }),
    }
  )
);

export default useStore;
