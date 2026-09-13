// De motor: tijd, productie, buffs, gouden packets en incidenten.
// Alles wat vanzelf gebeurt, gebeurt hier.

import { G, D, recompute, earn, checkAchievements, checkSkins, refreshSeen, unlock, touch } from "./state.js";
import { BUFFS, BUFF_BY_ID, HAZARDS, INCIDENTS } from "./data/buffs.js";
import { GENERIC, SERGE, CONTEXTUAL, MILESTONE, KLASSIEK, TRANSCENDENT } from "./data/news.js";
import { BUILDINGS } from "./data/buildings.js";
import { emit } from "./bus.js";
import { save } from "./save.js";

let lastTick = performance.now();
let sinceCheck = 0;
let sinceSave = 0;
let sinceNews = 0;
let goldenAt = 0;
let incidentAt = 0;
let lastActivity = Date.now();
let hiddenAt = 0;

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
  const weg = (Date.now() - hiddenAt) / 1000;
  hiddenAt = 0;
  lastTick = performance.now();
  if (weg > 3 && D.pps > 0) {
    const ingehaald = D.pps * Math.min(weg, 3600);
    earn(ingehaald);
    if (weg > 60) emit("toast", { title: "Bijgewerkt", text: `Je netwerk draaide door terwijl dit tabblad op de achtergrond stond.` });
  }
}

export function start() {
  document.addEventListener("visibilitychange", handleVisibility);
  lastTick = performance.now();
  scheduleGolden();
  scheduleIncident();
  requestAnimationFrame(frame);
  if (D.startBuff && G.stats.runLifetime < 1000) activateBuff(pickBuff());
}

function frame(now) {
  const dt = Math.min(1, Math.max(0, (now - lastTick) / 1000));
  lastTick = now;
  tick(dt);
  requestAnimationFrame(frame);
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
    if (nowMs >= G.incident.until) resolveIncident("timeout");
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

export function click(meta = {}) {
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
  const entry = {
    id: def.id,
    effect: def.effect,
    building: null,
  };
  if (def.effect?.randomBuildingMult) {
    const owned = BUILDINGS.filter((b) => (G.buildings[b.id] || 0) > 0);
    if (!owned.length) return activateBuff(BUFF_BY_ID.burst);
    entry.building = owned[Math.floor(Math.random() * owned.length)].id;
  }
  if (def.charges) {
    entry.charges = def.charges;
  } else {
    entry.until = Date.now() + def.duration * 1000 * D.buffDuration;
  }
  // Dezelfde buff nog eens? Dan verlengen in plaats van stapelen.
  const existing = G.buffs.find((b) => b.id === def.id && !b.charges);
  if (existing && entry.until) {
    existing.until = Math.max(existing.until, entry.until);
  } else {
    G.buffs.push(entry);
  }
  recompute();
  emit("buff:start", { def, entry });
  emit("buffs:changed");
  return entry;
}

export function activateHazard(def) {
  if (def.instant) {
    const factor = def.loss * (1 - D.ddosResist);
    const lost = G.packets * factor;
    G.packets -= lost;
    emit("hazard:instant", { def, lost });
    return;
  }
  const strength = 1 - (1 - (def.effect.ppsMult ?? def.effect.clickMult ?? 1)) * (1 - D.ddosResist);
  const entry = {
    id: def.id,
    hazard: true,
    effect: def.effect.ppsMult ? { ppsMult: strength } : { clickMult: strength },
    until: Date.now() + def.duration * 1000,
  };
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

export function buffLabel(entry) {
  const def = BUFF_BY_ID[entry.id] || HAZARDS.find((h) => h.id === entry.id);
  return def || { name: entry.id, icon: "❔" };
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
    if (G.stats.ddosIgnored === 1) unlock("goud-ddos");
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

function applyIncidentPenalty(id) {
  const def = INCIDENTS.find((i) => i.id === id);
  if (!def) return;
  G.buffs.push({
    id: `incident-${def.id}`,
    hazard: true,
    effect: { ppsMult: def.penalty.ppsMult },
    until: Date.now() + def.penalty.duration * 1000,
  });
  recompute();
  emit("buffs:changed");
}

function resolveIncident(how) {
  if (!G.incident) return;
  const id = G.incident.id;
  G.incident = null;
  if (how === "ignored" || how === "timeout") applyIncidentPenalty(id);
  scheduleIncident();
  touch();
  emit("incident:end", { how });
}

// --- Logbalk ---

let lastNews = "";

export function nextNews() {
  const pool = [];
  const tier = Math.min(MILESTONE.length - 1, Math.floor(Math.log10(Math.max(1, G.stats.lifetime)) / 3));
  pool.push(...KLASSIEK);
  pool.push(...GENERIC);
  pool.push(...SERGE);
  pool.push(MILESTONE[tier]);
  // De regels van voorbij het miljard komen er pas bij als je zover bent.
  if (G.prestige >= 1 || G.stats.lifetime >= 1e9) pool.push(...TRANSCENDENT);
  const owned = BUILDINGS.filter((b) => (G.buildings[b.id] || 0) >= 10);
  if (owned.length) {
    const b = owned[Math.floor(Math.random() * owned.length)];
    const template = CONTEXTUAL[Math.floor(Math.random() * CONTEXTUAL.length)];
    pool.push(template.replace("{n}", G.buildings[b.id]).replace("{b}", b.name.toLowerCase()));
  }
  let pick = pool[Math.floor(Math.random() * pool.length)];
  let guard = 0;
  while (pick === lastNews && guard++ < 4) pick = pool[Math.floor(Math.random() * pool.length)];
  lastNews = pick;
  return pick;
}

export function forceGolden() {
  goldenAt = Date.now();
}
