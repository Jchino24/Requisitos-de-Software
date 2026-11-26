#!/usr/bin/env python3
# =====================================================================
#  generar_riesgos.py
#  Lee plantillas/registro_riesgos.csv (fuente única de verdad) y
#  regenera las tablas LaTeX de la sección 6, el resumen Markdown y los
#  indicadores que el texto cita mediante macros.
#
#  Uso (desde la raíz del repositorio):
#      python3 scripts/generar_riesgos.py
#  o:
#      make riesgos
#
#  Solo usa la biblioteca estándar. El valor de cada fila se calcula
#  aquí y no se escribe a mano, de modo que el índice P-I, la exposición
#  y el colchón siempre coinciden con el registro.
# =====================================================================
from __future__ import annotations

import csv
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CSV = RAIZ / "plantillas" / "registro_riesgos.csv"
TEX = RAIZ / "documento" / "secciones" / "riesgos-tablas.tex"  # referencia
MD = RAIZ / "plantillas" / "registro_riesgos.md"

# Escala cualitativa -> probabilidad cuantitativa (capítulo 9 de referencia)
ESCALA = {
    "Muy baja": 5,
    "Baja": 10,
    "Media-baja": 25,
    "Media": 50,
    "Media-alta": 75,
    "Alta": 90,
    "Muy alta": 95,
}

# Umbrales del índice P-I (días esperados) para el semáforo
UMBRAL_CRITICO = 4.5
UMBRAL_ALTO = 3.0
UMBRAL_MEDIO = 1.5

# Jornadas del cronograma de referencia (16 semanas de lunes a viernes)
JORNADAS_PROYECTO = 80

ESTADOS = ["resuelto", "en proceso", "pendiente", "retrasado"]
ESTADO_CLASE = {
    "resuelto": "EstadoResuelto",
    "en proceso": "EstadoEnProceso",
    "pendiente": "EstadoPendiente",
    "retrasado": "EstadoRetrasado",
}
ETAPAS = ["Educción", "Ilación", "Especificación"]


def num(valor: str) -> float:
    """Convierte '1.800' o '1800' o '5,4' en número."""
    return float(valor.replace(".", "").replace(",", "."))


def fmt_entero(valor: float) -> str:
    """12345 -> '12.345' (separador de miles en español)."""
    return f"{int(round(valor)):,}".replace(",", ".")


def fmt_tex(valor: float) -> str:
    """12345 -> '12\\,345' para LaTeX."""
    return f"{int(round(valor)):,}".replace(",", r"\,")


def fmt_decimal(valor: float, decimales: int = 2) -> str:
    """5.4 -> '5,4'; 35.15 -> '35,15'."""
    texto = f"{valor:.{decimales}f}".rstrip("0").rstrip(".")
    return texto.replace(".", ",")


def escapar(texto: str) -> str:
    """Escapa los caracteres reservados de LaTeX."""
    reemplazos = {
        "\\": r"\textbackslash{}",
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
    }
    return "".join(reemplazos.get(c, c) for c in texto)


def miles_tex(texto: str) -> str:
    """'S/ 5 000' -> 'S/ 5\\,000' solo para la salida LaTeX."""
    previo = None
    while previo != texto:
        previo = texto
        texto = re.sub(r"(\d) (\d{3})(?!\d)", r"\1\,\2", texto)
    return texto


def cargar() -> list[dict]:
    if not CSV.exists():
        sys.exit(f"No existe {CSV}")
    with CSV.open(encoding="utf-8") as f:
        filas = list(csv.DictReader(f))

    for f in filas:
        f["prob_pct"] = num(f["prob_pct"])
        f["prob_residual"] = num(f["prob_residual"])
        f["impacto_dias"] = num(f["impacto_dias"])
        f["costo_error"] = num(f["costo_error"])

        esperado = ESCALA.get(f["prob_cual"])
        if esperado is None:
            sys.exit(f"{f['id']}: probabilidad cualitativa desconocida {f['prob_cual']!r}")
        if esperado != f["prob_pct"]:
            sys.exit(
                f"{f['id']}: '{f['prob_cual']}' debería ser {esperado} % "
                f"y el registro dice {f['prob_pct']}"
            )
        if f["estado"] not in ESTADOS:
            sys.exit(f"{f['id']}: estado desconocido {f['estado']!r}")
        if f["etapa"] not in ETAPAS:
            sys.exit(f"{f['id']}: etapa desconocida {f['etapa']!r}")
        if f["impacto_dias"] <= 0 or f["costo_error"] <= 0:
            sys.exit(f"{f['id']}: impacto y costo deben ser positivos")

        f["p"] = f["prob_pct"] / 100.0
        f["pi"] = round(f["p"] * f["impacto_dias"], 2)
        f["exposicion"] = round(f["pi"] * f["costo_error"], 2)
        f["pi_residual"] = round((f["prob_residual"] / 100.0) * f["impacto_dias"], 2)
        f["banda"] = banda(f["pi"])

    return filas


def banda(pi: float) -> str:
    if pi >= UMBRAL_CRITICO:
        return "Crítico"
    if pi >= UMBRAL_ALTO:
        return "Alto"
    if pi >= UMBRAL_MEDIO:
        return "Medio"
    return "Bajo"


def ordenar(filas: list[dict]) -> list[dict]:
    """Prioridad: índice P-I y, en empate, exposición al riesgo."""
    return sorted(filas, key=lambda f: (-f["pi"], -f["exposicion"], f["id"]))


def tabla_registro(filas: list[dict]) -> str:
    salida = []
    salida.append(r"\begin{landscape}")
    salida.append(r"{\footnotesize\setlength{\tabcolsep}{2pt}\renewcommand{\arraystretch}{1.1}")
    salida.append(r"\begin{longtable}{L{2.2cm} L{4.0cm} L{1.6cm} L{1.0cm} L{1.1cm} L{1.3cm} L{1.3cm} L{2.5cm} L{1.6cm} L{4.8cm} L{1.6cm}}")
    salida.append(r"\caption{Registro de riesgos asociados a los requisitos de RedPepper.}")
    salida.append(r"\label{tab:riesgos-registro}\\")
    salida.append(r"\toprule")
    salida.append(
        r"\textbf{Código requisito} & \textbf{Riesgo identificado} & "
        r"\textbf{Prob. cual.} & \textbf{P (\%)} & \textbf{I (días)} & "
        r"\textbf{Índice P-I} & \textbf{Costo} & "
        r"\textbf{Exposición} & \textbf{Estado} & \textbf{Plan de mitigación} & "
        r"\textbf{Artefacto} \\")
    salida.append(r"\midrule")
    salida.append(r"\endfirsthead")
    salida.append(r"\toprule")
    salida.append(
        r"\textbf{Código requisito} & \textbf{Riesgo identificado} & "
        r"\textbf{Prob. cual.} & \textbf{P (\%)} & \textbf{I (días)} & "
        r"\textbf{Índice P-I} & \textbf{Costo} & "
        r"\textbf{Exposición} & \textbf{Estado} & \textbf{Plan de mitigación} & "
        r"\textbf{Artefacto} \\")
    salida.append(r"\midrule")
    salida.append(r"\endhead")
    salida.append(r"\bottomrule")
    salida.append(r"\endfoot")
    salida.append(r"\multicolumn{11}{l}{\textbf{Educción de requisitos}} \\")
    etapa_actual = "Educción"
    for f in filas:
        if f["etapa"] != etapa_actual:
            etapa_actual = f["etapa"]
            salida.append(rf"\multicolumn{{11}}{{l}}{{\textbf{{{etapa_actual} de requisitos}}}} \\")
        estado = f["estado"]
        clase = ESTADO_CLASE[estado]
        salida.append(
            rf"{escapar(f['codigo'])} & {escapar(f['riesgo'])} & {f['prob_cual']} & "
            rf"{int(f['prob_pct'])} & {fmt_decimal(f['impacto_dias'], 1)} & "
            rf"{fmt_decimal(f['pi'])} & {fmt_tex(f['costo_error'])} & "
            rf"{fmt_tex(f['exposicion'])} & \cellcolor{{{clase}}}{estado} & "
            rf"{miles_tex(escapar(f['mitigacion']))} & {escapar(f['artefacto'])} \\")
    salida.append(r"\end{longtable}")
    salida.append(r"}")
    salida.append(r"\end{landscape}")
    return "\n".join(salida)


def tabla_resumen(filas: list[dict]) -> str:
    salida = []
    salida.append(r"{\footnotesize\setlength{\tabcolsep}{3pt}")
    salida.append(r"\begin{longtable}{L{2.0cm} R{1.0cm} R{1.5cm} R{1.4cm} R{1.65cm} R{1.7cm} R{1.8cm} R{2.2cm}}")
    salida.append(r"\caption{Distribución de los riesgos registrados por etapa y estado.}")
    salida.append(r"\label{tab:riesgos-resumen}\\")
    salida.append(r"\toprule")
    salida.append(r"\textbf{Etapa} & \textbf{Total} & \textbf{Resuelto} & \textbf{En proceso} & "
                  r"\textbf{Pendiente} & \textbf{Retrasado} & \textbf{P-I acum.} & "
                  r"\textbf{Exposición acum.} \\")
    salida.append(r"\midrule")
    salida.append(r"\endfirsthead")
    salida.append(r"\toprule")
    salida.append(r"\textbf{Etapa} & \textbf{Total} & \textbf{Resuelto} & \textbf{En proceso} & "
                  r"\textbf{Pendiente} & \textbf{Retrasado} & \textbf{P-I acum.} & "
                  r"\textbf{Exposición acum.} \\")
    salida.append(r"\midrule")
    salida.append(r"\endhead")
    salida.append(r"\bottomrule")
    salida.append(r"\endfoot")
    for etapa in ETAPAS:
        grupo = [f for f in filas if f["etapa"] == etapa]
        salida.append(
            rf"{etapa} & {len(grupo)} & "
            rf"{sum(1 for f in grupo if f['estado'] == 'resuelto')} & "
            rf"{sum(1 for f in grupo if f['estado'] == 'en proceso')} & "
            rf"{sum(1 for f in grupo if f['estado'] == 'pendiente')} & "
            rf"{sum(1 for f in grupo if f['estado'] == 'retrasado')} & "
            rf"{fmt_decimal(sum(f['pi'] for f in grupo))} & "
            rf"{fmt_tex(sum(f['exposicion'] for f in grupo))} \\")
    salida.append(r"\midrule")
    salida.append(
        rf"\textbf{{Total}} & \textbf{{{len(filas)}}} & "
        rf"\textbf{{{sum(1 for f in filas if f['estado'] == 'resuelto')}}} & "
        rf"\textbf{{{sum(1 for f in filas if f['estado'] == 'en proceso')}}} & "
        rf"\textbf{{{sum(1 for f in filas if f['estado'] == 'pendiente')}}} & "
        rf"\textbf{{{sum(1 for f in filas if f['estado'] == 'retrasado')}}} & "
        rf"\textbf{{{fmt_decimal(sum(f['pi'] for f in filas))}}} & "
        rf"\textbf{{{fmt_tex(sum(f['exposicion'] for f in filas))}}} \\")
    salida.append(r"\end{longtable}")
    salida.append(r"}")
    return "\n".join(salida)


def tabla_top(filas: list[dict]) -> str:
    top = ordenar(filas)[:10]
    salida = []
    salida.append(r"{\footnotesize\setlength{\tabcolsep}{2pt}")
    salida.append(r"\begin{longtable}{R{0.7cm} L{2.2cm} L{4.0cm} R{0.9cm} R{1.1cm} R{1.0cm} R{1.4cm} R{1.9cm} R{1.5cm}}")
    salida.append(r"\caption{Los diez riesgos con mayor índice P-I y su aporte al colchón del proyecto.}")
    salida.append(r"\label{tab:riesgos-top10}\\")
    salida.append(r"\toprule")
    salida.append(r"\textbf{\#} & \textbf{Código} & \textbf{Riesgo (síntesis)} & \textbf{P (\%)} & "
                  r"\textbf{I (días)} & \textbf{P-I} & \textbf{Costo} & "
                  r"\textbf{Exposición} & \textbf{Acum.} \\")
    salida.append(r"\midrule")
    salida.append(r"\endfirsthead")
    salida.append(r"\toprule")
    salida.append(r"\textbf{\#} & \textbf{Código} & \textbf{Riesgo (síntesis)} & \textbf{P (\%)} & "
                  r"\textbf{I (días)} & \textbf{P-I} & \textbf{Costo} & "
                  r"\textbf{Exposición} & \textbf{Acum.} \\")
    salida.append(r"\midrule")
    salida.append(r"\endhead")
    salida.append(r"\bottomrule")
    salida.append(r"\endfoot")
    acumulado = 0.0
    for i, f in enumerate(top, start=1):
        acumulado += f["pi"]
        salida.append(
            rf"{i} & {escapar(f['codigo'])} & {escapar(f['sintesis'])} & "
            rf"{int(f['prob_pct'])} & {fmt_decimal(f['impacto_dias'], 1)} & "
            rf"{fmt_decimal(f['pi'])} & {fmt_tex(f['costo_error'])} & "
            rf"{fmt_tex(f['exposicion'])} & {fmt_decimal(acumulado)} \\")
    salida.append(r"\midrule")
    salida.append(
        rf"\multicolumn{{8}}{{r}}{{\textbf{{Colchón de exposición bruta (suma P-I)}}}} & "
        rf"\textbf{{{fmt_decimal(acumulado)}}} \\")
    salida.append(r"\end{longtable}")
    salida.append(r"}")
    return "\n".join(salida)


def tabla_plan(filas: list[dict]) -> str:
    top = ordenar(filas)[:10]
    salida = []
    salida.append(r"\begin{landscape}")
    salida.append(r"{\footnotesize\setlength{\tabcolsep}{3pt}\renewcommand{\arraystretch}{1.1}")
    salida.append(r"\begin{longtable}{L{2.4cm} L{3.0cm} L{5.5cm} L{2.3cm} L{3.3cm} L{3.5cm} R{1.6cm}}")
    salida.append(r"\caption{Plan de mitigación y seguimiento de los diez riesgos principales.}")
    salida.append(r"\label{tab:riesgos-plan}\\")
    salida.append(r"\toprule")
    salida.append(r"\textbf{Código} & \textbf{Riesgo} & \textbf{Acción de mitigación} & "
                  r"\textbf{Responsable} & \textbf{Disparador} & \textbf{Indicador de cierre} & "
                  r"\textbf{P res. (\%)} \\")
    salida.append(r"\midrule")
    salida.append(r"\endfirsthead")
    salida.append(r"\toprule")
    salida.append(r"\textbf{Código} & \textbf{Riesgo} & \textbf{Acción de mitigación} & "
                  r"\textbf{Responsable} & \textbf{Disparador} & \textbf{Indicador de cierre} & "
                  r"\textbf{P res. (\%)} \\")
    salida.append(r"\midrule")
    salida.append(r"\endhead")
    salida.append(r"\bottomrule")
    salida.append(r"\endfoot")
    for f in top:
        salida.append(
            rf"{escapar(f['codigo'])} & {escapar(f['sintesis'])} & "
            rf"{miles_tex(escapar(f['mitigacion']))} & {escapar(f['responsable'])} & "
            rf"{escapar(f['disparador'])} & {escapar(f['indicador'])} & "
            rf"{int(f['prob_residual'])} \\")
    salida.append(r"\end{longtable}")
    salida.append(r"}")
    salida.append(r"\end{landscape}")
    return "\n".join(salida)


def macros(filas: list[dict]) -> str:
    top = ordenar(filas)[:10]
    total = len(filas)
    resueltos = sum(1 for f in filas if f["estado"] == "resuelto")
    en_proceso = sum(1 for f in filas if f["estado"] == "en proceso")
    pendientes = sum(1 for f in filas if f["estado"] == "pendiente")
    retrasados = sum(1 for f in filas if f["estado"] == "retrasado")
    criticos = sum(1 for f in filas if f["banda"] == "Crítico")
    altos = sum(1 for f in filas if f["banda"] == "Alto")
    medios = sum(1 for f in filas if f["banda"] == "Medio")
    bajos = sum(1 for f in filas if f["banda"] == "Bajo")
    exposicion = sum(f["exposicion"] for f in filas)
    colchon = sum(f["pi"] for f in top)
    residual = sum(f["pi_residual"] for f in top)
    pct_colchon = colchon / JORNADAS_PROYECTO * 100
    pct_residual = residual / JORNADAS_PROYECTO * 100
    ahorro = colchon - residual

    def m(nombre, valor):
        return rf"\newcommand{{\{nombre}}}{{{valor}}}"

    lineas = [r"% Macros e indicadores calculados por scripts/generar_riesgos.py"]
    lineas.append(m("RiesgosTotal", total))
    lineas.append(m("RiesgosResueltos", resueltos))
    lineas.append(m("RiesgosEnProceso", en_proceso))
    lineas.append(m("RiesgosPendientes", pendientes))
    lineas.append(m("RiesgosRetrasados", retrasados))
    lineas.append(m("RiesgosCriticos", criticos))
    lineas.append(m("RiesgosAltos", altos))
    lineas.append(m("RiesgosMedios", medios))
    lineas.append(m("RiesgosBajos", bajos))
    lineas.append(m("RiesgosAbiertos", total - resueltos))
    lineas.append(m("ExposicionTotal", fmt_tex(exposicion)))
    lineas.append(m("ColchonBruto", fmt_decimal(colchon)))
    lineas.append(m("ColchonResidual", fmt_decimal(residual)))
    lineas.append(m("ColchonAhorro", fmt_decimal(ahorro)))
    lineas.append(m("ColchonPorcentaje", fmt_decimal(pct_colchon, 1)))
    lineas.append(m("ColchonResidualPorcentaje", fmt_decimal(pct_residual, 1)))
    lineas.append(m("JornadasProyecto", JORNADAS_PROYECTO))
    return "\n".join(lineas)


def generar_md(filas: list[dict]) -> str:
    top = ordenar(filas)[:10]
    exposicion = sum(f["exposicion"] for f in filas)
    colchon = sum(f["pi"] for f in top)
    residual = sum(f["pi_residual"] for f in top)
    lineas = [
        "# Registro de riesgos asociados a los requisitos — RedPepper",
        "",
        "Generado desde `plantillas/registro_riesgos.csv` con `scripts/generar_riesgos.py`.",
        "No editar este archivo a mano: modificar el CSV y volver a ejecutar el script.",
        "",
        "## Resumen",
        "",
        f"- Riesgos registrados: **{len(filas)}**",
        f"- Estado: resuelto {sum(1 for f in filas if f['estado']=='resuelto')}, "
        f"en proceso {sum(1 for f in filas if f['estado']=='en proceso')}, "
        f"pendiente {sum(1 for f in filas if f['estado']=='pendiente')}, "
        f"retrasado {sum(1 for f in filas if f['estado']=='retrasado')}",
        f"- Exposición total: **S/ {fmt_entero(exposicion)}**",
        f"- Colchón bruto (suma P-I de los 10 principales): **{fmt_decimal(colchon)} días**",
        f"- Colchón residual con mitigación: **{fmt_decimal(residual)} días**",
        "",
        "## Los diez riesgos principales",
        "",
        "| # | Código | Riesgo | P (%) | Impacto (d) | P-I | Exposición (S/) |",
        "|---:|---|---|---:|---:|---:|---:|",
    ]
    for i, f in enumerate(top, start=1):
        lineas.append(
            f"| {i} | {f['codigo']} | {f['riesgo']} | {int(f['prob_pct'])} | "
            f"{fmt_decimal(f['impacto_dias'],1)} | {fmt_decimal(f['pi'])} | "
            f"{fmt_entero(f['exposicion'])} |")
    lineas += ["", "## Registro completo", "",
               "| ID | Código | Etapa | Riesgo | P (%) | I (d) | P-I | Costo (S/) | Exposición (S/) | Estado |",
               "|---|---|---|---|---:|---:|---:|---:|---:|---|"]
    for f in filas:
        lineas.append(
            f"| {f['id']} | {f['codigo']} | {f['etapa']} | {f['riesgo']} | "
            f"{int(f['prob_pct'])} | {fmt_decimal(f['impacto_dias'],1)} | {fmt_decimal(f['pi'])} | "
            f"{fmt_entero(f['costo_error'])} | {fmt_entero(f['exposicion'])} | {f['estado']} |")
    return "\n".join(lineas) + "\n"


def main() -> None:
    filas = cargar()
    destino = TEX.parent
    destino.mkdir(parents=True, exist_ok=True)

    cabecera = "\n".join([
        "% =====================================================================",
        "%  {nombre} — GENERADO AUTOMÁTICAMENTE",
        "%  Fuente: plantillas/registro_riesgos.csv",
        "%  Regenerar con: python3 scripts/generar_riesgos.py  (o make riesgos)",
        "%  No editar a mano: cualquier cambio se pierde al regenerar.",
        "% =====================================================================",
        "",
    ])

    def escribir(nombre: str, cuerpo: str) -> None:
        ruta = destino / nombre
        ruta.write_text(cabecera.format(nombre=nombre) + cuerpo + "\n", encoding="utf-8")
        print(f"OK: {ruta.relative_to(RAIZ)}")

    escribir("riesgos-macros.tex", macros(filas))
    escribir("riesgos-tabla-resumen.tex", tabla_resumen(filas))
    escribir("riesgos-tabla-registro.tex", tabla_registro(filas))
    escribir("riesgos-tabla-top10.tex", tabla_top(filas))
    escribir("riesgos-tabla-plan.tex", tabla_plan(filas))

    MD.write_text(generar_md(filas), encoding="utf-8")
    print(f"OK: {MD.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
