/**
 * Sprinkled Artisanal Spices — Core Store Engine
 * Features:
 * - Slide-over Cart Drawer & Free Shipping Meter
 * - Mobile 2-Card Grid Support
 * - Press & Hold / Click & Hold Floating Description Tooltip
 */

// ==========================================
// 1. BRAND CONFIGURATION
// ==========================================
const SPRINKLED_CONFIG = {
  name: 'Sprinkled',
  tagline: 'The Art of Pure Terroir Spices',
  primaryColor: '#f97316',
  secondaryColor: '#121212'
};

// ==========================================
// 2. GLOBAL CART MANAGEMENT
// ==========================================
let cart = [
  {
    id: 'tellicherry-pepper',
    name: 'Tellicherry Extra Bold Black Pepper',
    terroir: 'Wayanad, Kerala · Lot 14',
    weight: '85g Glass Jar',
    price: 349.00,
    originalPrice: 420.00,
    qty: 1,
    image: 'assets/product_pepper.jpg'
  },
  {
    id: 'kashmiri-saffron',
    name: 'Kashmiri Mogra Saffron (Grade 1)',
    terroir: 'Pampore, Kashmir · Harvest 2024',
    weight: '5g Luxury Tin',
    price: 899.00,
    originalPrice: 1100.00,
    qty: 1,
    image: 'assets/product_saffron.jpg'
  }
];

function initCart() {
  try {
    const saved = localStorage.getItem('sprinkled_cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) cart = parsed;
    }
  } catch (e) {}
  updateCartUI();
}

function saveCart() {
  try {
    localStorage.setItem('sprinkled_cart', JSON.stringify(cart));
  } catch (e) {}
  updateCartUI();
}

function addToCart(item) {
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.qty += (item.qty || 1);
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      terroir: item.terroir || 'Single Estate Harvest',
      weight: item.weight || '100g Pack',
      price: item.price,
      originalPrice: item.originalPrice || (item.price * 1.2),
      qty: item.qty || 1,
      image: item.image || 'assets/product_chilli.jpg'
    });
  }
  saveCart();
  showToast(`Added to Cart: ${item.name}`, 'shopping_cart');
  toggleCartDrawer(true);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  showToast('Item removed from cart', 'delete');
}

function updateCartQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
      return;
    }
    saveCart();
  }
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Update header count badge & total display
  document.querySelectorAll('.cart-count-badge').forEach(el => {
    el.textContent = totalCount;
  });

  document.querySelectorAll('.cart-header-btn-text').forEach(el => {
    el.textContent = `₹${subtotal.toFixed(0)} (${totalCount})`;
  });

  document.querySelectorAll('.cart-subtotal-val').forEach(el => {
    el.textContent = `₹${subtotal.toFixed(2)}`;
  });

  // Render items in drawer
  const container = document.getElementById('cart-drawer-items');
  if (container) {
    if (cart.length === 0) {
      container.innerHTML = `
        <div class="py-12 text-center text-gray-500 flex flex-col items-center justify-center">
          <span class="material-symbols-outlined text-5xl mb-2 text-gray-300">shopping_cart</span>
          <p class="font-bold text-gray-800 text-base">Your Cart is Empty</p>
          <p class="text-xs text-gray-400 mt-1 mb-6">Explore our pure single-estate spices.</p>
          <a href="shop.html" class="px-6 py-2.5 bg-orange-500 text-white text-xs uppercase font-bold tracking-wider rounded-xl shadow-md">Start Shopping</a>
        </div>
      `;
    } else {
      container.innerHTML = cart.map(item => `
        <div class="flex gap-3.5 pb-4 border-b border-gray-100 items-center">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0" onerror="this.src='assets/product_pepper.jpg'"/>
          <div class="flex-1 min-w-0">
            <h4 class="text-xs font-bold text-gray-900 truncate leading-snug">${item.name}</h4>
            <p class="text-[10px] text-orange-600 font-semibold">${item.terroir}</p>
            <p class="text-[11px] text-gray-500 mt-0.5 font-medium">${item.weight}</p>
            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center border border-gray-200 rounded-lg">
                <button onclick="updateCartQty('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center text-xs text-gray-600 hover:bg-gray-100">-</button>
                <span class="w-6 text-center text-xs font-bold">${item.qty}</span>
                <button onclick="updateCartQty('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center text-xs text-gray-600 hover:bg-gray-100">+</button>
              </div>
              <span class="font-bold text-xs text-gray-900">₹${(item.price * item.qty).toFixed(0)}</span>
              <button onclick="removeFromCart('${item.id}')" class="text-gray-400 hover:text-red-500 p-1">
                <span class="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Free shipping threshold (₹999)
  const threshold = 999.00;
  const progressPercent = Math.min(100, (subtotal / threshold) * 100);
  const diff = threshold - subtotal;

  const bar = document.getElementById('shipping-progress-bar');
  if (bar) bar.style.width = `${progressPercent}%`;

  const msg = document.getElementById('shipping-progress-msg');
  if (msg) {
    if (diff <= 0) {
      msg.innerHTML = `<span class="text-emerald-700 font-bold">🎉 You unlocked Free Express Shipping!</span>`;
    } else {
      msg.innerHTML = `Add <span class="font-bold text-orange-600">₹${diff.toFixed(0)}</span> more to unlock <strong>Free Shipping</strong>`;
    }
  }
}

function toggleCartDrawer(open) {
  const drawer = document.getElementById('cart-drawer');
  if (!drawer) return;

  if (open) {
    drawer.classList.remove('pointer-events-none', 'opacity-0');
    drawer.classList.add('opacity-100');
    const panel = drawer.querySelector('#cart-drawer-panel');
    if (panel) panel.classList.remove('translate-x-full');
  } else {
    const panel = drawer.querySelector('#cart-drawer-panel');
    if (panel) panel.classList.add('translate-x-full');
    setTimeout(() => {
      drawer.classList.remove('opacity-100');
      drawer.classList.add('pointer-events-none', 'opacity-0');
    }, 250);
  }
}

// ==========================================
// 3. PRESS & HOLD FLOATING DESCRIPTION MODAL
// ==========================================
let holdTimer = null;
let isHolding = false;

function initPressAndHoldDescriptions() {
  // Create global floating tooltip modal if not exists
  let modal = document.getElementById('floating-desc-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'floating-desc-modal';
    modal.className = 'fixed inset-0 z-50 pointer-events-none opacity-0 transition-all duration-300 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40';
    modal.innerHTML = `
      <div id="floating-desc-content" class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-orange-200 transform scale-90 transition-transform duration-300 pointer-events-auto space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-gray-100">
          <span class="text-[10px] font-bold uppercase tracking-wider text-orange-600" id="floating-desc-terroir">Terroir Provenance</span>
          <button onclick="closeFloatingDescription()" class="text-gray-400 hover:text-gray-700">
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <h3 class="font-display text-lg font-bold text-gray-950" id="floating-desc-title">Product Name</h3>
        <p class="text-xs text-gray-600 leading-relaxed" id="floating-desc-text">Description details...</p>
        <div class="pt-2 flex items-center justify-between text-[11px] font-semibold text-gray-500 bg-orange-50/60 p-2.5 rounded-xl">
          <span class="text-orange-700 font-bold">🌱 100% Satvic Verified</span>
          <span id="floating-desc-weight">Pack info</span>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Close when clicking outside content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeFloatingDescription();
    });
  }

  // Attach touch/mouse hold listeners to product cards
  document.querySelectorAll('.product-card').forEach(card => {
    const title = card.getAttribute('data-title') || card.querySelector('h3')?.textContent || 'Artisanal Spice';
    const terroir = card.getAttribute('data-terroir') || card.querySelector('.text-orange-600')?.textContent || 'Single Origin';
    const fullDesc = card.getAttribute('data-full-desc') || card.querySelector('.product-full-desc')?.textContent || 'Single-estate royal harvests, stone-milled in micro-batches and sealed in climate-protected amber glass jars.';
    const weight = card.getAttribute('data-weight') || 'Pure Micro-Batch';

    const startHold = (e) => {
      // Don't trigger if clicked on '+ Add' button
      if (e.target.closest('button') || e.target.closest('a')) return;
      isHolding = false;
      clearTimeout(holdTimer);
      holdTimer = setTimeout(() => {
        isHolding = true;
        openFloatingDescription(title, terroir, fullDesc, weight);
      }, 400); // 400ms hold
    };

    const cancelHold = () => {
      clearTimeout(holdTimer);
    };

    // Touch events for mobile
    card.addEventListener('touchstart', startHold, { passive: true });
    card.addEventListener('touchend', cancelHold);
    card.addEventListener('touchmove', cancelHold);

    // Mouse events for desktop
    card.addEventListener('mousedown', startHold);
    card.addEventListener('mouseup', cancelHold);
    card.addEventListener('mouseleave', cancelHold);
  });
}

function openFloatingDescription(title, terroir, desc, weight) {
  const modal = document.getElementById('floating-desc-modal');
  const titleEl = document.getElementById('floating-desc-title');
  const terroirEl = document.getElementById('floating-desc-terroir');
  const textEl = document.getElementById('floating-desc-text');
  const weightEl = document.getElementById('floating-desc-weight');
  const panel = document.getElementById('floating-desc-content');

  if (modal && titleEl && desc) {
    titleEl.textContent = title;
    if (terroirEl) terroirEl.textContent = terroir;
    if (textEl) textEl.textContent = desc;
    if (weightEl) weightEl.textContent = weight;

    modal.classList.remove('pointer-events-none', 'opacity-0');
    modal.classList.add('opacity-100');
    if (panel) {
      panel.classList.remove('scale-90');
      panel.classList.add('scale-100');
    }
  }
}

function closeFloatingDescription() {
  const modal = document.getElementById('floating-desc-modal');
  const panel = document.getElementById('floating-desc-content');
  if (modal) {
    if (panel) {
      panel.classList.remove('scale-100');
      panel.classList.add('scale-90');
    }
    setTimeout(() => {
      modal.classList.remove('opacity-100');
      modal.classList.add('pointer-events-none', 'opacity-0');
    }, 150);
  }
}

// ==========================================
// 4. TOAST NOTIFICATIONS
// ==========================================
function showToast(message, icon = 'check_circle') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 transform opacity-0 translate-y-4';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="px-5 py-3 rounded-full bg-gray-950 text-white shadow-2xl flex items-center gap-3 border border-orange-500/30">
      <span class="material-symbols-outlined text-orange-400 text-lg">${icon}</span>
      <span class="text-xs font-semibold">${message}</span>
    </div>
  `;

  toast.classList.remove('opacity-0', 'translate-y-4');
  toast.classList.add('opacity-100', 'translate-y-0');

  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-4');
  }, 2500);
}

// ==========================================
// 5. INITIALIZATION ON DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  try {
    localStorage.removeItem('sprinkld_theme');
  } catch (e) {}

  initCart();
  initPressAndHoldDescriptions();

  // Mobile navigation drawer toggle
  const menuBtn = document.getElementById('mobile-menu-trigger');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileClose = document.getElementById('mobile-nav-close');

  if (menuBtn && mobileDrawer) {
    menuBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('pointer-events-none', 'opacity-0');
      mobileDrawer.classList.add('opacity-100');
      const panel = mobileDrawer.querySelector('#mobile-nav-panel');
      if (panel) panel.classList.remove('-translate-x-full');
    });
  }

  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => {
      const panel = mobileDrawer.querySelector('#mobile-nav-panel');
      if (panel) panel.classList.add('-translate-x-full');
      setTimeout(() => {
        mobileDrawer.classList.remove('opacity-100');
        mobileDrawer.classList.add('pointer-events-none', 'opacity-0');
      }, 250);
    });
  }
});
