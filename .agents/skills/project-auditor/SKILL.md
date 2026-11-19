---
name: project-auditor
description: Audita la estructura completa de un proyecto de software (árbol, stack, rutas, servicios, duplicidades, riesgos y brechas funcionales) antes de refactorizar o ampliar módulos.
---
# SKILL 01 — `project-auditor`

## 1. Nombre y descripción
**Nombre:** `project-auditor`  
**Descripción:** Analiza sistemáticamente un repositorio para levantar un inventario verificable de tecnologías, rutas, módulos frontend/backend, integraciones, recursos gráficos y deuda técnica antes de escribir código.

## 2. Cuándo debe activarse
- Al iniciar una intervención en un código base existente.
- Antes de proponer una refactorización arquitectónica o expansión de funcionalidades.
- Cuando se desconoce qué partes existen realmente frente a lo que requiere desarrollo adicional.

## 3. Requisitos previos
- Acceso de lectura al árbol de archivos del repositorio.
- Herramientas básicas de línea de comandos (`find`, `git`, `ls`) y visor de archivos.

## 4. Entradas necesarias
- Ruta raíz del repositorio o workspace.
- Opcional: archivo de requisitos, diseño o prompt objetivo para contrastar brechas.

## 5. Procedimiento paso a paso
1. Listar el árbol de directorios excluyendo `.git/`, `node_modules/` y artefactos compilados pesados.
2. Inspeccionar manifiestos (`package.json`, `Makefile`, `pyproject.toml`, `requirements.txt`, `.env.example`, `README.md`) para identificar framework, versiones y comandos de ejecución.
3. Localizar rutas, vistas, componentes UI, servicios, estado global y persistencia real vs simulada.
4. Revisar instrucciones locales existentes (`AGENTS.md`, `CLAUDE.md`, `.stitch/DESIGN.md`, `.agents/skills/`).
5. Inventariar activos de marca (logotipos, fuentes, imágenes, hojas de estilo) verificando integridad y formato.
6. Detectar código muerto, componentes duplicados, antipatrones de UX (mezcla de roles, `prompt()`/`alert()`, sobrecarga visual) y deuda técnica.
7. Emitir un informe estructurado diferenciando explícitamente: **existente operativo**, **implementable en la capa actual** y **dependiente de backend o insumo externo**.

## 6. Herramientas autorizadas
- Exploración de archivos (`view_file`, `find`, `grep`, `git status`, `git log`).
- Comandos de diagnóstico de solo lectura sobre el toolchain (`which`, versiones).

## 7. Resultados esperados
- Documento de auditoría inicial (ej. `docs/AUDITORIA_INICIAL.md`) con inventario de stack, rutas, funciones críticas a preservar, hallazgos y plan de trabajo segmentado.

## 8. Criterios de validación
- Cada afirmación del informe cita rutas de archivo o comandos reales verificados.
- No se asumen ni inventan endpoints, bases de datos, credenciales, precios o activos inexistentes.
- Se enumeran explícitamente las funciones críticas que no deben romperse durante la migración.

## 9. Manejo de errores
- Si faltan manifiestos de dependencias o variables de entorno, registrar la ausencia como dato de auditoría sin inventar configuraciones.
- Si existen múltiples remotos o carpetas paralelas, documentar su relación antes de elegir el directorio de trabajo.

## 10. Ejemplos reutilizables
- **Auditoría rápida de monolito web:** Detectar si `index.html` + `app.js` mezclan vistas públicas e internas y proponer separación por subaplicaciones (`src/apps/`), núcleo (`src/core/`) y librería visual (`src/components/`).
