# Inventario Real de Funcionalidades y Frontera Frontend / Backend

Este documento distingue con precisión qué capacidades operan realmente en el navegador dentro de `prototipo/` y cuáles permanecen modeladas para demostración en espera de un servidor backend.

---

## 1. Funcionalidades Reales Implementadas en Cliente (Navegador + `localStorage`)

| Módulo | Capacidades operativas reales | Archivos |
|---|---|---|
| **Portal Cliente** | Hero dinámico, filtros de categoría, buscador instantáneo, selector de canal, modal detalle con selección de cremas, carrito con cantidades y notas, confirmación en vivo a Cocina, seguimiento paso a paso e historial local en dispositivo. | [`cliente.js`](../prototipo/src/apps/cliente.js) |
| **Mostrador POS** | Controles táctiles `>= 48 px`, selección de canal y método de cobro (`Efectivo`, `Yape / Plin`, `Tarjeta`), edición de borrador, bloqueo de agotados y confirmación modal de cierre de jornada. | [`pos.js`](../prototipo/src/apps/pos.js) |
| **Cocina (KDS)** | Cola en 3 columnas sincronizada al instante, transiciones protegidas (`Pendiente -> En preparación -> Listo`), bloqueo/reactivación inmediata de stock por producto. | [`cocina.js`](../prototipo/src/apps/cocina.js) |
| **Margen y Prorrateo** | Cálculo en vivo de ventas del día, cuota prorrateada sobre días hábiles editables excluyendo feriados (P-14), ventas por canal, ranking incluyendo platos con cero ventas y descarga real CSV. | [`admin.js`](../prototipo/src/apps/admin.js), [`actions.js`](../prototipo/src/core/actions.js) |
| **Compras y Carta** | Alta de compras con validación RUC 11 dígitos y monto `> 0`, corrección con motivo obligatorio en modal, alta de platos, actualización de precios sin alterar ventas previas y registro automático en bitácora. | [`admin.js`](../prototipo/src/apps/admin.js) |
| **Contabilidad NIIF 18 / SUNAT** | Cascada completa separando Resultado Operativo, Gastos Financieros, BAI e Impuesto; autorización de reglas tributarias; bloqueo de periodo cerrado con Nota de Ajuste y búsqueda de comprobantes por RUC/proveedor. | [`admin.js`](../prototipo/src/apps/admin.js) |
| **Guía de Marca Interna** | Visor interno de logotipo, tipografía, botones y paleta verificada WCAG AA (`?app=marca`). | [`brand-guide.js`](../prototipo/src/apps/brand-guide.js) |

---

## 2. Capacidades que Requieren Desarrollo Backend Futuro (No Inventadas)

| Capacidad | Motivo de dependencia backend | Cómo se presenta hoy |
|---|---|---|
| **Autenticación JWT y RBAC multiusuario (`RNF-01`)** | Requiere emisión de tokens firmados y verificación en servidor. | Selector de roles en modal con aviso explícito *"Demo local sin JWT real"*. |
| **Base de datos relacional (`DECIMAL(12,4)`, `RNF-06`)** | `localStorage` persiste únicamente en el navegador local actual. | Se conserva la especificación en documentación sin simular conexión SQL falsa. |
| **Sincronización entre dispositivos físicos distintos** | Requiere WebSockets / API REST centralizada entre tablet de Caja, pantalla de Cocina y móvil de Comensal. | Sincronizado en la misma instancia/sesión de navegador (`localStorage`). |
| **Bóveda cifrada y compresión binaria real de PDF/JPG (`RNF-08` / `RF-15`)** | Requiere almacenamiento cifrado en servidor/S3 y procesamiento de archivos binarios. | Se representa la huella SHA-256 y la etiqueta de compresión sobre metadatos de demo. |
| **Validación OSE / SUNAT en línea** | Requiere certificados digitales y conexión con operador electrónico tributario. | Buscador local de comprobantes registrados. |
