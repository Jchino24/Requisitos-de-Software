/* =====================================================================
   RED PEPPER — Reglas de Negocio, Cálculos (P-14 / NIIF 18) y Mutaciones
   ===================================================================== */
(function (global) {
  const RP = (global.RP = global.RP || {});

  const LEGACY_VIEW_MAP = {
    cliente: { app: "cliente", tab: "carta", role: "ACT-0005 · Cliente" },
    pos: { app: "pos", tab: "mostrador", role: "ACT-0002 · Caja / Mostrador" },
    cocina: { app: "cocina", tab: "kds", role: "ACT-0003 · Cocina / Chef" },
    "admin-margen": { app: "admin", tab: "margen", role: "ACT-0001 · Jerry (Dueño)" },
    "admin-operaciones": { app: "admin", tab: "compras", role: "ACT-0001 · Jerry (Admin)" },
    "admin-contabilidad": { app: "admin", tab: "contabilidad", role: "ACT-0004 · Contador & Jerry" },
  };

  const APP_DEFAULT_TABS = {
    cliente: "carta",
    pos: "mostrador",
    cocina: "kds",
    admin: "margen",
    marca: "guia",
  };

  const ROLE_BY_APP = {
    cliente: "ACT-0005 · Cliente",
    pos: "ACT-0002 · Caja / Mostrador",
    cocina: "ACT-0003 · Cocina / Chef",
    admin: "ACT-0001 · Gerencia & Contabilidad",
    marca: "Uso Interno · Identidad de Marca",
  };

  function showToast(msg) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(RP._toastTimer);
    RP._toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
  }

  function addAudit(usuario, accion, detalle) {
    const st = RP.store.getState();
    st.auditLog.unshift({
      fecha: RP.format.nowStamp(),
      usuario,
      accion,
      detalle,
    });
  }

  function navigate(app, tab) {
    const st = RP.store.getState();
    st.activeApp = APP_DEFAULT_TABS[app] ? app : "cliente";
    st.activeTab = tab || APP_DEFAULT_TABS[st.activeApp];
    st.activeRole = ROLE_BY_APP[st.activeApp] || "Usuario";
    RP.store.notify();
  }

  function applyLegacyOrUrlParams() {
    const params = new URLSearchParams(global.location.search);
    if (params.get("capture") === "1") {
      document.documentElement.classList.add("no-anim");
    }
    const legacyView = params.get("view");
    const appParam = params.get("app");
    const tabParam = params.get("tab");

    if (legacyView && LEGACY_VIEW_MAP[legacyView]) {
      const m = LEGACY_VIEW_MAP[legacyView];
      navigate(m.app, m.tab);
      return;
    }
    if (appParam && APP_DEFAULT_TABS[appParam]) {
      navigate(appParam, tabParam || APP_DEFAULT_TABS[appParam]);
    }
  }

  function getEffectiveWorkingDaysCount() {
    const st = RP.store.getState();
    return Math.max(1, st.workingDays.filter((d) => d.active).length);
  }

  function computeDailyMetrics() {
    const st = RP.store.getState();
    const ventasHoy = st.orders.reduce((acc, o) => acc + o.total, 0);
    const effectiveDays = getEffectiveWorkingDaysCount();
    const comprasSemanales = st.purchases
      .filter((p) => p.tipo === "Semanal")
      .reduce((s, p) => s + p.monto, 0);
    const cuotaDiaria = comprasSemanales / effectiveDays;
    const comprasAdicionales = st.purchases
      .filter((p) => p.tipo === "Adicional")
      .reduce((s, p) => s + p.monto, 0);
    const costoAsignado = cuotaDiaria + comprasAdicionales;
    const margenBruto = ventasHoy - costoAsignado;
    const margenPct = ventasHoy > 0 ? (margenBruto / ventasHoy) * 100 : 0;

    return {
      ventasHoy,
      effectiveDays,
      comprasSemanales,
      cuotaDiaria,
      comprasAdicionales,
      costoAsignado,
      margenBruto,
      margenPct,
    };
  }

  function addToCart(target, prodId, customExtras) {
    const st = RP.store.getState();
    const prod = st.menu.find((p) => p.id === prodId);
    if (!prod || !prod.disponible) {
      showToast("Producto agotado: no se puede agregar (R-ENT2-05).");
      return false;
    }
    const cart = target === "client" ? st.clientCart : st.posCart;
    const extras = Array.isArray(customExtras) ? [...customExtras] : [];
    const sameSig = (a, b) =>
      a.length === b.length && a.every((v) => b.includes(v));
    const existing = cart.find(
      (c) => c.prodId === prodId && sameSig(c.extras, extras)
    );
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        prodId: prod.id,
        nombre: prod.nombre,
        precio: prod.precio,
        qty: 1,
        extras,
      });
    }
    RP.store.notify();
    showToast(`${prod.nombre} agregado al pedido.`);
    return true;
  }

  function changeCartQty(target, index, delta) {
    const st = RP.store.getState();
    const cart = target === "client" ? st.clientCart : st.posCart;
    if (!cart[index]) return;
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    RP.store.notify();
  }

  function toggleCartExtra(target, index, crema) {
    const st = RP.store.getState();
    const cart = target === "client" ? st.clientCart : st.posCart;
    const item = cart[index];
    if (!item) return;
    if (item.extras.includes(crema)) {
      item.extras = item.extras.filter((e) => e !== crema);
    } else {
      item.extras.push(crema);
    }
    RP.store.notify();
  }

  function clearCart(target) {
    const st = RP.store.getState();
    if (target === "client") st.clientCart = [];
    else st.posCart = [];
    RP.store.notify();
    showToast("Borrador de pedido vaciado.");
  }

  function confirmOrder(target, clientNote) {
    const st = RP.store.getState();
    const cart = target === "client" ? st.clientCart : st.posCart;
    if (!cart.length) {
      showToast("Agrega al menos un producto antes de confirmar.");
      return null;
    }
    for (const line of cart) {
      const prod = st.menu.find((m) => m.id === line.prodId);
      if (!prod || !prod.disponible) {
        showToast(`Bloqueado: "${line.nombre}" fue marcado como agotado (R-ENT2-05).`);
        return null;
      }
    }
    st.ordenSeq += 1;
    const newId = `CMD-${String(st.ordenSeq).padStart(4, "0")}`;
    const total = cart.reduce((s, l) => s + l.precio * l.qty, 0);
    const canal = target === "client" ? st.clientChannel : st.posChannel;
    const pago = target === "client" ? "Pago en mostrador / Yape" : st.posPayMethod;

    const order = {
      id: newId,
      hora: RP.format.nowTime(),
      canal,
      pago,
      estado: "Pendiente",
      nota: (clientNote || "").trim(),
      items: structuredClone(cart),
      total,
    };

    st.orders.unshift(order);
    if (target === "client") {
      st.lastClientOrderId = newId;
      st.clientOrderIds = [newId, ...(st.clientOrderIds || [])].slice(0, 8);
      st.clientCart = [];
      st.activeTab = "seguimiento";
    } else {
      st.posCart = [];
    }

    addAudit(
      target === "client" ? "Cliente (ACT-0005)" : "Caja (ACT-0002)",
      "CONFIRMA_VENTA",
      `Comanda ${newId} (${canal}) por ${RP.format.money(total)} enviada a cocina.`
    );
    RP.store.notify();
    showToast(`Comanda ${newId} confirmada y enviada a cocina.`);
    return order;
  }

  function advanceOrderState(orderId, nextState) {
    const st = RP.store.getState();
    const order = st.orders.find((o) => o.id === orderId);
    if (!order) return;
    const allowed = {
      Pendiente: ["En preparación"],
      "En preparación": ["Listo"],
    };
    if (!allowed[order.estado] || !allowed[order.estado].includes(nextState)) {
      showToast("Transición de estado no autorizada (R-OBS-03).");
      return;
    }
    order.estado = nextState;
    addAudit("Cocina (ACT-0003)", "ESTADO_COMANDA", `${order.id} pasó a "${nextState}".`);
    RP.store.notify();
    showToast(`Comanda ${order.id} actualizada a ${nextState}.`);
  }

  function toggleProductStock(prodId) {
    const st = RP.store.getState();
    const prod = st.menu.find((m) => m.id === prodId);
    if (!prod) return;
    prod.disponible = !prod.disponible;
    addAudit(
      st.activeRole,
      prod.disponible ? "STOCK_DISPONIBLE" : "STOCK_AGOTADO",
      `${prod.id} ${prod.nombre} marcado como ${prod.disponible ? "Disponible" : "Agotado"}.`
    );
    RP.store.notify();
    showToast(`${prod.nombre}: ${prod.disponible ? "Disponible" : "Agotado"}.`);
  }

  function toggleWorkingDay(dayId) {
    const st = RP.store.getState();
    const day = st.workingDays.find((d) => d.id === dayId);
    if (!day) return;
    day.active = !day.active;
    addAudit(
      "Jerry (ACT-0001)",
      "CALENDARIO_PRORRATEO",
      `Jornada ${day.label} marcada como ${day.active ? "hábil efectiva" : "no laborada / feriado"} (P-14).`
    );
    RP.store.notify();
  }

  function registerPurchase({ proveedor, ruc, insumo, tipo, monto, sizeKb }) {
    const st = RP.store.getState();
    if (st.periodoCerrado) {
      return { ok: false, error: "Periodo cerrado: use nota de ajuste autorizada (R-ENT2-13)." };
    }
    const cleanProv = (proveedor || "").trim();
    const cleanInsumo = (insumo || "").trim();
    const cleanRuc = (ruc || "").trim();
    const numMonto = parseFloat(monto);

    if (!cleanProv || !cleanInsumo || Number.isNaN(numMonto) || numMonto <= 0) {
      return { ok: false, error: "Proveedor, insumo y monto mayor a S/ 0.00 son obligatorios (R-ENT2-16)." };
    }
    if (cleanRuc && !/^\d{11}$/.test(cleanRuc)) {
      return { ok: false, error: "El RUC debe tener exactamente 11 dígitos numéricos." };
    }

    const kb = parseInt(sizeKb || "320", 10);
    const compNote = kb > 1024 ? `${Math.round(kb * 0.35)} KB (comprimido <1MB)` : `${kb} KB`;
    const id = `CMP-${100 + st.purchases.length + 1}`;
    st.purchases.unshift({
      id,
      fecha: new Date().toISOString().slice(0, 10),
      proveedor: cleanProv,
      ruc: cleanRuc || "20600000001",
      insumo: cleanInsumo,
      tipo: tipo === "Adicional" ? "Adicional" : "Semanal",
      monto: numMonto,
      comprobante: `F001-00${Math.floor(1000 + Math.random() * 8999)}.pdf (${compNote})`,
      sha256: Math.random().toString(16).slice(2, 6) + "..." + Math.random().toString(16).slice(2, 6),
      cifrado: true,
    });
    addAudit("Jerry (ACT-0001)", "REGISTRA_COMPRA", `${id} (${tipo}) ${cleanInsumo} — ${RP.format.money(numMonto)}.`);
    RP.store.notify();
    showToast(`Compra ${id} (${tipo}) registrada.`);
    return { ok: true };
  }

  function correctPurchaseAmount(cmpId, newAmount, reason) {
    const st = RP.store.getState();
    if (st.periodoCerrado) {
      return { ok: false, error: "Periodo cerrado: edición directa bloqueada (RNF-07)." };
    }
    const p = st.purchases.find((x) => x.id === cmpId);
    if (!p) return { ok: false, error: "Compra no encontrada." };
    const val = parseFloat(newAmount);
    if (Number.isNaN(val) || val <= 0) {
      return { ok: false, error: "El nuevo monto debe ser mayor a S/ 0.00 (R-ENT2-16)." };
    }
    if (!reason || !reason.trim()) {
      return { ok: false, error: "El motivo de corrección es obligatorio (R-ENT2-08)." };
    }
    const prev = p.monto;
    p.monto = val;
    addAudit(
      "Jerry (ACT-0001)",
      "CORRIGE_COMPRA",
      `${p.id}: ${RP.format.money(prev)} -> ${RP.format.money(val)}. Motivo: ${reason.trim()}`
    );
    RP.store.notify();
    showToast(`Compra ${p.id} corregida y auditada.`);
    return { ok: true };
  }

  function updateMenuPrice(prodId, newPrice) {
    const st = RP.store.getState();
    const prod = st.menu.find((m) => m.id === prodId);
    if (!prod) return { ok: false, error: "Producto no encontrado." };
    const val = parseFloat(newPrice);
    if (Number.isNaN(val) || val <= 0) {
      return { ok: false, error: "Precio inválido: debe ser mayor a S/ 0.00." };
    }
    const prev = prod.precio;
    prod.precio = val;
    addAudit(
      "Jerry (ACT-0001)",
      "CAMBIO_PRECIO",
      `${prod.id} ${prod.nombre}: ${RP.format.money(prev)} -> ${RP.format.money(val)} (histórico intacto R-PRE-13).`
    );
    RP.store.notify();
    showToast(`Precio de ${prod.nombre} actualizado a ${RP.format.money(val)}.`);
    return { ok: true };
  }

  function createMenuItem({ nombre, cat, precio, desc }) {
    const st = RP.store.getState();
    const cleanName = (nombre || "").trim();
    const val = parseFloat(precio);
    if (!cleanName || Number.isNaN(val) || val <= 0) {
      return { ok: false, error: "Nombre y precio válido (> 0) obligatorios." };
    }
    const imgByCat = {
      Salchipapas: "assets/salchipapa.webp",
      Hamburguesas: "assets/hamburguesa.webp",
      Especiales: "assets/alitas.webp",
      Bebidas: "assets/refresco.webp",
    };
    const newId = `P-${String(st.menu.length + 1).padStart(2, "0")}`;
    st.menu.push({
      id: newId,
      nombre: cleanName,
      cat: cat || "Especiales",
      precio: val,
      img: imgByCat[cat] || "assets/salchipapa.webp",
      destacado: false,
      desc: (desc || "Preparado al pedido en cocina.").trim(),
      disponible: true,
    });
    addAudit("Jerry (ACT-0001)", "ALTA_PLATO", `${newId} ${cleanName} (${cat}) a ${RP.format.money(val)} (R-PRE-12).`);
    RP.store.notify();
    showToast(`${cleanName} agregado a la carta.`);
    return { ok: true };
  }

  function approveTaxRule(ruleId) {
    const st = RP.store.getState();
    const rule = st.taxRules.find((r) => r.id === ruleId);
    if (!rule) return;
    st.taxRules.forEach((r) => {
      if (r.estado === "Vigente") r.estado = "Histórica";
    });
    rule.estado = "Vigente";
    addAudit("Jerry (ACT-0001)", "AUTORIZA_REGLA_TRIBUTARIA", `Regla ${rule.id} (${rule.tasaPct}%) aprobada y activada (R-ENT2-10).`);
    RP.store.notify();
    showToast(`Regla tributaria ${rule.id} autorizada.`);
  }

  function toggleJornada() {
    const st = RP.store.getState();
    st.jornadaAbierta = !st.jornadaAbierta;
    addAudit(
      "Caja / Jerry",
      st.jornadaAbierta ? "APERTURA_JORNADA" : "CIERRE_JORNADA",
      st.jornadaAbierta
        ? "Jornada operativa reabierta."
        : `Cierre de jornada consolidado con ${st.orders.length} ventas confirmadas (RF-03).`
    );
    RP.store.notify();
    showToast(st.jornadaAbierta ? "Jornada operativa abierta." : "Cierre diario consolidado (RF-03).");
  }

  function updateJornadaSchedule(inicio, fin) {
    const st = RP.store.getState();
    if (!inicio || !fin) {
      return { ok: false, error: "Debes indicar hora de inicio y fin." };
    }
    st.jornadaInicio = inicio;
    st.jornadaFin = fin;
    addAudit("Jerry (ACT-0001)", "CONFIG_JORNADA", `Horario actualizado a ${inicio} - ${fin} (R-ENT2-03).`);
    RP.store.notify();
    showToast(`Horario actualizado: ${inicio} - ${fin}.`);
    return { ok: true };
  }

  function togglePeriodLock() {
    const st = RP.store.getState();
    st.periodoCerrado = !st.periodoCerrado;
    addAudit(
      "Contador (ACT-0004)",
      st.periodoCerrado ? "CIERRA_PERIODO" : "REAPERTURA_CONTROLADA",
      st.periodoCerrado
        ? "Periodo mensual cerrado: edición directa bloqueada (RNF-07)."
        : "Periodo reabierto mediante registro autorizado."
    );
    RP.store.notify();
    showToast(st.periodoCerrado ? "Periodo mensual cerrado (RNF-07)." : "Periodo abierto.");
  }

  function registerAdjustmentNote(motivo) {
    if (!motivo || !motivo.trim()) {
      return { ok: false, error: "El motivo de la nota de ajuste es obligatorio (R-ENT2-14)." };
    }
    addAudit("Jerry + Contador", "NOTA_AJUSTE_PERIODO", `Ajuste autorizado sobre periodo cerrado: ${motivo.trim()}`);
    RP.store.notify();
    showToast("Nota de ajuste registrada en auditoría.");
    return { ok: true };
  }

  function exportCsvReport() {
    const m = computeDailyMetrics();
    const rows = [
      ["Concepto", "Monto (PEN)"],
      ["Ventas confirmadas del día", m.ventasHoy.toFixed(2)],
      ["Compras semanales totales", m.comprasSemanales.toFixed(2)],
      ["Jornadas hábiles efectivas", m.effectiveDays],
      ["Cuota diaria prorrateada", m.cuotaDiaria.toFixed(2)],
      ["Compras adicionales del día", m.comprasAdicionales.toFixed(2)],
      ["Margen bruto diario", m.margenBruto.toFixed(2)],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "RedPepper_Margen_NIIF18.csv";
    a.click();
    showToast("Reporte CSV exportado (RF-19).");
  }

  RP.actions = {
    LEGACY_VIEW_MAP,
    showToast,
    navigate,
    applyLegacyOrUrlParams,
    getEffectiveWorkingDaysCount,
    computeDailyMetrics,
    addToCart,
    changeCartQty,
    toggleCartExtra,
    clearCart,
    confirmOrder,
    advanceOrderState,
    toggleProductStock,
    toggleWorkingDay,
    registerPurchase,
    correctPurchaseAmount,
    updateMenuPrice,
    createMenuItem,
    approveTaxRule,
    toggleJornada,
    updateJornadaSchedule,
    togglePeriodLock,
    registerAdjustmentNote,
    exportCsvReport,
  };
})(window);
