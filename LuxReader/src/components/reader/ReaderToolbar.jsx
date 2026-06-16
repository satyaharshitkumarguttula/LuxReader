import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, BookOpen, List, Bookmark, BookMarked,
  Settings, Maximize, Minimize, Columns2, Square, X
} from 'lucide-react';
import useStore from '../../store/useStore';

function IconBtn({ icon: Icon, onClick, active, title, size = 18 }) {
  return (
    <motion.button
      onClick={onClick}
      title={title}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        width: 36, height: 36, borderRadius: 'var(--r-sm)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? 'var(--c-gold-bg)' : 'transparent',
        color: active ? 'var(--c-gold)' : 'var(--c-ink2)',
        transition: 'background 0.2s, color 0.2s',
      }}
    >
      <Icon size={size} />
    </motion.button>
  );
}

export function ReaderToolbar({ bookId, currentPage, totalPages, onClose }) {
  const isFullscreen = useStore((s) => s.isFullscreen);
  const setFullscreen = useStore((s) => s.setFullscreen);
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);
  const isTocOpen = useStore((s) => s.isTocOpen);
  const setTocOpen = useStore((s) => s.setTocOpen);
  const isSettingsOpen = useStore((s) => s.isSettingsOpen);
  const setSettingsOpen = useStore((s) => s.setSettingsOpen);
  const isBookmarksOpen = useStore((s) => s.isBookmarksOpen);
  const setBookmarksOpen = useStore((s) => s.setBookmarksOpen);
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const bookmarks = useStore((s) => s.getBookmarks(bookId));
  const setPage = useStore((s) => s.setPage);
  const isBookmarked = bookmarks.includes(currentPage);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setFullscreen(!isFullscreen);
  };

  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -56, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        height: 56,
        background: 'var(--c-surface)',
        borderBottom: '1px solid var(--c-border)',
        display: 'flex', alignItems: 'center',
        padding: '0 16px',
        gap: 8,
        flexShrink: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <IconBtn icon={X} onClick={onClose} title="Close reader" />
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--c-border)', margin: '0 4px' }} />

      {/* Center nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
        <IconBtn icon={ChevronLeft} onClick={() => setPage(bookId, Math.max(1, currentPage - 1))} title="Previous page" />

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px' }}>
          <PageInput currentPage={currentPage} totalPages={totalPages} bookId={bookId} />
          <span style={{ fontSize: 13, color: 'var(--c-ink3)' }}>/ {totalPages}</span>
        </div>

        <IconBtn icon={ChevronRight} onClick={() => setPage(bookId, Math.min(totalPages, currentPage + 1))} title="Next page" />
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--c-border)', margin: '0 4px' }} />

      {/* Right tools */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <IconBtn
          icon={isBookmarked ? BookMarked : Bookmark}
          active={isBookmarked}
          onClick={() => toggleBookmark(bookId, currentPage)}
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        />
        <IconBtn
          icon={BookMarked}
          active={isBookmarksOpen}
          onClick={() => { setBookmarksOpen(!isBookmarksOpen); setTocOpen(false); setSettingsOpen(false); }}
          title="Bookmarks"
        />
        <IconBtn
          icon={List}
          active={isTocOpen}
          onClick={() => { setTocOpen(!isTocOpen); setBookmarksOpen(false); setSettingsOpen(false); }}
          title="Table of contents"
        />
        <div style={{ width: 1, height: 20, background: 'var(--c-border)' }} />
        <IconBtn
          icon={viewMode === 'single' ? Square : Columns2}
          active={viewMode === 'double'}
          onClick={() => setViewMode(viewMode === 'single' ? 'double' : 'single')}
          title={viewMode === 'single' ? 'Double page' : 'Single page'}
        />
        <IconBtn
          icon={Settings}
          active={isSettingsOpen}
          onClick={() => { setSettingsOpen(!isSettingsOpen); setTocOpen(false); setBookmarksOpen(false); }}
          title="Settings"
        />
        <IconBtn
          icon={isFullscreen ? Minimize : Maximize}
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        />
      </div>
    </motion.header>
  );
}

function PageInput({ currentPage, totalPages, bookId }) {
  const setPage = useStore((s) => s.setPage);

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      const n = parseInt(e.target.value);
      if (n >= 1 && n <= totalPages) setPage(bookId, n);
      e.target.blur();
    }
  };

  return (
    <input
      type="number"
      defaultValue={currentPage}
      key={currentPage}
      min={1}
      max={totalPages}
      onKeyDown={handleKey}
      style={{
        width: 52, textAlign: 'center', fontSize: 14, fontWeight: 600,
        background: 'var(--c-surface2)', border: '1px solid var(--c-border)',
        borderRadius: 6, padding: '4px 6px', color: 'var(--c-ink)',
        outline: 'none',
      }}
    />
  );
}
