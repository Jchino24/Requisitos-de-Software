# ---------------------------------------------------------------------------
# RedPepper — Documento de Requisitos
# Compila las fuentes de documento/ y deja el PDF en pdf/
# ---------------------------------------------------------------------------
MAIN     := Requisitos_RedPepper
LATEXDIR := documento
OUTDIR   := pdf

.PHONY: all build clean distclean

all: build

build:
	@mkdir -p $(OUTDIR)
	cd $(LATEXDIR) && latexmk -pdf -interaction=nonstopmode -halt-on-error $(MAIN).tex
	cp -f $(LATEXDIR)/$(MAIN).pdf $(OUTDIR)/$(MAIN).pdf
	@echo "Listo: $(OUTDIR)/$(MAIN).pdf"

# Borra auxiliares, conserva el PDF generado
clean:
	cd $(LATEXDIR) && latexmk -c $(MAIN).tex

# Borra auxiliares y tambien el PDF de salida
distclean:
	cd $(LATEXDIR) && latexmk -C $(MAIN).tex
	rm -f $(OUTDIR)/$(MAIN).pdf
