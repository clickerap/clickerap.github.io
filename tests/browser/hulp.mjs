// Gedeelde opzet voor de browsertests: een lokale server en Chromium.
// Eerst eenmalig: npx playwright install chromium

import { before, after } from "node:test";
import { chromium } from "playwright";
import { startServer } from "../../tools/serve.mjs";

export const omgeving = { url: null, browser: null };
let server;

before(async () => {
  server = await startServer();
  omgeving.url = server.url;
  omgeving.browser = await chromium.launch();
});

after(async () => {
  await omgeving.browser?.close();
  await server?.stop();
});

// Opent het spel in een nieuw browserprofiel. `saves` zet localStorage klaar
// vóór het eerste laden (niet bij herladen); functies worden als waarde van
// die sleutel uitgerekend, met `nu` als het huidige tijdstip.
export async function openSpel({ saves = {}, viewport = { width: 1400, height: 900 }, mobiel = false, voorLaden } = {}) {
  const context = await omgeving.browser.newContext({ viewport, hasTouch: mobiel, isMobile: mobiel });
  await context.addInitScript((saves) => {
    if (sessionStorage.getItem("gezaaid")) return;
    sessionStorage.setItem("gezaaid", "1");
    for (const [sleutel, maak] of Object.entries(saves)) {
      localStorage.setItem(sleutel, JSON.stringify(new Function("nu", `return (${maak});`)(Date.now())));
    }
  }, saves);
  if (voorLaden) await context.addInitScript(voorLaden);
  const page = await context.newPage();
  const fouten = [];
  page.on("pageerror", (e) => fouten.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") fouten.push(`console: ${m.text()}`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400) fouten.push(`${r.status()}: ${r.url()}`);
  });
  await page.goto(omgeving.url);
  // Niet op window.serge alleen wachten: dat is ook de knop met id="serge".
  await page.waitForFunction(() => typeof window.serge?.pps === "number");
  return { page, context, fouten };
}

// De levende spelstaat, rechtstreeks uit de module van het spel.
export function staat(page) {
  return page.evaluate(async () => {
    const { G, D } = await import("/js/state.js");
    return {
      packets: G.packets,
      buyAmount: G.options.buyAmount,
      buildings: { ...G.buildings },
      pps: D.pps,
      buffs: G.buffs.map((b) => b.id),
      clicks: G.stats.clicks,
      goldenClicks: G.stats.goldenClicks,
    };
  });
}
