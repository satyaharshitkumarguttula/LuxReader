# LuxReader — Premium Digital Book Reader

A production-ready PDF reading application with Google Play Books-quality experience.

## Quick Start

```bash
npm install
npm run dev        # Development server
npm run build      # Production build → dist/
```

## Deploy

- **Vercel / Netlify**: Drag `dist/` folder, or connect repo and set build command to `npm run build`
- **Static hosting**: Serve `dist/` directory from any CDN
- **Docker**: `docker run -p 80:80 -v $(pwd)/dist:/usr/share/nginx/html nginx`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 8 |
| State | Zustand (persisted to localStorage) |
| Animation | Framer Motion |
| PDF Engine | pdf.js 6 (Mozilla) |
| Icons | Lucide React |
| Fonts | Crimson Pro (serif) + Inter (sans) |

## Architecture

```
src/
├── store/          # Zustand global state
│   └── useStore.js
├── hooks/
│   ├── usePDFRenderer.js   # PDF loading + LRU page cache
│   └── useKeyboard.js      # Keyboard navigation
├── utils/
│   └── pdfProcessor.js     # PDF.js wrapper, whitespace trimming, TOC
└── components/
    ├── bookshelf/
    │   ├── Bookshelf.jsx    # Home / library page
    │   ├── BookCard.jsx     # Individual book card
    │   └── UploadZone.jsx   # Drag-and-drop upload
    ├── reader/
    │   ├── Reader.jsx       # Main reader orchestrator
    │   ├── PageDisplay.jsx  # Page rendering + slide/fade animations
    │   ├── ReaderToolbar.jsx
    │   ├── TocPanel.jsx
    │   ├── BookmarksPanel.jsx
    │   ├── SettingsPanel.jsx
    │   ├── ProgressBar.jsx
    │   └── LoadingScreen.jsx
    └── ui/
        └── ThemeToggle.jsx
```

## Features

- **PDF Processing**: Auto whitespace trimming, 2× DPI rendering, LRU page cache (30 pages)
- **Themes**: Light / Sepia / Dark, persisted to localStorage
- **Navigation**: Arrow keys, click zones, touch swipe, jump-to-page input
- **Bookmarks**: Per-book, persisted, panel view
- **Table of Contents**: Auto-extracted from PDF outline, with active highlighting
- **View Modes**: Single page / Double spread
- **Page Animations**: Slide (default) or Fade
- **Fullscreen**: Native browser fullscreen API
- **Progress**: Reading % tracked and displayed

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` | Prev / Next page |
| `Space` | Next page |
| `B` | Toggle bookmark |
| `F` | Fullscreen |
| `Esc` | Close reader |

## Performance

- PDF.js renders pages at 2× device pixel ratio for crispness
- Page results cached as PNG object URLs (LRU, max 30 entries)
- Adjacent pages prefetched 3 ahead
- Framer Motion uses CSS transforms (hardware-accelerated)
- Bundle: ~784 KB JS + 1.2 MB PDF worker (loaded once)

## Extending

To add epub/mobi support, install `epub.js` and add a parallel renderer hook.  
To add cloud storage, connect a backend to `useStore.addBook` and persist `pdfData` to S3/R2.
