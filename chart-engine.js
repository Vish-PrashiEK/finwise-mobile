/**
 * Lightweight, zero-dependency SVG Charting Engine
 * Supports: Donut Chart, Horizontal Bar Chart, Vertical Bar Chart, Trend Area Chart
 */

class SvgCharts {
  static formatCurrency(val) {
    return '₹' + Number(val || 0).toLocaleString('en-IN');
  }

  static renderDonut(containerId, data, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (!data || data.length === 0 || data.every(d => d.value === 0)) {
      container.innerHTML = `
        <div class="empty-chart">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
          </svg>
          <p>Koi data uplabdh nahi hai</p>
        </div>
      `;
      return;
    }

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const size = options.size || 240;
    const strokeWidth = options.strokeWidth || 36;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    let accumulatedAngle = 0;
    let pathsHtml = '';

    data.forEach((item, index) => {
      if (item.value <= 0) return;
      const percentage = item.value / total;
      const strokeDash = percentage * circumference;
      const strokeOffset = circumference - strokeDash;
      const angle = accumulatedAngle * 360;

      pathsHtml += `
        <circle
          cx="${center}"
          cy="${center}"
          r="${radius}"
          fill="transparent"
          stroke="${item.color}"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${strokeDash} ${strokeOffset}"
          stroke-dashoffset="0"
          transform="rotate(${angle - 90} ${center} ${center})"
          class="donut-segment"
          data-label="${item.label}"
          data-value="${item.value}"
          data-percent="${(percentage * 100).toFixed(1)}%"
          tabindex="0"
        />
      `;
      accumulatedAngle += percentage;
    });

    const centerLabel = options.centerLabel || 'Total';
    const centerValue = SvgCharts.formatCurrency(total);

    const svgHtml = `
      <div class="donut-wrapper">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="donut-svg">
          ${pathsHtml}
          <g class="donut-center-text">
            <text x="${center}" y="${center - 6}" text-anchor="middle" class="donut-center-label">${centerLabel}</text>
            <text x="${center}" y="${center + 18}" text-anchor="middle" class="donut-center-val">${centerValue}</text>
          </g>
        </svg>
        <div class="chart-tooltip" id="${containerId}-tooltip"></div>
      </div>
    `;

    // Legend
    let legendHtml = '<div class="chart-legend">';
    data.forEach(item => {
      const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
      legendHtml += `
        <div class="legend-item" title="${item.label}: ${SvgCharts.formatCurrency(item.value)} (${pct}%)">
          <span class="legend-dot" style="background-color: ${item.color};"></span>
          <span class="legend-label">${item.label}</span>
          <span class="legend-value">${SvgCharts.formatCurrency(item.value)}</span>
          <span class="legend-pct">${pct}%</span>
        </div>
      `;
    });
    legendHtml += '</div>';

    container.innerHTML = `<div class="chart-card-content">${svgHtml}${legendHtml}</div>`;

    // Tooltip interactivity
    const tooltip = document.getElementById(`${containerId}-tooltip`);
    const segments = container.querySelectorAll('.donut-segment');
    segments.forEach(seg => {
      seg.addEventListener('mouseenter', (e) => {
        const label = seg.getAttribute('data-label');
        const val = SvgCharts.formatCurrency(seg.getAttribute('data-value'));
        const pct = seg.getAttribute('data-percent');
        tooltip.innerHTML = `<strong>${label}</strong><br/>${val} (${pct})`;
        tooltip.style.opacity = '1';
      });
      seg.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - rect.left + 10}px`;
        tooltip.style.top = `${e.clientY - rect.top - 30}px`;
      });
      seg.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
      });
    });
  }

  static renderBarList(containerId, data, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (!data || data.length === 0 || data.every(d => d.value === 0)) {
      container.innerHTML = `
        <div class="empty-chart">
          <p>Koi data uplabdh nahi hai</p>
        </div>
      `;
      return;
    }

    const maxValue = Math.max(...data.map(d => d.value), 1);
    const total = data.reduce((s, d) => s + d.value, 0);

    let html = '<div class="bar-list">';
    data.forEach(item => {
      const pct = ((item.value / maxValue) * 100).toFixed(1);
      const sharePct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
      html += `
        <div class="bar-row">
          <div class="bar-info">
            <span class="bar-title">
              <span class="bar-color-chip" style="background:${item.color || '#3b82f6'}"></span>
              ${item.label}
            </span>
            <span class="bar-num">
              <strong>${SvgCharts.formatCurrency(item.value)}</strong>
              <small class="bar-share">${sharePct}%</small>
            </span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%; background: ${item.color || '#3b82f6'};"></div>
          </div>
        </div>
      `;
    });
    html += '</div>';

    container.innerHTML = html;
  }

  static renderComparisonTrend(containerId, daysData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (!daysData || daysData.length === 0) {
      container.innerHTML = '<div class="empty-chart"><p>No trend data</p></div>';
      return;
    }

    const width = 600;
    const height = 180;
    const padding = { top: 20, right: 30, bottom: 30, left: 50 };

    const maxVal = Math.max(
      ...daysData.map(d => Math.max(d.income || 0, d.expense || 0, d.investment || 0)),
      1000
    );

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    const step = chartW / Math.max(daysData.length - 1, 1);

    const getX = (i) => padding.left + i * step;
    const getY = (val) => padding.top + chartH - ((val || 0) / maxVal) * chartH;

    const buildPath = (key) => {
      return daysData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[key])}`).join(' ');
    };

    const expensePath = buildPath('expense');
    const incomePath = buildPath('income');
    const investPath = buildPath('investment');

    // Area fill for expense
    const expenseArea = `${expensePath} L ${getX(daysData.length - 1)} ${padding.top + chartH} L ${getX(0)} ${padding.top + chartH} Z`;

    let xLabels = '';
    daysData.forEach((d, i) => {
      if (daysData.length > 7 && i % 2 !== 0 && i !== daysData.length - 1) return;
      xLabels += `<text x="${getX(i)}" y="${height - 8}" text-anchor="middle" class="axis-text">${d.label}</text>`;
    });

    const gridLines = `
      <line x1="${padding.left}" y1="${getY(0)}" x2="${width - padding.right}" y2="${getY(0)}" stroke="var(--border-color)" stroke-width="1"/>
      <line x1="${padding.left}" y1="${getY(maxVal / 2)}" x2="${width - padding.right}" y2="${getY(maxVal / 2)}" stroke="var(--border-color)" stroke-dasharray="4 4" stroke-width="1"/>
      <line x1="${padding.left}" y1="${getY(maxVal)}" x2="${width - padding.right}" y2="${getY(maxVal)}" stroke="var(--border-color)" stroke-dasharray="4 4" stroke-width="1"/>
      <text x="${padding.left - 8}" y="${getY(maxVal) + 4}" text-anchor="end" class="axis-text">${SvgCharts.formatCurrency(maxVal)}</text>
      <text x="${padding.left - 8}" y="${getY(maxVal / 2) + 4}" text-anchor="end" class="axis-text">${SvgCharts.formatCurrency(maxVal / 2)}</text>
      <text x="${padding.left - 8}" y="${getY(0) + 4}" text-anchor="end" class="axis-text">₹0</text>
    `;

    let dotsHtml = '';
    daysData.forEach((d, i) => {
      dotsHtml += `
        <circle cx="${getX(i)}" cy="${getY(d.expense)}" r="4" class="trend-dot trend-dot-expense" data-info="Expense: ${SvgCharts.formatCurrency(d.expense)} on ${d.label}" />
        <circle cx="${getX(i)}" cy="${getY(d.income)}" r="4" class="trend-dot trend-dot-income" data-info="Income: ${SvgCharts.formatCurrency(d.income)} on ${d.label}" />
        <circle cx="${getX(i)}" cy="${getY(d.investment)}" r="4" class="trend-dot trend-dot-invest" data-info="Invest: ${SvgCharts.formatCurrency(d.investment)} on ${d.label}" />
      `;
    });

    const svg = `
      <div class="trend-chart-wrapper">
        <svg viewBox="0 0 ${width} ${height}" class="trend-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ef4444" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="#ef4444" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          ${gridLines}
          <path d="${expenseArea}" fill="url(#expenseGrad)" />
          <path d="${incomePath}" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
          <path d="${expensePath}" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
          <path d="${investPath}" fill="none" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round"/>
          ${dotsHtml}
          ${xLabels}
        </svg>
        <div class="trend-legend">
          <span class="legend-pill" style="--c:#10b981"><span class="pill-dot"></span> Income</span>
          <span class="legend-pill" style="--c:#ef4444"><span class="pill-dot"></span> Expense</span>
          <span class="legend-pill" style="--c:#8b5cf6"><span class="pill-dot"></span> Investment</span>
        </div>
        <div class="chart-tooltip" id="${containerId}-tooltip"></div>
      </div>
    `;

    container.innerHTML = svg;

    const tooltip = document.getElementById(`${containerId}-tooltip`);
    const dots = container.querySelectorAll('.trend-dot');
    dots.forEach(dot => {
      dot.addEventListener('mouseenter', (e) => {
        tooltip.innerHTML = dot.getAttribute('data-info');
        tooltip.style.opacity = '1';
      });
      dot.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - rect.left + 10}px`;
        tooltip.style.top = `${e.clientY - rect.top - 25}px`;
      });
      dot.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
      });
    });
  }
}

window.SvgCharts = SvgCharts;

