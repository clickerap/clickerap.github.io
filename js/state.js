// De spelstaat en alles wat eruit volgt.
//
// Eén regel: buiten dit bestand wordt G.pps of G.clickValue nooit met de hand
// gezet. Je wijzigt bezit, upgrades of buffs en roept recompute() aan.

import { BUILDINGS, BUILDING_BY_ID, VAKKEN, costOf, bulkCost, affordableAmount } from "./data/buildings.js";
import { UPGRADES, UPGRADE_BY_ID } from "./data/upgrades.js";
import { ACHIEVEMENTS, ACHIEVEMENT_BY_ID, EGG_COUNT, KOFFIE_RANKS } from "./data/achievements.js";
import { NODES, NODE_BY_ID, ectsFor, BONUS_PER_PUNT } from "./data/skilltree.js";
import { effectVan } from "./data/buffs.js";
import { UITERLIJK, ALLE_SKINS, STANDAARD } from "./data/uiterlijk.js";

export const SAVE_VERSION = 5;

// "Koffie op" vraagt een vol koffiepeil. Hij telt daarom zelf niet mee,
// anders zou hij zichzelf nodig hebben.
const KOFFIE_VOL = "koffie-vol";

// Wie op systeemniveau om minder beweging vraagt, begint met animaties uit.
function wilMinderBeweging() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function freshState() {
  return {
    version: SAVE_VERSION,
    packets: 0,
    buildings: {},
    upgrades: {},
    achievements: {},
    nodes: {},
    eggs: {},
    skins: Object.fromEntries(Object.entries(STANDAARD).map(([soort, id]) => [`${soort}:${id}`, true])),
    uiterlijk: { ...STANDAARD },
    // Drie bewaarde looks: een naam en een keuze per soort.
    looks: [null, null, null],
    prestige: 0,
    ects: 0,
    buffs: [],
    incident: null,
    stats: {
      clicks: 0,
      lifetime: 0,
      runLifetime: 0,
      runStarted: Date.now(),
      goldenClicks: 0,
      goldenValue: 0,
      ddosSeen: 0,
      ddosIgnored: 0,
      sold: 0,
      handmade: 0,
      prestiges: 0,
      playTime: 0,
      runPlayTime: 0,
      bestPps: 0,
      clickCap: 0,
      besteReeks: 0,
    },
    options: {
      notation: "kort",
      sound: false,
      motion: !wilMinderBeweging(),
      buyAmount: 1,
      sellMode: false,
      netwerknaam: "",
    },
    minigames: {
      quiz: { streak: 0, best: 0, correct: 0, wrong: 0, nextAt: 0, onderwerp: "alles" },
      cli: { hostname: "SERGE", mode: "user", iface: null, vlanId: null, interfaces: {}, vlans: {}, banner: null, secret: false, gateway: null, vorige: null, opdracht: null, nextAt: 0, gedaan: 0 },
      market: { holdings: {}, prices: null, historie: null, trend: {}, nieuws: [], geruchten: [], stats: { verkopen: 0, gewonnen: 0, besteWinst: 0 }, profit: 0, tick: 0 },
      patch: { discovered: {}, gedaan: 0, luchtdicht: 0, nummer: 0, wachtrij: [], volgendeAt: 0, huidig: null },
      cursus: { gelezen: {}, open: null },
      laatste: null,
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
  clickFromPps: 0,
  perBuilding: {},
  buildingMult: {},
  totalBuildings: 0,
  vakOwned: {},
  aantalPrestaties: 0,
  aantalUpgrades: 0,
  aantalEggs: 0,
  koffie: 0,
  koffieMult: 1,
  prestigeMult: 1,
  allMult: 1,
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
  costMult: 1,
  sellRate: 0.25,
  startBuildings: {},
  laboTempo: 1,
  marktLimiet: 1,
};

let revision = 0;
export function rev() {
  return revision;
}
export function touch() {
  revision++;
}

// Het spelstaat-object zoals data-bestanden het verwachten (req-functies).
// De tellers van prestaties, upgrades en eggs worden uit de lijsten afgeleid,
// zodat ze nooit uit de pas kunnen lopen.
function reqView() {
  return {
    buildings: G.buildings,
    upgrades: G.upgrades,
    achievements: G.achievements,
    nodes: G.nodes,
    stats: { ...G.stats, achievements: D.aantalPrestaties, upgrades: D.aantalUpgrades, eggs: D.aantalEggs },
    prestige: G.prestige,
    pps: D.pps,
    koffie: D.koffie,
    totalBuildings: D.totalBuildings,
    vakOwned: D.vakOwned,
    protocollen: Object.keys(G.minigames?.patch?.discovered || {}).length,
    totaalPrestaties: ACHIEVEMENTS.length,
    werkorders: G.minigames?.patch?.gedaan || 0,
    luchtdicht: G.minigames?.patch?.luchtdicht || 0,
    opdrachten: G.minigames?.cli?.gedaan || 0,
    hoofdstukken: Object.keys(G.minigames?.cursus?.gelezen || {}).length,
    knooppunten: Object.keys(G.nodes || {}).length,
    looks: (G.looks || []).filter(Boolean).length,
    quizGoed: G.minigames?.quiz?.correct || 0,
    vrijgespeeld: Object.keys(G.skins).length,
  };
}

function tel(lijst, geldig) {
  let n = 0;
  for (const id in lijst) if (lijst[id] && geldig(id)) n++;
  return n;
}

// Een voorwaarde uit de data mag het spel nooit laten vastlopen.
function veilig(test, v) {
  try {
    return !!test(v);
  } catch {
    return false;
  }
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
    synergyMult: 1,
    costMult: 1,
    sellRate: 0.25,
    startBuildings: {},
    laboTempo: 1,
    marktLimiet: 1,
  };
  for (const b of BUILDINGS) mods.buildingMult[b.id] = 1;
  for (const vak of Object.keys(VAKKEN)) mods.vakMult[vak] = 1;

  const applyEffect = (e) => {
    if (!e) return;
    // Een knooppunt in de studieboom kan meer apparaten of vakken tegelijk raken.
    for (const bm of [].concat(e.buildingMult || [])) mods.buildingMult[bm.id] *= bm.x;
    for (const vm of [].concat(e.vakMult || [])) mods.vakMult[vm.vak] *= vm.x;
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
    if (e.synergyMult) mods.synergyMult *= e.synergyMult;
    if (e.costMult) mods.costMult *= e.costMult;
    if (e.sellRate) mods.sellRate = Math.max(mods.sellRate, e.sellRate);
    if (e.laboTempo) mods.laboTempo *= e.laboTempo;
    if (e.marktLimiet) mods.marktLimiet *= e.marktLimiet;
    if (e.startBuildings) {
      for (const [id, n] of Object.entries(e.startBuildings)) mods.startBuildings[id] = Math.max(mods.startBuildings[id] || 0, n);
    }
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

  D.aantalPrestaties = tel(G.achievements, (id) => ACHIEVEMENT_BY_ID[id]);
  D.aantalUpgrades = tel(G.upgrades, (id) => UPGRADE_BY_ID[id]);
  D.aantalEggs = tel(G.eggs, (id) => ACHIEVEMENT_BY_ID[id]?.egg);

  // Vakniveau: elke 25 apparaten in een vak geeft dat vak 2% erbij.
  for (const vak of Object.keys(VAKKEN)) {
    mods.vakMult[vak] *= 1 + Math.floor(vakOwned[vak] / 25) * 0.02;
  }

  // Synergie tussen gebouwen
  for (const syn of mods.synergies) {
    const from = G.buildings[syn.from] || 0;
    mods.buildingMult[syn.to] *= 1 + from * syn.per * mods.synergyMult;
  }

  // Koffiepeil: hoeveel prestaties je hebt, ten opzichte van alles wat er is.
  const koffieTeller = D.aantalPrestaties - (G.achievements[KOFFIE_VOL] ? 1 : 0);
  D.koffie = Math.min(1, koffieTeller / (ACHIEVEMENTS.length - 1));
  D.koffieMult = 1 + D.koffie * mods.koffiePower * 4;
  D.prestigeMult = 1 + G.prestige * BONUS_PER_PUNT;

  // Buffs en straffen. Het effect komt altijd uit de definities.
  let buffPps = 1;
  let buffClick = 1;
  const overclocked = {};
  for (const buff of G.buffs) {
    const effect = effectVan(buff, { kracht: mods.goldenPower, weerstand: mods.ddosResist });
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

  // Een klikbuff (of -straf) geldt voor de hele klik, ook voor het deel dat
  // uit je productie komt. Laat in het spel is dat bijna de hele klik.
  const baseClick = (1 + mods.clickFlat) * mods.clickMult * globalMult;
  D.clickValue = (baseClick + pps * mods.clickFromPps) * buffClick;
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
  D.costMult = mods.costMult;
  D.sellRate = mods.sellRate;
  D.startBuildings = mods.startBuildings;
  D.laboTempo = mods.laboTempo;
  D.marktLimiet = mods.marktLimiet;
  D.startBuff = mods.startBuff;
  D.ectsGain = mods.ectsGain;
  D.allMult = mods.allMult;

  if (pps > G.stats.bestPps) G.stats.bestPps = pps;
  touch();
}

// --- Verdienen en uitgeven ---
// Alleen eindige, positieve bedragen. Een NaN mag de voorraad nooit bereiken.

export function earn(amount, { lifetime = true, handmade = false } = {}) {
  if (!(amount > 0) || !Number.isFinite(amount)) return;
  G.packets += amount;
  if (lifetime) {
    G.stats.lifetime += amount;
    G.stats.runLifetime += amount;
  }
  if (handmade) G.stats.handmade += amount;
}

export function spend(amount) {
  if (!(amount >= 0) || !Number.isFinite(amount)) return false;
  if (G.packets < amount) return false;
  G.packets -= amount;
  return true;
}

// --- Gebouwen ---

// 1, 10, 100 of "max". Al het andere telt als 1.
function aantalVan(amount, max) {
  if (amount === "max") return max;
  const n = Math.floor(Number(amount));
  return n > 0 ? n : 1;
}

// Een apparaat met de korting uit de studieboom erin verwerkt. De prijzen
// blijven zo op één plek berekend, in data/buildings.js.
function metKorting(b) {
  return D.costMult === 1 ? b : { ...b, baseCost: b.baseCost * D.costMult };
}

function terugVoor(b, owned, n) {
  return Math.floor(bulkCost(metKorting(b), Math.max(0, owned - n), n) * D.sellRate);
}

export function buyBuilding(id, amount = 1) {
  const b = BUILDING_BY_ID[id] && metKorting(BUILDING_BY_ID[id]);
  if (!b) return 0;
  const owned = G.buildings[id] || 0;
  const n = aantalVan(amount, affordableAmount(b, owned, G.packets));
  if (!(n > 0)) return 0;
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
  const n = Math.min(owned, aantalVan(amount, owned));
  if (!(n > 0)) return 0;
  earn(terugVoor(b, owned, n), { lifetime: false });
  G.buildings[id] = owned - n;
  G.stats.sold += n;
  recompute();
  return n;
}

export function priceOf(id, amount = 1, selling = false) {
  const b = metKorting(BUILDING_BY_ID[id]);
  const owned = G.buildings[id] || 0;
  if (selling) {
    const n = Math.min(owned, aantalVan(amount, owned));
    return { amount: n, price: terugVoor(BUILDING_BY_ID[id], owned, n) };
  }
  const n = aantalVan(amount, affordableAmount(b, owned, G.packets));
  return { amount: n, price: bulkCost(b, owned, Math.max(n, 1)) };
}

export function nextCost(id) {
  return costOf(metKorting(BUILDING_BY_ID[id]), G.buildings[id] || 0);
}

// --- Upgrades ---
// De lijst wordt hooguit één keer per seconde opnieuw uitgerekend, of meteen
// als er iets veranderde. De interface vraagt hem tien keer per seconde op.

let upgradeCache = null;

export function availableUpgrades() {
  const nu = Date.now();
  if (upgradeCache && upgradeCache.rev === revision && nu - upgradeCache.tijd < 1000) return upgradeCache.lijst;
  const v = reqView();
  const out = [];
  for (const u of UPGRADES) {
    if (G.upgrades[u.id]) continue;
    if (!u.req || veilig(u.req, v)) out.push(u);
  }
  out.sort((a, b) => a.cost - b.cost);
  upgradeCache = { rev: revision, tijd: nu, lijst: out };
  return out;
}

export function buyUpgrade(id) {
  const u = UPGRADE_BY_ID[id];
  if (!u || G.upgrades[id]) return false;
  if (!spend(u.cost)) return false;
  G.upgrades[id] = true;
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
  recompute();
  for (const fn of achievementListeners) {
    try {
      fn(a);
    } catch (err) {
      console.error(`Fout bij het melden van prestatie "${id}"`, err);
    }
  }
  return true;
}

export function checkAchievements() {
  const v = reqView();
  for (const a of ACHIEVEMENTS) {
    if (G.achievements[a.id] || !a.test) continue;
    if (veilig(a.test, v)) unlock(a.id);
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
    looks: G.looks,
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
    looks: keep.looks,
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
    goldenClicks: keep.stats.goldenClicks,
    goldenValue: keep.stats.goldenValue,
    ddosSeen: keep.stats.ddosSeen,
    ddosIgnored: keep.stats.ddosIgnored,
    handmade: keep.stats.handmade,
    prestiges: keep.stats.prestiges + 1,
    playTime: keep.stats.playTime,
    bestPps: keep.stats.bestPps,
    besteReeks: keep.stats.besteReeks,
    runPlayTime: 0,
    runStarted: Date.now(),
  };

  recompute();
  G.packets = D.startPackets;
  // Apparaten om mee te beginnen, uit de studieboom.
  for (const [id, n] of Object.entries(D.startBuildings)) {
    if (BUILDING_BY_ID[id]) G.buildings[id] = Math.max(G.buildings[id] || 0, n);
  }
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
// Een gebouw blijft zichtbaar zodra je ooit 40% van de prijs had.

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
    if (G.skins[key] || !veilig(skin.eis, v)) continue;
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

// Een look dragen zet elke soort: wat in de look staat en je al hebt, anders
// de standaard. Zo blijft er nooit iets van je vorige look hangen. Geeft terug
// hoeveel er gelukt is, zodat het spel kan zeggen wat nog ontbreekt.
export function draagLook(keuze) {
  let toegepast = 0;
  let totaal = 0;
  for (const soort of Object.keys(UITERLIJK)) {
    const id = keuze[soort] ?? STANDAARD[soort];
    totaal++;
    if (UITERLIJK[soort].some((s) => s.id === id) && skinUnlocked(soort, id)) {
      G.uiterlijk[soort] = id;
      toegepast++;
    } else {
      G.uiterlijk[soort] = STANDAARD[soort];
    }
  }
  touch();
  return { toegepast, totaal };
}

export function bewaarLook(plek, naam) {
  G.looks[plek] = { naam: String(naam || "").trim().slice(0, 24) || `Look ${plek + 1}`, uiterlijk: { ...G.uiterlijk } };
  touch();
}

export function findEgg(id) {
  if (G.eggs[id]) return false;
  G.eggs[id] = true;
  return unlock(id);
}

export { BUILDINGS, BUILDING_BY_ID, VAKKEN, UPGRADES, UPGRADE_BY_ID, ACHIEVEMENTS, NODES, NODE_BY_ID, EGG_COUNT, UITERLIJK };
