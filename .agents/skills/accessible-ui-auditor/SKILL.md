---
name: accessible-ui-auditor
description: Audita interfaces web bajo criterios WCAG 2.2 AA (contraste, navegación por teclado, foco visible, semántica ARIA, etiquetas y objetivos táctiles) y propone o aplica correcciones.
---
# SKILL 06 — `accessible-ui-auditor`

## 1. Nombre y descripción
**Nombre:** `accessible-ui-auditor`  
**Descripción:** Evalúa y corrige barreras de accesibilidad en HTML, CSS y JS interactivo conforme a las pautas WCAG 2.2 nivel AA.

## 2. Cuándo debe activarse
- Después de definir paleta de colores, formularios, modales o flujos interactivos.
- Antes de aprobar cualquier entrega frontend para producción o evaluación.

## 3. Requisitos previos
- Código HTML/CSS/JS ejecutable en navegador o entorno headless.

## 4. Entradas necesarias
- URL o ruta HTML de las vistas a auditar.
- Valores HEX de tokens de marca y neutros.

## 5. Procedimiento paso a paso
1. Verificar estructura semántica: un solo `<h1>` lógico por contexto activo, jerarquía ordenada (`h1` -> `h2` -> `h3`), regiones `<header>`, `<nav>`, `<main>`, `<footer>`.
2. Auditar formularios y controles: todo `<input>` y `<select>` posee `<label for=...>` o `aria-label` válido; mensajes de error vinculados por `aria-describedby`.
3. Verificar foco visible (`:focus-visible`) de alto contraste y soporte completo de teclado (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape` en modales).
4. Calcular ratios de contraste reales entre estilos computados (`getComputedStyle`) de texto/fondo (`>= 4.5:1` texto normal, `>= 3.0:1` texto grande o gráficos UI).
5. Medir áreas interactivas (`getBoundingClientRect`): `>= 44x44px` en UI estándar y `>= 48x48px` en pantallas táctiles operativas.
6. Confirmar respeto a `prefers-reduced-motion: reduce` y atributos `alt` descriptivos en imágenes.

## 6. Herramientas autorizadas
- Script de inspección DOM y estilos computados en Chromium headless, cálculo matemático de luminancia WCAG.

## 7. Resultados esperados
- Lista de hallazgos con elemento, criterio WCAG infringido, severidad y verificación tras corrección.

## 8. Criterios de validación
- Cero errores críticos de contraste (`< 4.5:1` en cuerpo), cero controles sin etiqueta accesible y cero trampas de teclado.
- `document.activeElement` visible en todo recorrido por teclado.

## 9. Manejo de errores
- Si el color principal de marca no logra `4.5:1` con texto blanco en botones pequeños o texto sobre fondo claro, sustituir por el token oscurecido de alto contraste para texto manteniendo el color puro solo en elementos gráficos grandes o bordes.

## 10. Ejemplos reutilizables
- **Fórmula de contraste WCAG en JS:** `luminance(rgb)` + `(L1 + 0.05) / (L2 + 0.05)` evaluada directamente sobre nodos visibles del DOM en Chromium.
