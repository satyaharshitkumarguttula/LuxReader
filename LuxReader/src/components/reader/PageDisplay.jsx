import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDE_VARIANTS = {
  enterRight: { x: '100%', opacity: 0 },
  enterLeft: { x: '-100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitLeft: { x: '-60%', opacity: 0 },
  exitRight: { x: '60%', opacity: 0 },
};

const FADE_VARIANTS = {
  enterRight: { opacity: 0 },
  enterLeft: { opacity: 0 },
  center: { opacity: 1 },
  exitLeft: { opacity: 0 },
  exitRight: { opacity: 0 },
};

function PageImage({ dataUrl, alt, style }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div className="page-spinner" />
        </div>
      )}
      {dataUrl && (
        <img
          src={dataUrl}
          alt={alt}
          onLoad={() => setLoaded(true)}
          style={{
            width: '100%', height: '100%',
            objectFit: 'contain',
            display: 'block',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            userSelect: 'none',
            WebkitUserDrag: 'none',
          }}
        />
      )}
    </div>
  );
}

export function PageDisplay({
  currentPageData,
  nextPageData,
  pageNum,
  direction,
  animation,
  viewMode,
  onSwipeLeft,
  onSwipeRight,
}) {
  const containerRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const variants = animation === 'fade' ? FADE_VARIANTS : SLIDE_VARIANTS;
  const enterVariant = direction > 0 ? 'enterRight' : 'enterLeft';
  const exitVariant = direction > 0 ? 'exitLeft' : 'exitRight';

  const transition = animation === 'fade'
    ? { duration: 0.35, ease: 'easeInOut' }
    : { duration: 0.38, ease: [0.16, 1, 0.3, 1] };

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={pageNum}
          custom={direction}
          variants={variants}
          initial={enterVariant}
          animate="center"
          exit={exitVariant}
          transition={transition}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: viewMode === 'double' ? '24px 16px' : '24px 40px',
            gap: 24,
          }}
        >
          {viewMode === 'double' ? (
            <>
              {/* Left page */}
              <div style={{
                flex: 1, height: '100%', maxWidth: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              }}>
                <PageShadowBox>
                  <PageImage dataUrl={currentPageData?.dataUrl} alt={`Page ${pageNum}`} style={{ height: '100%' }} />
                </PageShadowBox>
              </div>

              {/* Spine */}
              <div style={{
                width: 1,
                alignSelf: 'stretch',
                background: 'linear-gradient(to bottom, transparent, var(--c-border) 20%, var(--c-border) 80%, transparent)',
                flexShrink: 0,
              }} />

              {/* Right page */}
              <div style={{
                flex: 1, height: '100%', maxWidth: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
              }}>
                <PageShadowBox right>
                  {nextPageData ? (
                    <PageImage dataUrl={nextPageData?.dataUrl} alt={`Page ${pageNum + 1}`} style={{ height: '100%' }} />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--c-ink3)', fontSize: 14,
                    }}>
                      End of book
                    </div>
                  )}
                </PageShadowBox>
              </div>
            </>
          ) : (
            <PageShadowBox center>
              <PageImage dataUrl={currentPageData?.dataUrl} alt={`Page ${pageNum}`} style={{ height: '100%' }} />
            </PageShadowBox>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Click zones */}
      <div
        onClick={onSwipeRight}
        style={{ position: 'absolute', left: 0, top: 0, width: '20%', height: '100%', zIndex: 10, cursor: 'w-resize' }}
      />
      <div
        onClick={onSwipeLeft}
        style={{ position: 'absolute', right: 0, top: 0, width: '20%', height: '100%', zIndex: 10, cursor: 'e-resize' }}
      />
    </div>
  );
}

function PageShadowBox({ children, right, center }) {
  return (
    <div style={{
      position: 'relative',
      height: '100%',
      width: center ? 'auto' : '100%',
      maxHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Page shadow */}
      <div style={{
        position: 'relative',
        height: '100%',
        maxWidth: '100%',
        boxShadow: right
          ? '4px 0 20px rgba(0,0,0,0.12), 1px 0 4px rgba(0,0,0,0.08)'
          : '-4px 0 20px rgba(0,0,0,0.12), -1px 0 4px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
        background: 'var(--c-page)',
      }}>
        {children}
      </div>
    </div>
  );
}
