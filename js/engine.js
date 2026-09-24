// De motor: tijd, productie, buffs, gouden packets en incidenten.
// Alles wat vanzelf gebeurt, gebeurt hier.

import { G, D, recompute, earn, checkAchievements, checkSkins, refreshSeen, unlock, touch } from "./state.js";
import { BUFFS, BUFF_BY_ID, HAZARDS, INCIDENTS, INCIDENT_BY_ID, strafId } from "./data/buffs.js";
import { GENERIC, SERGE, CONTEXTUAL, MILESTONE, KLASSIEK, TRANSCENDENT } from "./data/news.js";
import { BUILDINGS } from "./data/buildings.js";
import { emit } from "./bus.js";
import { save } from "./save.js";

// Hoe lang een achtergrondtab maximaal meetelt, en hoe vaak je mag klikken.
const INHAAL_MAX = 3600;
const KLIKKEN_PER_SECONDE = 20;

let lastTick = performance.now();
let sinceCheck = 0;
let sinceSave = 0;
let sinceNews = 0;
let goldenAt = 0;
let incidentAt = 0;
let lastActivity = Date.now();
let hiddenAt = 0;
let laatsteFout = 0;

export function markActivity() {
  lastActivity = Date.now();
}

export function idleSeconds() {
  return (Date.now() - lastActivity) / 1000;
}

// Een achtergrondtab krijgt geen animatieframes meer. Bij terugkomst rekenen
// we de gemiste tijd alsnog af, anders straft het spel je voor tabben.
function handleVisibility() {
  if (document.visibilityState === "hidden") {
    hiddenAt = Date.now();
    return;
  }
  if (!hiddenAt) return;
  const nu = Date.now();
  const weg = (nu - hiddenAt) / 1000;
  const van = hiddenAt;
  hiddenAt = 0;
  lastTick = performance.now();
  if (weg > 1) {
    haalIn(van, nu);
    if (weg > 60) emit("toast", { title: "Bijgewerkt", text: "Je netwerk draaide door terwijl dit tabblad op de achtergrond stond." });
  }
}

// Rekent de tijd tussen `van` en `tot` af, in stukken: telkens tot de
// eerstvolgende buff of straf afloopt (of een storing uit de hand loopt), met
// de productie van dat moment. Een buff telt zo alleen zolang hij duurde.
export function haalIn(van, tot) {
  const eind = Math.min(tot, van + INHAAL_MAX * 1000);
  let t = van;
  const verloopt = (b) => (b.charges ? false : b.until <= t);
  if (G.buffs.some(verloopt)) {
    G.buffs = G.buffs.filter((b) => !verloopt(b));
    recompute();
  }
  let veranderd = false;
  while (t < eind) {
    const grenzen = G.buffs.filter((b) => !b.charges && b.until > t).map((b) => b.until);
    if (G.incident && G.incident.until > t) grenzen.push(G.incident.until);
    const volgende = Math.min(eind, ...grenzen);
    if (D.pps > 0) earn((D.pps * (volgende - t)) / 1000);
    t = volgende;
    if (G.incident && G.incident.until <= t) resolveIncident("timeout", G.incident.until, t);
    const voor = G.buffs.length;
    G.buffs = G.buffs.filter((b) => !verloopt(b));
    if (G.buffs.length !== voor) {
      recompute();
      veranderd = true;
    }
  }
  if (veranderd) emit("buffs:changed");
  return G.packets;
}

export function start() {
  document.addEventListener("visibilitychange", handleVisibility);
  lastTick = performance.now();
  scheduleGolden();
  scheduleIncident();
  requestAnimationFrame(frame);
}

// Het volgende frame wordt eerst ingepland. Een fout in één tick mag de
// productie nooit voorgoed stilleggen.
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(1, Math.max(0, (now - lastTick) / 1000));
  lastTick = now;
  try {
    tick(dt);
  } catch (err) {
    if (Date.now() - laatsteFout > 5000) {
      laatsteFout = Date.now();
      console.error("Fout in de spelklok", err);
    }
  }
}

function tick(dt) {
  if (D.pps > 0) earn(D.pps * dt);
  G.stats.playTime += dt;
  G.stats.runPlayTime = (G.stats.runPlayTime || 0) + dt;

  expireBuffs();

  const nowMs = Date.now();
  if (goldenAt && nowMs >= goldenAt) {
    goldenAt = 0;
    emit("golden:spawn", rollGolden());
  }
  if (incidentAt && nowMs >= incidentAt && !G.incident) {
    incidentAt = 0;
    startIncident();
  }
  if (G.incident) {
    if (nowMs >= G.incident.until) resolveIncident("timeout", G.incident.until);
    else if (D.autoIncident && nowMs - G.incident.startedAt >= 30000) resolveIncident("auto");
  }

  sinceCheck += dt;
  if (sinceCheck >= 0.5) {
    sinceCheck = 0;
    checkAchievements();
    checkSkins();
    refreshSeen();
    if (idleSeconds() >= 600) emit("idle:long");
  }

  sinceNews += dt;
  if (sinceNews >= 12) {
    sinceNews = 0;
    emit("news", nextNews());
  }

  sinceSave += dt;
  if (sinceSave >= 20) {
    sinceSave = 0;
    save();
  }

  emit("tick", dt);
}

// --- Klikken ---
// Meer dan twintig kliks per seconde haalt geen mens; wat erboven zit is een
// ingedrukte toets of een autoclicker, en telt niet mee.

const klikTijden = [];

export function click(meta = {}) {
  const nu = performance.now();
  while (klikTijden.length && nu - klikTijden[0] >= 1000) klikTijden.shift();
  if (klikTijden.length >= KLIKKEN_PER_SECONDE) return 0;
  klikTijden.push(nu);

  markActivity();
  const value = D.clickValue;
  earn(value, { handmade: true });
  G.stats.clicks++;
  if (value > G.stats.clickCap) G.stats.clickCap = value;
  consumeCharge();
  emit("click", { value, ...meta });
  return value;
}

function consumeCharge() {
  const charged = G.buffs.find((b) => b.charges > 0);
  if (!charged) return;
  charged.charges--;
  if (charged.charges <= 0) {
    G.buffs = G.buffs.filter((b) => b !== charged);
    recompute();
    emit("buffs:changed");
  }
}

// --- Buffs ---

function pickBuff() {
  const total = BUFFS.reduce((sum, b) => sum + b.weight, 0);
  let roll = Math.random() * total;
  for (const b of BUFFS) {
    roll -= b.weight;
    if (roll <= 0) return b;
  }
  return BUFFS[0];
}

export function activateBuff(def) {
  if (!def) return null;
  if (def.instant) {
    const amount = Math.max(13, Math.min(D.pps * 900, G.packets * 0.15 + 13)) * D.goldenPower;
    earn(amount);
    emit("buff:instant", { def, amount });
    return { def, amount };
  }
  const entry = { id: def.id };
  if (def.effect?.randomBuildingMult) {
    const kandidaten = teOverklokken();
    if (!kandidaten.length) return activateBuff(BUFF_BY_ID.burst);
    entry.building = kandidaten[Math.floor(Math.random() * kandidaten.length)].id;
  }
  if (def.charges) {
    entry.charges = def.charges;
  } else {
    entry.until = Date.now() + def.duration * 1000 * D.buffDuration;
  }
  // Dezelfde buff nog eens? Dan verlengen of ladingen erbij, niet stapelen.
  const existing = G.buffs.find((b) => b.id === def.id);
  if (existing && entry.charges && existing.charges) {
    existing.charges += entry.charges;
  } else if (existing && entry.until && existing.until && existing.building === entry.building) {
    existing.until = Math.max(existing.until, entry.until);
  } else {
    G.buffs.push(entry);
  }
  recompute();
  emit("buff:start", { def, entry });
  emit("buffs:changed");
  return entry;
}

// Overklok kiest uit de apparaten die minstens 5% van je productie leveren.
// Anders valt hij laat in het spel bijna altijd op een patchkabel die niets
// meer toevoegt.
function teOverklokken() {
  const bezit = BUILDINGS.filter((b) => (G.buildings[b.id] || 0) > 0);
  if (!(D.pps > 0)) return bezit;
  const tellen = bezit.filter((b) => ((D.perBuilding[b.id] || 0) * G.buildings[b.id]) / D.pps >= 0.05);
  return tellen.length ? tellen : bezit;
}

// Elke nieuwe run na het afstuderen krijgt één gratis buff, als je
// "Gouden regen" in de studieboom hebt.
export function nieuweRun() {
  if (D.startBuff) activateBuff(pickBuff());
}

// Het effect van een straf wordt in recompute() afgeleid, inclusief je
// DDoS-bescherming. Hier staat alleen wat en tot wanneer.
export function activateHazard(def) {
  if (def.instant) {
    const factor = def.loss * (1 - D.ddosResist);
    const lost = G.packets * factor;
    G.packets -= lost;
    emit("hazard:instant", { def, lost });
    return;
  }
  const entry = { id: def.id, until: Date.now() + def.duration * 1000 };
  G.buffs.push(entry);
  recompute();
  emit("buff:start", { def, entry });
  emit("buffs:changed");
}

function expireBuffs() {
  if (!G.buffs.length) return;
  const now = Date.now();
  const before = G.buffs.length;
  G.buffs = G.buffs.filter((b) => (b.charges ? b.charges > 0 : b.until > now));
  if (G.buffs.length !== before) {
    recompute();
    emit("buffs:changed");
  }
}

// --- Gouden packets ---

function scheduleGolden() {
  const base = 95 + Math.random() * 130;
  goldenAt = Date.now() + (base / Math.max(0.2, D.goldenFreq)) * 1000;
}

function rollGolden() {
  const hazardReady = G.prestige >= 1 || G.stats.lifetime > 1e9;
  const hazard = hazardReady && Math.random() < 0.22;
  const lifetimeMs = (hazard ? 9 : 11) * 1000 * D.goldenDuration;
  return { hazard, lifetimeMs, spawnedAt: Date.now() };
}

export function goldenClicked(info) {
  markActivity();
  if (info.hazard) {
    G.stats.ddosSeen++;
    if (D.ddosReward) {
      const def = pickBuff();
      activateBuff(def);
      emit("toast", { title: "Naar null0 gestuurd", text: "De aanval wordt weggegooid, de bandbreedte houd je." });
    } else {
      const def = HAZARDS[Math.floor(Math.random() * HAZARDS.length)];
      activateHazard(def);
      emit("toast", { title: def.name, text: def.desc, tone: "slecht" });
    }
    scheduleGolden();
    return;
  }
  const before = G.packets;
  const first = pickBuff();
  activateBuff(first);
  if (Math.random() < D.goldenDouble) {
    let second = pickBuff();
    let guard = 0;
    while (second.id === first.id && guard++ < 5) second = pickBuff();
    activateBuff(second);
  }
  G.stats.goldenClicks++;
  G.stats.goldenValue += Math.max(0, G.packets - before);
  if (Date.now() - info.spawnedAt < 1000) unlock("goud-snel");
  scheduleGolden();
}

export function goldenExpired(info) {
  if (info.hazard) {
    G.stats.ddosSeen++;
    G.stats.ddosIgnored++;
    unlock("goud-ddos");
  }
  scheduleGolden();
}

// --- Incidenten ---

function scheduleIncident() {
  incidentAt = Date.now() + (240 + Math.random() * 360) * 1000;
}

function startIncident() {
  if (D.pps <= 0 || G.stats.lifetime < 1e5) {
    scheduleIncident();
    return;
  }
  const def = INCIDENTS[Math.floor(Math.random() * INCIDENTS.length)];
  G.incident = {
    id: def.id,
    startedAt: Date.now(),
    until: Date.now() + 45000,
    cost: Math.ceil(D.pps * def.costPps),
  };
  touch();
  emit("incident:start", { def, incident: G.incident });
}

export function fixIncident() {
  if (!G.incident) return false;
  if (G.packets < G.incident.cost) return false;
  G.packets -= G.incident.cost;
  unlock("incident-fix");
  resolveIncident("fixed");
  return true;
}

export function ignoreIncident() {
  resolveIncident("ignored");
}

// De straf loopt vanaf het moment dat de storing uit de hand liep. Was dat
// terwijl je weg was, dan kan hij alweer (deels) voorbij zijn. `nu` is de tijd
// waarop gerekend wordt; bij het inhalen ligt die in het verleden.
function applyIncidentPenalty(id, vanaf, nu) {
  const def = INCIDENT_BY_ID[id];
  if (!def) return;
  const until = vanaf + def.penalty.duration * 1000;
  if (until <= nu) return;
  G.buffs.push({ id: strafId(def.id), until });
  recompute();
  emit("buffs:changed");
}

function resolveIncident(how, tijdstip = Date.now(), nu = Date.now()) {
  if (!G.incident) return;
  const id = G.incident.id;
  G.incident = null;
  if (how === "ignored" || how === "timeout") applyIncidentPenalty(id, tijdstip, nu);
  scheduleIncident();
  touch();
  emit("incident:end", { how });
}

// --- Logbalk ---
// Regels over je eigen spel (je mijlpaal, je apparaten) komen ongeveer één
// op de drie keer voorbij; de rest komt uit de vaste lijsten.

const EIGEN_KANS = 0.35;
let lastNews = "";

export function nextNews() {
  const vast = [...KLASSIEK, ...GENERIC, ...SERGE];
  // De regels van voorbij het miljard komen er pas bij als je zover bent.
  if (G.prestige >= 1 || G.stats.lifetime >= 1e9) vast.push(...TRANSCENDENT);

  const tier = Math.min(MILESTONE.length - 1, Math.floor(Math.log10(Math.max(1, G.stats.lifetime)) / 3));
  const eigen = [MILESTONE[tier]];
  const owned = BUILDINGS.filter((b) => (G.buildings[b.id] || 0) >= 10);
  if (owned.length) {
    const b = owned[Math.floor(Math.random() * owned.length)];
    const template = CONTEXTUAL[Math.floor(Math.random() * CONTEXTUAL.length)];
    eigen.push(template.replaceAll("{n}", G.buildings[b.id]).replaceAll("{b}", b.name.toLowerCase()));
  }

  const kies = () => {
    const pool = Math.random() < EIGEN_KANS ? eigen : vast;
    return pool[Math.floor(Math.random() * pool.length)];
  };
  let pick = kies();
  let guard = 0;
  while (pick === lastNews && guard++ < 4) pick = kies();
  lastNews = pick;
  return pick;
}

export function forceGolden() {
  goldenAt = Date.now();
}
