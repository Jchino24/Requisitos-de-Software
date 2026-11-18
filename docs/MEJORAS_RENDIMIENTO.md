# Mejoras de Rendimiento y Optimización — RED PEPPER

Aplicando [`performance-optimizer`](../.agents/skills/performance-optimizer/SKILL.md), se optimizaron los recursos gráficos, el peso de ejecución y el ciclo de renderizado.

---

## 1. Compresión y Dimensionamiento de Fotografías Gastronómicas (WebP)

Todas las fotografías de carta se ajustaron a `640 × 480 px` (relación `4:3`) en formato **WebP** (`quality=82, method=6` con Pillow):

| Recurso | Origen | Tamaño optimizado (.webp) | Dimensiones |
|---|---|---|---|
| `salchipapa.webp` | Imagen referencial oficial | `31.5 KB` | `640 × 480` |
| `salchipapa-especial.webp` | Imagen referencial oficial | `32.6 KB` | `640 × 480` |
| `hamburguesa.webp` | Imagen referencial oficial | `30.7 KB` | `640 × 480` |
| `sanguche-pollo.webp` | Imagen referencial oficial | `38.0 KB` | `640 × 480` |
| `alitas.webp` | Activo complementario | `62.5 KB` | `640 × 478` |
| `refresco.webp` | Activo complementario | `36.9 KB` | `640 × 478` |
| **Total 6 fotografías** | **Carta completa** | **`232.2 KB`** | `4:3` constante |

Adicionalmente:
- El logotipo oficial original fue vectorizado a trazados Bézier cúbicos en **4 variantes SVG** (`~39 KB` cada una: sello oficial `logo-red-pepper-badge.svg`, isotipo circular `logo-red-pepper-mark.svg`, y lockups `logo-red-pepper.svg` / `logo-red-pepper-dark.svg`), escalables sin pixelación desde favicon hasta gran formato.
- Las tarjetas incluyen `width="640" height="478"`, `loading="lazy"` y `decoding="async"` para evitar saltos de maquetación (*CLS*).

---

## 2. Arquitectura Ligera y Renderizado

- **Cero dependencias externas en runtime:** sin frameworks pesados ni *bundlers*; scripts cargados con `defer` en [`prototipo/index.html`](../prototipo/index.html).
- **Render aislado por portal:** solo se construye en el DOM la subaplicación activa (`cliente`, `pos`, `cocina`, `admin` o `marca`), reduciendo nodos activos frente a mantener 6 vistas completas simultáneas ocultas en el DOM.
- **Animaciones aceleradas por GPU:** limitadas estrictamente a `transform` y `opacity` en [`base.css`](../prototipo/src/styles/base.css) y [`components.css`](../prototipo/src/styles/components.css).
