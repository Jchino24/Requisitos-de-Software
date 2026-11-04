# Proyecto RedPepper — Documento de Requisitos

Documento de ingeniería de requisitos del caso de estudio **RedPepper**
(ventas en mostrador, abastecimiento con prorrateo de compras y cierre
mensual de resultados). El proyecto busca conectar la atención en mostrador
con el registro de compras y el control de resultados del negocio: registrar
ventas reales, distribuir compras semanales para el análisis gerencial,
identificar compras adicionales y consultar información mensual con sus
comprobantes asociados.

El PDF se genera a partir de LaTeX y reúne la educción, la ilación, la
especificación de requisitos y los diagramas del proceso de negocio.

## Entregables

**Documento completo (28 páginas, A4):**
[pdf/Requisitos_RedPepper.pdf](pdf/Requisitos_RedPepper.pdf)

**Un PDF por sección**, para leer o compartir sin abrir el documento entero:

| Sección | PDF | Páginas |
|---|---|---|
| 1. Educción | [01-educcion.pdf](pdf/secciones/01-educcion.pdf) | 5 |
| 2. Ilación | [02-ilacion.pdf](pdf/secciones/02-ilacion.pdf) | 8 |
| 3. Especificación | [03-especificacion.pdf](pdf/secciones/03-especificacion.pdf) | 8 |
| 4. Diagramas | [04-diagramas.pdf](pdf/secciones/04-diagramas.pdf) | 4 |
| 5. Interfaces | [05-interfaces.pdf](pdf/secciones/05-interfaces.pdf) | 2 |

Cada sección conserva la numeración del documento general (la sección 2 sigue
siendo la 2 aunque se abra sola), de modo que las referencias entre secciones
no se rompen.

**Fuentes:** [documento/](documento/) · [diagramas/](diagramas/)

## Estructura de carpetas

```
.
├── README.md                      # Este archivo
├── Makefile                       # make / make general / make secciones / make check
├── .gitignore                     # Auxiliares de LaTeX y copia de trabajo del PDF
├── documento/                     # FUENTES LaTeX (se compila desde aquí)
│   ├── preambulo.tex              # Preámbulo común (paquetes, rutas, estilos)
│   ├── Requisitos_RedPepper.tex   # Maestro: portada + índice + \input de secciones
│   ├── sec-01-educcion.tex        # Envoltorio: genera el PDF de la sección 1
│   ├── sec-02-ilacion.tex         # Envoltorio: sección 2
│   ├── sec-03-especificacion.tex  # Envoltorio: sección 3
│   ├── sec-04-diagramas.tex       # Envoltorio: sección 4
│   ├── sec-05-interfaces.tex      # Envoltorio: sección 5
│   └── secciones/                 # CONTENIDO de cada sección
│       ├── educcion.tex           # 4 longtable: E-PRE, E-OBS, E-ENT1, E-ENT2
│       ├── ilacion.tex            # Cadenas I-PRE, I-OBS, I-ENT1, I-ENT2
│       ├── especificacion.tex     # Catálogos RF, RNF y 39 derivados
│       ├── diagramas.tex          # 4 figuras de proceso + diagrama de clases
│       └── interfaces.tex         # Pantallas del prototipo (v1)
├── diagramas/                     # IMÁGENES del documento (PNG 300 dpi, v2)
│   ├── fuentes/                   # Fuentes TikZ de cada figura + estilo común
│   │   ├── estilo.tex
│   │   ├── 01-venta-mostrador.tex
│   │   ├── 02-abastecimiento-prorrateo.tex
│   │   ├── 03-cierre-mensual-niif18.tex
│   │   ├── 04-proceso-general.tex
│   │   └── 05-diagrama-clases-original.jpg
│   ├── 01-venta-mostrador.png
│   ├── 02-abastecimiento-prorrateo.png
│   ├── 03-cierre-mensual-niif18.png
│   ├── 04-proceso-general.png
│   └── 05-diagrama-clases.png
├── interfaces/                    # Pantallas del prototipo (v1)
│   ├── fuentes/                   # Capturas originales sin recomprimir
│   ├── 01-dashboard-margen.png
│   └── 02-pos-mostrador.png
└── pdf/                           # ENTREGABLES compilados
    ├── Requisitos_RedPepper.pdf   # Documento completo (26 páginas)
    └── secciones/
        ├── 01-educcion.pdf
        ├── 02-ilacion.pdf
        ├── 03-especificacion.pdf
        ├── 04-diagramas.pdf
        └── 05-interfaces.pdf
```

Cada carpeta tiene una responsabilidad: `documento/` solo código LaTeX,
`diagramas/` solo imágenes y `pdf/` solo entregables. Los nombres son
**genéricos a propósito**: la versión de cada entrega vive en el historial de
commits de Git, no en el nombre de la carpeta. Así, cuando se reemplacen los
diagramas o el texto por versiones más pulidas, no hay que renombrar rutas.

## Dependencias de compilación

- **TeX Live** (o TinyTeX) con `pdflatex` y `latexmk`.
- Paquetes: `babel-spanish`, `csquotes`, `booktabs`, `longtable`, `array`,
  `geometry`, `hyperref`, `graphicx`, `float`, `lmodern`.
- Opcional: `cm-super` si se prefiere escalar fuentes Type1 en lugar de
  `lmodern`.

```bash
# TinyTeX (sin privilegios de administrador)
tlmgr install babel-spanish csquotes booktabs longtable array geometry \
              hyperref graphics float lm hyphen-spanish
```

## Compilación

Desde la raíz del repositorio, con `make`:

```bash
make            # documento completo + los 4 PDF de sección
make general    # solo pdf/Requisitos_RedPepper.pdf
make secciones  # solo pdf/secciones/*.pdf (compila antes el maestro)
make diagramas  # regenera los PNG desde las fuentes TikZ (300 dpi)
make check      # verifica PDFs y logs (errores y referencias rotas)
make clean      # borra auxiliares, conserva los PDF
make distclean  # borra auxiliares y los PDF generados
```

Equivale a ejecutar a mano:

```bash
cd documento
latexmk -pdf -interaction=nonstopmode -halt-on-error Requisitos_RedPepper.tex
cp -f Requisitos_RedPepper.pdf ../pdf/
```

Sin `latexmk`, `pdflatex` dos veces basta para resolver el índice y las
referencias cruzadas (siempre dentro de `documento/`):

```bash
cd documento
pdflatex -interaction=nonstopmode Requisitos_RedPepper.tex
pdflatex -interaction=nonstopmode Requisitos_RedPepper.tex
```

Las rutas son relativas a `documento/`: el preámbulo se carga con
`\input{preambulo}`, el contenido con `\input{secciones/...}` y las figuras
con `\graphicspath{{../diagramas/}}`.

Los envoltorios `sec-0N-*.tex` comparten ese preámbulo y fijan el contador de
sección para conservar la numeración del maestro. La única referencia
cruzada entre secciones (`sec:especificacion`) se resuelve con `xr` sobre
`refs-externas.aux`, un `.aux` filtrado que `make general` genera a partir del
maestro; por eso `make secciones` compila antes el documento completo.

La compilación es **reproducible**: dos ejecuciones limpias producen los cinco
PDF idénticos byte a byte, de modo que los archivos versionados no generan
diffs por fecha. Para verificar el resultado: `make check`.

## Diagramas (v2)

Los cuatro diagramas se dibujan con **TikZ**, no con capturas de pantalla: son
vectoriales, comparten tipografía y paleta con el documento, y se regeneran
con `make diagramas` (PNG a 300 dpi). Las fuentes están en
`diagramas/fuentes/`.

La versión 2 corrige los defectos detectados en la v1:

- **Errata en el rótulo**: «DIAGARAMA 1» → «Diagrama 1».
- **Tildes faltantes** en varias etiquetas («mas», «dias habiles»).
- **SHA-256 no cifra**: es un hash de integridad. Ahora se distingue
  «calcula el hash SHA-256» de «cifra el archivo», como advierte el reporte
  de ilación al separar integridad de cifrado.
- **Cinco días hábiles → jornadas hábiles efectivas**, conforme a P-14
  (los feriados no se prorratean).
- **Estructura NIIF 18**: se listan las categorías reales (operación,
  inversión, financiamiento e impuesto a las ganancias) en lugar de
  «Operación, Financiamiento, Fiscal».
- **Cascada del cierre**: se separan gastos financieros, BAI e impuesto a la
  renta, para no llamar «antes de impuestos e intereses» a un subtotal que ya
  los incluía.
- **Coherencia entre diagramas**: el contador valida las reglas tributarias
  antes del cálculo del impuesto, tanto en el cierre como en la vista general.
- **Diagrama general legible**: se reemplazaron los siete carriles ilegibles
  por tres fases encadenadas, con los roles codificados por color.

## Interfaces de usuario (v1)

La sección 5 reproduce dos pantallas del prototipo (ERP BackOffice v2.4):
el panel gerencial de margen bruto y el terminal de mostrador. Son
**propuestas de interfaz, no un sistema implementado**, y sus importes son
datos de ejemplo.

El panel rotula el reparto como «5 días»; conforme a P-14 debe leerse como
*jornadas hábiles efectivas*, igual que en los diagramas 2 y 3. Esa
corrección queda pendiente en el prototipo.

## Diagrama de clases

El **diagrama de clases** (Figura 5) es la versión 1 aportada por el equipo y
se conserva como imagen raster: 15 clases del dominio con atributos,
operaciones y multiplicidades. Por su densidad, a 16 cm de ancho el texto
interno queda en torno a 4,6 pt; para la versión final conviene exportarlo
vectorial (PDF/SVG) desde la herramienta de origen y reemplazar
`diagramas/05-diagrama-clases.png` conservando el nombre.

## Autores y docente

- **Docente:** Dr. Yasiel Pérez Vera
- **Integrantes:** Gabriel Pajuelo, Armando Enriquez, Victor Lupinta,
  Jose Chino, José Choquehuanca

## Advertencia sobre el estado del contenido

El contenido de este documento se transcribe de dos insumos del proyecto:

1. `Reporte_RedPepper_Educcion_Ilacion (3).pdf` — eventos EV-PRE-01,
   EV-OBS-01, EV-ENT-01 y EV-ENT-02 (52 entradas de educción, 52 cadenas de
   ilación y 39 requisitos candidatos).
2. `Informe_Practica02_RedPepper_Exacto_12a14Paginas.docx` — catálogo de
   20 requisitos funcionales (RF-01 a RF-20) y 8 no funcionales
   (RNF-01 a RNF-08).

No se ha inventado contenido de requisitos. No obstante:

- **Todos los requisitos derivados son candidatos pendientes de validación**;
  ninguno constituye una línea base aprobada.
- **Los criterios de validación de los RF y RNF no constan en el catálogo de
  origen (F-02).** Los RF remiten a los criterios `V-*` de los requisitos
  derivados cuando existe vínculo documentado; el resto queda como pendiente.
  Estas ausencias están marcadas con comentarios `% TODO:` en
  `documento/secciones/especificacion.tex`.
- **Las preguntas de validación abiertas** de cada evento se transcriben en la
  sección 3.4 del documento. Mientras no se respondan, los requisitos que
  dependen de ellas no deben aprobarse.
- La afirmación sobre NIIF 18 recoge la **intención declarada por el cliente**;
  no acredita obligatoriedad legal ni cumplimiento integral.
