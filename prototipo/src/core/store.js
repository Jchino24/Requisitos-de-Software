/* =====================================================================
   RED PEPPER — Estado Compartido, Datos Semilla y Persistencia Segura
   Conserva compatibilidad con datos reales documentados en F-07 y EV-*.
   ===================================================================== */
(function (global) {
  const RP = (global.RP = global.RP || {});
  const STORAGE_KEY = "redpepper_erp_v3_state";
  const LEGACY_KEY = "redpepper_erp_v2_state";

  const INITIAL_STATE = {
    activeApp: "cliente",     // cliente | pos | cocina | admin | marca
    activeTab: "carta",       // subvista dentro del portal activo
    activeRole: "ACT-0005 · Cliente",
    jornadaAbierta: true,
    jornadaInicio: "11:00",
    jornadaFin: "23:00",
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
      { id: "P-01", nombre: "Salchipapa Clásica", cat: "Salchipapas", precio: 8.00, img: "assets/salchipapa.webp", destacado: true, desc: "Papas picadas fritas al instante con hot dog clásico.", disponible: true },
      { id: "P-02", nombre: "Hamburguesa Clásica", cat: "Hamburguesas", precio: 8.00, img: "assets/hamburguesa.webp", destacado: true, desc: "Carne a la plancha preparada al pedido con pan y ensalada.", disponible: true },
      { id: "P-03", nombre: "Salchipapa Especial", cat: "Salchipapas", precio: 12.00, img: "assets/salchipapa-especial.webp", destacado: false, desc: "Porción doble con pollo deshilachado de Don Pollo y queso.", disponible: true },
      { id: "P-04", nombre: "Burger Pollo Deshilachado", cat: "Hamburguesas", precio: 10.50, img: "assets/sanguche-pollo.webp", destacado: false, desc: "Pollo deshilachado de distribuidora con salsa de la casa.", disponible: false },
      { id: "P-05", nombre: "Refresco Pulpa Natural", cat: "Bebidas", precio: 4.50, img: "assets/refresco.webp", destacado: false, desc: "Pulpa natural preparada con agua hervida o mineral (500 ml).", disponible: true },
      { id: "P-06", nombre: "Gaseosa Personal", cat: "Bebidas", precio: 3.50, img: "assets/refresco.webp", destacado: false, desc: "Botella helada de 500 ml para acompañar tu pedido.", disponible: true },
      { id: "P-07", nombre: "Alitas Pepper x6", cat: "Especiales", precio: 15.00, img: "assets/alitas.webp", destacado: true, desc: "Seis piezas preparadas al momento con guarnición.", disponible: true },
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
    clientSearch: "",
    clientCategory: "Todos",
    posChannel: "Presencial",
    posCategory: "Todos",
    posPayMethod: "Efectivo",
    lastClientOrderId: "CMD-0843",
    clientOrderIds: ["CMD-0843", "CMD-0845"],
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
      { id: "REG-2026-02", nombre: "Actualización tramo Renta / IGV según parámetro contador", tasaPct: 1.80, vigencia: "2026-12-01", estado: "Pendiente Jerry", propuestaPor: "Contador" },
    ],
    periodoCerrado: false,
    auditLog: [
      { fecha: "2026-11-17 19:24", usuario: "Caja (ACT-0002)", accion: "CONFIRMA_VENTA", detalle: "Pedido CMD-0843 confirmado por S/ 12.50 (precio histórico congelado)." },
      { fecha: "2026-11-17 18:40", usuario: "Cocina (ACT-0003)", accion: "STOCK_AGOTADO", detalle: "P-04 Burger Pollo Deshilachado marcado como Agotado." },
      { fecha: "2026-11-16 09:15", usuario: "Jerry (ACT-0001)", accion: "PRORRATEO_CALENDARIO", detalle: "Feriado Mié excluido del prorrateo semanal (P-14 / R-ENT2-07)." },
    ],
  };

  function hydrateMenu(parsedMenu) {
    if (!Array.isArray(parsedMenu)) return structuredClone(INITIAL_STATE.menu);
    const defaultImgs = new Map(INITIAL_STATE.menu.map((m) => [m.id, m.img]));
    return parsedMenu.map((item) => {
      const fallback = defaultImgs.get(item.id) || "assets/salchipapa.webp";
      const useNewAsset =
        (item.id === "P-03" && item.img === "assets/salchipapa.webp") ||
        (item.id === "P-04" && item.img === "assets/hamburguesa.webp");
      return {
        ...item,
        img: useNewAsset || !item.img ? fallback : item.img,
      };
    });
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
      if (!raw) return structuredClone(INITIAL_STATE);
      const parsed = JSON.parse(raw);
      return {
        ...structuredClone(INITIAL_STATE),
        ...parsed,
        menu: hydrateMenu(parsed.menu),
      };
    } catch {
      return structuredClone(INITIAL_STATE);
    }
  }

  let state = loadState();
  const listeners = new Set();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Modo privado sin cuota de almacenamiento
    }
  }

  function getState() {
    return state;
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function notify() {
    saveState();
    listeners.forEach((fn) => fn(state));
  }

  function resetDemo() {
    const keepApp = state.activeApp;
    const keepTab = state.activeTab;
    state = structuredClone(INITIAL_STATE);
    state.activeApp = keepApp;
    state.activeTab = keepTab;
    notify();
  }

  RP.store = {
    INITIAL_STATE,
    getState,
    subscribe,
    notify,
    resetDemo,
  };
})(window);
