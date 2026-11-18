---
name: RedPepper ERP
colors:
  surface: '#faf8f5'
  surface-dim: '#ece8e1'
  surface-bright: '#ffffff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f1ec'
  surface-container: '#eeeae3'
  surface-container-high: '#e5e0d7'
  surface-container-highest: '#dbd5ca'
  on-surface: '#18181b'
  on-surface-variant: '#52525b'
  inverse-surface: '#27272a'
  inverse-on-surface: '#faf8f5'
  outline: '#a1a1aa'
  outline-variant: '#e4e2dd'
  surface-tint: '#c22b22'
  primary: '#c22b22'
  on-primary: '#ffffff'
  primary-container: '#fef2f2'
  on-primary-container: '#991b1b'
  secondary: '#27272a'
  on-secondary: '#faf8f5'
  secondary-container: '#f4f1ec'
  on-secondary-container: '#3f3f46'
  error: '#b91c1c'
  on-error: '#ffffff'
  error-container: '#fee2e2'
  on-error-container: '#7f1d1d'
  background: '#faf8f5'
  on-background: '#18181b'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 30px
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 22px
    letterSpacing: -0.015em
  body-base:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 21px
    letterSpacing: '0'
  mono-tabular:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: -0.01em
---

# Design System: RedPepper ERP & Operaciones

## 1. Visual Theme & Atmosphere
Una estética culinaria-editorial sobria y de alta precisión operativa: fondo **Alabastro Cálido** (`#FAF8F5`) combinado con superficies limpias de papel (`#FFFFFF`) y tinta **Carbón Zinc-950** (`#18181B`) que garantiza legibilidad inmediata tanto en pantallas táctiles de mostrador y cocina como en impresiones A4 del documento de requisitos.

La densidad se calibra según el rol: aireada y asimétrica para la carta del cliente (densidad 4/10), táctil y directa en el terminal de mostrador y monitor de cocina KDS (densidad 6/10), y de alta precisión numérica con tipografía monoespaciada tabular en los paneles de margen, prorrateo P-14 y cierre contable NIIF 18 (densidad 8/10).

## 2. Color Palette & Roles
### Base Neutral (sin negro puro)
- **Alabastro Cálido** (`#FAF8F5`) — Fondo principal de lienzo y descanso visual.
- **Blanco Papel** (`#FFFFFF`) — Contenedores elevados, tarjetas de comandas y paneles de datos.
- **Piedra Suave** (`#F4F1EC`) — Superficies secundarias, encabezados de tabla y columnas KDS.
- **Carbón Zinc-950** (`#18181B`) — Tinta principal, títulos y cifras clave (nunca `#000000`).
- **Grafito Medio** (`#52525B`) — Etiquetas descriptivas, metadatos y subtítulos.
- **Línea Sutil** (`#E4E2DD`) — Divisores estructurales de 1 px sin sombras agresivas.

### Acento Único (< 80 % saturación)
- **Carmesí Brasas** (`#C22B22`) — Único color de acento para llamadas a la acción primarias, pestaña activa y resultado de margen bruto diario. Hover en `#A3221A`.

### Estados Funcionales
- **Verde Salvia** (`#15803D` sobre `#ECFDF5`) — Disponible, jornada abierta, regla vigente, comanda lista.
- **Ámbar Tostado** (`#B45309` sobre `#FEF3C7`) — En preparación, pendiente de autorización de Jerry.
- **Carmesí Alerta** (`#B91C1C` sobre `#FEE2E2`) — Producto agotado bloqueado, periodo cerrado, feriado excluido del prorrateo.

## 3. Typography Rules
- **Sans-Serif de Marca y UI:** `Plus Jakarta Sans` (con respaldo `Geist`, `Satoshi`, `system-ui`) — tracking ajustado en títulos (`-0.025em`) y lectura cómoda en cuerpo (`14px`, máximo `65ch`).
- **Monoespaciada Tabular:** `JetBrains Mono` — obligatoria para precios (`S/ 8.00`), totales de caja, cuotas de prorrateo, importes NIIF 18, hashes SHA-256, RUCs y códigos de comanda (`CMD-0845`).
- **Prohibiciones:** `Inter`, fuentes serif genéricas y `LABEL // YEAR` quedan explícitamente prohibidos.

## 4. Component Stylings
- **Botones:** Planos y táctiles, sin brillos exteriores (`box-shadow` de neón prohibido). Transición tipo resorte (`cubic-bezier(0.22, 1, 0.36, 1)`) y retroalimentación de empuje (`translateY(1px)` al presionar). Mínimo `44px` de altura en toda la interfaz y `48px` en controles táctiles del POS (`RNF-05`).
- **Tarjetas y Divisores:** Bordes de `1px` en `#E4E2DD` con esquinas suavemente redondeadas (`10px`). En vistas densas (cascada NIIF 18 y tablas de auditoría), priorizar divisores horizontales en lugar de tarjetas anidadas.
- **Entradas de Formulario:** Etiqueta fija sobre el campo, foco limpio en `#C22B22` sin etiquetas flotantes ni bordes luminosos de colores arbitrarios.

## 5. Layout Principles
- **Contenedor:** Ancho máximo `1400px` centrado con CSS Grid responsivo (nunca cálculos porcentuales con `calc()` en flexbox).
- **Asimetría en Vista Cliente:** Destacar la propuesta operativa (preparación al instante F-07) junto a la grilla de productos y panel fijo derecho de pedido + seguimiento en vivo, evitando hileras simétricas genéricas de 3 tarjetas promocionales.
- **Colapso Móvil:** Por debajo de `768px`, todas las grillas colapsan a una sola columna sin desbordamiento horizontal.

## 6. Motion & Anti-Patterns
- **Movimiento:** Exclusivamente sobre `transform` y `opacity` (`220ms cubic-bezier(0.22, 1, 0.36, 1)`), con entrada escalonada sutil al cambiar de vista y pulso discreto de estado en la insignia de jornada activa.
- **Reglas Prohibidas (Stitch Taste):** Cero emojis en UI, cero `Inter`, cero negro puro `#000000`, cero acentos morados sobre fondo oscuro, cero sombras neón y cero datos métricos ficticios de SLA/latencia no respaldados por requisitos.
