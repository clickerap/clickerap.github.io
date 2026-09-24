import { test } from "node:test";
import assert from "node:assert/strict";
import { openSpel } from "./hulp.mjs";

test("op een telefoon heeft de terminal knoppen voor Tab en ?", async () => {
  const { page, context, fouten } = await openSpel({
    mobiel: true,
    viewport: { width: 390, height: 844 },
    saves: { sergeClicker: `{ version: 3, packets: 1e6, buildings: { switch: 1 }, stats: { lifetime: 1e6 }, minigames: { laatste: "cli" }, lastSeen: nu }` },
  });
  await page.tap('button[data-tab="labo"]');
  await page.fill("#term-in", "en");
  await page.press("#term-in", "Enter");
  await page.fill("#term-in", "conf");
  await page.tap('[data-toets="Tab"]');
  assert.equal(await page.inputValue("#term-in"), "configure ");
  await page.tap('[data-toets="?"]');
  assert.match(await page.textContent("#term-uit"), /terminal\s+Via deze terminal/);
  const breedte = await page.evaluate(() => document.documentElement.scrollWidth);
  assert.ok(breedte <= 390, `de pagina is ${breedte} px breed`);
  assert.deepEqual(fouten, []);
  await context.close();
});
