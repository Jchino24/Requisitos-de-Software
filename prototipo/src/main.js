/* =====================================================================
   RED PEPPER — Orquestador de Portales, Router y Accesibilidad Global
   Separa Experiencia Pública (Cliente) de Portales Internos (Equipo).
   ===================================================================== */
(function (global) {
  const RP = (global.RP = global.RP || {});

  function openStaffPortalSwitcher() {
    const st = RP.store.getState();
    RP.modal.openModal({
      title: "Acceso Equipo RED PEPPER",
      bodyHtml: `
        <p class="view-sub" style="margin-bottom:12px;">
          Entorno interno separado de la carta pública. <span class="pill pill-neutral">Demo local sin JWT real (RNF-01)</span>
        </p>
        <div class="grid-2" style="gap:10px;">
          <button type="button" class="btn btn-touch ${st.activeApp === "pos" ? "btn-primary" : ""}" data-switch-app="pos" data-switch-tab="mostrador">Mostrador POS (ACT-0002)</button>
          <button type="button" class="btn btn-touch ${st.activeApp === "cocina" ? "btn-primary" : ""}" data-switch-app="cocina" data-switch-tab="kds">Cocina KDS (ACT-0003)</button>
          <button type="button" class="btn btn-touch ${st.activeApp === "admin" ? "btn-primary" : ""}" data-switch-app="admin" data-switch-tab="margen">Gerencia &amp; NIIF 18 (ACT-0001/04)</button>
          <button type="button" class="btn btn-touch ${st.activeApp === "marca" ? "btn-primary" : ""}" data-switch-app="marca" data-switch-tab="guia">Guía de Marca Interna</button>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" data-switch-app="cliente" data-switch-tab="carta">Ir a Experiencia Cliente</button>
        </div>
      `,
      onMount(dialog, close) {
        dialog.querySelectorAll("[data-switch-app]").forEach((b) =>
          b.addEventListener("click", () => {
            RP.actions.navigate(b.dataset.switchApp, b.dataset.switchTab);
            close();
          })
        );
      },
    });
  }

  function renderHeader(st) {
    const topbar = document.getElementById("app-topbar");
    const isPublic = st.activeApp === "cliente";
    topbar.className = isPublic ? "topbar" : "topbar topbar-staff";

    const cartCount = st.clientCart.reduce((s, l) => s + l.qty, 0);

    let navItems = [];
    if (isPublic) {
      navItems = [
        { app: "cliente", tab: "carta", label: "Carta" },
        { app: "cliente", tab: "pedido", label: "Tu Pedido", badge: cartCount },
        { app: "cliente", tab: "seguimiento", label: "Seguimiento" },
        { app: "cliente", tab: "local", label: "El Local" },
      ];
    } else if (st.activeApp === "admin") {
      navItems = [
        { app: "admin", tab: "margen", label: "Margen P-14" },
        { app: "admin", tab: "compras", label: "Compras y Carta" },
        { app: "admin", tab: "contabilidad", label: "Contabilidad" },
        { app: "admin", tab: "config", label: "Configuración" },
      ];
    } else {
      navItems = [
        { app: "pos", tab: "mostrador", label: "Mostrador POS" },
        { app: "cocina", tab: "kds", label: "Cocina KDS" },
        { app: "admin", tab: "margen", label: "Gerencia" },
        { app: "cliente", tab: "carta", label: "Vista Cliente" },
      ];
    }

    const navHtml = navItems
      .map((item) => {
        const isActive = st.activeApp === item.app && st.activeTab === item.tab;
        const badge = item.badge > 0 ? `<span class="nav-badge">${item.badge}</span>` : "";
        return `<button type="button" class="nav-tab ${isActive ? "active" : ""}" data-nav-app="${item.app}" data-nav-tab="${item.tab}">${item.label}${badge}</button>`;
      })
      .join("");

    topbar.innerHTML = `
      <div class="topbar-inner">
        <button type="button" class="brand-lockup" id="btn-brand-home" aria-label="Ir al inicio de RED PEPPER">
          <img src="assets/logo-red-pepper.svg" alt="RED PEPPER — Sánguches, Salchipapas &amp; Más" class="brand-logo-full" width="210" height="44" />
          <img src="assets/logo-red-pepper-mark.svg" alt="RED PEPPER" class="brand-logo-mark" width="36" height="36" />
        </button>

        <nav class="primary-nav ${isPublic ? "primary-nav-client" : ""}" aria-label="${isPublic ? "Navegación cliente" : "Navegación operativa"}">
          ${navHtml}
        </nav>

        <div class="header-tools">
          ${RP.ui.statusPill(st.jornadaAbierta ? "Abierto" : "Cerrado", st.jornadaAbierta ? "ok" : "danger", st.jornadaAbierta)}
          <button type="button" class="btn btn-ghost" id="btn-staff-switcher">${RP.ui.ICONS.staff}<span>${isPublic ? "Equipo" : "Cambiar Rol"}</span></button>
        </div>
      </div>
    `;

    // Barra inferior fija móvil solo en experiencia cliente
    const mobileBar = document.getElementById("mobile-bottom-nav");
    if (isPublic) {
      mobileBar.style.display = "";
      mobileBar.innerHTML = navItems
        .map((item) => {
          const isActive = st.activeTab === item.tab;
          const badge = item.badge > 0 ? ` (${item.badge})` : "";
          return `<button type="button" class="nav-tab ${isActive ? "active" : ""}" data-nav-app="cliente" data-nav-tab="${item.tab}">${item.label}${badge}</button>`;
        })
        .join("");
    } else {
      mobileBar.style.display = "none";
      mobileBar.innerHTML = "";
    }

    document.querySelectorAll("[data-nav-app]").forEach((btn) =>
      btn.addEventListener("click", () => RP.actions.navigate(btn.dataset.navApp, btn.dataset.navTab))
    );
    document.getElementById("btn-brand-home")?.addEventListener("click", () =>
      RP.actions.navigate(isPublic ? "cliente" : st.activeApp)
    );
    document.getElementById("btn-staff-switcher")?.addEventListener("click", openStaffPortalSwitcher);
  }

  function renderBreadcrumb(st) {
    const el = document.getElementById("portal-breadcrumb");
    if (st.activeApp === "cliente") {
      el.style.display = "none";
      return;
    }
    el.style.display = "flex";
    const labels = {
      pos: "Operaciones / Mostrador POS",
      cocina: "Operaciones / Cocina (KDS)",
      admin: "Gerencia / Administración y Contabilidad",
      marca: "Uso Interno / Guía de Marca RED PEPPER",
    };
    el.innerHTML = `
      <span><strong>Portal Interno:</strong> ${labels[st.activeApp] || st.activeApp} · <strong>${RP.format.escapeHtml(st.activeRole)}</strong></span>
      <button type="button" class="btn btn-ghost" style="min-height:34px; padding:4px 10px; font-size:12px;" id="btn-back-public">Ir a Carta Pública</button>
    `;
    document.getElementById("btn-back-public")?.addEventListener("click", () => RP.actions.navigate("cliente", "carta"));
  }

  function renderAll() {
    const st = RP.store.getState();
    renderHeader(st);
    renderBreadcrumb(st);

    const mount = document.getElementById("app-content");
    if (st.activeApp === "pos") {
      RP.apps.pos.render(mount, st);
    } else if (st.activeApp === "cocina") {
      RP.apps.cocina.render(mount, st);
    } else if (st.activeApp === "admin") {
      RP.apps.admin.render(mount, st);
    } else if (st.activeApp === "marca") {
      RP.apps["brand-guide"].render(mount, st);
    } else {
      RP.apps.cliente.render(mount, st);
    }
  }

  global.addEventListener("DOMContentLoaded", () => {
    RP.store.subscribe(renderAll);
    RP.actions.applyLegacyOrUrlParams();
    renderAll();
  });

  RP.main = { renderAll, openStaffPortalSwitcher };
})(window);
