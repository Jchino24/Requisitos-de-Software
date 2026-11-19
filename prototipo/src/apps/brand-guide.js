/* =====================================================================
   RED PEPPER — Visor Interno de Guía de Marca y Sistema de Diseño
   Exclusivo para equipo interno (?app=marca); oculto en nav pública.
   ===================================================================== */
(function (global) {
  const RP = (global.RP = global.RP || {});

  const SWATCHES = [
    { name: "Rojo Brillante (Oficial)", hex: "#FF3131", fg: "#1C1917", note: "Marca / títulos grandes / borde de énfasis (AA 4.78:1 con carbón)" },
    { name: "Rojo CTA Accesible", hex: "#D91B1B", fg: "#FFFFFF", note: "Botones con texto blanco (AA 5.09:1)" },
    { name: "Naranja Vivo (Oficial)", hex: "#F64301", fg: "#1C1917", note: "Promociones / destacados cálidos (AA 4.77:1 con carbón)" },
    { name: "Verde Oscuro (Oficial)", hex: "#1F6636", fg: "#FFFFFF", note: "Secundario / disponible / listo (AAA 6.97:1)" },
    { name: "Lienzo Alabastro", hex: "#FAF8F5", fg: "#1C1917", note: "Fondo general antirreflejo (16.50:1)" },
    { name: "Carbón Cálido", hex: "#1C1917", fg: "#FFFFFF", note: "Tinta principal y cierre contable" },
  ];

  function render(container) {
    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Guía de Marca Interna — RED PEPPER</h1>
          <p class="view-sub">Sistema visual oficial, contraste WCAG 2.2 AA y componentes reutilizables (uso interno)</p>
        </div>
        <button type="button" class="btn btn-ghost" id="btn-marca-back-admin">Volver a Administración</button>
      </div>

      <div class="grid-2" style="margin-bottom:18px;">
        <div class="card">
          <div class="card-head"><h2 class="card-title">Logotipo Oficial y Variantes</h2></div>
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="padding:14px; border:1px solid var(--color-border); border-radius:var(--radius-sm); background:#FFFFFF;">
              <img src="assets/logo-red-pepper.svg" alt="Logotipo horizontal RED PEPPER sobre claro" style="height:54px;" />
            </div>
            <div style="padding:14px; border-radius:var(--radius-sm); background:var(--color-surface-dark);">
              <img src="assets/logo-red-pepper-dark.svg" alt="Logotipo horizontal RED PEPPER sobre oscuro" style="height:54px;" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-head"><h2 class="card-title">Tipografía y Estados de Interfaz</h2></div>
          <p style="font-size:20px; font-weight:800; margin-bottom:6px;">Source Sans 3 — Sánguches, Salchipapas &amp; Más</p>
          <p class="mono" style="font-size:15px; margin-bottom:14px;">JetBrains Mono Tabular: S/ 8.00 · S/ 12.50 · CMD-0845</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            <button type="button" class="btn btn-primary">Botón Primario AA</button>
            <button type="button" class="btn btn-green">Confirmar Verde</button>
            <button type="button" class="btn btn-orange">Destacado Promo</button>
            ${RP.ui.statusPill("Disponible", "ok", true)}
            ${RP.ui.statusPill("En preparación", "warn")}
            ${RP.ui.statusPill("Agotado", "danger")}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-head"><h2 class="card-title">Paleta Oficial y Derivados de Contraste</h2></div>
        <div class="swatch-grid">
          ${SWATCHES.map(
            (s) => `
            <div class="swatch-card">
              <div class="swatch-color" style="background:${s.hex}; color:${s.fg};">${s.hex}</div>
              <div class="swatch-meta">
                <strong style="display:block; margin-bottom:2px;">${s.name}</strong>
                <span style="color:var(--color-text-secondary);">${s.note}</span>
              </div>
            </div>`
          ).join("")}
        </div>
      </div>
    `;

    container.querySelector("#btn-marca-back-admin")?.addEventListener("click", () => RP.actions.navigate("admin", "config"));
  }

  RP.apps = RP.apps || {};
  RP.apps["brand-guide"] = { render };
})(window);
