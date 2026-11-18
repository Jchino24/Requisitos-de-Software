/* =====================================================================
   RED PEPPER — Componente Modal Accesible (Reemplaza window.prompt/alert)
   Maneja Escape, cierre por clic externo, trampa de foco y validación.
   ===================================================================== */
(function (global) {
  const RP = (global.RP = global.RP || {});
  let lastTrigger = null;

  function ensureBackdrop() {
    let el = document.getElementById("rp-modal-backdrop");
    if (!el) {
      el = document.createElement("div");
      el.id = "rp-modal-backdrop";
      el.className = "modal-backdrop";
      el.setAttribute("role", "dialog");
      el.setAttribute("aria-modal", "true");
      el.setAttribute("aria-labelledby", "rp-modal-title");
      el.innerHTML = `<div class="modal-dialog" id="rp-modal-dialog"></div>`;
      document.body.appendChild(el);

      el.addEventListener("click", (e) => {
        if (e.target === el) closeModal();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && el.classList.contains("open")) {
          closeModal();
        }
      });
    }
    return el;
  }

  function closeModal() {
    const el = document.getElementById("rp-modal-backdrop");
    if (!el) return;
    el.classList.remove("open");
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
  }

  function openModal({ title, bodyHtml, onMount }) {
    lastTrigger = document.activeElement;
    const backdrop = ensureBackdrop();
    const dialog = document.getElementById("rp-modal-dialog");
    dialog.innerHTML = `
      <div class="modal-head">
        <h3 id="rp-modal-title" class="card-title">${RP.format.escapeHtml(title)}</h3>
        <button type="button" class="btn btn-ghost" id="rp-modal-close" aria-label="Cerrar ventana">Cerrar</button>
      </div>
      <div id="rp-modal-body">${bodyHtml}</div>
    `;
    backdrop.classList.add("open");
    document.getElementById("rp-modal-close")?.addEventListener("click", closeModal);
    if (typeof onMount === "function") {
      onMount(dialog, closeModal);
    }
    const firstFocus = dialog.querySelector("input, select, textarea, button:not(#rp-modal-close)");
    (firstFocus || document.getElementById("rp-modal-close"))?.focus();
  }

  function openFormModal({ title, subtitle, fields, submitLabel = "Guardar", onSubmit }) {
    const esc = RP.format.escapeHtml;
    const fieldsHtml = fields
      .map((f) => {
        const val = esc(f.value ?? "");
        const control =
          f.type === "select"
            ? `<select id="mf-${f.name}" name="${f.name}" class="input-control">${f.options
                .map((o) => `<option value="${esc(o)}" ${o === f.value ? "selected" : ""}>${esc(o)}</option>`)
                .join("")}</select>`
            : `<input id="mf-${f.name}" name="${f.name}" type="${f.type || "text"}" ${
                f.step ? `step="${f.step}"` : ""
              } value="${val}" placeholder="${esc(f.placeholder || "")}" />`;
        return `
          <div class="field ${f.full ? "full" : ""}">
            <label for="mf-${f.name}">${esc(f.label)}</label>
            ${control}
          </div>`;
      })
      .join("");

    openModal({
      title,
      bodyHtml: `
        ${subtitle ? `<p class="view-sub" style="margin-bottom:12px;">${esc(subtitle)}</p>` : ""}
        <form id="rp-modal-form" class="form-grid" novalidate>
          ${fieldsHtml}
          <div id="rp-modal-error" class="field full field-error" role="alert"></div>
          <div class="field full modal-actions">
            <button type="button" class="btn btn-ghost" id="rp-modal-cancel">Cancelar</button>
            <button type="submit" class="btn btn-primary">${esc(submitLabel)}</button>
          </div>
        </form>
      `,
      onMount(dialog, close) {
        dialog.querySelector("#rp-modal-cancel")?.addEventListener("click", close);
        dialog.querySelector("#rp-modal-form")?.addEventListener("submit", (e) => {
          e.preventDefault();
          const data = {};
          fields.forEach((f) => {
            data[f.name] = dialog.querySelector(`#mf-${f.name}`)?.value ?? "";
          });
          const res = onSubmit(data);
          if (res && res.ok === false) {
            dialog.querySelector("#rp-modal-error").textContent = res.error || "Revisa los datos ingresados.";
            return;
          }
          close();
        });
      },
    });
  }

  function openConfirmModal({ title, message, confirmLabel = "Confirmar", tone = "primary", onConfirm }) {
    const esc = RP.format.escapeHtml;
    const btnCls = tone === "green" ? "btn-green" : "btn-primary";
    openModal({
      title,
      bodyHtml: `
        <p style="margin:0 0 12px; color:var(--color-text-secondary);">${esc(message)}</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" id="rp-confirm-cancel">Cancelar</button>
          <button type="button" class="btn ${btnCls}" id="rp-confirm-ok">${esc(confirmLabel)}</button>
        </div>
      `,
      onMount(dialog, close) {
        dialog.querySelector("#rp-confirm-cancel")?.addEventListener("click", close);
        dialog.querySelector("#rp-confirm-ok")?.addEventListener("click", () => {
          onConfirm();
          close();
        });
      },
    });
  }

  RP.modal = {
    openModal,
    openFormModal,
    openConfirmModal,
    closeModal,
  };
})(window);
