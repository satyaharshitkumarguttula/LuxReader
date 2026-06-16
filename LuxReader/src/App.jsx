import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useStore from './store/useStore';
import { Bookshelf } from './components/bookshelf/Bookshelf';
import { Reader } from './components/reader/Reader';

export default function App() {
  const activeBookId = useStore((s) => s.activeBookId);
  const books = useStore((s) => s.books);
  const theme = useStore((s) => s.theme);

  const activeBook = books.find((b) => b.id === activeBookId);

  // Apply persisted theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
      <AnimatePresence mode="wait">
        {activeBook ? (
          <motion.div
            key="reader"
            style={{ position: 'absolute', inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Reader key={activeBook.id} book={activeBook} />
          </motion.div>
        ) : (
          <motion.div
            key="shelf"
            style={{ position: 'absolute', inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Bookshelf />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
