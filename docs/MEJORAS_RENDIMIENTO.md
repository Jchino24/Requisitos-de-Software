# Mejoras de Rendimiento y Optimización — RED PEPPER

Aplicando [`performance-optimizer`](../.agents/skills/performance-optimizer/SKILL.md), se optimizaron los recursos gráficos, el peso de ejecución y el ciclo de renderizado.

---

## 1. Compresión y Dimensionamiento de Fotografías Gastronómicas (WebP)

Todas las fotografías de carta se redimensionaron a un máximo de `640 × 478 px` y se convirtieron a **WebP** (`quality=82, method=6` con Pillow):

| Recurso | Tamaño original (.jpg) | Tamaño optimizado (.webp) | Reducción |
|---|---|---|---|
| `salchipapa.webp` | `815 KB` | `53 KB` | `-93.5 %` |
| `hamburguesa.webp` | `802 KB` | `47 KB` | `-94.1 %` |
| `alitas.webp` | `908 KB` | `62 KB` | `-93.2 %` |
| `refresco.webp` | `735 KB` | `36 KB` | `-95.1 %` |
| **Total 4 fotografías** | **`3,260 KB` (`3.18 MB`)** | **`198 KB`** | **`-93.9 %`** |

Adicionalmente:
- Los logotipos utilizan **SVG vectorial** (`< 1.5 KB` cada variante), nítidos en cualquier densidad de pantalla.
- Las tarjetas incluyen `width="640" height="478"`, `loading="lazy"` y `decoding="async"` para evitar saltos de maquetación (*CLS*).

---

## 2. Arquitectura Ligera y Renderizado

- **Cero dependencias externas en runtime:** sin frameworks pesados ni *bundlers*; scripts cargados con `defer` en [`prototipo/index.html`](../prototipo/index.html).
- **Render aislado por portal:** solo se construye en el DOM la subaplicación activa (`cliente`, `pos`, `cocina`, `admin` o `marca`), reduciendo nodos activos frente a mantener 6 vistas completas simultáneas ocultas en el DOM.
- **Animaciones aceleradas por GPU:** limitadas estrictamente a `transform` y `opacity` en [`base.css`](../prototipo/src/styles/base.css) y [`components.css`](../prototipo/src/styles/components.css).
