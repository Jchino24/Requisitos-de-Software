---
name: ux-information-architect
description: Organiza aplicaciones complejas en subaplicaciones, menús de 4 a 5 elementos, jerarquías claras y flujos de revelación progresiva evitando sobrecarga cognitiva y duplicidad visual.
---
# SKILL 03 — `ux-information-architect`

## 1. Nombre y descripción
**Nombre:** `ux-information-architect`  
**Descripción:** Diseña la arquitectura de información, separación por roles/experiencias (pública vs interna), taxonomía de navegación y densidad de pantalla para mantener interfaces simples, rápidas y comprensibles.

## 2. Cuándo debe activarse
- Cuando una interfaz mezcla vistas públicas de cliente con módulos internos administrativos.
- Cuando existen barras de navegación saturadas (>6–8 enlaces), tablas duplicadas o bloques con exceso de texto simultáneo.
- Al ampliar un producto con nuevas pantallas sin degradar la comodidad visual.

## 3. Requisitos previos
- Inventario de actores/roles, tareas principales por rol y pantallas o requisitos funcionales existentes.

## 4. Entradas necesarias
- Lista de usuarios objetivo (cliente final, operador en campo, supervisor/administrador).
- Catálogo de pantallas/flujos actuales y propuestos.

## 5. Procedimiento paso a paso
1. Separar estrictamente los portales según contexto de uso: **Experiencia Pública** (sin herramientas internas expuestas) vs **Portales Internos / Operativos / Gerenciales**.
2. Agrupar las tareas de cada portal bajo una navegación principal de **4 a 5 elementos** (límite estricto: 6 habituales; hasta 10 solo con justificación funcional demostrada).
3. Eliminar cualquier bloque redundante: si una métrica o listado ya vive en su módulo natural, no repetirlo en tarjetas paralelas de relleno.
4. Aplicar **revelación progresiva**: mostrar en primer nivel solo decisión e información accionable; mover detalles técnicos, desgloses secundarios, bitácoras extensas y reglas a `<details>`, pestañas secundarias o modales bajo demanda.
5. Garantizar estados vacíos orientadores, confirmación clara tras cada acción y acceso de respaldo discreto entre entornos autorizados.

## 6. Herramientas autorizadas
- Auditoría documental, diseño de rutas/navegación en código HTML/JS y verificación visual en navegador.

## 7. Resultados esperados
- Mapa de arquitectura de información (portales, rutas, menús y límites de densidad).
- Estructura HTML/JS separada limpiamente por subaplicación.

## 8. Criterios de validación
- La vista pública no expone enlaces de contabilidad, auditoría interna ni guías de diseño corporativo en su barra principal.
- Ningún grupo de navegación principal o barra de acciones primaria supera los 5–6 ítems sin agrupación jerárquica.
- Cero información duplicada entre paneles adyacentes de la misma pantalla.

## 9. Manejo de errores
- Si un nuevo requisito añade una octava opción al menú raíz, crear una subsección coherente dentro de un módulo existente o un selector contextual secundario en lugar de expandir la barra superior.

## 10. Ejemplos reutilizables
- **Patrón de portal dual:** Barra pública de 4 destinos (`Catálogo`, `Carrito`, `Seguimiento`, `Local`) + acceso discreto "Personal" fuera de la barra principal que autentica/conmuta al portal interno con sus propias sub-rutas.
