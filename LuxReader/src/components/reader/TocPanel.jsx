import { motion } from 'framer-motion';
import { List, ChevronRight } from 'lucide-react';
import useStore from '../../store/useStore';

export function TocPanel({ toc, currentPage, bookId }) {
  const setPage = useStore((s) => s.setPage);
  const setTocOpen = useStore((s) => s.setTocOpen);

  const navigate = (page) => {
    if (page) {
      setPage(bookId, page);
      setTocOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: 280,
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
        <List size={16} color="var(--c-gold)" />
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-ink)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Contents
        </h3>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {toc.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--c-ink3)', fontSize: 14 }}>
            No table of contents found
          </div>
        ) : (
          toc.map((item, i) => {
            const isActive = item.page === currentPage || (
              toc[i + 1] ? currentPage >= item.page && currentPage < toc[i + 1].page : currentPage >= item.page
            );

            return (
              <motion.button
                key={i}
                onClick={() => navigate(item.page)}
                whileHover={{ x: 2 }}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: `${item.level === 0 ? 10 : 7}px 20px ${item.level === 0 ? 10 : 7}px ${20 + item.level * 16}px`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: isActive ? 'var(--c-gold-bg)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--c-gold)' : '3px solid transparent',
                  cursor: item.page ? 'pointer' : 'default',
                  transition: 'background 0.15s',
                }}
              >
                <span style={{
                  fontSize: item.level === 0 ? 13 : 12,
                  fontWeight: item.level === 0 ? 600 : 400,
                  color: isActive ? 'var(--c-gold)' : 'var(--c-ink2)',
                  lineHeight: 1.4,
                  flex: 1,
                  paddingRight: 8,
                }}>
                  {item.title}
                </span>
                {item.page && (
                  <span style={{ fontSize: 11, color: 'var(--c-ink3)', flexShrink: 0 }}>
                    {item.page}
                  </span>
                )}
              </motion.button>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
