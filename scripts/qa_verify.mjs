#!/usr/bin/env node
/**
 * RED PEPPER — Suite Automatizada de Calidad, Responsividad, WCAG 2.2 AA y E2E
 * Conecta directamente con Chromium headless vía CDP sin dependencias externas.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PROTO_DIR = path.join(ROOT, "prototipo");
const INTERFACES_DIR = path.join(ROOT, "interfaces");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const cleanPath = (req.url || "/").split("?")[0];
      const rel = cleanPath === "/" ? "index.html" : cleanPath.replace(/^\/+/, "");
      const filePath = path.join(PROTO_DIR, rel);
      if (!filePath.startsWith(PROTO_DIR) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.events = [];
  }
  async connect() {
    await new Promise((res, rej) => {
      this.ws.addEventListener("open", res, { once: true });
      this.ws.addEventListener("error", rej, { once: true });
    });
    this.ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        this.events.push(msg);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression) {
    const r = await this.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) {
      throw new Error(r.exceptionDetails.text || JSON.stringify(r.exceptionDetails));
    }
    return r.result?.value;
  }
  close() {
    this.ws.close();
  }
}

async function launchChromium() {
  const userDataDir = `/tmp/rp_cdp_${Date.now()}`;
  const proc = spawn(
    "/usr/bin/chromium",
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--remote-debugging-port=9229",
      `--user-data-dir=${userDataDir}`,
      "about:blank",
    ],
    { stdio: "ignore" }
  );
  let targets = [];
  for (let i = 0; i < 40; i++) {
    try {
      const resp = await fetch("http://127.0.0.1:9229/json/list");
      targets = await resp.json();
      if (targets.some((t) => t.type === "page")) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 150));
  }
  const page = targets.find((t) => t.type === "page");
  if (!page) throw new Error("Chromium CDP no inició a tiempo");
  const cdp = new CdpClient(page.webSocketDebuggerUrl);
  await cdp.connect();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  return { proc, cdp, userDataDir };
}

async function run() {
  const { server, baseUrl } = await startServer();
  const { proc, cdp, userDataDir } = await launchChromium();
  const report = {
    viewportsChecked: [],
    accessibilityChecks: [],
    e2eFlows: [],
    screenshots: [],
    consoleErrors: [],
  };

  try {
    const views = [
      { id: "cliente", query: "?view=cliente&capture=1", file: "01-cliente-carta-pedido.png", capHeight: 1120 },
      { id: "pos", query: "?view=pos&capture=1", file: "02-pos-mostrador.png", capHeight: 820 },
      { id: "cocina", query: "?view=cocina&capture=1", file: "03-cocina-comandas.png", capHeight: 820 },
      { id: "admin-margen", query: "?view=admin-margen&capture=1", file: "04-admin-dashboard-margen.png", capHeight: 820 },
      { id: "admin-operaciones", query: "?view=admin-operaciones&capture=1", file: "05-admin-abastecimiento-carta.png", capHeight: 960 },
      { id: "admin-contabilidad", query: "?view=admin-contabilidad&capture=1", file: "06-admin-cierre-niif18-sunat.png", capHeight: 900 },
      { id: "marca", query: "?app=marca&capture=1", file: null, capHeight: 820 },
    ];

    const viewports = [
      { name: "mobile-320", width: 320, height: 640 },
      { name: "mobile-390", width: 390, height: 844 },
      { name: "tablet-768", width: 768, height: 1024 },
      { name: "desktop-1280", width: 1280, height: 800 },
      { name: "wide-1920", width: 1920, height: 1080 },
    ];

    for (const v of views) {
      await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1360, height: v.capHeight, deviceScaleFactor: 1, mobile: false });
      await cdp.send("Page.navigate", { url: `${baseUrl}/${v.query}` });
      await new Promise((r) => setTimeout(r, 350));

      // Captura oficial para LaTeX (1360px escritorio)
      if (v.file) {
        const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
        const outPath = path.join(INTERFACES_DIR, v.file);
        fs.writeFileSync(outPath, Buffer.from(shot.data, "base64"));
        report.screenshots.push({ view: v.id, file: v.file, bytes: fs.statSync(outPath).size });
      }

      // Chequear accesibilidad DOM en escritorio
      const a11y = await cdp.eval(`(() => {
        const brokenImgs = Array.from(document.images).filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src);
        const unlabeledInputs = Array.from(document.querySelectorAll('input, select, textarea')).filter(el => {
          if (el.type === 'hidden') return false;
          const id = el.id;
          const hasFor = id && document.querySelector('label[for="' + id + '"]');
          return !hasFor && !el.getAttribute('aria-label') && !el.closest('label');
        }).map(e => e.id || e.tagName);
        const touchFailures = Array.from(document.querySelectorAll('button, .btn, .chip-btn, .nav-tab')).filter(el => {
          const st = getComputedStyle(el);
          if (st.display === 'none' || st.visibility === 'hidden') return false;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return false;
          const minH = '${v.id}' === 'pos' && (el.classList.contains('btn-touch') || el.classList.contains('pos-chip') || el.classList.contains('touch-48')) ? 48 : 34;
          return r.height < minH;
        }).map(e => ({ text: e.textContent.trim().slice(0, 24), h: Math.round(e.getBoundingClientRect().height) }));
        const hasH1 = document.querySelectorAll('h1').length;
        return { brokenImgs, unlabeledInputs, touchFailures, hasH1 };
      })()`);
      report.accessibilityChecks.push({ view: v.id, ...a11y });

      // Multi-viewport overflow check
      for (const vp of viewports) {
        await cdp.send("Emulation.setDeviceMetricsOverride", {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.width < 768,
        });
        await new Promise((r) => setTimeout(r, 80));
        const ov = await cdp.eval(`({ sw: document.documentElement.scrollWidth, iw: window.innerWidth })`);
        report.viewportsChecked.push({ view: v.id, viewport: vp.name, scrollWidth: ov.sw, innerWidth: ov.iw, pass: ov.sw <= vp.width && ov.iw <= vp.width });
      }
    }

    // E2E 1: Flujo Cliente (detalle modal + Escape + agregar + confirmar -> Cocina Pendiente -> Listo)
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await cdp.send("Page.navigate", { url: `${baseUrl}/?view=cliente&capture=1` });
    await new Promise((r) => setTimeout(r, 250));
    await cdp.eval(`localStorage.clear(); location.reload();`);
    await new Promise((r) => setTimeout(r, 300));

    const orderId = await cdp.eval(`(() => {
      document.querySelector('[data-dish-detail="P-02"]').click();
      const modalOpen = document.getElementById('rp-modal-backdrop').classList.contains('open');
      if (!modalOpen) throw new Error('Modal detalle no abrió');
      document.querySelector('#modal-cremas-picker .crema-tag').click();
      document.getElementById('dish-modal-add').click();
      document.getElementById('btn-client-confirm').click();
      return RP.store.getState().lastClientOrderId;
    })()`);
    await new Promise((r) => setTimeout(r, 150));

    const kdsResult = await cdp.eval(`(() => {
      RP.actions.navigate('cocina', 'kds');
      const btn1 = document.querySelector('[data-kds-adv="${orderId}"]');
      if (!btn1) throw new Error('Comanda ${orderId} no llegó a Pendiente en Cocina');
      btn1.click();
      const btn2 = document.querySelector('[data-kds-adv="${orderId}"]');
      if (!btn2) throw new Error('Comanda ${orderId} no avanzó a En preparación');
      btn2.click();
      return RP.store.getState().orders.find(o => o.id === '${orderId}').estado;
    })()`);
    report.e2eFlows.push({ flow: "Cliente -> Modal cremas -> Cocina KDS Pendiente -> En preparación -> Listo", orderId, finalState: kdsResult, pass: kdsResult === "Listo" });

    // E2E 2: Bloqueo instantáneo de stock (R-ENT2-05)
    const stockSync = await cdp.eval(`(() => {
      document.querySelector('[data-kds-stock="P-01"]').click();
      RP.actions.navigate('pos', 'mostrador');
      const posDisabled = document.querySelector('[data-pos-add="P-01"]').disabled;
      RP.actions.navigate('cliente', 'carta');
      const cliDisabled = document.querySelector('[data-client-add="P-01"]').disabled;
      return { posDisabled, cliDisabled };
    })()`);
    report.e2eFlows.push({ flow: "Bloqueo instantáneo de stock Cocina -> POS y Cliente (R-ENT2-05)", ...stockSync, pass: stockSync.posDisabled && stockSync.cliDisabled });

    // E2E 3: Prorrateo P-14 + Modal edición compra (sin window.prompt) + Cierre de periodo NIIF 18
    const adminCheck = await cdp.eval(`(() => {
      RP.actions.navigate('admin', 'margen');
      const m1 = RP.actions.computeDailyMetrics().cuotaDiaria;
      document.querySelector('[data-toggle-day="vie"]').click();
      const m2 = RP.actions.computeDailyMetrics().cuotaDiaria;
      RP.actions.navigate('admin', 'compras');
      document.querySelector('[data-edit-purchase="CMP-101"]').click();
      const modalTitle = document.getElementById('rp-modal-title').textContent;
      document.getElementById('mf-monto').value = '600.00';
      document.getElementById('mf-motivo').value = 'Ajuste verificado QA';
      document.getElementById('rp-modal-form').requestSubmit();
      const updatedMonto = RP.store.getState().purchases.find(p => p.id === 'CMP-101').monto;
      RP.actions.navigate('admin', 'contabilidad');
      document.getElementById('btn-period-lock').click();
      const adjEnabled = !document.getElementById('btn-adj-note').disabled;
      return { m1, m2, modalTitle, updatedMonto, adjEnabled };
    })()`);
    report.e2eFlows.push({
      flow: "Prorrateo P-14 + Modal corrección compra + Bloqueo periodo NIIF 18",
      ...adminCheck,
      pass: adminCheck.m2 > adminCheck.m1 && adminCheck.updatedMonto === 600 && adminCheck.adjEnabled,
    });

    // Check console errors recorded
    const runtimeErrors = cdp.events
      .filter((e) => e.method === "Runtime.exceptionThrown")
      .map((e) => e.params?.exceptionDetails?.text || "RuntimeException");
    report.consoleErrors = runtimeErrors;

    console.log(JSON.stringify(report, null, 2));

    const failedVp = report.viewportsChecked.filter((v) => !v.pass);
    const failedA11y = report.accessibilityChecks.filter((a) => a.brokenImgs.length || a.unlabeledInputs.length || a.touchFailures.length);
    const failedE2E = report.e2eFlows.filter((f) => !f.pass);

    if (failedVp.length || failedA11y.length || failedE2E.length || runtimeErrors.length) {
      console.error("QA FAILURES:", { failedVp, failedA11y, failedE2E, runtimeErrors });
      process.exitCode = 1;
    } else {
      console.log("ALL QA CHECKS PASSED CLEANLY!");
    }
  } finally {
    cdp.close();
    proc.kill("SIGKILL");
    server.close();
    await new Promise((r) => setTimeout(r, 200));
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {}
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
