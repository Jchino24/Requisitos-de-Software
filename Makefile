# ---------------------------------------------------------------------------
# RedPepper — Documento de Requisitos
#
# Genera el PDF general y un PDF independiente por sección:
#   pdf/Requisitos_RedPepper.pdf      documento completo
#   pdf/secciones/01-educcion.pdf     …
#
# Uso:  make            compila todo (general + secciones)
#       make general    solo el documento maestro
#       make secciones  solo los PDF por sección (compila antes el maestro)
#       make check      verifica PDFs y logs
#       make clean      borra auxiliares, conserva los PDF
#       make distclean  borra auxiliares y los PDF generados
# ---------------------------------------------------------------------------
MAIN     := Requisitos_RedPepper
LATEXDIR := documento
OUTDIR   := pdf
SECDIR   := $(OUTDIR)/secciones

# Orden y nombre de las secciones (prefijo numérico = orden de lectura)
SECTIONS := 01-educcion 02-ilacion 03-especificacion 04-diagramas 05-interfaces

# Diagramas: fuentes TikZ -> PNG de 300 dpi
DIAGDIR  := diagramas
DIAGSRC  := $(DIAGDIR)/fuentes
DIAGRAMS := 01-venta-mostrador 02-abastecimiento-prorrateo \
            03-cierre-mensual-niif18 04-proceso-general

LATEX := latexmk -pdf -interaction=nonstopmode -halt-on-error

# Si TeX Live no esta en el PATH pero existe una instalacion de usuario
# (TinyTeX en ~/.TinyTeX), se usa automaticamente sin exportar nada.
TINYTEX ?= $(HOME)/.TinyTeX/bin/x86_64-linux
ifneq (,$(wildcard $(TINYTEX)/latexmk))
  ifeq (,$(shell command -v latexmk 2>/dev/null))
    export PATH := $(TINYTEX):$(PATH)
  endif
endif

.PHONY: all build general secciones diagramas check clean distclean

all: build

build: general secciones

# --- Documento completo -----------------------------------------------------
general:
	@command -v latexmk >/dev/null 2>&1 || { \
	  echo "ERROR: no se encontro latexmk. Instala TeX Live o define TINYTEX=/ruta/bin"; \
	  exit 1; }
	@mkdir -p $(OUTDIR)
	cd $(LATEXDIR) && $(LATEX) $(MAIN).tex
	cp -f $(LATEXDIR)/$(MAIN).pdf $(OUTDIR)/$(MAIN).pdf
	@# Etiquetas que las secciones citan y que viven en el maestro.
	@# Se filtran para que xr no reimporte los labels propios de cada seccion.
	@grep -F '\newlabel{sec:especificacion}' $(LATEXDIR)/$(MAIN).aux > $(LATEXDIR)/refs-externas.aux \
	  || { echo "ERROR: no se encontro el label sec:especificacion en $(MAIN).aux"; exit 1; }
	@echo "Listo: $(OUTDIR)/$(MAIN).pdf"

# --- Un PDF por seccion -----------------------------------------------------
# Depende del maestro: xr lee refs-externas.aux, generado en 'general'.
secciones: general
	@mkdir -p $(SECDIR)
	@for s in $(SECTIONS); do \
	  echo "== $$s =="; \
	  ( cd $(LATEXDIR) && $(LATEX) sec-$$s.tex ) || exit 1; \
	  cp -f $(LATEXDIR)/sec-$$s.pdf $(SECDIR)/$$s.pdf || exit 1; \
	done
	@echo "Listo: $(SECDIR)/"

# --- Diagramas (TikZ -> PNG) -----------------------------------------------
diagramas:
	@command -v pdftoppm >/dev/null 2>&1 || { echo "ERROR: falta pdftoppm (poppler-utils)"; exit 1; }
	@for d in $(DIAGRAMS); do \
	  echo "== $$d =="; \
	  ( cd $(DIAGSRC) && $(LATEX) $$d.tex ) || exit 1; \
	  pdftoppm -png -r 300 -singlefile $(DIAGSRC)/$$d.pdf $(DIAGDIR)/$$d || exit 1; \
	done
	@echo "Listo: PNG de 300 dpi en $(DIAGDIR)/"

# --- Verificacion -----------------------------------------------------------
check:
	@test -s $(OUTDIR)/$(MAIN).pdf || { echo "FALLO: falta el PDF general"; exit 1; }
	@! grep -qE "^!" $(LATEXDIR)/$(MAIN).log || { echo "FALLO: errores en el log general"; exit 1; }
	@for s in $(SECTIONS); do \
	  test -s $(SECDIR)/$$s.pdf || { echo "FALLO: falta $(SECDIR)/$$s.pdf"; exit 1; }; \
	  ! grep -qE "^!" $(LATEXDIR)/sec-$$s.log || { echo "FALLO: errores en sec-$$s.log"; exit 1; }; \
	  ! grep -qi "undefined references" $(LATEXDIR)/sec-$$s.log || { echo "FALLO: referencias rotas en sec-$$s.log"; exit 1; }; \
	done
	@! grep -qi "undefined references" $(LATEXDIR)/$(MAIN).log \
	  || { echo "FALLO: referencias sin resolver en el documento general"; exit 1; }
	@echo "OK: PDF general + $(words $(SECTIONS)) secciones, logs sin errores ni referencias rotas"

# --- Limpieza ---------------------------------------------------------------
clean:
	cd $(LATEXDIR) && latexmk -c $(MAIN).tex $(foreach s,$(SECTIONS),sec-$(s).tex)

distclean:
	cd $(LATEXDIR) && latexmk -C $(MAIN).tex $(foreach s,$(SECTIONS),sec-$(s).tex)
	cd $(DIAGSRC) && latexmk -C $(foreach d,$(DIAGRAMS),$(d).tex)
	rm -rf $(SECDIR)
	rm -f $(OUTDIR)/$(MAIN).pdf
