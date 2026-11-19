---
name: refactor-and-migration
description: Refactoriza código monolítico hacia módulos desacoplados por capas (núcleo, componentes, subaplicaciones) conservando compatibilidad de datos, URLs y flujos críticos.
---
# SKILL 12 — `refactor-and-migration`

## 1. Nombre y descripción
**Nombre:** `refactor-and-migration`  
**Descripción:** Divide aplicaciones acopladas en módulos mantenibles mediante pasos seguros e incrementales que preservan el estado, parámetros de enlace existentes y reglas de negocio.

## 2. Cuándo debe activarse
- Cuando un proyecto concentra HTML, estilos y cientos/miles de líneas JS en un solo archivo.
- Al escalar un prototipo hacia una plataforma multi-portal sin romper funcionalidades previas ni enlaces documentados.

## 3. Requisitos previos
- Auditoría previa (`project-auditor`) con listado de invariantes y rutas que deben seguir funcionando.

## 4. Entradas necesarias
- Código monolítico actual y mapa objetivo de carpetas (`core/`, `components/`, `apps/`, `styles/`).
- Lista de query params, claves `localStorage` o IDs heredados que requieren retrocompatibilidad.

## 5. Procedimiento paso a paso
1. Extraer primero constantes, estado inicial, migración segura de `localStorage` y utilidades puras a `core/` sin cambiar el comportamiento externo.
2. Separar reglas de negocio y cálculos matemáticos en funciones puras verificables (`core/domain.js` o similar).
3. Migrar componentes compartidos (`components/`) reemplazando patrones imperativos obsoletos (`prompt`/`alert`, concatenación insegura).
4. Extraer cada subaplicación a su propio módulo (`apps/<nombre>.js`) con ciclo de render limpio y delegación de eventos (eliminando manejadores globales `onclick="..."` frágiles cuando sea viable).
5. Mantener compatibilidad de parámetros de URL previos (ej. `?view=cocina` redirigiendo automáticamente a la vista equivalente nueva).
6. Validar con batería QA completa antes de retirar archivos o funciones legadas.

## 6. Herramientas autorizadas
- Edición modular de archivos, pruebas en navegador y verificación Git diff por capas.

## 7. Resultados esperados
- Base de código organizada en módulos pequeños y cohesivos, con punto de entrada limpio y compatibilidad comprobada.

## 8. Criterios de validación
- Todas las URLs o parámetros previos (`?view=...`, `?capture=1`) continúan resolviendo la vista correcta.
- El estado guardado previamente en `localStorage` se hidrata sin excepciones ni pérdida de estructura.
- Cero regresiones en flujos críticos listados en la auditoría inicial.

## 9. Manejo de errores
- Si un estado antiguo en `localStorage` carece de nuevas propiedades, fusionar recursivamente con `INITIAL_STATE` conservando valores por defecto válidos.

## 10. Ejemplos reutilizables
- **Adaptador de rutas heredadas:** Mapa `LEGACY_VIEW_MAP = { pos: { portal: "operaciones", tab: "pos" }, ... }` leído al iniciar el router para no romper enlaces antiguos ni capturas automatizadas.
