# Matriz de Trazabilidad — Requisitos <-> Interfaces <-> Código <-> Pruebas

Aplicando [`requirements-documenter`](../.agents/skills/requirements-documenter/SKILL.md), se vincula cada requisito del catálogo formal (`documento/secciones/especificacion.tex`) con la interfaz real, archivo fuente y verificación automatizada.

---

## 1. Requisitos Funcionales (`RF-01` a `RF-20`)

| ID | Requisito | Subapp / Pantalla | Archivo y símbolo | Control UI / Acción | Estado real | Caso QA |
|---|---|---|---|---|---|---|
| `RF-01` | Registro de ventas POS | Mostrador POS / Cliente | [`actions.js`](../prototipo/src/core/actions.js) `confirmOrder` | `Cobrar y Enviar a Cocina` | Implementado (navegador) | E2E 1 |
| `RF-02` | Gestión de carta y stock | Compras y Carta / Cocina | [`actions.js`](../prototipo/src/core/actions.js) `createMenuItem`, `toggleProductStock`, `updateMenuPrice` | `+ Nuevo Plato`, `Editar`, `Activo/Agotado` | Implementado (navegador) | E2E 2 |
| `RF-03` | Cierre diario de jornada | Mostrador POS | [`pos.js`](../prototipo/src/apps/pos.js) `#btn-pos-cierre` | Modal confirmar `Cerrar Jornada` | Implementado (navegador) | Verificado DOM |
| `RF-04` | Registro de compras | Compras y Carta | [`admin.js`](../prototipo/src/apps/admin.js) `#form-compra-mod` | Formulario `Nueva Compra` + validaciones | Implementado (navegador) | E2E 3 |
| `RF-05` | Clasificación Semanal / Adicional | Compras y Carta | [`actions.js`](../prototipo/src/core/actions.js) `registerPurchase` | Select `Modalidad` (`Semanal` / `Adicional`) | Implementado (navegador) | Verificado DOM |
| `RF-06` | Motor prorrateo días hábiles (`P-14`) | Margen P-14 | [`actions.js`](../prototipo/src/core/actions.js) `computeDailyMetrics`, `toggleWorkingDay` | Barra interactiva `Días hábiles efectivos` | Implementado (navegador) | E2E 3 |
| `RF-07` | Imputación 100 % compras adicionales | Margen P-14 | [`actions.js`](../prototipo/src/core/actions.js) `computeDailyMetrics` | KPI `Adicionales Hoy` | Implementado (navegador) | E2E 3 |
| `RF-08` | Margen bruto diario | Margen P-14 | [`admin.js`](../prototipo/src/apps/admin.js) `renderMargen` | KPI verde `Margen Bruto` | Implementado (navegador) | E2E 3 |
| `RF-09` | Costos indirectos fijos | Contabilidad NIIF 18 | [`admin.js`](../prototipo/src/apps/admin.js) `renderContabilidad` | Desplegable `<details>` costos indirectos | Lectura / demo base | Render OK |
| `RF-10` | Cálculo de utilidad BAI | Contabilidad NIIF 18 | [`admin.js`](../prototipo/src/apps/admin.js) `renderContabilidad` | Fila `BAI (antes de impuestos)` | Implementado (navegador) | Render OK |
| `RF-11` | Parametrización fiscal (autorización Jerry) | Contabilidad NIIF 18 | [`actions.js`](../prototipo/src/core/actions.js) `approveTaxRule` | Botón `Autorizar` regla pendiente | Implementado (navegador) | Render OK |
| `RF-12` | Liquidación estimada de tributos | Contabilidad NIIF 18 | [`admin.js`](../prototipo/src/apps/admin.js) `renderContabilidad` | Fila `(-) Impuesto estimado` | Implementado (navegador) | Render OK |
| `RF-13` | Margen neto final | Contabilidad NIIF 18 | [`admin.js`](../prototipo/src/apps/admin.js) `renderContabilidad` | Fila oscura `Resultado Neto` | Implementado (navegador) | Render OK |
| `RF-14` | Estado financiero NIIF 18 | Contabilidad NIIF 18 | [`admin.js`](../prototipo/src/apps/admin.js) `renderContabilidad` | Cascada Operación -> Financiero -> Fiscal | Borrador cliente | Render OK |
| `RF-15` | Gestión y compresión de comprobantes | Compras y Carta / SUNAT | [`actions.js`](../prototipo/src/core/actions.js) `registerPurchase` | Registro tamaño comprimido `<1MB` | Simulado en cliente | E2E 3 |
| `RF-16` | Búsqueda de comprobantes SUNAT | Contabilidad NIIF 18 | [`admin.js`](../prototipo/src/apps/admin.js) `#sunat-filter-mod` | Input búsqueda por RUC/proveedor | Implementado (navegador) | A11y OK |
| `RF-17` | Ranking de carta (incluye 0 ventas) | Margen P-14 | [`admin.js`](../prototipo/src/apps/admin.js) `renderMargen` | Tabla `Ranking de Carta` | Implementado (navegador) | Render OK |
| `RF-18` | Dashboard de decisión gerencial | Margen P-14 | [`admin.js`](../prototipo/src/apps/admin.js) `renderMargen` | KPIs + Ventas por Canal + Ranking | Implementado (navegador) | Render OK |
| `RF-19` | Exportación de reporte | Margen P-14 | [`actions.js`](../prototipo/src/core/actions.js) `exportCsvReport` | Botón `Exportar CSV` (XLSX/PDF requiere backend/lib) | Parcial CSV | Render OK |
| `RF-20` | Auditoría inmutable de cambios | Compras y Carta / Contabilidad | [`actions.js`](../prototipo/src/core/actions.js) `addAudit`, `correctPurchaseAmount` | Modales `Corregir` y `Nota de Ajuste` + tabla `Auditoría Reciente` | Implementado (local) | E2E 3 |

---

## 2. Requisitos No Funcionales (`RNF-01` a `RNF-08`) y Reglas Clave

| ID | Atributo | Cobertura actual | Evidencia |
|---|---|---|---|
| `RNF-01` | Seguridad RBAC / JWT | Separación visual cliente vs equipo en [`main.js`](../prototipo/src/main.js); JWT real requiere backend. | Modal selector de rol |
| `RNF-02` | Trazabilidad y log | Bitácora cronológica de mutaciones en `state.auditLog`. | Tabla `Auditoría Reciente` |
| `RNF-03` | Rendimiento (< 3 s) | Render local instantáneo (< 50 ms) e imágenes WebP de `36–62 KB`. | [`MEJORAS_RENDIMIENTO.md`](MEJORAS_RENDIMIENTO.md) |
| `RNF-04` | Persistencia offline local | Estado guardado en `localStorage` (`redpepper_erp_v3_state`); backup diario requiere servidor. | [`store.js`](../prototipo/src/core/store.js) |
| `RNF-05` | Usabilidad adaptativa (`>= 48 px` POS) | Botones POS `.btn-touch`, `.pos-chip`, `.touch-48` verificados `>= 48 px` en Chromium. | `qa_verify.mjs` |
| `RNF-06` | Precisión numérica `DECIMAL(12,4)` | Formato uniforme 2 decimales visuales en JS; `DECIMAL(12,4)` aplica en BD futura. | [`format.js`](../prototipo/src/core/format.js) |
| `RNF-07` | Inmutabilidad de periodo cerrado | Botón `Cerrar Periodo` bloquea compras/correcciones directas y habilita `Nota de Ajuste`. | E2E 3 (`qa_verify.mjs`) |
| `RNF-08` | Comprobantes SHA-256 / cifrado | Muestra huella SHA-256 en tabla SUNAT separada de cifrado en reposo (requiere servidor). | Vista `Contabilidad` |
| `R-OBS-03` | Estados de cocina | Transiciones estrictas `Pendiente -> En preparación -> Listo` en `advanceOrderState`. | E2E 1 (`qa_verify.mjs`) |
| `R-ENT2-03` | Horario configurable | Sub-vista `Configuración` edita `jornadaInicio` / `jornadaFin`. | [`admin.js`](../prototipo/src/apps/admin.js) |
