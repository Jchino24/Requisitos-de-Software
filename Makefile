# ---------------------------------------------------------------------------
# RedPepper — Documento de Requisitos
# Compila las fuentes de documento/ y deja el PDF en pdf/
#
# Uso:  make            compila y publica pdf/Requisitos_RedPepper.pdf
#       make clean      borra auxiliares, conserva el PDF
#       make distclean  borra auxiliares y el PDF de salida
# ---------------------------------------------------------------------------
MAIN     := Requisitos_RedPepper
LATEXDIR := documento
OUTDIR   := pdf

# Si TeX Live no esta en el PATH pero existe una instalacion de usuario
# (TinyTeX en ~/.TinyTeX), se usa automaticamente sin exportar nada.
TINYTEX ?= $(HOME)/.TinyTeX/bin/x86_64-linux
ifneq (,$(wildcard $(TINYTEX)/latexmk))
  ifeq (,$(shell command -v latexmk 2>/dev/null))
    export PATH := $(TINYTEX):$(PATH)
  endif
endif

.PHONY: all build clean distclean check

all: build

build:
	@command -v latexmk >/dev/null 2>&1 || { \
	  echo "ERROR: no se encontro latexmk. Instala TeX Live o define TINYTEX=/ruta/bin"; \
	  exit 1; }
	@mkdir -p $(OUTDIR)
	cd $(LATEXDIR) && latexmk -pdf -interaction=nonstopmode -halt-on-error $(MAIN).tex
	cp -f $(LATEXDIR)/$(MAIN).pdf $(OUTDIR)/$(MAIN).pdf
	@echo "Listo: $(OUTDIR)/$(MAIN).pdf"

# Verifica que el PDF exista y que el log no tenga errores
check:
	@test -s $(OUTDIR)/$(MAIN).pdf || { echo "FALLO: falta el PDF"; exit 1; }
	@! grep -qE "^!" $(LATEXDIR)/$(MAIN).log || { echo "FALLO: errores en el log"; exit 1; }
	@echo "OK: PDF presente y log sin errores"

# Borra auxiliares, conserva el PDF generado
clean:
	cd $(LATEXDIR) && latexmk -c $(MAIN).tex

# Borra auxiliares y tambien el PDF de salida
distclean:
	cd $(LATEXDIR) && latexmk -C $(MAIN).tex
	rm -f $(OUTDIR)/$(MAIN).pdf
