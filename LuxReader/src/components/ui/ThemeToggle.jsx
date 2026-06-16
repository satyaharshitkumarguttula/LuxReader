import { motion } from 'framer-motion';
import { Sun, Moon, Coffee } from 'lucide-react';
import useStore from '../../store/useStore';

const THEMES = [
  { id: 'light', icon: Sun },
  { id: 'sepia', icon: Coffee },
  { id: 'dark', icon: Moon },
];

export function ThemeToggle() {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);

  return (
    <div style={{
      display: 'flex', gap: 4, padding: '4px',
      background: 'var(--c-surface2)', borderRadius: 99,
      border: '1px solid var(--c-border)',
    }}>
      {THEMES.map(({ id, icon: Icon }) => (
        <motion.button
          key={id}
          onClick={() => setTheme(id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={`${id.charAt(0).toUpperCase() + id.slice(1)} mode`}
          style={{
            width: 28, height: 28, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: theme === id ? 'var(--c-surface)' : 'transparent',
            color: theme === id ? 'var(--c-gold)' : 'var(--c-ink3)',
            boxShadow: theme === id ? 'var(--shadow-xs)' : 'none',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          <Icon size={13} />
        </motion.button>
      ))}
    </div>
  );
}
