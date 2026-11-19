# Auditoría Inicial del Proyecto — RED PEPPER

**Fecha de auditoría:** 2026-11-18  
**Rama base auditada:** `feat/plantillas-educcion-ilacion` (`7178ef0`)  
**Repositorios verificados:**
- Trabajo activo: `Quetzalq4321q/Requisitos-de-Software-RedPepper` (fork de `Jchino24/Requisitos-de-Software`)
- Remoto auxiliar en workspace: `Quetzalq4321q/Requisitos-de-Software` (repositorio vacío inicial con solo `README.md`, sin relación de código fuente activo)

---

## 1. Inventario Tecnológico y Estructura Actual

| Capa | Tecnología / Archivo | Estado | Observación |
|---|---|---|---|
| Documentación formal | LaTeX (`pdflatex`), TikZ, `Makefile` | Operativo | 86 págs. en `pdf/Requisitos_RedPepper.pdf` + 5 PDFs por sección; `make check` sin errores. |
| Sistema de diseño | `.stitch/DESIGN.md` | Desalineado con nueva marca | Definía `#C22B22` y `Plus Jakarta Sans`; el prompt maestro exige marca oficial `#FF3131`, `#F64301`, `#1F6636` y tipografía legible (`Source Sans 3`). |
| Frontend / Prototipo | HTML5 + Vanilla CSS + Vanilla JS (`prototipo/`) | Monolítico | 1 HTML (`417` líneas), 1 CSS (`834` líneas) y 1 JS (`1041` líneas) sin módulos ES ni componentes reutilizables. |
| Dependencias / Build | Sin `package.json`, sin bundler | Cero dependencias | Funciona directamente vía `file://` o servidor HTTP estático; Python 3 (`Pillow` con WebP), Node.js 24, Chromium y `pdflatex` disponibles. |
| Recursos gráficos | `diagramas/*.png`, `interfaces/*.png`, `interfaces/fuentes/*.jpg` | Parcial | No existe logotipo maestro adjunto en `upload/` ni fotografía gastronómica en `prototipo/assets/` (`upload/` contiene `PLANTILLAS_*.zip`, `image.png`, `image_2.png` de tablas Word). |
| Agent Skills locales | `.agents/skills/` | Inexistente | Solo existían 8 skills globales del entorno (`taste-design`, `stitch-extract-design-md`, `web-app-development`, `enhance-prompt`, `github`, `env-setup`, `generative_ui`, `migrate-workflows`). |
| Pruebas automatizadas | Ninguna | Ausente | No existían pruebas multi-viewport, contraste WCAG ni verificación E2E de flujos en Chromium. |

---

## 2. Rutas, Módulos e Interfaces Existentes (`prototipo/`)

1. **Selector único compartido (`index.html` + `app.js`):**
   - `cliente`: Carta digital, selección de canal, carrito, seguimiento de última comanda.
   - `pos`: Mostrador POS táctil (botones `>=48px`), método de pago, cierre de jornada.
   - `cocina`: Tablero KDS (`Pendiente`, `En preparación`, `Listo`) y bloqueo rápido de stock.
   - `admin-margen`: KPIs del día, prorrateo P-14 editable por día hábil/feriado, ventas por canal, ranking de carta, export CSV.
   - `admin-operaciones`: Tabla de compras, formulario de nueva compra, precios de carta y auditoría reciente.
   - `admin-contabilidad`: Estado de resultados NIIF 18 en cascada, costos indirectos en `<details>`, reglas tributarias con autorización de Jerry, cierre/bloqueo de periodo, comprobantes SUNAT filtrables.

---

## 3. Funciones Operativas Críticas que Deben Conservarse

1. **Sincronización en vivo entre roles** (`localStorage`): pedido confirmado en Cliente/POS aparece de inmediato en Cocina KDS y suma al Margen y Ranking.
2. **Bloqueo instantáneo de productos agotados** (`R-ENT2-05` / `R-ENT1-02`): marcar agotado en Cocina o Admin impide agregar/confirmar ese plato en Cliente y POS.
3. **Prorrateo sobre jornadas hábiles efectivas** (`P-14` / `R-ENT2-07`): excluye feriados; las compras adicionales se imputan 100 % al día.
4. **Historial inmutable de precios** (`R-PRE-13`): cambiar precio en Admin afecta ventas nuevas sin alterar comandas previas.
5. **Integridad contable NIIF 18 & SUNAT** (`RF-10` a `RF-16`, `RNF-07`): separación de resultado operativo, gastos financieros y BAI; autorización de Jerry en reglas tributarias (`R-ENT2-10`); bloqueo de periodo cerrado con nota de ajuste (`R-ENT2-14`); distinción entre hash SHA-256 e integridad vs cifrado (`RNF-08`).
6. **Controles táctiles `>=48px` en POS** (`RNF-05` / `R-ENT2-02`).

---

## 4. Problemas Técnicos, UX/UI y Duplicidades Detectadas

1. **Mezcla de navegación pública e interna:** Un comensal viendo la carta pública visualiza las pestañas `Mostrador`, `Cocina`, `Margen`, `Compras`, `Contabilidad` en la misma barra superior.
2. **Identidad gastronómica débil:** Sin logotipo de **RED PEPPER — Sánguches, Salchipapas & Más**, sin paleta oficial `#FF3131` / `#F64301` / `#1F6636`, y sin fotografías reales de platos.
3. **Uso de `window.prompt()` nativo:** `correctPurchaseAmount`, `updateMenuPrice` y `registerAdjustmentNote` bloquean el hilo con `prompt()` del navegador, rompiendo la estética, la accesibilidad móvil y el control de validación inline.
4. **Monolito acoplado:** Todo el HTML de 6 aplicaciones y 1,041 líneas de JS viven en 2 archivos sin separación de núcleo, componentes ni subaplicaciones.
5. **Faltan sub-vistas clave para escalar el producto:**
   - Cliente sin vista de detalle/personalización previa, búsqueda por texto, historial local de pedidos ni página de información/contacto del local.
   - Cocina sin historial reciente de despachos y vista clara por producto agotado.
   - Administración sin pantalla dedicada de **Configuración y Reglas Operativas** ni visor interno de **Guía de Marca / Design System**.

---

## 5. Clasificación Honesta: Existente vs Implementable Frontend vs Dependiente de Backend

| Capacidad | Estado | Alcance en este proyecto |
|---|---|---|
| Carta, carrito, POS, KDS, prorrateo P-14, NIIF 18 borrador, auditoría local | Real e implementable en navegador | Estado reactivo compartido y persistencia local (`localStorage` + `BroadcastChannel`/eventos). |
| Edición con modales accesibles, búsqueda, filtros, validaciones, CSV | Real e implementable en navegador | Reemplazo total de `prompt()`, validación por campo y exportación CSV real. |
| Autenticación JWT multiusuario real, BD PostgreSQL/MySQL, emisión OSE SUNAT, almacenamiento cifrado en servidor, WebSockets multi-dispositivo | Requiere backend futuro | Se modela fielmente en UI/flujos y se declara explícitamente como **simulado en cliente** sin inventar endpoints ni credenciales. |
| Logotipo oficial e imágenes referenciales proporcionados | Integrado en PR 5 | Vectorizado desde el logotipo circular original adjunto (`logo-red-pepper-{badge,mark,light,dark}.svg`) y adaptadas 4 fotografías referenciales a WebP (`salchipapa.webp`, `salchipapa-especial.webp`, `hamburguesa.webp`, `sanguche-pollo.webp`) junto con `alitas.webp` y `refresco.webp`. |
