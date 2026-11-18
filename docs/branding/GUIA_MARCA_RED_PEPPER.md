# Guía Corporativa de Marca — RED PEPPER

**Razón comercial:** RED PEPPER  
**Descriptor oficial:** *Sánguches, Salchipapas & Más*  
**Vigencia:** Versión 3.0 (2026-11-18)  
**Archivo de tokens asociado:** [`prototipo/src/styles/tokens.css`](../../prototipo/src/styles/tokens.css) · [`.stitch/DESIGN.md`](../../.stitch/DESIGN.md)

---

## 1. Historia, Esencia y Propósito de Marca
**RED PEPPER** nace como un negocio ágil de comida rápida especializada en preparación al instante (*salchipapas, hamburguesas, sánguches y refrescos naturales*). Su promesa operativa —documentada en los levantamientos del negocio (`EV-OBS-01`, `EV-ENT-01`)— consiste en servir comida recién preparada sin precocidos, manteniendo el ritmo de mostrador y la rentabilidad controlada día a día.

## 2. Personalidad y Tono Visual
La marca debe transmitir en cada pantalla:
- **Enérgica y apetitosa:** protagonismo de fotografía gastronómica real y acentos cálidos.
- **Moderna, juvenil y cercana:** lenguaje directo en español natural sin jerga contable para el cliente.
- **Profesional y sobria en operaciones:** cuando la identidad pasa a Cocina, Mostrador POS o Contabilidad NIIF 18, la energía cromática se dosifica sobre neutros cálidos para evitar fatiga visual en turnos completos.
- **No tecnológica genérica:** evitar degradados neón, tonos violetas o estéticas frías de *software SaaS* estándar.

## 3. Logotipo Oficial Vectorizado y Variantes
> **Origen del activo:** Logotipo original oficial de **RED PEPPER** provisto por el negocio, vectorizado fielmente en formato SVG preservando su composición circular sobre fondo verde (`#1F6636`), aro blanco perimetral, rotulación apilada en rojo brillante (`#FF3131`) con contorno blanco tipo *sticker* y el descriptor tipográfico **`SÁNGUCHES - SALCHIPAPAS & MÁS`**.

| Variante | Archivo | Uso recomendado |
|---|---|---|
| Sello oficial original (cuadrado) | [`logo-red-pepper-badge.svg`](../../prototipo/assets/logo-red-pepper-badge.svg) | Vista *El Local*, tarjetas institucionales, impresiones y visor de marca (`viewBox="0 0 500 500"`). |
| Isotipo circular compacto | [`logo-red-pepper-mark.svg`](../../prototipo/assets/logo-red-pepper-mark.svg) | Favicon, cabecera móvil (`320px`) y selector compacto. |
| Lockup horizontal (claro) | [`logo-red-pepper.svg`](../../prototipo/assets/logo-red-pepper.svg) | Sello circular oficial + rotulación legible en cabeceras web (`44px`) sobre `#FFFFFF` / `#FAF8F5`. |
| Lockup horizontal (oscuro) | [`logo-red-pepper-dark.svg`](../../prototipo/assets/logo-red-pepper-dark.svg) | Fondos carbón `#1C1917`, pie de página o barras oscuras operativas. |

## 4. Zona de Protección y Tamaños Mínimos
- **Zona de seguridad:** mínimo el equivalente al ancho del bloque rojo del isotipo (`16 px` en web) libre alrededor en los cuatro lados.
- **Tamaño mínimo web:** `156 px` de ancho para el lockup con descriptor legible; debajo de ese ancho usar únicamente [`logo-red-pepper-mark.svg`](../../prototipo/assets/logo-red-pepper-mark.svg) a `>= 32 px`.

## 5. Usos Incorrectos del Logotipo
- No estirar ni distorsionar proporciones.
- No recolorear el isotipo fuera de `#FF3131`, `#F64301` y `#1F6636`.
- No ocultar ni truncar el descriptor *"Sánguches, Salchipapas & Más"* en vistas comerciales donde haya espacio horizontal suficiente.
- No aplicar sombras luminosas ni bordes de resplandor alrededor del logotipo.

## 6. Paleta Oficial Obligatoria

| Color | Código HEX | Rol oficial | Aplicación principal |
|---|---|---|---|
| **Rojo brillante** | `#FF3131` | Color principal de marca | Emblema, identidad visual, titulares destacados grandes y bordes de énfasis. |
| **Naranja vivo** | `#F64301` | Acento gastronómico | Promociones, platos destacados, etiquetas de canal y barras de énfasis cálido. |
| **Verde oscuro** | `#1F6636` | Color secundario y frescura | Disponibilidad en stock, jornada abierta, estados *Listo* y acento natural en emblema. |

## 7. Paleta Complementaria, Neutros y Derivados de Contraste
Para evitar saturación cromática y garantizar lectura cómoda en mesas y cajas:
- **Lienzo Alabastro (`#FAF8F5`):** fondo base antirreflejo.
- **Superficie Pura (`#FFFFFF`):** tarjetas de platos, formularios y recibos.
- **Piedra Suave (`#F4F1EC`):** agrupadores KDS, cabeceras de tabla y subtotales.
- **Carbón Cálido (`#1C1917`):** tinta principal (nunca negro puro `#000000`).
- **Grafito Cálido (`#57534E`):** descripciones y metadatos.
- **Derivados AA para texto pequeño:** `--brand-red-cta` (`#D91B1B`) para botones con texto blanco; `--brand-red-ink` (`#B91C1C`) y `--brand-orange-ink` (`#C23500`) para precios o etiquetas sobre fondo blanco.

## 8. Matriz de Contraste WCAG 2.2 AA Verificada

| Combinación | Ratio calculado | Nivel WCAG 2.2 | Regla de uso |
|---|---|---|---|
| `#1C1917` sobre `#FAF8F5` | `16.50 : 1` | AA / AAA | Texto principal y cifras en todo el sistema. |
| `#57534E` sobre `#FAF8F5` | `7.20 : 1` | AA / AAA | Subtítulos, ingredientes y metadatos. |
| `#FFFFFF` sobre `#1F6636` | `6.97 : 1` | AA | Botones de confirmación en Cocina e insignias positivas. |
| `#1F6636` sobre `#ECF7EF` | `6.35 : 1` | AA | Píldoras *Disponible*, *Abierta* y *Vigente*. |
| `#B91C1C` sobre `#FFFFFF` | `6.47 : 1` | AA | Precios destacados, alertas y textos en rojo. |
| `#FFFFFF` sobre `#D91B1B` | `5.09 : 1` | AA | Botones CTA primarios (`Enviar Pedido`, `Cobrar`). |
| `#1C1917` sobre `#FF3131` | `4.78 : 1` | AA | Texto negro cálido cuando se use `#FF3131` de fondo. |
| `#1C1917` sobre `#F64301` | `4.77 : 1` | AA | Etiquetas promocionales sobre naranja vivo. |
| `#FFFFFF` sobre `#FF3131` | `3.66 : 1` | Solo texto grande (`>=18.66px` bold / iconos) | **Prohibido** para texto pequeño (`<18px`); usar `#D91B1B` en su lugar. |
| `#FFFFFF` sobre `#F64301` | `3.67 : 1` | Solo texto grande / iconos | **Prohibido** para texto pequeño; usar `#1C1917` encima o `#C23500` sobre blanco. |

## 9. Dosificación Cromática (Regla 60-30-10)
- **70 %** Neutros cálidos (`#FAF8F5`, `#FFFFFF`, `#F4F1EC`).
- **20 %** Tinta y estructura (`#1C1917`, `#57534E`, `#E4DFD6`).
- **10 %** Acentos oficiales (`#FF3131` / `#D91B1B` para acción primaria, `#F64301` para destacados y `#1F6636` para confirmaciones/frescura).
- **Regla anti-saturación:** nunca combinar simultáneamente los tres colores oficiales en una misma tarjeta de producto o fila de tabla.

## 10. Tipografía Oficial y Jerarquía
- **Familia principal:** `Source Sans 3` (respaldo limpio `Inter`, `Segoe UI`, `system-ui`).
- **Familia tabular numérica:** `JetBrains Mono` con `font-variant-numeric: tabular-nums` en precios (`S/ 8.00`), cantidades KDS, importes de caja, prorrateo P-14 y montos NIIF 18.
- **Escala:** Título de vista `clamp(1.35rem, 2.2vw, 1.85rem)` (`800`), Tarjeta `1.125rem` (`700`), Cuerpo `0.9375rem` / `15px` en cliente y `14px` en operaciones, Metadatos `12px` (`0.75rem`).

## 11. Tokens de Diseño y Variables CSS
Definidos de forma única en [`prototipo/src/styles/tokens.css`](../../prototipo/src/styles/tokens.css), cubriendo colores de marca, neutros, estados, espaciados múltiplos de `4px`, radios (`8px`, `12px`, `16px`, `999px`), sombras discretas, foco (`2px solid #D91B1B`) y alturas mínimas táctiles (`44px` general, `48px` POS).

## 12. Iconografía y Emblemas
- Íconos geométricos SVG limpios (`1.75px` a `2px` de trazo redondeado) coherentes entre menús, modales y tablero de cocina.
- Prohibido el uso de emojis en controles operativos, tablas contables o botones principales.

## 13. Fotografía Gastronómica y Recursos WebP
- Todas las fotografías de carta se almacenan optimizadas en **WebP** (`<= 640×480 px`, `30–63 KB`) en [`prototipo/assets/`](../../prototipo/assets/):
  - `salchipapa.webp` (Salchipapa Clásica con cremas — imagen referencial oficial)
  - `salchipapa-especial.webp` (Salchipapa Especial con pollo deshilachado — imagen referencial oficial)
  - `hamburguesa.webp` (Hamburguesa Clásica — imagen referencial oficial)
  - `sanguche-pollo.webp` (Burger / Sánguche de Pollo Deshilachado — imagen referencial oficial)
  - `alitas.webp` (Especiales / Alitas)
  - `refresco.webp` (Refrescos de pulpa natural y bebidas)
- Encuadre natural, iluminación cálida y relación de aspecto `4:3` constante con `object-fit: cover`.

## 14. Componentes de Marca Reutilizables
- **Cabecera de Portal Público:** logo horizontal RED PEPPER + 4 destinos (`Carta`, `Tu Pedido`, `Seguimiento`, `El Local`) + acceso discreto de equipo separado de la navegación comercial.
- **Tarjeta de Plato:** fotografía WebP `4:3`, etiqueta corta de categoría/disponibilidad, descripción breve (máx. 2 líneas), precio tabular en `#B91C1C` y acciones directas (`Ver / Cremas` + `+ Agregar`).
- **Píldora de Estado:** Verde `#1F6636` (*Disponible / Listo / Vigente*), Ámbar `#92400E` (*En preparación / Pendiente Jerry*), Rojo `#B91C1C` (*Agotado / Cerrado*).

## 15. Aplicación en Experiencia Cliente (Web Pública)
- Prioriza apetito visual, lectura rápida en móvil (`320px–430px`), filtros simples, personalización clara de cremas en modal y seguimiento en tiempo real de comanda sin mostrar complejidad administrativa.

## 16. Aplicación en Mostrador POS y Cocina (Operaciones)
- **Mostrador POS:** elimina fotografías grandes para priorizar velocidad visual, botones `>=48px`, alto contraste entre categoría, método de pago y total a cobrar.
- **Cocina (KDS):** fondo limpio con tarjetas ordenadas en 3 columnas (`Pendiente`, `En preparación`, `Listo`) y botón único de transición autorizada por tarjeta (`R-OBS-03`).

## 17. Aplicación en Gerencia, Compras y Contabilidad NIIF 18
- Reduce la presencia cromática de rojo/naranja únicamente al botón principal o resultado de margen destacado; utiliza tablas alineadas con cifras `tabular-nums`, calendario interactivo P-14 y modales accesibles sin diálogos nativos.

## 18. Accesibilidad Visual y Ergonomía
- Contraste mínimo `4.5:1` en todo texto operativo, `:focus-visible` de `2px` en todas las interacciones por teclado, soporte completo de `Escape` en modales, etiquetas `<label>` explícitas y cero desbordamiento horizontal desde `320px`.

## 19. Reglas de Gobierno del Sistema de Diseño
1. Ningún color HEX puede declararse fuera de `tokens.css` (auditado por `design-consistency-auditor`).
2. Cualquier nueva vista debe definir si pertenece al **Portal Público** o al **Portal Interno**.
3. Ningún grupo de navegación puede superar `5` elementos primarios sin aprobación de arquitectura UX.

## 20. Visor Interno de Guía de Marca
Disponible únicamente dentro del selector interno de equipo bajo `?app=marca` (**Guía de Marca interna**), permitiendo consultar paleta, muestras vivas de contraste, tipografía, logo y componentes sin exponerse en la barra pública de comensales.
