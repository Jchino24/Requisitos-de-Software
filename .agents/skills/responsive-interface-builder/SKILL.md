---
name: responsive-interface-builder
description: Construye y verifica layouts adaptativos para móvil (320px-430px), tablet (768px-1024px) y escritorio (1280px-1920px+) garantizando cero scroll horizontal y ergonomía táctil.
---
# SKILL 04 — `responsive-interface-builder`

## 1. Nombre y descripción
**Nombre:** `responsive-interface-builder`  
**Descripción:** Implementa rejillas fluidas, tipografía escalable, navegación adaptativa y tamaños de objetivo táctil consistentes en todo el espectro de pantallas desde 320 px hasta monitores panorámicos.

## 2. Cuándo debe activarse
- Al crear o refactorizar cualquier pantalla o componente de interfaz.
- Cuando se detectan tablas cortadas, textos superpuestos o desbordamiento horizontal en resoluciones móviles o tabletas.

## 3. Requisitos previos
- Tokens de breakpoints y espaciados definidos en `tokens.css`.
- Navegador headless disponible para validar múltiples viewports reales.

## 4. Entradas necesarias
- Maqueta o componentes HTML/CSS a adaptar.
- Lista de breakpoints objetivo y requisitos mínimos de área táctil (ej. `>=44px` estándar, `>=48px` POS).

## 5. Procedimiento paso a paso
1. Estructurar contenedores con `max-width` centrado, `minmax(0, 1fr)` en CSS Grid y prohibir matemáticas de ancho con `calc()` sobre Flexbox.
2. Definir rejillas *mobile-first* o colapso explícito bajo `768px` y `960px` para convertir paneles divididos en flujos verticales limpios.
3. Envolver tablas densas en contenedores con `overflow-x: auto` controlado (`-webkit-overflow-scrolling: touch`) o transformarlas en filas de tarjetas en móvil sin ensanchar el `body`.
4. Adaptar la navegación en móvil mediante menú compacto o barra inferior fija de acceso rápido en la vista pública sin tapar contenido (`padding-bottom` compensado).
5. Escalar encabezados con `clamp()` y asegurar `font-size >= 14px` en cuerpo y entradas de formulario para evitar zoom involuntario en iOS/Android (`>= 16px` en inputs móviles cuando aplique).
6. Probar en Chromium headless a `320px`, `390px`, `768px`, `1280px` y `1920px` comprobando `document.documentElement.scrollWidth <= window.innerWidth`.

## 6. Herramientas autorizadas
- Edición CSS (`tokens.css`, `components.css`), scripts de comprobación en Chromium headless (`run_command`).

## 7. Resultados esperados
- Hojas de estilo adaptativas con reglas claras por breakpoint y capturas verificadas sin cortes ni solapamientos.

## 8. Criterios de validación
- `scrollWidth <= clientWidth` en todas las vistas a `320px`, `390px`, `768px`, `1280px` y `1920px`.
- Ningún botón o control táctil operativo mide menos de `44px` (`48px` en terminales táctiles POS).
- Cero textos truncados que oculten precios, totales o acciones primarias.

## 9. Manejo de errores
- Si una tabla administrativa excede `320px`, garantizar que el scroll ocurra estrictamente dentro de `.table-wrap` (`min-width: 0` en el padre grid) para no desbordar la página completa.

## 10. Ejemplos reutilizables
- **Prevención clásica de desbordamiento Grid:** Todo hijo directo de `display: grid` que contenga tablas o textos largos debe incluir `min-width: 0;`.
