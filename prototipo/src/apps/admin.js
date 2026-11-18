/* =====================================================================
   RED PEPPER — Subaplicación Gerencial & Contable (4 Sub-vistas limpias)
   Margen P-14 | Compras y Carta | Contabilidad NIIF 18 | Configuración
   ===================================================================== */
(function (global) {
  const RP = (global.RP = global.RP || {});

  function renderMargen(st) {
    const esc = RP.format.escapeHtml;
    const m = RP.actions.computeDailyMetrics();
    const channels = ["Presencial", "Para llevar", "Pedido externo"];
    const ranking = st.menu
      .map((prod) => {
        let qty = 0;
        let total = 0;
        st.orders.forEach((o) => {
          o.items.forEach((i) => {
            if (i.prodId === prod.id) {
              qty += i.qty;
              total += i.qty * i.precio;
            }
          });
        });
        return { ...prod, qty, total };
      })
      .sort((a, b) => b.qty - a.qty);

    return `
      <div class="view-header">
        <div>
          <h1>Margen Bruto y Prorrateo</h1>
          <p class="view-sub">Cálculo diario sobre jornadas hábiles efectivas (P-14)</p>
        </div>
        <button type="button" class="btn btn-primary" id="btn-export-csv">Exportar CSV</button>
      </div>

      <div class="kpi-strip">
        <div class="kpi-box">
          <div class="kpi-label">Ventas Hoy</div>
          <div class="kpi-val">${RP.format.money(m.ventasHoy)}</div>
          <div class="kpi-note">${st.orders.length} comandas</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">Cuota Semanal</div>
          <div class="kpi-val">${RP.format.money(m.cuotaDiaria)}</div>
          <div class="kpi-note">${RP.format.money(m.comprasSemanales)} / ${m.effectiveDays} días</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">Adicionales Hoy</div>
          <div class="kpi-val">${RP.format.money(m.comprasAdicionales)}</div>
          <div class="kpi-note">Imputación directa del día</div>
        </div>
        <div class="kpi-box accent">
          <div class="kpi-label">Margen Bruto</div>
          <div class="kpi-val">${RP.format.money(m.margenBruto)}</div>
          <div class="kpi-note">${m.margenPct.toFixed(1)}% rentabilidad</div>
        </div>
      </div>

      <div class="days-inline">
        <span style="font-size:13px; font-weight:700;">Días hábiles efectivos (clic para alternar feriado):</span>
        <div style="display:flex; flex-wrap:wrap; gap:6px;">
          ${st.workingDays
            .map(
              (d) => `<button type="button" class="day-pill ${d.active ? "active" : "holiday"}" data-toggle-day="${esc(d.id)}">${esc(d.label)}${d.active ? "" : " (Feriado)"}</button>`
            )
            .join("")}
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-head"><h2 class="card-title">Ventas por Canal</h2></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Canal</th><th class="num">Pedidos</th><th class="num">Importe</th><th class="num">%</th></tr></thead>
              <tbody>
                ${channels
                  .map((ch) => {
                    const list = st.orders.filter((o) => o.canal === ch);
                    const sum = list.reduce((s, o) => s + o.total, 0);
                    const pct = m.ventasHoy > 0 ? (sum / m.ventasHoy) * 100 : 0;
                    return `<tr><td>${esc(ch)}</td><td class="num">${list.length}</td><td class="num">${RP.format.money(sum)}</td><td class="num">${pct.toFixed(1)}%</td></tr>`;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-head"><h2 class="card-title">Ranking de Carta</h2></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Producto</th><th class="num">Cant.</th><th class="num">Ventas</th></tr></thead>
              <tbody>
                ${ranking
                  .map(
                    (r) => `<tr>
                      <td>${esc(r.nombre)} ${!r.disponible ? RP.ui.statusPill("Agotado", "danger") : ""}</td>
                      <td class="num">${r.qty}</td>
                      <td class="num">${RP.format.money(r.total)}</td>
                    </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderCompras(st) {
    const esc = RP.format.escapeHtml;
    return `
      <div class="view-header">
        <div>
          <h1>Compras y Precios de Carta</h1>
          <p class="view-sub">Registro de egresos, correcciones auditadas y tarifas vigentes</p>
        </div>
        <button type="button" class="btn btn-green" id="btn-new-dish">+ Nuevo Plato</button>
      </div>

      <div class="split-admin" style="margin-bottom:18px;">
        <div class="card">
          <div class="card-head"><h2 class="card-title">Compras Registradas</h2></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Proveedor</th><th>Insumo</th><th>Tipo</th><th class="num">Monto</th><th></th></tr></thead>
              <tbody>
                ${st.purchases
                  .map(
                    (p) => `<tr>
                      <td><strong>${esc(p.proveedor)}</strong><div class="mono" style="color:var(--color-text-muted);">${esc(p.fecha)}</div></td>
                      <td>${esc(p.insumo)}</td>
                      <td>${RP.ui.statusPill(p.tipo, p.tipo === "Semanal" ? "neutral" : "warn")}</td>
                      <td class="num">${RP.format.money(p.monto)}</td>
                      <td style="text-align:right;"><button type="button" class="btn" data-edit-purchase="${esc(p.id)}">Corregir</button></td>
                    </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-head"><h2 class="card-title">Nueva Compra</h2></div>
          <form id="form-compra-mod" class="form-grid" novalidate>
            <div class="field">
              <label for="inp-prov">Proveedor</label>
              <input id="inp-prov" type="text" placeholder="Don Pollo S.A.C." required />
            </div>
            <div class="field">
              <label for="inp-ruc">RUC (11 dígitos)</label>
              <input id="inp-ruc" type="text" placeholder="20512348901" maxlength="11" />
            </div>
            <div class="field full">
              <label for="inp-insumo">Insumo</label>
              <input id="inp-insumo" type="text" placeholder="Lote papas picadas 50 kg" required />
            </div>
            <div class="field">
              <label for="inp-tipo">Modalidad</label>
              <select id="inp-tipo">
                <option value="Semanal">Semanal (prorrateo)</option>
                <option value="Adicional">Adicional (hoy)</option>
              </select>
            </div>
            <div class="field">
              <label for="inp-monto">Monto (S/)</label>
              <input id="inp-monto" type="number" step="0.01" placeholder="120.00" required />
            </div>
            <div id="form-compra-err" class="field full field-error" role="alert"></div>
            <div class="field full">
              <button type="submit" class="btn btn-primary btn-full">Registrar Compra</button>
            </div>
          </form>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-head"><h2 class="card-title">Precios de Carta</h2></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Producto</th><th class="num">Precio</th><th></th></tr></thead>
              <tbody>
                ${st.menu
                  .map(
                    (p) => `<tr>
                      <td><strong>${esc(p.nombre)}</strong> <span class="pill pill-neutral">${esc(p.cat)}</span></td>
                      <td class="num">${RP.format.money(p.precio)}</td>
                      <td style="text-align:right;"><button type="button" class="btn" data-edit-price="${esc(p.id)}">Editar</button></td>
                    </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-head"><h2 class="card-title">Auditoría Reciente</h2></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Hora</th><th>Usuario</th><th>Detalle</th></tr></thead>
              <tbody>
                ${st.auditLog
                  .slice(0, 6)
                  .map(
                    (a) => `<tr>
                      <td class="mono">${esc(a.fecha.slice(11))}</td>
                      <td>${esc(a.usuario.replace(/ \(ACT-\d+\)/, ""))}</td>
                      <td>${esc(a.detalle)}</td>
                    </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderContabilidad(st) {
    const esc = RP.format.escapeHtml;
    const m = RP.actions.computeDailyMetrics();
    const ventasMes = 42850.00 + m.ventasHoy;
    const costosDirectosMes = 6120.00 + m.costoAsignado;
    const margenBrutoMes = ventasMes - costosDirectosMes;
    const indirectosMes = st.indirectCosts.reduce((s, c) => s + c.monto, 0);
    const resultadoOperativo = margenBrutoMes - indirectosMes;
    const bai = resultadoOperativo - st.gastosFinancierosMes;
    const activeRule = st.taxRules.find((r) => r.estado === "Vigente") || st.taxRules[0];
    const impuestoMes = ventasMes * (activeRule.tasaPct / 100);
    const resultadoNeto = bai - impuestoMes;

    const sunatQ = RP.format.normalizeText(st._sunatSearch || "");
    const sunatRows = st.purchases.filter(
      (p) =>
        !sunatQ ||
        RP.format.normalizeText(p.ruc).includes(sunatQ) ||
        RP.format.normalizeText(p.proveedor).includes(sunatQ) ||
        RP.format.normalizeText(p.insumo).includes(sunatQ)
    );

    return `
      <div class="view-header">
        <div>
          <h1>Contabilidad NIIF 18 y SUNAT</h1>
          <p class="view-sub">Cierre mensual (borrador), reglas tributarias y repositorio de comprobantes</p>
        </div>
        <div class="header-actions">
          <button type="button" id="btn-period-lock" class="btn btn-primary">${st.periodoCerrado ? "Reabrir Periodo" : "Cerrar Periodo"}</button>
          <button type="button" id="btn-adj-note" class="btn" ${st.periodoCerrado ? "" : "disabled"}>Nota de Ajuste</button>
        </div>
      </div>

      ${
        st.periodoCerrado
          ? `<div class="alert-banner">Periodo mensual cerrado: edición directa bloqueada (solo notas de ajuste autorizadas · RNF-07).</div>`
          : ""
      }

      <div class="grid-2">
        <div class="card">
          <div class="card-head"><h2 class="card-title">Estado de Resultados — NIIF 18</h2></div>
          <div class="cascade-list">
            <div class="cascade-row"><span>Ventas confirmadas</span><span class="num">${RP.format.money(ventasMes)}</span></div>
            <div class="cascade-row"><span>(-) Costos directos y prorrateo</span><span class="num">- ${RP.format.money(costosDirectosMes)}</span></div>
            <div class="cascade-row subtotal"><span>Margen Bruto</span><span class="num">${RP.format.money(margenBrutoMes)}</span></div>
            <div class="cascade-row"><span>(-) Costos indirectos fijos</span><span class="num">- ${RP.format.money(indirectosMes)}</span></div>
            <div class="cascade-row subtotal"><span>Resultado Operativo</span><span class="num">${RP.format.money(resultadoOperativo)}</span></div>
            <div class="cascade-row"><span>(-) Gastos financieros</span><span class="num">- ${RP.format.money(st.gastosFinancierosMes)}</span></div>
            <div class="cascade-row subtotal"><span>BAI (antes de impuestos)</span><span class="num">${RP.format.money(bai)}</span></div>
            <div class="cascade-row"><span>(-) Impuesto estimado (${activeRule.tasaPct}%)</span><span class="num">- ${RP.format.money(impuestoMes)}</span></div>
            <div class="cascade-row total"><span>Resultado Neto</span><span class="num">${RP.format.money(resultadoNeto)}</span></div>
          </div>
          <details style="margin-top:12px;">
            <summary style="cursor:pointer; font-weight:700; font-size:12.5px; color:var(--color-text-secondary);">Ver desglose de costos indirectos fijos</summary>
            <div class="table-wrap" style="margin-top:8px;">
              <table><tbody>
                ${st.indirectCosts.map((c) => `<tr><td>${esc(c.concepto)}</td><td class="num">${RP.format.money(c.monto)}</td></tr>`).join("")}
              </tbody></table>
            </div>
          </details>
        </div>

        <div style="display:flex; flex-direction:column; gap:16px;">
          <div class="card">
            <div class="card-head"><h2 class="card-title">Reglas Tributarias</h2></div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>Regla</th><th class="num">Tasa</th><th>Estado</th><th></th></tr></thead>
                <tbody>
                  ${st.taxRules
                    .map(
                      (r) => `<tr>
                        <td><strong class="mono">${esc(r.id)}</strong><div style="font-size:12px; color:var(--color-text-muted);">${esc(r.nombre)}</div></td>
                        <td class="num">${r.tasaPct.toFixed(2)}%</td>
                        <td>${RP.ui.statusPill(r.estado, r.estado === "Vigente" ? "ok" : r.estado.includes("Pendiente") ? "warn" : "neutral")}</td>
                        <td style="text-align:right;">${
                          r.estado.includes("Pendiente")
                            ? `<button type="button" class="btn btn-primary" data-approve-rule="${esc(r.id)}">Autorizar</button>`
                            : ""
                        }</td>
                      </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>

          <div class="card">
            <div class="card-head">
              <h2 class="card-title">Comprobantes SUNAT</h2>
              <div style="flex:1 1 160px; max-width:240px;">
                <label for="sunat-filter-mod" class="sr-only">Buscar comprobante por RUC o proveedor</label>
                <input id="sunat-filter-mod" type="search" class="input-control" value="${esc(st._sunatSearch || "")}" placeholder="Buscar RUC o proveedor..." />
              </div>
            </div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>RUC · Proveedor</th><th>Archivo · Hash SHA-256</th><th class="num">Monto</th></tr></thead>
                <tbody>
                  ${sunatRows
                    .map(
                      (p) => `<tr>
                        <td><span class="mono">${esc(p.ruc)}</span> · ${esc(p.proveedor)}</td>
                        <td class="mono">${esc(p.comprobante)} · ${esc(p.sha256)}</td>
                        <td class="num">${RP.format.money(p.monto)}</td>
                      </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderConfig(st) {
    const esc = RP.format.escapeHtml;
    return `
      <div class="view-header">
        <div>
          <h1>Configuración y Alcance Operativo</h1>
          <p class="view-sub">Parámetros locales del turno, identidad visual y frontera frontend / backend</p>
        </div>
        <button type="button" class="btn btn-orange" id="btn-open-brand-guide">Abrir Guía de Marca Interna</button>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-head"><h2 class="card-title">Horario de Jornada (R-ENT2-03)</h2></div>
          <form id="form-schedule" class="form-grid">
            <div class="field">
              <label for="cfg-inicio">Hora apertura</label>
              <input id="cfg-inicio" type="time" value="${esc(st.jornadaInicio)}" />
            </div>
            <div class="field">
              <label for="cfg-fin">Hora cierre</label>
              <input id="cfg-fin" type="time" value="${esc(st.jornadaFin)}" />
            </div>
            <div class="field full">
              <button type="submit" class="btn btn-primary">Guardar Horario</button>
            </div>
          </form>
        </div>

        <div class="card">
          <div class="card-head"><h2 class="card-title">Estado de Arquitectura (Frontend vs Backend)</h2></div>
          <ul class="kds-items" style="margin:0;">
            <li><strong>Operativo en navegador:</strong> Carta WebP, carrito, POS ≥ 48 px, KDS, stock instantáneo, P-14, NIIF 18 borrador, modales accesibles y export CSV.</li>
            <li><strong>Simulado para demo (requiere servidor futuro):</strong> Autenticación JWT RBAC (RNF-01), persistencia multiusuario en BD, envío OSE SUNAT y bóveda cifrada real (RNF-08).</li>
          </ul>
          <div style="margin-top:14px;">
            <button type="button" class="btn btn-ghost" id="btn-cfg-reset">Restablecer Datos de Demo</button>
          </div>
        </div>
      </div>
    `;
  }

  function render(container, st) {
    if (st.activeTab === "compras") {
      container.innerHTML = renderCompras(st);
    } else if (st.activeTab === "contabilidad") {
      container.innerHTML = renderContabilidad(st);
    } else if (st.activeTab === "config") {
      container.innerHTML = renderConfig(st);
    } else {
      container.innerHTML = renderMargen(st);
    }
    bindEvents(container, st);
  }

  function bindEvents(container, st) {
    container.querySelector("#btn-export-csv")?.addEventListener("click", RP.actions.exportCsvReport);
    container.querySelectorAll("[data-toggle-day]").forEach((b) =>
      b.addEventListener("click", () => RP.actions.toggleWorkingDay(b.dataset.toggleDay))
    );

    container.querySelector("#form-compra-mod")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const res = RP.actions.registerPurchase({
        proveedor: document.getElementById("inp-prov").value,
        ruc: document.getElementById("inp-ruc").value,
        insumo: document.getElementById("inp-insumo").value,
        tipo: document.getElementById("inp-tipo").value,
        monto: document.getElementById("inp-monto").value,
        sizeKb: "1450",
      });
      if (!res.ok) {
        document.getElementById("form-compra-err").textContent = res.error;
      }
    });

    container.querySelectorAll("[data-edit-purchase]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const p = st.purchases.find((x) => x.id === btn.dataset.editPurchase);
        if (!p) return;
        RP.modal.openFormModal({
          title: `Corregir compra ${p.id}`,
          subtitle: `${p.proveedor} — ${p.insumo}`,
          fields: [
            { name: "monto", label: "Nuevo monto (S/)", type: "number", step: "0.01", value: p.monto.toFixed(2) },
            { name: "motivo", label: "Motivo obligatorio (R-ENT2-08)", value: "Error de digitación de comprobante", full: true },
          ],
          submitLabel: "Guardar Corrección",
          onSubmit: (data) => RP.actions.correctPurchaseAmount(p.id, data.monto, data.motivo),
        });
      })
    );

    container.querySelectorAll("[data-edit-price]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const prod = st.menu.find((m) => m.id === btn.dataset.editPrice);
        if (!prod) return;
        RP.modal.openFormModal({
          title: `Actualizar precio — ${prod.nombre}`,
          subtitle: "Las ventas anteriores conservarán su precio histórico (R-PRE-13).",
          fields: [{ name: "precio", label: "Nuevo precio de venta (S/)", type: "number", step: "0.01", value: prod.precio.toFixed(2), full: true }],
          submitLabel: "Actualizar Tarifa",
          onSubmit: (data) => RP.actions.updateMenuPrice(prod.id, data.precio),
        });
      })
    );

    container.querySelector("#btn-new-dish")?.addEventListener("click", () => {
      RP.modal.openFormModal({
        title: "Agregar Plato a la Carta",
        subtitle: "Se mostrará automáticamente en Cliente, POS y Control de Stock (R-PRE-12).",
        fields: [
          { name: "nombre", label: "Nombre del producto", placeholder: "Ej. Sánguche de Pollo Deshilachado", full: true },
          { name: "cat", label: "Categoría", type: "select", options: ["Salchipapas", "Hamburguesas", "Especiales", "Bebidas"], value: "Hamburguesas" },
          { name: "precio", label: "Precio (S/)", type: "number", step: "0.01", value: "10.00" },
          { name: "desc", label: "Descripción breve", placeholder: "Preparado al momento con cremas", full: true },
        ],
        submitLabel: "Crear Producto",
        onSubmit: (data) => RP.actions.createMenuItem(data),
      });
    });

    container.querySelectorAll("[data-approve-rule]").forEach((btn) =>
      btn.addEventListener("click", () => RP.actions.approveTaxRule(btn.dataset.approveRule))
    );

    container.querySelector("#btn-period-lock")?.addEventListener("click", RP.actions.togglePeriodLock);
    container.querySelector("#btn-adj-note")?.addEventListener("click", () => {
      RP.modal.openFormModal({
        title: "Registrar Nota de Ajuste (Periodo Cerrado)",
        subtitle: "Requiere registro autorizado en auditoría (R-ENT2-14).",
        fields: [{ name: "motivo", label: "Motivo de nota de ajuste", value: "Ajuste por nota de crédito comprobada", full: true }],
        submitLabel: "Registrar Nota",
        onSubmit: (data) => RP.actions.registerAdjustmentNote(data.motivo),
      });
    });

    container.querySelector("#sunat-filter-mod")?.addEventListener("input", (e) => {
      st._sunatSearch = e.target.value;
      const pos = e.target.selectionStart;
      RP.main.renderAll();
      const inp = document.getElementById("sunat-filter-mod");
      if (inp) {
        inp.focus();
        inp.setSelectionRange(pos, pos);
      }
    });

    container.querySelector("#form-schedule")?.addEventListener("submit", (e) => {
      e.preventDefault();
      RP.actions.updateJornadaSchedule(
        document.getElementById("cfg-inicio").value,
        document.getElementById("cfg-fin").value
      );
    });

    container.querySelector("#btn-open-brand-guide")?.addEventListener("click", () => RP.actions.navigate("marca", "guia"));
    container.querySelector("#btn-cfg-reset")?.addEventListener("click", () => {
      RP.store.resetDemo();
      RP.actions.showToast("Datos de demostración restablecidos.");
    });
  }

  RP.apps = RP.apps || {};
  RP.apps.admin = { render };
})(window);
