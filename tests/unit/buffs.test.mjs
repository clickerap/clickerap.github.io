// Doen de gouden packets wat ze beloven, ook laat in het spel? Laat in het
// spel komt bijna je hele klikwaarde uit "procent van je productie".

import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { G, D, freshState, recompute, BUILDINGS } from "../../js/state.js";
import { activateBuff, click } from "../../js/engine.js";
import { BUFF_BY_ID } from "../../js/data/buffs.js";

function laatSpel() {
  Object.assign(G, freshState());
  for (const b of BUILDINGS.slice(0, 12)) G.buildings[b.id] = 40;
  for (const id of ["klik-muis", "klik-tele", "klik-aggregatie", "klik-offload"]) G.upgrades[id] = true;
  recompute();
}

beforeEach(laatSpel);

test("een klikbuff vermenigvuldigt de hele klikwaarde, ook het deel uit je productie", () => {
  const gewoon = D.clickValue;
  assert.ok(D.pps * D.clickFromPps > gewoon * 0.9, "dit spel moet vooral uit productie klikken");
  activateBuff(BUFF_BY_ID.storm);
  assert.ok(Math.abs(D.clickValue / gewoon - 777) < 1e-6, `storm geeft x${(D.clickValue / gewoon).toFixed(2)}`);
});

test("Cache hit geeft tien kliks lang x100, en een tweede telt er tien bij", () => {
  const gewoon = D.clickValue;
  activateBuff(BUFF_BY_ID.cache);
  assert.ok(Math.abs(click() / gewoon - 100) < 1e-6);
  activateBuff(BUFF_BY_ID.cache);
  const caches = G.buffs.filter((b) => b.id === "cache");
  assert.equal(caches.length, 1);
  assert.equal(caches[0].charges, 19);
  assert.ok(Math.abs(D.clickValue / gewoon - 100) < 1e-6, "twee caches mogen niet stapelen tot x10.000");
});

test("upgrades die buffs sterker maken, werken ook op de gewone buffs", () => {
  G.upgrades["gp-netflow"] = true;
  recompute();
  const gewoon = D.pps;
  activateBuff(BUFF_BY_ID.burst);
  // "30% sterker": de bonus van x7 (+600%) wordt +780%.
  assert.ok(Math.abs(D.pps / gewoon - (1 + 6 * 1.3)) < 1e-6, `burst geeft x${(D.pps / gewoon).toFixed(2)}`);
});

test("Overklok kiest een apparaat dat er echt toe doet", () => {
  for (let i = 0; i < 200; i++) {
    G.buffs = [];
    recompute();
    const entry = activateBuff(BUFF_BY_ID.overclock);
    const b = BUILDINGS.find((x) => x.id === entry.building);
    G.buffs = [];
    recompute();
    const aandeel = (D.perBuilding[b.id] * G.buildings[b.id]) / D.pps;
    assert.ok(aandeel >= 0.05, `${b.id} levert maar ${(aandeel * 100).toFixed(2)}%`);
  }
});
