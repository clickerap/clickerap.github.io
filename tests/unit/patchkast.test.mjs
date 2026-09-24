import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { G, D, freshState, recompute } from "../../js/state.js";
import { migreer, schoon } from "../../js/save.js";
import { MATEN, WERK, DREMPELS, PROTOCOLLEN } from "../../js/data/patch.js";
import {
  maakPuzzel, naast, Legger, verbonden, alleVerbonden, luchtdicht, bezetting, schoneKabels,
} from "../../js/minigames/kabelgoot.js";
import {
  vulWachtrij, neemOrder, opleveren, loonVoor, puzzelVan, openMaten, ontdekteAantal,
} from "../../js/minigames/patch.js";

beforeEach(() => {
  Object.assign(G, freshState());
  recompute();
});

// Sleep een kabel zoals een vinger dat doet: vak voor vak.
function sleep(legger, vakken) {
  assert.equal(legger.begin(vakken[0]), true, `begin op ${vakken[0]}`);
  for (const vak of vakken.slice(1)) legger.stap(vak);
  legger.los();
}

test("elke goot heeft een oplossing die elk vak vult", () => {
  for (const n of Object.keys(MATEN).map(Number)) {
    for (let zaad = 1; zaad <= 60; zaad++) {
      const p = maakPuzzel(n, zaad * 2654435761 % 2 ** 32);
      const [min, max] = MATEN[n].paren;
      assert.ok(p.paren.length >= min && p.paren.length <= max);
      assert.equal(new Set(p.paren.map((x) => x.soort)).size, p.paren.length, "elke soort één keer");
      const alle = p.oplossing.flat();
      assert.equal(alle.length, n * n);
      assert.equal(new Set(alle).size, n * n);
      p.oplossing.forEach((stuk, i) => {
        assert.ok(stuk.length >= 3);
        for (let k = 1; k < stuk.length; k++) assert.ok(naast(n, stuk[k - 1], stuk[k]));
        assert.equal(stuk[0], p.paren[i].a);
        assert.equal(stuk[stuk.length - 1], p.paren[i].b);
        assert.ok(!naast(n, p.paren[i].a, p.paren[i].b), "aansluitingen van een paar liggen niet naast elkaar");
      });
      assert.equal(luchtdicht(p, p.oplossing), true);
    }
  }
});

test("hetzelfde zaadje geeft dezelfde werkorder", () => {
  assert.deepEqual(maakPuzzel(7, 123456), maakPuzzel(7, 123456));
  assert.notDeepEqual(maakPuzzel(7, 123456).paren, maakPuzzel(7, 654321).paren);
});

test("een kabel volgt de vinger, en terugtrekken maakt hem korter", () => {
  const p = maakPuzzel(6, 99);
  const pad = p.oplossing[0];
  const legger = new Legger(p, []);
  legger.begin(pad[0]);
  for (const vak of pad.slice(1, 4)) assert.equal(legger.stap(vak), true);
  assert.equal(legger.stap(pad[2]), true, "terug over je eigen kabel");
  assert.deepEqual(legger.actief.pad, pad.slice(0, 3));
  // Schuin of over twee vakken tegelijk kan niet in één stap.
  const n = p.n;
  const ver = [...Array(n * n).keys()].find((v) => !naast(n, pad[2], v) && v !== pad[2]);
  assert.equal(legger.stap(ver), false);
  legger.los();
  assert.deepEqual(legger.kabels[0], pad.slice(0, 3));
});

// Een goot van 5 bij 5 met twee paren die elkaar in vak 12 kruisen als je
// ze recht trekt: PC van 10 naar 14 (rij 3), TEL van 2 naar 22 (kolom 3).
const KRUIS = {
  n: 5,
  paren: [{ soort: "pc", a: 10, b: 14 }, { soort: "tel", a: 2, b: 22 }],
  oplossing: [[10, 11, 12, 13, 14], [2, 7, 12, 17, 22]],
};

test("over een andere kabel slepen knipt hem af, tot je terugtrekt", () => {
  const legger = new Legger(KRUIS, []);
  sleep(legger, [2, 7, 12, 17, 22]);
  assert.equal(verbonden(KRUIS, legger.kabels, 1), true);
  legger.begin(10);
  legger.naar(12);
  assert.deepEqual(legger.weergave()[1], [2, 7], "TEL is afgeknipt waar PC eroverheen gaat");
  legger.stap(11);
  assert.deepEqual(legger.weergave()[1], [2, 7, 12, 17, 22], "teruggetrokken: TEL ligt er weer");
  legger.naar(14);
  legger.los();
  assert.equal(verbonden(KRUIS, legger.kabels, 0), true);
  assert.deepEqual(legger.kabels[1], [2, 7], "na loslaten blijft TEL afgeknipt");
});

test("een aansluiting van een ander paar houdt je tegen", () => {
  const legger = new Legger(KRUIS, []);
  legger.begin(10);
  for (const vak of [11, 6, 1]) assert.equal(legger.stap(vak), true);
  assert.equal(legger.stap(2), false, "vak 2 is de aansluiting van TEL");
  // Een verbonden kabel kan niet verder dan zijn aansluiting.
  const recht = new Legger(KRUIS, []);
  recht.begin(10);
  recht.naar(14);
  assert.equal(recht.stap(19), false);
  assert.equal(recht.stap(13), true, "terug mag wel");
});

test("op een kabel beginnen pakt hem daar op", () => {
  const legger = new Legger(KRUIS, [[10, 11, 12, 13, 14]]);
  assert.equal(legger.begin(12), true);
  assert.deepEqual(legger.actief.pad, [10, 11, 12]);
  legger.annuleer();
  assert.equal(legger.begin(0), false, "een leeg vak is niets om op te pakken");
  // Op een aansluiting beginnen, begint die kabel opnieuw.
  legger.begin(14);
  legger.los();
  assert.deepEqual(legger.kabels[0], []);
});

test("Serge lost elke goot op met zijn hulp", () => {
  for (const n of [5, 8]) {
    const p = maakPuzzel(n, 2024 + n);
    const legger = new Legger(p, []);
    let keren = 0;
    while (legger.hulp() !== -1) keren++;
    assert.equal(luchtdicht(p, legger.kabels), true);
    assert.equal(keren, p.paren.length);
    assert.equal(bezetting(p, legger.kabels), 1);
  }
});

test("kabels uit een save die niet kunnen liggen, verdwijnen", () => {
  assert.deepEqual(schoneKabels(KRUIS, [[10, 11, 12, 13, 14], [2, 7, 12, 17, 22]]), [[10, 11, 12, 13, 14], []], "twee kabels over vak 12");
  assert.deepEqual(schoneKabels(KRUIS, [[10, 12, 13, 14], "kapot"]), [[], []], "een sprong over een vak");
  assert.deepEqual(schoneKabels(KRUIS, [[10, 11, 6, 1, 2], [22]]), [[], []], "door een andere aansluiting");
  assert.deepEqual(schoneKabels(KRUIS, [[11, 12, 13], [2, 7, 2]]), [[], []], "niet bij een aansluiting begonnen, of dubbel");
  assert.deepEqual(schoneKabels(KRUIS, [[14, 13, 12], null]), [[14, 13, 12], []], "half gelegd mag");
});

test("de bak vult zich met de tijd, ook als het spel dicht was", () => {
  const t = 1_000_000;
  assert.equal(vulWachtrij(t), true);
  assert.equal(G.minigames.patch.wachtrij.length, 1, "de eerste order komt meteen");
  vulWachtrij(t + (WERK.interval - 1) * 1000);
  assert.equal(G.minigames.patch.wachtrij.length, 1);
  vulWachtrij(t + 3600 * 1000);
  assert.equal(G.minigames.patch.wachtrij.length, WERK.wachtrij, "na een uur weg: een volle bak, niet meer");
  // Een order uit een volle bak halen zet de klok opnieuw.
  assert.equal(neemOrder(0, t + 3600 * 1000), true);
  assert.equal(G.minigames.patch.volgendeAt, t + (3600 + WERK.interval) * 1000);
  assert.equal(neemOrder(0, t + 3600 * 1000), false, "eerst de order in beeld afmaken");
});

test("in het begin zijn er alleen goten van 5 bij 5", () => {
  assert.deepEqual(openMaten(), [5]);
  vulWachtrij(1);
  vulWachtrij(1 + 3600 * 1000);
  assert.ok(G.minigames.patch.wachtrij.every((o) => o.n === 5));
  G.minigames.patch.discovered = { tokenring: true, ethernet: true, poe: true, docsis: true, fddi: true };
  assert.deepEqual(openMaten(), [5, 6, 7, 8]);
});

test("opleveren betaalt seconden productie, en meer voor een luchtdichte goot", () => {
  G.buildings.switch = 100;
  recompute();
  vulWachtrij(1);
  neemOrder(0);
  const h = G.minigames.patch.huidig;
  const p = puzzelVan(h);
  const loon = loonVoor(h.n);
  assert.ok(Math.abs(loon - D.pps * MATEN[h.n].seconden) < 1e-6);
  // Nog niet alles verbonden: opleveren gaat niet.
  assert.equal(opleveren(), null);
  h.kabels = p.oplossing.map((k) => [...k]);
  const voor = G.packets;
  const uitkomst = opleveren();
  assert.equal(uitkomst.dicht, true);
  assert.ok(Math.abs(G.packets - voor - loon * WERK.luchtdicht) < 1e-6);
  assert.equal(G.achievements["patch-1"], true);
  assert.equal(G.achievements["patch-luchtdicht"], true);
  assert.equal(opleveren(), null, "twee keer opleveren kan niet");
});

test("hulp van Serge kost een deel van het loon", () => {
  assert.ok(Math.abs(loonVoor(5, { hulp: 1 }) / loonVoor(5) - (1 - WERK.hulpKost)) < 1e-12);
  assert.ok(Math.abs(loonVoor(5, { hulp: 99 }) / loonVoor(5) - WERK.hulpMinimum) < 1e-12);
});

test("na genoeg werkorders komt het volgende protocol vrij", () => {
  const p = G.minigames.patch;
  let klok = Date.now();
  const lever = () => {
    klok += WERK.interval * 1000;
    vulWachtrij(klok);
    neemOrder(0, klok);
    const puzzel = puzzelVan(p.huidig);
    p.huidig.kabels = puzzel.oplossing.map((k) => [...k]);
    return opleveren();
  };
  assert.deepEqual(lever().nieuw, []);
  assert.deepEqual(lever().nieuw, ["tokenring"]);
  assert.equal(ontdekteAantal(), 1);
  assert.equal(G.achievements["patch-protocol"], true);
  assert.equal(G.eggs["egg-tokenring"], true);
  // Twee procent per protocol, op alles.
  G.buildings.switch = 100;
  recompute();
  assert.ok(Math.abs(D.pps - 108 * 1.02) < 1e-9, `pps is ${D.pps}`);
  // Tot het laatste protocol.
  p.gedaan = DREMPELS[DREMPELS.length - 1] - 1;
  const laatste = lever();
  assert.equal(ontdekteAantal(), Object.keys(PROTOCOLLEN).length);
  assert.equal(laatste.nieuw.length, Object.keys(PROTOCOLLEN).length - 1);
  assert.equal(G.achievements["patch-alles"], true);
});

test("versie 4 naar 5: ontdekte protocollen blijven, de kweekbak verdwijnt", () => {
  const data = migreer({
    version: 4,
    minigames: { patch: { grid: Array(36).fill(null), discovered: { tokenring: true, docsis: true, nep: true }, plantedEver: 80 } },
  });
  assert.equal(data.version, 5);
  const patch = schoon(data).minigames.patch;
  assert.deepEqual(patch.discovered, { tokenring: true, docsis: true });
  assert.equal(patch.gedaan, DREMPELS[1]);
  assert.equal(patch.grid, undefined);
  assert.deepEqual(patch.wachtrij, []);
  assert.equal(patch.huidig, null);
});

test("een order uit de save wordt nagekeken", () => {
  const p = maakPuzzel(6, 77);
  const kabels = p.oplossing.map((k) => [...k]);
  const uit = (huidig) => schoon({ minigames: { patch: { huidig } } }).minigames.patch.huidig;
  assert.equal(uit({ n: 6, zaad: 77, kabels, klaar: true, winst: 5, dicht: true, protocol: "atm" }).klaar, true);
  // Opgeleverd, maar de kabels kloppen niet: dan is hij niet klaar.
  assert.equal(uit({ n: 6, zaad: 77, kabels: [], klaar: true }).klaar, undefined);
  assert.equal(uit({ n: 6, zaad: 77, kabels, klaar: true, protocol: "<script>" }).protocol, null);
  assert.equal(uit({ n: 9, zaad: 77 }), null);
  assert.equal(alleVerbonden(p, uit({ n: 6, zaad: 77, kabels }).kabels), true);
});
