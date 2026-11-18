---
name: RED PEPPER — Sánguches, Salchipapas & Más
colors:
  brand-red: '#FF3131'
  brand-red-cta: '#D91B1B'
  brand-orange: '#F64301'
  brand-green: '#1F6636'
  background: '#FAF8F5'
  surface: '#FFFFFF'
  surface-subtle: '#F4F1EC'
  surface-dark: '#1C1917'
  on-surface: '#1C1917'
  on-surface-variant: '#57534E'
  outline-variant: '#E4DFD6'
  status-ok-bg: '#ECF7EF'
  status-ok-ink: '#1F6636'
  status-warn-bg: '#FEF3C7'
  status-warn-ink: '#92400E'
  status-danger-bg: '#FEF2F2'
  status-danger-ink: '#B91C1C'
typography:
  display-lg:
    fontFamily: Source Sans 3
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Source Sans 3
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: -0.015em
  body-base:
    fontFamily: Source Sans 3
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letter-spacing: '0'
  mono-tabular:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letter-spacing: -0.01em
---

# Design System: RED PEPPER — Sánguches, Salchipapas & Más

## 1. Visual Theme & Atmosphere
Identidad gastronómica vibrante, apetitosa y cercana para comida rápida al instante (*sánguches, hamburguesas y salchipapas*), calibrada con sobriedad operativa cuando la marca se despliega en mostrador POS, cocina KDS o gerencia NIIF 18.

El lienzo **Alabastro Cálido** (`#FAF8F5`) evita la frialdad tecnológica genérica y sirve de escenario limpio para la fotografía real de producto y el trío oficial de marca: **Rojo Brillante** (`#FF3131`), **Naranja Vivo** (`#F64301`) y **Verde Oscuro** (`#1F6636`), dosificados con contraste verificado WCAG 2.2 AA.

## 2. Color Palette & Roles
### Colores Oficiales de Marca
- **Rojo Brillante (`#FF3131`)** — Identidad principal de marca, emblema y acento visual grande. Para texto blanco en botones medianos/pequeños se emplea su variante accesible **`#D91B1B`** (`5.09:1`) y en texto sobre blanco **`#B91C1C`** (`6.47:1`).
- **Naranja Vivo (`#F64301`)** — Etiquetas promocionales, destacados de canal y calor gastronómico (`#1C1917` encima = `4.77:1`; `#C23500` para texto sobre blanco = `5.52:1`).
- **Verde Oscuro (`#1F6636`)** — Color secundario de frescura, disponibilidad activa, jornadas abiertas, estados *Listo* y elementos de identidad (`6.97:1` con blanco y sobre blanco).

### Neutros y Superficies
- **Lienzo Alabastro (`#FAF8F5`)**, **Superficie Pura (`#FFFFFF`)**, **Piedra Suave (`#F4F1EC`)**
- **Carbón Cálido (`#1C1917`)** como tinta principal (nunca `#000000`), **Grafito Cálido (`#57534E`)** como tinta secundaria y **Borde Sutil (`#E4DFD6`)**.

## 3. Typography Rules
- **UI y Marca:** `Source Sans 3` (respaldo limpio `Inter`, `Segoe UI`, `system-ui`) para legibilidad inmediata en carta móvil y tableros administrativos.
- **Cifras y Códigos:** `JetBrains Mono` con `font-variant-numeric: tabular-nums` en precios (`S/ 8.00`), totales, prorrateos P-14, importes NIIF 18, RUCs y comandas (`CMD-0845`).

## 4. Component Stylings
- **Separación de portales:** La experiencia pública de Cliente tiene barra superior/inferior propia (`4` destinos) sin mezclar módulos internos de POS, Cocina o Contabilidad.
- **Botones táctiles:** Mínimo `44px` en toda la interfaz y `48px` en controles del Mostrador POS (`RNF-05`).
- **Modales accesibles:** Reemplazan todo `prompt()`/`alert()` nativo con captura de foco, cierre por `Escape` y validación en línea.

## 5. Layout Principles
- Contenedor `1320px` centrado, CSS Grid con `min-width: 0` en hijos para cero scroll horizontal desde `320px` hasta `1920px+`.
- Límite de `4` a `5` elementos por barra de navegación y revelación progresiva en detalles secundarios.

## 6. Motion & Anti-Patterns
- Movimiento exclusivo sobre `transform` y `opacity` (`220ms cubic-bezier(0.22, 1, 0.36, 1)`), respetando `prefers-reduced-motion` y `?capture=1`.
- Prohibido saturar un mismo componente con los 3 colores fuertes a la vez, colocar texto blanco pequeño sobre `#FF3131`/`#F64301`, o inventar métricas falsas.
