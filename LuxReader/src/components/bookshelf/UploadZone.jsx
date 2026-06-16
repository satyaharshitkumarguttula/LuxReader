import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, BookOpen, Sparkles } from 'lucide-react';
import useStore from '../../store/useStore';
import { generateCoverDataUrl, extractTOC, loadPDF } from '../../utils/pdfProcessor';

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const inputRef = useRef(null);
  const addBook = useStore((s) => s.addBook);

  const processFile = async (file) => {
    if (!file || !file.name.endsWith('.pdf')) {
      alert('Please upload a PDF file.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setStatusMsg('Reading file…');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      setProgress(20);
      setStatusMsg('Loading PDF…');

      const id = `book-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const pdf = await loadPDF(uint8, id);
      setProgress(45);
      setStatusMsg('Generating cover…');

      const coverUrl = await generateCoverDataUrl(pdf);
      setProgress(65);
      setStatusMsg('Extracting table of contents…');

      const toc = await extractTOC(pdf);
      setProgress(85);
      setStatusMsg('Finalising…');

      const title = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');

      addBook({
        id,
        title,
        author: 'Unknown Author',
        coverUrl,
        toc,
        totalPages: pdf.numPages,
        progress: 0,
        lastPage: 1,
        lastRead: Date.now(),
        addedAt: Date.now(),
        pdfData: uint8,
        fileSize: file.size,
      });

      setProgress(100);
      setStatusMsg('Done!');
      await new Promise((r) => setTimeout(r, 400));
    } catch (e) {
      console.error(e);
      alert('Failed to process PDF. Please try another file.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setStatusMsg('');
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <motion.div
      className="upload-zone"
      onClick={() => !isProcessing && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      animate={{ borderColor: isDragging ? 'var(--c-gold)' : 'var(--c-border)', scale: isDragging ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
      style={{
        border: '2px dashed var(--c-border)',
        borderRadius: 'var(--r-lg)',
        padding: '48px 32px',
        textAlign: 'center',
        cursor: isProcessing ? 'default' : 'pointer',
        background: isDragging ? 'var(--c-gold-bg)' : 'var(--c-surface)',
        transition: 'background 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={(e) => processFile(e.target.files[0])}
      />

      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div key="processing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div style={{ marginBottom: 20 }}>
              <ProcessingAnimation />
            </div>
            <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--c-ink)', marginBottom: 8 }}>{statusMsg}</p>
            <div style={{ background: 'var(--c-surface2)', borderRadius: 99, height: 4, width: '60%', margin: '0 auto' }}>
              <motion.div
                style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, var(--c-gold), var(--c-gold-light))' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div key="idle" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <motion.div
              style={{ marginBottom: 16, display: 'inline-flex', padding: 16, borderRadius: 16, background: 'var(--c-gold-bg)' }}
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            >
              <Upload size={28} color="var(--c-gold)" />
            </motion.div>
            <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--c-ink)', marginBottom: 6 }}>Drop a PDF here</p>
            <p style={{ fontSize: 14, color: 'var(--c-ink3)' }}>or click to browse · Any PDF book</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProcessingAnimation() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--c-gold)' }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
