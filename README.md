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

## Estructura de carpetas

```
github_docs/
├── Requisitos_RedPepper.tex   # Documento principal (portada, índice, \input)
├── educcion.tex               # 4 tablas longtable: E-PRE, E-OBS, E-ENT1, E-ENT2
├── ilacion.tex                # 4 listas de cadenas I-PRE, I-OBS, I-ENT1, I-ENT2
├── especificacion.tex         # Catálogos RF, RNF y requisitos derivados
├── diagramas.tex              # 4 figuras del proceso de negocio
├── README.md                  # Este archivo
├── .gitignore                 # Artefactos de compilación LaTeX
├── diagramas v1/              # Diagramas del proceso (fuente gráfica v1)
│   ├── 01-venta-mostrador.png
│   ├── 02-abastecimiento-prorrateo.png
│   ├── 03-cierre-mensual-niif18.png
│   └── 04-proceso-general.png
└── Requisitos_RedPepper.pdf   # Salida compilada (no versionar si se prefiere)
```

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

```bash
cd github_docs
latexmk -pdf Requisitos_RedPepper.tex
```

Sin `latexmk`, basta ejecutar `pdflatex` dos veces para resolver el índice y
las referencias cruzadas:

```bash
pdflatex -interaction=nonstopmode Requisitos_RedPepper.tex
pdflatex -interaction=nonstopmode Requisitos_RedPepper.tex
```

Para limpiar los artefactos intermedios: `latexmk -C`.

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
  `especificacion.tex`.
- **Las preguntas de validación abiertas** de cada evento se transcriben en la
  sección 3.4 del documento. Mientras no se respondan, los requisitos que
  dependen de ellas no deben aprobarse.
- La afirmación sobre NIIF 18 recoge la **intención declarada por el cliente**;
  no acredita obligatoriedad legal ni cumplimiento integral.
