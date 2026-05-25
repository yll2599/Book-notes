/* Page flip navigation */

const history = [];

function flipTo(targetId, isBack = false) {
  const current = document.querySelector('.spread.active');
  const target  = document.getElementById(targetId);
  if (!current || !target || current === target) return;

  const outClass = isBack ? 'flip-out-reverse' : 'flip-out';
  const inClass  = isBack ? 'flip-in-reverse'  : 'flip-in';

  // Lock during animation to prevent double-clicks
  if (current.dataset.flipping) return;
  current.dataset.flipping = '1';

  current.classList.add(outClass);

  // Wait for the full 400ms out-animation, then swap
  setTimeout(() => {
    current.classList.remove('active', outClass);
    current.style.display = '';       // clear any inline display left by previous runs
    delete current.dataset.flipping;

    target.classList.add('active', inClass);

    setTimeout(() => target.classList.remove(inClass), 530);
  }, 420);
}

/* ── Cover photo upload ─────────────────────────────────── */
(function initCoverUpload() {
  const frame       = document.getElementById('coverFrame');
  const placeholder = document.getElementById('uploadPlaceholder');
  const coverImg    = document.getElementById('coverImg');
  const changBtn    = document.getElementById('changeCoverBtn');
  const openHint    = document.getElementById('openHint');
  const openBelow   = document.getElementById('openHintBelow');
  const fileInput   = document.getElementById('coverUpload');
  const tocThumb    = document.getElementById('tocThumb');
  const tocWrap     = document.getElementById('tocThumbWrap');

  const key = 'cover:' + location.pathname.split('/').pop();

  function applyImage(src) {
    coverImg.src = src;
    coverImg.style.display = 'block';
    placeholder.style.display = 'none';
    changBtn.style.display    = 'flex';
    openHint.style.display    = 'block';
    openBelow.style.display   = 'block';
    tocThumb.src = src;
    tocWrap.style.display = 'block';
    frame.style.cursor = 'pointer';
  }

  // Compress image via canvas before saving — prevents localStorage quota errors
  function compressAndSave(file) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL('image/jpeg', 0.82);
        localStorage.setItem(key, compressed);
        applyImage(compressed);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Load on start: localStorage first, then images/cover.png fallback
  const saved = localStorage.getItem(key);
  if (saved) {
    applyImage(saved);
  } else {
    const fallback = new Image();
    fallback.onload = () => applyImage('images/cover.png');
    fallback.src = 'images/cover.png';
  }

  placeholder.addEventListener('click', e => { e.stopPropagation(); fileInput.click(); });
  changBtn.addEventListener('click',     e => { e.stopPropagation(); fileInput.click(); });
  frame.addEventListener('click', () => flipTo('s1'));

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    fileInput.value = '';
    compressAndSave(file);
  });
})();

/* ── Note persistence (localStorage) ───────────────────── */
function initNoteAreas(root = document) {
  root.querySelectorAll('.note-area[contenteditable]').forEach(area => {
    // Build stable key from spread id + position index
    const spread = area.closest('.spread');
    if (!area.dataset.key) {
      const allInSpread = Array.from(spread.querySelectorAll('.note-area[contenteditable]'));
      area.dataset.key = (spread?.id || 'unknown') + '-' + allInSpread.indexOf(area);
    }
    // Restore saved content
    const saved = localStorage.getItem('note:' + area.dataset.key);
    if (saved) area.innerHTML = saved;
    // Auto-save on input
    area.addEventListener('input', () => {
      localStorage.setItem('note:' + area.dataset.key, area.innerHTML);
    });
  });
}
initNoteAreas();

/* ── Tag editing ────────────────────────────────────────── */
function initTags() {
  document.querySelectorAll('.part-themes').forEach(initTagContainer);
}

function initTagContainer(container) {
  const key = 'tags:' + container.closest('.spread')?.id;
  const saved = localStorage.getItem(key);

  if (saved) {
    container.innerHTML = '';
    JSON.parse(saved).forEach(text => insertTag(container, text));
  } else {
    Array.from(container.querySelectorAll('.theme-tag'))
      .forEach(tag => enhanceTag(tag, container));
  }

  const btn = document.createElement('button');
  btn.className = 'tag-add-btn';
  btn.textContent = '＋';
  btn.addEventListener('click', () => showTagInput(container));
  container.appendChild(btn);
}

function insertTag(container, text) {
  const tag = document.createElement('div');
  tag.className = 'theme-tag';
  const span = document.createElement('span');
  span.textContent = text;
  tag.appendChild(span);
  enhanceTag(tag, container);
  container.insertBefore(tag, container.querySelector('.tag-add-btn'));
}

function enhanceTag(tag, container) {
  // Wrap bare text node in a span so × stays separate
  if (!tag.querySelector('span')) {
    const text = tag.textContent.trim();
    tag.textContent = '';
    const span = document.createElement('span');
    span.textContent = text;
    tag.appendChild(span);
  }
  const del = document.createElement('button');
  del.className = 'tag-del';
  del.textContent = '×';
  del.title = 'remove';
  del.addEventListener('click', e => {
    e.stopPropagation();
    tag.remove();
    saveTags(container);
  });
  tag.appendChild(del);
}

function showTagInput(container) {
  if (container.querySelector('.tag-input')) return;
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'tag-input';
  input.placeholder = 'add tag...';
  input.maxLength = 28;
  container.insertBefore(input, container.querySelector('.tag-add-btn'));
  input.focus();

  const commit = () => {
    const text = input.value.trim();
    input.remove();
    if (text) { insertTag(container, text); saveTags(container); }
  };
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { input.remove(); }
  });
  input.addEventListener('blur', commit);
}

function saveTags(container) {
  const key = 'tags:' + container.closest('.spread')?.id;
  if (!key) return;
  const tags = Array.from(container.querySelectorAll('.theme-tag span'))
    .map(s => s.textContent.trim()).filter(Boolean);
  localStorage.setItem(key, JSON.stringify(tags));
}

initTags();

/* ── Editable summary & quote ───────────────────────────── */
function initEditableBlocks() {
  document.querySelectorAll('.part-left').forEach(partLeft => {
    const id = partLeft.closest('.spread')?.id;
    if (!id) return;

    // Summary — make the whole div editable
    const summary = partLeft.querySelector('.part-summary');
    if (summary) {
      const key = 'summary:' + id;
      summary.contentEditable = 'true';
      summary.spellcheck = false;
      summary.dataset.ph = 'write a summary...';
      const saved = localStorage.getItem(key);
      if (saved) summary.innerHTML = saved;
      summary.addEventListener('input', () => localStorage.setItem(key, summary.innerHTML));
    }

    // Quote — wrap the text node between the quote marks in an editable span
    const quoteEl = partLeft.querySelector('.key-quote');
    if (quoteEl) {
      const key = 'quote:' + id;
      const textNodes = Array.from(quoteEl.childNodes)
        .filter(n => n.nodeType === 3 && n.textContent.trim());

      if (textNodes.length) {
        const span = document.createElement('span');
        span.className = 'quote-text';
        span.contentEditable = 'true';
        span.spellcheck = false;
        span.dataset.ph = 'write a quote...';
        span.textContent = textNodes.map(n => n.textContent).join('').trim();
        quoteEl.insertBefore(span, textNodes[0]);
        textNodes.forEach(n => quoteEl.removeChild(n));

        const saved = localStorage.getItem(key);
        if (saved) span.textContent = saved;
        span.addEventListener('input', () => localStorage.setItem(key, span.textContent));
      }
    }
  });
}

initEditableBlocks();

/* ── Date picker persistence ────────────────────────────── */
const startDate = document.getElementById('startDate');
if (startDate) {
  const saved = localStorage.getItem('startDate');
  if (saved) startDate.value = saved;
  startDate.addEventListener('change', () => {
    localStorage.setItem('startDate', startDate.value);
  });
}

/* Star rating interaction */
document.querySelectorAll('.stars').forEach(star => {
  const symbols = ['☆','★'];
  const max = 5;
  star.addEventListener('click', e => {
    const text  = star.textContent.replace(/\s/g, '');
    const count = (text.match(/★/g) || []).length;
    const next  = count < max ? count + 1 : 0;
    star.textContent = '★'.repeat(next) + '☆'.repeat(max - next);
  });
});

/* Add extra notes pages */
function addNotesPage(btn) {
  const parentSpread = btn.closest('.spread');
  const colorSource  = parentSpread.querySelector('[style*="--part-color"]');
  const color = colorSource ? colorSource.style.getPropertyValue('--part-color').trim() : '#888';
  const partLabel = parentSpread.querySelector('.part-label, .ext-page-label');
  const partName  = partLabel ? partLabel.textContent.trim() : 'Notes';

  const newId = 'ext-' + Date.now();
  const parentId = parentSpread.id;

  // Count existing extra pages for this parent to show page number
  const siblingCount = document.querySelectorAll(`[data-parent="${parentId}"]`).length + 1;

  const area  = (cls='') => `<div class="note-area ${cls}" contenteditable="true" spellcheck="false" data-ph="write here..."></div>`;

  const html = `
    <div class="spread" id="${newId}" data-parent="${parentId}">
      <div class="page left ext-left" style="--part-color:${color}">
        <div class="ext-header">
          <span class="ext-page-label">${partName} · p.${siblingCount + 1}</span>
          <button class="nav-btn" onclick="flipTo('${parentId}', true)">← Back</button>
        </div>
        <div class="note-area note-area-free" contenteditable="true" spellcheck="false" data-ph="free notes..."></div>
      </div>
      <div class="spine"></div>
      <div class="page right ext-right" style="--part-color:${color}">
        <h3 class="notes-heading">More Notes</h3>
        <div class="notes-grid">
          <div class="note-block">
            <div class="note-label">📝 Notes</div>
            ${area()}
          </div>
          <div class="note-block">
            <div class="note-label">🔖 Quotes</div>
            ${area()}
          </div>
        </div>
        <div class="sticky-note" style="transform:rotate(0.8deg)">
          <div class="sticky-label">Reflections:</div>
          ${area('note-area-tall')}
        </div>
        <div class="add-row" style="margin-top:auto;padding-top:10px">
          <button class="add-page-btn" style="--part-color:${color}" onclick="addNotesPage(this)">＋ add a page</button>
        </div>
      </div>
    </div>`;

  parentSpread.insertAdjacentHTML('afterend', html);
  initNoteAreas(document.getElementById(newId));
  flipTo(newId);
}

/* Keyboard navigation */
document.addEventListener('keydown', e => {
  const current = document.querySelector('.spread.active');
  if (!current) return;
  const id = current.id;
  const map = {
    s0: { ArrowRight: 's1' },
    s1: { ArrowRight: 's2', ArrowLeft: 's0' },
    s2: { ArrowRight: 's3', ArrowLeft: 's1' },
    s3: { ArrowRight: 's4', ArrowLeft: 's2' },
    s4: { ArrowRight: 's5', ArrowLeft: 's3' },
    s5: { ArrowRight: 's6', ArrowLeft: 's4' },
    s6: { ArrowLeft: 's5' },
  };
  const dest = map[id]?.[e.key];
  if (dest) flipTo(dest, e.key === 'ArrowLeft');
});
