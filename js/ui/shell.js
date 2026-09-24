// De schil: teller, Serge, buffs, logbalk, rack, tabbladen en gouden packets.

import { G, D, BUILDINGS, VAKKEN, nextCost, availableUpgrades, onAchievement, onSkin, touch, rev } from "../state.js";
import { buffUiterlijk, effectVan, INCIDENT_BY_ID } from "../data/buffs.js";
import { fotoVoor } from "../data/uiterlijk.js";
import { STUDIE_OPEN } from "../data/skilltree.js";
import { fmt, fmtLong, fmtTime, setNotation } from "../format.js";
import { click, goldenClicked, goldenExpired, fixIncident, ignoreIncident } from "../engine.js";
import { on, emit } from "../bus.js";
import { toast, floatText, sparks, blip, chord, dialog, attachTooltip, hoverCapable, kondigAan } from "./fx.js";
import { renderAll, syncFast, renderStudie, syncStudie, renderMeer, renderAchievements, resetPanels } from "./panels.js";
import { save, wipe, exportSave, importSave, wisselSlot, actiefBestand, slotSummary, backupInfo, herstelBackup } from "../save.js";
import { meet, tekenGrafiek } from "./grafiek.js";
import { esc } from "../html.js";
import { stelRegenIn } from "./regen.js";

const el = (id) => document.getElementById(id);
const scoreEl = el("score");
const ppsEl = el("pps");
const noteEl = el("counter-note");
const sergeBtn = el("serge");
const sergeImg = el("serge-img");
const hintEl = el("clicker-hint");
const buffbar = el("buffbar");
const newsEl = el("news");
const incidentEl = el("incident");

const vensterOpen = () => !!document.querySelector("dialog[open]");

// ------------------------------------------------------------- Tabbladen
// Het ARIA-patroon voor tabbladen: alleen de actieve tab zit in de
// tabvolgorde, pijltjes, Home en End wandelen erdoorheen.

const tabs = [...document.querySelectorAll("#tabs [role=tab]")];
const panels = new Map(tabs.map((t) => [t.dataset.tab, el(t.getAttribute("aria-controls"))]));
let activeTab = "winkel";

export function actiefTabblad() {
  return activeTab;
}

export function showTab(name) {
  if (!panels.has(name)) return;
  activeTab = name;
  for (const tab of tabs) {
    const aan = tab.dataset.tab === name;
    tab.setAttribute("aria-selected", String(aan));
    tab.tabIndex = aan ? 0 : -1;
    panels.get(tab.dataset.tab).hidden = !aan;
  }
  if (name === "studie") renderStudie();
  if (name === "prestaties") renderAchievements();
  // Elk tabblad begint bovenaan; anders erf je de scrollpositie van het vorige.
  el("tabpanels").scrollTop = 0;
  emit("tab", name);
}

for (const tab of tabs) {
  tab.addEventListener("click", () => {
    if (tab.classList.contains("op-slot")) {
      toonSlot(tab.dataset.tab);
      return;
    }
    showTab(tab.dataset.tab);
  });
  tab.addEventListener("keydown", (e) => {
    const pos = tabs.indexOf(tab);
    const doel = {
      ArrowRight: tabs[(pos + 1) % tabs.length],
      ArrowLeft: tabs[(pos + tabs.length - 1) % tabs.length],
      Home: tabs[0],
      End: tabs[tabs.length - 1],
    }[e.key];
    if (!doel) return;
    e.preventDefault();
    doel.focus();
    if (!doel.classList.contains("op-slot")) showTab(doel.dataset.tab);
  });
}

const SLOTEN = {
  labo: {
    open: () => G.stats.lifetime >= 5e3 || G.stats.prestiges > 0,
    naam: "Het labo",
    eis: "Verdien in totaal 5.000 packets.",
    tekst: "Vijf onderdelen: de cursus, een overhoring van Serge, een terminal, de bandbreedtemarkt en een patchkast.",
    icoon: "🧪",
  },
  studie: {
    open: () => G.prestige > 0 || G.stats.lifetime >= STUDIE_OPEN,
    naam: "Studie",
    eis: `Verdien in totaal ${fmtLong(STUDIE_OPEN, 0)} packets.`,
    tekst: "Dan zie je hoe ver je van je eerste diploma bent: opnieuw beginnen met studiepunten voor een boom vol blijvende bonussen.",
    icoon: "🎓",
  },
};

function syncTabVisibility() {
  for (const [naam, slot] of Object.entries(SLOTEN)) {
    const tab = tabs.find((t) => t.dataset.tab === naam);
    const open = slot.open();
    if (!open === tab.classList.contains("op-slot")) continue;
    tab.classList.toggle("op-slot", !open);
    if (open && !slot.gemeld) {
      slot.gemeld = true;
      toast({ title: `${slot.naam} is open`, text: slot.tekst, icon: slot.icoon, tone: "goed" });
    }
  }
}

function toonSlot(naam) {
  const slot = SLOTEN[naam];
  dialog({
    title: `${slot.icoon} ${slot.naam} zit nog op slot`,
    body: `<p>${slot.tekst}</p><p><strong>${slot.eis}</strong></p>`,
    actions: [{ label: "Duidelijk", style: "ghost" }],
  });
}

// ------------------------------------------------------------ Klikken

function clickSerge(event) {
  const value = click();
  if (!value) return;
  const rect = sergeBtn.getBoundingClientRect();
  const x = event?.clientX || rect.left + rect.width / 2;
  const y = event?.clientY || rect.top + rect.height / 2;
  floatText(x, y - 10, `+${fmt(value)}`);
  sparks(x, y, G.options.motion ? 8 : 0);
  if (G.options.motion) {
    sergeBtn.classList.remove("hit");
    void sergeBtn.offsetWidth;
    sergeBtn.classList.add("hit");
  }
  blip(560 + Math.random() * 90, 0.04, 0.035);
  if (G.options.motion) {
    scoreEl.classList.remove("pop");
    void scoreEl.offsetWidth;
    scoreEl.classList.add("pop");
  }
}

sergeBtn.addEventListener("click", clickSerge);
sergeBtn.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  emit("egg:rechtsklik");
});
// Een ingedrukte Enter of spatie herhaalt zichzelf; dat is geen klikken.
sergeBtn.addEventListener("keydown", (e) => {
  if (e.repeat && (e.key === "Enter" || e.key === " ")) e.preventDefault();
});

// Spatie klikt Serge, tenzij de focus op iets staat dat zelf op spatie
// reageert. 1 tot 4 zetten het aantal per aankoop, G pakt een gouden packet.
const REAGEERT_OP_SPATIE = "button, a[href], summary, [role=button], [role=tab], [role=switch]";

document.addEventListener("keydown", (e) => {
  if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || vensterOpen()) return;
  const doel = e.target instanceof Element ? e.target : null;
  if (doel?.closest("input, textarea, select, [contenteditable]")) return;
  if (e.code === "Space") {
    if (doel?.closest(REAGEERT_OP_SPATIE)) return;
    e.preventDefault();
    if (!e.repeat) clickSerge();
    return;
  }
  if (e.repeat) return;
  if (activeTab === "winkel" && ["1", "2", "3", "4"].includes(e.key)) {
    setBuyAmount({ 1: 1, 2: 10, 3: 100, 4: "max" }[e.key]);
  }
  if (e.key === "g" || e.key === "G") pakPacket();
});

// ------------------------------------------------------------ Winkelbalk

const AANTALLEN = [1, 10, 100, "max"];
const aantalKnoppen = [...document.querySelectorAll(".shopbar .segmented button")];

function setBuyAmount(amount) {
  const geldig = AANTALLEN.includes(amount) ? amount : 1;
  G.options.buyAmount = geldig;
  for (const btn of aantalKnoppen) {
    const aan = btn.dataset.amount === String(geldig);
    btn.classList.toggle("on", aan);
    btn.setAttribute("aria-pressed", String(aan));
  }
  touch();
  renderAll();
}

for (const btn of aantalKnoppen) {
  btn.addEventListener("click", () => setBuyAmount(btn.dataset.amount === "max" ? "max" : Number(btn.dataset.amount)));
}

const sellToggle = el("sell-toggle");
sellToggle.addEventListener("click", () => {
  G.options.sellMode = !G.options.sellMode;
  sellToggle.setAttribute("aria-pressed", String(G.options.sellMode));
  sellToggle.textContent = G.options.sellMode ? "Verkopen aan" : "Verkopen";
  renderAll();
});

// --------------------------------------------------------------- Teller

let lastScoreText = "";
export function syncCounter() {
  const score = Math.floor(G.packets);
  const text = fmt(score);
  if (text !== lastScoreText) {
    lastScoreText = text;
    scoreEl.textContent = text;
    document.title = `${text} packets — Serge Clicker`;
  }
  ppsEl.textContent = fmt(D.pps);
  const perClick = D.clickValue;
  noteEl.textContent = perClick > 1 ? `${fmt(perClick)} per klik` : "";
}

// ---------------------------------------------------------------- Buffs

// De tegels worden één keer gebouwd; daarna telt alleen het getal af.
// Zou de resterende tijd in de sleutel zitten, dan bouwde de balk zichzelf
// elke seconde opnieuw op en knipperde alles mee.
let buffSleutel = "";
const buffTijden = new Map();

// Wat een buff precies doet, in losse regels. Zowel de tooltip op desktop
// als het venstertje op een telefoon tekenen dit.
function buffInfo(entry) {
  const e = effectVan(entry, { kracht: D.goldenPower, weerstand: D.ddosResist }) || {};
  const regels = [];
  if (e.ppsMult) regels.push(["Productie", `x${fmt(e.ppsMult, { decimals: 2 })}`]);
  if (e.clickMult) regels.push(["Per klik", `x${fmt(e.clickMult, { decimals: 2 })}`]);
  if (e.randomBuildingMult && entry.building) {
    const b = BUILDINGS.find((x) => x.id === entry.building);
    regels.push([b ? b.name : "Eén apparaat", `x${fmt(e.randomBuildingMult)}`]);
  }
  const rest = entry.charges
    ? `Nog ${entry.charges} ${entry.charges === 1 ? "klik" : "kliks"}`
    : `Nog ${fmtTime(Math.max(0, (entry.until - Date.now()) / 1000))}`;
  return { regels, rest };
}

export function syncBuffs() {
  const sleutel = G.buffs.map((b) => b.id).join("|");
  if (sleutel !== buffSleutel) {
    buffSleutel = sleutel;
    buffbar.innerHTML = "";
    buffTijden.clear();
    for (const entry of G.buffs) {
      const def = buffUiterlijk(entry);
      const pil = document.createElement("span");
      pil.className = `buff${def.slecht ? " slecht" : ""}`;
      pil.innerHTML = `<span aria-hidden="true">${def.icon}</span> ${esc(def.name)} <time></time>`;
      attachTooltip(pil, () => {
        const { regels, rest } = buffInfo(entry);
        return `<h4>${def.icon} ${esc(def.name)}</h4>
          ${regels.map(([l, w]) => `<div class="regel"><span>${esc(l)}</span><span>${w}</span></div>`).join("")}
          <p class="cursief">${esc(def.desc)}</p>
          <div class="regel prijsregel">${rest}</div>`;
      });
      // Zonder muis is er geen tooltip; daar opent een tik hetzelfde verhaal.
      if (!hoverCapable) {
        pil.setAttribute("role", "button");
        pil.setAttribute("tabindex", "0");
        const toon = () => {
          const { regels, rest } = buffInfo(entry);
          dialog({
            title: `${def.icon} ${def.name}`,
            body: `<p>${esc(def.desc)}</p>
              <div class="statlijst" style="margin-top:12px">
                ${regels.map(([l, w]) => `<div><span>${esc(l)}</span><strong>${w}</strong></div>`).join("")}
                <div><span>Nog actief</span><strong>${rest.replace(/^Nog /, "")}</strong></div>
              </div>`,
            actions: [{ label: "Duidelijk", style: "ghost" }],
          });
        };
        pil.addEventListener("click", toon);
        pil.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toon();
          }
        });
      }
      buffbar.append(pil);
      buffTijden.set(entry, pil.querySelector("time"));
    }
  }

  const nu = Date.now();
  for (const [entry, tijdEl] of buffTijden) {
    const rest = entry.charges ? `${entry.charges}x` : fmtTime(Math.max(0, (entry.until - nu) / 1000));
    if (tijdEl.textContent !== rest) tijdEl.textContent = rest;
  }
}

// ------------------------------------------------------- Logbalk en storing

on("news", (text) => {
  newsEl.classList.add("fade");
  setTimeout(() => {
    newsEl.textContent = text;
    newsEl.classList.remove("fade");
  }, 260);
});

const incidentText = el("incident-text");
const incidentFix = el("incident-fix");
const incidentIgnore = el("incident-ignore");
const incidentProgress = el("incident-progress");
let getoondIncident = null;

on("incident:start", () => blip(220, 0.2, 0.06));

on("incident:end", ({ how }) => {
  if (how === "fixed") toast({ title: "Opgelost", text: "Het netwerk draait weer op volle kracht.", icon: "🔧", tone: "goed" });
  else if (how === "auto") toast({ title: "Vanzelf opgelost", text: "Het netwerk herstelde zichzelf. Er ging niets verloren.", icon: "🩹", tone: "goed" });
  else toast({ title: "Storing blijft", text: "Je productie ligt even lager.", icon: "⚠️", tone: "slecht" });
});

incidentFix.addEventListener("click", () => {
  if (!fixIncident()) toast({ title: "Te weinig packets", text: "Je kunt het noodherstel nu niet betalen.", tone: "slecht" });
});
incidentIgnore.addEventListener("click", ignoreIncident);

// De storing volgt G.incident, dus ook een storing die een herlaadbeurt
// overleefde staat meteen weer in beeld.
function syncIncident() {
  const inc = G.incident;
  if (inc !== getoondIncident) {
    getoondIncident = inc;
    incidentEl.hidden = !inc;
    if (inc) {
      const def = INCIDENT_BY_ID[inc.id];
      incidentText.textContent = def.text;
      incidentFix.textContent = `${def.fixLabel} (${fmt(inc.cost)})`;
      incidentIgnore.textContent = def.ignoreLabel;
    }
  }
  if (!inc) return;
  const totaal = inc.until - inc.startedAt;
  const over = Math.max(0, inc.until - Date.now());
  incidentProgress.style.transform = `scaleX(${totaal > 0 ? over / totaal : 0})`;
  incidentFix.disabled = G.packets < inc.cost;
}

// ----------------------------------------------------------- Logboek
// Alles wat er gebeurt komt hier langs, nieuwste bovenaan. Het is
// tegelijk een geheugensteun en een syslog-grapje.

const loglijst = el("loglijst");
const logboekAantal = el("logboek-aantal");
const LOG_MAX = 60;
let logRegels = 0;

function logTijd() {
  return new Date().toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function logboek(tekst, toon = "") {
  const leeg = loglijst.querySelector(".log-leeg");
  if (leeg) leeg.remove();
  const li = document.createElement("li");
  li.innerHTML = `<time>${logTijd()}</time><span class="log-tekst ${toon ? `log-${toon}` : ""}"></span>`;
  li.querySelector(".log-tekst").textContent = tekst;
  loglijst.prepend(li);
  logRegels++;
  while (loglijst.children.length > LOG_MAX) loglijst.lastElementChild.remove();
  logboekAantal.textContent = `${fmt(Math.min(logRegels, LOG_MAX))} regels`;
}

on("bought", ({ id, amount }) => {
  const b = BUILDINGS.find((x) => x.id === id);
  if (!b) return;
  logboek(
    amount > 0
      ? `${b.name}${amount > 1 ? ` x${fmt(amount)}` : ""} gekocht`
      : `${b.name} x${fmt(-amount)} verkocht`,
    amount > 0 ? "goed" : "slecht"
  );
});
on("upgrade", (u) => logboek(`Upgrade: ${u.name}`, "goed"));
on("markt", ({ tekst, toon }) => logboek(tekst, toon));
on("incident:start", ({ def }) => logboek(`Storing: ${def.text}`, "slecht"));
on("graduated", () => logboek("Afgestudeerd. Je netwerk begint opnieuw.", "goud"));

// ------------------------------------------------- Doel en verkeer

const doelEl = el("doel");
const doelTekst = el("doel-tekst");
const doelPct = el("doel-pct");
const doelBar = el("doel-bar");

// Het eerstvolgende dat je nog niet hebt: een apparaat, anders een upgrade.
function volgendDoel() {
  for (const b of BUILDINGS) {
    if ((G.buildings[b.id] || 0) > 0) continue;
    const kost = nextCost(b.id);
    const deel = Math.min(1, G.packets / kost);
    return { tekst: deel >= 1 ? `Klaar om te kopen: ${b.name}` : `Op weg naar je eerste ${b.name}`, deel };
  }
  const u = availableUpgrades().find((x) => x.cost > G.packets);
  if (u) return { tekst: `Op weg naar de upgrade ${u.name}`, deel: Math.min(1, G.packets / u.cost) };
  return null;
}

function syncDoel() {
  const doel = volgendDoel();
  doelEl.hidden = !doel;
  if (!doel) return;
  if (doelTekst.textContent !== doel.tekst) doelTekst.textContent = doel.tekst;
  const pct = `${Math.floor(doel.deel * 100)}%`;
  if (doelPct.textContent !== pct) doelPct.textContent = pct;
  doelBar.style.transform = `scaleX(${doel.deel})`;
}

const verkeerEl = el("verkeer");
const verkeerBalk = el("verkeerbalk");
const verkeerLegenda = el("verkeer-legenda");
const verkeerTotaal = el("verkeer-totaal");
let verkeerSleutel = "";

function syncVerkeer() {
  const perVak = {};
  let som = 0;
  for (const b of BUILDINGS) {
    const n = G.buildings[b.id] || 0;
    if (!n) continue;
    const opbrengst = (D.perBuilding[b.id] || 0) * n;
    perVak[b.vak] = (perVak[b.vak] || 0) + opbrengst;
    som += opbrengst;
  }
  verkeerEl.hidden = som <= 0;
  if (som <= 0) return;

  const delen = Object.entries(perVak)
    .map(([vak, waarde]) => ({ vak, deel: waarde / som }))
    .filter((d) => d.deel > 0.001)
    .sort((a, b) => b.deel - a.deel);
  const sleutel = delen.map((d) => `${d.vak}:${Math.round(d.deel * 100)}`).join("|");
  if (sleutel !== verkeerSleutel) {
    verkeerSleutel = sleutel;
    verkeerBalk.innerHTML = delen
      .map((d) => `<span class="vak-${d.vak}" style="flex:${d.deel.toFixed(4)}"></span>`)
      .join("");
    verkeerLegenda.innerHTML = delen
      .map((d) => `<li class="vak-${d.vak}"><i></i> ${VAKKEN[d.vak].name} <strong>${Math.round(d.deel * 100)}%</strong></li>`)
      .join("");
  }
  const label = `${delen.length} ${delen.length === 1 ? "vak" : "vakken"}`;
  if (verkeerTotaal.textContent !== label) verkeerTotaal.textContent = label;
}

// ------------------------------------------------------ Doorvoergrafiek

const grafiekSvg = el("grafiek");
const grafiekNu = el("grafiek-nu");
const grafiekPiek = el("grafiek-piek");
const grafiekGem = el("grafiek-gem");

export function syncGrafiek() {
  if (meet()) tekenGrafiek(grafiekSvg, grafiekNu, grafiekPiek, grafiekGem);
}

// ----------------------------------------------------------------- Rack

const rackEl = el("rack");
const rackCount = el("rack-count");
let rackSignature = "";

export function syncRack() {
  const signature = BUILDINGS.map((b) => G.buildings[b.id] || 0).join(",");
  if (signature === rackSignature) return;
  const eerst = rackSignature === "";
  rackSignature = signature;

  const owned = BUILDINGS.filter((b) => (G.buildings[b.id] || 0) > 0);
  rackCount.textContent = `${fmt(D.totalBuildings)} ${D.totalBuildings === 1 ? "apparaat" : "apparaten"}`;
  if (!owned.length) {
    rackEl.innerHTML = `<p class="rack-empty">Nog niets in het rack. Koop je eerste patchkabel.</p>`;
    return;
  }

  // Een samenvatting, geen inventaris: de tien apparaten die het meeste
  // opleveren, in de volgorde waarin je ze hebt leren kennen.
  const opOpbrengst = [...owned].sort(
    (a, b) => (D.perBuilding[b.id] || 0) * G.buildings[b.id] - (D.perBuilding[a.id] || 0) * G.buildings[a.id]
  );
  const belangrijk = new Set(opOpbrengst.slice(0, 10).map((b) => b.id));
  const tonen = owned.filter((b) => belangrijk.has(b.id));
  const rest = owned.filter((b) => !belangrijk.has(b.id));

  rackEl.innerHTML = "";
  for (const b of tonen) {
    const n = G.buildings[b.id];
    const zichtbaar = Math.min(n, 16);
    const row = document.createElement("div");
    row.className = `rack-row vak-${b.vak}`;
    const units = Array.from({ length: zichtbaar }, () => `<i class="unit"></i>`).join("");
    row.innerHTML = `<span aria-hidden="true">${b.icon}</span><span class="rack-units">${units}</span><span class="rack-aantal">${fmt(n)}</span>`;
    row.title = `${n}x ${b.name}`;
    rackEl.append(row);
  }
  if (rest.length) {
    const extra = document.createElement("p");
    extra.className = "rack-rest";
    const aantal = rest.reduce((som, b) => som + G.buildings[b.id], 0);
    extra.textContent = `+ ${fmt(aantal)} apparaten in ${rest.length} ${rest.length === 1 ? "andere soort" : "andere soorten"}`;
    rackEl.append(extra);
  }
  if (!eerst && G.options.motion) {
    rackEl.querySelector(".rack-row:last-of-type .unit:last-of-type")?.classList.add("nieuw");
  }
}

// ------------------------------------------------------- Gouden packets
// Een schermlezer hoort dat er een packet verschijnt, en G pakt hem zonder
// muis. Rode packets pak je met G alleen als je er iets aan hebt.

let packetEl = null;
let packetInfo = null;
let packetTimer = null;

on("golden:spawn", (info) => {
  if (packetEl) return;
  const size = 62;
  const marge = 24;
  const x = marge + Math.random() * (window.innerWidth - size - marge * 2);
  const y = marge + 70 + Math.random() * (window.innerHeight - size - marge * 2 - 70);
  packetInfo = info;
  packetEl = document.createElement("button");
  packetEl.type = "button";
  packetEl.className = `packet${info.hazard ? " rood" : ""}`;
  packetEl.style.left = `${x}px`;
  packetEl.style.top = `${y}px`;
  packetEl.textContent = info.hazard ? "🚨" : "📦";
  packetEl.setAttribute("aria-label", info.hazard ? "Verdacht packet, niet aanklikken" : "Gouden packet");
  packetEl.addEventListener("click", () => {
    goldenClicked(info);
    if (!info.hazard) {
      chord([660, 880, 1100]);
      const rect = packetEl.getBoundingClientRect();
      sparks(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);
    }
    removePacket();
  });
  document.body.append(packetEl);
  kondigAan(info.hazard
    ? "Er is een rood packet verschenen. Laat het liever staan."
    : "Er is een gouden packet verschenen. Druk op G om het te pakken.");
  packetTimer = setTimeout(() => {
    goldenExpired(info);
    removePacket();
  }, info.lifetimeMs);
});

function pakPacket() {
  if (!packetEl || (packetInfo?.hazard && !D.ddosReward)) return;
  packetEl.click();
}

function removePacket() {
  clearTimeout(packetTimer);
  packetEl?.remove();
  packetEl = null;
  packetInfo = null;
}

// Wat de buff nu precies doet, in één zin, met de sterkte uit je upgrades.
function buffUitleg(def, entry) {
  const e = effectVan(entry, { kracht: D.goldenPower, weerstand: D.ddosResist }) || {};
  if (e.randomBuildingMult && entry.building) {
    const b = BUILDINGS.find((x) => x.id === entry.building);
    return `${b.name} draait ${fmt(e.randomBuildingMult, { decimals: 1 })} keer zo hard.`;
  }
  if (entry.charges) return `${def.desc} Elke klik x${fmt(e.clickMult)}.`;
  if (e.ppsMult) return `${def.desc} Productie x${fmt(e.ppsMult, { decimals: 1 })}.`;
  if (e.clickMult) return `${def.desc} Kliks x${fmt(e.clickMult, { decimals: e.clickMult < 1 ? 2 : 0 })}.`;
  return def.desc;
}

on("buff:start", ({ def, entry }) => {
  const slecht = def.effect?.ppsMult < 1 || def.effect?.clickMult < 1;
  const uitleg = buffUitleg(def, entry);
  logboek(`${def.name}: ${uitleg}`, slecht ? "slecht" : "goud");
  toast({ title: def.name, text: uitleg, icon: def.icon, tone: slecht ? "slecht" : "goud" });
});

on("buff:instant", ({ def, amount }) => {
  logboek(`${def.name}: ${fmt(amount)} packets ineens`, "goud");
  toast({ title: def.name, text: `${fmtLong(amount)} packets ineens.`, icon: def.icon, tone: "goud" });
});

on("hazard:instant", ({ def, lost }) => {
  toast({ title: def.name, text: `${fmtLong(lost)} packets kwijt.`, icon: def.icon, tone: "slecht" });
});

on("toast", (payload) => toast(payload));

// ---------------------------------------------------------- Prestaties

onAchievement((a) => {
  logboek(`Prestatie: ${a.name}`, a.egg ? "goud" : "goed");
  // Easter eggs melden zichzelf al met hun eigen tekst; niet dubbel toeteren.
  if (!a.egg) {
    toast({ title: a.name, text: a.desc, icon: a.icon, tone: "goed" });
    chord([520, 700]);
  }
  renderAchievements();
});

// ------------------------------------------------------------ Instellingen

on("meer:built", () => {
  const notation = el("opt-notation");
  notation.value = G.options.notation;
  notation.addEventListener("change", () => {
    G.options.notation = notation.value;
    setNotation(notation.value);
    lastScoreText = "";
    resetPanels();
    renderAll();
    save();
  });

  const naamVeld = el("opt-netwerknaam");
  naamVeld.value = G.options.netwerknaam || "";
  naamVeld.addEventListener("input", () => {
    G.options.netwerknaam = naamVeld.value.slice(0, 24);
    applyUiterlijk();
  });
  naamVeld.addEventListener("change", () => save());

  const sound = el("opt-sound");
  sound.checked = G.options.sound;
  sound.addEventListener("change", () => {
    G.options.sound = sound.checked;
    if (sound.checked) chord([620, 820]);
    save();
  });

  const motion = el("opt-motion");
  motion.checked = G.options.motion;
  motion.addEventListener("change", () => {
    G.options.motion = motion.checked;
    document.body.classList.toggle("rustig", !motion.checked);
    applyUiterlijk();
    save();
  });

  const slot = el("opt-slot");
  slot.value = actiefBestand();
  slot.addEventListener("change", () => {
    wisselSlot(slot.value);
    location.reload();
  });
  const verversSloten = () => {
    for (const optie of slot.options) {
      const info = optie.value === actiefBestand() ? { packets: G.packets } : slotSummary(optie.value);
      optie.textContent = info
        ? `Bestand ${optie.value} — ${fmt(info.packets)} packets`
        : `Bestand ${optie.value} — leeg`;
    }
  };
  verversSloten();
  on("sheet:open", verversSloten);

  const melding = el("opslag-melding");
  let meldingTimer = null;
  const zeg = (text, fout = false) => {
    melding.textContent = text;
    melding.classList.toggle("fout", fout);
    clearTimeout(meldingTimer);
    meldingTimer = setTimeout(() => (melding.textContent = ""), 4000);
  };

  el("btn-save").addEventListener("click", () => {
    const ok = save();
    zeg(ok ? "Opgeslagen." : "Opslaan lukt niet in deze browser.", !ok);
  });
  el("btn-export").addEventListener("click", async () => {
    const code = exportSave();
    try {
      await navigator.clipboard.writeText(code);
      zeg("Code gekopieerd naar je klembord.");
    } catch {
      dialog({
        title: "Je code",
        body: `<p>Kopieer deze tekst en bewaar hem.</p><textarea class="veld" readonly aria-label="Je code">${esc(code)}</textarea>`,
        actions: [{ label: "Klaar", style: "ghost" }],
      });
    }
  });
  el("btn-import").addEventListener("click", () => {
    dialog({
      title: "Code invoeren",
      body: `<p>Plak hier de code van een ander toestel. Je huidige voortgang in dit bestand wordt overschreven, maar je kunt de import daarna nog ongedaan maken.</p>
        <textarea class="veld" id="import-veld" placeholder="SERGE1:..." aria-label="Code"></textarea>
        <p class="melding fout" id="import-fout" role="alert"></p>`,
      actions: [
        { label: "Annuleren", style: "ghost" },
        {
          label: "Laden",
          onClick: (body) => {
            try {
              importSave(body.querySelector("#import-veld").value);
            } catch (err) {
              body.querySelector("#import-fout").textContent = err.message;
              return false;
            }
            location.reload();
          },
        },
      ],
    });
  });

  const herstel = el("btn-herstel");
  const syncHerstel = () => {
    const info = backupInfo();
    herstel.hidden = !info;
    if (info) herstel.title = `Terug naar de stand van ${new Date(info.tijd).toLocaleString("nl-BE")}`;
  };
  syncHerstel();
  on("sheet:open", syncHerstel);
  herstel.addEventListener("click", () => {
    dialog({
      title: "Import ongedaan maken?",
      body: "<p>Je gaat terug naar de stand van vlak voor je laatste import. Wat je sindsdien in dit bestand speelde, verdwijnt.</p>",
      actions: [
        { label: "Nee, laat staan", style: "ghost" },
        {
          label: "Terugzetten",
          style: "gevaar",
          onClick: () => {
            if (herstelBackup()) location.reload();
          },
        },
      ],
    });
  });

  el("btn-wipe").addEventListener("click", () => {
    dialog({
      title: "Alles wissen?",
      body: `<p>Dit verwijdert dit opslagbestand volledig: packets, apparaten, prestaties en studiepunten.</p><p>Dit kun je niet terugdraaien.</p>`,
      actions: [
        { label: "Nee, laat staan", style: "ghost" },
        {
          label: "Wissen",
          style: "gevaar",
          onClick: () => {
            wipe();
            location.reload();
          },
        },
      ],
    });
  });

  emit("meer:klaar");
});

const netwerknaamEl = el("netwerknaam");
const minderBeweging = window.matchMedia("(prefers-reduced-motion: reduce)");

export function applyUiterlijk() {
  const naam = (G.options.netwerknaam || "").trim();
  netwerknaamEl.hidden = !naam;
  netwerknaamEl.textContent = naam;
  const { portret, ring, achtergrond } = G.uiterlijk;
  document.body.dataset.achtergrond = achtergrond;
  stelRegenIn({ aan: achtergrond === "matrix", beweging: G.options.motion && !minderBeweging.matches });
  sergeBtn.dataset.portret = portret;
  sergeBtn.dataset.ring = ring;
  const bron = fotoVoor(portret);
  if (sergeImg.getAttribute("src") !== bron) sergeImg.src = bron;
}

on("uiterlijk", applyUiterlijk);
minderBeweging.addEventListener("change", applyUiterlijk);

onSkin((skin) => {
  logboek(`Nieuw ${skin.soort}: ${skin.naam}`, "goud");
  if (skin.feest) {
    dialog({
      title: skin.feest.titel,
      body: `<p>${skin.feest.tekst}</p>`,
      actions: [
        { label: "Later", style: "ghost" },
        {
          label: "Meteen opzetten",
          onClick: () => {
            G.uiterlijk.portret = skin.id;
            applyUiterlijk();
            touch();
          },
        },
      ],
    });
    return;
  }
  toast({
    title: `Nieuw ${skin.soort}: ${skin.naam}`,
    text: "Te kiezen onder het tandwiel, bij Uiterlijk.",
    icon: "🎨",
    tone: "goud",
  });
});

// ------------------------------------------------------ Mobiele volgorde
// Op een telefoon hoort het logboek onderaan, bij de rest van de cijfers,
// zodat de winkel niet twee schermen naar beneden staat. Op desktop staat
// het gewoon onder de quotes in de linkerkolom.

const logboekBlok = document.querySelector(".logboek");
const smalScherm = window.matchMedia("(max-width: 900px)");

function plaatsLogboek() {
  const doel = smalScherm.matches ? document.querySelector(".status") : document.querySelector(".stage");
  if (logboekBlok.parentElement !== doel) doel.append(logboekBlok);
}

smalScherm.addEventListener("change", plaatsLogboek);

// --------------------------------------------------------------- Hint

const HINTS = [
  ["Klik om te beginnen", () => G.stats.clicks < 5],
  ["Koop je eerste patchkabel in de winkel", () => D.totalBuildings === 0],
  ["Upgrades staan in het tweede tabblad", () => Object.keys(G.upgrades).length === 0 && G.stats.lifetime > 200],
  ["Gouden packets verschijnen vanzelf. Klik ze.", () => G.stats.goldenClicks === 0 && G.stats.lifetime > 5e3],
  ["Rode packets zijn geen gouden packets", () => G.stats.ddosSeen === 0 && G.prestige >= 1],
  ["", () => true],
];

const starterEl = el("starter");

function syncShopbar() {
  const balk = document.querySelector(".shopbar");
  const nodig = D.totalBuildings > 0;
  if (balk.hidden !== !nodig) balk.hidden = !nodig;
  // De uitleg verdwijnt zodra je duidelijk snapt hoe het werkt.
  const soorten = BUILDINGS.filter((b) => (G.buildings[b.id] || 0) > 0).length;
  const toon = soorten < 3 && Object.keys(G.upgrades).length < 2;
  if (starterEl.hidden !== !toon) starterEl.hidden = !toon;
}

function syncHint() {
  for (const [text, test] of HINTS) {
    if (test()) {
      if (hintEl.textContent !== text) hintEl.textContent = text;
      return;
    }
  }
}

// -------------------------------------------------------------- Publiek

let lastRev = -1;

export function frameSync() {
  syncCounter();
  syncBuffs();
  syncIncident();
  syncRack();
  syncGrafiek();
  syncDoel();
  syncVerkeer();
  syncTabVisibility();
  syncShopbar();
  if (sheet.open) renderMeer();
  if (activeTab === "studie") syncStudie();
  syncHint();
  syncFast();
  if (rev() !== lastRev) {
    lastRev = rev();
    renderAll();
  }
}

export function initShell() {
  document.body.classList.toggle("rustig", !G.options.motion);
  setBuyAmount(G.options.buyAmount || 1);
  sellToggle.setAttribute("aria-pressed", String(!!G.options.sellMode));
  sellToggle.textContent = G.options.sellMode ? "Verkopen aan" : "Verkopen";
  applyUiterlijk();
  plaatsLogboek();
  showTab("winkel");
  renderAll();
  syncRack();
  syncGrafiek();
}

// --------------------------------------------------- Statistiekenpaneel
// Een echt <dialog>: showModal() houdt de focus erin, Esc sluit hem, en de
// focus gaat daarna vanzelf terug naar het tandwiel.

const sheet = el("sheet");

export function openSheet() {
  renderMeer();
  sheet.showModal();
  el("sheet-sluit").focus();
  emit("sheet:open");
}

export function sluitSheet() {
  if (sheet.open) sheet.close();
}

el("btn-meer").addEventListener("click", openSheet);
el("sheet-sluit").addEventListener("click", sluitSheet);
sheet.addEventListener("click", (e) => {
  if (e.target === sheet) sluitSheet();
});

el("btn-help").addEventListener("click", () => {
  dialog({
    title: "Hoe het werkt",
    body: `<p>Klik op Serge voor packets. Koop daarmee apparaten die vanzelf packets opleveren, en upgrades die alles versnellen.</p>
           <p>Gouden packets geven een tijdelijke bonus. Rode packets zijn dat niet: die laat je staan.</p>
           <p>Tabbladen met een 🔒 vertellen zelf wat je ervoor moet doen. Onder het tandwiel rechtsboven vind je je statistieken, instellingen en opslag.</p>
           <p>Sneltoetsen: <strong>spatie</strong> klikt, <strong>1 / 2 / 3 / 4</strong> zetten het aantal per aankoop, <strong>G</strong> pakt een gouden packet, <strong>Esc</strong> sluit een venster.</p>`,
    actions: [{ label: "Duidelijk", style: "ghost" }],
  });
});

on("graduated", () => {
  resetPanels();
  renderAll();
  syncRack();
  syncGrafiek();
  applyUiterlijk();
  showTab("studie");
});
