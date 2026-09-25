// Opslaan, laden, migreren en uitwisselen.
//
// De save bevat alleen ruwe feiten: bezit, gekochte id's, statistieken.
// Alles wat daaruit volgt wordt bij het laden opnieuw berekend, zodat een
// balanswijziging nooit een oude save kapotmaakt. Wat binnenkomt, uit de
// browser of uit een geplakte code, wordt eerst veld voor veld nagekeken.

import { G, D, SAVE_VERSION, freshState, recompute, refreshSeen, fixUiterlijk } from "./state.js";
import { setNotation } from "./format.js";
import { BUILDING_BY_ID } from "./data/buildings.js";
import { UPGRADE_BY_ID } from "./data/upgrades.js";
import { ACHIEVEMENT_BY_ID } from "./data/achievements.js";
import { NODE_BY_ID } from "./data/skilltree.js";
import { ALLE_SKINS, UITERLIJK } from "./data/uiterlijk.js";
import { bekendeBuff, INCIDENT_BY_ID } from "./data/buffs.js";
import { GOEDEREN, KOPPEN, MARKT } from "./data/market.js";
import { PROTOCOLLEN, MATEN, WERK, DREMPELS } from "./data/patch.js";
import { maakPuzzel, schoneKabels, alleVerbonden } from "./minigames/kabelgoot.js";
import { HOOFDSTUK_BY_ID } from "./data/cursus.js";
import { ONDERWERP_BY_ID } from "./data/vragen.js";
import { POORTEN, MODI, TAKEN, geldigAdres, geldigeVlan, geldigeVlannaam, schoonOpdracht } from "./data/terminal.js";

export const SAVE_KEY = "sergeClicker";
export const LEGACY_KEY = "sergeClickerSave";
const BACKUP_KEY = `${SAVE_KEY}:backup`;
const LABO = ["cursus", "quiz", "cli", "market", "patch"];
const SKIN_KEYS = new Set(ALLE_SKINS.map((s) => `${s.soort}:${s.id}`));
// De hoofddeksels waren eerst portretten en zijn nu accessoires, die je bij
// elk portret kunt dragen. Wie er een had, houdt hem.
const VERHUISD = {
  "portret:afgestudeerd": "accessoire:baret",
  "portret:gentleman": "accessoire:hogehoed",
  "portret:kroon": "accessoire:kroon",
};

// --- De opslag zelf ---
// localStorage kan ontbreken of geblokkeerd zijn (privévenster, strenge
// cookie-instellingen). Het spel speelt dan gewoon, alleen zonder opslag.

let opslagWerkt = true;

function lees(sleutel) {
  try {
    return globalThis.localStorage.getItem(sleutel);
  } catch {
    opslagWerkt = false;
    return null;
  }
}

function schrijf(sleutel, waarde) {
  try {
    globalThis.localStorage.setItem(sleutel, waarde);
    return true;
  } catch (err) {
    console.warn("Opslaan mislukt", err);
    return false;
  }
}

function wis(sleutel) {
  try {
    globalThis.localStorage.removeItem(sleutel);
  } catch {
    opslagWerkt = false;
  }
}

export function opslagBeschikbaar() {
  return opslagWerkt;
}

// --- Bestanden ---
// Opslaan gaat altijd naar het bestand waarmee deze pagina geladen is, ook als
// je intussen een ander bestand kiest en de pagina herlaadt.

let actiefSlot = null;

export function currentSlot() {
  const slot = lees(`${SAVE_KEY}:slot`);
  return slot === "2" || slot === "3" ? slot : "1";
}

export function actiefBestand() {
  return actiefSlot ?? currentSlot();
}

function keyFor(slot) {
  return slot === "1" ? SAVE_KEY : `${SAVE_KEY}:${slot}`;
}

// Bewaart het huidige bestand en zet het andere klaar voor na het herladen.
export function wisselSlot(slot) {
  save();
  schrijf(`${SAVE_KEY}:slot`, String(slot));
}

// --- Twee tabbladen ---
// Staat het spel twee keer open op hetzelfde bestand, dan zouden ze elkaars
// voortgang overschrijven. Een nieuw tabblad vraagt de oudere om nog één keer
// op te slaan en daarna te stoppen, en laadt pas dan.

let passief = false;
const tabId = Math.random().toString(36).slice(2);

export function isPassief() {
  return passief;
}

export function neemTabbladOver({ wacht = 120, bijOvername } = {}) {
  if (typeof BroadcastChannel !== "function") return Promise.resolve();
  const kanaal = new BroadcastChannel("serge-clicker");
  const slot = currentSlot();
  kanaal.addEventListener("message", (e) => {
    const { soort, tab, slot: hunSlot } = e.data || {};
    if (soort !== "hallo" || tab === tabId || hunSlot !== actiefBestand() || passief) return;
    save();
    passief = true;
    kanaal.postMessage({ soort: "overgedragen", tab: tabId, naar: tab });
    bijOvername?.();
  });
  return new Promise((klaar) => {
    const stop = setTimeout(klaar, wacht);
    kanaal.addEventListener("message", (e) => {
      if (e.data?.soort === "overgedragen" && e.data.naar === tabId) {
        clearTimeout(stop);
        klaar();
      }
    });
    kanaal.postMessage({ soort: "hallo", tab: tabId, slot });
  });
}

// --- Wegschrijven ---

const ids = (map) => Object.keys(map).filter((k) => map[k]);

function serialize() {
  G.lastSeen = Date.now();
  return {
    version: SAVE_VERSION,
    packets: G.packets,
    buildings: G.buildings,
    upgrades: ids(G.upgrades),
    achievements: ids(G.achievements),
    nodes: ids(G.nodes),
    eggs: ids(G.eggs),
    skins: ids(G.skins),
    uiterlijk: G.uiterlijk,
    looks: G.looks,
    seen: ids(G.seen),
    prestige: G.prestige,
    ects: G.ects,
    stats: G.stats,
    options: G.options,
    minigames: G.minigames,
    buffs: G.buffs.map((b) => ({
      id: b.id,
      ...(b.until ? { until: b.until } : {}),
      ...(b.charges ? { charges: b.charges } : {}),
      ...(b.building ? { building: b.building } : {}),
    })),
    incident: G.incident,
    lastSeen: G.lastSeen,
    cheated: G.cheated,
  };
}

export function save() {
  if (passief) return false;
  return schrijf(keyFor(actiefBestand()), JSON.stringify(serialize()));
}

// --- Nakijken ---
// Alles wat niet klopt valt terug op de beginwaarde. Onbekende id's verdwijnen,
// getallen zijn altijd eindig, en tekst uit de save blijft kort.

const isObject = (v) => !!v && typeof v === "object" && !Array.isArray(v);

function getal(v, standaard = 0, min = 0, max = Number.MAX_VALUE) {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : standaard;
}

const geheel = (v, standaard = 0, min = 0, max = Number.MAX_SAFE_INTEGER) => Math.floor(getal(v, standaard, min, max));
const waarOnwaar = (v, standaard) => (typeof v === "boolean" ? v : standaard);

// Een lijst of map van id's, met alleen de id's die het spel kent.
function idMap(lijst, bekend) {
  const uit = {};
  const alle = Array.isArray(lijst) ? lijst : isObject(lijst) ? Object.keys(lijst).filter((k) => lijst[k]) : [];
  for (const id of alle) if (typeof id === "string" && bekend(id)) uit[id] = true;
  return uit;
}

const kent = (map) => (id) => Object.hasOwn(map, id);

export function schoon(data) {
  const fresh = freshState();
  const d = isObject(data) ? data : {};
  const nu = Date.now();

  const buildings = {};
  const bezit = isObject(d.buildings) ? d.buildings : {};
  for (const id of Object.keys(BUILDING_BY_ID)) {
    const n = geheel(bezit[id], 0, 0, 1e7);
    if (n > 0) buildings[id] = n;
  }

  const stats = {};
  const bronStats = isObject(d.stats) ? d.stats : {};
  for (const [sleutel, standaard] of Object.entries(fresh.stats)) stats[sleutel] = getal(bronStats[sleutel], standaard);

  const o = isObject(d.options) ? d.options : {};
  const options = {
    notation: ["kort", "voluit", "wetenschappelijk"].includes(o.notation) ? o.notation : fresh.options.notation,
    sound: waarOnwaar(o.sound, fresh.options.sound),
    motion: waarOnwaar(o.motion, fresh.options.motion),
    buyAmount: [1, 10, 100, "max"].includes(o.buyAmount) ? o.buyAmount : 1,
    sellMode: waarOnwaar(o.sellMode, false),
    netwerknaam: typeof o.netwerknaam === "string" ? o.netwerknaam.slice(0, 24) : "",
  };

  const uiterlijk = { ...fresh.uiterlijk };
  if (isObject(d.uiterlijk)) {
    for (const soort of Object.keys(UITERLIJK)) {
      if (typeof d.uiterlijk[soort] === "string") uiterlijk[soort] = d.uiterlijk[soort];
    }
    // Een hoofddeksel dat vroeger een portret was, wordt het accessoire.
    const verhuisd = VERHUISD[`portret:${uiterlijk.portret}`];
    if (verhuisd) {
      uiterlijk.accessoire = verhuisd.split(":")[1];
      uiterlijk.portret = fresh.uiterlijk.portret;
    }
  }
  // Bewaarde looks: hooguit drie, met een korte naam en alleen keuzes die
  // bestaan. Of ze vrijgespeeld zijn, kijkt het spel pas bij het dragen.
  const looks = [0, 1, 2].map((i) => {
    const l = Array.isArray(d.looks) ? d.looks[i] : null;
    if (!isObject(l) || !isObject(l.uiterlijk)) return null;
    const keuze = {};
    for (const [soort, lijst] of Object.entries(UITERLIJK)) {
      const id = l.uiterlijk[soort];
      if (typeof id === "string" && lijst.some((s) => s.id === id)) keuze[soort] = id;
    }
    const naam = typeof l.naam === "string" && l.naam.trim() ? l.naam.trim().slice(0, 24) : `Look ${i + 1}`;
    return Object.keys(keuze).length ? { naam, uiterlijk: keuze } : null;
  });

  const skinLijst = (Array.isArray(d.skins) ? d.skins : isObject(d.skins) ? Object.keys(d.skins).filter((k) => d.skins[k]) : [])
    .map((k) => VERHUISD[k] || k);

  const buffs = [];
  for (const b of Array.isArray(d.buffs) ? d.buffs : []) {
    if (!isObject(b) || typeof b.id !== "string" || !bekendeBuff(b.id)) continue;
    const entry = { id: b.id };
    if (typeof b.building === "string" && Object.hasOwn(BUILDING_BY_ID, b.building)) entry.building = b.building;
    const charges = geheel(b.charges, 0, 0, 1000);
    const until = getal(b.until, 0);
    if (charges > 0) entry.charges = charges;
    else if (until > nu) entry.until = until;
    else continue;
    buffs.push(entry);
  }

  let incident = null;
  if (isObject(d.incident) && typeof d.incident.id === "string" && Object.hasOwn(INCIDENT_BY_ID, d.incident.id)) {
    incident = {
      id: d.incident.id,
      startedAt: getal(d.incident.startedAt, nu),
      until: getal(d.incident.until, nu),
      cost: getal(d.incident.cost),
    };
  }

  return {
    ...fresh,
    packets: getal(d.packets),
    buildings,
    upgrades: idMap(d.upgrades, kent(UPGRADE_BY_ID)),
    achievements: idMap(d.achievements, kent(ACHIEVEMENT_BY_ID)),
    nodes: idMap(d.nodes, kent(NODE_BY_ID)),
    eggs: idMap(d.eggs, (id) => Object.hasOwn(ACHIEVEMENT_BY_ID, id) && ACHIEVEMENT_BY_ID[id].egg === true),
    skins: { ...fresh.skins, ...idMap(skinLijst, (k) => SKIN_KEYS.has(k)) },
    uiterlijk,
    looks,
    seen: idMap(d.seen, kent(BUILDING_BY_ID)),
    prestige: getal(d.prestige),
    ects: getal(d.ects),
    stats,
    options,
    minigames: schoonLabo(d.minigames, nu),
    buffs,
    incident,
    lastSeen: getal(d.lastSeen, nu),
    cheated: d.cheated === true,
  };
}

function schoonLabo(m, nu) {
  const bron = isObject(m) ? m : {};
  // Wachttijden duren hooguit een paar minuten; verder in de toekomst klopt niet.
  const wachttijd = (v) => getal(v, 0, 0, nu + 10 * 60 * 1000);

  const q = isObject(bron.quiz) ? bron.quiz : {};
  const quiz = {
    streak: geheel(q.streak),
    best: geheel(q.best),
    correct: geheel(q.correct),
    wrong: geheel(q.wrong),
    nextAt: wachttijd(q.nextAt),
    onderwerp: q.onderwerp === "alles" || Object.hasOwn(ONDERWERP_BY_ID, q.onderwerp) ? q.onderwerp : "alles",
  };

  const c = isObject(bron.cli) ? bron.cli : {};
  const interfaces = {};
  if (isObject(c.interfaces)) {
    for (const poort of POORTEN) {
      const p = c.interfaces[poort];
      if (!isObject(p)) continue;
      interfaces[poort] = {
        ip: geldigAdres(p.ip) ? p.ip : null,
        mask: geldigAdres(p.mask) ? p.mask : null,
        up: p.up === true,
        omschrijving: typeof p.omschrijving === "string" ? p.omschrijving.slice(0, 80) : null,
      };
      if (p.modus === "access" || p.modus === "trunk") interfaces[poort].modus = p.modus;
      if (p.modus !== "trunk" && geldigeVlan(p.vlan)) interfaces[poort].vlan = p.vlan;
    }
  }
  const opdracht = schoonOpdracht(c.opdracht);
  const vlans = {};
  if (isObject(c.vlans)) {
    for (const [id, naam] of Object.entries(c.vlans)) {
      if (geldigeVlan(Number(id)) && geldigeVlannaam(naam)) vlans[Number(id)] = naam;
    }
  }
  const iface = POORTEN.includes(c.iface) ? c.iface : null;
  const vlanId = geldigeVlan(c.vlanId) && vlans[c.vlanId] ? c.vlanId : null;
  let mode = MODI.includes(c.mode) ? c.mode : "user";
  if (mode === "iface" && !iface) mode = "config";
  if (mode === "vlan" && !vlanId) mode = "config";
  const cli = {
    hostname: typeof c.hostname === "string" && /^[a-z0-9-]{1,16}$/i.test(c.hostname) ? c.hostname.toUpperCase() : "SERGE",
    mode,
    iface: mode === "iface" ? iface : null,
    vlanId: mode === "vlan" ? vlanId : null,
    interfaces,
    vlans,
    banner: typeof c.banner === "string" && c.banner.trim() ? c.banner.slice(0, 120) : null,
    secret: c.secret === true,
    gateway: geldigAdres(c.gateway) ? c.gateway : null,
    vorige: Object.hasOwn(TAKEN, c.vorige) ? c.vorige : null,
    opdracht,
    nextAt: wachttijd(c.nextAt),
    gedaan: geheel(c.gedaan),
  };

  const mk = isObject(bron.market) ? bron.market : {};
  let prices = isObject(mk.prices) ? {} : null;
  const historie = {};
  for (const g of GOEDEREN) {
    if (!prices) break;
    const prijs = getal(mk.prices[g.id], NaN, MARKT.minKoers, MARKT.maxKoers);
    if (!Number.isFinite(prijs)) {
      prices = null;
      break;
    }
    prices[g.id] = prijs;
    const reeks = isObject(mk.historie) && Array.isArray(mk.historie[g.id]) ? mk.historie[g.id] : [];
    historie[g.id] = reeks.slice(-MARKT.historie).map((v) => getal(v, prijs, MARKT.minKoers, MARKT.maxKoers));
    if (!historie[g.id].length) historie[g.id] = [prijs];
  }
  const kop = (v) => (Number.isInteger(v) && v >= 0 && v < KOPPEN.length ? v : null);
  const holdings = {};
  if (isObject(mk.holdings)) {
    for (const g of GOEDEREN) {
      const h = mk.holdings[g.id];
      if (!isObject(h)) continue;
      const stuks = getal(h.stuks);
      const inleg = getal(h.inleg);
      if (!(stuks > 0 && inleg > 0)) continue;
      const positie = { stuks, inleg };
      if (MARKT.winstOrders.includes(h.winstBij)) positie.winstBij = h.winstBij;
      if (MARKT.verliesOrders.includes(h.verliesBij)) positie.verliesBij = h.verliesBij;
      if (kop(h.gerucht) !== null) positie.gerucht = h.gerucht;
      if (h.voorkennis === true) positie.voorkennis = true;
      holdings[g.id] = positie;
    }
  }
  const trend = {};
  if (isObject(mk.trend)) {
    for (const g of GOEDEREN) {
      const v = getal(mk.trend[g.id], NaN, -MARKT.trendMax, MARKT.trendMax);
      if (Number.isFinite(v)) trend[g.id] = v;
    }
  }
  const soorten = ["nu", "gerucht", "bevestigd", "ontkend"];
  const nieuws = (Array.isArray(mk.nieuws) ? mk.nieuws : [])
    .filter((n) => isObject(n) && kop(n.kop) !== null && soorten.includes(n.soort))
    .slice(0, 8)
    .map((n) => ({ kop: n.kop, soort: n.soort, tijd: getal(n.tijd, nu, 0, nu) }));
  const geruchten = (Array.isArray(mk.geruchten) ? mk.geruchten : [])
    .filter((r) => isObject(r) && kop(r.kop) !== null && KOPPEN[r.kop].gerucht)
    .slice(0, GOEDEREN.length)
    .map((r) => ({ kop: r.kop, opTick: geheel(r.opTick), waar: r.waar === true }));
  const st = isObject(mk.stats) ? mk.stats : {};
  const market = {
    holdings,
    prices,
    historie: prices ? historie : null,
    trend,
    nieuws,
    geruchten,
    stats: { verkopen: geheel(st.verkopen), gewonnen: geheel(st.gewonnen), besteWinst: getal(st.besteWinst) },
    profit: getal(mk.profit, 0, -Number.MAX_VALUE),
    tick: geheel(mk.tick),
  };

  const patch = schoonPatch(isObject(bron.patch) ? bron.patch : {}, nu);

  const cu = isObject(bron.cursus) ? bron.cursus : {};
  const cursus = {
    gelezen: idMap(cu.gelezen, kent(HOOFDSTUK_BY_ID)),
    open: typeof cu.open === "string" && Object.hasOwn(HOOFDSTUK_BY_ID, cu.open) ? cu.open : null,
  };

  return { quiz, cli, market, patch, cursus, laatste: LABO.includes(bron.laatste) ? bron.laatste : null };
}

// Een werkorder is een maat en een zaadje; de puzzel zelf volgt daaruit. Van de
// order waar je aan werkt, blijven alleen de kabels die echt kunnen liggen.
function schoonPatch(p, nu) {
  const order = (o) => (isObject(o) && Object.hasOwn(MATEN, o.n) && Number.isInteger(o.zaad) && o.zaad >= 0 && o.zaad < 2 ** 32
    ? { nr: geheel(o.nr), n: Number(o.n), zaad: o.zaad }
    : null);
  const wachtrij = (Array.isArray(p.wachtrij) ? p.wachtrij : []).map(order).filter(Boolean).slice(0, WERK.wachtrij);
  let huidig = null;
  const h = isObject(p.huidig) ? order(p.huidig) : null;
  if (h) {
    const puzzel = maakPuzzel(h.n, h.zaad);
    const kabels = schoneKabels(puzzel, p.huidig.kabels);
    huidig = { ...h, kabels, hulp: geheel(p.huidig.hulp, 0, 0, 100) };
    // Opgeleverd telt alleen als de kabels dat ook echt waren.
    if (p.huidig.klaar === true && alleVerbonden(puzzel, kabels)) {
      huidig.klaar = true;
      huidig.winst = getal(p.huidig.winst);
      huidig.dicht = p.huidig.dicht === true;
      huidig.protocol = typeof p.huidig.protocol === "string" && Object.hasOwn(PROTOCOLLEN, p.huidig.protocol) ? p.huidig.protocol : null;
    }
  }
  return {
    discovered: idMap(p.discovered, kent(PROTOCOLLEN)),
    gedaan: geheel(p.gedaan),
    luchtdicht: geheel(p.luchtdicht),
    nummer: geheel(p.nummer),
    wachtrij,
    // Een order komt hooguit één wachttijd na nu; verder in de toekomst klopt niet.
    volgendeAt: getal(p.volgendeAt, 0, 0, nu + WERK.interval * 1000),
    huidig,
  };
}

// --- Migraties ---
// Elke stap brengt een save één versie verder. Een save zonder versienummer
// komt uit de allereerste versie van het spel.

const LEGACY_BUILDINGS = {
  clickerCount: "patchkabel",
  autoClickerCount: "switch",
  superClickerCount: "router",
  fiberCount: "fiber",
  datacenterCount: "rack",
  brainCount: "datacenter",
  proxmoxCount: "proxmox",
  adCount: "ad",
  quantumCount: "quantum",
  hypervCount: "vsphere",
  aiCount: "neural",
  singularityCount: "singularity",
  rainbowRouterCount: "sdn",
  galacticFirewallCount: "firewall",
  timeServerCount: "darkfiber",
  parallelVpnCount: "multiverse",
  godModeCount: "dyson",
};

// Versie 1: we redden wat we kunnen. Voortgang wordt omgerekend naar een
// startbedrag plus de apparaten en statistieken.
function vanVersie1(data) {
  const state = freshState();
  state.version = 2;
  state.packets = Number(data.score) || 0;
  for (const key in LEGACY_BUILDINGS) {
    const n = Number(data[key]) || 0;
    if (n > 0) state.buildings[LEGACY_BUILDINGS[key]] = n;
  }
  state.stats.clicks = Number(data.totalManualClicks) || 0;
  state.stats.lifetime = Number(data.totalPacketsGenerated) || state.packets;
  state.stats.runLifetime = state.stats.lifetime;
  state.stats.goldenClicks = Number(data.goldenPacketClicks) || 0;
  state.stats.goldenValue = Number(data.goldenPacketTotalValue) || 0;
  // De oude "Evolve" was een eenmalige mijlpaal. Wie hem gehaald had krijgt
  // er een studiepunt en de bijbehorende prestatie voor terug.
  if (data.hasEvolved) {
    state.prestige = 1;
    state.ects = 1;
    state.stats.prestiges = 1;
  }
  return state;
}

// Versie 2: namen uit de eerste opzet van het uiterlijk-systeem. Effecten van
// buffs worden sinds versie 3 niet meer opgeslagen maar afgeleid.
function vanVersie2(data) {
  const lijst = Array.isArray(data.skins) ? data.skins : isObject(data.skins) ? Object.keys(data.skins).filter((k) => data.skins[k]) : [];
  const skins = new Set(lijst);
  const hernoemd = {
    "portret:standaard": "portret:serge",
    "portret:topologie": "portret:blauwdruk",
    "portret:goud": "ring:goud",
    "portret:regenboog": "ring:regenboog",
  };
  for (const [oud, nieuw] of Object.entries(hernoemd)) if (skins.has(oud)) skins.add(nieuw);
  const uiterlijk = { ...(isObject(data.uiterlijk) ? data.uiterlijk : {}) };
  if (data.options?.portret === "evolved") {
    skins.add("portret:evolved");
    uiterlijk.portret = "evolved";
  }
  return { ...data, version: 3, skins: [...skins], uiterlijk };
}

// Versie 3: een positie op de markt was een bedrag met een aankoopkoers. Sinds
// versie 4 is het een aantal eenheden met wat je ervoor betaalde, zodat bijkopen
// een eerlijke gemiddelde koers geeft.
function vanVersie3(data) {
  const markt = isObject(data.minigames?.market) ? data.minigames.market : null;
  if (!markt || !isObject(markt.holdings)) return { ...data, version: 4 };
  const holdings = {};
  for (const [id, h] of Object.entries(markt.holdings)) {
    const invested = Number(h?.invested);
    const koers = Number(h?.koers);
    if (invested > 0 && koers > 0) holdings[id] = { stuks: invested / koers, inleg: invested };
  }
  return { ...data, version: 4, minigames: { ...data.minigames, market: { ...markt, holdings } } };
}

// Versie 4: in de patchkast kweekte je kabels die protocollen opleverden. Sinds
// versie 5 lever je werkorders op. Wat je ontdekte, blijft; de teller van
// opgeleverde orders begint bij de drempel van je laatste protocol.
function vanVersie4(data) {
  const oud = isObject(data.minigames?.patch) ? data.minigames.patch : null;
  if (!oud) return { ...data, version: 5 };
  const discovered = idMap(oud.discovered, kent(PROTOCOLLEN));
  const aantal = Object.keys(discovered).length;
  const patch = { discovered, gedaan: aantal ? DREMPELS[aantal - 1] : 0 };
  return { ...data, version: 5, minigames: { ...data.minigames, patch } };
}

const MIGRATIES = [
  { naar: 2, stap: vanVersie1 },
  { naar: 3, stap: vanVersie2 },
  { naar: 4, stap: vanVersie3 },
  { naar: 5, stap: vanVersie4 },
];

export function migreer(data) {
  let d = isObject(data) ? data : {};
  let versie = Number(d.version) || 1;
  for (const { naar, stap } of MIGRATIES) {
    if (versie < naar) {
      d = stap(d);
      versie = naar;
    }
  }
  return d;
}

function applyData(data) {
  Object.assign(G, schoon(migreer(data)));
  setNotation(G.options.notation);
  recompute();
  fixUiterlijk();
  refreshSeen();
}

// --- Laden ---

export function load(slot = currentSlot()) {
  actiefSlot = slot;
  let raw = lees(keyFor(slot));
  let legacy = false;
  if (!raw && slot === "1") {
    raw = lees(LEGACY_KEY);
    legacy = !!raw;
  }
  if (!raw) {
    applyData(freshState());
    return { loaded: false, opslag: opslagWerkt };
  }
  try {
    const data = JSON.parse(raw);
    if (!isObject(data)) throw new Error("De save is geen object.");
    const versie = legacy ? 1 : Number(data.version) || 1;
    applyData(legacy ? { ...data, version: 1 } : data);
    const away = versie >= 2 ? Math.max(0, (Date.now() - (Number(data.lastSeen) || Date.now())) / 1000) : 0;
    return { loaded: true, migrated: versie < 2, away, opslag: opslagWerkt };
  } catch (err) {
    console.warn("Save onleesbaar", err);
    // De kapotte save apart bewaren; anders overschrijft het volgende
    // automatische opslaan hem voorgoed.
    schrijf(`${SAVE_KEY}:kapot`, raw);
    applyData(freshState());
    return { loaded: false, corrupt: true, opslag: opslagWerkt };
  }
}

export function wipe() {
  const slot = actiefBestand();
  wis(keyFor(slot));
  if (slot === "1") wis(LEGACY_KEY);
  applyData(freshState());
}

export function slotSummary(slot) {
  const raw = lees(keyFor(slot)) || (slot === "1" ? lees(LEGACY_KEY) : null);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    return {
      packets: Number(data.packets ?? data.score) || 0,
      prestige: Number(data.prestige) || 0,
      lastSeen: Number(data.lastSeen) || 0,
    };
  } catch {
    return null;
  }
}

// --- Uitwisselen ---
// Base64 van de JSON, met een kop zodat je ziet wat je voor je hebt.

const HEADER = "SERGE1:";
const KAPOT = "De code is beschadigd of onvolledig. Kopieer hem opnieuw, helemaal.";

export function exportSave() {
  const json = JSON.stringify(serialize());
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return HEADER + btoa(binary);
}

export function leesCode(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed.startsWith(HEADER)) throw new Error("Dit is geen Serge Clicker-code. Een code begint met SERGE1:.");
  let data;
  try {
    const binary = atob(trimmed.slice(HEADER.length).replace(/\s+/g, ""));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    data = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new Error(KAPOT);
  }
  if (!isObject(data)) throw new Error(KAPOT);
  return data;
}

// Vóór een import bewaren we de huidige stand, zodat je terug kunt.
export function importSave(text) {
  const data = leesCode(text);
  schrijf(BACKUP_KEY, JSON.stringify({ slot: actiefBestand(), tijd: Date.now(), save: serialize() }));
  applyData(data);
  save();
  return true;
}

function leesBackup() {
  try {
    const backup = JSON.parse(lees(BACKUP_KEY) || "null");
    return isObject(backup) && backup.slot === actiefBestand() && isObject(backup.save) ? backup : null;
  } catch {
    return null;
  }
}

export function backupInfo() {
  const backup = leesBackup();
  return backup ? { tijd: Number(backup.tijd) || 0 } : null;
}

export function herstelBackup() {
  const backup = leesBackup();
  if (!backup) return false;
  applyData(backup.save);
  save();
  wis(BACKUP_KEY);
  return true;
}

// Offline opbrengst. Wordt door main.js aangeroepen vlak na het laden.
export function offlineYield(seconds) {
  const capped = Math.min(seconds, D.offlineCap);
  if (capped < 60 || D.pps <= 0) return { seconds: 0, amount: 0 };
  return { seconds: capped, amount: D.pps * capped * D.offlineRate };
}
