# Adding a New Book to Reading Notes

## Quick Steps

1. Copy `index.html` → rename to e.g. `atomic-habits.html`
2. Update the content in the new file (see sections below)
3. Add a card to `home.html` (see Home Page Card section below)
4. Open `home.html` in browser — your new book appears on the shelf

---

## Files to Change in the New HTML

### 1. Page `<title>`
```html
<title>Reading Notes · Book Title</title>
```

### 2. Cover image (s0)
The cover is uploaded in the browser — no code change needed.
On first open, click the 📷 placeholder to upload a photo. It will be compressed and saved automatically.

Optionally drop a fallback image into `images/` (e.g. `images/atomic-habits.png`) — the book will show it until a photo is uploaded via the browser.

### 3. TOC left page (s1) — title, author, tagline
```html
<h1 class="book-title">Book<br>Title</h1>
<p class="book-author">— Author Name —</p>
<p class="toc-tagline">Subtitle or tagline ♡</p>
```
The TOC thumbnail updates automatically once a cover photo is uploaded.

### 4. Spine label
```css
/* In style.css → .spine::after */
content: 'BOOK TITLE';
```
Or inline override per book file (add a `<style>` block at the top):
```html
<style>
  .spine::after { content: 'ATOMIC HABITS'; }
</style>
```

---

## Part Structure

Each book spread follows this pattern. Duplicate/remove spreads to match the book's actual number of parts.

```html
<!-- ═══ SPREAD X: PART N ═══ -->
<div class="spread" id="sN">
  <div class="page left part-left" style="--part-color: PICK A COLOR">

    <div class="part-header">
      <div class="part-label">Part N</div>
      <h2 class="part-title">Part<br>Title</h2>
    </div>

    <div class="part-themes">
      <!-- Tags are editable in the browser — pre-fill or leave empty -->
      <div class="theme-tag">Theme 1</div>
      <div class="theme-tag">Theme 2</div>
    </div>

    <div class="part-summary">
      <p>A short summary of this part. Editable in the browser.</p>
    </div>

    <div class="key-quote">
      <span class="quote-mark">"</span>
      Key quote from this part. Editable in the browser.
      <span class="quote-mark">"</span>
    </div>

    <div class="nav-row">
      <!-- Part 1: no ← Prev -->
      <button class="nav-btn toc-btn" onclick="flipTo('s1')">≡ TOC</button>
      <button class="nav-btn" onclick="flipTo('sNEXT')">Next →</button>

      <!-- Parts 2–N-1: -->
      <!-- <button class="nav-btn" onclick="flipTo('sPREV')">← Prev</button> -->
      <!-- <button class="nav-btn toc-btn" onclick="flipTo('s1')">≡ TOC</button> -->
      <!-- <button class="nav-btn" onclick="flipTo('sNEXT')">Next →</button> -->

      <!-- Last part: no Next → -->
      <!-- <button class="nav-btn" onclick="flipTo('sPREV')">← Prev</button> -->
      <!-- <button class="nav-btn toc-btn" onclick="flipTo('s1')">≡ TOC</button> -->
    </div>
  </div>

  <div class="spine"></div>

  <div class="page right part-right" style="--part-color: SAME COLOR">
    <h3 class="notes-heading">My Notes</h3>
    <div class="notes-grid">
      <div class="note-block">
        <div class="note-label">💡 Key Insight</div>
        <div class="note-area" contenteditable="true" spellcheck="false" data-ph="write here..."></div>
      </div>
      <div class="note-block">
        <div class="note-label">⚡ Aha Moment</div>
        <div class="note-area" contenteditable="true" spellcheck="false" data-ph="write here..."></div>
      </div>
    </div>
    <div class="sticky-note" style="transform:rotate(-1deg)">
      <div class="sticky-label">To Apply in My Life:</div>
      <div class="note-area note-area-tall" contenteditable="true" spellcheck="false" data-ph="write here..."></div>
    </div>
    <div class="rating-row">
      <span class="rating-label">Chapter Rating:</span>
      <span class="stars">☆ ☆ ☆ ☆ ☆</span>
    </div>
    <div class="add-row">
      <button class="add-page-btn" onclick="addNotesPage(this)">＋ add a page</button>
    </div>
  </div>
</div>
```

---

## Home Page Card (home.html)

Add a card to the shelf inside the `<div class="shelf">` block, before the `add-card`:

```html
<a class="book-card" href="atomic-habits.html"
   style="--rot: 1deg"
   data-cover-key="cover:atomic-habits.html"
   data-cover-fallback="images/atomic-habits.png">
  <div class="card-tape" style="background:rgba(127,181,197,0.5);--tape-rot:2deg"></div>
  <div class="card-cover">
    <img class="card-img" src="" alt="Atomic Habits">
    <div class="card-placeholder"><span>📖</span><small>NO COVER</small></div>
  </div>
  <div class="card-info">
    <div class="card-title">Atomic Habits</div>
    <div class="card-author">James Clear</div>
    <div class="card-open">open notes →</div>
  </div>
</a>
```

- `data-cover-key` must match `cover:YOUR-FILENAME.html` exactly
- `data-cover-fallback` is optional — points to a local image shown before any upload
- `--rot` rotates the card slightly; vary it per book for a natural shelf look

---

## TOC Part Cards (s1 right page)

Add one `.part-card` per part. Match `flipTo('sN')` to the spread IDs above.

```html
<div class="part-card" style="--accent: SAME COLOR AS PART; --rot:-1deg" onclick="flipTo('s2')">
  <span class="part-num">Part 1</span>
  <span class="part-name">Part Title</span>
  <span class="part-arrow">→</span>
</div>
```

---

## Keyboard Navigation

Update the `map` object in `script.js` to reflect your spread IDs:

```js
const map = {
  s0: { ArrowRight: 's1' },
  s1: { ArrowRight: 's2', ArrowLeft: 's0' },
  s2: { ArrowRight: 's3', ArrowLeft: 's1' },
  // ... add a line per spread
  sLAST: { ArrowLeft: 'sPREV' },
};
```

---

## Color Palette (colored pencil set)

Pick one per part — or choose your own hex:

| Color       | Hex       | Feel              |
|-------------|-----------|-------------------|
| Terracotta  | `#e07b54` | warm / energetic  |
| Dusty blue  | `#7fb5c5` | calm / clear      |
| Sage green  | `#7a9e6e` | grounded / nature |
| Dusty rose  | `#c47a7a` | soft / emotional  |
| Lavender    | `#9b7cb5` | reflective / deep |
| Amber       | `#d4955a` | curious / bold    |
| Teal        | `#5ba5a0` | fresh / focused   |

---

## What's Editable in the Browser

| Element        | How to edit                        | Saved?        |
|----------------|------------------------------------|---------------|
| Tags           | Hover → ×  /  click ＋            | localStorage  |
| Summary        | Click text to edit                 | localStorage  |
| Quote          | Click text between " "             | localStorage  |
| Note areas     | Click any lined area               | localStorage  |
| Cover photo    | Click 📷 or ↻ change               | localStorage  |
| Star rating    | Click stars                        | *(session)*   |
| Started date   | Click date picker                  | localStorage  |

> ⚠️ localStorage is per browser. Notes won't sync across devices.
> To back up notes: open DevTools → Application → Local Storage → copy the values.
