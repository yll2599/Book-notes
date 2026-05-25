# Reading Notes — Flip Book Journal

A hand-drawn, scrapbook-style reading notes app built with plain HTML, CSS, and JavaScript. No frameworks, no backend — just open the file in a browser and start writing.

![aesthetic: warm cream paper, colored pencil tags, washi tape accents]

## Features

- **Flip-page animation** between cover, table of contents, and each part
- **Upload your own cover photo** — stored locally, never leaves your device
- **Fully editable in the browser** — click any text to edit it:
  - Part summary & key quote
  - Theme tags (add / delete)
  - Note areas (Key Insight, Aha Moment, To Apply)
- **Add extra pages** when one page isn't enough — unlimited continuation pages per part
- **Star ratings** per part
- **Started date** picker
- **Auto-save** to localStorage — notes survive page refreshes
- **Keyboard navigation** — left / right arrow keys to flip pages
- Hand-drawn aesthetic: Caveat + Kalam fonts, washi tape, sticky notes, dot-grid paper

## How to Use

1. Clone or download the repo
2. Open `home.html` in any browser (no server needed) — this is your book shelf
3. Click a book card to open its notes
4. On the cover page, click 📷 to upload a cover photo (auto-compressed before saving)
5. Click through to the table of contents and start writing

## Add a New Book

Copy `index.html`, rename it (e.g. `atomic-habits.html`), and follow the instructions in [`NEW-BOOK.md`](NEW-BOOK.md). Then add a card to `home.html`.

Each book file is independent — its notes and cover photo are saved separately in localStorage.

## Structure

```
book-notes/
├── home.html        ← book shelf / entry point
├── index.html       ← Clear Thinking (template book)
├── style.css
├── script.js
├── NEW-BOOK.md      ← guide for adding new books
└── images/          ← not tracked in git (add your own)
```

## Tech

Pure HTML / CSS / JavaScript. No build tools, no dependencies.  
Fonts: [Caveat](https://fonts.google.com/specimen/Caveat) + [Kalam](https://fonts.google.com/specimen/Kalam) via Google Fonts.

## Notes on Data

All notes are saved in your **browser's localStorage** — they stay on your machine and are not synced. To back up your notes: open DevTools → Application → Local Storage → copy the values.

## License

MIT
