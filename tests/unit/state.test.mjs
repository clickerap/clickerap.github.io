import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  G, D, freshState, recompute, earn, spend, buyBuilding, sellBuilding, priceOf, checkAchievements,
  graduate, ectsOnGraduate, ACHIEVEMENTS, BUILDINGS, UPGRADES,
} from "../../js/state.js";
import { ECTS_BASIS, ectsFor, lifetimeForEcts } from "../../js/data/skilltree.js";

beforeEach(() => {
  Object.assign(G, freshState());
  recompute();
});

test("bug 2: een ongeldig aankoopaantal maakt de voorraad nooit NaN", () => {
  G.packets = 1e6;
  for (const raar of [NaN, undefined, "abc", -3, 0]) {
    buyBuilding("patchkabel", raar);
    assert.ok(Number.isFinite(G.packets), `na ${raar}: ${G.packets}`);
    assert.ok(Number.isInteger(G.buildings.patchkabel));
    assert.ok(Number.isFinite(priceOf("patchkabel", raar).price));
  }
  assert.equal(G.buildings.patchkabel, 5);
  assert.equal(sellBuilding("patchkabel", NaN), 1);
  earn(NaN);
  earn(Infinity);
  assert.equal(spend(NaN), false);
  assert.ok(Number.isFinite(G.packets));
});

test("bug 8: Koffie op is haalbaar", () => {
  for (const a of ACHIEVEMENTS) if (a.id !== "koffie-vol") G.achievements[a.id] = true;
  recompute();
  assert.equal(D.koffie, 1);
  checkAchievements();
  assert.equal(G.achievements["koffie-vol"], true);
  assert.equal(D.koffie, 1);
});

// Elke prestatie met een test moet waar kunnen worden in een spel waar al het
// andere al gehaald is. Voor de handmatige prestaties moet er ergens code zijn
// die ze ontgrendelt.
test("elke prestatie is haalbaar", () => {
  const bronnen = [];
  const loop = (map) => {
    for (const naam of readdirSync(map)) {
      const pad = join(map, naam);
      if (statSync(pad).isDirectory()) loop(pad);
      else if (pad.endsWith(".js") && !pad.endsWith(join("data", "achievements.js"))) bronnen.push(readFileSync(pad, "utf8"));
    }
  };
  loop(fileURLToPath(new URL("../../js", import.meta.url)));
  const code = bronnen.join("\n");

  for (const a of ACHIEVEMENTS) {
    if (!a.test) {
      assert.ok(code.includes(`"${a.id}"`), `niemand ontgrendelt ${a.id}`);
      continue;
    }
    Object.assign(G, freshState());
    for (const b of ACHIEVEMENTS) if (b.id !== a.id) G.achievements[b.id] = true;
    for (const b of ACHIEVEMENTS) if (b.egg) G.eggs[b.id] = true;
    for (const b of BUILDINGS) G.buildings[b.id] = 1000;
    Object.assign(G.stats, { clicks: 1e7, lifetime: 1e30, goldenClicks: 1e4, sold: 1e4 });
    for (const u of UPGRADES) G.upgrades[u.id] = true;
    G.prestige = 1e4;
    recompute();
    checkAchievements();
    assert.ok(G.achievements[a.id], `${a.id} (${a.name}) blijft onhaalbaar`);
  }
});

test("afstuderen geeft studiepunten vanaf de nieuwe drempel", () => {
  G.stats.lifetime = ECTS_BASIS - 1;
  assert.equal(ectsOnGraduate(), 0);
  G.stats.lifetime = lifetimeForEcts(2);
  recompute();
  assert.equal(ectsOnGraduate(), 2);
  G.buildings.switch = 10;
  const gained = graduate();
  assert.equal(gained, 2);
  assert.equal(G.prestige, 2);
  assert.deepEqual(G.buildings, {});
  assert.ok(Math.abs(D.prestigeMult - 1.2) < 1e-9);
});

test("studiepunten groeien met het aantal cijfers, niet met het totaal", () => {
  // Het omgekeerde van de formule klopt, ook precies op de drempels.
  for (const n of [1, 5, 13, 70, 598, 2969]) assert.equal(ectsFor(lifetimeForEcts(n)), n);
  // Tien keer meer verdienen geeft een paar punten meer, geen verdubbeling.
  const bij = (totaal) => ectsFor(totaal);
  assert.equal(bij(1e9), 0);
  // Bij de oude formule was dat +115% per cijfer; nu rond een derde.
  assert.ok(bij(1e20) - bij(1e19) < bij(1e19) * 0.5, "een extra cijfer is geen explosie");
  // Wie alles gebouwd heeft (ruwweg 1e30 verdiend), komt rond de studieboom uit.
  assert.ok(bij(1e30) > 2500 && bij(1e30) < 3500, `${bij(1e30)} punten bij 1e30`);
});
