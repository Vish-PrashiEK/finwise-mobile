/**
 * FinWise Mobile - Ultra-Fast Mobile Entry & Balance Engine
 */

const STORAGE_KEYS = {
  ACCOUNTS: 'finwise_mob_accounts_v2',
  TRANSACTIONS: 'finwise_mob_transactions_v2',
  THEME: 'finwise_mob_theme_v2',
  LAST_ACCOUNT: 'finwise_mob_last_acc'
};

// Default accounts matching user's sheet
const DEFAULT_ACCOUNTS = [
  { id: 'acc_sbi', name: 'SBI', type: 'Bank', openingBalance: 5000, color: '#1d4ed8' },
  { id: 'acc_cbi', name: 'CBI', type: 'Bank', openingBalance: 5000, color: '#4f46e5' },
  { id: 'acc_bob', name: 'BOB', type: 'Bank', openingBalance: 9500, color: '#ea580c' },
  { id: 'acc_kotak', name: 'Kotak', type: 'Bank', openingBalance: 10000, color: '#dc2626' },
  { id: 'acc_cash', name: 'Cash Wallet', type: 'Cash', openingBalance: 500, color: '#059669' }
];

// Default sample transactions (matching user's prompt + investments)
const DEFAULT_TRANSACTIONS = [
  {
    id: 'tx_1',
    date: '2026-10-01',
    description: 'October Salary',
    type: 'Income',
    account: 'acc_sbi',
    category: 'Salary',
    paymentMode: 'NetBanking',
    amount: 45000,
    notes: 'Ref: SAL-1026'
  },
  {
    id: 'tx_2',
    date: '2026-10-02',
    description: 'Groceries at Supermarket',
    type: 'Expense',
    account: 'acc_cbi',
    category: 'Groceries',
    paymentMode: 'UPI',
    amount: 1200,
    notes: 'Ref: UPI-9876'
  },
  {
    id: 'tx_3',
    date: '2026-10-03',
    description: 'ATM Cash Withdrawal',
    type: 'Transfer',
    fromAccount: 'acc_sbi',
    toAccount: 'acc_cash',
    category: 'Transfer',
    paymentMode: 'Cash',
    amount: 2000,
    notes: 'To Cash Wallet'
  },
  {
    id: 'tx_4',
    date: '2026-10-04',
    description: 'Local Vegetables & Milk',
    type: 'Expense',
    account: 'acc_cash',
    category: 'Groceries',
    paymentMode: 'Cash',
    amount: 380,
    notes: 'Daily market'
  },
  {
    id: 'tx_5',
    date: '2026-10-05',
    description: 'Nifty 50 Index Fund SIP',
    type: 'Investment',
    account: 'acc_kotak',
    category: 'Mutual Funds',
    paymentMode: 'NetBanking',
    amount: 5000,
    notes: 'Monthly SIP'
  },
  {
    id: 'tx_6',
    date: '2026-10-06',
    description: 'Electricity & Wifi Bill',
    type: 'Expense',
    account: 'acc_bob',
    category: 'Bills & Utilities',
    paymentMode: 'UPI',
    amount: 1850,
    notes: 'Ref: BILL-889'
  },
  {
    id: 'tx_7',
    date: '2026-10-07',
    description: 'Digital Gold SIP',
    type: 'Investment',
    account: 'acc_sbi',
    category: 'Digital Gold',
    paymentMode: 'UPI',
    amount: 2500,
    notes: 'Gold accumulation'
  },
  {
    id: 'tx_8',
    date: '2026-10-08',
    description: 'Weekend Dining with Family',
    type: 'Expense',
    account: 'acc_cbi',
    category: 'Food & Dining',
    paymentMode: 'UPI',
    amount: 1450,
    notes: 'Restaurant'
  }
];

// Rich Fast Categories with Icons
const FAST_CATEGORIES = {
  Expense: [
    { name: 'Groceries', icon: '🛒', label: 'Ration / Sabzi' },
    { name: 'Food & Dining', icon: '🍔', label: 'Khana / Hotel' },
    { name: 'Travel & Fuel', icon: '⛽', label: 'Petrol / Auto' },
    { name: 'Bills & Utilities', icon: '💡', label: 'Recharge / Bill' },
    { name: 'Shopping', icon: '🛍️', label: 'Kapde / Samaano' },
    { name: 'Health & Medical', icon: '💊', label: 'Dawa / Doctor' },
    { name: 'Entertainment', icon: '🎬', label: 'Movie / Fun' },
    { name: 'Rent', icon: '🏠', label: 'Ghar Kiraya' },
    { name: 'Other Expense', icon: '📦', label: 'Anya Kharcha' }
  ],
  Investment: [
    { name: 'Mutual Funds', icon: '📈', label: 'SIP / Mutual Fund' },
    { name: 'Stocks & Shares', icon: '📊', label: 'Share Market' },
    { name: 'Digital Gold', icon: '🥇', label: 'Sona / Gold' },
    { name: 'Fixed Deposit (FD)', icon: '🏦', label: 'Bank FD' },
    { name: 'PPF / PF', icon: '🛡️', label: 'PPF / PF' },
    { name: 'Other Investment', icon: '🚀', label: 'Anya Nivesh' }
  ],
  Income: [
    { name: 'Salary', icon: '💼', label: 'Mahine Ki Salary' },
    { name: 'Business / Freelance', icon: '💻', label: 'Kamai / Dukan' },
    { name: 'Rental Income', icon: '🏠', label: 'Kiraya Aaya' },
    { name: 'Gift / Reward', icon: '🎁', label: 'Inam / Cashback' }
  ],
  Transfer: [
    { name: 'ATM Cash Withdrawal', icon: '🏧', label: 'ATM Se Cash Nikala' },
    { name: 'Bank Transfer', icon: '🔁', label: 'Bank Se Bank Transfer' }
  ]
};

const CATEGORY_COLORS = {
  'Groceries': '#10b981',
  'Food & Dining': '#f59e0b',
  'Travel & Fuel': '#ec4899',
  'Bills & Utilities': '#06b6d4',
  'Shopping': '#8b5cf6',
  'Health & Medical': '#ef4444',
  'Entertainment': '#14b8a6',
  'Rent': '#6366f1',
  'Other Expense': '#64748b',
  'Mutual Funds': '#8b5cf6',
  'Stocks & Shares': '#6366f1',
  'Digital Gold': '#f59e0b',
  'Fixed Deposit (FD)': '#10b981',
  'PPF / PF': '#06b6d4',
  'Other Investment': '#94a3b8'
};

class FinWiseMobile {
  constructor() {
    this.accounts = this.load(STORAGE_KEYS.ACCOUNTS, DEFAULT_ACCOUNTS);
    this.transactions = this.load(STORAGE_KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS);
    this.currentTab = 'home';

    // Fast entry state
    this.fastType = 'Expense';
    this.fastAccount = localStorage.getItem(STORAGE_KEYS.LAST_ACCOUNT) || (this.accounts[0] ? this.accounts[0].id : 'acc_sbi');
    this.fastCategory = 'Groceries';
    this.editingTxId = null;

    this.init();
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(this.accounts));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.transactions));
      localStorage.setItem(STORAGE_KEYS.LAST_ACCOUNT, this.fastAccount);
    } catch (e) {}
  }

  haptic(duration = 15) {
    if (window.navigator && window.navigator.vibrate) {
      try { window.navigator.vibrate(duration); } catch (e) {}
    }
  }

  formatCurrency(val) {
    return '₹' + Number(val || 0).toLocaleString('en-IN');
  }

  toast(text, isSuccess = true) {
    const el = document.getElementById('mobile-toast');
    const txt = document.getElementById('toast-text');
    if (!el || !txt) return;
    txt.textContent = text;
    el.style.borderLeftColor = isSuccess ? 'var(--income)' : 'var(--expense)';
    el.classList.add('show');
    this.haptic(25);
    setTimeout(() => {
      el.classList.remove('show');
    }, 2400);
  }

  init() {
    this.initTheme();
    this.bindEvents();
    this.render();
  }

  initTheme() {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) btn.textContent = saved === 'dark' ? '☀️' : '🌙';
  }

  toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEYS.THEME, next);
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
  }

  // Real-Time Account Balance Calculation
  getAccountBalances() {
    return this.accounts.map(acc => {
      let credits = 0;
      let debits = 0;

      this.transactions.forEach(tx => {
        const amt = Number(tx.amount) || 0;
        if (tx.type === 'Income' && tx.account === acc.id) {
          credits += amt;
        } else if (tx.type === 'Expense' && tx.account === acc.id) {
          debits += amt;
        } else if (tx.type === 'Investment' && tx.account === acc.id) {
          debits += amt;
        } else if (tx.type === 'Transfer') {
          if (tx.fromAccount === acc.id) debits += amt;
          if (tx.toAccount === acc.id) credits += amt;
        }
      });

      const opening = Number(acc.openingBalance) || 0;
      const currentBalance = opening + credits - debits;

      return {
        ...acc,
        openingBalance: opening,
        credits,
        debits,
        currentBalance
      };
    });
  }

  getTotals() {
    const balances = this.getAccountBalances();
    const totalLiquidBalance = balances.reduce((sum, b) => sum + b.currentBalance, 0);

    let totalIncome = 0;
    let totalExpense = 0;
    let totalInvested = 0;

    this.transactions.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'Income') totalIncome += amt;
      else if (tx.type === 'Expense') totalExpense += amt;
      else if (tx.type === 'Investment') totalInvested += amt;
    });

    return { totalLiquidBalance, totalIncome, totalExpense, totalInvested };
  }

  getAnalysis() {
    const expenseCats = {};
    const investCats = {};

    this.transactions.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'Expense') {
        const cat = tx.category || 'Other Expense';
        expenseCats[cat] = (expenseCats[cat] || 0) + amt;
      } else if (tx.type === 'Investment') {
        const cat = tx.category || 'Other Investment';
        investCats[cat] = (investCats[cat] || 0) + amt;
      }
    });

    const totalExpense = Object.values(expenseCats).reduce((s, v) => s + v, 0);
    const totalInvest = Object.values(investCats).reduce((s, v) => s + v, 0);

    const expenseSorted = Object.entries(expenseCats)
      .map(([name, value]) => ({
        label: name,
        value,
        color: CATEGORY_COLORS[name] || '#64748b',
        percent: totalExpense > 0 ? ((value / totalExpense) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.value - a.value);

    const investSorted = Object.entries(investCats)
      .map(([name, value]) => ({
        label: name,
        value,
        color: CATEGORY_COLORS[name] || '#8b5cf6',
        percent: totalInvest > 0 ? ((value / totalInvest) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.value - a.value);

    return {
      totalExpense,
      totalInvest,
      maxExpense: expenseSorted[0] || null,
      minExpense: expenseSorted.length > 1 ? expenseSorted[expenseSorted.length - 1] : expenseSorted[0] || null,
      maxInvest: investSorted[0] || null,
      expenseSorted,
      investSorted
    };
  }

  // Tab Switcher
  switchTab(tabName) {
    this.currentTab = tabName;
    this.haptic(10);

    document.querySelectorAll('.tab-view').forEach(tab => {
      tab.classList.remove('active');
    });
    const target = document.getElementById(`tab-${tabName}`);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  }

  // Fast Entry Drawer
  openFastEntry(tx = null) {
    this.haptic(15);
    const drawer = document.getElementById('fast-entry-drawer');
    const form = document.getElementById('form-fast-entry');
    if (!drawer || !form) return;

    form.reset();

    if (tx) {
      this.editingTxId = tx.id;
      document.getElementById('drawer-form-title').textContent = '✏️ Edit Transaction';
      document.getElementById('fast-amount').value = tx.amount;
      document.getElementById('fast-desc').value = tx.description;
      document.getElementById('fast-mode').value = tx.paymentMode || 'UPI';
      this.setFastType(tx.type);

      if (tx.type === 'Transfer') {
        document.getElementById('fast-transfer-from').value = tx.fromAccount;
        document.getElementById('fast-transfer-to').value = tx.toAccount;
      } else {
        this.fastAccount = tx.account;
        this.fastCategory = tx.category;
      }
    } else {
      this.editingTxId = null;
      document.getElementById('drawer-form-title').textContent = '⚡ Fast Transaction';
      this.setFastType('Expense');
      document.getElementById('fast-desc').value = 'Groceries';
    }

    this.renderFastAccountPills();
    this.renderFastCategoryTiles();

    drawer.classList.add('open');
    setTimeout(() => {
      document.getElementById('fast-amount')?.focus();
    }, 150);
  }

  closeFastEntry() {
    document.getElementById('fast-entry-drawer')?.classList.remove('open');
    this.editingTxId = null;
  }

  setFastType(type) {
    this.fastType = type;
    this.haptic(10);

    document.querySelectorAll('.fast-type-btn').forEach(btn => {
      btn.classList.remove('active', 'type-exp', 'type-inc', 'type-inv', 'type-tra');
      if (btn.getAttribute('data-type') === type) {
        btn.classList.add('active');
        if (type === 'Expense') btn.classList.add('type-exp');
        else if (type === 'Income') btn.classList.add('type-inc');
        else if (type === 'Investment') btn.classList.add('type-inv');
        else if (type === 'Transfer') btn.classList.add('type-tra');
      }
    });

    const isTransfer = type === 'Transfer';
    const boxSingle = document.getElementById('box-single-account');
    const boxTransfer = document.getElementById('box-transfer-account');
    const boxCat = document.getElementById('box-category-tiles');

    if (boxSingle) boxSingle.style.display = isTransfer ? 'none' : 'block';
    if (boxTransfer) boxTransfer.style.display = isTransfer ? 'grid' : 'none';
    if (boxCat) boxCat.style.display = isTransfer ? 'none' : 'block';

    if (isTransfer) {
      this.populateTransferSelects();
      const desc = document.getElementById('fast-desc');
      if (desc && !this.editingTxId) desc.value = 'ATM Cash Withdrawal';
    } else {
      const cats = FAST_CATEGORIES[type] || [];
      if (cats.length > 0) {
        this.fastCategory = cats[0].name;
        const desc = document.getElementById('fast-desc');
        if (desc && !this.editingTxId) desc.value = cats[0].name;
      }
      this.renderFastCategoryTiles();
    }
  }

  renderFastAccountPills() {
    const container = document.getElementById('fast-acc-pills');
    if (!container) return;

    container.innerHTML = this.accounts.map(acc => {
      const isSelected = this.fastAccount === acc.id;
      return `
        <button type="button" class="acc-pill-btn ${isSelected ? 'active' : ''}" data-id="${acc.id}">
          <span class="acc-pill-dot" style="background:${acc.color || '#6366f1'}"></span>
          <span>${acc.name}</span>
        </button>
      `;
    }).join('');

    container.querySelectorAll('.acc-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.fastAccount = btn.getAttribute('data-id');
        this.haptic(10);
        this.renderFastAccountPills();
      });
    });
  }

  renderFastCategoryTiles() {
    const container = document.getElementById('fast-cat-grid');
    if (!container) return;

    const list = FAST_CATEGORIES[this.fastType] || [];
    container.innerHTML = list.map(c => {
      const isSelected = this.fastCategory === c.name;
      return `
        <div class="cat-tile ${isSelected ? 'active' : ''}" data-cat="${c.name}">
          <span class="cat-tile-icon">${c.icon}</span>
          <span class="cat-tile-name">${c.name}</span>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.cat-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const cat = tile.getAttribute('data-cat');
        this.fastCategory = cat;
        this.haptic(10);

        // Auto set description for zero typing!
        const desc = document.getElementById('fast-desc');
        if (desc) desc.value = cat;

        this.renderFastCategoryTiles();
      });
    });
  }

  populateTransferSelects() {
    const from = document.getElementById('fast-transfer-from');
    const to = document.getElementById('fast-transfer-to');
    if (!from || !to) return;

    const opts = this.accounts.map(a => `<option value="${a.id}">${a.name} (${a.type})</option>`).join('');
    from.innerHTML = opts;
    to.innerHTML = opts;

    if (this.accounts.length >= 2) {
      from.value = this.accounts[0].id; // SBI
      to.value = this.accounts[this.accounts.length - 1].id; // Cash Wallet
    }
  }

  handleFastSubmit(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('fast-amount').value);
    const desc = document.getElementById('fast-desc').value.trim() || this.fastCategory;
    const mode = document.getElementById('fast-mode').value;

    if (isNaN(amount) || amount <= 0) {
      alert('Kripya valid amount darj karein!');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    let tx = {
      date: today,
      description: desc,
      type: this.fastType,
      amount,
      paymentMode: mode,
      notes: ''
    };

    if (this.fastType === 'Transfer') {
      const f = document.getElementById('fast-transfer-from').value;
      const t = document.getElementById('fast-transfer-to').value;
      if (f === t) {
        alert('Dono account alag hone chahiye!');
        return;
      }
      tx.fromAccount = f;
      tx.toAccount = t;
      tx.category = 'Transfer';
    } else {
      tx.account = this.fastAccount;
      tx.category = this.fastCategory;
    }

    if (this.editingTxId) {
      const idx = this.transactions.findIndex(t => t.id === this.editingTxId);
      if (idx !== -1) {
        this.transactions[idx] = { ...this.transactions[idx], ...tx };
        this.toast('Transaction update ho gaya!');
      }
    } else {
      tx.id = 'tx_' + Date.now();
      this.transactions.unshift(tx);
      const accObj = this.accounts.find(a => a.id === tx.account);
      const accName = accObj ? accObj.name : 'Account';
      this.toast(`₹${amount} kata ${accName} se!`);
    }

    this.save();
    this.closeFastEntry();
    this.render();
  }

  deleteTx(id) {
    if (confirm('Kya aap is entry ko hatana chahte hain?')) {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.save();
      this.render();
      this.toast('Entry delete ho gayi aur balance sync ho gaya.');
    }
  }

  bindEvents() {
    // Nav tabs
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Theme toggle
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => this.toggleTheme());

    // Fast entry FAB button
    document.getElementById('btn-open-fast-entry')?.addEventListener('click', () => this.openFastEntry());
    document.getElementById('btn-close-drawer')?.addEventListener('click', () => this.closeFastEntry());

    // Drawer backdrop close
    document.getElementById('fast-entry-drawer')?.addEventListener('click', (e) => {
      if (e.target.id === 'fast-entry-drawer') this.closeFastEntry();
    });

    // Fast Type pills
    document.querySelectorAll('.fast-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setFastType(btn.getAttribute('data-type'));
      });
    });

    // Quick amount pills (+50, +100, +200, +500, +1000, +2000)
    document.querySelectorAll('.quick-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const amt = parseFloat(pill.getAttribute('data-amt'));
        const input = document.getElementById('fast-amount');
        if (input) {
          const current = parseFloat(input.value) || 0;
          input.value = current + amt;
          this.haptic(10);
        }
      });
    });

    // Fast form submit
    document.getElementById('form-fast-entry')?.addEventListener('submit', (e) => this.handleFastSubmit(e));

    // Add Account modal
    document.getElementById('btn-open-add-acc')?.addEventListener('click', () => {
      document.getElementById('form-add-acc')?.reset();
      document.getElementById('modal-add-acc')?.classList.add('open');
    });

    document.getElementById('btn-close-acc-modal')?.addEventListener('click', () => {
      document.getElementById('modal-add-acc')?.classList.remove('open');
    });

    document.getElementById('modal-add-acc')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-add-acc') document.getElementById('modal-add-acc')?.classList.remove('open');
    });

    document.getElementById('form-add-acc')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('new-acc-name').value.trim();
      const type = document.getElementById('new-acc-type').value;
      const opening = parseFloat(document.getElementById('new-acc-opening').value) || 0;
      const color = document.getElementById('new-acc-color').value || '#6366f1';

      if (!name) return;
      this.accounts.push({
        id: 'acc_' + Date.now(),
        name,
        type,
        openingBalance: opening,
        color
      });
      this.save();
      document.getElementById('modal-add-acc')?.classList.remove('open');
      this.render();
      this.toast(`Naya Bank "${name}" joda gaya!`);
    });

    // Quick Transfer Banner in Accounts tab
    document.getElementById('banner-quick-transfer')?.addEventListener('click', () => {
      this.openFastEntry();
      this.setFastType('Transfer');
    });

    // Quick export
    document.getElementById('btn-export-quick')?.addEventListener('click', () => this.exportCSV());

    // History filter/search
    document.getElementById('history-search')?.addEventListener('input', () => this.renderHistory());
    document.getElementById('history-filter-type')?.addEventListener('change', () => this.renderHistory());
    document.getElementById('history-filter-account')?.addEventListener('change', () => this.renderHistory());
  }

  render() {
    this.renderHome();
    if (this.currentTab === 'analytics') this.renderAnalytics();
    if (this.currentTab === 'accounts') this.renderAccountsTab();
    if (this.currentTab === 'history') this.renderHistory();
  }

  // Render Tab 1: Home
  renderHome() {
    const totals = this.getTotals();
    const balEl = document.getElementById('home-total-balance');
    const incEl = document.getElementById('home-total-income');
    const expEl = document.getElementById('home-total-expense');
    const invEl = document.getElementById('home-total-invested');

    if (balEl) balEl.textContent = this.formatCurrency(totals.totalLiquidBalance);
    if (incEl) incEl.textContent = '+' + this.formatCurrency(totals.totalIncome);
    if (expEl) expEl.textContent = '-' + this.formatCurrency(totals.totalExpense);
    if (invEl) invEl.textContent = this.formatCurrency(totals.totalInvested);

    // Render Accounts Carousel
    const carousel = document.getElementById('home-accounts-carousel');
    if (carousel) {
      const balances = this.getAccountBalances();
      carousel.innerHTML = balances.map(acc => {
        const isLow = acc.currentBalance < 1000;
        return `
          <div class="mini-acc-card" onclick="window.app.quickAddForAccount('${acc.id}')">
            <div class="mini-acc-top">
              <span class="mini-acc-badge" style="background:${acc.color || '#6366f1'}">${acc.name.substring(0,2).toUpperCase()}</span>
              <span class="mini-acc-type">${acc.type}</span>
            </div>
            <div>
              <div class="mini-acc-name">${acc.name}</div>
              <div class="mini-acc-bal ${isLow ? 'low' : ''}">${this.formatCurrency(acc.currentBalance)}</div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Render Quick Insights Banner
    const insightsContainer = document.getElementById('home-insights-container');
    if (insightsContainer) {
      const a = this.getAnalysis();
      let html = '';
      if (a.maxExpense) {
        html += `
          <div class="highlight-insight-banner">
            <div class="hb-icon">🔥</div>
            <div class="hb-body">
              <div class="hb-title">Sabse Zyada Kharcha</div>
              <div class="hb-main">${a.maxExpense.label} • ${this.formatCurrency(a.maxExpense.value)} (${a.maxExpense.percent}%)</div>
              <div class="hb-sub">Aapke kul kharche ka sabse bada hissa yahan ja raha hai.</div>
            </div>
          </div>
        `;
      }
      if (a.maxInvest) {
        html += `
          <div class="highlight-insight-banner invest-banner">
            <div class="hb-icon">🚀</div>
            <div class="hb-body">
              <div class="hb-title">Top Investment Asset</div>
              <div class="hb-main">${a.maxInvest.label} • ${this.formatCurrency(a.maxInvest.value)}</div>
              <div class="hb-sub">Wealth growth ke liye nivesh continue rakhein.</div>
            </div>
          </div>
        `;
      }
      insightsContainer.innerHTML = html;
    }

    // Render Recent Transactions (Top 6)
    const recentContainer = document.getElementById('home-recent-tx');
    if (recentContainer) {
      const top6 = this.transactions.slice(0, 6);
      recentContainer.innerHTML = this.buildTxRows(top6);
      this.bindTxRowActions(recentContainer);
    }
  }

  quickAddForAccount(accId) {
    this.fastAccount = accId;
    this.openFastEntry();
  }

  buildTxRows(list) {
    if (!list || list.length === 0) {
      return '<div style="text-align:center; padding:24px; color:var(--text-dim); font-size:0.85rem;">Koi entry nahi mili</div>';
    }

    return list.map(tx => {
      let icon = '💸';
      let amtClass = 'expense';
      let sign = '-';
      let accName = '';

      if (tx.type === 'Income') {
        icon = '💰';
        amtClass = 'income';
        sign = '+';
        const a = this.accounts.find(x => x.id === tx.account);
        accName = a ? a.name : 'Bank';
      } else if (tx.type === 'Expense') {
        icon = '🛒';
        amtClass = 'expense';
        sign = '-';
        const a = this.accounts.find(x => x.id === tx.account);
        accName = a ? a.name : 'Bank';
      } else if (tx.type === 'Investment') {
        icon = '📈';
        amtClass = 'invest';
        sign = '-';
        const a = this.accounts.find(x => x.id === tx.account);
        accName = a ? a.name : 'Bank';
      } else if (tx.type === 'Transfer') {
        icon = '🔁';
        amtClass = 'transfer';
        sign = '⇄';
        const f = this.accounts.find(x => x.id === tx.fromAccount);
        const t = this.accounts.find(x => x.id === tx.toAccount);
        accName = `${f ? f.name : '?'} ➔ ${t ? t.name : '?'}`;
      }

      return `
        <div class="tx-item" data-id="${tx.id}">
          <div class="tx-item-left">
            <div class="tx-cat-icon">${icon}</div>
            <div class="tx-details">
              <span class="tx-name">${tx.description}</span>
              <span class="tx-sub-info">
                <span class="tx-bank-tag">${accName}</span>
                <span>• ${tx.date}</span>
              </span>
            </div>
          </div>
          <div class="tx-item-right">
            <span class="tx-amt ${amtClass}">${sign}${this.formatCurrency(tx.amount)}</span>
            <span class="tx-time">${tx.paymentMode || 'UPI'}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  bindTxRowActions(container) {
    container.querySelectorAll('.tx-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        const tx = this.transactions.find(t => t.id === id);
        if (tx) {
          const action = confirm(`"${tx.description} - ₹${tx.amount}"\n\nKya aap ise Edit karna chahte hain? (Cancel karne par Delete ka option milega)`);
          if (action) {
            this.openFastEntry(tx);
          } else {
            this.deleteTx(id);
          }
        }
      });
    });
  }

  // Render Tab 2: Analytics
  renderAnalytics() {
    const a = this.getAnalysis();

    // 3 Cards
    const cards = document.getElementById('analytics-highlight-cards');
    if (cards) {
      cards.innerHTML = `
        <div class="metric-grid-2">
          <div class="metric-box">
            <div class="metric-box-label" style="color:var(--expense)">🔥 Max Kharcha</div>
            <div class="metric-box-val">${a.maxExpense ? a.maxExpense.label : 'N/A'}</div>
            <div class="metric-box-sub">${a.maxExpense ? this.formatCurrency(a.maxExpense.value) + ' (' + a.maxExpense.percent + '%)' : ''}</div>
          </div>
          <div class="metric-box">
            <div class="metric-box-label" style="color:var(--income)">👌 Min Kharcha</div>
            <div class="metric-box-val">${a.minExpense ? a.minExpense.label : 'N/A'}</div>
            <div class="metric-box-sub">${a.minExpense ? this.formatCurrency(a.minExpense.value) + ' (' + a.minExpense.percent + '%)' : ''}</div>
          </div>
        </div>

        <div class="metric-box" style="margin-bottom:14px;">
          <div class="metric-box-label" style="color:var(--invest)">🚀 Sabse Bada Nivesh</div>
          <div class="metric-box-val">${a.maxInvest ? a.maxInvest.label : 'N/A'}</div>
          <div class="metric-box-sub">${a.maxInvest ? this.formatCurrency(a.maxInvest.value) + ' (' + a.maxInvest.percent + '% of portfolio)' : 'SIP shuru karein'}</div>
        </div>
      `;
    }

    if (window.SvgCharts) {
      window.SvgCharts.renderDonut('analytics-chart-expense', a.expenseSorted, {
        centerLabel: 'Total Spend',
        size: 190
      });

      window.SvgCharts.renderDonut('analytics-chart-invest', a.investSorted, {
        centerLabel: 'Total Nivesh',
        size: 190
      });

      // Daily Trend
      const trendMap = {};
      this.transactions.forEach(tx => {
        const d = tx.date;
        if (!trendMap[d]) trendMap[d] = { date: d, income: 0, expense: 0, investment: 0 };
        const amt = Number(tx.amount) || 0;
        if (tx.type === 'Income') trendMap[d].income += amt;
        else if (tx.type === 'Expense') trendMap[d].expense += amt;
        else if (tx.type === 'Investment') trendMap[d].investment += amt;
      });
      const trendData = Object.keys(trendMap).sort().map(d => ({
        ...trendMap[d],
        label: d.split('-')[2] + '/' + d.split('-')[1]
      }));
      window.SvgCharts.renderComparisonTrend('analytics-chart-trend', trendData);
    }

    // 50/30/20 Budget Meter
    const budgetBox = document.getElementById('analytics-budget-meter');
    if (budgetBox) {
      let needs = 0, wants = 0, invest = 0;
      const needsCats = ['Groceries', 'Bills & Utilities', 'Rent', 'Travel & Fuel', 'Health & Medical'];
      this.transactions.forEach(tx => {
        const amt = Number(tx.amount) || 0;
        if (tx.type === 'Expense') {
          if (needsCats.includes(tx.category)) needs += amt;
          else wants += amt;
        } else if (tx.type === 'Investment') {
          invest += amt;
        }
      });
      const tot = needs + wants + invest || 1;
      const np = ((needs / tot) * 100).toFixed(0);
      const wp = ((wants / tot) * 100).toFixed(0);
      const ip = ((invest / tot) * 100).toFixed(0);

      budgetBox.innerHTML = `
        <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:10px;">
          Advisors Rule: Needs 50%, Wants 30%, Investments 20%
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:4px;">
              <span>Needs (50% target)</span>
              <strong>${np}% (${this.formatCurrency(needs)})</strong>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width:${np}%; background:#3b82f6;"></div></div>
          </div>
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:4px;">
              <span>Wants (30% target)</span>
              <strong>${wp}% (${this.formatCurrency(wants)})</strong>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width:${wp}%; background:#f59e0b;"></div></div>
          </div>
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:4px;">
              <span>Investments (20% target)</span>
              <strong>${ip}% (${this.formatCurrency(invest)})</strong>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width:${ip}%; background:#10b981;"></div></div>
          </div>
        </div>
      `;
    }
  }

  // Render Tab 3: Accounts
  renderAccountsTab() {
    const container = document.getElementById('accounts-full-list');
    if (!container) return;

    const balances = this.getAccountBalances();
    container.innerHTML = balances.map(acc => {
      return `
        <div class="tx-item" onclick="window.app.quickAddForAccount('${acc.id}')">
          <div class="tx-item-left">
            <span class="mini-acc-badge" style="background:${acc.color || '#6366f1'}; width:38px; height:38px; font-size:14px;">${acc.name.substring(0,2).toUpperCase()}</span>
            <div class="tx-details">
              <span class="tx-name">${acc.name}</span>
              <span class="tx-sub-info">
                <span>In: +${this.formatCurrency(acc.credits)}</span>
                <span>• Out: -${this.formatCurrency(acc.debits)}</span>
              </span>
            </div>
          </div>
          <div class="tx-item-right">
            <span class="tx-amt" style="color:var(--text-main);">${this.formatCurrency(acc.currentBalance)}</span>
            <span class="tx-time" style="color:var(--primary); font-weight:700;">+ Entry</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Tab 4: History
  renderHistory() {
    const search = (document.getElementById('history-search')?.value || '').toLowerCase();
    const typeFilter = document.getElementById('history-filter-type')?.value || 'all';
    const accFilter = document.getElementById('history-filter-account')?.value || 'all';

    // Populate account filter options
    const accSel = document.getElementById('history-filter-account');
    if (accSel && accSel.children.length <= 1) {
      accSel.innerHTML = '<option value="all">Sabhi Accounts</option>' +
        this.accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
      accSel.value = accFilter;
    }

    const filtered = this.transactions.filter(tx => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (accFilter !== 'all') {
        const matches = tx.account === accFilter || tx.fromAccount === accFilter || tx.toAccount === accFilter;
        if (!matches) return false;
      }
      if (search) {
        const d = (tx.description || '').toLowerCase();
        const c = (tx.category || '').toLowerCase();
        const n = (tx.notes || '').toLowerCase();
        if (!d.includes(search) && !c.includes(search) && !n.includes(search)) return false;
      }
      return true;
    });

    const container = document.getElementById('history-full-list');
    if (container) {
      container.innerHTML = this.buildTxRows(filtered);
      this.bindTxRowActions(container);
    }
  }

  exportCSV() {
    let csv = 'Date,Description,Type,Account,Category,Amount\n';
    this.transactions.forEach(tx => {
      const a = this.accounts.find(x => x.id === tx.account);
      csv += `"${tx.date}","${tx.description}","${tx.type}","${a ? a.name : ''}","${tx.category || ''}",${tx.amount}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FinWise_Mobile_Export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    this.toast('CSV Downloaded!');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new FinWiseMobile();
});
