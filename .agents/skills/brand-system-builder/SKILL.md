---
name: brand-system-builder
description: Construye una guía de identidad visual, paleta complementaria con contraste WCAG, sistema centralizado de design tokens CSS y normas de uso de logotipo y tipografía a partir de una configuración de marca.
---
# SKILL 02 — `brand-system-builder`

## 1. Nombre y descripción
**Nombre:** `brand-system-builder`  
**Descripción:** Transforma los colores oficiales, logotipo y personalidad de cualquier marca en un sistema técnico completo de tokens reutilizables (`tokens.css`) y una guía normativa de aplicación visual.

## 2. Cuándo debe activarse
- Cuando un proyecto carece de tokens centralizados o usa colores arbitrarios dispersos.
- Al alinear una aplicación técnica genérica con una identidad de marca definida por el cliente.
- Al requerir documentación formal de branding aplicable tanto a vistas comerciales como operativas.

## 3. Requisitos previos
- Definición de colores principales de marca, nombre comercial, lema/descripción y logotipo oficial (o especificación de creación si no existe archivo maestro).

## 4. Entradas necesarias
- Archivo o diccionario de identidad de marca (colores HEX base, personalidad, público objetivo).
- Activos gráficos originales (logo vectorial/raster, fotografías si existen).
- Requisitos de densidad (ej. pantallas comerciales vs tableros operativos).

## 5. Procedimiento paso a paso
1. Inspeccionar el logotipo y los activos originales sin redibujar ni alterar texto/símbolos maestros si fueron provistos.
2. Evaluar los colores oficiales mediante fórmula de luminancia relativa WCAG 2.2 para determinar combinaciones seguras de texto sobre fondo (`>= 4.5:1` texto normal, `>= 3:1` texto grande y controles).
3. Derivar neutros cálidos o fríos, tintes suaves de superficie, estados semánticos (éxito, advertencia, error, info) y bordes estructurales coherentes con la marca.
4. Definir la escala tipográfica (títulos, cuerpo, etiquetas y familia monoespaciada tabular para cifras), espaciados, radios de borde, sombras discretas, foco visible y breakpoints.
5. Escribir el archivo maestro de variables (`tokens.css`) y sincronizar cualquier archivo de sistema de diseño existente (ej. `DESIGN.md`).
6. Redactar la guía de marca completa cubriendo usos permitidos/prohibidos, dosificación cromática y ejemplos reales de aplicación por módulo.

## 6. Herramientas autorizadas
- Lectura de activos (`view_file`), cálculo de contraste (Python/Node), edición de CSS/Markdown (`write_to_file`, `replace_file_content`).

## 7. Resultados esperados
- Archivo centralizado de design tokens (`styles/tokens.css`).
- Guía de identidad visual estructurada en `docs/branding/`.
- Actualización de `DESIGN.md` si el proyecto utiliza herramientas de diseño semántico.

## 8. Criterios de validación
- Ningún componente usa valores HEX arbitrarios fuera de `tokens.css`.
- Todas las parejas texto/fondo declaradas como válidas superan el ratio WCAG 2.2 AA (`4.5:1` / `3:1`).
- Los colores oficiales no se usan simultáneamente saturando cada tarjeta; predominan neutros limpios con acentos estratégicos.

## 9. Manejo de errores
- Si un color oficial de marca no alcanza `4.5:1` con texto blanco en texto pequeño, crear un token derivado oscuro (ej. `--brand-accent-ink`) para texto y reservar el color puro para botones grandes, insignias con texto oscuro o bordes destacados.
- Si no se adjuntó logotipo archivo fuente, documentar explícitamente la ausencia y proveer un lockup SVG parametrizado fácil de reemplazar.

## 10. Ejemplos reutilizables
- **Regla de dosificación 60-30-10:** 60–75 % fondos neutros legibles, 15–25 % superficies y texto estructural, 10–15 % colores de identidad y acento para CTAs y estados activos.
