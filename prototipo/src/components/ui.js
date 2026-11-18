/* =====================================================================
   RED PEPPER — Componentes UI Reutilizables (Píldoras, Vacíos, Iconos)
   ===================================================================== */
(function (global) {
  const RP = (global.RP = global.RP || {});

  const ICONS = {
    check: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.2 8.4L6.4 11.6L12.8 4.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    staff: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 8a3 3 0 100-6 3 3 0 000 6zM2.5 14a5.5 5.5 0 0111 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    cart: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 2.5h2l1.4 7.2h7.1l1.2-5H4.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.2" cy="13" r="1.1" fill="currentColor"/><circle cx="11.8" cy="13" r="1.1" fill="currentColor"/></svg>`,
    clock: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.7"/><path d="M8 4.8V8l2.2 1.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    pin: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 14s4.5-4.1 4.5-7.6A4.5 4.5 0 003.5 6.4C3.5 9.9 8 14 8 14z" stroke="currentColor" stroke-width="1.7"/><circle cx="8" cy="6.4" r="1.5" fill="currentColor"/></svg>`,
  };

  function statusPill(text, tone = "neutral", live = false) {
    const cls =
      tone === "ok"
        ? "pill-ok"
        : tone === "warn"
        ? "pill-warn"
        : tone === "danger"
        ? "pill-danger"
        : tone === "promo"
        ? "pill-promo"
        : "pill-neutral";
    const dot = live ? `<span class="status-dot" aria-hidden="true"></span>` : "";
    return `<span class="pill ${cls}">${dot}${RP.format.escapeHtml(text)}</span>`;
  }

  function emptyState(title, copy, actionHtml = "") {
    return `
      <div class="empty-state">
        <p style="font-weight:700; color:var(--color-text); margin-bottom:4px;">${RP.format.escapeHtml(title)}</p>
        <p style="margin:0 0 12px; font-size:13px;">${RP.format.escapeHtml(copy)}</p>
        ${actionHtml}
      </div>
    `;
  }

  RP.ui = {
    ICONS,
    statusPill,
    emptyState,
  };
})(window);
