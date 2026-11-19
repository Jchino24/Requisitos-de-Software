# Manual de Componentes Reutilizables — RED PEPPER

Aplicando [`reusable-component-factory`](../.agents/skills/reusable-component-factory/SKILL.md), toda la interfaz comparte una capa única de tokens CSS y utilidades modulares sin estilos duplicados.

---

## 1. Hojas de Estilo Modulares (`prototipo/src/styles/`)

| Archivo | Responsabilidad |
|---|---|
| [`tokens.css`](../prototipo/src/styles/tokens.css) | Única fuente de verdad para `#FF3131`, `#F64301`, `#1F6636`, derivados AA, neutros, tipografía, radios, sombras y breakpoints. |
| [`base.css`](../prototipo/src/styles/base.css) | Reset seguro, `.skip-link`, `:focus-visible`, `.mono` tabular y soporte `prefers-reduced-motion`. |
| [`components.css`](../prototipo/src/styles/components.css) | Clases reutilizables de cabecera, navegación, tarjetas de plato, POS táctil, KDS, tablas, formularios, modales y responsive. |

---

## 2. Catálogo de Componentes JS (`prototipo/src/components/`)

### `RP.ui` ([`ui.js`](../prototipo/src/components/ui.js))
- **`statusPill(text, tone, live)`:** Píldoras semánticas (`ok`, `warn`, `danger`, `promo`, `neutral`) con indicador animado opcional en `Abierto`.
- **`emptyState(title, copy, actionHtml)`:** Estado vacío orientador cuando el carrito o filtro de búsqueda no arroja resultados.
- **`ICONS`:** Íconos SVG vectoriales consistentes (`check`, `staff`, `cart`, `clock`, `pin`) evitando emojis en controles.

### `RP.modal` ([`modal.js`](../prototipo/src/components/modal.js))
- **`openModal({ title, bodyHtml, onMount })`:** Diálogo modal accesible (`role="dialog"`, `aria-modal="true"`), cierre por `Escape` o clic en fondo y retorno de foco al disparador.
- **`openFormModal({ title, subtitle, fields, submitLabel, onSubmit })`:** Formularios en modal con `<label for=...>`, validación sin recarga y banner de error `role="alert"` (usado en Corrección de Compra, Edición de Precio, Nuevo Plato y Nota de Ajuste).
- **`openConfirmModal({ title, message, confirmLabel, tone, onConfirm })`:** Confirmación explícita para Cierre de Jornada (`RF-03`).

### `RP.format` y `RP.actions` ([`core/`](../prototipo/src/core/))
- **`RP.format.escapeHtml`:** Obligatorio antes de interpolar cualquier cadena de usuario o estado dentro de `innerHTML`.
- **`RP.format.money`:** Formatea montos a `S/ XX.XX` con respaldo tabular `.mono`.
