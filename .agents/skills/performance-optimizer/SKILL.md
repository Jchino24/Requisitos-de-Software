---
name: performance-optimizer
description: Optimiza imágenes (conversión WebP y dimensiones), carga diferida, peso CSS/JS y eficiencia de renderizado DOM manteniendo fluidez en hardware modesto.
---
# SKILL 09 — `performance-optimizer`

## 1. Nombre y descripción
**Nombre:** `performance-optimizer`  
**Descripción:** Reduce el peso de recursos estáticos, elimina re-renderizados costosos y optimiza carga inicial e interacciones usando únicamente propiedades aceleradas por GPU.

## 2. Cuándo debe activarse
- Al incorporar fotografías o ilustraciones en una aplicación web.
- Cuando un proyecto crece en CSS/JS o requiere respuesta ágil en tabletas/celulares de gama media.

## 3. Requisitos previos
- Herramientas de procesamiento de imagen (`Pillow`, `cwebp`, `convert`) y navegador para medir tamaño de carga.

## 4. Entradas necesarias
- Carpeta de imágenes/recursos estáticos y código fuente CSS/JS.

## 5. Procedimiento paso a paso
1. Auditar peso actual de imágenes, fuentes y hojas de estilo.
2. Convertir fotografías pesadas (PNG/JPG) a **WebP** optimizado redimensionado al tamaño máximo real de despliegue (ej. `<= 800px` para tarjetas y modales), preservando copias maestras si existen.
3. Añadir `width`, `height`, `loading="lazy"` (en elementos bajo el pliegue) y `decoding="async"` en etiquetas `<img>`.
4. Limitar animaciones exclusivamente a `transform` y `opacity` evitando animar `width`, `height`, `top` o `left`.
5. Modularizar scripts y evitar dependencias pesadas externas cuando HTML/CSS/JS nativo resuelve el requerimiento con precisión.
6. Medir peso total de transferencia y tiempos de carga/render reales en Chromium.

## 6. Herramientas autorizadas
- Python `Pillow` / CLI de compresión de imágenes, herramientas de inspección de archivos y navegador headless.

## 7. Resultados esperados
- Activos WebP ligeros (`< 80 KB` por foto de carta), atributos explícitos de imagen y código CSS/JS depurado sin código muerto.

## 8. Criterios de validación
- Reducción medible en KB respecto a activos originales sin pérdida visual perceptible.
- Cero animaciones fuera de `transform`/`opacity`.
- Cero imágenes sin `width`/`height` o sin `alt`.

## 9. Manejo de errores
- Si el entorno no tiene `cwebp`, usar Python `Pillow` con `format="WEBP", quality=82, method=6` verificando soporte previo.

## 10. Ejemplos reutilizables
- **Conversión por lotes en Python:** Redimensionar conservando relación de aspecto (`ImageOps.exif_transpose` + `thumbnail`) y exportar `.webp` registrando peso antes/después en bytes.
