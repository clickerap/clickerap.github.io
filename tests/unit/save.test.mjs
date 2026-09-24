import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { nepOpslag, code } from "./hulp.mjs";
import { G, D } from "../../js/state.js";
import {
  load, save, schoon, migreer, wisselSlot, importSave, herstelBackup, backupInfo, exportSave, leesCode, SAVE_KEY, LEGACY_KEY,
} from "../../js/save.js";

let opslag;
beforeEach(() => {
  opslag = nepOpslag();
});

const bewaar = (sleutel, data) => opslag.set(sleutel, JSON.stringify(data));
const lees = (sleutel) => JSON.parse(opslag.get(sleutel));

test("bug 1: wisselen van bestand overschrijft het doelbestand niet", () => {
  bewaar(SAVE_KEY, { version: 3, packets: 11111, options: { netwerknaam: "EEN" }, lastSeen: Date.now() });
  bewaar(`${SAVE_KEY}:2`, { version: 3, packets: 22222, options: { netwerknaam: "TWEE" }, lastSeen: Date.now() });
  load("1");
  wisselSlot("2");
  // Wat pagehide doet bij het herladen:
  save();
  assert.equal(lees(`${SAVE_KEY}:2`).options.netwerknaam, "TWEE");
  assert.equal(lees(`${SAVE_KEY}:2`).packets, 22222);
  assert.equal(lees(SAVE_KEY).options.netwerknaam, "EEN");
  assert.equal(opslag.get(`${SAVE_KEY}:slot`), "2");
});

test("bug 3: een kwaadaardige save wordt veld voor veld opgeschoond", () => {
  const schoonGemaakt = schoon({
    packets: "100",
    buildings: { patchkabel: "12", switch: -5, verzonnen: 99, __proto__: { x: 1 } },
    upgrades: ["klik-muis", "bestaat-niet", "__proto__"],
    options: { buyAmount: "abc", netwerknaam: "<img src=x onerror=alert(1)>".repeat(5), notation: "vreemd" },
    stats: { clicks: "NaN", lifetime: Infinity },
    minigames: {
      cli: {
        hostname: "<b>",
        mode: "iface",
        opdracht: { poort: '<img src=x onerror="alert(1)">', ip: "10.0.0.1", mask: "255.255.255.0" },
        interfaces: { "gi0/1": { ip: "999.1.1.1", up: "ja", omschrijving: 5 } },
      },
      patch: { grid: "kapot", discovered: { tokenring: true, nep: true }, wachtrij: [{ n: 99, zaad: 1 }, { n: 6, zaad: -4 }, { n: 5, zaad: 42 }] },
      laatste: "iets",
    },
    buffs: [{ id: "burst", until: "morgen" }, { id: "verzonnen", until: Date.now() + 1e6 }, { id: "cache", charges: 5 }],
  });
  assert.equal(schoonGemaakt.packets, 100);
  assert.deepEqual(schoonGemaakt.buildings, { patchkabel: 12 });
  assert.deepEqual(Object.keys(schoonGemaakt.upgrades), ["klik-muis"]);
  assert.equal(schoonGemaakt.options.buyAmount, 1);
  assert.equal(schoonGemaakt.options.notation, "kort");
  assert.ok(schoonGemaakt.options.netwerknaam.length <= 24);
  assert.equal(schoonGemaakt.stats.clicks, 0);
  assert.equal(schoonGemaakt.stats.lifetime, 0);
  assert.equal(schoonGemaakt.minigames.cli.opdracht, null);
  assert.equal(schoonGemaakt.minigames.cli.hostname, "SERGE");
  assert.equal(schoonGemaakt.minigames.cli.mode, "config");
  assert.deepEqual(schoonGemaakt.minigames.cli.interfaces["gi0/1"], { ip: null, mask: null, up: false, omschrijving: null });
  assert.equal(schoonGemaakt.minigames.patch.grid, undefined);
  assert.deepEqual(schoonGemaakt.minigames.patch.discovered, { tokenring: true });
  assert.deepEqual(schoonGemaakt.minigames.patch.wachtrij, [{ nr: 0, n: 5, zaad: 42 }]);
  assert.equal(schoonGemaakt.minigames.laatste, null);
  assert.deepEqual(schoonGemaakt.buffs, [{ id: "cache", charges: 5 }]);
  assert.equal(Object.getPrototypeOf(schoonGemaakt.buildings), Object.prototype);
});

test("bug 4: straffen en ladingen overleven een herlaadbeurt", () => {
  const nu = Date.now();
  bewaar(SAVE_KEY, {
    version: 3,
    buildings: { switch: 100 },
    buffs: [{ id: "congestie", until: nu + 60000 }, { id: "incident-loop", until: nu + 60000 }, { id: "cache", charges: 4 }],
    lastSeen: nu,
  });
  load("1");
  assert.deepEqual(G.buffs.map((b) => b.id), ["congestie", "incident-loop", "cache"]);
  // 100 switches, 8% vakbonus, dan congestie (x0,5) en de storing (x0,6).
  assert.ok(Math.abs(D.pps - 108 * 0.5 * 0.6) < 1e-9, `pps is ${D.pps}`);
  save();
  assert.deepEqual(lees(SAVE_KEY).buffs.find((b) => b.id === "cache"), { id: "cache", charges: 4 });
});

test("een save uit de allereerste versie wordt omgezet", () => {
  bewaar(LEGACY_KEY, { score: 5000, clickerCount: 12, brainCount: 3, totalManualClicks: 400, hasEvolved: true });
  const uitkomst = load("1");
  assert.equal(uitkomst.migrated, true);
  assert.equal(G.packets, 5000);
  assert.equal(G.buildings.patchkabel, 12);
  assert.equal(G.buildings.datacenter, 3);
  assert.equal(G.stats.clicks, 400);
  assert.equal(G.prestige, 1);
});

test("versie 2 naar 3 neemt oude namen van het uiterlijk mee", () => {
  const data = migreer({ version: 2, skins: ["portret:standaard", "portret:goud"], options: { portret: "evolved" } });
  assert.ok(data.version >= 3);
  assert.ok(data.skins.includes("portret:serge"));
  assert.ok(data.skins.includes("ring:goud"));
  assert.equal(data.uiterlijk.portret, "evolved");
});

test("een kapotte save wordt apart bewaard in plaats van overschreven", () => {
  opslag.set(SAVE_KEY, "{kapot");
  const uitkomst = load("1");
  assert.equal(uitkomst.corrupt, true);
  assert.equal(opslag.get(`${SAVE_KEY}:kapot`), "{kapot");
  assert.equal(G.packets, 0);
});

test("importeren, en de import weer ongedaan maken", () => {
  bewaar(SAVE_KEY, { version: 3, packets: 777, lastSeen: Date.now() });
  load("1");
  importSave(code({ version: 3, packets: 5, lastSeen: Date.now() }));
  assert.equal(G.packets, 5);
  assert.ok(backupInfo());
  assert.equal(herstelBackup(), true);
  assert.equal(G.packets, 777);
  assert.equal(backupInfo(), null);
});

test("een code die niet klopt geeft een Nederlandse foutmelding", () => {
  assert.throws(() => leesCode("hallo"), /geen Serge Clicker-code/);
  assert.throws(() => leesCode("SERGE1:%%%"), /beschadigd of onvolledig/);
  assert.throws(() => leesCode("SERGE1:" + Buffer.from("42").toString("base64")), /beschadigd of onvolledig/);
  const heen = exportSave();
  assert.ok(heen.startsWith("SERGE1:"));
  assert.equal(typeof leesCode(heen), "object");
});

test("versie 3 naar 4 zet posities op de markt om naar eenheden", () => {
  bewaar(SAVE_KEY, { version: 3, minigames: { market: { holdings: { bw: { invested: 1000, koers: 50 }, gpu: { invested: -5, koers: 10 } } } }, lastSeen: Date.now() });
  load("1");
  assert.deepEqual(G.minigames.market.holdings, { bw: { stuks: 20, inleg: 1000 } });
});

test("de nieuwe marktvelden worden nagekeken", () => {
  const m = schoon({
    minigames: {
      market: {
        holdings: { bw: { stuks: 10, inleg: 100, winstBij: 0.25, verliesBij: 0.9, gerucht: 999 } },
        trend: { bw: 5, cpu: -0.004, nep: 1 },
        nieuws: [{ kop: 0, soort: "nu", tijd: 1 }, { kop: 999, soort: "nu" }, { kop: 1, soort: "<script>" }],
        geruchten: [{ kop: 0, opTick: 3, waar: true }, { kop: 2, opTick: 3, waar: "ja" }],
        stats: { verkopen: "3", gewonnen: -1 },
      },
    },
  }).minigames.market;
  assert.deepEqual(m.holdings, { bw: { stuks: 10, inleg: 100, winstBij: 0.25 } });
  assert.deepEqual(m.trend, { bw: 0.008, cpu: -0.004 });
  assert.deepEqual(m.nieuws, [{ kop: 0, soort: "nu", tijd: 1 }]);
  assert.deepEqual(m.geruchten, [{ kop: 2, opTick: 3, waar: false }]);
  assert.deepEqual(m.stats, { verkopen: 3, gewonnen: 0, besteWinst: 0 });
});
