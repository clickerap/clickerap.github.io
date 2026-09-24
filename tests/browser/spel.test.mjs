// De bugs uit "Verbeterpunten Serge Clicker", nagespeeld in Chromium.

import { test } from "node:test";
import assert from "node:assert/strict";
import { openSpel, staat } from "./hulp.mjs";

const RUST = `{ version: 3, packets: 1e6, buildings: { patchkabel: 5, switch: 1 }, seen: ["patchkabel", "switch"], stats: { lifetime: 1e6, clicks: 50 }, lastSeen: nu }`;

test("het spel start zonder fouten, ook de lettertypes en foto's laden", async () => {
  const { page, context, fouten } = await openSpel();
  await page.click("#serge");
  await page.waitForTimeout(300);
  assert.deepEqual(fouten, []);
  assert.ok(await page.evaluate(() => document.fonts.check("16px 'IBM Plex Sans'")));
  assert.ok(await page.evaluate(() => document.getElementById("serge-img").naturalWidth > 0));
  await context.close();
});

test("bug 1: wisselen van bestand laat het doelbestand heel", async () => {
  const { page, context } = await openSpel({
    saves: {
      sergeClicker: `{ version: 3, packets: 11111, options: { netwerknaam: "BESTAND-EEN" }, lastSeen: nu }`,
      "sergeClicker:2": `{ version: 3, packets: 22222, options: { netwerknaam: "BESTAND-TWEE" }, lastSeen: nu }`,
    },
  });
  await page.click("#btn-meer");
  await Promise.all([page.waitForNavigation(), page.selectOption("#opt-slot", "2")]);
  await page.waitForFunction(() => typeof window.serge?.pps === "number");
  assert.equal(await page.textContent("#netwerknaam"), "BESTAND-TWEE");
  const een = await page.evaluate(() => JSON.parse(localStorage.getItem("sergeClicker")).options.netwerknaam);
  assert.equal(een, "BESTAND-EEN");
  await context.close();
});

test("bug 2: het prestatiefilter laat de winkel met rust", async () => {
  const { page, context } = await openSpel({ saves: { sergeClicker: RUST } });
  await page.click('button[data-tab="prestaties"]');
  await page.click('#ach-filter button[data-filter="open"]');
  assert.equal(await page.getAttribute('#ach-filter button[data-filter="open"]', "aria-pressed"), "true");
  await page.click('button[data-tab="winkel"]');
  assert.equal((await staat(page)).buyAmount, 1);
  await page.click(".shopitem", { force: true });
  const na = await staat(page);
  assert.ok(Number.isFinite(na.packets));
  assert.equal(na.buildings.patchkabel, 6);
  await context.close();
});

test("bug 3: een code met HTML erin voert niets uit", async () => {
  const { page, context } = await openSpel({ saves: { sergeClicker: RUST } });
  const save = {
    version: 3, packets: 1e6, buildings: { switch: 1 }, stats: { lifetime: 1e6 }, lastSeen: Date.now(),
    options: { netwerknaam: "<img src=x onerror=\"window.__xss=1\">" },
    minigames: { laatste: "cli", cli: { hostname: "<b>", opdracht: { poort: "<img src=x onerror=\"window.__xss=1\">", ip: "10.1.1.1", mask: "255.255.255.0" } } },
  };
  const code = "SERGE1:" + Buffer.from(JSON.stringify(save)).toString("base64");
  await page.click("#btn-meer");
  await page.click("#btn-import");
  await page.fill("#import-veld", code);
  await Promise.all([page.waitForNavigation(), page.click("#modal-actions button:last-child")]);
  await page.waitForFunction(() => typeof window.serge?.pps === "number");
  await page.click('button[data-tab="labo"]');
  await page.waitForSelector("#term-opdracht");
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => window.__xss), undefined);
  assert.match(await page.textContent("#term-opdracht"), /Zet gi0\/\d/);
  assert.match(await page.textContent("#prompt"), /^SERGE/);
  await context.close();
});

test("een ongeldige code houdt het venster open met een melding", async () => {
  const { page, context } = await openSpel({ saves: { sergeClicker: RUST } });
  await page.click("#btn-meer");
  await page.click("#btn-import");
  await page.fill("#import-veld", "dit is niks");
  await page.click("#modal-actions button:last-child");
  assert.ok(await page.evaluate(() => document.getElementById("modal").open));
  assert.match(await page.textContent("#import-fout"), /geen Serge Clicker-code/);
  assert.equal(await page.inputValue("#import-veld"), "dit is niks");
  await context.close();
});

test("bug 4: een straf blijft na herladen werken", async () => {
  const { page, context } = await openSpel({
    saves: { sergeClicker: `{ version: 3, buildings: { switch: 100 }, seen: ["patchkabel", "switch"], stats: { lifetime: 1e6 }, buffs: [{ id: "congestie", until: nu + 120000 }], lastSeen: nu }` },
  });
  assert.ok(Math.abs((await staat(page)).pps - 54) < 1e-9);
  await page.reload();
  await page.waitForFunction(() => typeof window.serge?.pps === "number");
  const na = await staat(page);
  assert.deepEqual(na.buffs, ["congestie"]);
  assert.ok(Math.abs(na.pps - 54) < 1e-9, `pps is ${na.pps}`);
  await context.close();
});

test("bug 6: spatie en Enter zijn geen autoclicker, en spatie bedient knoppen", async () => {
  const { page, context } = await openSpel({ saves: { sergeClicker: RUST } });
  const voor = await staat(page);
  await page.evaluate(() => {
    for (let i = 0; i < 30; i++) document.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", key: " ", repeat: i > 0, bubbles: true }));
  });
  assert.equal((await staat(page)).clicks - voor.clicks, 1);

  await page.focus("#serge");
  for (let i = 0; i < 20; i++) await page.keyboard.down("Enter");
  await page.keyboard.up("Enter");
  assert.equal((await staat(page)).clicks - voor.clicks, 2);

  await page.focus(".shopitem");
  await page.keyboard.press("Space");
  assert.equal((await staat(page)).buildings.patchkabel, 6);
  await context.close();
});

test("bug 7: de overhoring tekent niet over een andere opdracht heen", async () => {
  const { page, context } = await openSpel({
    saves: { sergeClicker: `{ version: 3, packets: 1e6, buildings: { switch: 1 }, stats: { lifetime: 1e6 }, minigames: { laatste: "quiz" }, lastSeen: nu }` },
  });
  await page.click('button[data-tab="labo"]');
  await page.click(".quiz-optie");
  await page.click('#labo-picker button[data-id="cli"]');
  await page.waitForTimeout(3500);
  assert.equal(await page.textContent("#labo-stage h3"), "Terminal");
  await context.close();
});

test("bug 10: je kunt terugscrollen in de terminal", async () => {
  const { page, context } = await openSpel({
    saves: { sergeClicker: `{ version: 3, packets: 1e6, buildings: { switch: 1 }, stats: { lifetime: 1e6 }, minigames: { laatste: "cli" }, lastSeen: nu }` },
  });
  await page.click('button[data-tab="labo"]');
  for (let i = 0; i < 6; i++) {
    await page.fill("#term-in", "show running-config");
    await page.press("#term-in", "Enter");
  }
  const bovenaan = await page.evaluate(async () => {
    const term = document.getElementById("term");
    term.scrollTop = 0;
    await new Promise((r) => setTimeout(r, 1500));
    return term.scrollTop;
  });
  assert.equal(bovenaan, 0);
  await context.close();
});

test("bug 12: de afstudeerkaart werkt zichzelf bij", async () => {
  const { page, context } = await openSpel({
    saves: { sergeClicker: `{ version: 3, packets: 0, stats: { lifetime: 2e9 }, lastSeen: nu }` },
  });
  await page.click('button[data-tab="studie"]');
  assert.equal(await page.isDisabled("#graduate-btn"), true);
  await page.evaluate(async () => {
    const { G } = await import("/js/state.js");
    G.stats.lifetime = 3e10;
  });
  await page.waitForTimeout(400);
  assert.equal(await page.isDisabled("#graduate-btn"), false);
  assert.match(await page.textContent("#graduate-btn"), /Afstuderen voor 1 studiepunt/);
  await context.close();
});

test("bug 14: zonder localStorage speelt het spel gewoon", async () => {
  const { page, context, fouten } = await openSpel({
    voorLaden: () => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new DOMException("Opslag geblokkeerd", "SecurityError");
        },
      });
    },
  });
  await page.click("#serge");
  assert.equal((await staat(page)).clicks, 1);
  assert.match(await page.textContent("#toaster"), /Opslaan lukt niet/);
  assert.deepEqual(fouten.filter((f) => f.startsWith("pageerror")), []);
  await context.close();
});

test("een tweede tabblad neemt het spel over zonder voortgang te verliezen", async () => {
  const { page, context } = await openSpel({ saves: { sergeClicker: RUST } });
  await page.evaluate(async () => {
    const { G } = await import("/js/state.js");
    G.packets = 424242;
  });
  const tweede = await context.newPage();
  await tweede.goto(page.url());
  await tweede.waitForFunction(() => typeof window.serge?.pps === "number");
  assert.equal(Math.floor(await tweede.evaluate(() => window.serge.packets)), 424242);
  await page.waitForFunction(() => document.getElementById("modal").open);
  assert.match(await page.textContent("#modal-title"), /ander tabblad/);
  await context.close();
});

test("vensters houden de focus vast en geven hem terug", async () => {
  const { page, context } = await openSpel();
  await page.focus("#btn-help");
  await page.keyboard.press("Enter");
  // Een <dialog> met showModal() maakt de rest van de pagina inert: de focus
  // blijft in het venster, of gaat even naar de browser zelf (body).
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Tab");
    assert.ok(await page.evaluate(() => {
      const actief = document.activeElement;
      return actief === document.body || document.getElementById("modal").contains(actief);
    }));
  }
  await page.keyboard.press("Escape");
  assert.equal(await page.evaluate(() => document.activeElement.id), "btn-help");
  await context.close();
});

test("G pakt een gouden packet", async () => {
  const { page, context } = await openSpel({ saves: { sergeClicker: RUST } });
  await page.evaluate(async () => {
    const { emit } = await import("/js/bus.js");
    emit("golden:spawn", { hazard: false, lifetimeMs: 10000, spawnedAt: Date.now() });
  });
  await page.waitForSelector(".packet");
  await page.keyboard.press("g");
  assert.equal((await staat(page)).goldenClicks, 1);
  await context.close();
});

test("bug 11 en 13: afstuderen geeft de gratis buff en laat het labo stil", async () => {
  const { page, context } = await openSpel({
    saves: {
      sergeClicker: `{ version: 3, packets: 1e6, buildings: { switch: 1, rack: 1 }, stats: { lifetime: 1e11 }, prestige: 1, ects: 0,
        nodes: ["g1", "g2", "g3", "g4", "g5", "g6"], minigames: { laatste: "market" }, lastSeen: nu }`,
    },
  });
  await page.click('button[data-tab="labo"]');
  await page.click('button[data-tab="studie"]');
  await page.click("#graduate-btn");
  await page.click("#modal-actions button:last-child");
  await page.waitForTimeout(300);
  const na = await page.evaluate(async () => {
    const { G } = await import("/js/state.js");
    return { prestige: G.prestige, buffs: G.buffs.length, packets: G.packets, tab: document.querySelector('[aria-selected="true"]').id };
  });
  assert.equal(na.tab, "studie-tab");
  assert.ok(na.prestige > 1);
  assert.ok(na.buffs > 0 || na.packets > 0, "geen gratis buff na het afstuderen");
  const labo = await page.innerHTML("#labo-stage");
  await page.waitForTimeout(5500);
  assert.equal(await page.innerHTML("#labo-stage"), labo);
  await context.close();
});

test("de cursus beloont pas na de leestijd, met een knop onderaan", async () => {
  const { page, context } = await openSpel({
    saves: { sergeClicker: `{ version: 3, packets: 0, stats: { lifetime: 1e4 }, minigames: { laatste: "cursus", cursus: { open: "packets" } }, lastSeen: nu }` },
  });
  await page.click('button[data-tab="labo"]');
  assert.equal(await page.isDisabled("#cursus-gelezen"), true);
  assert.match(await page.textContent("#cursus-gelezen"), /Eerst even lezen/);
  await page.evaluate(() => {
    const echt = Date.now;
    Date.now = () => echt() + 60 * 1000;
  });
  await page.waitForFunction(() => !document.getElementById("cursus-gelezen").disabled);
  await page.click("#cursus-gelezen");
  await page.waitForFunction(() => document.getElementById("cursus-gelezen").textContent.includes("Gelezen"));
  assert.ok((await staat(page)).packets >= 1000);
  await context.close();
});

test("een storing overleeft een herlaadbeurt", async () => {
  const { page, context } = await openSpel({
    saves: { sergeClicker: `{ version: 3, packets: 1e9, buildings: { switch: 10 }, stats: { lifetime: 1e9 }, incident: { id: "dhcp", startedAt: nu, until: nu + 40000, cost: 500 }, lastSeen: nu }` },
  });
  await page.waitForSelector("#incident:not([hidden])");
  assert.match(await page.textContent("#incident-text"), /DHCP/);
  await page.click("#incident-fix");
  await page.waitForSelector("#incident", { state: "hidden" });
  await context.close();
});

test("de markt: kiezen, kopen, een order zetten en verkopen", async () => {
  const { page, context, fouten } = await openSpel({
    saves: { sergeClicker: `{ version: 4, packets: 1e9, buildings: { switch: 100, rack: 1 }, stats: { lifetime: 1e9 }, minigames: { laatste: "market" }, lastSeen: nu }` },
  });
  await page.click('button[data-tab="labo"]');
  await page.click('.beurs-rij[data-goed="gpu"]');
  assert.equal(await page.getAttribute('.beurs-rij[data-goed="gpu"]', "aria-pressed"), "true");
  assert.match(await page.textContent("#beurs-detailnaam"), /GPU-uren/);
  assert.equal(await page.isDisabled('[data-verkoop="1"]'), true);
  await page.click('[data-koop="1"]');
  assert.match(await page.textContent("#beurs-positieregel"), /Je hebt .* aan GPU-uren/);
  assert.notEqual(await page.textContent('.beurs-rij[data-goed="gpu"] .beurs-positie'), "");
  await page.click('[data-order="winst"] [data-waarde="0.25"]');
  assert.equal(await page.getAttribute('[data-order="winst"] [data-waarde="0.25"]', "aria-pressed"), "true");
  assert.match(await page.textContent("#beurs-hint"), /Verkoopt vanzelf bij \+25%/);
  await page.click('[data-verkoop="1"]');
  assert.match(await page.textContent("#beurs-positieregel"), /nog geen GPU-uren/);
  assert.deepEqual(fouten, []);
  await context.close();
});
