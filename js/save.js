// Opslaan, laden, migreren en uitwisselen.
//
// De save bevat alleen ruwe feiten: bezit, gekochte id's, statistieken.
// Alles wat daaruit volgt wordt bij het laden opnieuw berekend, zodat een
// balanswijziging nooit een oude save kapotmaakt.

import { G, D, freshState, recompute, refreshSeen, fixUiterlijk } from "./state.js";
import { setNotation } from "./format.js";

export const SAVE_KEY = "sergeClicker";
export const LEGACY_KEY = "sergeClickerSave";
export const SAVE_VERSION = 2;

export function currentSlot() {
  const slot = localStorage.getItem(`${SAVE_KEY}:slot`);
  return slot === "2" || slot === "3" ? slot : "1";
}

export function setSlot(slot) {
  localStorage.setItem(`${SAVE_KEY}:slot`, String(slot));
}

function keyFor(slot = currentSlot()) {
  return slot === "1" ? SAVE_KEY : `${SAVE_KEY}:${slot}`;
}

function serialize() {
  G.lastSeen = Date.now();
  return {
    version: SAVE_VERSION,
    packets: G.packets,
    buildings: G.buildings,
    upgrades: Object.keys(G.upgrades).filter((k) => G.upgrades[k]),
    achievements: Object.keys(G.achievements).filter((k) => G.achievements[k]),
    nodes: Object.keys(G.nodes).filter((k) => G.nodes[k]),
    eggs: Object.keys(G.eggs).filter((k) => G.eggs[k]),
    skins: Object.keys(G.skins).filter((k) => G.skins[k]),
    uiterlijk: G.uiterlijk,
    seen: Object.keys(G.seen).filter((k) => G.seen[k]),
    prestige: G.prestige,
    ects: G.ects,
    stats: G.stats,
    options: G.options,
    minigames: G.minigames,
    buffs: G.buffs.filter((b) => b.until).map((b) => ({ id: b.id, until: b.until, building: b.building })),
    lastSeen: G.lastSeen,
    cheated: G.cheated,
  };
}

function listToMap(list) {
  const out = {};
  if (Array.isArray(list)) for (const id of list) out[id] = true;
  else if (list && typeof list === "object") for (const k in list) if (list[k]) out[k] = true;
  return out;
}

// Een save uit de vorige versie van het spel. We redden wat we kunnen:
// voortgang wordt omgerekend naar een startbedrag plus de prestaties.
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

function migrateLegacy(data) {
  const state = freshState();
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
  state.migratedFrom = 1;
  return state;
}

function applyData(data) {
  const fresh = freshState();
  const state = {
    ...fresh,
    ...data,
    upgrades: listToMap(data.upgrades),
    achievements: listToMap(data.achievements),
    nodes: listToMap(data.nodes),
    eggs: listToMap(data.eggs),
    skins: { ...fresh.skins, ...listToMap(data.skins) },
    uiterlijk: { ...fresh.uiterlijk, ...(data.uiterlijk || {}) },
    seen: listToMap(data.seen),
    buildings: data.buildings && typeof data.buildings === "object" ? data.buildings : {},
    stats: { ...fresh.stats, ...(data.stats || {}) },
    options: { ...fresh.options, ...(data.options || {}) },
    minigames: {
      quiz: { ...fresh.minigames.quiz, ...(data.minigames?.quiz || {}) },
      cli: { ...fresh.minigames.cli, ...(data.minigames?.cli || {}) },
      market: { ...fresh.minigames.market, ...(data.minigames?.market || {}) },
      patch: { ...fresh.minigames.patch, ...(data.minigames?.patch || {}) },
      cursus: { ...fresh.minigames.cursus, ...(data.minigames?.cursus || {}) },
      laatste: data.minigames?.laatste,
    },
    buffs: Array.isArray(data.buffs) ? data.buffs.filter((b) => b && b.until > Date.now()) : [],
    incident: null,
  };
  if (data.options?.portret === "evolved") {
    state.skins["portret:evolved"] = true;
    state.uiterlijk.portret = "evolved";
  }
  // Oude namen uit de eerste opzet van het uiterlijk-systeem.
  if (state.skins["portret:standaard"]) state.skins["portret:serge"] = true;
  if (state.skins["portret:topologie"]) state.skins["portret:blauwdruk"] = true;
  if (state.skins["portret:goud"]) state.skins["ring:goud"] = true;
  if (state.skins["portret:regenboog"]) state.skins["ring:regenboog"] = true;
  state.stats.achievements = Object.keys(state.achievements).length;
  state.stats.upgrades = Object.keys(state.upgrades).length;
  state.stats.eggs = Object.keys(state.eggs).length;
  Object.assign(G, state);
  setNotation(G.options.notation);
  recompute();
  fixUiterlijk();
  refreshSeen();
}

export function save(slot = currentSlot()) {
  try {
    localStorage.setItem(keyFor(slot), JSON.stringify(serialize()));
    return true;
  } catch (err) {
    console.warn("Opslaan mislukt", err);
    return false;
  }
}

export function load(slot = currentSlot()) {
  let raw = localStorage.getItem(keyFor(slot));
  let legacy = false;
  if (!raw && slot === "1") {
    raw = localStorage.getItem(LEGACY_KEY);
    legacy = !!raw;
  }
  if (!raw) {
    applyData(freshState());
    return { loaded: false };
  }
  try {
    const data = JSON.parse(raw);
    if (legacy || !data.version || data.version < 2) {
      applyData(migrateLegacy(data));
      return { loaded: true, migrated: true };
    }
    applyData(data);
    return { loaded: true, away: Math.max(0, (Date.now() - (data.lastSeen || Date.now())) / 1000) };
  } catch (err) {
    console.warn("Save onleesbaar", err);
    applyData(freshState());
    return { loaded: false, corrupt: true };
  }
}

export function wipe(slot = currentSlot()) {
  localStorage.removeItem(keyFor(slot));
  if (slot === "1") localStorage.removeItem(LEGACY_KEY);
  applyData(freshState());
}

export function slotSummary(slot) {
  const raw = localStorage.getItem(keyFor(slot)) || (slot === "1" ? localStorage.getItem(LEGACY_KEY) : null);
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

export function exportSave() {
  const json = JSON.stringify(serialize());
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return HEADER + btoa(binary);
}

export function importSave(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed.startsWith(HEADER)) throw new Error("Dit is geen Serge Clicker-code.");
  const binary = atob(trimmed.slice(HEADER.length));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const data = JSON.parse(new TextDecoder().decode(bytes));
  if (!data || typeof data !== "object") throw new Error("De code is beschadigd.");
  applyData(data.version >= 2 ? data : migrateLegacy(data));
  save();
  return true;
}

// Offline opbrengst. Wordt door main.js aangeroepen vlak na het laden.
export function offlineYield(seconds) {
  const capped = Math.min(seconds, D.offlineCap);
  if (capped < 60 || D.pps <= 0) return { seconds: 0, amount: 0 };
  return { seconds: capped, amount: D.pps * capped * D.offlineRate };
}
