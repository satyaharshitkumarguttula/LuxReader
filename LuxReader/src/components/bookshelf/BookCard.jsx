import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, BookOpen, Clock, Bookmark } from 'lucide-react';
import useStore from '../../store/useStore';

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function BookCard({ book }) {
  const [hovered, setHovered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const openReader = useStore((s) => s.openReader);
  const removeBook = useStore((s) => s.removeBook);
  const bookmarks = useStore((s) => s.getBookmarks(book.id));

  const progress = book.progress || 0;

  return (
    <motion.div
      className="book-card"
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => { setHovered(false); setShowConfirm(false); }}
      style={{ position: 'relative', cursor: 'pointer' }}
      onClick={() => !showConfirm && openReader(book.id)}
    >
      {/* Book cover */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--r-md)',
        overflow: 'hidden',
        aspectRatio: '2/3',
        background: book.coverUrl ? 'transparent' : generateGradient(book.id),
        boxShadow: hovered
          ? '0 20px 40px rgba(0,0,0,0.25), -4px 0 12px rgba(0,0,0,0.15)'
          : '0 4px 16px rgba(0,0,0,0.12), -2px 0 6px rgba(0,0,0,0.08)',
        transition: 'box-shadow 0.3s ease',
        transform: hovered ? 'translateY(-4px) rotate(-1deg)' : 'none',
        transformOrigin: 'bottom center',
      }}>
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 16, textAlign: 'center',
            background: generateGradient(book.id),
          }}>
            <BookOpen size={32} color="rgba(255,255,255,0.8)" style={{ marginBottom: 8 }} />
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
              {book.title}
            </span>
          </div>
        )}

        {/* Spine shadow */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 8,
          background: 'linear-gradient(to right, rgba(0,0,0,0.25), transparent)',
        }} />

        {/* Progress bar overlay */}
        {progress > 0 && progress < 100 && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
            background: 'rgba(0,0,0,0.3)',
          }}>
            <div style={{
              width: `${progress}%`, height: '100%',
              background: 'linear-gradient(90deg, var(--c-gold), var(--c-gold-light))',
            }} />
          </div>
        )}

        {/* Bookmark badge */}
        {bookmarks.length > 0 && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'var(--c-gold)', color: '#fff',
            borderRadius: 99, padding: '2px 7px', fontSize: 11, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            <Bookmark size={9} fill="white" />
            {bookmarks.length}
          </div>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
              <motion.div
                initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                style={{
                  background: 'var(--c-gold)', color: '#fff',
                  padding: '10px 22px', borderRadius: 99, fontWeight: 600, fontSize: 14,
                  display: 'flex', alignItems: 'center', gap: 7,
                }}
              >
                <BookOpen size={15} />
                {progress > 0 ? 'Continue' : 'Read'}
              </motion.div>

              {showConfirm ? (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', gap: 6 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); removeBook(book.id); }}
                    style={{
                      background: '#ef4444', color: '#fff', padding: '6px 14px',
                      borderRadius: 99, fontSize: 12, fontWeight: 600,
                    }}
                  >Delete</button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
                    style={{
                      background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '6px 14px',
                      borderRadius: 99, fontSize: 12,
                    }}
                  >Cancel</button>
                </motion.div>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                  style={{
                    background: 'rgba(255,255,255,0.15)', color: '#fff',
                    padding: '7px 12px', borderRadius: 99, fontSize: 12,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  <Trash2 size={12} /> Remove
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Metadata */}
      <div style={{ padding: '10px 2px 0' }}>
        <p style={{
          fontSize: 14, fontWeight: 600, color: 'var(--c-ink)',
          lineHeight: 1.3, marginBottom: 3,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {book.title}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--c-ink3)', fontSize: 12 }}>
          {book.lastRead && (
            <>
              <Clock size={10} />
              <span>{formatDate(book.lastRead)}</span>
              {progress > 0 && <span>· {progress}%</span>}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function generateGradient(id) {
  const hue = parseInt(id.slice(-6), 36) % 360;
  return `linear-gradient(135deg, hsl(${hue},55%,40%), hsl(${(hue + 40) % 360},65%,55%))`;
}
