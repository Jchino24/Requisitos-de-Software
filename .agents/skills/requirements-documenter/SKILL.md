---
name: requirements-documenter
description: Elabora matrices trazables que conectan requisitos funcionales y no funcionales con pantallas reales, módulos de código, botones/acciones y criterios de prueba.
---
# SKILL 10 — `requirements-documenter`

## 1. Nombre y descripción
**Nombre:** `requirements-documenter`  
**Descripción:** Documenta de forma precisa y trazable cómo cada requisito funcional y no funcional se materializa en rutas, componentes, controles de usuario y casos de verificación.

## 2. Cuándo debe activarse
- Tras implementar o modificar pantallas y funcionalidades vinculadas a una especificación formal.
- Al auditar el porcentaje real de cobertura entre documento de requisitos y código entregado.

## 3. Requisitos previos
- Especificación de requisitos vigente y código fuente actualizado.

## 4. Entradas necesarias
- Catálogos `RF-*`, `RNF-*` y derivados (`R-*`).
- Mapa de archivos, subaplicaciones, botones e IDs reales del código fuente.

## 5. Procedimiento paso a paso
1. Extraer todos los IDs de requisitos del documento maestro sin omitir los no implementados o dependientes de backend.
2. Inspeccionar el código implementado para identificar archivo, función, ruta UI y control exacto (ej. botón, modal, tabla) que cubre cada requisito.
3. Clasificar cada fila con estado real: **Implementado en frontend**, **Parcial / Simulado local**, o **Pendiente de backend / validación externa**.
4. Vincular cada fila con su evidencia de prueba en `docs/PRUEBAS_INTERFACES.md` o documento LaTeX correspondiente.
5. Mantener consistencia entre la matriz Markdown, el `README.md` y la sección de interfaces del documento formal.

## 6. Herramientas autorizadas
- Lectura cruzada de especificación y código (`view_file`, `grep`), redacción de matrices Markdown/LaTeX.

## 7. Resultados esperados
- Matriz de trazabilidad (`docs/MATRIZ_TRAZABILIDAD.md`) y mapas pantalla-por-pantalla actualizados.

## 8. Criterios de validación
- Ningún archivo, símbolo o botón citado en la matriz es ficticio.
- Se distinguen con transparencia requisitos cumplidos en cliente frente a capacidades que exigen servidor.

## 9. Manejo de errores
- Si un requisito tiene ambigüedad abierta o pregunta de validación pendiente en la especificación, reflejar explícitamente dicha reserva en la columna de observaciones.

## 10. Ejemplos reutilizables
- **Columnas estándar de trazabilidad:** `ID Requisito | Descripción resumida | Subapp / Pantalla | Archivo y símbolo | Control UI / Acción | Estado real | Caso QA`.
