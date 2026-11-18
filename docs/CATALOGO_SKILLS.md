# Catálogo de Skills Reutilizables

Registro oficial de skills descubiertas en el entorno y skills universales creadas para estandarizar auditoría, branding, arquitectura UX, componentes, accesibilidad, QA, rendimiento y documentación.

---

## 1. Skills Preexistentes del Entorno Utilizadas

| Skill | Origen | Uso concreto en el proyecto | Validación realizada |
|---|---|---|---|
| `taste-design` | Global entorno | Referencia de jerarquía visual, tipografía tabular en cifras, prevención de anti-patrones y animación hardware-accelerated (`transform`/`opacity`). | Revisión de lectura y adaptación sin conflictos con tokens oficiales de marca. |
| `stitch-extract-design-md` | Global entorno | Estructura de `.stitch/DESIGN.md` con frontmatter YAML de tokens y secciones semánticas para generación de pantallas. | Verificada estructura YAML + secciones al actualizar `.stitch/DESIGN.md`. |
| `web-app-development` | Global entorno | Principios de HTML semántico, Vanilla CSS modular, Vanilla JS ES modules, accesibilidad de formularios y prohibición de placeholders genéricos. | Aplicado en la refactorización modular de `prototipo/`. |
| `github` | Global entorno | Flujo de trabajo con `gh` CLI, branches segmentadas y creación de Pull Requests sin alterar `main` directamente. | Verificado `gh auth status` bajo cuenta `Quetzalq4321q`. |

---

## 2. Las 12 Skills Universales Creadas (`.agents/skills/`)

Todas las skills están redactadas de forma **agnóstica al proyecto**: no contienen colores, rutas ni nombres de negocio propios de un cliente, sino que reciben configuración desde archivos de marca/tokens del repositorio destino.

| # | Skill | Ruta | Propósito principal |
|---|---|---|---|
| 01 | `project-auditor` | [`.agents/skills/project-auditor/SKILL.md`](../.agents/skills/project-auditor/SKILL.md) | Inventario de árbol, stack, rutas, riesgos, duplicidades y frontera frontend/backend. |
| 02 | `brand-system-builder` | [`.agents/skills/brand-system-builder/SKILL.md`](../.agents/skills/brand-system-builder/SKILL.md) | Tokens CSS, contraste WCAG, escala tipográfica, conservación de logo y guía de marca. |
| 03 | `ux-information-architect` | [`.agents/skills/ux-information-architect/SKILL.md`](../.agents/skills/ux-information-architect/SKILL.md) | Separación público/interno, límite de 4–5 ítems por navegación y revelación progresiva. |
| 04 | `responsive-interface-builder` | [`.agents/skills/responsive-interface-builder/SKILL.md`](../.agents/skills/responsive-interface-builder/SKILL.md) | Grillas fluidas CSS Grid/Flexbox de `320px` a `1920px+` sin desbordamiento horizontal. |
| 05 | `reusable-component-factory` | [`.agents/skills/reusable-component-factory/SKILL.md`](../.agents/skills/reusable-component-factory/SKILL.md) | Librería modular de componentes UI con variantes, estados y cero estilos ad-hoc. |
| 06 | `accessible-ui-auditor` | [`.agents/skills/accessible-ui-auditor/SKILL.md`](../.agents/skills/accessible-ui-auditor/SKILL.md) | Auditoría WCAG 2.2 AA (contraste, foco visible, teclado, ARIA, targets ≥44px/48px). |
| 07 | `feature-implementation` | [`.agents/skills/feature-implementation/SKILL.md`](../.agents/skills/feature-implementation/SKILL.md) | Conversión de requisitos RF/RNF en estado, validaciones, modales y flujos verificables. |
| 08 | `ui-quality-assurance` | [`.agents/skills/ui-quality-assurance/SKILL.md`](../.agents/skills/ui-quality-assurance/SKILL.md) | Pruebas automatizadas en navegador headless sobre flujos reales, consola y capturas. |
| 09 | `performance-optimizer` | [`.agents/skills/performance-optimizer/SKILL.md`](../.agents/skills/performance-optimizer/SKILL.md) | Conversión WebP, dimensiones explícitas, carga diferida, CSS ligero y DOM eficiente. |
| 10 | `requirements-documenter` | [`.agents/skills/requirements-documenter/SKILL.md`](../.agents/skills/requirements-documenter/SKILL.md) | Matriz trazable requisitos <-> interfaces <-> módulos <-> pruebas sin inventar cobertura. |
| 11 | `design-consistency-auditor` | [`.agents/skills/design-consistency-auditor/SKILL.md`](../.agents/skills/design-consistency-auditor/SKILL.md) | Detección de colores huérfanos, fuentes inconsistentes, radios dispares y duplicación. |
| 12 | `refactor-and-migration` | [`.agents/skills/refactor-and-migration/SKILL.md`](../.agents/skills/refactor-and-migration/SKILL.md) | Migración incremental de monolitos a módulos preservando compatibilidad funcional y datos. |
