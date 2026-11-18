---
name: reusable-component-factory
description: Diseña y mantiene una biblioteca modular de componentes UI reutilizables (botones, entradas, tarjetas, tablas, modales, toasts, estados vacíos) basados en design tokens.
---
# SKILL 05 — `reusable-component-factory`

## 1. Nombre y descripción
**Nombre:** `reusable-component-factory`  
**Descripción:** Extrae patrones de interfaz repetidos en piezas modulares desacopladas, con variantes explícitas, estados completos y clases ligadas exclusivamente a `tokens.css`.

## 2. Cuándo debe activarse
- Al detectar HTML duplicado en botones, formularios, tarjetas, modales o notificaciones.
- Antes de construir nuevas pantallas para evitar proliferación de estilos ad-hoc.

## 3. Requisitos previos
- Tokens definidos en `tokens.css`.
- Convención modular del lenguaje/framework destino (ES modules, React, Vue, etc.).

## 4. Entradas necesarias
- Inventario de elementos UI necesarios (botones, campos, badges, modales, estados vacíos, alertas, tablas).
- Reglas de accesibilidad y estados requeridos (`default`, `hover`, `active`, `focus-visible`, `disabled`, `loading`, `error`).

## 5. Procedimiento paso a paso
1. Inventariar piezas repetidas en el código actual (tarjetas de producto, líneas de tabla, modales de confirmación, formularios, toasts, insignias).
2. Definir una API limpia y mínima por componente (parámetros de entrada, eventos, accesibilidad incorporada como `aria-label` o roles).
3. Implementar estilos en `components.css` consumiendo únicamente variables de `tokens.css`.
4. Implementar constructores o módulos reutilizables en `src/components/` con saneamiento seguro de texto (`escapeHtml`) contra inyección DOM.
5. Reemplazar llamadas bloqueantes nativas (`alert()`, `confirm()`, `prompt()`) por un componente `<Modal>` accesible con gestión de foco.
6. Verificar que cada pantalla consuma los componentes compartidos en lugar de duplicar marcado complejo.

## 6. Herramientas autorizadas
- Creación y edición de módulos JS/CSS (`write_to_file`, `replace_file_content`).

## 7. Resultados esperados
- Directorio `src/components/` con componentes puros documentados y hoja `components.css` consistente.

## 8. Criterios de validación
- Cero usos de `window.prompt()`, `window.confirm()` o `window.alert()` en producción.
- Todos los modales cierran con tecla `Escape`, botón explícito y restauran el foco al disparador.
- Cero texto dinámico insertado en HTML sin escapar (`escapeHtml`).

## 9. Manejo de errores
- Si un componente recibe datos vacíos o nulos, renderizar automáticamente su componente hermano `<EmptyState>` con acción sugerida en lugar de devolver un contenedor vacío o romper el flujo.

## 10. Ejemplos reutilizables
- **Patrón Modal declarativo:** `openFormModal({ title, fields, initialValues, validate, onSubmit })` unifica edición de tarifas, corrección de montos y notas de ajuste en una sola pieza accesible.
