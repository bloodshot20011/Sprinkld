/**
 * Artisanal Indian Spices — Universal 5-Theme Engine & Manager
 * Themes:
 * 1. vaanika (Default) — Heritage Burgundy + Saffron + Ivory
 * 2. zaiqa   (Theme 5) — Burnt Orange + Black + White
 * 3. sira    (Theme 6) — Indigo + Lime
 * 4. kavya   (Theme 3) — Deep Plum + Pink
 * 5. aruna   (Theme 2) — Cobalt + White + Terracotta
 */

const THEMES = {
  vaanika: {
    id: 'vaanika',
    name: 'Vaanika',
    tagline: 'Artisanal Spices',
    paletteLabel: 'Heritage Burgundy & Saffron',
    dot1: '#4a121a',
    dot2: '#fea047',
    desc: 'Regal | Artisanal | Warm Heritage',
    isDefault: true
  },
  zaiqa: {
    id: 'zaiqa',
    name: 'Zaiqa',
    tagline: 'Bold & Fiery Terroirs',
    paletteLabel: 'Burnt Orange, Black & White',
    dot1: '#111111',
    dot2: '#e67e22',
    desc: 'Bold | Modern | Energetic'
  },
  sira: {
    id: 'sira',
    name: 'Sira',
    tagline: 'Modern Botanical Chemistry',
    paletteLabel: 'Midnight Indigo & Lime',
    dot1: '#0b132b',
    dot2: '#aeea00',
    desc: 'Modern | Fresh | Unique'
  },
  kavya: {
    id: 'kavya',
    name: 'Kavya',
    tagline: 'Boutique Fine Spices',
    paletteLabel: 'Deep Plum & Pink',
    dot1: '#2b0e1e',
    dot2: '#e8a0bf',
    desc: 'Boutique | Sophisticated | Premium'
  },
  aruna: {
    id: 'aruna',
    name: 'Aruna',
    tagline: 'Pure Origin Spice Estate',
    paletteLabel: 'Cobalt, White & Terracotta',
    dot1: '#0f3460',
    dot2: '#e27d5f',
    desc: 'Clean | Confident | Premium'
  }
};

const THEME_STORAGE_KEY = 'artisanal_active_theme';

function getSavedTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && THEMES[saved]) return saved;
  } catch (e) {}
  return 'vaanika';
}

function applyTheme(themeId, broadcast = true) {
  if (!THEMES[themeId]) themeId = 'vaanika';
  const theme = THEMES[themeId];

  // Set attribute on HTML root
  document.documentElement.setAttribute('data-theme', themeId);
  document.body && document.body.setAttribute('data-theme', themeId);

  // Update dynamic brand texts
  document.querySelectorAll('.brand-dynamic-name').forEach(el => {
    el.textContent = theme.name;
  });
  document.querySelectorAll('.brand-dynamic-tagline').forEach(el => {
    el.textContent = theme.tagline;
  });
  document.querySelectorAll('.brand-dynamic-letter').forEach(el => {
    el.textContent = theme.name.charAt(0);
  });

  // Update active states on theme buttons
  document.querySelectorAll('[data-theme-btn]').forEach(btn => {
    const btnTheme = btn.getAttribute('data-theme-btn');
    if (btnTheme === themeId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Save to localStorage
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch (e) {}

  // Broadcast to iframe / parent
  if (broadcast) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'THEME_SYNC', theme: themeId }, '*');
    }
    const frame = document.getElementById('main-frame');
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage({ type: 'THEME_SYNC', theme: themeId }, '*');
    }
  }

  // Dispatch DOM event for custom listeners
  window.dispatchEvent(new CustomEvent('artisanalThemeChange', { detail: theme }));
}

// Listen for cross-frame messages
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'THEME_SYNC' && event.data.theme) {
    applyTheme(event.data.theme, false);
  }
});

// Listen for storage changes from other tabs
window.addEventListener('storage', (event) => {
  if (event.key === THEME_STORAGE_KEY && event.newValue) {
    applyTheme(event.newValue, false);
  }
});

// Render in-page Floating Theme Switcher if inside child pages or standalone
function renderFloatingThemeWidget() {
  if (document.getElementById('floating-theme-bar')) return;

  const widget = document.createElement('div');
  widget.id = 'floating-theme-bar';
  widget.className = 'floating-theme-widget';
  widget.setAttribute('aria-label', 'Select Spice Maison Theme');

  let html = `
    <div style="display:flex;align-items:center;gap:4px;padding:0 6px;color:#a89b94;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">
      <span class="material-symbols-outlined" style="font-size:14px;color:#fea047;">palette</span>
      <span class="hidden sm:inline">Theme:</span>
    </div>
  `;

  Object.values(THEMES).forEach(theme => {
    html += `
      <button 
        type="button"
        data-theme-btn="${theme.id}" 
        onclick="applyTheme('${theme.id}')" 
        class="theme-pill-btn" 
        title="${theme.name} (${theme.paletteLabel}) — ${theme.desc}">
        <span class="theme-color-dot" style="background: linear-gradient(135deg, ${theme.dot1} 50%, ${theme.dot2} 50%);"></span>
        <span class="theme-text">${theme.name}</span>
      </button>
    `;
  });

  widget.innerHTML = html;
  document.body.appendChild(widget);

  // Set initial active button
  const current = getSavedTheme();
  const activeBtn = widget.querySelector(`[data-theme-btn="${current}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const current = getSavedTheme();
  applyTheme(current, false);
  
  // Render floating widget only if we are in a standalone child page (or not disabled)
  const isParentPortal = document.getElementById('viewport-frame') !== null;
  if (!isParentPortal && !document.getElementById('floating-theme-bar')) {
    renderFloatingThemeWidget();
  }
});

// Immediate execution for fast rendering before DOM load
(function() {
  const current = getSavedTheme();
  document.documentElement.setAttribute('data-theme', current);
})();
