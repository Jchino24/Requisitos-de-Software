# Arquitectura de Información y UX/UI — RED PEPPER

Aplicando [`ux-information-architect`](../.agents/skills/ux-information-architect/SKILL.md) y [`responsive-interface-builder`](../.agents/skills/responsive-interface-builder/SKILL.md), se separó el monolito original en portales especializados evitando sobrecarga visual y mezcla de roles.

---

## 1. Separación Estrita: Experiencia Pública vs Portales Internos

| Portal | Parámetro URL | Destinos en barra principal (máx. 4) | Audiencia |
|---|---|---|---|
| **Público Cliente** | `?app=cliente` (por defecto) | `Carta` · `Tu Pedido` · `Seguimiento` · `El Local` | Comensal (`ACT-0005`) |
| **Operativo POS** | `?app=pos` / `?view=pos` | `Mostrador POS` · `Cocina KDS` · `Gerencia` · `Vista Cliente` | Caja (`ACT-0002`) |
| **Operativo Cocina** | `?app=cocina` / `?view=cocina` | `Mostrador POS` · `Cocina KDS` · `Gerencia` · `Vista Cliente` | Cocina (`ACT-0003`) |
| **Gerencia & Contabilidad** | `?app=admin` / `?view=admin-*` | `Margen P-14` · `Compras y Carta` · `Contabilidad` · `Configuración` | Jerry / Contador (`ACT-0001/04`) |
| **Guía de Marca Interna** | `?app=marca` | Botón de retorno a Configuración | Equipo interno (nunca expuesto en nav pública) |

El cambio hacia entornos internos desde el portal público se realiza mediante el botón discreto **Equipo** (fuera de la barra de navegación del cliente), que abre el selector de rol modal indicando el carácter local de demostración (`RNF-01`).

---

## 2. Reglas de Simplicidad y Revelación Progresiva

1. **Sin tarjetas duplicadas ni relleno:** cada métrica vive una sola vez en su módulo natural.
2. **Detalle bajo demanda:** en la carta pública, el desglose completo y la selección personalizada de cremas se muestran en modal al pulsar **Detalle**, manteniendo limpia cada tarjeta de producto.
3. **Desgloses contables plegables:** los costos indirectos fijos en Contabilidad NIIF 18 permanecen ocultos por defecto tras `<details>`.
4. **Cero diálogos nativos:** se reemplazó `window.prompt()` por modales accesibles con validación en línea.

---

## 3. Estrategia Responsiva (`320px` a `1920px+`)

- **Desktop (`>= 961px`):** grillas asimétricas `1.6fr / 1fr` en Carta y POS; 3 columnas en Cocina KDS; 2 columnas en administración.
- **Tablet (`768px – 960px`):** colapso limpio a 1 columna en splits; KPIs en grilla 2×2.
- **Móvil (`320px – 767px`):** navegación cliente mediante barra inferior fija de 4 botones; tablas administrativas envueltas en `.table-wrap` con `min-width: 0` en padres Grid para garantizar `scrollWidth <= clientWidth`; en `<= 480px` el lockup pasa automáticamente al isotipo compacto [`logo-red-pepper-mark.svg`](../prototipo/assets/logo-red-pepper-mark.svg).
