// Playtest van de studieboom: elk knooppunt moet in het spel zelf iets doen,
// en de boom moet helemaal te kopen zijn, in een volgorde die klopt.

import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { G, D, freshState, recompute, buyNode, priceOf, ectsOnGraduate, graduate, BUILDINGS } from "../../js/state.js";
import { NODES, NODE_BY_ID, BRANCHES } from "../../js/data/skilltree.js";
import { UPGRADES } from "../../js/data/upgrades.js";
import { effectVan, HAZARDS } from "../../js/data/buffs.js";
import { offlineYield } from "../../js/save.js";

const congestie = HAZARDS.find((h) => h.effect?.ppsMult);

// Een speler met van elk apparaat vijftig stuks en alle synergie-upgrades,
// zodat elk effect iets heeft om op te werken.
function basis() {
  Object.assign(G, freshState());
  for (const b of BUILDINGS) G.buildings[b.id] = 50;
  for (const u of UPGRADES) if (u.effect?.synergy) G.upgrades[u.id] = true;
  G.stats.lifetime = 1e18;
  recompute();
}

// Alles wat een knooppunt kan raken, in één meting.
function meet() {
  return {
    pps: D.pps,
    klik: D.clickValue,
    perApparaat: { ...D.perBuilding },
    prijs: Object.fromEntries(BUILDINGS.map((b) => [b.id, priceOf(b.id, 1).price])),
    terug: Object.fromEntries(BUILDINGS.map((b) => [b.id, priceOf(b.id, 1, true).price])),
    punten: ectsOnGraduate(),
    congestie: effectVan({ id: congestie.id }, { weerstand: D.ddosResist }).ppsMult,
    goldenFreq: D.goldenFreq,
    goldenDuration: D.goldenDuration,
    goldenPower: D.goldenPower,
    goldenDouble: D.goldenDouble,
    buffDuration: D.buffDuration,
    minigameReward: D.minigameReward,
    offlineCap: D.offlineCap,
    offlineRate: D.offlineRate,
    autoIncident: D.autoIncident,
    startPackets: D.startPackets,
    startBuff: D.startBuff,
    startBuildings: { ...D.startBuildings },
    laboTempo: D.laboTempo,
    marktLimiet: D.marktLimiet,
  };
}

const VAK_VAN = Object.fromEntries(BUILDINGS.map((b) => [b.id, b.vak]));
const meer = (a, b) => b > a * (1 + 1e-9);
const minder = (a, b) => b < a * (1 - 1e-9);

// Per soort effect: wat moet er in het spel veranderen?
const VERWACHT = {
  allMult: (v, n) => meer(v.pps, n.pps) && meer(v.klik, n.klik),
  clickMult: (v, n) => meer(v.klik, n.klik),
  clickFromPps: (v, n) => meer(v.klik, n.klik),
  ectsGain: (v, n) => n.punten > v.punten,
  startPackets: (v, n) => meer(v.startPackets, n.startPackets),
  minigameReward: (v, n) => meer(v.minigameReward, n.minigameReward),
  goldenFreq: (v, n) => meer(v.goldenFreq, n.goldenFreq),
  goldenDuration: (v, n) => meer(v.goldenDuration, n.goldenDuration),
  goldenPower: (v, n) => meer(v.goldenPower, n.goldenPower),
  goldenDouble: (v, n) => meer(v.goldenDouble, n.goldenDouble),
  buffDuration: (v, n) => meer(v.buffDuration, n.buffDuration),
  startBuff: (v, n) => !v.startBuff && n.startBuff,
  offlineCap: (v, n) => meer(v.offlineCap, n.offlineCap),
  offlineRate: (v, n) => meer(v.offlineRate, n.offlineRate),
  autoIncident: (v, n) => !v.autoIncident && n.autoIncident,
  ddosResist: (v, n) => meer(v.congestie, n.congestie),
  laboTempo: (v, n) => minder(v.laboTempo, n.laboTempo),
  marktLimiet: (v, n) => meer(v.marktLimiet, n.marktLimiet),
  costMult: (v, n) => BUILDINGS.every((b) => minder(v.prijs[b.id], n.prijs[b.id])),
  sellRate: (v, n) => BUILDINGS.every((b) => meer(v.terug[b.id], n.terug[b.id])),
  synergyMult: (v, n) => meer(v.pps, n.pps),
  startBuildings: (v, n, e) => Object.entries(e.startBuildings).every(([id, aantal]) => n.startBuildings[id] >= aantal),
  buildingMult: (v, n, e) => [].concat(e.buildingMult).every(({ id }) => meer(v.perApparaat[id], n.perApparaat[id])),
  vakMult: (v, n, e) =>
    [].concat(e.vakMult).every(({ vak }) => BUILDINGS.filter((b) => VAK_VAN[b.id] === vak).every((b) => meer(v.perApparaat[b.id], n.perApparaat[b.id]))),
};

beforeEach(basis);

test("elk effect in de boom heeft een controle", () => {
  for (const node of NODES) {
    for (const soort of Object.keys(node.effect)) assert.ok(VERWACHT[soort], `${node.id}: onbekend effect ${soort}`);
  }
});

for (const node of NODES) {
  test(`${node.id} ${node.name} doet wat er staat`, () => {
    const voor = meet();
    G.nodes[node.id] = true;
    recompute();
    const na = meet();
    for (const soort of Object.keys(node.effect)) {
      assert.ok(VERWACHT[soort](voor, na, node.effect), `${node.id} (${node.note}): ${soort} verandert niet zoals beloofd`);
    }
  });
}

test("de boom is helemaal te kopen, en alleen in de goede volgorde", () => {
  G.ects = NODES.reduce((som, n) => som + n.cost, 0);
  // Een knooppunt zonder zijn voorgangers gaat niet.
  for (const node of NODES.filter((n) => n.needs.length)) {
    assert.equal(buyNode(node.id), false, `${node.id} kon zonder ${node.needs.join(" en ")}`);
  }
  // Te weinig punten gaat ook niet.
  const ects = G.ects;
  G.ects = 0;
  assert.equal(buyNode(NODES.find((n) => !n.needs.length).id), false);
  G.ects = ects;
  // Steeds alles kopen wat kan, tot de boom vol is.
  let gekocht = 0;
  for (let ronde = 0; ronde < NODES.length && gekocht < NODES.length; ronde++) {
    for (const node of NODES) if (!G.nodes[node.id] && buyNode(node.id)) gekocht++;
  }
  assert.equal(gekocht, NODES.length, "niet alles kon gekocht worden");
  assert.equal(G.ects, 0, "de boom kost precies wat er staat");
  assert.ok(G.achievements["prestige-boom"], "de prestatie voor de volle boom");
  assert.equal(buyNode(NODES[0].id), false, "twee keer kopen gaat niet");
});

test("elk knooppunt staat in een tak, en wat het vraagt bestaat", () => {
  const takken = new Set([...BRANCHES.map((b) => b.id), "kruis"]);
  for (const node of NODES) {
    assert.ok(takken.has(node.branch), node.id);
    for (const nodig of node.needs) assert.ok(NODE_BY_ID[nodig], `${node.id} vraagt ${nodig}`);
    assert.ok(node.cost > 0 && node.note, node.id);
  }
});

test("afstuderen gebruikt de startknooppunten", () => {
  for (const id of ["s2", "s3", "e4", "e6", "g6"]) G.nodes[id] = true;
  recompute();
  const startPackets = D.startPackets;
  const start = { ...D.startBuildings };
  assert.ok(graduate() > 0);
  assert.equal(G.packets, startPackets, "startkapitaal na afstuderen");
  for (const [id, aantal] of Object.entries(start)) assert.equal(G.buildings[id], aantal, `${id} om mee te beginnen`);
  assert.ok(G.nodes.s2 && G.nodes.e6, "de boom blijft na afstuderen");
});

test("offline opbrengst volgt de beheertak", () => {
  const zonder = offlineYield(24 * 3600);
  for (const id of ["b1", "b2", "b3", "b4", "b5"]) G.nodes[id] = true;
  recompute();
  const met = offlineYield(24 * 3600);
  assert.ok(met.seconds > zonder.seconds && met.amount > zonder.amount * 2);
});

test("verkopen en kopen volgen de economietak", () => {
  const prijs = priceOf("switch", 10).price;
  const terug = priceOf("switch", 10, true).price;
  for (const id of ["e1", "e2", "e3", "e5"]) G.nodes[id] = true;
  recompute();
  assert.ok(priceOf("switch", 10).price < prijs * 0.8, "goedkoper");
  assert.ok(priceOf("switch", 10, true).price > terug * 1.5, "meer terug");
  // Terugverkopen levert nooit meer op dan de aankoop kostte.
  assert.ok(priceOf("switch", 10, true).price < priceOf("switch", 10).price);
});
