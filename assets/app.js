// ============================================
// CALIBER — App shell + interactivity
// ============================================

(function () {
  const D = window.CALIBER_DATA;

  // ─── Inject app shell ──────────────────────
  function renderShell(activePage, breadcrumb) {
    const counts = D.navCounts;
    const c = (n) => (n == null || n === 0) ? "" : `<span class="nav-item__count">${n}</span>`;
    const active = (p) => p === activePage ? "nav-item--active" : "";

    const sidebar = `
      <aside class="sidebar">
        <div class="sidebar__brand">
          <div>
            <div class="sidebar__brand-mark">Cali<em>ber</em></div>
            <div class="sidebar__brand-tag">Operator's Console</div>
          </div>
        </div>

        <nav class="sidebar__section">
          <div class="sidebar__section-label">Analytics</div>
          <a href="index.html"            class="nav-item ${active('dashboard')}">${icon('grid')}<span class="nav-item__label">Dashboard</span></a>
          <a href="ads-performance.html"  class="nav-item ${active('ads-performance')}">${icon('chart')}<span class="nav-item__label">Ads performance</span></a>
          <a href="targeting.html"        class="nav-item ${active('targeting')}">${icon('target')}<span class="nav-item__label">Targeting &amp; audiences</span></a>
          <a href="math-console.html"     class="nav-item ${active('math')}">${icon('calc')}<span class="nav-item__label">Math console</span></a>
        </nav>

        <nav class="sidebar__section">
          <div class="sidebar__section-label">Distribution</div>
          <a href="ads.html"            class="nav-item ${active('ads')}">${icon('layers')}<span class="nav-item__label">Creatives &amp; pages</span></a>
        </nav>

        <nav class="sidebar__section">
          <div class="sidebar__section-label">For your team · step 2</div>
          <a href="conversations.html"  class="nav-item ${active('conversations')}">${icon('chat')}<span class="nav-item__label">Conversations</span>${c(counts.conversations)}</a>
          <a href="leads.html"          class="nav-item ${active('leads')}">${icon('check')}<span class="nav-item__label">Leads to qualify</span>${c(counts.leads)}</a>
          <a href="agenda.html"         class="nav-item ${active('agenda')}">${icon('calendar')}<span class="nav-item__label">Today's calls</span>${c(counts.agenda)}</a>
        </nav>

        <nav class="sidebar__section">
          <div class="sidebar__section-label">Settings</div>
          <a href="#" class="nav-item" id="metaConnBtn">${icon('plug')}<span class="nav-item__label">Connect Meta Ads</span></a>
          <a href="#" class="nav-item">${icon('cog')}<span class="nav-item__label">Settings</span></a>
        </nav>

        <div class="sidebar__footer">
          <div class="avatar">${D.user.initials}</div>
          <div class="sidebar__user-meta">
            <div class="sidebar__user-name">${D.user.name}</div>
            <div class="sidebar__user-role">${D.user.role}</div>
          </div>
        </div>
      </aside>
    `;

    const topbar = `
      <header class="topbar">
        <div class="topbar__left">
          <nav class="breadcrumb">
            <span>Caliber</span>
            <span class="breadcrumb__sep">/</span>
            <span class="breadcrumb__current">${breadcrumb}</span>
          </nav>
        </div>
        <div class="topbar__right">
          <button class="cmdk-trigger" onclick="window.openCmdk()" aria-label="Open command palette">
            ${icon('search', 14)}
            <span>Search or jump…</span>
            <span class="cmdk-trigger__kbd">⌘ K</span>
          </button>
          <button class="btn btn--icon btn--ghost" aria-label="Notifications">${icon('bell', 16)}</button>
        </div>
      </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', `
      <div class="shell">
        ${sidebar}
        <div class="main">
          ${topbar}
          <div id="cmdk-mount"></div>
        </div>
      </div>
    `);

    // Move existing content into .main
    const main = document.querySelector('.main');
    const contentEl = document.getElementById('page-content');
    if (contentEl) main.appendChild(contentEl);
  }

  // ─── Icons (inline SVG, no deps) ───────────
  function icon(name, size = 16) {
    const s = size;
    const lib = {
      grid:     `<svg width="${s}" height="${s}" class="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
      chat:     `<svg width="${s}" height="${s}" class="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
      check:    `<svg width="${s}" height="${s}" class="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
      layers:   `<svg width="${s}" height="${s}" class="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
      calendar: `<svg width="${s}" height="${s}" class="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
      cog:      `<svg width="${s}" height="${s}" class="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
      help:     `<svg width="${s}" height="${s}" class="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      search:   `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
      bell:     `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
      arrow:    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
      filter:   `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
      plus:     `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
      star:     `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      starOutline:`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      flag:     `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
      pause:    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
      take:     `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4a4.5 4.5 0 1 1 0 9H4l4.5 4.5L8 19l-7-7 7-7 .5 1.5L4 11h10.5z"/></svg>`,
      external: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
      send:     `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
      sparkles: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M12 18v3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M3 12h3M18 12h3M5.5 18.5l2.1-2.1M16.4 7.6l2.1-2.1"/></svg>`,
      zoom:     `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
      doc:      `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
      ai:       `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/></svg>`,
      arrowUp:  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
      arrowDown:`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>`,
      chart:    `<svg width="${s}" height="${s}" class="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
      target:   `<svg width="${s}" height="${s}" class="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
      calc:     `<svg width="${s}" height="${s}" class="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="8" y1="18" x2="12" y2="18"/></svg>`,
      plug:     `<svg width="${s}" height="${s}" class="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z"/></svg>`,
      meta:     `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 4C3.9 4 2 6.4 2 9.5c0 2.9 1.6 5.5 3.8 5.5 1.4 0 2.4-1 3.4-2.6.5-.8 1.2-2.1 1.7-3 .4.7 1 1.9 1.5 2.7C15.6 14.5 16.8 15 18 15c2.2 0 4-2.4 4-5.5C22 6.4 20.1 4 17.5 4c-1.6 0-2.8 1-3.9 2.7-.4.6-.8 1.4-1.2 2.1-.4-.7-.8-1.4-1.1-2C10.1 5 8.9 4 7.3 4h-.8zm.3 2.2c.8 0 1.5.6 2.4 2-.6 1-1.2 2.2-1.6 2.9-.8 1.4-1.2 1.7-1.7 1.7-.8 0-1.6-1.3-1.6-3.2 0-2 .9-3.4 2.1-3.4zm10.6 0c1.2 0 2.1 1.4 2.1 3.4 0 1.9-.8 3.2-1.6 3.2-.5 0-.9-.3-1.6-1.6-.3-.6-.9-1.7-1.5-2.8.9-1.6 1.7-2.2 2.6-2.2z"/></svg>`
    };
    return lib[name] || '';
  }
  window.calIcon = icon;

  // ─── Score Dial helper ─────────────────────
  function scoreDial(score, size = 64) {
    const r = (size - 8) / 2;
    const c = 2 * Math.PI * r;
    const fill = c - (score / 100) * c;
    const tone = score >= 75 ? '' : score >= 50 ? 'score-dial--warm' : 'score-dial--cool';
    return `
      <div class="score-dial ${tone}" style="width:${size}px;height:${size}px">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle class="score-dial__track" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="2"/>
          <circle class="score-dial__fill"  cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="2" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${fill}"/>
        </svg>
        <span class="score-dial__num">${score}<em>/100</em></span>
      </div>
    `;
  }
  window.calScoreDial = scoreDial;

  // ─── Sparkline ─────────────────────────────
  function sparkline(values, w = 200, h = 32) {
    if (!values || values.length === 0) return '';
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const stepX = w / (values.length - 1);
    const pts = values.map((v, i) => `${i * stepX},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ');
    return `<svg class="kpi__spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <polyline points="${pts}" fill="none" stroke="var(--gold)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
    </svg>`;
  }
  window.calSparkline = sparkline;

  // ─── Cmd-K palette ─────────────────────────
  const cmdkItems = [
    { group: "Analytics", label: "Dashboard",             href: "index.html",          icon: "grid",     shortcut: "G D" },
    { group: "Analytics", label: "Ads performance",       href: "ads-performance.html",icon: "chart",    shortcut: "G P" },
    { group: "Analytics", label: "Targeting & audiences", href: "targeting.html",      icon: "target",   shortcut: "G T" },
    { group: "Analytics", label: "Math console",          href: "math-console.html",   icon: "calc",     shortcut: "G M" },
    { group: "Navigate",  label: "Creatives & pages",     href: "ads.html",            icon: "layers",   shortcut: "G A" },
    { group: "Navigate",  label: "Conversations",         href: "conversations.html",  icon: "chat",     shortcut: "G C" },
    { group: "Navigate",  label: "Leads to qualify",      href: "leads.html",          icon: "check",    shortcut: "G L" },
    { group: "Navigate",  label: "Today's calls",         href: "agenda.html",         icon: "calendar", shortcut: "G S" },
    { group: "Actions",   label: "Connect Meta Ads",      href: "#",                   icon: "plug" },
    { group: "Actions",   label: "Schedule a post",       href: "ads.html",            icon: "send" },
  ];

  function renderCmdk() {
    const groups = {};
    cmdkItems.forEach(it => (groups[it.group] = groups[it.group] || []).push(it));
    let html = `
      <div class="modal-bg" id="cmdk-overlay" onclick="if(event.target===this) window.closeCmdk()">
        <div class="cmdk">
          <input class="cmdk__input" id="cmdk-input" placeholder="Type a command or search…" autocomplete="off">
          <div class="cmdk__list" id="cmdk-list">
    `;
    Object.entries(groups).forEach(([g, items]) => {
      html += `<div class="cmdk__group-label">${g}</div>`;
      items.forEach(it => {
        html += `<a class="cmdk__item" href="${it.href}"><span class="cmdk__item-icon">${icon(it.icon, 16)}</span><span>${it.label}</span>${it.shortcut ? `<span class="cmdk__item-shortcut">${it.shortcut}</span>` : ''}</a>`;
      });
    });
    html += `</div></div></div>`;
    return html;
  }

  window.openCmdk = function () {
    const mount = document.getElementById('cmdk-mount');
    if (!mount) return;
    mount.innerHTML = renderCmdk();
    const overlay = document.getElementById('cmdk-overlay');
    overlay.classList.add('modal-bg--open');
    setTimeout(() => document.getElementById('cmdk-input')?.focus(), 50);

    // simple filter
    const input = document.getElementById('cmdk-input');
    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.cmdk__item').forEach(el => {
        el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  };

  window.closeCmdk = function () {
    const mount = document.getElementById('cmdk-mount');
    if (mount) mount.innerHTML = '';
  };

  // Global key handler
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      window.openCmdk();
    }
    if (e.key === 'Escape') {
      window.closeCmdk();
    }
  });

  // ─── Bootstrap on DOM ready ────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const meta = document.querySelector('meta[name="caliber-page"]');
    if (!meta) return;
    const [page, label] = meta.content.split('|');
    renderShell(page, label || page);

    // Connect Meta Ads modal
    const metaBtn = document.getElementById('metaConnBtn');
    if (metaBtn) metaBtn.addEventListener('click', (e) => { e.preventDefault(); window.openMetaConnect(); });
  });

  // ─── Meta connect modal ────────────────────
  window.openMetaConnect = function () {
    const mount = document.getElementById('cmdk-mount');
    if (!mount) return;
    mount.innerHTML = `
      <div class="modal-bg modal-bg--open" id="meta-overlay" onclick="if(event.target===this) document.getElementById('cmdk-mount').innerHTML=''">
        <div class="modal" style="max-width:520px">
          <div style="padding:var(--s-8) var(--s-8) var(--s-6);border-bottom:1px solid var(--line)">
            <div style="display:flex;align-items:center;gap:var(--s-3);margin-bottom:var(--s-4)">
              <div style="width:44px;height:44px;border-radius:var(--r-md);background:#0866FF;display:flex;align-items:center;justify-content:center;color:#fff">${icon('meta', 26)}</div>
              <div>
                <div class="display" style="font-size:var(--text-xl);font-weight:500">Connect Meta Ads</div>
                <div class="mono text-xs text-quiet">Marketing API · read + manage</div>
              </div>
            </div>
            <p class="text-sm text-mute" style="line-height:1.55;margin:0">
              Caliber se conecta a tu cuenta publicitaria de Meta para leer Insights en vivo
              (impresiones, clicks, gasto, conversiones) y calcular el costo real por lead
              calificado y por cliente. Lectura cada 15 min.
            </p>
          </div>
          <div style="padding:var(--s-6) var(--s-8)">
            <div class="mono text-xs text-quiet mb-4" style="letter-spacing:0.14em;text-transform:uppercase">Necesitarás</div>
            <div style="display:flex;flex-direction:column;gap:var(--s-3)">
              ${['Business Manager (ya lo tienes)', 'Ad Account ID — act_XXXXXXXX', 'System User Token · scope ads_read', 'No requiere App Review para tus propios assets'].map(t => `
                <div style="display:flex;gap:var(--s-3);align-items:flex-start;font-size:var(--text-sm)">
                  <span style="color:var(--success);flex-shrink:0;margin-top:2px"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                  <span>${t}</span>
                </div>`).join('')}
            </div>
            <div style="margin-top:var(--s-6);padding:var(--s-4);background:var(--gold-tint);border-radius:var(--r-md);font-size:var(--text-sm);line-height:1.5;color:var(--ink)">
              Estás viendo Caliber con <strong>datos de demostración</strong>. Al conectar tu cuenta,
              cada número se reemplaza por tu data real sin cambiar nada del tablero.
            </div>
          </div>
          <div style="padding:var(--s-5) var(--s-8);border-top:1px solid var(--line);display:flex;justify-content:flex-end;gap:var(--s-3)">
            <button class="btn btn--ghost" onclick="document.getElementById('cmdk-mount').innerHTML=''">Ahora no</button>
            <button class="btn btn--primary" onclick="document.getElementById('cmdk-mount').innerHTML='';calToast('Conexión Meta — disponible en la fase de implementación')">
              ${icon('plug', 14)} Conectar cuenta
            </button>
          </div>
        </div>
      </div>
    `;
  };

  // ─── Toast utility ─────────────────────────
  window.calToast = function (msg) {
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(10px);background:var(--ink);color:var(--surface);padding:10px 16px;border-radius:6px;font-size:13px;font-family:var(--font-body);opacity:0;transition:all 240ms cubic-bezier(0.16,1,0.3,1);z-index:200;box-shadow:0 8px 24px rgba(0,0,0,0.18);`;
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; });
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(10px)'; }, 2400);
    setTimeout(() => t.remove(), 2700);
  };
})();
