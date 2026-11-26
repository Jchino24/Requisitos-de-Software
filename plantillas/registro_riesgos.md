# Registro de riesgos asociados a los requisitos — RedPepper

Generado desde `plantillas/registro_riesgos.csv` con `scripts/generar_riesgos.py`.
No editar este archivo a mano: modificar el CSV y volver a ejecutar el script.

## Resumen

- Riesgos registrados: **30**
- Estado: resuelto 1, en proceso 10, pendiente 16, retrasado 3
- Exposición total: **S/ 135.415**
- Colchón bruto (suma P-I de los 10 principales): **35,15 días**
- Colchón residual con mitigación: **15,05 días**

## Los diez riesgos principales

| # | Código | Riesgo | P (%) | Impacto (d) | P-I | Exposición (S/) |
|---:|---|---|---:|---:|---:|---:|
| 1 | EDU-PRE-08 | Régimen tributario, tasas y marco contable sin confirmar por el contador; el cálculo de impuestos se apoya en una regla que aún no se aprueba. | 90 | 6 | 5,4 | 14.040 |
| 2 | RF-14 | El reporte NIIF 18 no lleva nota de alcance legal y puede interpretarse como acreditación de cumplimiento. | 90 | 5 | 4,5 | 16.200 |
| 3 | EDU-PRE-05 | El objeto del prorrateo no está confirmado: la solicitud habla de ventas y la aclaración posterior, de compras. El equipo adoptó el reparto de compras como regla candidata. | 95 | 4 | 3,8 | 6.840 |
| 4 | R-PRE-07 | La regla tributaria no se versiona por fecha de efecto; un cambio de tasa podría recalcular periodos anteriores. | 75 | 5 | 3,75 | 10.500 |
| 5 | RF-11 | La parametrización fiscal no cuenta con matriz de reglas por tributo, régimen y periodo; el cálculo queda a criterio del usuario. | 75 | 4 | 3 | 7.200 |
| 6 | ILA-PRE-02 | Doble contabilización entre el costo directo del producto y la compra semanal prorrateada; ambas bases podrían sumarse en el margen. | 75 | 4 | 3 | 6.600 |
| 7 | R-PRE-08 | La plantilla contable mensual no está aprobada; el reporte NIIF 18 puede cambiar de estructura después de la codificación. | 75 | 4 | 3 | 6.000 |
| 8 | EDU-ENT1-01 | La carta no aporta costos unitarios ni recetas, por lo que el ranking y el margen por plato no se pueden calcular con sustento. | 75 | 4 | 3 | 5.700 |
| 9 | RNF-03 | El umbral de 3 s no tiene dispositivo ni volumen de datos de referencia, por lo que la métrica no es verificable. | 75 | 4 | 3 | 3.900 |
| 10 | R-PRE-02 | El prorrateo entre jornadas no tiene criterio de aceptación verificable para semanas con feriados o jornadas parciales. | 90 | 3 | 2,7 | 3.780 |

## Registro completo

| ID | Código | Etapa | Riesgo | P (%) | I (d) | P-I | Costo (S/) | Exposición (S/) | Estado |
|---|---|---|---|---:|---:|---:|---:|---:|---|
| R-01 | EDU-PRE-05 | Educción | El objeto del prorrateo no está confirmado: la solicitud habla de ventas y la aclaración posterior, de compras. El equipo adoptó el reparto de compras como regla candidata. | 95 | 4 | 3,8 | 1.800 | 6.840 | en proceso |
| R-02 | EDU-PRE-08 | Educción | Régimen tributario, tasas y marco contable sin confirmar por el contador; el cálculo de impuestos se apoya en una regla que aún no se aprueba. | 90 | 6 | 5,4 | 2.600 | 14.040 | pendiente |
| R-03 | EDU-PRE-10 | Educción | El marco de presentación NIIF 18 se declaró como intención del cliente, sin sustento formal de obligatoriedad ni de alcance. | 50 | 5 | 2,5 | 3.500 | 8.750 | en proceso |
| R-04 | EDU-PRE-14 | Educción | El criterio de conciliación entre el reporte mensual y sus comprobantes de sustento no está definido; no hay tolerancia ni partidas de ajuste. | 50 | 3 | 1,5 | 1.600 | 2.400 | pendiente |
| R-05 | EDU-OBS-01 | Educción | El registro de la observación no consigna fecha, responsables ni duración, de modo que la evidencia no es reproducible. | 75 | 2 | 1,5 | 700 | 1.050 | retrasado |
| R-06 | EDU-OBS-05 | Educción | El umbral táctil de 48 px es una propuesta del equipo: no se midió en el dispositivo real ni se registró la evidencia. | 50 | 3 | 1,5 | 900 | 1.350 | pendiente |
| R-07 | EDU-ENT1-01 | Educción | La carta no aporta costos unitarios ni recetas, por lo que el ranking y el margen por plato no se pueden calcular con sustento. | 75 | 4 | 3 | 1.900 | 5.700 | retrasado |
| R-08 | EDU-ENT2-14 | Educción | El calendario de jornadas hábiles y feriados no está aprobado; el prorrateo puede repartir costos en días no laborados. | 75 | 3 | 2,25 | 1.300 | 2.925 | en proceso |
| R-09 | EDU-ENT2-27 | Educción | El alcance de SUNAT es ambiguo: el cliente espera emisión electrónica y el catálogo solo cubre búsqueda y exportación de comprobantes. | 50 | 5 | 2,5 | 2.400 | 6.000 | pendiente |
| R-10 | ILA-PRE-02 | Ilación | Doble contabilización entre el costo directo del producto y la compra semanal prorrateada; ambas bases podrían sumarse en el margen. | 75 | 4 | 3 | 2.200 | 6.600 | en proceso |
| R-11 | ILA-PRE-07 | Ilación | Confusión entre el resultado antes de intereses y el BAI al restar los gastos financieros en un orden incorrecto. | 50 | 2 | 1 | 1.500 | 1.500 | resuelto |
| R-12 | ILA-PRE-14 | Ilación | La conciliación mensual no cuenta con una plantilla aprobada; cada versión del reporte usa partidas distintas. | 50 | 4 | 2 | 1.800 | 3.600 | pendiente |
| R-13 | ILA-OBS-03 | Ilación | No se fijó el momento en que la venta queda confirmada (cobro, comanda o entrega); el corte diario puede incluir ventas distintas. | 50 | 3 | 1,5 | 1.000 | 1.500 | en proceso |
| R-14 | ILA-ENT1-01 | Ilación | La política de producto agotado no existe; carta, POS y cocina podrían tratar el estado de forma distinta. | 75 | 2 | 1,5 | 800 | 1.200 | pendiente |
| R-15 | ILA-ENT2-16 | Ilación | El recálculo de cuotas al corregir una compra en periodo abierto no tiene regla ni bitácora; las cuotas pueden no sumar el nuevo monto. | 50 | 4 | 2 | 1.700 | 3.400 | pendiente |
| R-16 | ILA-ENT2-24 | Ilación | El ajuste autorizado en un periodo cerrado choca con la inmutabilidad contable; no se definió el asiento de reversión. | 50 | 5 | 2,5 | 2.500 | 6.250 | pendiente |
| R-17 | ILA-RNF-06 | Ilación | La regla de redondeo monetario no está definida; DECIMAL(12,4) no indica cuándo ni cómo redondear por moneda. | 10 | 3 | 0,3 | 900 | 270 | pendiente |
| R-18 | R-PRE-02 | Especificación | El prorrateo entre jornadas no tiene criterio de aceptación verificable para semanas con feriados o jornadas parciales. | 90 | 3 | 2,7 | 1.400 | 3.780 | en proceso |
| R-19 | R-PRE-04 | Especificación | El margen bruto diario no tiene caso de referencia aprobado; faltan valores esperados para ventas, cuota y adicional. | 50 | 4 | 2 | 1.500 | 3.000 | pendiente |
| R-20 | R-PRE-07 | Especificación | La regla tributaria no se versiona por fecha de efecto; un cambio de tasa podría recalcular periodos anteriores. | 75 | 5 | 3,75 | 2.800 | 10.500 | en proceso |
| R-21 | R-PRE-08 | Especificación | La plantilla contable mensual no está aprobada; el reporte NIIF 18 puede cambiar de estructura después de la codificación. | 75 | 4 | 3 | 2.000 | 6.000 | en proceso |
| R-22 | R-ENT2-07 | Especificación | El reparto entre jornadas efectivamente laboradas no tiene calendario aprobado; feriados y jornadas parciales quedan a interpretación. | 90 | 3 | 2,7 | 1.300 | 3.510 | pendiente |
| R-23 | R-ENT2-10 | Especificación | La activación de reglas tributarias no exige autorización registrada de Jerry; el contador podría activar un cambio sin control. | 50 | 3 | 1,5 | 1.900 | 2.850 | pendiente |
| R-24 | R-ENT2-15 | Especificación | La compresión de comprobantes no tiene umbral aprobado ni prueba de legibilidad del sustento. | 50 | 2 | 1 | 700 | 700 | pendiente |
| R-25 | RF-11 | Especificación | La parametrización fiscal no cuenta con matriz de reglas por tributo, régimen y periodo; el cálculo queda a criterio del usuario. | 75 | 4 | 3 | 2.400 | 7.200 | en proceso |
| R-26 | RF-14 | Especificación | El reporte NIIF 18 no lleva nota de alcance legal y puede interpretarse como acreditación de cumplimiento. | 90 | 5 | 4,5 | 3.600 | 16.200 | en proceso |
| R-27 | RF-16 | Especificación | La búsqueda para SUNAT no tiene criterio de aceptación ni casos de prueba por RUC, fecha y código de gasto. | 50 | 2 | 1 | 800 | 800 | pendiente |
| R-28 | RF-18 | Especificación | El dashboard de decisión no tiene indicadores ni umbrales validados; el catálogo de origen no aporta criterio. | 75 | 2 | 1,5 | 900 | 1.350 | retrasado |
| R-29 | RNF-01 | Especificación | El control de acceso RBAC no tiene matriz de roles y permisos; cada pantalla define sus permisos por su cuenta. | 50 | 3 | 1,5 | 1.500 | 2.250 | pendiente |
| R-30 | RNF-03 | Especificación | El umbral de 3 s no tiene dispositivo ni volumen de datos de referencia, por lo que la métrica no es verificable. | 75 | 4 | 3 | 1.300 | 3.900 | pendiente |
