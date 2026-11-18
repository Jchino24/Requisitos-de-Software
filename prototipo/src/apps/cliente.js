/* =====================================================================
   RED PEPPER — Subaplicación Pública: Experiencia Cliente
   Sub-vistas (máx. 4 en nav): Carta | Tu Pedido | Seguimiento | El Local
   ===================================================================== */
(function (global) {
  const RP = (global.RP = global.RP || {});

  function openDishModal(prodId) {
    const st = RP.store.getState();
    const prod = st.menu.find((p) => p.id === prodId);
    if (!prod) return;
    const esc = RP.format.escapeHtml;
    const chosen = new Set();

    RP.modal.openModal({
      title: prod.nombre,
      bodyHtml: `
        <div class="dish-thumb" style="border-radius:var(--radius-md); margin-bottom:12px;">
          <img src="${esc(prod.img)}" alt="${esc(prod.nombre)}" width="640" height="478" />
        </div>
        <div class="dish-head" style="margin-bottom:6px;">
          <span class="pill pill-neutral">${esc(prod.cat)}</span>
          <span class="dish-price" style="font-size:18px;">${RP.format.money(prod.precio)}</span>
        </div>
        <p style="color:var(--color-text-secondary); margin-bottom:14px;">${esc(prod.desc)}</p>
        ${
          prod.disponible
            ? `
          <div style="margin-bottom:14px;">
            <strong style="font-size:13px; display:block; margin-bottom:6px;">Personaliza tus cremas sin costo</strong>
            <div class="cremas-row" id="modal-cremas-picker">
              ${st.cremas
                .map((c) => `<button type="button" class="crema-tag" data-crema="${esc(c)}">${esc(c)}</button>`)
                .join("")}
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" id="dish-modal-cancel">Cancelar</button>
            <button type="button" class="btn btn-primary" id="dish-modal-add">Agregar a Tu Pedido</button>
          </div>`
            : `<div class="alert-banner" style="margin:0;">Agotado por hoy en cocina (R-ENT2-05).</div>`
        }
      `,
      onMount(dialog, close) {
        dialog.querySelectorAll("#modal-cremas-picker .crema-tag").forEach((btn) => {
          btn.addEventListener("click", () => {
            const c = btn.dataset.crema;
            if (chosen.has(c)) chosen.delete(c);
            else chosen.add(c);
            btn.classList.toggle("selected", chosen.has(c));
          });
        });
        dialog.querySelector("#dish-modal-cancel")?.addEventListener("click", close);
        dialog.querySelector("#dish-modal-add")?.addEventListener("click", () => {
          RP.actions.addToCart("client", prod.id, Array.from(chosen));
          close();
        });
      },
    });
  }

  function renderCartaTab(st) {
    const esc = RP.format.escapeHtml;
    const norm = RP.format.normalizeText;
    const categories = ["Todos", "Salchipapas", "Hamburguesas", "Especiales", "Bebidas"];
    const q = norm(st.clientSearch);
    const filtered = st.menu.filter((p) => {
      const matchCat = st.clientCategory === "Todos" || p.cat === st.clientCategory;
      const matchText = !q || norm(p.nombre).includes(q) || norm(p.desc).includes(q);
      return matchCat && matchText;
    });

    const cardsHtml = filtered.length
      ? filtered
          .map(
            (p) => `
          <article class="dish-card ${p.disponible ? "" : "agotado"}">
            <div class="dish-thumb">
              <img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="640" height="478" loading="lazy" decoding="async" />
              <div class="dish-thumb-badge">
                ${
                  !p.disponible
                    ? RP.ui.statusPill("Agotado", "danger")
                    : p.destacado
                    ? RP.ui.statusPill("Favorito", "promo")
                    : RP.ui.statusPill(p.cat, "neutral")
                }
              </div>
            </div>
            <div class="dish-body">
              <div class="dish-head">
                <span class="dish-name">${esc(p.nombre)}</span>
                <span class="dish-price">${RP.format.money(p.precio)}</span>
              </div>
              <p class="dish-desc">${esc(p.desc)}</p>
              <div class="dish-actions">
                <button type="button" class="btn btn-ghost" data-dish-detail="${esc(p.id)}">Detalle</button>
                <button type="button" class="btn btn-primary" data-client-add="${esc(p.id)}" ${p.disponible ? "" : "disabled"}>
                  ${p.disponible ? "+ Agregar" : "Sin stock"}
                </button>
              </div>
            </div>
          </article>`
          )
          .join("")
      : RP.ui.emptyState(
          "No encontramos ese plato",
          "Prueba otra categoría o limpia el buscador para ver toda la carta.",
          `<button type="button" class="btn btn-primary" id="btn-clear-search">Ver toda la carta</button>`
        );

    const activeTracker = st.orders.find((o) => o.id === st.lastClientOrderId);

    return `
      <section class="client-hero" aria-label="Bienvenida RED PEPPER">
        <div>
          <div class="hero-eyebrow">${st.jornadaAbierta ? "Atendiendo ahora · Preparación al instante" : "Jornada cerrada por hoy"}</div>
          <h1 class="hero-title">Sánguches, Salchipapas &amp; Más, preparados al momento</h1>
          <p class="hero-copy">Elige tu canal, personaliza tus cremas y sigue tu comanda en tiempo real directo desde cocina.</p>
          <div class="channel-bar" role="group" aria-label="Canal de pedido" id="client-channels">
            ${["Presencial", "Para llevar", "Pedido externo"]
              .map(
                (ch) => `<button type="button" class="chip-btn ${st.clientChannel === ch ? "active" : ""}" data-client-channel="${esc(ch)}">${
                  ch === "Presencial" ? "En Local" : ch === "Pedido externo" ? "WhatsApp / Externo" : ch
                }</button>`
              )
              .join("")}
          </div>
        </div>
        <div class="hero-media">
          <img src="assets/salchipapa.webp" alt="Salchipapa clásica recién preparada de RED PEPPER" width="640" height="478" />
          <span class="hero-caption-pill">Clásicas desde S/ 8.00</span>
        </div>
      </section>

      <div class="filter-bar">
        <div class="channel-bar" role="tablist" aria-label="Categorías de carta">
          ${categories
            .map(
              (c) => `<button type="button" class="chip-btn ${st.clientCategory === c ? "active" : ""}" data-client-cat="${esc(c)}">${esc(c)}</button>`
            )
            .join("")}
        </div>
        <div class="search-input-wrap">
          <label for="client-search-input" class="sr-only">Buscar en la carta</label>
          <input id="client-search-input" class="input-control" type="search" value="${esc(st.clientSearch)}" placeholder="Buscar salchipapa, burger..." />
        </div>
      </div>

      <div class="split-pos">
        <div class="dish-grid">${cardsHtml}</div>
        <aside style="display:flex; flex-direction:column; gap:16px;" aria-label="Resumen rápido">
          ${renderCartCard(st, true)}
          ${
            activeTracker
              ? `<div class="card">
                  <div class="card-head">
                    <h2 class="card-title">Tu Última Comanda</h2>
                    <span class="mono">${esc(activeTracker.id)}</span>
                  </div>
                  ${renderTrackerSteps(activeTracker)}
                </div>`
              : ""
          }
        </aside>
      </div>
    `;
  }

  function renderCartCard(st, compact) {
    const esc = RP.format.escapeHtml;
    const total = st.clientCart.reduce((s, l) => s + l.precio * l.qty, 0);
    const linesHtml = st.clientCart.length
      ? st.clientCart
          .map(
            (line, idx) => `
          <div class="cart-line">
            <div class="cart-top">
              <div>
                <strong>${esc(line.nombre)}</strong>
                <div class="mono" style="color:var(--color-text-secondary);">${RP.format.money(line.precio * line.qty)}</div>
              </div>
              <div class="cart-controls">
                <button type="button" class="qty-btn" data-client-qty="${idx}" data-delta="-1" aria-label="Restar ${esc(line.nombre)}">-</button>
                <strong class="mono" style="min-width:20px; text-align:center;">${line.qty}</strong>
                <button type="button" class="qty-btn" data-client-qty="${idx}" data-delta="1" aria-label="Sumar ${esc(line.nombre)}">+</button>
              </div>
            </div>
            <div class="cremas-row">
              ${st.cremas
                .map(
                  (c) => `<button type="button" class="crema-tag ${line.extras.includes(c) ? "selected" : ""}" data-client-extra="${idx}" data-crema="${esc(c)}">${esc(c)}</button>`
                )
                .join("")}
            </div>
          </div>`
          )
          .join("")
      : RP.ui.emptyState(
          "Tu pedido está vacío",
          "Agrega platos desde la carta para ver tu resumen y enviarlo a cocina.",
          compact ? "" : `<button type="button" class="btn btn-primary" data-go-carta="1">Ir a la Carta</button>`
        );

    return `
      <div class="card">
        <div class="card-head">
          <h2 class="card-title">Tu Pedido (${esc(st.clientChannel === "Pedido externo" ? "WhatsApp" : st.clientChannel)})</h2>
          ${st.clientCart.length ? `<button type="button" class="btn btn-ghost" id="btn-client-clear">Vaciar</button>` : ""}
        </div>
        ${linesHtml}
        ${
          st.clientCart.length
            ? `
          <div class="field" style="margin-top:12px;">
            <label for="client-order-note">Indicaciones para cocina (opcional)</label>
            <input id="client-order-note" type="text" placeholder="Ej. papas bien crocantes, sin ensalada" />
          </div>
          <div class="total-row">
            <span style="font-weight:700;">Total estimado</span>
            <span class="total-amount">${RP.format.money(total)}</span>
          </div>
          <button type="button" class="btn btn-primary btn-full" id="btn-client-confirm">Confirmar y Enviar Pedido</button>`
            : ""
        }
      </div>
    `;
  }

  function renderTrackerSteps(order) {
    const steps = ["Pendiente", "En preparación", "Listo"];
    const curIdx = steps.indexOf(order.estado);
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:6px;">
        <span class="pill pill-neutral">${RP.format.escapeHtml(order.canal)}</span>
        <span class="mono">${RP.format.escapeHtml(order.hora)} · ${RP.format.money(order.total)}</span>
      </div>
      <div class="tracker-steps">
        ${steps
          .map((s, idx) => {
            const cls = idx < curIdx ? "done" : idx === curIdx ? (s === "Listo" ? "done" : "current") : "";
            return `<div class="tracker-step ${cls}">${s}</div>`;
          })
          .join("")}
      </div>
    `;
  }

  function renderSeguimientoTab(st) {
    const esc = RP.format.escapeHtml;
    const recentIds = new Set(st.clientOrderIds || []);
    const clientOrders = st.orders.filter((o) => recentIds.has(o.id) || o.id === st.lastClientOrderId);
    const active = st.orders.find((o) => o.id === st.lastClientOrderId) || clientOrders[0];

    return `
      <div class="view-header">
        <div>
          <h1>Seguimiento de Pedido</h1>
          <p class="view-sub">Estado en tiempo real sincronizado con Cocina (KDS)</p>
        </div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-head">
            <h2 class="card-title">Comanda Activa</h2>
            ${active ? `<strong class="mono">${esc(active.id)}</strong>` : ""}
          </div>
          ${
            active
              ? `${renderTrackerSteps(active)}
                <ul class="kds-items" style="margin-top:12px;">
                  ${active.items
                    .map(
                      (i) => `<li><strong class="mono">${i.qty}×</strong> ${esc(i.nombre)}${
                        i.extras.length ? ` <span style="color:var(--color-text-secondary);">(${esc(i.extras.join(", "))})</span>` : ""
                      }</li>`
                    )
                    .join("")}
                </ul>`
              : RP.ui.emptyState("Sin pedidos recientes", "Cuando envíes un pedido verás aquí su avance.")
          }
        </div>
        <div class="card">
          <div class="card-head">
            <h2 class="card-title">Historial de este Dispositivo</h2>
          </div>
          ${
            clientOrders.length
              ? `<div class="table-wrap"><table><thead><tr><th>Comanda</th><th>Canal</th><th>Estado</th><th class="num">Total</th></tr></thead><tbody>
                ${clientOrders
                  .map(
                    (o) => `<tr>
                      <td class="mono">${esc(o.id)}</td>
                      <td>${esc(o.canal)}</td>
                      <td>${RP.ui.statusPill(o.estado, o.estado === "Listo" ? "ok" : o.estado === "En preparación" ? "warn" : "danger")}</td>
                      <td class="num">${RP.format.money(o.total)}</td>
                    </tr>`
                  )
                  .join("")}
                </tbody></table></div>`
              : `<p class="view-sub">Aún no hay pedidos guardados en esta sesión.</p>`
          }
        </div>
      </div>
    `;
  }

  function renderLocalTab(st) {
    const esc = RP.format.escapeHtml;
    return `
      <div class="view-header">
        <div>
          <h1>RED PEPPER — El Local</h1>
          <p class="view-sub">Sánguches, Salchipapas &amp; Más · Atención directa al instante</p>
        </div>
      </div>
      <div class="grid-3">
        <div class="card">
          <h2 class="card-title" style="margin-bottom:8px;">Horario de Atención</h2>
          <p style="margin-bottom:8px;">Jornada operativa configurada:</p>
          <p class="mono" style="font-size:16px; font-weight:700; color:var(--brand-green);">${esc(st.jornadaInicio)} – ${esc(st.jornadaFin)}</p>
          ${RP.ui.statusPill(st.jornadaAbierta ? "Local Abierto" : "Local Cerrado", st.jornadaAbierta ? "ok" : "danger", st.jornadaAbierta)}
        </div>
        <div class="card">
          <h2 class="card-title" style="margin-bottom:8px;">Canales Disponibles</h2>
          <ul class="kds-items" style="margin:0;">
            <li><strong>En Local:</strong> atención presencial en barra y salón.</li>
            <li><strong>Para llevar:</strong> empaque listo para recoger en mostrador.</li>
            <li><strong>WhatsApp / Externo:</strong> recojo coordinado o motorizado propio.</li>
          </ul>
        </div>
        <div class="card">
          <h2 class="card-title" style="margin-bottom:8px;">Nuestro Compromiso</h2>
          <p style="margin:0; color:var(--color-text-secondary);">Todos nuestros productos se preparan al instante sin precocidos y con cremas de la casa a tu elección.</p>
        </div>
      </div>
    `;
  }

  function render(container, st) {
    if (st.activeTab === "pedido") {
      container.innerHTML = `<div class="view-header"><div><h1>Tu Pedido</h1><p class="view-sub">Revisa cantidades, cremas y canal antes de enviar a cocina</p></div></div>${renderCartCard(st, false)}`;
    } else if (st.activeTab === "seguimiento") {
      container.innerHTML = renderSeguimientoTab(st);
    } else if (st.activeTab === "local") {
      container.innerHTML = renderLocalTab(st);
    } else {
      container.innerHTML = renderCartaTab(st);
    }
    bindEvents(container);
  }

  function bindEvents(container) {
    container.querySelectorAll("[data-client-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        RP.store.getState().clientCategory = btn.dataset.clientCat;
        RP.store.notify();
      });
    });

    container.querySelector("#client-search-input")?.addEventListener("input", (e) => {
      const val = e.target.value;
      const pos = e.target.selectionStart;
      RP.store.getState().clientSearch = val;
      RP.store.notify();
      const el = document.getElementById("client-search-input");
      if (el) {
        el.focus();
        el.setSelectionRange(pos, pos);
      }
    });

    container.querySelector("#btn-clear-search")?.addEventListener("click", () => {
      const st = RP.store.getState();
      st.clientCategory = "Todos";
      st.clientSearch = "";
      RP.store.notify();
    });

    container.querySelectorAll("[data-client-channel]").forEach((btn) => {
      btn.addEventListener("click", () => {
        RP.store.getState().clientChannel = btn.dataset.clientChannel;
        RP.store.notify();
      });
    });

    container.querySelectorAll("[data-client-add]").forEach((btn) => {
      btn.addEventListener("click", () => RP.actions.addToCart("client", btn.dataset.clientAdd));
    });

    container.querySelectorAll("[data-dish-detail]").forEach((btn) => {
      btn.addEventListener("click", () => openDishModal(btn.dataset.dishDetail));
    });

    container.querySelectorAll("[data-client-qty]").forEach((btn) => {
      btn.addEventListener("click", () =>
        RP.actions.changeCartQty("client", Number(btn.dataset.clientQty), Number(btn.dataset.delta))
      );
    });

    container.querySelectorAll("[data-client-extra]").forEach((btn) => {
      btn.addEventListener("click", () =>
        RP.actions.toggleCartExtra("client", Number(btn.dataset.clientExtra), btn.dataset.crema)
      );
    });

    container.querySelector("#btn-client-clear")?.addEventListener("click", () => RP.actions.clearCart("client"));
    container.querySelector("#btn-client-confirm")?.addEventListener("click", () => {
      const note = document.getElementById("client-order-note")?.value || "";
      RP.actions.confirmOrder("client", note);
    });
    container.querySelector("[data-go-carta]")?.addEventListener("click", () => RP.actions.navigate("cliente", "carta"));
  }

  RP.apps = RP.apps || {};
  RP.apps.cliente = { render };
})(window);
