/* =====================================================================
   RED PEPPER — Subaplicación Operativa: Mostrador POS Táctil (>=48px)
   ===================================================================== */
(function (global) {
  const RP = (global.RP = global.RP || {});

  function render(container, st) {
    const esc = RP.format.escapeHtml;
    const categories = ["Todos", "Salchipapas", "Hamburguesas", "Especiales", "Bebidas"];
    const turnTotal = st.orders.reduce((s, o) => s + o.total, 0);
    const draftTotal = st.posCart.reduce((s, l) => s + l.precio * l.qty, 0);

    const gridHtml = st.menu
      .filter((p) => st.posCategory === "Todos" || p.cat === st.posCategory)
      .map(
        (p) => `
        <div class="pos-item ${p.disponible ? "" : "agotado"}">
          <div class="dish-head">
            <span class="dish-name">${esc(p.nombre)}</span>
            <span class="dish-price">${RP.format.money(p.precio)}</span>
          </div>
          <button type="button" class="btn btn-touch ${p.disponible ? "btn-primary" : ""}" data-pos-add="${esc(p.id)}" ${p.disponible ? "" : "disabled"}>
            ${p.disponible ? "+ Añadir" : "Agotado"}
          </button>
        </div>`
      )
      .join("");

    const cartHtml = st.posCart.length
      ? st.posCart
          .map(
            (line, idx) => `
          <div class="cart-line">
            <div class="cart-top">
              <div>
                <strong>${esc(line.nombre)}</strong>
                <div class="mono" style="color:var(--color-text-secondary);">${RP.format.money(line.precio * line.qty)}</div>
              </div>
              <div class="cart-controls">
                <button type="button" class="qty-btn touch-48" data-pos-qty="${idx}" data-delta="-1" aria-label="Menos ${esc(line.nombre)}">-</button>
                <strong class="mono" style="min-width:22px; text-align:center;">${line.qty}</strong>
                <button type="button" class="qty-btn touch-48" data-pos-qty="${idx}" data-delta="1" aria-label="Más ${esc(line.nombre)}">+</button>
              </div>
            </div>
            <div class="cremas-row">
              ${st.cremas
                .map(
                  (c) => `<button type="button" class="crema-tag ${line.extras.includes(c) ? "selected" : ""}" data-pos-extra="${idx}" data-crema="${esc(c)}">${esc(c)}</button>`
                )
                .join("")}
            </div>
          </div>`
          )
          .join("")
      : `<p class="view-sub" style="margin:8px 0;">Sin ítems en borrador.</p>`;

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Mostrador POS</h1>
          <p class="view-sub">Caja rápida táctil (controles ≥ 48 px · RNF-05)</p>
        </div>
        <div class="header-actions">
          <span class="pill pill-neutral">Turno: <strong class="mono">${RP.format.money(turnTotal)}</strong></span>
          <button type="button" id="btn-pos-cierre" class="btn btn-touch ${st.jornadaAbierta ? "" : "btn-green"}">
            ${st.jornadaAbierta ? "Cerrar Jornada" : "Reabrir Jornada"}
          </button>
        </div>
      </div>

      <div class="split-pos">
        <div class="card">
          <div class="filter-bar">
            <div class="channel-bar" role="group" aria-label="Canal de venta POS">
              ${["Presencial", "Para llevar", "Pedido externo"]
                .map(
                  (ch) => `<button type="button" class="chip-btn pos-chip ${st.posChannel === ch ? "active" : ""}" data-pos-ch="${esc(ch)}">${
                    ch === "Presencial" ? "Salón" : ch === "Pedido externo" ? "Externo" : ch
                  }</button>`
                )
                .join("")}
            </div>
            <div>
              <label for="pos-cat-select" class="sr-only">Categoría</label>
              <select id="pos-cat-select" class="input-control" style="min-height:48px;">
                ${categories
                  .map((c) => `<option value="${esc(c)}" ${c === st.posCategory ? "selected" : ""}>${c === "Todos" ? "Todo el menú" : esc(c)}</option>`)
                  .join("")}
              </select>
            </div>
          </div>
          <div class="pos-grid">${gridHtml}</div>
        </div>

        <div class="card">
          <div class="card-head">
            <h2 class="card-title">Comanda en Curso</h2>
            <button type="button" class="btn btn-ghost" id="btn-pos-clear">Descartar</button>
          </div>
          ${cartHtml}
          <div style="margin:12px 0;">
            <div class="channel-bar" role="group" aria-label="Método de cobro">
              ${["Efectivo", "Yape / Plin", "POS Tarjeta"]
                .map(
                  (pm) => `<button type="button" class="chip-btn pos-chip ${st.posPayMethod === pm ? "active" : ""}" data-pos-pay="${esc(pm)}">${
                    pm === "POS Tarjeta" ? "Tarjeta" : esc(pm)
                  }</button>`
                )
                .join("")}
            </div>
          </div>
          <div class="total-row">
            <span style="font-weight:700;">Total</span>
            <span class="total-amount">${RP.format.money(draftTotal)}</span>
          </div>
          <button type="button" class="btn btn-primary btn-touch btn-full" id="btn-pos-confirm">Cobrar y Enviar a Cocina</button>
        </div>
      </div>
    `;

    container.querySelectorAll("[data-pos-ch]").forEach((b) =>
      b.addEventListener("click", () => {
        st.posChannel = b.dataset.posCh;
        RP.store.notify();
      })
    );
    container.querySelector("#pos-cat-select")?.addEventListener("change", (e) => {
      st.posCategory = e.target.value;
      RP.store.notify();
    });
    container.querySelectorAll("[data-pos-add]").forEach((b) =>
      b.addEventListener("click", () => RP.actions.addToCart("pos", b.dataset.posAdd))
    );
    container.querySelectorAll("[data-pos-qty]").forEach((b) =>
      b.addEventListener("click", () => RP.actions.changeCartQty("pos", Number(b.dataset.posQty), Number(b.dataset.delta)))
    );
    container.querySelectorAll("[data-pos-extra]").forEach((b) =>
      b.addEventListener("click", () => RP.actions.toggleCartExtra("pos", Number(b.dataset.posExtra), b.dataset.crema))
    );
    container.querySelectorAll("[data-pos-pay]").forEach((b) =>
      b.addEventListener("click", () => {
        st.posPayMethod = b.dataset.posPay;
        RP.store.notify();
      })
    );
    container.querySelector("#btn-pos-clear")?.addEventListener("click", () => RP.actions.clearCart("pos"));
    container.querySelector("#btn-pos-confirm")?.addEventListener("click", () => RP.actions.confirmOrder("pos"));
    container.querySelector("#btn-pos-cierre")?.addEventListener("click", () => {
      RP.modal.openConfirmModal({
        title: st.jornadaAbierta ? "Confirmar Cierre de Jornada" : "Reabrir Jornada",
        message: st.jornadaAbierta
          ? `Se consolidarán ${st.orders.length} ventas confirmadas por ${RP.format.money(turnTotal)} (RF-03).`
          : "Se habilitará nuevamente el turno operativo.",
        confirmLabel: st.jornadaAbierta ? "Cerrar Jornada" : "Abrir Jornada",
        tone: st.jornadaAbierta ? "primary" : "green",
        onConfirm: () => RP.actions.toggleJornada(),
      });
    });
  }

  RP.apps = RP.apps || {};
  RP.apps.pos = { render };
})(window);
