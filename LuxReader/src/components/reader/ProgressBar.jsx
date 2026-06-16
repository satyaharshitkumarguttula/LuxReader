import { motion } from 'framer-motion';

export function ProgressBar({ current, total }) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div style={{
      height: 3,
      background: 'var(--c-border)',
      flexShrink: 0,
    }}>
      <motion.div
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, var(--c-gold), var(--c-gold-light))',
          transformOrigin: 'left',
        }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

export function PageFooter({ current, total, title }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const remaining = total - current;

  return (
    <div style={{
      height: 36, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px',
      borderTop: '1px solid var(--c-border)',
      background: 'var(--c-surface)',
    }}>
      <span style={{ fontSize: 11, color: 'var(--c-ink3)', fontWeight: 500 }}>
        {title}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 11, color: 'var(--c-ink3)' }}>
          {remaining > 0 ? `${remaining} pages remaining` : 'Last page'}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 700, color: 'var(--c-gold)',
          background: 'var(--c-gold-bg)', padding: '2px 7px', borderRadius: 99,
        }}>
          {pct}%
        </span>
      </div>
    </div>
  );
}
