---
name: feature-implementation
description: Transforma requisitos funcionales y reglas de negocio en flujos reales de interfaz, validaciones por campo, persistencia de estado y retroalimentación verificable.
---
# SKILL 07 — `feature-implementation`

## 1. Nombre y descripción
**Nombre:** `feature-implementation`  
**Descripción:** Traduce especificaciones funcionales y reglas de negocio en implementaciones reales de dominio, formularios validados, transiciones de estado y acciones trazables.

## 2. Cuándo debe activarse
- Al implementar nuevas funcionalidades desde un catálogo de requisitos (`RF-*`, `R-*`).
- Al convertir prototipos estáticos o formularios incompletos en flujos interactivos reales.

## 3. Requisitos previos
- Catálogo de requisitos y reglas de negocio verificadas.
- Capa de estado/persistencia definida (`store.js` o API real).

## 4. Entradas necesarias
- Requisitos objetivo, validaciones de entrada, reglas de permisos/estado y datos semilla autorizados.

## 5. Procedimiento paso a paso
1. Mapear cada requisito a una unidad de estado, una acción pura en el gestor de estado (`core/actions`) y un disparador UI claro.
2. Implementar validaciones explícitas con mensajes de causa junto al campo afectado y bloqueo de envío ante datos inválidos.
3. Aplicar invariantes del dominio en la capa de lógica (ej. máquinas de estados autorizadas, inmutabilidad tras cierre, historial preservado ante cambios de tarifa).
4. Registrar cada mutación crítica en bitácora de auditoría con sello temporal, actor y detalle exacto.
5. Distinguir visual y documentalmente las operaciones ejecutadas localmente de las integraciones que dependen de un servicio backend futuro.

## 6. Herramientas autorizadas
- Edición de módulos de lógica de negocio y UI (`write_to_file`, `replace_file_content`).

## 7. Resultados esperados
- Módulos de dominio y UI con acciones completas, manejo de errores en línea, auditoría automática y estado sincronizado.

## 8. Criterios de validación
- Cada requisito implementado responde end-to-end en navegador (acción -> cambio de estado -> reflejo en vistas conectadas -> persistencia tras recarga).
- Ningún campo numérico acepta negativos o valores vacíos en registros económicos.

## 9. Manejo de errores
- Ante violación de regla de negocio (ej. producto sin stock o periodo cerrado), abortar mutación de estado, mostrar banner/toast explicativo sin perder lo escrito por el usuario cuando corresponda.

## 10. Ejemplos reutilizables
- **Guarda de máquina de estados:** Diccionario `ALLOWED_TRANSITIONS[currentState].includes(nextState)` antes de mutar cualquier orden o documento.
