// De spelstaat en alles wat eruit volgt.
//
// Eén regel: buiten dit bestand wordt G.pps of G.clickValue nooit met de hand
// gezet. Je wijzigt bezit, upgrades of buffs en roept recompute() aan.

import { BUILDINGS, BUILDING_BY_ID, VAKKEN, costOf, bulkCost, affordableAmount, refundOf } from "./data/buildings.js";
import { UPGRADES, UPGRADE_BY_ID } from "./data/upgrades.js";
import { ACHIEVEMENTS, ACHIEVEMENT_BY_ID, EGG_COUNT, KOFFIE_RANKS } from "./data/achievements.js";
import { NODES, NODE_BY_ID, ectsFor } from "./data/skilltree.js";
import { BUFF_BY_ID } from "./data/buffs.js";
import { UITERLIJK, ALLE_SKINS, STANDAARD } from "./data/uiterlijk.js";

export function freshState() {
  return {
    version: 2,
    packets: 0,
    buildings: {},
    upgrades: {},
    achievements: {},
    nodes: {},
    eggs: {},
    skins: Object.fromEntries(Object.entries(STANDAARD).map(([soort, id]) => [`${soort}:${id}`, true])),
    uiterlijk: { ...STANDAARD },
    prestige: 0,
    ects: 0,
    buffs: [],
    incident: null,
    stats: {
      clicks: 0,
      lifetime: 0,
      runLifetime: 0,
      runStarted: Date.now(),
      upgrades: 0,
      achievements: 0,
      goldenClicks: 0,
      goldenValue: 0,
      ddosSeen: 0,
      ddosIgnored: 0,
      eggs: 0,
      sold: 0,
      handmade: 0,
      prestiges: 0,
      playTime: 0,
      runPlayTime: 0,
      bestPps: 0,
      clickCap: 0,
    },
    options: {
      notation: "kort",
      sound: false,
      motion: true,
      buyAmount: 1,
      sellMode: false,
      theme: "blauw",
      netwerknaam: "",
    },
    minigames: {
      quiz: { streak: 0, best: 0, correct: 0, wrong: 0, nextAt: 0 },
      cli: { hostname: "SERGE", mode: "user", interfaces: {}, opdracht: null, nextAt: 0, gedaan: 0 },
      market: { cash: 0, holdings: {}, prices: null, profit: 0, tick: 0 },
      patch: { grid: null, discovered: {}, plantedEver: 0 },
    },
    seen: {},
    lastSeen: Date.now(),
    cheated: false,
  };
}

export const G = freshState();

// Afgeleide waarden. Nooit opgeslagen, altijd herrekend.
export const D = {
  pps: 0,
  clickValue: 0,
  perBuilding: {},
  buildingMult: {},
  totalBuildings: 0,
  vakOwned: {},
  koffie: 0,
  koffieMult: 1,
  prestigeMult: 1,
  buffPps: 1,
  buffClick: 1,
  offlineCap: 2 * 3600,
  offlineRate: 0.4,
  goldenFreq: 1,
  goldenDuration: 1,
  goldenPower: 1,
  goldenDouble: 0,
  buffDuration: 1,
  minigameReward: 1,
  ddosResist: 0,
  ddosReward: false,
  autoIncident: false,
  startPackets: 0,
  startBuff: false,
  ectsGain: 1,
};

let revision = 0;
export function rev() {
  return revision;
}
export function touch() {
  revision++;
}

// Het spelstaat-object zoals data-bestanden het verwachten (req-functies).
function reqView() {
  return {
    buildings: G.buildings,
    upgrades: G.upgrades,
    achievements: G.achievements,
    nodes: G.nodes,
    stats: G.stats,
    prestige: G.prestige,
    pps: D.pps,
    koffie: D.koffie,
    totalBuildings: D.totalBuildings,
    vakOwned: D.vakOwned,
    protocollen: Object.keys(G.minigames?.patch?.discovered || {}).length,
  };
}

export function view() {
  return reqView();
}

export function recompute() {
  const mods = {
    buildingMult: {},
    vakMult: {},
    allMult: 1,
    clickFlat: 0,
    clickMult: 1,
    clickFromPps: 0,
    koffiePower: 0,
    synergies: [],
    goldenFreq: 1,
    goldenDuration: 1,
    goldenPower: 1,
    goldenDouble: 0,
    buffDuration: 1,
    minigameReward: 1,
    offlineCap: 2 * 3600,
    offlineRate: 0.4,
    ddosResist: 0,
    ddosReward: false,
    autoIncident: false,
    startPackets: 0,
    startBuff: false,
    ectsGain: 1,
  };
  for (const b of BUILDINGS) mods.buildingMult[b.id] = 1;
  for (const vak of Object.keys(VAKKEN)) mods.vakMult[vak] = 1;

  const applyEffect = (e) => {
    if (!e) return;
    if (e.buildingMult) mods.buildingMult[e.buildingMult.id] *= e.buildingMult.x;
    if (e.vakMult) mods.vakMult[e.vakMult.vak] *= e.vakMult.x;
    if (e.allMult) mods.allMult *= e.allMult;
    if (e.clickFlat) mods.clickFlat += e.clickFlat;
    if (e.clickMult) mods.clickMult *= e.clickMult;
    if (e.clickFromPps) mods.clickFromPps += e.clickFromPps;
    if (e.koffiePower) mods.koffiePower += e.koffiePower;
    if (e.synergy) mods.synergies.push(e.synergy);
    if (e.goldenFreq) mods.goldenFreq *= e.goldenFreq;
    if (e.goldenDuration) mods.goldenDuration *= e.goldenDuration;
    if (e.goldenPower) mods.goldenPower *= e.goldenPower;
    if (e.goldenDouble) mods.goldenDouble += e.goldenDouble;
    if (e.buffDuration) mods.buffDuration *= e.buffDuration;
    if (e.minigameReward) mods.minigameReward *= e.minigameReward;
    if (e.offlineCap) mods.offlineCap = Math.max(mods.offlineCap, e.offlineCap);
    if (e.offlineRate) mods.offlineRate = Math.max(mods.offlineRate, e.offlineRate);
    if (e.ddosResist) mods.ddosResist = Math.max(mods.ddosResist, e.ddosResist);
    if (e.ddosReward) mods.ddosReward = true;
    if (e.autoIncident) mods.autoIncident = true;
    if (e.startPackets) mods.startPackets = Math.max(mods.startPackets, e.startPackets);
    if (e.startBuff) mods.startBuff = true;
    if (e.ectsGain) mods.ectsGain *= e.ectsGain;
  };

  for (const id in G.upgrades) if (G.upgrades[id]) applyEffect(UPGRADE_BY_ID[id]?.effect);
  for (const id in G.nodes) if (G.nodes[id]) applyEffect(NODE_BY_ID[id]?.effect);

  // Ontdekte protocollen uit de patchkast geven elk 2% op alles.
  const protocollen = Object.keys(G.minigames?.patch?.discovered || {}).length;
  if (protocollen) mods.allMult *= 1 + protocollen * 0.02;

  // Bezit tellen
  let total = 0;
  const vakOwned = {};
  for (const vak of Object.keys(VAKKEN)) vakOwned[vak] = 0;
  for (const b of BUILDINGS) {
    const n = G.buildings[b.id] || 0;
    total += n;
    vakOwned[b.vak] += n;
  }
  D.totalBuildings = total;
  D.vakOwned = vakOwned;

  // Vakniveau: elke 25 apparaten in een vak geeft dat vak 2% erbij.
  for (const vak of Object.keys(VAKKEN)) {
    mods.vakMult[vak] *= 1 + Math.floor(vakOwned[vak] / 25) * 0.02;
  }

  // Synergie tussen gebouwen
  for (const syn of mods.synergies) {
    const from = G.buildings[syn.from] || 0;
    mods.buildingMult[syn.to] *= 1 + from * syn.per;
  }

  // Koffiepeil: hoeveel prestaties je hebt, ten opzichte van alles wat er is.
  const achCount = G.stats.achievements;
  D.koffie = Math.min(1, achCount / ACHIEVEMENTS.length);
  D.koffieMult = 1 + D.koffie * mods.koffiePower * 4;
  D.prestigeMult = 1 + G.prestige * 0.01;

  // Buffs
  let buffPps = 1;
  let buffClick = 1;
  const overclocked = {};
  for (const buff of G.buffs) {
    const def = BUFF_BY_ID[buff.id] || buff.def;
    const effect = buff.effect || def?.effect;
    if (!effect) continue;
    if (effect.ppsMult) buffPps *= effect.ppsMult;
    if (effect.clickMult) buffClick *= effect.clickMult;
    if (effect.randomBuildingMult && buff.building) {
      overclocked[buff.building] = (overclocked[buff.building] || 1) * effect.randomBuildingMult;
    }
  }
  D.buffPps = buffPps;
  D.buffClick = buffClick;

  const globalMult = mods.allMult * D.koffieMult * D.prestigeMult * buffPps;

  let pps = 0;
  for (const b of BUILDINGS) {
    const n = G.buildings[b.id] || 0;
    const each = b.basePps * mods.buildingMult[b.id] * mods.vakMult[b.vak] * (overclocked[b.id] || 1) * globalMult;
    D.perBuilding[b.id] = each;
    D.buildingMult[b.id] = mods.buildingMult[b.id] * mods.vakMult[b.vak] * (overclocked[b.id] || 1);
    pps += each * n;
  }
  D.pps = pps;

  const baseClick = (1 + mods.clickFlat) * mods.clickMult * globalMult * buffClick;
  D.clickValue = baseClick + pps * mods.clickFromPps;
  D.clickFromPps = mods.clickFromPps;

  D.goldenFreq = mods.goldenFreq;
  D.goldenDuration = mods.goldenDuration;
  D.goldenPower = mods.goldenPower;
  D.goldenDouble = mods.goldenDouble;
  D.buffDuration = mods.buffDuration;
  D.minigameReward = mods.minigameReward;
  D.offlineCap = mods.offlineCap;
  D.offlineRate = mods.offlineRate;
  D.ddosResist = mods.ddosResist;
  D.ddosReward = mods.ddosReward;
  D.autoIncident = mods.autoIncident;
  D.startPackets = mods.startPackets;
  D.startBuff = mods.startBuff;
  D.ectsGain = mods.ectsGain;
  D.allMult = mods.allMult;

  if (pps > G.stats.bestPps) G.stats.bestPps = pps;
  touch();
}

// --- Verdienen en uitgeven ---

export function earn(amount, { lifetime = true, handmade = false } = {}) {
  if (!(amount > 0)) return;
  G.packets += amount;
  if (lifetime) {
    G.stats.lifetime += amount;
    G.stats.runLifetime += amount;
  }
  if (handmade) G.stats.handmade += amount;
}

export function spend(amount) {
  if (G.packets < amount) return false;
  G.packets -= amount;
  return true;
}

// --- Gebouwen ---

export function buyBuilding(id, amount = 1) {
  const b = BUILDING_BY_ID[id];
  if (!b) return 0;
  const owned = G.buildings[id] || 0;
  const n = amount === "max" ? affordableAmount(b, owned, G.packets) : amount;
  if (n <= 0) return 0;
  const cost = bulkCost(b, owned, n);
  if (!spend(cost)) return 0;
  G.buildings[id] = owned + n;
  recompute();
  return n;
}

export function sellBuilding(id, amount = 1) {
  const b = BUILDING_BY_ID[id];
  if (!b) return 0;
  const owned = G.buildings[id] || 0;
  const n = amount === "max" ? owned : Math.min(owned, amount);
  if (n <= 0) return 0;
  earn(refundOf(b, owned, n), { lifetime: false });
  G.buildings[id] = owned - n;
  G.stats.sold += n;
  recompute();
  return n;
}

export function priceOf(id, amount = 1, selling = false) {
  const b = BUILDING_BY_ID[id];
  const owned = G.buildings[id] || 0;
  if (selling) {
    const n = amount === "max" ? owned : Math.min(owned, amount);
    return { amount: n, price: refundOf(b, owned, n) };
  }
  const n = amount === "max" ? affordableAmount(b, owned, G.packets) : amount;
  return { amount: n, price: bulkCost(b, owned, Math.max(n, 1)) };
}

export function nextCost(id) {
  return costOf(BUILDING_BY_ID[id], G.buildings[id] || 0);
}

// --- Upgrades ---

export function availableUpgrades() {
  const v = reqView();
  const out = [];
  for (const u of UPGRADES) {
    if (G.upgrades[u.id]) continue;
    let ok = false;
    try {
      ok = u.req ? !!u.req(v) : true;
    } catch {
      ok = false;
    }
    if (ok) out.push(u);
  }
  out.sort((a, b) => a.cost - b.cost);
  return out;
}

export function buyUpgrade(id) {
  const u = UPGRADE_BY_ID[id];
  if (!u || G.upgrades[id]) return false;
  if (!spend(u.cost)) return false;
  G.upgrades[id] = true;
  G.stats.upgrades++;
  recompute();
  return true;
}

// --- Prestaties ---

const achievementListeners = [];
export function onAchievement(fn) {
  achievementListeners.push(fn);
}

export function unlock(id) {
  if (G.achievements[id]) return false;
  const a = ACHIEVEMENT_BY_ID[id];
  if (!a) return false;
  G.achievements[id] = true;
  G.stats.achievements++;
  if (a.egg) G.stats.eggs++;
  recompute();
  for (const fn of achievementListeners) fn(a);
  return true;
}

export function checkAchievements() {
  const v = reqView();
  for (const a of ACHIEVEMENTS) {
    if (G.achievements[a.id] || !a.test) continue;
    let hit = false;
    try {
      hit = !!a.test(v);
    } catch {
      hit = false;
    }
    if (hit) unlock(a.id);
  }
}

export function koffieRank() {
  let label = KOFFIE_RANKS[0][1];
  for (const [threshold, name] of KOFFIE_RANKS) {
    if (D.koffie >= threshold) label = name;
  }
  return label;
}

// --- Studiepunten ---

export function ectsOnGraduate() {
  const total = ectsFor(G.stats.lifetime, D.ectsGain);
  return Math.max(0, total - G.prestige);
}

export function graduate() {
  const gained = ectsOnGraduate();
  if (gained <= 0) return 0;

  const keep = {
    skins: G.skins,
    uiterlijk: G.uiterlijk,
    achievements: G.achievements,
    nodes: G.nodes,
    eggs: G.eggs,
    prestige: G.prestige + gained,
    ects: G.ects + gained,
    stats: { ...G.stats },
    options: { ...G.options },
    minigames: G.minigames,
    seen: G.seen,
    cheated: G.cheated,
  };

  const fresh = freshState();
  Object.assign(G, fresh, {
    skins: keep.skins,
    uiterlijk: keep.uiterlijk,
    achievements: keep.achievements,
    nodes: keep.nodes,
    eggs: keep.eggs,
    prestige: keep.prestige,
    ects: keep.ects,
    options: keep.options,
    minigames: keep.minigames,
    seen: keep.seen,
    cheated: keep.cheated,
  });
  G.stats = {
    ...fresh.stats,
    clicks: keep.stats.clicks,
    lifetime: keep.stats.lifetime,
    upgrades: 0,
    achievements: keep.stats.achievements,
    goldenClicks: keep.stats.goldenClicks,
    goldenValue: keep.stats.goldenValue,
    ddosSeen: keep.stats.ddosSeen,
    ddosIgnored: keep.stats.ddosIgnored,
    eggs: keep.stats.eggs,
    handmade: keep.stats.handmade,
    prestiges: keep.stats.prestiges + 1,
    playTime: keep.stats.playTime,
    bestPps: keep.stats.bestPps,
    runPlayTime: 0,
    runStarted: Date.now(),
  };

  recompute();
  G.packets = D.startPackets;
  recompute();
  return gained;
}

export function buyNode(id) {
  const node = NODE_BY_ID[id];
  if (!node || G.nodes[id]) return false;
  if (node.needs.some((n) => !G.nodes[n])) return false;
  if (G.ects < node.cost) return false;
  G.ects -= node.cost;
  G.nodes[id] = true;
  recompute();
  if (NODES.every((n) => G.nodes[n.id])) unlock("prestige-boom");
  return true;
}

// --- Zichtbaarheid in de winkel ---
// Een gebouw blijft zichtbaar zodra je ooit de helft van de prijs had.

export function refreshSeen() {
  let changed = false;
  for (let i = 0; i < BUILDINGS.length; i++) {
    const b = BUILDINGS[i];
    if (G.seen[b.id]) continue;
    const prev = i === 0 ? true : (G.buildings[BUILDINGS[i - 1].id] || 0) > 0;
    if (prev && G.packets >= b.baseCost * 0.4) {
      G.seen[b.id] = true;
      changed = true;
    }
  }
  if (changed) touch();
  return changed;
}

// --- Uiterlijk ---

const skinListeners = [];
export function onSkin(fn) {
  skinListeners.push(fn);
}

export function skinKey(soort, id) {
  return `${soort}:${id}`;
}

export function skinUnlocked(soort, id) {
  return !!G.skins[skinKey(soort, id)];
}

export function checkSkins() {
  const v = reqView();
  for (const skin of ALLE_SKINS) {
    const key = skinKey(skin.soort, skin.id);
    if (G.skins[key]) continue;
    let ok = false;
    try {
      ok = !!skin.eis(v);
    } catch {
      ok = false;
    }
    if (!ok) continue;
    G.skins[key] = true;
    touch();
    for (const fn of skinListeners) fn(skin);
  }
}

// Een keuze die niet meer bestaat (of nooit is vrijgespeeld) valt terug op
// de standaard, zodat een oude save nooit een leeg uiterlijk oplevert.
export function fixUiterlijk() {
  for (const soort of Object.keys(UITERLIJK)) {
    const id = G.uiterlijk[soort];
    const bestaat = UITERLIJK[soort].some((s) => s.id === id);
    if (!bestaat || !skinUnlocked(soort, id)) G.uiterlijk[soort] = STANDAARD[soort];
  }
  for (const [soort, id] of Object.entries(STANDAARD)) G.skins[skinKey(soort, id)] = true;
}

export function kiesSkin(soort, id) {
  if (!UITERLIJK[soort]?.some((s) => s.id === id)) return false;
  if (!skinUnlocked(soort, id)) return false;
  G.uiterlijk[soort] = id;
  touch();
  return true;
}

export function isEggFound(id) {
  return !!G.eggs[id];
}

export function findEgg(id) {
  if (G.eggs[id]) return false;
  G.eggs[id] = true;
  return unlock(id);
}

export { BUILDINGS, BUILDING_BY_ID, VAKKEN, UPGRADES, UPGRADE_BY_ID, ACHIEVEMENTS, NODES, NODE_BY_ID, EGG_COUNT, UITERLIJK };
