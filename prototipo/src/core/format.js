/* =====================================================================
   RED PEPPER — Utilidades Puras de Formato y Saneamiento
   ===================================================================== */
(function (global) {
  const RP = (global.RP = global.RP || {});

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function money(val) {
    const n = Number(val || 0);
    return `S/ ${Number.isFinite(n) ? n.toFixed(2) : "0.00"}`;
  }

  function nowTime() {
    return new Date().toTimeString().slice(0, 5);
  }

  function nowStamp() {
    return new Date().toISOString().slice(0, 16).replace("T", " ");
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  RP.format = {
    escapeHtml,
    money,
    nowTime,
    nowStamp,
    normalizeText,
  };
})(window);
