---
name: ui-quality-assurance
description: Ejecuta pruebas funcionales y visuales automatizadas en navegador real sobre navegación, formularios, errores de consola, estados de interacción y capturas multipantalla.
---
# SKILL 08 — `ui-quality-assurance`

## 1. Nombre y descripción
**Nombre:** `ui-quality-assurance`  
**Descripción:** Verifica de forma automatizada e inspectiva que las interfaces funcionen sin errores de JavaScript, enlaces rotos, solapamientos ni regresiones visuales tras cada cambio.

## 2. Cuándo debe activarse
- Al finalizar la implementación de cualquier pantalla, componente o refactorización.
- Antes de publicar documentación o abrir un Pull Request.

## 3. Requisitos previos
- Servidor HTTP local o ruta de aplicación cargable en Chromium headless / Playwright / Puppeteer.

## 4. Entradas necesarias
- Lista de rutas/vistas a inspeccionar, escenarios E2E obligatorios y viewports de prueba.

## 5. Procedimiento paso a paso
1. Levantar servidor local temporal y conectar un controlador headless (Chromium CDP / Node o Playwright).
2. Escuchar eventos `console.error` y `pageerror` acumulando cero tolerancia a excepciones no capturadas.
3. Ejecutar flujos interactivos reales: filtros, búsqueda, agregado al carrito, envío de pedido, avance de estados, alta y edición en modales, validaciones negativas y reinicio de estado.
4. Medir desbordamiento horizontal, visibilidad de botones clave, tamaños táctiles y contraste en al menos móvil (`320px`, `390px`), tablet (`768px`) y escritorio (`1280px`, `1920px`).
5. Capturar imágenes PNG limpias (desactivando animaciones de entrada solo en modo captura) e inspeccionarlas visualmente para confirmar ausencia de texto cortado o solapado.
6. Documentar los resultados reales obtenidos sin redondear ni inventar métricas.

## 6. Herramientas autorizadas
- Servidor local efímero (`python3 -m http.server` o Node), script QA en Node/Python con Chromium headless, visor de imágenes (`view_file`).

## 7. Resultados esperados
- Script reproducible de verificación (`scripts/qa_verify.*`), informe real de pruebas (`docs/PRUEBAS_INTERFACES.md`) y capturas actualizadas.

## 8. Criterios de validación
- Cero errores `console.error` / `pageerror` en todo el recorrido.
- Cero imágenes rotas (`naturalWidth === 0`).
- Todos los escenarios E2E pasan con resultado verificable en DOM.

## 9. Manejo de errores
- Si una aserción falla, capturar diagnóstico exacto (vista, viewport, selector y valor esperado vs real), corregir el origen y re-ejecutar toda la batería hasta obtener pase limpio.

## 10. Ejemplos reutilizables
- **Asserts de imágenes cargadas:** `Array.from(document.images).filter(img => !img.complete || img.naturalWidth === 0).length === 0`.
