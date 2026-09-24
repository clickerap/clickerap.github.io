import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { G, freshState, recompute, checkSkins, skinUnlocked, kiesSkin } from "../../js/state.js";
import { schoon } from "../../js/save.js";
import { UITERLIJK, STANDAARD, SOORTNAMEN, ALLE_SKINS, WEER, MAATJES, FILTERS } from "../../js/data/uiterlijk.js";
import { ACHIEVEMENT_BY_ID } from "../../js/data/achievements.js";
import { UPGRADES } from "../../js/data/upgrades.js";

beforeEach(() => {
  Object.assign(G, freshState());
  recompute();
});

test("elke soort heeft een naam, een standaard die meteen open is, en unieke id's", () => {
  for (const [soort, lijst] of Object.entries(UITERLIJK)) {
    assert.ok(SOORTNAMEN[soort], soort);
    assert.ok(lijst.some((s) => s.id === STANDAARD[soort]), `${soort}: standaard bestaat`);
    assert.equal(new Set(lijst.map((s) => s.id)).size, lijst.length, `${soort}: dubbele id`);
    assert.ok(skinUnlocked(soort, STANDAARD[soort]), `${soort}: standaard is vrij`);
  }
});

// Weer dat bij een seizoen hoort, speel je vrij door in dat seizoen te spelen,
// en het avondlicht door 's avonds te spelen.
const SEIZOENEN = ["weer:sneeuw", "weer:bloesem", "weer:vlinders", "weer:herfst"];
const TIJDGEBONDEN = [...SEIZOENEN, "filter:avond", "accessoire:kerstmuts", "accessoire:heksenhoed"];

test("een nieuwe speler heeft alleen de standaarden, en het weer van dit seizoen", () => {
  checkSkins();
  const vrij = Object.keys(G.skins);
  assert.equal(vrij.filter((k) => !TIJDGEBONDEN.includes(k)).length, Object.keys(STANDAARD).length);
  assert.equal(vrij.filter((k) => SEIZOENEN.includes(k)).length, 1, "precies één seizoen is nu");
  for (const skin of ALLE_SKINS) {
    if (skin.id === STANDAARD[skin.soort]) continue;
    assert.ok(skin.hoe, `${skin.soort}:${skin.id} zegt hoe je hem vrijspeelt`);
  }
});

test("wie alles heeft, speelt alles vrij", () => {
  for (const id of Object.keys(ACHIEVEMENT_BY_ID)) G.achievements[id] = true;
  Object.assign(G.stats, { clicks: 1e6, goldenClicks: 1e4, ddosIgnored: 100, playTime: 1e6, prestiges: 30, lifetime: 1e12 });
  G.prestige = 3100;
  G.buildings.fiber = 250;
  G.buildings.singularity = 100;
  G.buildings.satellite = 100;
  G.buildings.datacenter = 100;
  G.buildings.k8s = 50;
  G.buildings.firewall = 1;
  G.buildings.subsea = 100;
  G.buildings.rack = 100;
  G.buildings.multiverse = 25;
  G.buildings.dyson = 50;
  G.buildings.neural = 100;
  G.buildings.patchkabel = 25;
  G.buildings.router = 250;
  G.buildings.switch = 2000;
  G.buildings.quantum = 1e6; // voor een miljard per seconde
  G.minigames.patch.gedaan = 50;
  G.minigames.patch.luchtdicht = 25;
  G.minigames.patch.discovered = { tokenring: true, ethernet: true, poe: true, docsis: true };
  G.minigames.quiz.correct = 200;
  G.minigames.cli.gedaan = 50;
  G.stats.besteReeks = 1000;
  G.nodes.dr = true;
  // Upgrades en eggs worden geteld uit hun lijsten.
  for (const u of UPGRADES.slice(0, 120)) G.upgrades[u.id] = true;
  for (const id of Object.keys(ACHIEVEMENT_BY_ID)) if (ACHIEVEMENT_BY_ID[id].egg) G.eggs[id] = true;
  recompute();
  checkSkins();
  // Wie genoeg vrijspeelt, speelt daarmee weer iets anders vrij.
  checkSkins();
  // Wat aan een seizoen of een uur vastzit, staat in de volgende tests.
  const mist = ALLE_SKINS.filter((s) => !skinUnlocked(s.soort, s.id) && !TIJDGEBONDEN.includes(`${s.soort}:${s.id}`)).map((s) => `${s.soort}:${s.id}`);
  assert.deepEqual(mist, []);
  const weer = WEER.filter((w) => !SEIZOENEN.includes(`weer:${w.id}`)).filter((w) => !skinUnlocked("weer", w.id));
  assert.deepEqual(weer, []);
});

test("sneeuw in de winter, bloesem in de lente", () => {
  const echt = globalThis.Date;
  const opDatum = (iso) => {
    globalThis.Date = class extends echt {
      constructor(...a) {
        super(...(a.length ? a : [iso]));
      }
    };
  };
  try {
    const sneeuw = WEER.find((w) => w.id === "sneeuw");
    const bloesem = WEER.find((w) => w.id === "bloesem");
    opDatum("2026-12-24T12:00:00");
    assert.equal(sneeuw.eis(), true);
    assert.equal(bloesem.eis(), false);
    opDatum("2026-04-10T12:00:00");
    assert.equal(sneeuw.eis(), false);
    assert.equal(bloesem.eis(), true);
    opDatum("2026-08-01T12:00:00");
    assert.equal(sneeuw.eis() || bloesem.eis(), false);
  } finally {
    globalThis.Date = echt;
  }
});

test("een kerstmuts in december, een heksenhoed in oktober", () => {
  const echt = globalThis.Date;
  const opDatum = (iso) => {
    globalThis.Date = class extends echt {
      constructor(...a) {
        super(...(a.length ? a : [iso]));
      }
    };
  };
  try {
    const muts = UITERLIJK.accessoire.find((a) => a.id === "kerstmuts");
    const hoed = UITERLIJK.accessoire.find((a) => a.id === "heksenhoed");
    opDatum("2026-12-02T12:00:00");
    assert.deepEqual([muts.eis(G), hoed.eis(G)], [true, false]);
    opDatum("2026-10-31T20:00:00");
    assert.deepEqual([muts.eis(G), hoed.eis(G)], [false, true]);
    opDatum("2026-06-15T12:00:00");
    assert.deepEqual([muts.eis(G), hoed.eis(G)], [false, false]);
  } finally {
    globalThis.Date = echt;
  }
});

test("de nieuwe soorten: groepen, accentkleuren, aanwijzers en reeksen", async () => {
  const { GROEPEN, ACCENTEN, CURSORS } = await import("../../js/data/uiterlijk.js");
  const { existsSync } = await import("node:fs");
  // Elke soort staat in precies één groep, in de volgorde van het menu.
  assert.deepEqual(GROEPEN.flatMap((g) => g.soorten), Object.keys(UITERLIJK));
  // Wit op de accentkleur moet leesbaar zijn: minstens 4,5 keer contrast.
  const licht = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  for (const a of ACCENTEN) {
    if (!a.kleur.startsWith("#")) continue;
    const contrast = 1.05 / (licht(a.kleur) + 0.05);
    assert.ok(contrast >= 4.5, `${a.id}: ${contrast.toFixed(2)}`);
  }
  // Elke aanwijzer heeft een bestand en een klikpunt binnen het plaatje.
  for (const c of CURSORS) {
    if (!c.punt) continue;
    assert.ok(existsSync(new URL(`../../img/cursor/${c.id}.svg`, import.meta.url)), c.id);
    assert.ok(c.punt.every((p) => p >= 0 && p < 32), c.id);
  }
});

test("de beste klikreeks wordt bewaard", () => {
  G.stats.besteReeks = 57;
  const terug = schoon(JSON.parse(JSON.stringify({ ...G, skins: Object.keys(G.skins) })));
  assert.equal(terug.stats.besteReeks, 57);
});

test("een klikeffect, geluid of titel kies je alleen als hij vrij is, en hij blijft na laden", () => {
  assert.equal(kiesSkin("titel", "ccie"), false);
  G.skins["titel:ccie"] = true;
  G.skins["klik:confetti"] = true;
  assert.equal(kiesSkin("titel", "ccie"), true);
  assert.equal(kiesSkin("klik", "confetti"), true);
  const terug = schoon(JSON.parse(JSON.stringify({ ...G, skins: Object.keys(G.skins) })));
  assert.equal(terug.uiterlijk.titel, "ccie");
  assert.equal(terug.uiterlijk.klik, "confetti");
  assert.ok(terug.skins["titel:ccie"]);
});

test("elk maatje heeft iets te zeggen", () => {
  for (const m of MAATJES) {
    if (m.id === "geen") continue;
    assert.ok(m.zegt.length >= 3, m.id);
    assert.ok(m.voorbeeld, m.id);
  }
});

test("elke titel heeft een icoon en een bekende zeldzaamheid", async () => {
  const { TITELS, RANGEN } = await import("../../js/data/uiterlijk.js");
  const volgorde = Object.keys(RANGEN);
  let vorige = 0;
  for (const t of TITELS) {
    assert.ok(RANGEN[t.rang], t.id);
    if (t.id !== "geen") assert.ok(t.icoon, t.id);
    // Van gewoon naar mythisch, zodat het menu oploopt.
    assert.ok(volgorde.indexOf(t.rang) >= vorige, `${t.id} staat niet op volgorde`);
    vorige = volgorde.indexOf(t.rang);
  }
});

test("avondlicht vanaf negen uur 's avonds", () => {
  const echt = globalThis.Date;
  const opUur = (uur) => {
    globalThis.Date = class extends echt {
      constructor(...a) {
        super(...(a.length ? a : [`2026-09-24T${String(uur).padStart(2, "0")}:30:00`]));
      }
    };
  };
  try {
    const avond = FILTERS.find((f) => f.id === "avond");
    opUur(14);
    assert.equal(avond.eis(G), false);
    opUur(21);
    assert.equal(avond.eis(G), true);
    opUur(23);
    assert.equal(avond.eis(G), true);
  } finally {
    globalThis.Date = echt;
  }
});
