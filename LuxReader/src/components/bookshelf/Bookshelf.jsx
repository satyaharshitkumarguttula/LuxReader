import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Library } from 'lucide-react';
import useStore from '../../store/useStore';
import { BookCard } from './BookCard';
import { UploadZone } from './UploadZone';
import { ThemeToggle } from '../ui/ThemeToggle';

export function Bookshelf() {
  const books = useStore((s) => s.books);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: 'var(--c-bg)',
      }}
    >
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--c-bg)',
        borderBottom: '1px solid var(--c-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 32px',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <motion.div
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--c-gold), var(--c-gold-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BookOpen size={18} color="#fff" />
            </div>
            <div>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--c-ink)', letterSpacing: '-0.01em' }}>
                LuxReader
              </span>
            </div>
          </motion.div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--c-ink3)' }}>
              {books.length} {books.length === 1 ? 'book' : 'books'}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 80px' }}>
        {/* Upload */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 48 }}
        >
          <UploadZone />
        </motion.div>

        {/* Library section */}
        <AnimatePresence>
          {books.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <Library size={16} color="var(--c-gold)" />
                <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-ink2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Your Library
                </h2>
              </div>

              <motion.div
                layout
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: 28,
                }}
              >
                <AnimatePresence>
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {books.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ textAlign: 'center', paddingTop: 32, color: 'var(--c-ink3)' }}
          >
            <p style={{ fontSize: 15 }}>Upload your first book to get started</p>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}
