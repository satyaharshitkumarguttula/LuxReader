import { useState, useEffect, useRef, useCallback } from 'react';
import { loadPDF, renderPageToDataUrl } from '../utils/pdfProcessor';

const CACHE_SIZE = 30;

export function usePDFRenderer(pdfData, bookId) {
  const [pdf, setPdf] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const cache = useRef(new Map()); // pageKey -> { dataUrl, width, height }
  const pending = useRef(new Set());

  useEffect(() => {
    if (!pdfData || !bookId) return;
    let cancelled = false;
    setIsReady(false);
    setError(null);

    loadPDF(pdfData, bookId)
      .then((loaded) => {
        if (cancelled) return;
        setPdf(loaded);
        setTotalPages(loaded.numPages);
        setIsReady(true);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });

    return () => { cancelled = true; };
  }, [pdfData, bookId]);

  const getPage = useCallback(async (pageNum, scale = 2.0) => {
    if (!pdf) return null;
    const key = `${bookId}-${pageNum}-${scale}`;
    if (cache.current.has(key)) return cache.current.get(key);
    if (pending.current.has(key)) return null;

    pending.current.add(key);
    try {
      const result = await renderPageToDataUrl(pdf, pageNum, scale);
      // LRU eviction
      if (cache.current.size >= CACHE_SIZE) {
        const firstKey = cache.current.keys().next().value;
        cache.current.delete(firstKey);
      }
      cache.current.set(key, result);
      return result;
    } catch (e) {
      console.error('Render error:', e);
      return null;
    } finally {
      pending.current.delete(key);
    }
  }, [pdf, bookId]);

  const prefetch = useCallback((pageNums, scale = 2.0) => {
    if (!pdf) return;
    pageNums.forEach((n) => {
      if (n >= 1 && n <= totalPages) getPage(n, scale);
    });
  }, [pdf, totalPages, getPage]);

  return { pdf, totalPages, isReady, error, getPage, prefetch };
}
