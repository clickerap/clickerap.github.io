import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { G, freshState, recompute } from "../../js/state.js";
import { kopen, verkopen, zetOrder, tickMarkt, inzetVoor, waardeVan } from "../../js/minigames/market.js";
import { KOPPEN } from "../../js/data/market.js";
import { leestijd } from "../../js/minigames/cursus.js";
import { HOOFDSTUKKEN } from "../../js/data/cursus.js";

beforeEach(() => {
  Object.assign(G, freshState());
  recompute();
});

const KOERSEN = () => ({ bw: 100, cpu: 100, ram: 100, iops: 100, gpu: 100, ip: 100 });

// Een netwerk met 108 packets per seconde: één minuut productie is 6.480.
function beurs() {
  G.buildings.switch = 100;
  recompute();
  G.packets = 1e9;
  const m = G.minigames.market;
  m.prices = KOERSEN();
  m.historie = Object.fromEntries(Object.keys(KOERSEN()).map((id) => [id, [100]]));
  return m;
}

test("bug 9: op de markt telt alleen de winst mee als verdiend", () => {
  const m = beurs();
  kopen("bw", 1);
  assert.equal(G.packets, 1e9 - 6480);
  m.prices.bw = 110;
  verkopen("bw", 1);
  assert.ok(Math.abs(G.packets - (1e9 + 648)) < 1e-6);
  assert.ok(Math.abs(G.stats.lifetime - 648) < 1e-6, `${G.stats.lifetime} als verdiend geteld`);
});

test("een verlies op de markt telt helemaal niet mee", () => {
  const m = beurs();
  kopen("bw", 1);
  m.prices.bw = 50;
  verkopen("bw", 1);
  assert.ok(Math.abs(G.packets - (1e9 - 3240)) < 1e-6);
  assert.equal(G.stats.lifetime, 0);
});

test("je koopt in minuten productie, met een kwartier per goed als plafond", () => {
  beurs();
  assert.equal(inzetVoor(5, "gpu"), 6480 * 5);
  assert.equal(kopen("gpu", 15), true);
  assert.ok(Math.abs(waardeVan("gpu") - 6480 * 15) < 1e-6);
  assert.equal(kopen("gpu", 1), false);
  assert.equal(kopen("ram", 1), true);
});

test("bijkopen middelt de koers, en de helft verkopen houdt hem gelijk", () => {
  const m = beurs();
  kopen("cpu", 1);
  m.prices.cpu = 50;
  kopen("cpu", 1);
  const h = m.holdings.cpu;
  assert.ok(Math.abs(h.inleg / h.stuks - 100 / 1.5) < 1e-9, "gemiddelde van 100 en 50, gewogen naar eenheden");
  verkopen("cpu", 0.5);
  assert.ok(Math.abs(m.holdings.cpu.inleg - 6480) < 1e-6);
  assert.ok(Math.abs(m.holdings.cpu.inleg / m.holdings.cpu.stuks - 100 / 1.5) < 1e-9);
});

test("een winstorder verkoopt vanzelf bij de volgende koers", () => {
  const m = beurs();
  kopen("bw", 1);
  zetOrder("bw", "winst", 0.1);
  zetOrder("bw", "winst", 0.33);
  assert.equal(m.holdings.bw.winstBij, 0.1, "alleen de vaste stappen mogen");
  m.prices.bw = 150;
  tickMarkt();
  assert.equal(m.holdings.bw, undefined);
  assert.equal(G.achievements["beurs-automaat"], true);
});

test("een gerucht dat uitkomt geeft voorkennis", () => {
  const m = beurs();
  const kop = KOPPEN.findIndex((k) => k.goed === "gpu" && k.gerucht && k.factor > 1);
  m.geruchten = [{ kop, opTick: (m.tick || 0) + 1, waar: true }];
  kopen("gpu", 1);
  assert.equal(m.holdings.gpu.gerucht, kop);
  tickMarkt();
  assert.equal(m.holdings.gpu.voorkennis, true);
  // Er kan in dezelfde tik toevallig nog een nieuw bericht bovenop komen.
  assert.ok(m.nieuws.some((n) => n.kop === kop && n.soort === "bevestigd"));
  verkopen("gpu", 1);
  assert.equal(G.achievements["beurs-gerucht"], true);
});

test("de cursus vraagt een redelijke leestijd", () => {
  for (const h of HOOFDSTUKKEN) {
    const s = leestijd(h);
    assert.ok(s >= 8 && s <= 45, `${h.id}: ${s} s`);
  }
});
