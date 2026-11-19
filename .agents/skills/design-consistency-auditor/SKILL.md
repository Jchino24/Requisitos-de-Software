---
name: design-consistency-auditor
description: Detecta inconsistencias visuales en código y pantallas (colores fuera de tokens, fuentes dispares, radios heterogéneos, sombras excesivas y duplicidad informativa).
---
# SKILL 11 — `design-consistency-auditor`

## 1. Nombre y descripción
**Nombre:** `design-consistency-auditor`  
**Descripción:** Audita hojas de estilo, marcado HTML y renders reales para detectar desviaciones frente al sistema de diseño y tokens aprobados.

## 2. Cuándo debe activarse
- Tras integrar múltiples subaplicaciones o vistas nuevas.
- Antes de cerrar entregas visuales o actualizar guías de marca.

## 3. Requisitos previos
- Tokens maestros (`tokens.css`) y guía de diseño (`DESIGN.md` o guía de marca) definidos.

## 4. Entradas necesarias
- Archivos `.css`, `.html`, `.js` de la interfaz y reglas de estilo objetivo.

## 5. Procedimiento paso a paso
1. Escanear CSS y HTML buscando valores HEX/RGB codificados en duro fuera de `tokens.css`.
2. Verificar uso uniforme de familias tipográficas, escalas de tamaño, radios (`--radius-*`), espaciados y elevación.
3. Confirmar en vista cliente que las piezas comerciales y de identidad no se mezclen con tablas administrativas densas ni elementos genéricos contradictorios.
4. Revisar que el logotipo respete zona de protección, proporción original y contraste respecto al fondo en todas las cabeceras y pie de página.
5. Verificar límite de densidad por vista: sin tarjetas redundantes ni barras sobrecargadas.
6. Corregir hallazgos o emitir reporte claro con archivo y línea exacta.

## 6. Herramientas autorizadas
- Búsqueda estática (`grep`), inspección de estilos computados en navegador y revisión visual de capturas.

## 7. Resultados esperados
- Auditoría limpia sin valores arbitrarios ni componentes divergentes entre subaplicaciones.

## 8. Criterios de validación
- Cero colores HEX sueltos en archivos de componentes/vistas fuera de `tokens.css` (salvo excepciones documentadas como SVG maestro de logo).
- Consistencia visual de botones, inputs, modales y cabeceras entre portales.

## 9. Manejo de errores
- Si una librería o vista heredada introduce estilos inline conflictivos, mover esas reglas a clases utilitarias o de componente basadas en tokens.

## 10. Ejemplos reutilizables
- **Chequeo rápido CSS:** Buscar `#[0-9a-fA-F]{3,8}` fuera del archivo `tokens.css` para erradicar colores dispersos.
