import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';
import { usePDFRenderer } from '../../hooks/usePDFRenderer';
import { useKeyboard } from '../../hooks/useKeyboard';
import { extractTOC } from '../../utils/pdfProcessor';
import { PageDisplay } from './PageDisplay';
import { ReaderToolbar } from './ReaderToolbar';
import { SettingsPanel } from './SettingsPanel';
import { TocPanel } from './TocPanel';
import { BookmarksPanel } from './BookmarksPanel';
import { ProgressBar, PageFooter } from './ProgressBar';
import { LoadingScreen } from './LoadingScreen';

export function Reader({ book }) {
  const [direction, setDirection] = useState(1);
  const [currentPageData, setCurrentPageData] = useState(null);
  const [nextPageData, setNextPageData] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [toc, setToc] = useState(book.toc || []);
  const renderLock = useRef(false);

  const currentPage = useStore((s) => s.getCurrentPage(book.id));
  const _setPage = useStore((s) => s.setPage);
  const syncProgress = useStore((s) => s.syncProgress);
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const closeReader = useStore((s) => s.closeReader);
  const viewMode = useStore((s) => s.viewMode);
  const pageAnimation = useStore((s) => s.pageAnimation);
  const isTocOpen = useStore((s) => s.isTocOpen);
  const isSettingsOpen = useStore((s) => s.isSettingsOpen);
  const isBookmarksOpen = useStore((s) => s.isBookmarksOpen);
  const setFullscreen = useStore((s) => s.setFullscreen);

  const { pdf, totalPages, isReady, error, getPage, prefetch } = usePDFRenderer(book.pdfData, book.id);

  // Extract TOC
  useEffect(() => {
    if (!pdf || toc.length > 0) return;
    extractTOC(pdf).then(setToc);
  }, [pdf]);

  // Render pages whenever currentPage or viewMode changes
  useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    setIsPageLoading(true);

    async function render() {
      const [cur, nxt] = await Promise.all([
        getPage(currentPage),
        viewMode === 'double' && currentPage + 1 <= totalPages
          ? getPage(currentPage + 1)
          : Promise.resolve(null),
      ]);
      if (cancelled) return;
      setCurrentPageData(cur);
      setNextPageData(nxt);
      setIsPageLoading(false);
      // Warm cache
      prefetch([currentPage - 1, currentPage + 1, currentPage + 2, currentPage + 3]);
    }

    render().catch(() => { if (!cancelled) setIsPageLoading(false); });
    return () => { cancelled = true; };
  }, [isReady, currentPage, viewMode, totalPages]);

  // Sync reading progress
  useEffect(() => {
    if (!totalPages) return;
    const t = setTimeout(() => syncProgress(book.id, currentPage, totalPages), 1000);
    return () => clearTimeout(t);
  }, [currentPage, totalPages]);

  // Fullscreen listener
  useEffect(() => {
    const handler = () => { if (!document.fullscreenElement) setFullscreen(false); };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const goNext = useCallback(() => {
    const jump = viewMode === 'double' ? 2 : 1;
    const next = Math.min(totalPages, currentPage + jump);
    if (next !== currentPage) { setDirection(1); _setPage(book.id, next); }
  }, [currentPage, totalPages, viewMode, book.id]);

  const goPrev = useCallback(() => {
    const jump = viewMode === 'double' ? 2 : 1;
    const prev = Math.max(1, currentPage - jump);
    if (prev !== currentPage) { setDirection(-1); _setPage(book.id, prev); }
  }, [currentPage, viewMode, book.id]);

  useKeyboard({
    ArrowRight: goNext,
    ArrowLeft: goPrev,
    ' ': (e) => { e.preventDefault(); goNext(); },
    b: () => toggleBookmark(book.id, currentPage),
    B: () => toggleBookmark(book.id, currentPage),
    Escape: closeReader,
    f: () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
    },
  });

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 16 }}>
        <p style={{ color: 'var(--c-ink)', fontSize: 16, fontWeight: 600 }}>Could not load this PDF</p>
        <p style={{ color: 'var(--c-ink3)', fontSize: 14 }}>{error}</p>
        <button onClick={closeReader} style={{ padding: '10px 24px', background: 'var(--c-gold)', color: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 14 }}>
          Back to library
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-bg)', overflow: 'hidden', position: 'relative' }}
    >
      {/* Loading screen */}
      <AnimatePresence>
        {!isReady && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'absolute', inset: 0, zIndex: 100 }}
          >
            <LoadingScreen title={book.title} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <ReaderToolbar bookId={book.id} currentPage={currentPage} totalPages={totalPages || book.totalPages} onClose={closeReader} />

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left panels */}
        <AnimatePresence mode="wait">
          {isTocOpen && <TocPanel key="toc" toc={toc} currentPage={currentPage} bookId={book.id} />}
          {isBookmarksOpen && !isTocOpen && <BookmarksPanel key="bm" bookId={book.id} currentPage={currentPage} />}
        </AnimatePresence>

        {/* Page */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {/* Page-turn loading shimmer */}
          <AnimatePresence>
            {isPageLoading && isReady && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', inset: 0, zIndex: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--c-bg)',
                }}
              >
                <div style={{
                  width: '60%', maxWidth: 400, height: '80%', maxHeight: 600,
                  borderRadius: 4, overflow: 'hidden',
                  boxShadow: 'var(--shadow-lg)',
                }}>
                  <div className="skeleton" style={{ width: '100%', height: '100%' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <PageDisplay
            currentPageData={currentPageData}
            nextPageData={nextPageData}
            pageNum={currentPage}
            direction={direction}
            animation={pageAnimation}
            viewMode={viewMode}
            onSwipeLeft={goNext}
            onSwipeRight={goPrev}
          />
        </div>

        {/* Right panel */}
        <AnimatePresence>
          {isSettingsOpen && <SettingsPanel key="settings" />}
        </AnimatePresence>
      </div>

      <ProgressBar current={currentPage} total={totalPages || book.totalPages} />
      <PageFooter current={currentPage} total={totalPages || book.totalPages} title={book.title} />
    </motion.div>
  );
}
