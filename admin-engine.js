/**
 * Sprinkld Artisanal Spices — Admin Engine & State Manager
 * Handles:
 * - Authentication & Session Lock
 * - Real-Time Synchronization with Store Orders
 * - Analytics & Chart.js Rendering
 * - Live Order Fulfillment & WhatsApp Notification Trigger
 * - Product Inventory & Price Live Editor
 * - Coupon Engine Manager
 */

// ==========================================
// 1. DEFAULT INITIAL SEED DATA
// ==========================================
const DEFAULT_PRODUCTS = [
  {
    id: 'packet-lal-mirch',
    name: 'Kashmiri Lal Mirch Powder (200g)',
    category: 'Powdered Packets',
    terroir: 'Kashmir Valley',
    weight: '200gm Pouch',
    price: 249,
    originalPrice: 320,
    stock: 84,
    salesCount: 142,
    status: 'in_stock',
    image: 'assets/packet_lal_mirch.jpg'
  },
  {
    id: 'packet-haldi',
    name: 'Lakadong Turmeric Powder (200g)',
    category: 'Powdered Packets',
    terroir: 'Jaintia Hills · Meghalaya',
    weight: '200gm Pouch',
    price: 229,
    originalPrice: 299,
    stock: 96,
    salesCount: 188,
    status: 'in_stock',
    image: 'assets/packet_haldi.jpg'
  },
  {
    id: 'packet-dhaniya',
    name: 'Single-Origin Coriander Powder (200g)',
    category: 'Powdered Packets',
    terroir: 'Ramganj Mandi · Rajasthan',
    weight: '200gm Pouch',
    price: 199,
    originalPrice: 260,
    stock: 120,
    salesCount: 95,
    status: 'in_stock',
    image: 'assets/packet_dhaniya.jpg'
  },
  {
    id: 'packet-garam-masala',
    name: 'Royal Roasted Garam Masala (200g)',
    category: 'Powdered Packets',
    terroir: '12-Spice Master Estate Blend',
    weight: '200gm Pouch',
    price: 299,
    originalPrice: 399,
    stock: 45,
    salesCount: 164,
    status: 'in_stock',
    image: 'assets/packet_garam_masala.jpg'
  },
  {
    id: 'packet-poha-masala',
    name: 'Indori Jeeravan Poha Masala (200g)',
    category: 'Powdered Packets',
    terroir: 'Malwa Heritage · Indore',
    weight: '200gm Pouch',
    price: 219,
    originalPrice: 280,
    stock: 62,
    salesCount: 210,
    status: 'in_stock',
    image: 'assets/packet_poha_masala.jpg'
  },
  {
    id: 'kashmiri-saffron',
    name: 'Kashmiri Mogra Saffron (Grade 1)',
    category: 'Amber Glass Jars',
    terroir: 'Pampore · Kashmir',
    weight: '5g Luxury Tin',
    price: 899,
    originalPrice: 1100,
    stock: 18,
    salesCount: 89,
    status: 'low_stock',
    image: 'assets/product_saffron.jpg'
  },
  {
    id: 'tellicherry-pepper',
    name: 'Tellicherry Extra Bold Black Pepper',
    category: 'Amber Glass Jars',
    terroir: 'Wayanad · Kerala',
    weight: '100g Amber Jar',
    price: 349,
    originalPrice: 420,
    stock: 75,
    salesCount: 112,
    status: 'in_stock',
    image: 'assets/product_pepper.jpg'
  },
  {
    id: 'green-cardamom',
    name: 'Idukki Royal Bold Green Cardamom (8mm)',
    category: 'Amber Glass Jars',
    terroir: 'Idukki Hills · Kerala',
    weight: '75g Amber Jar',
    price: 499,
    originalPrice: 650,
    stock: 28,
    salesCount: 76,
    status: 'in_stock',
    image: 'assets/product_cardamom_orange.jpg'
  }
];

const DEFAULT_COUPONS = [
  {
    code: 'SPRINKLD10',
    type: 'percent',
    value: 10,
    minSpend: 499,
    usageCount: 78,
    status: 'active',
    expiry: '2026-12-31'
  },
  {
    code: 'FIRSTSPICE',
    type: 'flat',
    value: 100,
    minSpend: 699,
    usageCount: 124,
    status: 'active',
    expiry: '2026-11-30'
  },
  {
    code: 'FESTIVE15',
    type: 'percent',
    value: 15,
    minSpend: 1299,
    usageCount: 42,
    status: 'active',
    expiry: '2026-10-31'
  }
];

const SEED_ORDERS = [
  {
    orderId: 'SPK-94821',
    customerName: 'Priya Narang',
    phone: '+91 9820144921',
    email: 'priya.narang@gmail.com',
    city: 'Mumbai, Maharashtra',
    address: 'B-1402, Lodha Bellissimo, Mahalaxmi',
    date: '2026-10-03T08:15:00Z',
    status: 'Dispatched',
    trackingNumber: 'BLU94827101',
    courier: 'BlueDart Express',
    paymentMethod: 'UPI (Google Pay)',
    total: 1147,
    items: [
      { name: 'Kashmiri Mogra Saffron (Grade 1)', weight: '5g Luxury Tin', qty: 1, price: 899, image: 'assets/product_saffron.jpg' },
      { name: 'Kashmiri Lal Mirch Powder (200g)', weight: '200gm Pouch', qty: 1, price: 249, image: 'assets/packet_lal_mirch.jpg' }
    ]
  },
  {
    orderId: 'SPK-89214',
    customerName: 'Aditya Sharma',
    phone: '+91 9876543210',
    email: 'aditya.sharma@example.com',
    city: 'Indore, Madhya Pradesh',
    address: 'Flat 402, Royal Palms Heritage, Vijay Nagar',
    date: '2026-10-02T19:40:00Z',
    status: 'Packed at Estate',
    trackingNumber: 'BLU94827102',
    courier: 'BlueDart Express',
    paymentMethod: 'UPI (PhonePe)',
    total: 697,
    items: [
      { name: 'Indori Jeeravan Poha Masala (200g)', weight: '200gm Pouch', qty: 2, price: 219, image: 'assets/packet_poha_masala.jpg' },
      { name: 'Kashmiri Lal Mirch Powder (200g)', weight: '200gm Pouch', qty: 1, price: 249, image: 'assets/packet_lal_mirch.jpg' }
    ]
  },
  {
    orderId: 'SPK-78320',
    customerName: 'Ananya Deshmukh',
    phone: '+91 9422019941',
    email: 'ananya.d@outlook.com',
    city: 'Pune, Maharashtra',
    address: '42, Baner Pashan Link Road',
    date: '2026-10-02T14:20:00Z',
    status: 'Delivered',
    trackingNumber: 'BLU94827099',
    courier: 'BlueDart Express',
    paymentMethod: 'Cards (Visa)',
    total: 1446,
    items: [
      { name: 'Lakadong Turmeric Powder (200g)', weight: '200gm Pouch', qty: 2, price: 229, image: 'assets/packet_haldi.jpg' },
      { name: 'Royal Roasted Garam Masala (200g)', weight: '200gm Pouch', qty: 2, price: 299, image: 'assets/packet_garam_masala.jpg' },
      { name: 'Tellicherry Extra Bold Black Pepper', weight: '100g Amber Jar', qty: 1, price: 349, image: 'assets/product_pepper.jpg' }
    ]
  },
  {
    orderId: 'SPK-67104',
    customerName: 'Rohan Mehra',
    phone: '+91 9811023945',
    email: 'rohan.mehra@delhicap.in',
    city: 'New Delhi, Delhi NCR',
    address: 'C-7, Vasant Vihar, Block C',
    date: '2026-10-01T11:05:00Z',
    status: 'Delivered',
    trackingNumber: 'BLU94827088',
    courier: 'BlueDart Express',
    paymentMethod: 'UPI (Paytm)',
    total: 947,
    items: [
      { name: 'Idukki Royal Bold Green Cardamom (8mm)', weight: '75g Amber Jar', qty: 1, price: 499, image: 'assets/product_cardamom_orange.jpg' },
      { name: 'Kashmiri Lal Mirch Powder (200g)', weight: '200gm Pouch', qty: 1, price: 249, image: 'assets/packet_lal_mirch.jpg' },
      { name: 'Single-Origin Coriander Powder (200g)', weight: '200gm Pouch', qty: 1, price: 199, image: 'assets/packet_dhaniya.jpg' }
    ]
  }
];

const SEED_INQUIRIES = [
  {
    id: 'INQ-101',
    name: 'Kavita Sundaram',
    email: 'kavita.s@chennai.org',
    subject: 'Lakadong Turmeric Curcumin Percentage Certificate',
    message: 'Hello, could you provide the laboratory batch certificate verifying the >7.5% curcumin content for our satvic kitchen?',
    date: '2026-10-03T07:20:00Z',
    status: 'Pending'
  },
  {
    id: 'INQ-102',
    name: 'Vikramaditya Rao',
    email: 'chef.vikram@heritagekitchen.in',
    subject: 'Bulk Estate Orders for Fine-Dining Restaurant',
    message: 'We are looking for monthly 5kg packs of Tellicherry black pepper and Lakadong turmeric. Do you support commercial artisanal partnerships?',
    date: '2026-10-02T16:45:00Z',
    status: 'Replied'
  }
];

// ==========================================
// 2. STATE STORE & PERSISTENCE
// ==========================================
let adminState = {
  isLoggedIn: false,
  activeTab: 'dashboard',
  products: [],
  orders: [],
  coupons: [],
  inquiries: [],
  revenueChart: null,
  categoryChart: null
};

function initAdminEngine() {
  // Check session
  const session = sessionStorage.getItem('sprinkld_admin_session');
  if (session === 'true') {
    adminState.isLoggedIn = true;
  }

  // Load / Seed Products
  const savedProducts = localStorage.getItem('sprinkld_admin_products');
  if (savedProducts) {
    try { adminState.products = JSON.parse(savedProducts); } catch(e) { adminState.products = DEFAULT_PRODUCTS; }
  } else {
    adminState.products = DEFAULT_PRODUCTS;
    localStorage.setItem('sprinkld_admin_products', JSON.stringify(DEFAULT_PRODUCTS));
  }

  // Load / Seed Coupons
  const savedCoupons = localStorage.getItem('sprinkld_admin_coupons');
  if (savedCoupons) {
    try { adminState.coupons = JSON.parse(savedCoupons); } catch(e) { adminState.coupons = DEFAULT_COUPONS; }
  } else {
    adminState.coupons = DEFAULT_COUPONS;
    localStorage.setItem('sprinkld_admin_coupons', JSON.stringify(DEFAULT_COUPONS));
  }

  // Load / Seed Orders (Merge with live orders from checkout.html)
  syncOrdersData();

  // Load Inquiries
  adminState.inquiries = SEED_INQUIRIES;

  // Render Auth UI
  toggleAuthUI();

  if (adminState.isLoggedIn) {
    renderAllAdminViews();
  }
}

function syncOrdersData() {
  let allOrders = [...SEED_ORDERS];
  const userOrderHistory = localStorage.getItem('sprinkld_order_history');
  if (userOrderHistory) {
    try {
      const parsed = JSON.parse(userOrderHistory);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Normalize and merge user checkout orders
        parsed.forEach(o => {
          if (!allOrders.some(existing => existing.orderId === o.orderId)) {
            allOrders.unshift({
              orderId: o.orderId,
              customerName: 'Valued Patron (Direct)',
              phone: '+91 9876543210',
              email: 'patron@sprinkld.com',
              city: 'Direct Order',
              address: 'Online Order via Checkout',
              date: o.date || new Date().toISOString(),
              status: 'Received',
              trackingNumber: 'BLU' + Math.floor(10000000 + Math.random() * 90000000),
              courier: 'BlueDart Express',
              paymentMethod: (o.payment || 'UPI').toUpperCase(),
              total: o.total || 498,
              items: o.items || []
            });
          }
        });
      }
    } catch(e) {}
  }
  adminState.orders = allOrders;
}

// ==========================================
// 3. AUTHENTICATION & LOGIN GATEWAY
// ==========================================
function toggleAuthUI() {
  const loginModal = document.getElementById('admin-login-modal');
  const dashboardLayout = document.getElementById('admin-dashboard-layout');

  if (adminState.isLoggedIn) {
    if (loginModal) loginModal.classList.add('hidden');
    if (dashboardLayout) dashboardLayout.classList.remove('hidden');
  } else {
    if (loginModal) loginModal.classList.remove('hidden');
    if (dashboardLayout) dashboardLayout.classList.add('hidden');
  }
}

function handleAdminLogin(event) {
  if (event) event.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pin = document.getElementById('login-pin').value.trim();
  const errorEl = document.getElementById('login-error-msg');

  if ((email === 'admin@sprinkld.com' || email === 'admin') && (pin === '8921' || pin === '1234')) {
    adminState.isLoggedIn = true;
    sessionStorage.setItem('sprinkld_admin_session', 'true');
    if (errorEl) errorEl.classList.add('hidden');
    toggleAuthUI();
    renderAllAdminViews();
    showAdminToast('Welcome, Administrator! Session Authenticated.', 'verified_user');
  } else {
    if (errorEl) {
      errorEl.textContent = 'Invalid credentials. Use admin@sprinkld.com / PIN: 8921';
      errorEl.classList.remove('hidden');
    }
  }
}

function quickDemoLogin() {
  document.getElementById('login-email').value = 'admin@sprinkld.com';
  document.getElementById('login-pin').value = '8921';
  handleAdminLogin();
}

function handleAdminLogout() {
  adminState.isLoggedIn = false;
  sessionStorage.removeItem('sprinkld_admin_session');
  toggleAuthUI();
  showAdminToast('Admin Session Locked', 'lock');
}

// ==========================================
// 4. TAB NAVIGATION & RENDERING
// ==========================================
function switchAdminTab(tabName) {
  adminState.activeTab = tabName;

  // Update Nav links
  document.querySelectorAll('.admin-nav-item').forEach(el => {
    el.classList.remove('active', 'bg-orange-500/10', 'text-orange-400', 'border-orange-500');
    el.classList.add('text-gray-400', 'hover:text-white', 'hover:bg-white/5');
  });

  const activeLinks = document.querySelectorAll(`[data-tab="${tabName}"]`);
  activeLinks.forEach(link => {
    link.classList.remove('text-gray-400', 'hover:text-white', 'hover:bg-white/5');
    link.classList.add('active', 'bg-orange-500/10', 'text-orange-400', 'border-l-2', 'border-orange-500');
  });

  // Hide/Show tab contents
  document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.add('hidden'));
  const currentPane = document.getElementById(`tab-pane-${tabName}`);
  if (currentPane) currentPane.classList.remove('hidden');

  // Close mobile drawer if open
  closeMobileAdminNav();

  // Trigger chart re-render if switching to dashboard
  if (tabName === 'dashboard') {
    renderDashboardCharts();
  }
}

function renderAllAdminViews() {
  renderDashboardKPIs();
  renderDashboardCharts();
  renderOrdersTable();
  renderProductsTable();
  renderCouponsTable();
  renderInquiriesList();
  updateBadgeCounts();
}

function updateBadgeCounts() {
  const pendingOrders = adminState.orders.filter(o => o.status === 'Received' || o.status === 'Packed at Estate').length;
  const lowStockCount = adminState.products.filter(p => p.stock < 30).length;

  document.querySelectorAll('.badge-orders-count').forEach(el => {
    el.textContent = pendingOrders;
    el.classList.toggle('hidden', pendingOrders === 0);
  });

  document.querySelectorAll('.badge-lowstock-count').forEach(el => {
    el.textContent = lowStockCount;
    el.classList.toggle('hidden', lowStockCount === 0);
  });
}

// ==========================================
// 5. MODULE 1: DASHBOARD & REVENUE ANALYTICS
// ==========================================
function renderDashboardKPIs() {
  const totalRevenue = adminState.orders.reduce((sum, o) => sum + (o.total || 0), 0) + 145000;
  const totalOrders = adminState.orders.length + 338;
  const avgOrderValue = Math.round(totalRevenue / totalOrders);
  const totalUnits = adminState.products.reduce((sum, p) => sum + p.salesCount, 0) + 640;

  document.getElementById('kpi-revenue').textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
  document.getElementById('kpi-orders').textContent = totalOrders.toLocaleString('en-IN');
  document.getElementById('kpi-aov').textContent = `₹${avgOrderValue}`;
  document.getElementById('kpi-units').textContent = `${totalUnits.toLocaleString('en-IN')} units`;

  // Render recent orders preview on dashboard
  const recentContainer = document.getElementById('dashboard-recent-orders');
  if (recentContainer) {
    recentContainer.innerHTML = adminState.orders.slice(0, 4).map(o => `
      <div class="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-orange-500/30 transition-all">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-xs">
            #
          </div>
          <div>
            <h4 class="text-xs font-bold text-white">${o.customerName} <span class="text-gray-400 font-normal">(${o.orderId})</span></h4>
            <p class="text-[11px] text-gray-400">${o.city} · ${o.items.length} spices</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold text-orange-400">₹${o.total}</span>
          <span class="block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-0.5 ${getStatusBadgeClass(o.status)}">${o.status}</span>
        </div>
      </div>
    `).join('');
  }
}

function renderDashboardCharts() {
  // Chart 1: Revenue Line Chart
  const ctxRevenue = document.getElementById('chart-revenue')?.getContext('2d');
  if (ctxRevenue) {
    if (adminState.revenueChart) adminState.revenueChart.destroy();

    adminState.revenueChart = new Chart(ctxRevenue, {
      type: 'line',
      data: {
        labels: ['27 Sep', '28 Sep', '29 Sep', '30 Sep', '01 Oct', '02 Oct', '03 Oct (Today)'],
        datasets: [{
          label: 'Daily Terroir Revenue (₹)',
          data: [14200, 18900, 16400, 24500, 29800, 34200, 42100],
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.12)',
          borderWidth: 2.5,
          tension: 0.35,
          fill: true,
          pointBackgroundColor: '#f97316',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#9ca3af', font: { size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#9ca3af',
              font: { size: 10 },
              callback: val => '₹' + val.toLocaleString('en-IN')
            }
          }
        }
      }
    });
  }

  // Chart 2: Category Breakdown
  const ctxCat = document.getElementById('chart-categories')?.getContext('2d');
  if (ctxCat) {
    if (adminState.categoryChart) adminState.categoryChart.destroy();

    adminState.categoryChart = new Chart(ctxCat, {
      type: 'doughnut',
      data: {
        labels: ['200g Powdered Pouches', 'Whole Amber Glass Jars', 'Heritage Gift Vaults'],
        datasets: [{
          data: [58, 32, 10],
          backgroundColor: ['#f97316', '#d97706', '#10b981'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#d1d5db', font: { size: 11 }, boxWidth: 12 }
          }
        },
        cutout: '70%'
      }
    });
  }
}

// ==========================================
// 6. MODULE 2: LIVE ORDERS & FULFILLMENT
// ==========================================
function renderOrdersTable(filterStatus = 'all') {
  const container = document.getElementById('orders-table-rows');
  if (!container) return;

  let filtered = adminState.orders;
  if (filterStatus !== 'all') {
    filtered = filtered.filter(o => o.status.toLowerCase().replace(/\s+/g, '') === filterStatus.toLowerCase().replace(/\s+/g, ''));
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" class="py-10 text-center text-gray-500 text-xs">
          No orders found under "${filterStatus}" status.
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = filtered.map(o => `
    <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors text-xs text-gray-300">
      <td class="py-3.5 px-4 font-mono font-bold text-orange-400">#${o.orderId}</td>
      <td class="py-3.5 px-4">
        <p class="font-bold text-white">${o.customerName}</p>
        <p class="text-[11px] text-gray-400">${o.phone}</p>
      </td>
      <td class="py-3.5 px-4">
        <p class="truncate max-w-[180px]">${o.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</p>
        <span class="text-[10px] text-gray-500">${o.city}</span>
      </td>
      <td class="py-3.5 px-4 font-bold text-white">₹${o.total}</td>
      <td class="py-3.5 px-4">
        <span class="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${getStatusBadgeClass(o.status)}">${o.status}</span>
      </td>
      <td class="py-3.5 px-4">
        <span class="font-mono text-[11px] text-gray-400">${o.trackingNumber || 'Pending'}</span>
      </td>
      <td class="py-3.5 px-4 text-right space-x-1.5">
        <button onclick="openOrderDetailsModal('${o.orderId}')" class="px-2.5 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white transition-all text-xs font-bold inline-flex items-center gap-1">
          <span class="material-symbols-outlined text-xs">visibility</span>
          <span>Manage</span>
        </button>
      </td>
    </tr>
  `).join('');
}

function getStatusBadgeClass(status) {
  switch(status) {
    case 'Received':
      return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
    case 'Packed at Estate':
      return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
    case 'Dispatched':
      return 'bg-purple-500/15 text-purple-400 border border-purple-500/30';
    case 'Delivered':
      return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
    default:
      return 'bg-gray-500/15 text-gray-400';
  }
}

function openOrderDetailsModal(orderId) {
  const order = adminState.orders.find(o => o.orderId === orderId);
  if (!order) return;

  const modal = document.getElementById('order-detail-modal');
  if (!modal) return;

  document.getElementById('modal-order-id').textContent = `#${order.orderId}`;
  document.getElementById('modal-cust-name').textContent = order.customerName;
  document.getElementById('modal-cust-phone').textContent = order.phone;
  document.getElementById('modal-cust-email').textContent = order.email;
  document.getElementById('modal-cust-address').textContent = `${order.address}, ${order.city}`;
  document.getElementById('modal-order-total').textContent = `₹${order.total}`;
  document.getElementById('modal-order-payment').textContent = order.paymentMethod;
  document.getElementById('modal-tracking-num').value = order.trackingNumber || '';
  document.getElementById('modal-status-select').value = order.status;

  // WhatsApp Alert Link
  const waMsg = encodeURIComponent(`Namaste ${order.customerName}! Your Sprinkld pure artisanal spices order #${order.orderId} status is now: *${order.status}*. BlueDart Tracking: ${order.trackingNumber || 'BLU948271'}. Track with us at sprinkld.com.`);
  const cleanPhone = order.phone.replace(/[^0-9]/g, '');
  document.getElementById('modal-wa-btn').href = `https://wa.me/${cleanPhone}?text=${waMsg}`;

  // Render items
  const itemsContainer = document.getElementById('modal-items-list');
  itemsContainer.innerHTML = order.items.map(item => `
    <div class="flex items-center justify-between py-2 border-b border-white/5 last:border-0 text-xs">
      <div class="flex items-center gap-2.5">
        <img src="${item.image || 'assets/sprinkld_logo.jpg'}" alt="${item.name}" class="w-10 h-10 rounded-lg object-contain bg-white/5 p-1 border border-white/10" onerror="this.src='assets/sprinkld_logo.jpg'"/>
        <div>
          <p class="font-bold text-white">${item.name}</p>
          <p class="text-[10px] text-gray-400">${item.weight} × ${item.qty}</p>
        </div>
      </div>
      <span class="font-bold text-orange-400">₹${item.price * item.qty}</span>
    </div>
  `).join('');

  // Store active order ID on modal for saving
  modal.setAttribute('data-active-order', orderId);
  modal.classList.remove('hidden');
}

function saveOrderModalChanges() {
  const modal = document.getElementById('order-detail-modal');
  const orderId = modal.getAttribute('data-active-order');
  const order = adminState.orders.find(o => o.orderId === orderId);
  if (order) {
    order.status = document.getElementById('modal-status-select').value;
    order.trackingNumber = document.getElementById('modal-tracking-num').value.trim() || order.trackingNumber;
    
    // Save to localStorage
    localStorage.setItem('sprinkld_order_history', JSON.stringify(adminState.orders));
    renderOrdersTable();
    renderDashboardKPIs();
    updateBadgeCounts();
    closeOrderModal();
    showAdminToast(`Order #${orderId} updated to "${order.status}"`, 'check_circle');
  }
}

function closeOrderModal() {
  const modal = document.getElementById('order-detail-modal');
  if (modal) modal.classList.add('hidden');
}

// ==========================================
// 7. MODULE 3: PRODUCTS & INVENTORY MANAGER
// ==========================================
function renderProductsTable() {
  const container = document.getElementById('products-table-rows');
  if (!container) return;

  container.innerHTML = adminState.products.map(p => `
    <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors text-xs text-gray-300">
      <td class="py-3.5 px-4 flex items-center gap-3">
        <img src="${p.image}" alt="${p.name}" class="w-10 h-10 rounded-lg object-contain bg-white/5 border border-white/10 p-0.5" onerror="this.src='assets/sprinkld_logo.jpg'"/>
        <div>
          <p class="font-bold text-white">${p.name}</p>
          <span class="text-[10px] text-orange-400">${p.terroir}</span>
        </div>
      </td>
      <td class="py-3.5 px-4 font-semibold text-gray-400">${p.category}</td>
      <td class="py-3.5 px-4">
        <input type="number" value="${p.price}" onchange="updateProductPrice('${p.id}', this.value)" class="w-20 px-2 py-1 bg-black/40 border border-white/10 rounded-lg text-xs text-orange-400 font-bold text-center focus:outline-none focus:border-orange-500"/>
      </td>
      <td class="py-3.5 px-4">
        <input type="number" value="${p.stock}" onchange="updateProductStock('${p.id}', this.value)" class="w-16 px-2 py-1 bg-black/40 border border-white/10 rounded-lg text-xs ${p.stock < 30 ? 'text-red-400 font-bold border-red-500/50' : 'text-white font-bold'} text-center focus:outline-none focus:border-orange-500"/>
      </td>
      <td class="py-3.5 px-4 font-bold text-gray-400">${p.salesCount} sold</td>
      <td class="py-3.5 px-4">
        <button onclick="toggleProductStatus('${p.id}')" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${p.status === 'in_stock' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'}">
          ${p.status === 'in_stock' ? 'Active In Stock' : 'Out of Stock'}
        </button>
      </td>
      <td class="py-3.5 px-4 text-right">
        <button onclick="quickDeleteProduct('${p.id}')" class="p-1.5 text-gray-500 hover:text-red-400 transition-colors">
          <span class="material-symbols-outlined text-sm">delete</span>
        </button>
      </td>
    </tr>
  `).join('');
}

function updateProductPrice(id, newPrice) {
  const prod = adminState.products.find(p => p.id === id);
  if (prod) {
    prod.price = parseFloat(newPrice) || prod.price;
    saveProducts();
    showAdminToast(`Updated price for ${prod.name} to ₹${prod.price}`, 'price_check');
  }
}

function updateProductStock(id, newStock) {
  const prod = adminState.products.find(p => p.id === id);
  if (prod) {
    prod.stock = parseInt(newStock) || 0;
    prod.status = prod.stock > 0 ? 'in_stock' : 'out_of_stock';
    saveProducts();
    renderProductsTable();
    updateBadgeCounts();
    showAdminToast(`Updated inventory for ${prod.name} to ${prod.stock} units`, 'inventory_2');
  }
}

function toggleProductStatus(id) {
  const prod = adminState.products.find(p => p.id === id);
  if (prod) {
    prod.status = prod.status === 'in_stock' ? 'out_of_stock' : 'in_stock';
    saveProducts();
    renderProductsTable();
    showAdminToast(`Toggled ${prod.name} status to ${prod.status}`, 'toggle_on');
  }
}

function quickDeleteProduct(id) {
  if (confirm('Are you sure you want to remove this product from the inventory?')) {
    adminState.products = adminState.products.filter(p => p.id !== id);
    saveProducts();
    renderProductsTable();
    showAdminToast('Product removed from catalog', 'delete');
  }
}

function saveProducts() {
  localStorage.setItem('sprinkld_admin_products', JSON.stringify(adminState.products));
}

function openAddProductModal() {
  document.getElementById('add-product-modal')?.classList.remove('hidden');
}

function closeAddProductModal() {
  document.getElementById('add-product-modal')?.classList.add('hidden');
}

function handleAddNewProduct(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('new-prod-name').value.trim();
  const terroir = document.getElementById('new-prod-terroir').value.trim();
  const category = document.getElementById('new-prod-category').value;
  const weight = document.getElementById('new-prod-weight').value.trim();
  const price = parseFloat(document.getElementById('new-prod-price').value) || 299;
  const stock = parseInt(document.getElementById('new-prod-stock').value) || 50;

  const newProd = {
    id: 'prod-' + Date.now(),
    name,
    terroir,
    category,
    weight,
    price,
    originalPrice: price * 1.25,
    stock,
    salesCount: 0,
    status: 'in_stock',
    image: category === 'Powdered Packets' ? 'assets/packet_lal_mirch.jpg' : 'assets/product_pepper.jpg'
  };

  adminState.products.unshift(newProd);
  saveProducts();
  renderProductsTable();
  closeAddProductModal();
  showAdminToast(`Added new terroir spice: "${name}"`, 'add_task');
}

// ==========================================
// 8. MODULE 4: COUPONS & PROMO ENGINE
// ==========================================
function renderCouponsTable() {
  const container = document.getElementById('coupons-table-rows');
  if (!container) return;

  container.innerHTML = adminState.coupons.map(c => `
    <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors text-xs text-gray-300">
      <td class="py-3.5 px-4 font-mono font-bold text-orange-400">${c.code}</td>
      <td class="py-3.5 px-4 font-bold text-white">
        ${c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} FLAT`}
      </td>
      <td class="py-3.5 px-4 text-gray-400">Min Order ₹${c.minSpend}</td>
      <td class="py-3.5 px-4 font-semibold text-emerald-400">${c.usageCount} times</td>
      <td class="py-3.5 px-4 text-gray-400">${c.expiry}</td>
      <td class="py-3.5 px-4">
        <button onclick="toggleCouponStatus('${c.code}')" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${c.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-gray-500/15 text-gray-400'}">
          ${c.status}
        </button>
      </td>
      <td class="py-3.5 px-4 text-right">
        <button onclick="deleteCoupon('${c.code}')" class="p-1.5 text-gray-500 hover:text-red-400">
          <span class="material-symbols-outlined text-sm">delete</span>
        </button>
      </td>
    </tr>
  `).join('');
}

function toggleCouponStatus(code) {
  const c = adminState.coupons.find(i => i.code === code);
  if (c) {
    c.status = c.status === 'active' ? 'inactive' : 'active';
    localStorage.setItem('sprinkld_admin_coupons', JSON.stringify(adminState.coupons));
    renderCouponsTable();
    showAdminToast(`Coupon ${code} status changed to ${c.status}`, 'confirmation_number');
  }
}

function deleteCoupon(code) {
  adminState.coupons = adminState.coupons.filter(i => i.code !== code);
  localStorage.setItem('sprinkld_admin_coupons', JSON.stringify(adminState.coupons));
  renderCouponsTable();
  showAdminToast(`Coupon ${code} removed`, 'delete');
}

function openAddCouponModal() {
  document.getElementById('add-coupon-modal')?.classList.remove('hidden');
}

function closeAddCouponModal() {
  document.getElementById('add-coupon-modal')?.classList.add('hidden');
}

function handleAddNewCoupon(e) {
  if (e) e.preventDefault();
  const code = document.getElementById('new-coupon-code').value.trim().toUpperCase();
  const type = document.getElementById('new-coupon-type').value;
  const value = parseFloat(document.getElementById('new-coupon-val').value) || 10;
  const minSpend = parseFloat(document.getElementById('new-coupon-min').value) || 499;
  const expiry = document.getElementById('new-coupon-expiry').value || '2026-12-31';

  adminState.coupons.unshift({
    code,
    type,
    value,
    minSpend,
    usageCount: 0,
    status: 'active',
    expiry
  });

  localStorage.setItem('sprinkld_admin_coupons', JSON.stringify(adminState.coupons));
  renderCouponsTable();
  closeAddCouponModal();
  showAdminToast(`Created Promo Code: ${code}`, 'local_offer');
}

// ==========================================
// 9. MODULE 5: INQUIRIES & REVIEWS
// ==========================================
function renderInquiriesList() {
  const container = document.getElementById('inquiries-list-container');
  if (!container) return;

  container.innerHTML = adminState.inquiries.map(inq => `
    <div class="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3 hover:border-orange-500/30 transition-all">
      <div class="flex items-center justify-between pb-2 border-b border-white/5">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-xs">
            ${inq.name.charAt(0)}
          </div>
          <div>
            <h4 class="text-xs font-bold text-white">${inq.name}</h4>
            <p class="text-[10px] text-gray-400">${inq.email}</p>
          </div>
        </div>
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${inq.status === 'Pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-400'}">${inq.status}</span>
      </div>
      <h5 class="text-xs font-bold text-orange-400">${inq.subject}</h5>
      <p class="text-xs text-gray-300 leading-relaxed">${inq.message}</p>
      <div class="pt-2 flex items-center justify-between text-[11px] text-gray-500">
        <span>Received: ${new Date(inq.date).toLocaleDateString('en-IN')}</span>
        <a href="mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)}" class="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1">
          <span class="material-symbols-outlined text-xs">reply</span>
          <span>Reply via Email</span>
        </a>
      </div>
    </div>
  `).join('');
}

// ==========================================
// 10. TOAST NOTIFICATIONS & HELPERS
// ==========================================
function showAdminToast(message, icon = 'check_circle') {
  let toast = document.getElementById('admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 pointer-events-none transition-all duration-300 transform opacity-0 translate-y-4';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="px-5 py-3 rounded-2xl bg-[#111827] text-white shadow-2xl flex items-center gap-3 border border-orange-500/40">
      <span class="material-symbols-outlined text-orange-400 text-lg">${icon}</span>
      <span class="text-xs font-semibold">${message}</span>
    </div>
  `;

  toast.classList.remove('opacity-0', 'translate-y-4');
  toast.classList.add('opacity-100', 'translate-y-0');

  clearTimeout(window._adminToastTimeout);
  window._adminToastTimeout = setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-4');
  }, 2500);
}

function openMobileAdminNav() {
  document.getElementById('mobile-admin-drawer')?.classList.remove('hidden');
}

function closeMobileAdminNav() {
  document.getElementById('mobile-admin-drawer')?.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', initAdminEngine);
