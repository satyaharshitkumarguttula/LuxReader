import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked, Trash2 } from 'lucide-react';
import useStore from '../../store/useStore';

export function BookmarksPanel({ bookId, currentPage }) {
  const bookmarks = useStore((s) => s.getBookmarks(bookId));
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const setPage = useStore((s) => s.setPage);
  const setBookmarksOpen = useStore((s) => s.setBookmarksOpen);

  const navigate = (page) => {
    setPage(bookId, page);
    setBookmarksOpen(false);
  };

  return (
    <motion.div
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: 260,
        height: '100%',
        background: 'var(--c-surface)',
        borderRight: '1px solid var(--c-border)',
        display: 'flex', flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--c-border)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <BookMarked size={16} color="var(--c-gold)" />
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-ink)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Bookmarks
        </h3>
        <span style={{
          marginLeft: 'auto', background: 'var(--c-gold-bg)', color: 'var(--c-gold)',
          padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600,
        }}>
          {bookmarks.length}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {bookmarks.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--c-ink3)', fontSize: 14 }}>
            <BookMarked size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p>No bookmarks yet.</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Press B or the bookmark icon to add one.</p>
          </div>
        ) : (
          <AnimatePresence>
            {bookmarks.map((page) => (
              <motion.div
                key={page}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12, height: 0 }}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '10px 20px',
                  borderLeft: page === currentPage ? '3px solid var(--c-gold)' : '3px solid transparent',
                  background: page === currentPage ? 'var(--c-gold-bg)' : 'transparent',
                }}
              >
                <button
                  onClick={() => navigate(page)}
                  style={{
                    flex: 1, textAlign: 'left', cursor: 'pointer',
                    fontSize: 14, fontWeight: page === currentPage ? 600 : 400,
                    color: page === currentPage ? 'var(--c-gold)' : 'var(--c-ink2)',
                  }}
                >
                  Page {page}
                </button>
                <button
                  onClick={() => toggleBookmark(bookId, page)}
                  style={{ padding: 4, color: 'var(--c-ink3)', opacity: 0.6 }}
                  title="Remove bookmark"
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
