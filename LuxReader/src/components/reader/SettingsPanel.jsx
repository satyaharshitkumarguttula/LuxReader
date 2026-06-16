import { motion } from 'framer-motion';
import { Sun, Moon, Coffee, Type, AlignJustify, Layers } from 'lucide-react';
import useStore from '../../store/useStore';

function Slider({ value, min, max, step = 1, onChange, label, displayValue }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--c-ink2)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, color: 'var(--c-gold)', fontWeight: 600 }}>{displayValue}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--c-gold)', cursor: 'pointer' }}
      />
    </div>
  );
}

export function SettingsPanel() {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const fontSize = useStore((s) => s.fontSize);
  const setFontSize = useStore((s) => s.setFontSize);
  const lineHeight = useStore((s) => s.lineHeight);
  const setLineHeight = useStore((s) => s.setLineHeight);
  const pageAnimation = useStore((s) => s.pageAnimation);
  const setPageAnimation = useStore((s) => s.setPageAnimation);

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'sepia', label: 'Sepia', icon: Coffee },
  ];

  const animations = [
    { id: 'slide', label: 'Slide' },
    { id: 'fade', label: 'Fade' },
  ];

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: 280,
        height: '100%',
        background: 'var(--c-surface)',
        borderLeft: '1px solid var(--c-border)',
        padding: '24px 20px',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-ink)', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Reading Settings
      </h3>

      {/* Theme */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Sun size={14} color="var(--c-ink3)" />
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-ink2)' }}>Theme</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {themes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              style={{
                flex: 1, padding: '10px 8px', borderRadius: 'var(--r-sm)',
                border: `2px solid ${theme === id ? 'var(--c-gold)' : 'var(--c-border)'}`,
                background: theme === id ? 'var(--c-gold-bg)' : 'var(--c-surface2)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <Icon size={16} color={theme === id ? 'var(--c-gold)' : 'var(--c-ink3)'} />
              <span style={{ fontSize: 11, fontWeight: 600, color: theme === id ? 'var(--c-gold)' : 'var(--c-ink3)' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font size */}
      <Slider
        label="Font Size"
        value={fontSize}
        min={12} max={32}
        displayValue={`${fontSize}px`}
        onChange={setFontSize}
      />

      {/* Line height */}
      <Slider
        label="Line Height"
        value={lineHeight}
        min={1.2} max={2.5} step={0.05}
        displayValue={lineHeight.toFixed(2)}
        onChange={setLineHeight}
      />

      {/* Page animation */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Layers size={14} color="var(--c-ink3)" />
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-ink2)' }}>Page Animation</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {animations.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPageAnimation(id)}
              style={{
                flex: 1, padding: '8px', borderRadius: 'var(--r-sm)',
                border: `2px solid ${pageAnimation === id ? 'var(--c-gold)' : 'var(--c-border)'}`,
                background: pageAnimation === id ? 'var(--c-gold-bg)' : 'var(--c-surface2)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                color: pageAnimation === id ? 'var(--c-gold)' : 'var(--c-ink3)',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Keyboard shortcuts */}
      <div style={{
        marginTop: 32, padding: '16px', borderRadius: 'var(--r-sm)',
        background: 'var(--c-surface2)', border: '1px solid var(--c-border)',
      }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-ink2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shortcuts</p>
        {[
          ['← →', 'Navigate pages'],
          ['B', 'Toggle bookmark'],
          ['F', 'Fullscreen'],
          ['Esc', 'Close reader'],
        ].map(([key, desc]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
            <code style={{
              background: 'var(--c-bg)', padding: '1px 6px', borderRadius: 4,
              color: 'var(--c-gold)', fontFamily: 'monospace', fontSize: 11,
            }}>{key}</code>
            <span style={{ color: 'var(--c-ink3)' }}>{desc}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
