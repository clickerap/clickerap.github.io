// Uiterlijk: het console-commando, de tabs, en elk ding dat je kunt kiezen.

import { test } from "node:test";
import assert from "node:assert/strict";
import { openSpel } from "./hulp.mjs";
import { UITERLIJK, ALLE_SKINS, GROEPEN } from "../../js/data/uiterlijk.js";

test("met de console speel je alles van Uiterlijk vrij, en alles is te kiezen", async () => {
  const { page, context, fouten } = await openSpel();
  await page.click("#btn-meer");
  for (let i = 0; i < 7; i++) await page.click("#versie");
  await page.fill("#cheat-in", "skins");
  await page.press("#cheat-in", "Enter");
  assert.match(await page.textContent("#cheat-uit"), /vrijgegeven/);
  await page.waitForFunction((n) => document.querySelector("#uiterlijk-telling")?.textContent.startsWith(`${n} van`), ALLE_SKINS.length);

  for (const soort of Object.keys(UITERLIJK)) {
    // Eerst de groep, dan de soort.
    await page.click(`[data-groep="${GROEPEN.find((g) => g.soorten.includes(soort)).id}"]`);
    await page.click(`[data-toon="${soort}"]`);
    assert.equal(await page.locator(".skinrij .skin.op-slot").count(), 0, soort);
    for (const skin of UITERLIJK[soort]) {
      await page.click(`.skin[data-soort="${soort}"][data-id="${skin.id}"]`);
      assert.equal(await page.getAttribute(`.skin[data-soort="${soort}"][data-id="${skin.id}"]`, "aria-pressed"), "true", `${soort}:${skin.id}`);
      // Een opstartscherm toont zich meteen als voorbeeld; Escape slaat het over.
      if (soort === "opstart" && skin.id !== "geen") {
        await page.waitForSelector("dialog.opstart");
        await page.keyboard.press("Escape");
        await page.waitForSelector("dialog.opstart", { state: "detached" });
      }
    }
  }
  // De laatste keuzes staan ook echt op de pagina.
  assert.equal(await page.getAttribute("body", "data-achtergrond"), UITERLIJK.achtergrond.at(-1).id);
  const laatste = UITERLIJK.titel.at(-1);
  assert.equal((await page.textContent("#titelbadge")).trim(), `${laatste.icoon} ${laatste.naam}`);
  assert.match(await page.getAttribute("#titelbadge", "class"), new RegExp(`rang-${laatste.rang}`));
  assert.equal(await page.getAttribute("body", "data-paneel"), UITERLIJK.paneel.at(-1).id);
  assert.equal(await page.getAttribute("body", "data-accent"), UITERLIJK.accent.at(-1).id);
  assert.equal(await page.getAttribute("body", "data-melding"), UITERLIJK.melding.at(-1).id);
  assert.equal(await page.getAttribute("body", "data-cursor"), UITERLIJK.cursor.at(-1).id);
  assert.equal(await page.getAttribute("#serge", "data-houding"), UITERLIJK.houding.at(-1).id);
  // Elke aanwijzer is een plaatje dat echt laadt.
  const kapot = await page.evaluate(async (ids) => {
    const uit = [];
    for (const id of ids) {
      const img = new Image();
      img.src = `img/cursor/${id}.svg`;
      try {
        await img.decode();
      } catch {
        uit.push(id);
      }
    }
    return uit;
  }, UITERLIJK.cursor.filter((c) => c.punt).map((c) => c.id));
  assert.deepEqual(kapot, []);
  await page.click("#skin-verras");
  assert.deepEqual(fouten, []);
  await context.close();
});

test("het maatje praat, en door zijn ballon heen klik je gewoon op Serge", async () => {
  const { page, context, fouten } = await openSpel();
  await page.evaluate(async () => {
    const { G } = await import("/js/state.js");
    const { emit } = await import("/js/bus.js");
    G.skins["maatje:eend"] = true;
    G.uiterlijk.maatje = "eend";
    emit("uiterlijk");
  });
  // Het maatje dobbert altijd; daarom geforceerd klikken.
  await page.click("#maatje", { force: true });
  assert.equal(await page.isVisible("#maatje-ballon"), true);
  assert.ok((await page.textContent("#maatje-ballon")).length > 5);
  const voor = await page.evaluate(async () => (await import("/js/state.js")).G.stats.clicks);
  const ballon = await page.locator("#maatje-ballon").boundingBox();
  await page.mouse.click(ballon.x + 20, ballon.y + ballon.height / 2);
  const na = await page.evaluate(async () => (await import("/js/state.js")).G.stats.clicks);
  assert.equal(na, voor + 1, "de klik ging naar Serge");
  assert.deepEqual(fouten, []);
  await context.close();
});

test("elk paneelthema houdt de panelen op één lijn, en de ballon van het maatje leesbaar", async () => {
  for (const viewport of [{ width: 1400, height: 900 }, { width: 1100, height: 900 }]) {
    const { page, context, fouten } = await openSpel({ viewport });
    for (const paneel of UITERLIJK.paneel) {
      await page.evaluate(async (id) => {
        const { G } = await import("/js/state.js");
        const { emit } = await import("/js/bus.js");
        G.skins[`paneel:${id}`] = true;
        G.skins["maatje:eend"] = true;
        Object.assign(G.uiterlijk, { paneel: id, maatje: "eend" });
        emit("uiterlijk");
      }, paneel.id);
      const maat = await page.evaluate(() => Object.fromEntries([".stage", ".status", ".panel"].map((sel) => {
        const r = document.querySelector(sel).getBoundingClientRect();
        return [sel, { boven: Math.round(r.top), onder: Math.round(r.bottom) }];
      })));
      // Drie kolommen: alle drie gelijk. Twee kolommen: Serge en het paneel
      // beginnen gelijk, de cijfers en het paneel eindigen gelijk.
      if (viewport.width >= 1220) {
        assert.ok(Math.abs(maat[".panel"].boven - maat[".stage"].boven) <= 1, `${paneel.id}: paneel begint op ${maat[".panel"].boven}, Serge op ${maat[".stage"].boven}`);
        assert.ok(Math.abs(maat[".panel"].onder - maat[".stage"].onder) <= 1, `${paneel.id}: paneel eindigt op ${maat[".panel"].onder}, Serge op ${maat[".stage"].onder}`);
        assert.ok(Math.abs(maat[".status"].boven - maat[".stage"].boven) <= 1, `${paneel.id}: de cijfers beginnen lager`);
      } else {
        assert.ok(Math.abs(maat[".panel"].boven - maat[".stage"].boven) <= 1, `${paneel.id} (smal): paneel begint op ${maat[".panel"].boven}`);
        assert.ok(Math.abs(maat[".panel"].onder - maat[".status"].onder) <= 1, `${paneel.id} (smal): paneel eindigt op ${maat[".panel"].onder}`);
      }
      await page.click("#maatje", { force: true });
      const kleur = await page.evaluate(() => getComputedStyle(document.getElementById("maatje-ballon")).color);
      assert.equal(kleur, "rgb(16, 35, 60)", `${paneel.id}: de tekst in de ballon`);
    }
    assert.deepEqual(fouten, []);
    await context.close();
  }
});

test("het logo schrijft de naam anders, maar heet voor een schermlezer nog altijd Serge Clicker", async () => {
  const { page, context, fouten } = await openSpel();
  const zet = (u) => page.evaluate(async (u) => {
    const { G } = await import("/js/state.js");
    const { emit } = await import("/js/bus.js");
    for (const [soort, id] of Object.entries(u)) G.skins[`${soort}:${id}`] = true;
    Object.assign(G.uiterlijk, u);
    emit("uiterlijk");
  }, u);
  await zet({ logo: "leet" });
  assert.equal((await page.textContent("#wordmark")).trim(), "S3RG3 CL1CK3R");
  assert.equal(await page.getAttribute("#wordmark", "aria-label"), "Serge Clicker");
  await zet({ logo: "golf" });
  assert.equal(await page.locator("#wordmark i").count(), "SergeClicker".length, "elke letter apart");

  // Een gouden packet volgt Uiterlijk, een rood packet blijft rood.
  await zet({ packet: "serge" });
  const verschijn = (hazard) => page.evaluate(async (hazard) => {
    const { emit } = await import("/js/bus.js");
    document.querySelector(".packet")?.remove();
    emit("golden:spawn", { hazard, lifetimeMs: 60000, spawnedAt: Date.now() });
    const el = document.querySelector(".packet:last-of-type");
    return { klasse: el.className, tekst: el.textContent, beeld: el.style.backgroundImage };
  }, hazard);
  const goud = await verschijn(false);
  assert.match(goud.klasse, /stijl-serge/);
  assert.match(goud.beeld, /serge/);
  await page.evaluate(() => document.querySelector(".packet")?.click());
  const rood = await verschijn(true);
  assert.equal(rood.klasse, "packet rood");
  assert.equal(rood.tekst, "🚨");
  assert.equal(rood.beeld, "");
  assert.deepEqual(fouten, []);
  await context.close();
});

test("een reeks snelle kliks komt in beeld en telt als beste reeks", async () => {
  const { page, context, fouten } = await openSpel();
  await page.evaluate(async () => {
    const { G } = await import("/js/state.js");
    const { emit } = await import("/js/bus.js");
    G.skins["combo:sport"] = true;
    G.uiterlijk.combo = "sport";
    emit("uiterlijk");
  });
  const serge = await page.locator("#serge").boundingBox();
  for (let i = 0; i < 12; i++) {
    await page.mouse.click(serge.x + serge.width / 2, serge.y + serge.height / 2);
    await page.waitForTimeout(60);
  }
  assert.equal(await page.isVisible("#combo"), true);
  assert.equal(await page.getAttribute("#combo", "data-combo"), "sport");
  assert.match(await page.textContent("#combo"), /12 op rij/);
  assert.match(await page.textContent("#combo"), /Mooie reeks!/, "de tekst van de mijlpaal van tien");
  assert.ok(await page.evaluate(async () => (await import("/js/state.js")).G.stats.besteReeks) >= 12);
  // Even niet klikken, en de reeks is voorbij.
  await page.waitForSelector("#combo", { state: "hidden", timeout: 3000 });
  assert.deepEqual(fouten, []);
  await context.close();
});

test("het opstartscherm ligt over het spel, en vensters wachten tot het weg is", async () => {
  const { page, context, fouten } = await openSpel({
    saves: {
      sergeClicker: `({ version: 5, packets: 5000, buildings: { patchkabel: 10 }, stats: { lifetime: 1e6 },
        skins: ["opstart:ios"], uiterlijk: { opstart: "ios" }, lastSeen: nu - 3 * 3600 * 1000 })`,
    },
  });
  // Het scherm is er, en "Welkom terug" wacht.
  await page.waitForSelector("dialog.opstart[data-opstart='ios']");
  assert.equal(await page.locator("#modal[open]").count(), 0);
  await page.waitForFunction(() => document.querySelector(".op-console")?.textContent.includes("Bootstrap"));
  await page.keyboard.press("Enter");
  await page.waitForSelector("dialog.opstart", { state: "detached" });
  await page.waitForSelector("#modal[open]");
  assert.match(await page.textContent("#modal-title"), /Welkom terug/);
  assert.deepEqual(fouten, []);
  await context.close();
});

test("elk muziekje speelt zonder fouten, en zachter dan een klik", async () => {
  const { page, context, fouten } = await openSpel();
  const niveaus = await page.evaluate(async () => {
    const { speelOffline, NUMMER_IDS } = await import("/js/ui/muziek.js");
    const uit = {};
    for (const id of NUMMER_IDS) {
      const seconden = 8;
      const ac = new OfflineAudioContext(1, 22050 * seconden, 22050);
      const maten = speelOffline(ac, id, seconden);
      const data = (await ac.startRendering()).getChannelData(0);
      let piek = 0;
      let som = 0;
      for (let i = 22050 * 2; i < data.length; i++) {
        piek = Math.max(piek, Math.abs(data[i]));
        som += data[i] * data[i];
      }
      uit[id] = { maten, piek, rms: Math.sqrt(som / (data.length - 22050 * 2)) };
    }
    return uit;
  });
  const { MUZIEK } = await import("../../js/data/uiterlijk.js");
  for (const m of MUZIEK) {
    if (m.id === "geen") continue;
    const n = niveaus[m.id];
    assert.ok(n, `${m.id} bestaat als nummer`);
    assert.ok(n.maten >= 2, `${m.id}: ${n.maten} maten`);
    assert.ok(n.rms > 0.004, `${m.id} is te horen (${n.rms.toFixed(4)})`);
    assert.ok(n.piek < 0.35, `${m.id} blijft zacht (piek ${n.piek.toFixed(3)})`);
  }
  assert.deepEqual(fouten, []);
  await context.close();
});
