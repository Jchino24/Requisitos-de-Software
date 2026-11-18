/* =====================================================================
   RedPepper ERP & Operaciones — Lógica Funcional Compartida (v2)
   Sincroniza en vivo: Cliente <-> Mostrador POS <-> Cocina KDS <-> Admin/NIIF18
   ===================================================================== */

const STORAGE_KEY = "redpepper_erp_v2_state";

const INITIAL_STATE = {
  activeView: "cliente",
  activeRole: "Cliente / Comensal",
  jornadaAbierta: true,
  jornadaHorario: "11:00 - 23:00",
  ordenSeq: 846,
  workingDays: [
    { id: "lun", label: "Lun", active: true },
    { id: "mar", label: "Mar", active: true },
    { id: "mie", label: "Mié", active: false, holiday: true },
    { id: "jue", label: "Jue", active: true },
    { id: "vie", label: "Vie", active: true },
    { id: "sab", label: "Sáb", active: false, holiday: false },
  ],
  menu: [
    { id: "P-01", nombre: "Salchipapa Clásica", cat: "Salchipapas", precio: 8.00, desc: "Papas picadas fritas al instante con hot dog clásico (F-07).", disponible: true },
    { id: "P-02", nombre: "Hamburguesa Clásica", cat: "Hamburguesas", precio: 8.00, desc: "Carne a la plancha preparada al pedido con pan y ensalada (F-07).", disponible: true },
    { id: "P-03", nombre: "Salchipapa Especial", cat: "Salchipapas", precio: 12.00, desc: "Porción doble con pollo deshilachado de Don Pollo y queso.", disponible: true },
    { id: "P-04", nombre: "Burger Pollo Deshilachado", cat: "Hamburguesas", precio: 10.50, desc: "Pollo deshilachado de distribuidora con salsa de la casa.", disponible: false },
    { id: "P-05", nombre: "Refresco Pulpa Natural", cat: "Bebidas", precio: 4.50, desc: "Pulpa natural preparada con agua hervida o mineral (500 ml).", disponible: true },
    { id: "P-06", nombre: "Gaseosa Personal", cat: "Bebidas", precio: 3.50, desc: "Botella 500 ml (Inca Kola / Coca-Cola).", disponible: true },
    { id: "P-07", nombre: "Alitas Pepper x6", cat: "Especiales", precio: 15.00, desc: "Seis piezas preparadas al momento con guarnición.", disponible: true },
  ],
  cremas: ["Mayonesa", "Ají de la casa", "Kétchup", "Mostaza", "Tártara"],
  clientCart: [
    { prodId: "P-01", nombre: "Salchipapa Clásica", precio: 8.00, qty: 1, extras: ["Ají de la casa"] },
  ],
  posCart: [
    { prodId: "P-01", nombre: "Salchipapa Clásica", precio: 8.00, qty: 2, extras: ["Mayonesa", "Ají de la casa"] },
    { prodId: "P-05", nombre: "Refresco Pulpa Natural", precio: 4.50, qty: 1, extras: [] },
  ],
  clientChannel: "Presencial",
  posChannel: "Presencial",
  posPayMethod: "Efectivo",
  lastClientOrderId: "CMD-0843",
  orders: [
    {
      id: "CMD-0845",
      hora: "19:42",
      canal: "Presencial",
      pago: "Yape / Plin",
      estado: "Pendiente",
      items: [
        { prodId: "P-01", nombre: "Salchipapa Clásica", precio: 8.00, qty: 2, extras: ["Mayonesa", "Ají de la casa"] },
        { prodId: "P-06", nombre: "Gaseosa Personal", precio: 3.50, qty: 2, extras: [] },
      ],
      total: 23.00,
    },
    {
      id: "CMD-0844",
      hora: "19:36",
      canal: "Pedido externo",
      pago: "Efectivo",
      estado: "En preparación",
      items: [
        { prodId: "P-03", nombre: "Salchipapa Especial", precio: 12.00, qty: 1, extras: ["Tártara"] },
        { prodId: "P-02", nombre: "Hamburguesa Clásica", precio: 8.00, qty: 2, extras: ["Mayonesa"] },
      ],
      total: 28.00,
    },
    {
      id: "CMD-0843",
      hora: "19:24",
      canal: "Para llevar",
      pago: "Efectivo",
      estado: "Listo",
      items: [
        { prodId: "P-02", nombre: "Hamburguesa Clásica", precio: 8.00, qty: 1, extras: ["Ají de la casa"] },
        { prodId: "P-05", nombre: "Refresco Pulpa Natural", precio: 4.50, qty: 1, extras: [] },
      ],
      total: 12.50,
    },
    {
      id: "CMD-0842",
      hora: "18:55",
      canal: "Presencial",
      pago: "POS Tarjeta",
      estado: "Listo",
      items: [
        { prodId: "P-01", nombre: "Salchipapa Clásica", precio: 8.00, qty: 3, extras: ["Mayonesa"] },
      ],
      total: 24.00,
    },
    {
      id: "CMD-0841",
      hora: "16:40",
      canal: "Presencial",
      pago: "Efectivo",
      estado: "Listo",
      items: [
        { prodId: "P-01", nombre: "Salchipapa Clásica", precio: 8.00, qty: 35, extras: [] },
        { prodId: "P-02", nombre: "Hamburguesa Clásica", precio: 8.00, qty: 28, extras: [] },
        { prodId: "P-03", nombre: "Salchipapa Especial", precio: 12.00, qty: 14, extras: [] },
        { prodId: "P-05", nombre: "Refresco Pulpa Natural", precio: 4.50, qty: 22, extras: [] },
        { prodId: "P-07", nombre: "Alitas Pepper x6", precio: 15.00, qty: 10, extras: [] },
      ],
      total: 921.00,
    },
  ],
  purchases: [
    {
      id: "CMP-101",
      fecha: "2026-11-16",
      proveedor: "Don Pollo S.A.C.",
      ruc: "20512348901",
      insumo: "Pollo deshilachado y embutidos semanales",
      tipo: "Semanal",
      monto: 500.00,
      comprobante: "F001-004182.pdf (380 KB)",
      sha256: "8f4c...e91a",
      cifrado: true,
    },
    {
      id: "CMP-102",
      fecha: "2026-11-16",
      proveedor: "AgroPapas del Sur",
      ruc: "20498112340",
      insumo: "Papas picadas pre-lavadas (lote semanal)",
      tipo: "Semanal",
      monto: 300.00,
      comprobante: "F002-001920.pdf (410 KB)",
      sha256: "3a19...72bc",
      cifrado: true,
    },
    {
      id: "CMP-103",
      fecha: "2026-11-17",
      proveedor: "Mercado Central Puesto 18",
      ruc: "10441239871",
      insumo: "Pulpa de maracuyá y limones frescos",
      tipo: "Adicional",
      monto: 80.00,
      comprobante: "B001-000845.jpg (290 KB)",
      sha256: "d02e...14ff",
      cifrado: true,
    },
  ],
  indirectCosts: [
    { concepto: "Planilla / Salarios del mes", monto: 4200.00 },
    { concepto: "Energía eléctrica", monto: 480.00 },
    { concepto: "Agua potable", monto: 190.00 },
    { concepto: "Internet y telefonía", monto: 140.00 },
    { concepto: "Honorarios de contabilidad", monto: 650.00 },
  ],
  gastosFinancierosMes: 180.00,
  taxRules: [
    { id: "REG-2026-01", nombre: "Régimen MYPE Tributario (estimado mensual)", tasaPct: 1.50, vigencia: "2026-01-01", estado: "Vigente", propuestaPor: "Contador" },
    { id: "REG-2026-02", nombre: "Actualización tramo Renta / IGV según parámetro contador", tasaPct: 1.80, vigencia: "2026-12-01", estado: "Pendiente autorización Jerry", propuestaPor: "Contador" },
  ],
  periodoCerrado: false,
  auditLog: [
    { fecha: "2026-11-17 19:24", usuario: "Caja (ACT-0002)", accion: "CONFIRMA_VENTA", detalle: "Pedido CMD-0843 confirmado por S/ 12.50 (precio histórico congelado)." },
    { fecha: "2026-11-17 18:40", usuario: "Cocina (ACT-0003)", accion: "STOCK_AGOTADO", detalle: "P-04 Burger Pollo Deshilachado marcado como Agotado." },
    { fecha: "2026-11-16 09:15", usuario: "Jerry (ACT-0001)", accion: "PRORRATEO_CALENDARIO", detalle: "Feriado Mié excluido del prorrateo semanal (P-14 / R-ENT2-07)." },
  ],
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(INITIAL_STATE);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(INITIAL_STATE), ...parsed };
  } catch {
    return structuredClone(INITIAL_STATE);
  }
}

let state = loadState();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors in headless private mode
  }
}

function money(val) {
  return "S/ " + Number(val || 0).toFixed(2);
}

function nowTime() {
  const d = new Date();
  return d.toTimeString().slice(0, 5);
}

function nowStamp() {
  const d = new Date();
  return d.toISOString().slice(0, 16).replace("T", " ");
}

function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

function addAudit(usuario, accion, detalle) {
  state.auditLog.unshift({
    fecha: nowStamp(),
    usuario,
    accion,
    detalle,
  });
}

// ---------------------------------------------------------------------------
// View switching + URL param/hash support (?view=cocina etc.)
// ---------------------------------------------------------------------------
const VIEW_ROLES = {
  cliente: "ACT-0005 · Cliente",
  pos: "ACT-0002 · Caja / Mostrador",
  cocina: "ACT-0003 · Cocina / Chef",
  "admin-margen": "ACT-0001 · Jerry (Dueño)",
  "admin-operaciones": "ACT-0001 · Jerry (Admin)",
  "admin-contabilidad": "ACT-0004 · Contador & Jerry",
};

function switchView(viewId) {
  state.activeView = viewId;
  state.activeRole = VIEW_ROLES[viewId] || "Usuario";
  saveState();
  renderAll();
}

function resetDemoState() {
  state = structuredClone(INITIAL_STATE);
  saveState();
  renderAll();
  showToast("Datos de demostración restablecidos.");
}

// ---------------------------------------------------------------------------
// Calculations (RF-06, RF-07, RF-08, R-ENT2-07, NIIF 18)
// ---------------------------------------------------------------------------
function getEffectiveWorkingDaysCount() {
  return Math.max(1, state.workingDays.filter((d) => d.active).length);
}

function computeDailyMetrics() {
  const ventasHoy = state.orders.reduce((acc, o) => acc + o.total, 0);
  const effectiveDays = getEffectiveWorkingDaysCount();
  const comprasSemanales = state.purchases.filter((p) => p.tipo === "Semanal").reduce((s, p) => s + p.monto, 0);
  const cuotaDiaria = comprasSemanales / effectiveDays;
  const comprasAdicionales = state.purchases.filter((p) => p.tipo === "Adicional").reduce((s, p) => s + p.monto, 0);
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

// ---------------------------------------------------------------------------
// Cart & Order actions (Cliente + POS)
// ---------------------------------------------------------------------------
function addToCart(target, prodId) {
  const prod = state.menu.find((p) => p.id === prodId);
  if (!prod || !prod.disponible) {
    showToast("Producto agotado: no se puede confirmar ni agregar (R-ENT2-05).");
    return;
  }
  const cart = target === "client" ? state.clientCart : state.posCart;
  const existing = cart.find((c) => c.prodId === prodId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ prodId: prod.id, nombre: prod.nombre, precio: prod.precio, qty: 1, extras: [] });
  }
  saveState();
  renderAll();
}

function changeCartQty(target, index, delta) {
  const cart = target === "client" ? state.clientCart : state.posCart;
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveState();
  renderAll();
}

function toggleCartExtra(target, index, crema) {
  const cart = target === "client" ? state.clientCart : state.posCart;
  const item = cart[index];
  if (!item) return;
  if (item.extras.includes(crema)) {
    item.extras = item.extras.filter((e) => e !== crema);
  } else {
    item.extras.push(crema);
  }
  saveState();
  renderAll();
}

function clearCart(target) {
  if (target === "client") state.clientCart = [];
  else state.posCart = [];
  saveState();
  renderAll();
  showToast("Borrador de pedido vaciado (sin afectar ventas confirmadas).");
}

function confirmOrder(target) {
  const cart = target === "client" ? state.clientCart : state.posCart;
  if (!cart.length) {
    showToast("Agrega al menos un producto antes de confirmar.");
    return;
  }
  // Verificar stock vigente (R-ENT2-05)
  for (const line of cart) {
    const prod = state.menu.find((m) => m.id === line.prodId);
    if (!prod || !prod.disponible) {
      showToast(`Bloqueado: "${line.nombre}" fue marcado como agotado (R-ENT2-05).`);
      return;
    }
  }
  state.ordenSeq += 1;
  const newId = `CMD-${String(state.ordenSeq).padStart(4, "0")}`;
  const total = cart.reduce((s, l) => s + l.precio * l.qty, 0);
  const canal = target === "client" ? state.clientChannel : state.posChannel;
  const pago = target === "client" ? "Pago en mostrador / Yape" : state.posPayMethod;

  const newOrder = {
    id: newId,
    hora: nowTime(),
    canal,
    pago,
    estado: "Pendiente",
    items: structuredClone(cart),
    total,
  };
  state.orders.unshift(newOrder);
  if (target === "client") {
    state.lastClientOrderId = newId;
    state.clientCart = [];
  } else {
    state.posCart = [];
  }
  addAudit(
    target === "client" ? "Cliente (ACT-0005)" : "Caja (ACT-0002)",
    "CONFIRMA_VENTA",
    `Comanda ${newId} (${canal}) por ${money(total)} enviada a cocina.`
  );
  saveState();
  renderAll();
  showToast(`Comanda ${newId} confirmada y enviada a cocina.`);
}

// ---------------------------------------------------------------------------
// Kitchen KDS transitions (R-OBS-03) + Stock toggle (R-ENT1-02)
// ---------------------------------------------------------------------------
function advanceOrderState(orderId, nextState) {
  const order = state.orders.find((o) => o.id === orderId);
  if (!order) return;
  const valid = {
    "Pendiente": ["En preparación"],
    "En preparación": ["Listo"],
  };
  if (!valid[order.estado] || !valid[order.estado].includes(nextState)) {
    showToast("Transición de estado no autorizada (R-OBS-03).");
    return;
  }
  order.estado = nextState;
  addAudit("Cocina (ACT-0003)", "ESTADO_COMANDA", `${order.id} pasó a "${nextState}".`);
  saveState();
  renderAll();
  showToast(`Comanda ${order.id} actualizada a ${nextState}.`);
}

function toggleProductStock(prodId) {
  const prod = state.menu.find((m) => m.id === prodId);
  if (!prod) return;
  prod.disponible = !prod.disponible;
  addAudit(
    state.activeRole,
    prod.disponible ? "STOCK_DISPONIBLE" : "STOCK_AGOTADO",
    `${prod.id} ${prod.nombre} marcado como ${prod.disponible ? "Disponible" : "Agotado"}.`
  );
  saveState();
  renderAll();
  showToast(`${prod.nombre}: ${prod.disponible ? "Disponible" : "Agotado"}.`);
}

// ---------------------------------------------------------------------------
// Admin actions: Calendar, Purchases, Prices, Tax Rules, Period Lock
// ---------------------------------------------------------------------------
function toggleWorkingDay(dayId) {
  const day = state.workingDays.find((d) => d.id === dayId);
  if (!day) return;
  day.active = !day.active;
  addAudit(
    "Jerry (ACT-0001)",
    "CALENDARIO_PRORRATEO",
    `Jornada ${day.label} marcada como ${day.active ? "hábil efectiva" : "no laborada / feriado"} (R-ENT2-07).`
  );
  saveState();
  renderAll();
}

function submitPurchase(ev) {
  ev.preventDefault();
  if (state.periodoCerrado) {
    showToast("Periodo cerrado: use nota de ajuste autorizada (R-ENT2-13).");
    return;
  }
  const prov = document.getElementById("inp-prov").value.trim();
  const ruc = document.getElementById("inp-ruc").value.trim();
  const insumo = document.getElementById("inp-insumo").value.trim();
  const tipo = document.getElementById("inp-tipo").value;
  const monto = parseFloat(document.getElementById("inp-monto").value);
  const sizeKb = parseInt(document.getElementById("inp-size").value || "320", 10);

  if (!prov || !insumo || isNaN(monto) || monto <= 0) {
    showToast("Error de validación (R-ENT2-16): proveedor, insumo y monto > 0 obligatorios.");
    return;
  }
  const compressedNote = sizeKb > 1024 ? `${Math.round(sizeKb * 0.35)} KB (comprimido <1MB)` : `${sizeKb} KB`;
  const id = `CMP-${100 + state.purchases.length + 1}`;
  state.purchases.unshift({
    id,
    fecha: "2026-11-17",
    proveedor: prov,
    ruc: ruc || "20600000001",
    insumo,
    tipo,
    monto,
    comprobante: `F001-00${Math.floor(1000 + Math.random() * 8999)}.pdf (${compressedNote})`,
    sha256: Math.random().toString(16).slice(2, 6) + "..." + Math.random().toString(16).slice(2, 6),
    cifrado: true,
  });
  addAudit("Jerry (ACT-0001)", "REGISTRA_COMPRA", `${id} (${tipo}) ${insumo} — ${money(monto)}.`);
  saveState();
  renderAll();
  ev.target.reset();
  showToast(`Compra ${id} (${tipo}) registrada y prorrateada.`);
}

function correctPurchaseAmount(cmpId) {
  if (state.periodoCerrado) {
    showToast("Periodo cerrado: bloqueo directo activo (RNF-07 / R-ENT2-13).");
    return;
  }
  const p = state.purchases.find((x) => x.id === cmpId);
  if (!p) return;
  const nuevoStr = prompt(`Corregir monto de ${p.id} (actual: ${p.monto.toFixed(2)}):`, p.monto.toFixed(2));
  if (nuevoStr === null) return;
  const nuevo = parseFloat(nuevoStr);
  if (isNaN(nuevo) || nuevo <= 0) {
    showToast("Monto inválido rechazado (R-ENT2-16).");
    return;
  }
  const motivo = prompt("Motivo obligatorio de corrección (R-ENT2-08):", "Error de digitación de comprobante");
  if (!motivo || !motivo.trim()) {
    showToast("Se requiere motivo para auditar la corrección (R-ENT2-08).");
    return;
  }
  const anterior = p.monto;
  p.monto = nuevo;
  addAudit(
    "Jerry (ACT-0001)",
    "CORRIGE_COMPRA",
    `${p.id}: ${money(anterior)} -> ${money(nuevo)}. Motivo: ${motivo.trim()}`
  );
  saveState();
  renderAll();
  showToast(`Compra ${p.id} actualizada y auditada.`);
}

function updateMenuPrice(prodId) {
  const prod = state.menu.find((m) => m.id === prodId);
  if (!prod) return;
  const valStr = prompt(`Nuevo precio para ${prod.nombre} (actual ${money(prod.precio)}):`, prod.precio.toFixed(2));
  if (valStr === null) return;
  const val = parseFloat(valStr);
  if (isNaN(val) || val <= 0) {
    showToast("Precio inválido rechazado (R-ENT2-16).");
    return;
  }
  const prev = prod.precio;
  prod.precio = val;
  addAudit(
    "Jerry (ACT-0001)",
    "CAMBIO_PRECIO",
    `${prod.id} ${prod.nombre}: ${money(prev)} -> ${money(val)} (ventas anteriores conservan su precio histórico R-PRE-13).`
  );
  saveState();
  renderAll();
  showToast(`Precio actualizado; ventas previas intactas (R-PRE-13).`);
}

function approveTaxRule(ruleId) {
  const rule = state.taxRules.find((r) => r.id === ruleId);
  if (!rule) return;
  state.taxRules.forEach((r) => {
    if (r.estado === "Vigente") r.estado = "Histórica";
  });
  rule.estado = "Vigente";
  addAudit("Jerry (ACT-0001)", "AUTORIZA_REGLA_TRIBUTARIA", `Regla ${rule.id} (${rule.tasaPct}%) aprobada y activada (R-ENT2-10).`);
  saveState();
  renderAll();
  showToast(`Regla tributaria ${rule.id} autorizada por Jerry.`);
}

function togglePeriodLock() {
  state.periodoCerrado = !state.periodoCerrado;
  addAudit(
    "Contador (ACT-0004)",
    state.periodoCerrado ? "CIERRA_PERIODO" : "REAPERTURA_CONTROLADA",
    state.periodoCerrado
      ? "Periodo mensual cerrado: edición directa bloqueada (RNF-07)."
      : "Periodo reabierto mediante registro de autorización."
  );
  saveState();
  renderAll();
  showToast(state.periodoCerrado ? "Periodo mensual cerrado e inmutable (RNF-07)." : "Periodo abierto.");
}

function registerAdjustmentNote() {
  const motivo = prompt("Ingrese motivo de Nota de Ajuste autorizada para periodo cerrado (R-ENT2-14):", "Ajuste por nota de crédito comprobada");
  if (!motivo || !motivo.trim()) return;
  addAudit("Jerry + Contador", "NOTA_AJUSTE_PERIODO", `Ajuste autorizado sobre periodo cerrado: ${motivo.trim()}`);
  saveState();
  renderAll();
  showToast("Nota de ajuste autorizada registrada en auditoría (R-ENT2-14).");
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
  a.download = "RedPepper_Reporte_Margen_NIIF18.csv";
  a.click();
  showToast("Reporte CSV exportado (RF-19).");
}

// ---------------------------------------------------------------------------
// Renderers
// ---------------------------------------------------------------------------
function renderAll() {
  // Tabs & active panel
  document.querySelectorAll(".role-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === state.activeView);
  });
  document.querySelectorAll(".view-panel").forEach((p) => {
    p.classList.toggle("active", p.id === `view-${state.activeView}`);
  });
  document.getElementById("active-role-pill").textContent = state.activeRole;
  const jPill = document.getElementById("jornada-pill");
  jPill.textContent = state.jornadaAbierta ? `Jornada Abierta (${state.jornadaHorario})` : "Jornada Cerrada";
  jPill.className = "pill " + (state.jornadaAbierta ? "pill-ok" : "pill-danger");

  renderCliente();
  renderPOS();
  renderCocina();
  renderAdminMargen();
  renderAdminOperaciones();
  renderAdminContabilidad();
}

function renderCliente() {
  const catFilter = document.getElementById("client-cat-filter")?.value || "Todos";
  const grid = document.getElementById("client-menu-grid");
  grid.innerHTML = state.menu
    .filter((p) => catFilter === "Todos" || p.cat === catFilter)
    .map(
      (p) => `
      <div class="menu-item ${p.disponible ? "" : "agotado"}">
        <div>
          <div class="menu-top">
            <span class="menu-name">${p.nombre}</span>
            <span class="menu-price">${money(p.precio)}</span>
          </div>
          <div class="menu-desc">${p.desc}</div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
          <span class="pill ${p.disponible ? "pill-ok" : "pill-danger"}">
            ${p.disponible ? "Disponible" : "Agotado"}
          </span>
          <button class="btn btn-primary btn-sm" ${p.disponible ? "" : "disabled"} onclick="addToCart('client','${p.id}')">
            + Agregar
          </button>
        </div>
      </div>`
    )
    .join("");

  // Channel buttons
  document.querySelectorAll("#client-channels .chip-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.channel === state.clientChannel);
  });

  // Cart
  const cartEl = document.getElementById("client-cart-lines");
  if (!state.clientCart.length) {
    cartEl.innerHTML = `<p style="color:var(--ink-muted); font-size:13px;">Tu pedido está vacío. Selecciona platos o bebidas de la carta.</p>`;
  } else {
    cartEl.innerHTML = state.clientCart
      .map(
        (line, idx) => `
        <div class="cart-line">
          <div>
            <strong>${line.nombre}</strong>
            <div style="font-size:11.5px; color:var(--ink-muted);">${money(line.precio)} c/u</div>
            <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
              ${state.cremas
                .map(
                  (c) => `<button type="button" class="btn btn-sm" style="padding:2px 7px; font-size:11px; ${
                    line.extras.includes(c) ? "background:var(--ink-primary); color:#fff; border-color:var(--ink-primary);" : ""
                  }" onclick="toggleCartExtra('client', ${idx}, '${c}')">${c}</button>`
                )
                .join("")}
            </div>
          </div>
          <div class="cart-controls">
            <button class="qty-btn" onclick="changeCartQty('client', ${idx}, -1)">-</button>
            <strong>${line.qty}</strong>
            <button class="qty-btn" onclick="changeCartQty('client', ${idx}, 1)">+</button>
          </div>
        </div>`
      )
      .join("");
  }
  const total = state.clientCart.reduce((s, l) => s + l.precio * l.qty, 0);
  document.getElementById("client-total").textContent = money(total);

  // Tracker
  const tracked = state.orders.find((o) => o.id === state.lastClientOrderId) || state.orders[0];
  const trkEl = document.getElementById("client-tracker");
  if (!tracked) {
    trkEl.innerHTML = "";
    return;
  }
  const steps = ["Pendiente", "En preparación", "Listo"];
  const curIdx = steps.indexOf(tracked.estado);
  trkEl.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>Pedido ${tracked.id}</strong> <span class="pill pill-neutral">${tracked.canal}</span></div>
      <span class="mono">${tracked.hora} · ${money(tracked.total)}</span>
    </div>
    <div style="font-size:12px; color:var(--ink-secondary); margin-top:4px;">
      ${tracked.items.map((i) => `${i.qty}x ${i.nombre}${i.extras.length ? " (" + i.extras.join(", ") + ")" : ""}`).join(" · ")}
    </div>
    <div class="tracker-steps">
      ${steps
        .map((st, i) => {
          const cls = i < curIdx ? "done" : i === curIdx ? (st === "Listo" ? "done" : "current") : "";
          return `<div class="tracker-step ${cls}">${i + 1}. ${st}</div>`;
        })
        .join("")}
    </div>
  `;
}

function renderPOS() {
  const catFilter = document.getElementById("pos-cat-filter")?.value || "Todos";
  const grid = document.getElementById("pos-menu-grid");
  grid.innerHTML = state.menu
    .filter((p) => catFilter === "Todos" || p.cat === catFilter)
    .map(
      (p) => `
      <div class="menu-item ${p.disponible ? "" : "agotado"}">
        <div>
          <div class="menu-top">
            <span class="menu-name">${p.nombre}</span>
            <span class="menu-price">${money(p.precio)}</span>
          </div>
          <div class="menu-desc">${p.cat} · ${p.id}</div>
        </div>
        <button class="btn btn-touch ${p.disponible ? "btn-primary" : ""}" style="width:100%;" ${p.disponible ? "" : "disabled"} onclick="addToCart('pos','${p.id}')">
          ${p.disponible ? "+ Añadir (Táctil ≥48px)" : "Bloqueado · Agotado"}
        </button>
      </div>`
    )
    .join("");

  document.querySelectorAll("#pos-channels .chip-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.channel === state.posChannel);
  });
  document.querySelectorAll("#pos-pay-methods .chip-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.pay === state.posPayMethod);
  });

  const cartEl = document.getElementById("pos-cart-lines");
  if (!state.posCart.length) {
    cartEl.innerHTML = `<p style="color:var(--ink-muted); font-size:13px;">Sin ítems en borrador. Toque un producto para iniciar la comanda.</p>`;
  } else {
    cartEl.innerHTML = state.posCart
      .map(
        (line, idx) => `
        <div class="cart-line">
          <div>
            <strong>${line.nombre}</strong>
            <div style="font-size:12px; color:var(--ink-secondary);">${money(line.precio * line.qty)} (${money(line.precio)} c/u)</div>
            <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:5px;">
              ${state.cremas
                .map(
                  (c) => `<button type="button" class="btn btn-sm" style="min-height:32px; ${
                    line.extras.includes(c) ? "background:var(--ink-primary); color:#fff; border-color:var(--ink-primary);" : ""
                  }" onclick="toggleCartExtra('pos', ${idx}, '${c}')">${c}</button>`
                )
                .join("")}
            </div>
          </div>
          <div class="cart-controls">
            <button class="qty-btn touch-48" onclick="changeCartQty('pos', ${idx}, -1)">-</button>
            <strong style="min-width:20px; text-align:center;">${line.qty}</strong>
            <button class="qty-btn touch-48" onclick="changeCartQty('pos', ${idx}, 1)">+</button>
          </div>
        </div>`
      )
      .join("");
  }

  const total = state.posCart.reduce((s, l) => s + l.precio * l.qty, 0);
  document.getElementById("pos-total").textContent = money(total);
  const turnTotal = state.orders.reduce((s, o) => s + o.total, 0);
  document.getElementById("pos-turn-total").textContent = `${money(turnTotal)} (${state.orders.length} comandas)`;
}

function renderCocina() {
  const cols = [
    { state: "Pendiente", elId: "kds-col-pendiente", countId: "kds-cnt-pendiente", actionLabel: "Iniciar preparación", next: "En preparación", btnCls: "btn-primary" },
    { state: "En preparación", elId: "kds-col-prep", countId: "kds-cnt-prep", actionLabel: "Marcar listo para entrega", next: "Listo", btnCls: "btn-ok" },
    { state: "Listo", elId: "kds-col-listo", countId: "kds-cnt-listo", actionLabel: null, next: null, btnCls: "" },
  ];

  cols.forEach((col) => {
    const list = state.orders.filter((o) => o.estado === col.state);
    document.getElementById(col.countId).textContent = list.length;
    document.getElementById(col.elId).innerHTML = list.length
      ? list
          .map(
            (o) => `
          <div class="kds-ticket">
            <div class="kds-ticket-head">
              <strong>${o.id}</strong>
              <span class="pill ${col.state === "Listo" ? "pill-ok" : col.state === "En preparación" ? "pill-warn" : "pill-danger"}">
                ${o.canal} · ${o.hora}
              </span>
            </div>
            <ul class="kds-items">
              ${o.items
                .map(
                  (i) =>
                    `<li><strong>${i.qty}×</strong> ${i.nombre}${
                      i.extras.length ? ` <span style="color:var(--ink-muted);">[${i.extras.join(", ")}]</span>` : ""
                    }</li>`
                )
                .join("")}
            </ul>
            ${
              col.actionLabel
                ? `<button class="btn ${col.btnCls} btn-touch" style="width:100%;" onclick="advanceOrderState('${o.id}','${col.next}')">${col.actionLabel}</button>`
                : `<div style="font-size:12px; color:var(--ok-ink); font-weight:600;">✓ Listo en despacho (R-OBS-03)</div>`
            }
          </div>`
          )
          .join("")
      : `<p style="color:var(--ink-muted); font-size:12.5px;">Sin comandas en esta etapa.</p>`;
  });

  // Quick stock panel in Kitchen
  document.getElementById("kds-stock-list").innerHTML = state.menu
    .map(
      (p) => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:7px 0; border-bottom:1px solid var(--border-hairline);">
        <div>
          <strong>${p.nombre}</strong>
          <div style="font-size:11.5px; color:var(--ink-muted);">${p.cat}</div>
        </div>
        <button class="btn btn-sm ${p.disponible ? "pill-ok" : "pill-danger"}" onclick="toggleProductStock('${p.id}')">
          ${p.disponible ? "Disponible (clic agotar)" : "Agotado (clic activar)"}
        </button>
      </div>`
    )
    .join("");
}

function renderAdminMargen() {
  const m = computeDailyMetrics();
  document.getElementById("m-ventas").textContent = money(m.ventasHoy);
  document.getElementById("m-ventas-cnt").textContent = `${state.orders.length} comandas confirmadas`;
  document.getElementById("m-cuota").textContent = money(m.cuotaDiaria);
  document.getElementById("m-cuota-note").textContent = `${money(m.comprasSemanales)} / ${m.effectiveDays} jornadas hábiles (P-14)`;
  document.getElementById("m-adic").textContent = money(m.comprasAdicionales);
  document.getElementById("m-margen").textContent = money(m.margenBruto);
  document.getElementById("m-margen-pct").textContent = `Margen bruto: ${m.margenPct.toFixed(1)}%`;

  // Working days pills (P-14 / R-ENT2-07)
  document.getElementById("working-days-bar").innerHTML = state.workingDays
    .map(
      (d) => `
      <button type="button" class="day-pill ${d.active ? "active" : "holiday"}" onclick="toggleWorkingDay('${d.id}')">
        ${d.label} ${d.active ? "· Hábil" : "· Feriado/No lab."}
      </button>`
    )
    .join("");

  // Prorrateo table
  const semanales = state.purchases.filter((p) => p.tipo === "Semanal");
  document.getElementById("tbl-prorrateo").innerHTML = semanales
    .map(
      (p) => `
      <tr>
        <td class="mono">${p.id}</td>
        <td><strong>${p.insumo}</strong><div style="font-size:11.5px; color:var(--ink-muted);">${p.proveedor}</div></td>
        <td class="num">${money(p.monto)}</td>
        <td class="num">${m.effectiveDays} jornadas</td>
        <td class="num"><strong>${money(p.monto / m.effectiveDays)}</strong></td>
      </tr>`
    )
    .join("");

  // Adicionales table
  const adic = state.purchases.filter((p) => p.tipo === "Adicional");
  document.getElementById("tbl-adicionales").innerHTML = adic
    .map(
      (p) => `
      <tr>
        <td class="mono">${p.id}</td>
        <td><strong>${p.insumo}</strong><div style="font-size:11.5px; color:var(--ink-muted);">${p.proveedor}</div></td>
        <td class="num"><strong>${money(p.monto)}</strong> (100% hoy)</td>
      </tr>`
    )
    .join("");

  // Sales by channel (R-ENT2-17)
  const channels = ["Presencial", "Para llevar", "Pedido externo"];
  document.getElementById("tbl-canales").innerHTML = channels
    .map((ch) => {
      const list = state.orders.filter((o) => o.canal === ch);
      const sum = list.reduce((s, o) => s + o.total, 0);
      const pct = m.ventasHoy > 0 ? (sum / m.ventasHoy) * 100 : 0;
      return `<tr><td>${ch}</td><td class="num">${list.length}</td><td class="num">${money(sum)}</td><td class="num">${pct.toFixed(1)}%</td></tr>`;
    })
    .join("");

  // Product ranking including 0-sales active products (R-ENT1-03 / R-ENT1-04)
  const ranking = state.menu.map((prod) => {
    let qty = 0;
    let total = 0;
    state.orders.forEach((o) => {
      o.items.forEach((i) => {
        if (i.prodId === prod.id) {
          qty += i.qty;
          total += i.qty * i.precio;
        }
      });
    });
    return { ...prod, qty, total };
  });
  ranking.sort((a, b) => b.qty - a.qty);
  document.getElementById("tbl-ranking").innerHTML = ranking
    .map(
      (r) => `
      <tr>
        <td>${r.nombre} ${!r.disponible ? '<span class="pill pill-danger">Agotado</span>' : ""}</td>
        <td class="num">${r.qty}</td>
        <td class="num">${money(r.total)}</td>
      </tr>`
    )
    .join("");
}

function renderAdminOperaciones() {
  document.getElementById("tbl-compras-full").innerHTML = state.purchases
    .map(
      (p) => `
      <tr>
        <td class="mono">${p.id}</td>
        <td>${p.fecha}</td>
        <td><strong>${p.proveedor}</strong><div class="mono" style="color:var(--ink-muted);">RUC ${p.ruc}</div></td>
        <td>${p.insumo}</td>
        <td><span class="pill ${p.tipo === "Semanal" ? "pill-info" : "pill-warn"}">${p.tipo}</span></td>
        <td class="num"><strong>${money(p.monto)}</strong></td>
        <td><button class="btn btn-sm" onclick="correctPurchaseAmount('${p.id}')">Corregir (RF-20)</button></td>
      </tr>`
    )
    .join("");

  document.getElementById("tbl-carta-admin").innerHTML = state.menu
    .map(
      (p) => `
      <tr>
        <td class="mono">${p.id}</td>
        <td><strong>${p.nombre}</strong><div style="font-size:11.5px; color:var(--ink-muted);">${p.cat}</div></td>
        <td class="num"><strong>${money(p.precio)}</strong></td>
        <td><span class="pill ${p.disponible ? "pill-ok" : "pill-danger"}">${p.disponible ? "Activo" : "Agotado"}</span></td>
        <td style="display:flex; gap:6px;">
          <button class="btn btn-sm" onclick="updateMenuPrice('${p.id}')">Editar precio</button>
          <button class="btn btn-sm" onclick="toggleProductStock('${p.id}')">Stock</button>
        </td>
      </tr>`
    )
    .join("");

  document.getElementById("tbl-auditoria").innerHTML = state.auditLog
    .slice(0, 12)
    .map(
      (a) => `
      <tr>
        <td class="mono">${a.fecha}</td>
        <td>${a.usuario}</td>
        <td><span class="pill pill-neutral mono">${a.accion}</span></td>
        <td>${a.detalle}</td>
      </tr>`
    )
    .join("");
}

function renderAdminContabilidad() {
  const m = computeDailyMetrics();
  // Simulated accumulated month based on current daily run-rate + baseline open month
  const ventasMes = 42850.00 + m.ventasHoy;
  const costosDirectosMes = 6120.00 + m.costoAsignado;
  const margenBrutoMes = ventasMes - costosDirectosMes;
  const indirectosMes = state.indirectCosts.reduce((s, c) => s + c.monto, 0);
  const resultadoOperativo = margenBrutoMes - indirectosMes;
  const bai = resultadoOperativo - state.gastosFinancierosMes;
  const activeRule = state.taxRules.find((r) => r.estado === "Vigente") || state.taxRules[0];
  const impuestoMes = ventasMes * (activeRule.tasaPct / 100);
  const resultadoNeto = bai - impuestoMes;

  document.getElementById("niif-cascade").innerHTML = `
    <div class="cascade-row"><span>Ingresos por ventas confirmadas (Operación)</span><span class="num">${money(ventasMes)}</span></div>
    <div class="cascade-row"><span>(-) Costos directos y compras prorrateadas</span><span class="num">- ${money(costosDirectosMes)}</span></div>
    <div class="cascade-row subtotal"><span>Margen Bruto Mensual</span><span class="num">${money(margenBrutoMes)}</span></div>
    <div class="cascade-row"><span>(-) Costos indirectos fijos (salarios, servicios, contador)</span><span class="num">- ${money(indirectosMes)}</span></div>
    <div class="cascade-row subtotal"><span>Resultado Operativo (antes de financiamiento e impuestos)</span><span class="num">${money(resultadoOperativo)}</span></div>
    <div class="cascade-row"><span>(-) Gastos financieros / intereses bancarios (Financiamiento)</span><span class="num">- ${money(state.gastosFinancierosMes)}</span></div>
    <div class="cascade-row subtotal"><span>Beneficio Antes de Impuestos (BAI)</span><span class="num">${money(bai)}</span></div>
    <div class="cascade-row"><span>(-) Impuesto estimado (${activeRule.id} · ${activeRule.tasaPct}%)</span><span class="num">- ${money(impuestoMes)}</span></div>
    <div class="cascade-row total"><span>Resultado Neto del Periodo (NIIF 18 — borrador sujeto a contador)</span><span class="num">${money(resultadoNeto)}</span></div>
  `;

  document.getElementById("tbl-indirectos").innerHTML = state.indirectCosts
    .map((c) => `<tr><td>${c.concepto}</td><td class="num">${money(c.monto)}</td></tr>`)
    .join("");

  document.getElementById("tbl-tax-rules").innerHTML = state.taxRules
    .map(
      (r) => `
      <tr>
        <td class="mono">${r.id}</td>
        <td>${r.nombre}</td>
        <td class="num">${r.tasaPct.toFixed(2)}%</td>
        <td class="mono">${r.vigencia}</td>
        <td><span class="pill ${r.estado === "Vigente" ? "pill-ok" : r.estado.includes("Pendiente") ? "pill-warn" : "pill-neutral"}">${r.estado}</span></td>
        <td>
          ${
            r.estado.includes("Pendiente")
              ? `<button class="btn btn-primary btn-sm" onclick="approveTaxRule('${r.id}')">Autorizar (Jerry)</button>`
              : "—"
          }
        </td>
      </tr>`
    )
    .join("");

  const lockBtn = document.getElementById("btn-period-lock");
  const adjBtn = document.getElementById("btn-adj-note");
  const lockBanner = document.getElementById("period-lock-banner");
  if (state.periodoCerrado) {
    lockBtn.textContent = "Periodo Cerrado (Inmutable RNF-07)";
    lockBanner.className = "alert-box alert-danger";
    lockBanner.textContent = "Periodo cerrado por el contador: edición directa bloqueada (RNF-07 / R-ENT2-13). Solo se permiten notas de ajuste autorizadas (R-ENT2-14).";
    adjBtn.disabled = false;
  } else {
    lockBtn.textContent = "Cerrar Periodo Mensual (RNF-07)";
    lockBanner.className = "alert-box alert-info";
    lockBanner.textContent = "Periodo abierto para revisión conjunta entre el contador y Jerry antes del cierre definitivo.";
    adjBtn.disabled = true;
  }

  // SUNAT Vouchers filter (RF-16)
  const q = (document.getElementById("sunat-filter")?.value || "").toLowerCase();
  const filtered = state.purchases.filter(
    (p) =>
      p.ruc.toLowerCase().includes(q) ||
      p.proveedor.toLowerCase().includes(q) ||
      p.insumo.toLowerCase().includes(q) ||
      p.fecha.includes(q)
  );
  document.getElementById("tbl-sunat").innerHTML = filtered
    .map(
      (p) => `
      <tr>
        <td class="mono">${p.fecha}</td>
        <td class="mono">${p.ruc}</td>
        <td>${p.proveedor} — ${p.insumo}</td>
        <td class="mono">${p.comprobante}</td>
        <td class="mono">${p.sha256} · ${p.cifrado ? "Cifrado" : "Plano"}</td>
        <td class="num">${money(p.monto)}</td>
      </tr>`
    )
    .join("");
}

// ---------------------------------------------------------------------------
// Init & Event Bindings
// ---------------------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const viewParam = params.get("view");
  if (viewParam && VIEW_ROLES[viewParam]) {
    state.activeView = viewParam;
    state.activeRole = VIEW_ROLES[viewParam];
  }

  document.querySelectorAll(".role-tab").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  document.querySelectorAll("#client-channels .chip-btn").forEach((b) => {
    b.addEventListener("click", () => {
      state.clientChannel = b.dataset.channel;
      saveState();
      renderCliente();
    });
  });

  document.querySelectorAll("#pos-channels .chip-btn").forEach((b) => {
    b.addEventListener("click", () => {
      state.posChannel = b.dataset.channel;
      saveState();
      renderPOS();
    });
  });

  document.querySelectorAll("#pos-pay-methods .chip-btn").forEach((b) => {
    b.addEventListener("click", () => {
      state.posPayMethod = b.dataset.pay;
      saveState();
      renderPOS();
    });
  });

  document.getElementById("client-cat-filter")?.addEventListener("change", renderCliente);
  document.getElementById("pos-cat-filter")?.addEventListener("change", renderPOS);
  document.getElementById("sunat-filter")?.addEventListener("input", renderAdminContabilidad);
  document.getElementById("form-compra")?.addEventListener("submit", submitPurchase);

  document.getElementById("btn-cierre-jornada")?.addEventListener("click", () => {
    state.jornadaAbierta = !state.jornadaAbierta;
    addAudit(
      "Caja / Jerry",
      state.jornadaAbierta ? "APERTURA_JORNADA" : "CIERRE_JORNADA",
      state.jornadaAbierta
        ? "Jornada operativa reabierta."
        : `Cierre de jornada ejecutado con ${state.orders.length} ventas confirmadas (RF-03 / R-PRE-10).`
    );
    saveState();
    renderAll();
    showToast(state.jornadaAbierta ? "Jornada operativa abierta." : "Cierre diario consolidado (RF-03).");
  });

  renderAll();
});
