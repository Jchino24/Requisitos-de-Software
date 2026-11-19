# Pruebas de Interfaces, Responsividad y Flujos E2E — RED PEPPER

Resultados reales obtenidos ejecutando [`scripts/qa_verify.mjs`](../scripts/qa_verify.mjs) sobre servidor HTTP local conectado por Chrome DevTools Protocol (CDP) contra `/usr/bin/chromium` headless.

---

## 1. Matriz Multi-Viewport (`scrollWidth <= viewportWidth`)

Se evaluaron **7 vistas** (`cliente`, `pos`, `cocina`, `admin-margen`, `admin-operaciones`, `admin-contabilidad`, `marca`) en **5 anchos** (`320px`, `390px`, `768px`, `1280px`, `1920px`) = **35 combinaciones**:

- **Hallazgo detectado y corregido durante QA:** en la primera corrida, `admin-contabilidad` expandía `innerWidth` a `437px` en móviles (`320px` y `390px`) debido a un `min-width: 190px` fijo en el buscador SUNAT y falta de `min-width: 0` en columnas hijas de `.grid-2`. Se corrigió en [`components.css`](../prototipo/src/styles/components.css) y [`admin.js`](../prototipo/src/apps/admin.js).
- **Resultado tras corrección:** **35 / 35** combinaciones con `scrollWidth <= viewportWidth` exacto (incluyendo `320px -> 320px` y `390px -> 390px`).

---

## 2. Verificación DOM, Imágenes y Consola

- **Imágenes cargadas (`naturalWidth > 0`):** **100 %** válidas en todas las vistas (`brokenImgs: []`).
- **Errores de ejecución (`Runtime.exceptionThrown`):** **0** errores en todo el recorrido (`consoleErrors: []`).
- **Botones táctiles POS (`>= 48 px`):** **0** controles por debajo del umbral (`touchFailures: []`).

---

## 3. Pruebas Funcionales End-to-End (E2E) Ejecutadas

| # | Flujo verificado en Chromium | Evidencia observada en DOM / Estado | Estado |
|---|---|---|---|
| **E2E 1** | Cliente abre modal de producto, selecciona crema, agrega al pedido y confirma -> Cocina KDS recibe comanda en `Pendiente` y avanza `En preparación -> Listo` | `CMD-0847` creada y transición validada hasta `finalState: "Listo"` | **Aprobado** |
| **E2E 2** | Cocina marca `P-01 Salchipapa Clásica` como agotado (`R-ENT2-05`) | Botones de agregado en POS (`posDisabled: true`) y Cliente (`cliDisabled: true`) bloqueados al instante | **Aprobado** |
| **E2E 3** | Admin alterna feriado P-14 -> abre modal de corrección de compra `CMP-101` (`S/ 600.00` con motivo) -> cierra periodo mensual NIIF 18 (`RNF-07`) | Cuota semanal recalculada (`200 -> 266.67`), monto `CMP-101 = 600`, botón `Nota de Ajuste` habilitado (`adjEnabled: true`) | **Aprobado** |

---

## 4. Capturas Oficiales Generadas

Todas las capturas (`?capture=1`, movimiento congelado) fueron actualizadas en [`interfaces/`](../interfaces/) e inspeccionadas visualmente para verificar ausencia de cortes o solapamientos:
- `01-cliente-carta-pedido.png`, `02-pos-mostrador.png`, `03-cocina-comandas.png`, `04-admin-dashboard-margen.png`, `05-admin-abastecimiento-carta.png`, `06-admin-cierre-niif18-sunat.png`.
