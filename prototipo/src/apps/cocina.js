/* =====================================================================
   RED PEPPER — Subaplicación Operativa: Cocina (KDS) y Stock Rápido
   ===================================================================== */
(function (global) {
  const RP = (global.RP = global.RP || {});

  function render(container, st) {
    const esc = RP.format.escapeHtml;
    const cols = [
      { state: "Pendiente", tone: "danger", actionLabel: "Preparar", next: "En preparación", btnCls: "btn-primary" },
      { state: "En preparación", tone: "warn", actionLabel: "Listo", next: "Listo", btnCls: "btn-green" },
      { state: "Listo", tone: "ok", actionLabel: null, next: null, btnCls: "" },
    ];

    const boardHtml = cols
      .map((col) => {
        const list = st.orders.filter((o) => o.estado === col.state);
        const ticketsHtml = list.length
          ? list
              .map(
                (o) => `
              <div class="kds-ticket">
                <div class="kds-ticket-head">
                  <strong class="mono">${esc(o.id)}</strong>
                  ${RP.ui.statusPill(`${o.canal} · ${o.hora}`, col.tone)}
                </div>
                <ul class="kds-items">
                  ${o.items
                    .map(
                      (i) => `<li><strong class="mono">${i.qty}×</strong> ${esc(i.nombre)}${
                        i.extras.length ? ` <span style="color:var(--color-text-secondary);">[${esc(i.extras.join(", "))}]</span>` : ""
                      }</li>`
                    )
                    .join("")}
                </ul>
                ${o.nota ? `<p style="font-size:12px; color:var(--brand-orange-ink); margin:0 0 8px;">Nota: ${esc(o.nota)}</p>` : ""}
                ${
                  col.actionLabel
                    ? `<button type="button" class="btn ${col.btnCls} btn-touch btn-full" data-kds-adv="${esc(o.id)}" data-next="${esc(col.next)}">${col.actionLabel}</button>`
                    : `<div style="display:inline-flex; align-items:center; gap:5px; color:var(--brand-green); font-weight:700; font-size:12px;">${RP.ui.ICONS.check}<span>Despachado</span></div>`
                }
              </div>`
              )
              .join("")
          : `<p class="view-sub">Sin comandas.</p>`;

        return `
          <div class="kds-col">
            <div class="kds-col-head">
              <span>${col.state}</span>
              ${RP.ui.statusPill(String(list.length), col.tone)}
            </div>
            ${ticketsHtml}
          </div>`;
      })
      .join("");

    const stockHtml = st.menu
      .map(
        (p) => `
        <div class="kds-stock-row">
          <span style="font-weight:700;">${esc(p.nombre)}</span>
          <button type="button" class="btn ${p.disponible ? "pill-ok" : "pill-danger"}" data-kds-stock="${esc(p.id)}">
            ${p.disponible ? "Activo" : "Agotado"}
          </button>
        </div>`
      )
      .join("");

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Cocina (KDS)</h1>
          <p class="view-sub">Comandas en tiempo real (preparación al instante) y bloqueo rápido de stock</p>
        </div>
      </div>
      <div class="split-admin">
        <div class="kds-board">${boardHtml}</div>
        <aside class="card">
          <div class="card-head">
            <h2 class="card-title">Stock Rápido</h2>
          </div>
          ${stockHtml}
        </aside>
      </div>
    `;

    container.querySelectorAll("[data-kds-adv]").forEach((btn) =>
      btn.addEventListener("click", () => RP.actions.advanceOrderState(btn.dataset.kdsAdv, btn.dataset.next))
    );
    container.querySelectorAll("[data-kds-stock]").forEach((btn) =>
      btn.addEventListener("click", () => RP.actions.toggleProductStock(btn.dataset.kdsStock))
    );
  }

  RP.apps = RP.apps || {};
  RP.apps.cocina = { render };
})(window);
