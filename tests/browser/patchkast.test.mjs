// De patchkast nagespeeld: kabels slepen met de muis en met het toetsenbord.

import { test } from "node:test";
import assert from "node:assert/strict";
import { openSpel } from "./hulp.mjs";
import { maakPuzzel } from "../../js/minigames/kabelgoot.js";

// Een netwerk met een glasvezel, en één werkorder van 5 bij 5 in de bak.
const saveMet = (zaad) => `{
  version: 5, packets: 1e6, buildings: { switch: 100, fiber: 1 }, seen: ["switch", "fiber"],
  stats: { lifetime: 1e6, clicks: 50 }, lastSeen: nu,
  minigames: { laatste: "patch", patch: { wachtrij: [{ nr: 1, n: 5, zaad: ${zaad} }], volgendeAt: nu + 100000 } },
}`;

async function openKast(zaad) {
  const spel = await openSpel({ saves: { sergeClicker: saveMet(zaad) } });
  await spel.page.click("#labo-tab");
  await spel.page.waitForSelector(".kast-svg");
  // Het bord moet helemaal in beeld staan, anders valt de muis ernaast.
  await spel.page.locator("#kast-bord").scrollIntoViewIfNeeded();
  return spel;
}

// Het midden van een vak op het scherm.
async function midden(page, n, vak) {
  const box = await page.locator(".kast-svg").boundingBox();
  const maat = box.width / n;
  return { x: box.x + ((vak % n) + 0.5) * maat, y: box.y + (Math.floor(vak / n) + 0.5) * maat };
}

async function sleep(page, n, pad) {
  const begin = await midden(page, n, pad[0]);
  await page.mouse.move(begin.x, begin.y);
  await page.mouse.down();
  for (const vak of pad.slice(1)) {
    const punt = await midden(page, n, vak);
    await page.mouse.move(punt.x, punt.y, { steps: 3 });
  }
  await page.mouse.up();
}

const patchStaat = (page) => page.evaluate(async () => {
  const { G } = await import("/js/state.js");
  const p = G.minigames.patch;
  return { gedaan: p.gedaan, huidig: p.huidig, packets: G.packets, achievements: { ...G.achievements } };
});

test("een werkorder met de muis oplossen en opleveren", async () => {
  const zaad = 4242;
  const puzzel = maakPuzzel(5, zaad);
  const { page, context, fouten } = await openKast(zaad);
  assert.equal(await page.isDisabled("#kast-oplever"), true);

  for (const pad of puzzel.oplossing) await sleep(page, 5, pad);
  assert.equal(await page.locator(".kast-led.aan").count(), puzzel.paren.length * 2, "elk lampje brandt");
  assert.match(await page.textContent("#kast-status"), /Luchtdicht/);
  assert.equal(await page.locator(".kast-legende li.aan").count(), puzzel.paren.length);

  // Wat je legt, staat meteen in de spelstaat (en dus in de save).
  const voor = await patchStaat(page);
  assert.equal(voor.huidig.kabels.length, puzzel.paren.length);

  await page.click("#kast-oplever");
  const na = await patchStaat(page);
  assert.equal(na.gedaan, 1);
  assert.equal(na.huidig.klaar, true);
  assert.equal(na.huidig.dicht, true);
  assert.ok(na.packets > voor.packets, "het loon is binnen");
  assert.ok(na.achievements["patch-1"] && na.achievements["patch-luchtdicht"]);
  assert.equal(await page.isVisible("#kast-resultaat"), true);
  assert.match(await page.textContent("#kast-resultaat"), /Opgeleverd/);
  assert.deepEqual(fouten, []);
  await context.close();
});

test("op een kabel beginnen en terugtrekken maakt hem korter", async () => {
  const zaad = 777;
  const puzzel = maakPuzzel(5, zaad);
  const { page, context } = await openKast(zaad);
  const lang = puzzel.oplossing.reduce((a, b) => (b.length > a.length ? b : a));
  const i = puzzel.oplossing.indexOf(lang);
  await sleep(page, 5, lang);
  assert.equal(await page.locator(`.kast-led.aan[data-lamp="${i}"]`).count(), 2);
  // Begin op de kabel zelf en trek hem terug naar zijn begin: hij wordt korter.
  await sleep(page, 5, [lang[2], lang[1], lang[0]]);
  assert.equal(await page.locator(`.kast-led.aan[data-lamp="${i}"]`).count(), 0);
  const staat = await patchStaat(page);
  assert.deepEqual(staat.huidig.kabels[i], []);
  await context.close();
});

test("een kabel leggen met het toetsenbord", async () => {
  const zaad = 31337;
  const puzzel = maakPuzzel(5, zaad);
  const { page, context, fouten } = await openKast(zaad);
  const pad = puzzel.oplossing[0];
  await page.focus("#kast-bord");
  // De cursor staat op de eerste aansluiting linksboven; loop naar het begin van de kabel.
  let cursor = Math.min(puzzel.paren[0].a, puzzel.paren[0].b);
  const loop = async (van, naar) => {
    const toets = naar === van - 5 ? "ArrowUp" : naar === van + 5 ? "ArrowDown" : naar === van - 1 ? "ArrowLeft" : "ArrowRight";
    await page.keyboard.press(toets);
  };
  while (cursor !== pad[0]) {
    const doel = Math.floor(cursor / 5) !== Math.floor(pad[0] / 5) ? cursor + Math.sign(pad[0] - cursor) * 5 : cursor + Math.sign(pad[0] - cursor);
    await loop(cursor, doel);
    cursor = doel;
  }
  await page.keyboard.press("Enter");
  for (let k = 1; k < pad.length; k++) await loop(pad[k - 1], pad[k]);
  assert.equal(await page.locator('.kast-led.aan[data-lamp="0"]').count(), 2, "de kabel is verbonden");
  // Bij de aansluiting laat je vanzelf los: de pijltjes bewegen weer alleen de cursor.
  const staat = await patchStaat(page);
  assert.deepEqual(staat.huidig.kabels[0], pad);
  assert.equal(await page.evaluate(() => document.activeElement.id), "kast-bord");
  assert.deepEqual(fouten, []);
  await context.close();
});

test("elk onderdeel van het labo heeft een knop met uitleg", async () => {
  const { page, context, fouten } = await openSpel({
    saves: { sergeClicker: `{ version: 5, packets: 1e6, buildings: { switch: 1, fiber: 1, rack: 1 }, seen: ["switch", "fiber", "rack"], stats: { lifetime: 1e6 }, lastSeen: nu }` },
  });
  await page.click("#labo-tab");
  for (const id of ["cursus", "quiz", "cli", "market", "patch"]) {
    await page.click(`#labo-picker [data-id="${id}"]`);
    await page.click(".labo-info");
    assert.match(await page.textContent("#modal-title"), /zo werkt het/, id);
    assert.ok(await page.locator(".labo-infotekst section").count() >= 2, id);
    await page.click("#modal-actions button");
  }
  assert.deepEqual(fouten, []);
  await context.close();
});
