import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

let cachedPdf = null;
let cachedId = null;

export async function loadPDF(uint8Array, id) {
  if (cachedId === id && cachedPdf) return cachedPdf;
  const pdf = await pdfjsLib.getDocument({
    data: uint8Array,
    useSystemFonts: true,
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.0.227/cmaps/',
    cMapPacked: true,
  }).promise;
  cachedPdf = pdf;
  cachedId = id;
  return pdf;
}

export async function extractTOC(pdf) {
  try {
    const outline = await pdf.getOutline();
    if (!outline?.length) return [];
    const process = async (items, level = 0) => {
      const result = [];
      for (const item of items) {
        let page = null;
        if (item.dest) {
          try {
            const dest = typeof item.dest === 'string' ? await pdf.getDestination(item.dest) : item.dest;
            if (dest?.[0]) page = (await pdf.getPageIndex(dest[0])) + 1;
          } catch {}
        }
        result.push({ title: item.title || 'Untitled', page, level });
        if (item.items?.length) result.push(...(await process(item.items, level + 1)));
      }
      return result;
    };
    return process(outline);
  } catch {
    return [];
  }
}

export async function renderPageToDataUrl(pdf, pageNum, scale = 2.0) {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  // Fill white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({ canvasContext: ctx, viewport }).promise;

  const trimmed = trimWhitespace(canvas, ctx);
  return { dataUrl: trimmed.toDataURL('image/png'), width: trimmed.width, height: trimmed.height };
}

function trimWhitespace(canvas, ctx) {
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;
  const PAD = 12;
  const THRESH = 248;
  let top = 0, bottom = height - 1, left = 0, right = width - 1;

  outer: for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i] < THRESH || data[i + 1] < THRESH || data[i + 2] < THRESH) { top = y; break outer; }
    }
  }
  outer2: for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i] < THRESH || data[i + 1] < THRESH || data[i + 2] < THRESH) { bottom = y; break outer2; }
    }
  }
  outer3: for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;
      if (data[i] < THRESH || data[i + 1] < THRESH || data[i + 2] < THRESH) { left = x; break outer3; }
    }
  }
  outer4: for (let x = width - 1; x >= 0; x--) {
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;
      if (data[i] < THRESH || data[i + 1] < THRESH || data[i + 2] < THRESH) { right = x; break outer4; }
    }
  }

  top = Math.max(0, top - PAD);
  bottom = Math.min(height - 1, bottom + PAD);
  left = Math.max(0, left - PAD);
  right = Math.min(width - 1, right + PAD);

  const w = right - left;
  const h = bottom - top;
  if (w <= 0 || h <= 0) return canvas;

  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  out.getContext('2d').drawImage(canvas, left, top, w, h, 0, 0, w, h);
  return out;
}

export async function generateCoverDataUrl(pdf) {
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 0.7 });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas.toDataURL('image/jpeg', 0.85);
}
