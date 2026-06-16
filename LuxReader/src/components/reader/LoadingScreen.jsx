import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export function LoadingScreen({ title }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'var(--c-bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 32,
    }}>
      {/* Animated book icon */}
      <motion.div
        style={{
          width: 80, height: 80, borderRadius: 20,
          background: 'linear-gradient(135deg, var(--c-gold), var(--c-gold-light))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 16px 40px rgba(184,146,74,0.35)',
        }}
        animate={{
          scale: [1, 1.08, 1],
          rotate: [0, 2, -2, 0],
          boxShadow: [
            '0 16px 40px rgba(184,146,74,0.35)',
            '0 20px 50px rgba(184,146,74,0.5)',
            '0 16px 40px rgba(184,146,74,0.35)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <BookOpen size={40} color="white" />
      </motion.div>

      <div style={{ textAlign: 'center' }}>
        <motion.h2
          style={{ fontSize: 20, fontWeight: 700, color: 'var(--c-ink)', marginBottom: 8 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h2>
        <motion.p
          style={{ fontSize: 14, color: 'var(--c-ink3)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Preparing your reading experience…
        </motion.p>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--c-gold)' }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  );
}
