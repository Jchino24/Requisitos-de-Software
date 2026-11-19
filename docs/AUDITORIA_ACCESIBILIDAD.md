# Auditoría de Accesibilidad (WCAG 2.2 AA) — RED PEPPER

Auditoría ejecutada mediante [`accessible-ui-auditor`](../.agents/skills/accessible-ui-auditor/SKILL.md) y comprobación automatizada en [`scripts/qa_verify.mjs`](../scripts/qa_verify.mjs).

---

## 1. Correcciones de Contraste Cromático Aplicadas

| Elemento | Hallazgo inicial | Corrección verificada |
|---|---|---|
| Texto blanco sobre `#FF3131` (Rojo brillante) | Ratio `3.66 : 1` (insuficiente para texto pequeño `< 18 px` AA) | Se creó `--brand-red-cta: #D91B1B` (`5.09 : 1`) y `--brand-red-hover: #C41818` (`6.02 : 1`) para botones primarios; `--brand-red-ink: #B91C1C` (`6.47 : 1`) para precios y alertas sobre blanco; `#FF3131` se conserva en emblema, bordes y títulos grandes. |
| Texto blanco sobre `#F64301` (Naranja vivo) | Ratio `3.67 : 1` | Etiquetas promocionales sobre `#F64301` usan carbón cálido `#1C1917` (`4.77 : 1` AA); sobre fondo blanco se usa `--brand-orange-ink: #C23500` (`5.52 : 1`). |
| Verde oscuro oficial (`#1F6636`) | Cumple directamente | `6.97 : 1` con `#FFFFFF` y `6.35 : 1` sobre `--brand-green-soft` (`#ECF7EF`). |

---

## 2. Verificación Estructural, Teclado y Objetivos Táctiles

| Criterio WCAG 2.2 AA | Implementación | Resultado Chromium QA |
|---|---|---|
| `2.4.1` Salto de bloques | `<a class="skip-link" href="#app-content">` | Presente en `index.html`. |
| `1.3.1` Encabezados únicos | Exactamente un `<h1>` visible por subaplicación activa (`hasH1 === 1`) | **7/7** vistas aprobadas. |
| `3.3.2 / 4.1.2` Etiquetas | Todos los `<input>` / `<select>` vinculados con `<label for>` o `aria-label` | **0** controles sin etiqueta (`unlabeledInputs: []`). |
| `2.1.1 / 2.4.7` Teclado y foco | `:focus-visible` de `2 px` (`#D91B1B`); modales en [`modal.js`](../prototipo/src/components/modal.js) cierran con `Escape` y restauran el foco | Verificado. |
| `2.5.8 / RNF-05` Tamaño táctil | Botones estándar `>= 44 px`; controles POS (`btn-touch`, `pos-chip`, `touch-48`) `>= 48 px` | **0** fallos de altura (`touchFailures: []`). |
| `2.3.3` Movimiento reducido | `@media (prefers-reduced-motion: reduce)` en [`base.css`](../prototipo/src/styles/base.css) | Verificado. |
