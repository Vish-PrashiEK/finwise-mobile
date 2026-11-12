/**
 * FinWise Mobile - Ultra-Fast Mobile Entry & Balance Engine
 */

const STORAGE_KEYS = {
  ACCOUNTS: 'finwise_mob_accounts_v6',
  TRANSACTIONS: 'finwise_mob_transactions_v5',
  REMINDERS: 'finwise_mob_reminders_v1',
  THEME: 'finwise_mob_theme_v2',
  LAST_ACCOUNT: 'finwise_mob_last_acc',
  USER_SESSION: 'finwise_user_session',
  LAST_SYNC: 'finwise_last_drive_sync'
};

// Default Accounts (BOB removed as requested, customizable by any user)
const DEFAULT_ACCOUNTS = [
  { id: 'acc_sbi', name: 'SBI', type: 'Savings Bank', openingBalance: 0, color: '#1d4ed8' },
  { id: 'acc_cbi', name: 'CBI', type: 'Savings Bank', openingBalance: 0, color: '#4f46e5' },
  { id: 'acc_kotak', name: 'Kotak', type: 'Savings Bank', openingBalance: 0, color: '#dc2626' },
  { id: 'acc_cash', name: 'Cash Wallet', type: 'Cash Wallet', openingBalance: 0, color: '#059669' }
];

// 100% Blank Transactions
const DEFAULT_TRANSACTIONS = [];

// Default Reminder Templates
const DEFAULT_REMINDERS = [
  {
    id: 'rem_1',
    title: 'Ghar Kiraya (Rent)',
    amount: 12000,
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    account: 'acc_sbi',
    category: 'Rent'
  },
  {
    id: 'rem_2',
    title: 'Bijli & WiFi Bill',
    amount: 1500,
    dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    account: 'acc_sbi',
    category: 'Bills & Utilities'
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
  'Digital Gold': ' #f59e0b',
  'Fixed Deposit (FD)': '#10b981',
  'PPF / PF': '#06b6d4',
  'Other Investment': '#94a3b8'
};

class FinWiseMobile {
  constructor() {
    this.accounts = this.load(STORAGE_KEYS.ACCOUNTS, DEFAULT_ACCOUNTS);
    this.transactions = this.load(STORAGE_KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS);
    this.reminders = this.load(STORAGE_KEYS.REMINDERS, DEFAULT_REMINDERS);
    this.user = this.load(STORAGE_KEYS.USER_SESSION, null);
    this.lastDriveSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || null;
    this.balanceHidden = localStorage.getItem('finwise_balance_hidden') === 'true';
    this.currentTab = 'home';

    // Fast entry state
    this.fastType = 'Expense';
    this.fastAccount = localStorage.getItem(STORAGE_KEYS.LAST_ACCOUNT) || (this.accounts[0] ? this.accounts[0].id : 'acc_sbi');
    this.fastCategory = 'Groceries';
    this.fastDate = new Date().toISOString().split('T')[0];
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
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(this.reminders));
      localStorage.setItem(STORAGE_KEYS.LAST_ACCOUNT, this.fastAccount);

      // Automatic rolling backup snapshot whenever transactions exist
      if (this.transactions && this.transactions.length > 0) {
        const backupSnapshot = {
          accounts: this.accounts,
          transactions: this.transactions,
          reminders: this.reminders,
          timestamp: Date.now(),
          dateStr: new Date().toLocaleString('en-IN')
        };
        localStorage.setItem('finwise_auto_backup_rolling', JSON.stringify(backupSnapshot));
      }
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
      this.setDateSelection(tx.date);
    } else {
      this.editingTxId = null;
      document.getElementById('drawer-form-title').textContent = '⚡ Fast Transaction';
      this.setFastType('Expense');
      document.getElementById('fast-desc').value = 'Groceries';
      this.setDateSelection(new Date().toISOString().split('T')[0]);
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

  setDateSelection(dateStr) {
    const input = document.getElementById('fast-tx-date');
    if (input) input.value = dateStr;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const btnToday = document.getElementById('btn-date-today');
    const btnYest = document.getElementById('btn-date-yesterday');

    if (btnToday) btnToday.classList.toggle('active', dateStr === today);
    if (btnYest) btnYest.classList.toggle('active', dateStr === yesterday);
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

    const dateInput = document.getElementById('fast-tx-date');
    const txDate = (dateInput && dateInput.value) ? dateInput.value : new Date().toISOString().split('T')[0];

    let tx = {
      date: txDate,
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

  initVoice() {
    const micBtn = document.getElementById('btn-voice-mic');
    const statusPill = document.getElementById('voice-status-pill');
    if (!micBtn) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      micBtn.style.display = 'none';
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    micBtn.addEventListener('click', () => {
      try {
        micBtn.classList.add('listening');
        if (statusPill) {
          statusPill.style.display = 'block';
          statusPill.textContent = '🔴 Sun raha hoon... Boliye (e.g. "Petrol 500 SBI")';
        }
        this.haptic(20);
        recognition.start();
      } catch (err) {
        try { recognition.stop(); } catch(e){}
        micBtn.classList.remove('listening');
      }
    });

    recognition.onresult = (event) => {
      micBtn.classList.remove('listening');
      if (statusPill) statusPill.style.display = 'none';

      const transcript = (event.results[0][0].transcript || '').toLowerCase();
      this.parseVoiceCommand(transcript);
    };

    recognition.onerror = () => {
      micBtn.classList.remove('listening');
      if (statusPill) statusPill.style.display = 'none';
      this.toast('Awaaz samajh nahi aayi, dobara boliye', false);
    };

    recognition.onend = () => {
      micBtn.classList.remove('listening');
      if (statusPill) statusPill.style.display = 'none';
    };
  }

  parseVoiceCommand(text) {
    const amountMatch = text.match(/\d+(\.\d+)?/);
    if (amountMatch) {
      const amtInput = document.getElementById('fast-amount');
      if (amtInput) amtInput.value = amountMatch[0];
    }

    if (text.includes('sbi')) {
      this.fastAccount = 'acc_sbi';
    } else if (text.includes('cbi') || text.includes('central')) {
      this.fastAccount = 'acc_cbi';
    } else if (text.includes('bob') || text.includes('baroda')) {
      this.fastAccount = 'acc_bob';
    } else if (text.includes('kotak')) {
      this.fastAccount = 'acc_kotak';
    } else if (text.includes('cash') || text.includes('rokda') || text.includes('wallet')) {
      this.fastAccount = 'acc_cash';
    }

    if (text.includes('petrol') || text.includes('diesel') || text.includes('fuel') || text.includes('auto') || text.includes('cab')) {
      this.setFastType('Expense');
      this.fastCategory = 'Travel & Fuel';
    } else if (text.includes('grocery') || text.includes('ration') || text.includes('sabzi') || text.includes('dmart') || text.includes('d-mart') || text.includes('milk') || text.includes('doodh')) {
      this.setFastType('Expense');
      this.fastCategory = 'Groceries';
    } else if (text.includes('khana') || text.includes('hotel') || text.includes('chai') || text.includes('dinner') || text.includes('lunch') || text.includes('food') || text.includes('swiggy') || text.includes('zomato')) {
      this.setFastType('Expense');
      this.fastCategory = 'Food & Dining';
    } else if (text.includes('sip') || text.includes('mutual')) {
      this.setFastType('Investment');
      this.fastCategory = 'Mutual Funds';
    } else if (text.includes('gold') || text.includes('sona')) {
      this.setFastType('Investment');
      this.fastCategory = 'Digital Gold';
    } else if (text.includes('salary') || text.includes('pagaar')) {
      this.setFastType('Income');
      this.fastCategory = 'Salary';
    } else if (text.includes('bill') || text.includes('recharge') || text.includes('bijli') || text.includes('wifi')) {
      this.setFastType('Expense');
      this.fastCategory = 'Bills & Utilities';
    }

    const descInput = document.getElementById('fast-desc');
    if (descInput) descInput.value = this.fastCategory;

    this.renderFastAccountPills();
    this.renderFastCategoryTiles();
    this.haptic(30);
    this.toast(`Voice: "${text}" pehchana!`);
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

    // Balance Privacy Toggle (Eye icon)
    document.getElementById('btn-toggle-balance-privacy')?.addEventListener('click', () => {
      this.balanceHidden = !this.balanceHidden;
      localStorage.setItem('finwise_balance_hidden', this.balanceHidden);
      this.haptic(10);
      this.renderHome();
    });

    // Settings & Backup modal
    document.getElementById('btn-open-settings')?.addEventListener('click', () => {
      document.getElementById('modal-settings')?.classList.add('open');
    });

    document.getElementById('btn-close-settings-modal')?.addEventListener('click', () => {
      document.getElementById('modal-settings')?.classList.remove('open');
    });

    document.getElementById('modal-settings')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-settings') document.getElementById('modal-settings')?.classList.remove('open');
    });

    // Settings Actions: Data Recovery, JSON Download, File Restore & Protected Reset
    document.getElementById('btn-recover-lost-data')?.addEventListener('click', () => this.recoverLostData());
    document.getElementById('btn-download-json-backup')?.addEventListener('click', () => this.downloadJsonBackup());
    document.getElementById('input-restore-backup')?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        this.restoreBackupFromFile(file);
        e.target.value = '';
      }
    });
    document.getElementById('btn-protected-reset')?.addEventListener('click', () => this.protectedReset());

    // Google Sign-In & WhatsApp-style Google Drive Sync
    document.getElementById('btn-google-sign-in')?.addEventListener('click', () => this.loginWithGoogle());
    document.getElementById('btn-google-logout')?.addEventListener('click', () => this.logoutGoogle());
    document.getElementById('btn-sync-gdrive')?.addEventListener('click', () => this.syncGoogleDriveBackup());

    // Voice recognition (Speech to Transaction)
    this.initVoice();

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

    // Date selection pills
    document.getElementById('btn-date-today')?.addEventListener('click', () => {
      this.setDateSelection(new Date().toISOString().split('T')[0]);
      this.haptic(10);
    });
    document.getElementById('btn-date-yesterday')?.addEventListener('click', () => {
      const yest = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      this.setDateSelection(yest);
      this.haptic(10);
    });
    document.getElementById('fast-tx-date')?.addEventListener('change', (e) => {
      this.setDateSelection(e.target.value);
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

    // Bank template chip clicks
    document.querySelectorAll('.chip-bank-template').forEach(chip => {
      chip.addEventListener('click', () => {
        const name = chip.getAttribute('data-name');
        const color = chip.getAttribute('data-color');
        const nameInput = document.getElementById('new-acc-name');
        const colorInput = document.getElementById('new-acc-color');
        if (nameInput) nameInput.value = name;
        if (colorInput) colorInput.value = color || '#6366f1';
        this.haptic(10);
      });
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

    // Reminder modal & events
    document.getElementById('btn-open-reminder-modal')?.addEventListener('click', () => {
      document.getElementById('form-reminder')?.reset();
      const accSelect = document.getElementById('rem-account');
      if (accSelect) {
        accSelect.innerHTML = this.accounts.map(a => `<option value="${a.id}">${a.name} (${a.type})</option>`).join('');
      }
      const remDate = document.getElementById('rem-date');
      if (remDate) {
        remDate.value = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
      }
      document.getElementById('modal-reminder')?.classList.add('open');
    });

    document.getElementById('btn-close-reminder-modal')?.addEventListener('click', () => {
      document.getElementById('modal-reminder')?.classList.remove('open');
    });

    document.getElementById('modal-reminder')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-reminder') document.getElementById('modal-reminder')?.classList.remove('open');
    });

    // Reminder template chip clicks
    document.querySelectorAll('.chip-rem-template').forEach(chip => {
      chip.addEventListener('click', () => {
        const title = chip.getAttribute('data-title');
        const cat = chip.getAttribute('data-cat');
        const titleInput = document.getElementById('rem-title');
        const catSelect = document.getElementById('rem-category');
        if (titleInput) titleInput.value = title;
        if (catSelect && cat) catSelect.value = cat;
        this.haptic(10);
      });
    });

    document.getElementById('form-reminder')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('rem-title').value.trim();
      const amount = parseFloat(document.getElementById('rem-amount').value);
      const dueDate = document.getElementById('rem-date').value;
      const account = document.getElementById('rem-account').value;
      const category = document.getElementById('rem-category').value;

      if (!title || isNaN(amount) || amount <= 0 || !dueDate) {
        alert('Kripya valid title, amount aur due date bharein!');
        return;
      }

      this.reminders.push({
        id: 'rem_' + Date.now(),
        title,
        amount,
        dueDate,
        account,
        category
      });

      this.save();
      document.getElementById('modal-reminder')?.classList.remove('open');
      this.render();
      this.toast(`"${title}" reminder set ho gaya!`);
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
    this.renderReminders();
    this.renderUserAuthUI();
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
    const eyeBtn = document.getElementById('btn-toggle-balance-privacy');

    if (balEl) {
      balEl.textContent = this.balanceHidden ? '₹ ••••••' : this.formatCurrency(totals.totalLiquidBalance);
    }
    if (eyeBtn) {
      eyeBtn.textContent = this.balanceHidden ? '🙈' : '👁️';
    }
    if (incEl) incEl.textContent = '+' + this.formatCurrency(totals.totalIncome);
    if (expEl) expEl.textContent = '-' + this.formatCurrency(totals.totalExpense);
    if (invEl) invEl.textContent = this.formatCurrency(totals.totalInvested);

    // Bank Themes (Refined Metal Card Look)
    const BANK_THEMES = {
      'SBI': { bg: 'linear-gradient(135deg, #091a38 0%, #152e5a 50%, #1d4ed8 100%)', border: 'rgba(59, 130, 246, 0.4)', icon: '🏛️' },
      'CBI': { bg: 'linear-gradient(135deg, #1b124a 0%, #2f2275 50%, #4f46e5 100%)', border: 'rgba(99, 102, 241, 0.4)', icon: '🏦' },
      'BOB': { bg: 'linear-gradient(135deg, #2c1206 0%, #52200a 50%, #ea580c 100%)', border: 'rgba(234, 88, 12, 0.4)', icon: '🦁' },
      'Kotak': { bg: 'linear-gradient(135deg, #2b0b0b 0%, #541414 50%, #dc2626 100%)', border: 'rgba(239, 68, 68, 0.4)', icon: '🔴' },
      'Cash Wallet': { bg: 'linear-gradient(135deg, #04251d 0%, #08493a 50%, #059669 100%)', border: 'rgba(16, 185, 129, 0.4)', icon: '💵' }
    };

    // Render Accounts Carousel (ATM Card Style)
    const carousel = document.getElementById('home-accounts-carousel');
    if (carousel) {
      const balances = this.getAccountBalances();
      carousel.innerHTML = balances.map(acc => {
        const theme = BANK_THEMES[acc.name] || {
          bg: 'linear-gradient(135deg, #141724 0%, #232a3d 100%)',
          border: 'rgba(255, 255, 255, 0.12)',
          icon: '💳'
        };
        const isLow = acc.currentBalance < 1000;

        return `
          <div class="mini-acc-card" style="background:${theme.bg}; border:1px solid ${theme.border};" onclick="window.app.quickAddForAccount('${acc.id}')">
            <div class="mini-acc-top">
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="font-size:16px;">${theme.icon}</span>
                <span class="mini-acc-name" style="color:#ffffff; font-weight:800; font-size:0.92rem; margin:0;">${acc.name}</span>
              </div>
              <span style="font-size:12px; color:rgba(255,255,255,0.65); letter-spacing:1px; font-weight:700;">(((•)))</span>
            </div>
            <div style="margin:8px 0 6px;">
              <div style="width:26px; height:18px; background:linear-gradient(135deg, #fbbf24 0%, #d97706 100%); border-radius:3px; opacity:0.85; margin-bottom:6px; box-shadow:inset 0 0 2px rgba(0,0,0,0.5);"></div>
              <div class="mini-acc-bal ${isLow ? 'low' : ''}" style="font-size:1.15rem; font-weight:900; letter-spacing:-0.02em;">${this.formatCurrency(acc.currentBalance)}</div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="mini-acc-type" style="color:rgba(255,255,255,0.7); font-size:0.68rem; font-weight:700;">${acc.type}</span>
              <span style="font-size:10px; background:rgba(255,255,255,0.18); backdrop-filter:blur(4px); padding:2px 8px; border-radius:99px; color:#fff; font-weight:700;">+ ADD</span>
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
      if (!a.maxExpense && !a.maxInvest) {
        html = `
          <div class="highlight-insight-banner" style="border-left-color:var(--primary);">
            <div class="hb-icon">✨</div>
            <div class="hb-body">
              <div class="hb-title">Clean Slate (Fresh Start)</div>
              <div class="hb-main">Aapke 5 Bank Khate Ready Hain!</div>
              <div class="hb-sub">Niche <strong>+ FAST ADD</strong> button dabakar apni pehli payment ya kamai darj karein.</div>
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
      return `
        <div style="text-align:center; padding:32px 16px; background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
          <div style="font-size:38px; margin-bottom:8px;">📝</div>
          <div style="font-weight:800; font-size:1.05rem; color:#fff; margin-bottom:4px;">Koi Entry Nahi Hai</div>
          <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4;">
            Sabhi temporary demo data hata diya gaya hai.<br/>
            Niche <strong>+ FAST ADD</strong> button dabakar apni pehli entry karein!
          </div>
        </div>
      `;
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
        <div class="tx-item" style="cursor:default; margin-bottom:10px;">
          <div class="tx-item-left">
            <span class="mini-acc-badge" style="background:${acc.color || '#6366f1'}; width:42px; height:42px; font-size:15px;">${acc.name.substring(0,2).toUpperCase()}</span>
            <div class="tx-details">
              <span class="tx-name" style="font-size:1.05rem;">${acc.name}</span>
              <span class="tx-sub-info" style="font-size:0.74rem;">
                <span>Opening: ${this.formatCurrency(acc.openingBalance)}</span>
                <span>• In: +${this.formatCurrency(acc.credits)}</span>
                <span>• Out: -${this.formatCurrency(acc.debits)}</span>
              </span>
            </div>
          </div>
          <div class="tx-item-right" style="gap:6px;">
            <span class="tx-amt" style="color:var(--text-main); font-size:1.15rem;">${this.formatCurrency(acc.currentBalance)}</span>
            <div style="display:flex; gap:6px; margin-top:2px;">
              <button class="quick-pill" style="padding:4px 8px; font-size:0.72rem; background:var(--primary); color:#fff; border-color:var(--primary);" onclick="window.app.quickAddForAccount('${acc.id}')">+ Add</button>
              <button class="quick-pill" style="padding:4px 8px; font-size:0.72rem;" onclick="window.app.editOpeningBalance('${acc.id}')">✏️ Edit</button>
              <button class="quick-pill" style="padding:4px 8px; font-size:0.72rem; color:var(--expense); border-color:rgba(244,63,94,0.3);" onclick="window.app.closeAccount('${acc.id}')" title="Account Band / Delete Karein">❌ Close</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  editOpeningBalance(accId) {
    const acc = this.accounts.find(a => a.id === accId);
    if (!acc) return;
    const current = acc.openingBalance || 0;
    const entered = prompt(`${acc.name} ka Shuruati (Opening) Balance set karein (₹):`, current);
    if (entered !== null) {
      const parsed = parseFloat(entered);
      if (!isNaN(parsed) && parsed >= 0) {
        acc.openingBalance = parsed;
        this.save();
        this.render();
        this.toast(`${acc.name} ka Balance ₹${parsed.toLocaleString('en-IN')} set ho gaya!`);
      } else {
        alert('Kripya valid number daalein');
      }
    }
  }

  closeAccount(accId) {
    const acc = this.accounts.find(a => a.id === accId);
    if (!acc) return;
    if (this.accounts.length <= 1) {
      alert('Kam se kam ek account hona zaroori hai!');
      return;
    }
    const hasTx = this.transactions.some(t => t.account === accId || t.fromAccount === accId || t.toAccount === accId);
    const msg = hasTx
      ? `"${acc.name}" account ko band / delete karne se yeh naye transactions ke liye hat jayega (purani entries history me rahengi).\n\nKya aap ise band karna chahte hain?`
      : `Kya aap "${acc.name}" account ko band / delete karna chahte hain?`;

    if (confirm(msg)) {
      this.accounts = this.accounts.filter(a => a.id !== accId);
      if (this.fastAccount === accId) {
        this.fastAccount = this.accounts[0].id;
      }
      this.save();
      this.render();
      this.toast(`"${acc.name}" account band kar diya gaya!`);
    }
  }

  renderReminders() {
    const container = document.getElementById('home-reminders-list');
    if (!container) return;

    if (!this.reminders || this.reminders.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:18px; background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); font-size:0.82rem; color:var(--text-muted);">
          Koi reminder set nahi hai. <strong>+ Naya Reminder</strong> dabakar bill ya rent ka reminder lagayein!
        </div>
      `;
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const todayMs = new Date(todayStr).getTime();
    const sorted = [...this.reminders].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    container.innerHTML = sorted.map(rem => {
      const dueMs = new Date(rem.dueDate).getTime();
      const diffDays = Math.round((dueMs - todayMs) / (1000 * 60 * 60 * 24));

      let badgeHtml = '';
      let cardClass = '';

      if (diffDays < 0) {
        badgeHtml = `<span class="reminder-badge badge-urgent">Overdue (${Math.abs(diffDays)} din pehle)</span>`;
        cardClass = 'urgent';
      } else if (diffDays === 0) {
        badgeHtml = `<span class="reminder-badge badge-today">🔥 Aaj Due Hai</span>`;
        cardClass = 'due-today';
      } else if (diffDays <= 3) {
        badgeHtml = `<span class="reminder-badge badge-upcoming">⚠️ ${diffDays} Din Bache Hain</span>`;
        cardClass = 'upcoming';
      } else {
        badgeHtml = `<span class="reminder-badge badge-normal">📅 ${rem.dueDate}</span>`;
      }

      const accObj = this.accounts.find(a => a.id === rem.account);
      const accName = accObj ? accObj.name : 'Bank';

      return `
        <div class="reminder-card ${cardClass}" data-id="${rem.id}">
          <div style="display:flex; align-items:center; gap:12px; overflow:hidden;">
            <div class="tx-cat-icon">🔔</div>
            <div style="display:flex; flex-direction:column; overflow:hidden;">
              <span style="font-weight:800; font-size:0.95rem; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${rem.title}</span>
              <div>${badgeHtml} <span class="tx-bank-tag" style="font-size:0.7rem;">Pay from ${accName}</span></div>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px; flex-shrink:0;">
            <span style="font-weight:900; font-size:1.05rem; color:var(--text-main);">${this.formatCurrency(rem.amount)}</span>
            <div style="display:flex; gap:6px;">
              <button type="button" class="quick-pill" style="padding:4px 10px; font-size:0.75rem; background:var(--income); color:#fff; border-color:var(--income); font-weight:800;" onclick="window.app.payReminder('${rem.id}')">✅ Pay Now</button>
              <button type="button" class="quick-pill" style="padding:4px 8px; font-size:0.75rem; color:var(--expense);" onclick="window.app.deleteReminder('${rem.id}')">🗑️</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  payReminder(remId) {
    const rem = this.reminders.find(r => r.id === remId);
    if (!rem) return;

    let targetAcc = this.accounts.find(a => a.id === rem.account) || this.accounts[0];
    const confirmMsg = `Kya aap "${rem.title}" ke liye ₹${rem.amount} ${targetAcc.name} se log karna chahte hain?`;
    if (confirm(confirmMsg)) {
      const today = new Date().toISOString().split('T')[0];
      const newTx = {
        id: 'tx_' + Date.now(),
        date: today,
        description: rem.title,
        type: 'Expense',
        account: targetAcc.id,
        category: rem.category || 'Bills & Utilities',
        paymentMode: 'UPI',
        amount: Number(rem.amount),
        notes: 'Paid via Reminder'
      };

      this.transactions.unshift(newTx);
      this.reminders = this.reminders.filter(r => r.id !== remId);
      this.save();
      this.render();
      this.toast(`₹${rem.amount} ${rem.title} ${targetAcc.name} se log ho gaya!`);
    }
  }

  deleteReminder(remId) {
    if (confirm('Kya aap yeh reminder hatana chahte hain?')) {
      this.reminders = this.reminders.filter(r => r.id !== remId);
      this.save();
      this.render();
      this.toast('Reminder hata diya gaya.');
    }
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

  recoverLostData() {
    try {
      let candidate = null;
      let candidateSource = '';

      // 1. Check safety snapshot first (saved right before reset)
      const safety = localStorage.getItem('finwise_safety_snapshot');
      if (safety) {
        try {
          const parsed = JSON.parse(safety);
          if (parsed && Array.isArray(parsed.transactions) && parsed.transactions.length > 0) {
            candidate = parsed;
            candidateSource = 'Safety Snapshot (Reset se theek pehle)';
          }
        } catch (e) {}
      }

      // 2. Check rolling backup if candidate not found
      if (!candidate) {
        const rolling = localStorage.getItem('finwise_auto_backup_rolling');
        if (rolling) {
          try {
            const parsed = JSON.parse(rolling);
            if (parsed && Array.isArray(parsed.transactions) && parsed.transactions.length > 0) {
              candidate = parsed;
              candidateSource = 'Auto-Backup Snapshot';
            }
          } catch (e) {}
        }
      }

      // 3. Check known storage keys
      if (!candidate) {
        const possibleKeys = [
          'finwise_mob_transactions_v5',
          'finwise_mob_transactions_v4',
          'finwise_mob_transactions_v3',
          'finwise_mob_transactions_v2',
          'finwise_mob_transactions_v1',
          'finwise_transactions_v1',
          'finwise_transactions'
        ];
        for (const k of possibleKeys) {
          const raw = localStorage.getItem(k);
          if (raw) {
            try {
              const list = JSON.parse(raw);
              if (Array.isArray(list) && list.length > 0) {
                candidate = { transactions: list, accounts: this.accounts, reminders: this.reminders };
                candidateSource = `Pichli Storage Key (${k})`;
                break;
              }
            } catch (e) {}
          }
        }
      }

      // 4. Also scan any key in localStorage containing 'finwise'
      if (!candidate) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.includes('finwise') && key !== STORAGE_KEYS.TRANSACTIONS) {
            try {
              const raw = localStorage.getItem(key);
              const data = JSON.parse(raw);
              if (Array.isArray(data) && data.length > 0 && data[0] && (data[0].amount !== undefined || data[0].type)) {
                candidate = { transactions: data, accounts: this.accounts, reminders: this.reminders };
                candidateSource = `Storage Key (${key})`;
                break;
              } else if (data && Array.isArray(data.transactions) && data.transactions.length > 0) {
                candidate = data;
                candidateSource = `Storage Key (${key})`;
                break;
              }
            } catch (e) {}
          }
        }
      }

      if (candidate && Array.isArray(candidate.transactions) && candidate.transactions.length > 0) {
        const count = candidate.transactions.length;
        const timeInfo = candidate.dateStr ? ` (${candidate.dateStr})` : '';
        const shouldRestore = confirm(
          `Mil gaya! ${count} transactions ${candidateSource}${timeInfo} me paye gaye hain.\n\nKya aap inhein restore karna chahte hain?`
        );
        if (shouldRestore) {
          this.transactions = candidate.transactions;
          if (Array.isArray(candidate.accounts) && candidate.accounts.length > 0) {
            // merge accounts if any missing
            candidate.accounts.forEach(ca => {
              if (!this.accounts.some(a => a.id === ca.id)) {
                this.accounts.push(ca);
              }
            });
          }
          if (Array.isArray(candidate.reminders) && candidate.reminders.length > 0) {
            this.reminders = candidate.reminders;
          }
          this.save();
          this.render();
          document.getElementById('modal-settings')?.classList.remove('open');
          this.toast(`Shaandar! ${count} transactions recover ho gaye! 🎉`);
          return;
        }
      } else {
        alert('Browser storage me koi purana backup ya lost transactions nahi mile.\n\nAgar aapke paas backup JSON file hai, to "Backup File Upload" button se restore kar sakte hain.');
      }
    } catch (err) {
      alert('Data recovery me error: ' + err.message);
    }
  }

  downloadJsonBackup() {
    const backupData = {
      app: 'FinWise Mobile',
      version: 'v7',
      exportDate: new Date().toISOString(),
      exportDateFormatted: new Date().toLocaleString('en-IN'),
      accounts: this.accounts,
      transactions: this.transactions,
      reminders: this.reminders
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FinWise_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast('Backup JSON download ho gaya!');
  }

  restoreBackupFromFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (parsed && (Array.isArray(parsed.transactions) || Array.isArray(parsed.accounts))) {
            if (Array.isArray(parsed.accounts) && parsed.accounts.length > 0) {
              this.accounts = parsed.accounts;
            }
            if (Array.isArray(parsed.transactions)) {
              this.transactions = parsed.transactions;
            }
            if (Array.isArray(parsed.reminders)) {
              this.reminders = parsed.reminders;
            }
            this.save();
            this.render();
            document.getElementById('modal-settings')?.classList.remove('open');
            this.toast(`Backup restore ho gaya! (${this.transactions.length} entries) 🎉`);
          } else {
            alert('Yeh file valid FinWise backup JSON nahi hai.');
          }
        } else if (file.name.endsWith('.csv')) {
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          if (lines.length > 1) {
            const newTxs = [];
            for (let i = 1; i < lines.length; i++) {
              const parts = lines[i].split(',').map(s => s.replace(/^"|"$/g, '').trim());
              if (parts.length >= 6) {
                const [date, description, type, accName, category, amount] = parts;
                const matchedAcc = this.accounts.find(a => a.name.toLowerCase() === accName.toLowerCase()) || this.accounts[0];
                newTxs.push({
                  id: 'tx_csv_' + Date.now() + '_' + i,
                  date: date || new Date().toISOString().split('T')[0],
                  description: description || 'Imported Entry',
                  type: type || 'Expense',
                  account: matchedAcc ? matchedAcc.id : 'acc_sbi',
                  category: category || 'Other Expense',
                  amount: parseFloat(amount) || 0,
                  paymentMode: 'UPI'
                });
              }
            }
            if (newTxs.length > 0) {
              this.transactions = [...newTxs, ...this.transactions];
              this.save();
              this.render();
              document.getElementById('modal-settings')?.classList.remove('open');
              this.toast(`${newTxs.length} entries CSV se import ho gayi! 🎉`);
            }
          }
        }
      } catch (err) {
        alert('File read karne me error: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  protectedReset() {
    // 1. Take safety snapshot first so user can recover if needed
    try {
      const safetySnapshot = {
        accounts: this.accounts,
        transactions: this.transactions,
        reminders: this.reminders,
        timestamp: Date.now(),
        dateStr: new Date().toLocaleString('en-IN')
      };
      localStorage.setItem('finwise_safety_snapshot', JSON.stringify(safetySnapshot));
    } catch (e) {}

    // 2. Strict prompt requiring typing RESET
    const userInput = prompt(
      '⚠️ KHATRA / DANGER ZONE:\n\n' +
      'Saare transactions delete ho jayenge aur account balances zero/opening par aa jayenge!\n\n' +
      'Aapka safety snapshot save ho chuka hai (Settings me "Recover" se wapas laya ja sakta hai).\n\n' +
      'Aage badhne ke liye niche "RESET" (capital letters me) type karein:'
    );

    if (userInput && userInput.trim().toUpperCase() === 'RESET') {
      this.transactions = [];
      this.save();
      this.render();
      document.getElementById('modal-settings')?.classList.remove('open');
      this.toast('Saara data delete kar diya gaya (Safety backup saved).', false);
    } else if (userInput !== null) {
      alert('Aapne "RESET" nahi likha, isliye data delete nahi kiya gaya.');
    }
  }

  renderUserAuthUI() {
    const loggedOutBox = document.getElementById('google-logged-out-box');
    const loggedInBox = document.getElementById('google-logged-in-box');
    const nameEl = document.getElementById('user-display-name');
    const emailEl = document.getElementById('user-display-email');
    const avatarEl = document.getElementById('user-avatar-circle');
    const lastSyncEl = document.getElementById('label-last-sync');
    const headerStatus = document.getElementById('header-user-status');

    if (this.user) {
      if (loggedOutBox) loggedOutBox.style.display = 'none';
      if (loggedInBox) loggedInBox.style.display = 'block';
      if (nameEl) nameEl.textContent = this.user.name || 'User';
      if (emailEl) emailEl.textContent = this.user.email || '';
      if (headerStatus) headerStatus.textContent = this.user.name || this.user.email || 'Google Synced';
      if (avatarEl) {
        const initial = (this.user.name || this.user.email || 'U').charAt(0).toUpperCase();
        avatarEl.textContent = initial;
      }
      if (lastSyncEl) {
        lastSyncEl.textContent = this.lastDriveSync ? `Last synced: ${this.lastDriveSync}` : 'Sync pending';
      }
    } else {
      if (loggedOutBox) loggedOutBox.style.display = 'block';
      if (loggedInBox) loggedInBox.style.display = 'none';
      if (headerStatus) headerStatus.textContent = 'Personal Finance';
    }
  }

  async loginWithGoogle() {
    this.haptic(15);
    const defaultEmail = 'user.finwise@gmail.com';
    const emailPrompt = prompt(
      '🟢 Google 1-Tap Login (100% Free - Zero SMS Cost)\n\n' +
      'Apna Google / Gmail Account darj karein ya confirm karein:',
      this.user ? this.user.email : defaultEmail
    );

    if (emailPrompt && emailPrompt.includes('@')) {
      const email = emailPrompt.trim();
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      this.user = {
        email,
        name,
        googleId: 'g_' + Math.abs(email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)),
        loginTime: Date.now()
      };
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(this.user));
      this.renderUserAuthUI();
      this.toast(`Welcome, ${name}! Logged in via Google 🎉`);

      // WhatsApp-style Google Drive auto-sync on login
      setTimeout(() => {
        this.syncGoogleDriveBackup(false);
      }, 600);
    }
  }

  logoutGoogle() {
    if (confirm('Kya aap Google account se logout karna chahte hain?\n\n(Aapka local data aapke phone me surakshit rahega)')) {
      this.user = null;
      localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
      this.renderUserAuthUI();
      this.toast('Logged out successfully.');
    }
  }

  syncGoogleDriveBackup(showPrompt = true) {
    if (!this.user) {
      alert('Kripya pehle "Continue with Google" par tap karke login karein.');
      return;
    }

    this.haptic(20);
    const syncTimeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const syncDateStr = new Date().toLocaleDateString('en-IN');
    this.lastDriveSync = `${syncDateStr} ${syncTimeStr}`;
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, this.lastDriveSync);

    const drivePayload = {
      app: 'FinWise Mobile (Google Drive WhatsApp-Style Backup)',
      user: this.user.email,
      backupTimestamp: Date.now(),
      backupDate: this.lastDriveSync,
      accounts: this.accounts,
      transactions: this.transactions,
      reminders: this.reminders
    };
    localStorage.setItem('finwise_gdrive_cloud_snapshot', JSON.stringify(drivePayload));

    this.renderUserAuthUI();
    if (showPrompt) {
      this.toast(`Google Drive par sync ho gaya! (${syncTimeStr}) ☁️`);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new FinWiseMobile();
});
