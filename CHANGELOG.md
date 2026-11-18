# Registro Interno de Cambios (CHANGELOG) — RED PEPPER

Este archivo documenta los cambios mayores realizados sobre la plataforma **RED PEPPER**, organizados por segmento e identificados con su respectivo Pull Request para revisión ordenada.

---

## [PR 5/5] — Vectorización del Logotipo Oficial y Adaptación de Fotografías Referenciales (`feat/pr-05-logo-activos-reales`)
**Qué se agrega / modifica:**
- Vectorización fiel a curvas Bézier cúbicas (SVG escalable) del logotipo circular oficial de **RED PEPPER — Sánguches - Salchipapas & Más**, conservando su fondo verde `#1F6636`, aro blanco, rotulación apilada en rojo `#FF3131` con contorno blanco tipo *sticker* y descriptor original:
  - [`prototipo/assets/logo-red-pepper-badge.svg`](prototipo/assets/logo-red-pepper-badge.svg), [`logo-red-pepper-mark.svg`](prototipo/assets/logo-red-pepper-mark.svg), [`logo-red-pepper.svg`](prototipo/assets/logo-red-pepper.svg) y [`logo-red-pepper-dark.svg`](prototipo/assets/logo-red-pepper-dark.svg).
- Optimización `4:3` en formato **WebP** (`640 × 480 px`, `30–38 KB`) de las 4 fotografías gastronómicas referenciales del negocio:
  - `salchipapa.webp` (Clásica con cremas), `salchipapa-especial.webp` (Salchipapa Especial), `hamburguesa.webp` (Hamburguesa Clásica) y `sanguche-pollo.webp` (Burger / Sánguche de Pollo Deshilachado).
- Actualización de [`prototipo/src/core/store.js`](prototipo/src/core/store.js), [`prototipo/src/apps/cliente.js`](prototipo/src/apps/cliente.js) (*El Local*), [`prototipo/src/apps/brand-guide.js`](prototipo/src/apps/brand-guide.js), documentación en `docs/`, capturas `interfaces/*.png` y recompilación LaTeX (`pdf/Requisitos_RedPepper.pdf` + `05-interfaces.pdf`).

---

## [PR 4/4] — Calidad Automatizada, Documentación Integral y Compilación LaTeX (`feat/pr-04-qa-docs-latex`)
**Qué se agrega / modifica:**
- Suite automatizada `scripts/qa_verify.mjs` sobre Chromium headless vía CDP (35 combinaciones vista × viewport `320px–1920px`, accesibilidad DOM, E2E cliente->cocina->stock->P-14->NIIF 18 y capturas limpias).
- Corrección de desbordamiento móvil detectado por QA en `admin-contabilidad` a `320px`/`390px` (`min-width: 0` en hijos grid + buscador SUNAT fluido).
- Documentación completa en `docs/`:
  - `ARQUITECTURA_UX_UI.md`, `MANUAL_COMPONENTES.md`, `INVENTARIO_FUNCIONALIDADES.md`, `MATRIZ_TRAZABILIDAD.md`, `AUDITORIA_ACCESIBILIDAD.md`, `PRUEBAS_INTERFACES.md`, `MEJORAS_RENDIMIENTO.md`.
- Actualización de `interfaces/01..06*.png`, `documento/secciones/interfaces.tex`, `README.md` y recompilación verificada (`make check`) de `pdf/Requisitos_RedPepper.pdf` y `pdf/secciones/05-interfaces.pdf`.
- Este registro interno (`CHANGELOG.md`).

---

## [PR 3/4] — Arquitectura Modular, Componentes Reutilizables y Subaplicaciones (`feat/pr-03-arquitectura-subapps`)
**Qué se agrega / modifica:**
- Refactorización total del monolito (`app.js` + `styles.css` eliminados) hacia módulos desacoplados en `prototipo/src/`:
  - `core/`: `format.js`, `store.js` (migración compatible v2->v3), `actions.js` (reglas P-14, R-OBS-03, R-ENT2-*, NIIF 18 y retrocompatibilidad `?view=...`).
  - `components/`: `ui.js` (badges, empty states, íconos SVG sin emojis) y `modal.js` (modales accesibles con `Escape` y validación en línea, erradicando `window.prompt()`).
  - `apps/`: `cliente.js` (portal público 4 destinos + buscador + modal detalle/cremas + historial + El Local + barra móvil inferior), `pos.js` (`>=48px` + modal confirmación de cierre), `cocina.js` (KDS 3 columnas + stock rápido), `admin.js` (4 sub-vistas: Margen P-14, Compras/Carta, Contabilidad NIIF 18 y Configuración) y `brand-guide.js` (visor interno `?app=marca`).
  - `main.js`: enrutador y separación estricta entre nav pública y selector de equipo.

---

## [PR 2/4] — Branding Oficial RED PEPPER, Activos WebP, Tokens CSS y Guía de Marca (`feat/pr-02-branding-tokens`)
**Qué se agrega / modifica:**
- Identidad visual oficial **RED PEPPER — Sánguches, Salchipapas & Más** con paleta obligatoria `#FF3131`, `#F64301`, `#1F6636` y variantes accesibles auditadas WCAG 2.2 AA (`#D91B1B` 5.09:1, `#B91C1C` 6.47:1, `#1F6636` 6.97:1).
- Activos SVG maestros de logotipo (`logo-red-pepper.svg`, `logo-red-pepper-dark.svg`, `logo-red-pepper-mark.svg`) y 4 fotografías gastronómicas optimizadas a WebP en `prototipo/assets/` (`198 KB` total, reducción `-93.9%`).
- Sistema centralizado en `prototipo/src/styles/` (`tokens.css`, `base.css`, `components.css`) y `.stitch/DESIGN.md`.
- Guía de Marca corporativa de 20 secciones en `docs/branding/GUIA_MARCA_RED_PEPPER.md`.

---

## [PR 1/4] — Auditoría Inicial y 12 Skills Universales Reutilizables (`feat/pr-01-skills-auditoria`)
**Qué se agrega / modifica:**
- Auditoría inicial honesta del repositorio (`docs/AUDITORIA_INICIAL.md`).
- Creación de 12 Agent Skills universales (100 % agnósticas al proyecto, con las 10 secciones estándar) en `.agents/skills/*/SKILL.md`.
- Catálogo unificado de skills del entorno y nuevas (`docs/CATALOGO_SKILLS.md`).
