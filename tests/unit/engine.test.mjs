import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { G, D, freshState, recompute } from "../../js/state.js";
import { haalIn, click, nieuweRun } from "../../js/engine.js";

beforeEach(() => {
  Object.assign(G, freshState());
  G.buildings.switch = 100;
  recompute();
});

test("bug 5: een buff telt bij het inhalen alleen zolang hij duurde", () => {
  const van = Date.now();
  G.buffs = [{ id: "burst", until: van + 5000 }];
  recompute();
  assert.equal(D.pps, 108 * 7);
  const voor = G.packets;
  haalIn(van, van + 3600 * 1000);
  const erbij = G.packets - voor;
  const eerlijk = 108 * 7 * 5 + 108 * 3595;
  assert.ok(Math.abs(erbij - eerlijk) < 1e-6, `${erbij} in plaats van ${eerlijk}`);
  assert.equal(G.buffs.length, 0);
});

test("een storing die uit de hand liep terwijl je weg was, telt mee als straf", () => {
  const van = Date.now();
  G.incident = { id: "loop", startedAt: van, until: van + 45000, cost: 1 };
  haalIn(van, van + 600 * 1000);
  assert.equal(G.incident, null);
  // 45 s gewoon, dan 70 s aan 60%, dan de rest weer gewoon.
  const eerlijk = 108 * 45 + 108 * 0.6 * 70 + 108 * (600 - 115);
  assert.ok(Math.abs(G.packets - eerlijk) < 1e-6, `${G.packets} in plaats van ${eerlijk}`);
});

test("inhalen stopt na een uur", () => {
  const van = Date.now();
  haalIn(van, van + 5 * 3600 * 1000);
  assert.ok(Math.abs(G.packets - 108 * 3600) < 1e-6);
});

test("meer dan twintig kliks per seconde tellen niet", () => {
  let geteld = 0;
  for (let i = 0; i < 50; i++) if (click()) geteld++;
  assert.equal(geteld, 20);
  assert.equal(G.stats.clicks, 20);
});

test("Gouden regen geeft bij een nieuwe run een buff", () => {
  G.nodes = { g1: true, g2: true, g3: true, g4: true, g5: true, g6: true };
  recompute();
  const voor = G.buffs.length + G.packets;
  nieuweRun();
  assert.ok(G.buffs.length + G.packets > voor);
});
