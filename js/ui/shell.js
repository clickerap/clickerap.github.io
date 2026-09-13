// De schil: teller, Serge, buffs, logbalk, rack, tabbladen en gouden packets.

import { G, D, BUILDINGS, VAKKEN, nextCost, availableUpgrades, onAchievement, onSkin, touch, rev } from "../state.js";
import { BUFF_BY_ID, HAZARDS, INCIDENTS } from "../data/buffs.js";
import { fmt, fmtLong, fmtTime, setNotation } from "../format.js";
import { click, goldenClicked, goldenExpired, fixIncident, ignoreIncident } from "../engine.js";
import { on, emit } from "../bus.js";
import { toast, floatText, sparks, blip, chord, dialog, attachTooltip } from "./fx.js";
import { renderAll, syncFast, renderStudie, renderMeer, renderAchievements, resetPanels } from "./panels.js";
import { save, wipe, exportSave, importSave, setSlot, currentSlot, slotSummary } from "../save.js";
import { meet, tekenGrafiek } from "./grafiek.js";

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

const EVOLVED_SRC = "Gemini_Generated_Image_jsk7ebjsk7ebjsk7.png";
const STANDARD_SRC = "35616611_186097762080080_1909471807589580800_n.jpg";

// ------------------------------------------------------------- Tabbladen

const tabs = [...document.querySelectorAll("#tabs button")];
const panels = new Map(tabs.map((t) => [t.dataset.tab, el(t.getAttribute("aria-controls"))]));
let activeTab = "winkel";

export function showTab(name) {
  if (!panels.has(name)) return;
  activeTab = name;
  for (const tab of tabs) {
    const on = tab.dataset.tab === name;
    tab.setAttribute("aria-selected", String(on));
    panels.get(tab.dataset.tab).hidden = !on;
  }
  if (name === "studie") renderStudie();
  if (name === "prestaties") renderAchievements();
  // Elk tabblad begint bovenaan; anders erf je de scrollpositie van het vorige.
  const panelen = el("tabpanels");
  panelen.scrollTop = 0;
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
    const i = tabs.indexOf(tab);
    const zichtbaar = tabs.filter((t) => !t.hidden);
    const pos = zichtbaar.indexOf(tab);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next = zichtbaar[(pos + (e.key === "ArrowRight" ? 1 : zichtbaar.length - 1)) % zichtbaar.length];
      next.focus();
      if (!next.classList.contains("op-slot")) showTab(next.dataset.tab);
    }
    void i;
  });
}

const SLOTEN = {
  labo: {
    open: () => G.stats.lifetime >= 5e3 || G.stats.prestiges > 0,
    naam: "Het labo",
    eis: "Verdien in totaal 5.000 packets.",
    tekst: "Vier opdrachten: een overhoring van Serge, een terminal, de bandbreedtemarkt en een patchkast.",
    icoon: "🧪",
  },
  studie: {
    open: () => G.prestige > 0 || G.stats.lifetime >= 1e11,
    naam: "Studie",
    eis: "Verdien in totaal 100 miljard packets.",
    tekst: "Dan kun je afstuderen: opnieuw beginnen met studiepunten voor een boom vol blijvende bonussen.",
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
  const rect = sergeBtn.getBoundingClientRect();
  const x = event?.clientX ?? rect.left + rect.width / 2;
  const y = event?.clientY ?? rect.top + rect.height / 2;
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

document.addEventListener("keydown", (e) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
  if (e.code === "Space" && document.activeElement !== sergeBtn) {
    e.preventDefault();
    clickSerge();
  }
  if (activeTab === "winkel" && ["1", "2", "3", "4"].includes(e.key)) {
    const map = { 1: 1, 2: 10, 3: 100, 4: "max" };
    setBuyAmount(map[e.key]);
  }
});

// ------------------------------------------------------------ Winkelbalk

function setBuyAmount(amount) {
  G.options.buyAmount = amount;
  for (const btn of document.querySelectorAll(".segmented button")) {
    btn.classList.toggle("on", btn.dataset.amount === String(amount));
  }
  touch();
  renderAll();
}

for (const btn of document.querySelectorAll(".segmented button")) {
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

export function syncBuffs() {
  const sleutel = G.buffs.map((b) => b.id).join("|");
  if (sleutel !== buffSleutel) {
    buffSleutel = sleutel;
    buffbar.innerHTML = "";
    buffTijden.clear();
    for (const entry of G.buffs) {
      const def = BUFF_BY_ID[entry.id]
        || HAZARDS.find((h) => h.id === entry.id)
        || incidentBuffDef(entry.id);
      const pil = document.createElement("span");
      pil.className = `buff${entry.hazard ? " slecht" : ""}`;
      pil.innerHTML = `<span>${def.icon}</span> ${def.name} <time></time>`;
      attachTooltip(pil, () => {
        const e = entry.effect || def.effect || {};
        const regels = [];
        if (e.ppsMult) {
          regels.push(`<div class="regel"><span>Productie</span><span>x${fmt(e.ppsMult, { decimals: 2 })}</span></div>`);
        }
        if (e.clickMult) {
          regels.push(`<div class="regel"><span>Per klik</span><span>x${fmt(e.clickMult, { decimals: 2 })}</span></div>`);
        }
        if (e.randomBuildingMult && entry.building) {
          const b = BUILDINGS.find((x) => x.id === entry.building);
          regels.push(`<div class="regel"><span>${b ? b.name : "Eén apparaat"}</span><span>x${fmt(e.randomBuildingMult)}</span></div>`);
        }
        const rest = entry.charges
          ? `Nog ${entry.charges} ${entry.charges === 1 ? "klik" : "kliks"}`
          : `Nog ${fmtTime(Math.max(0, (entry.until - Date.now()) / 1000))}`;
        return `<h4>${def.icon} ${def.name}</h4>
          ${regels.join("")}
          <p class="cursief">${def.desc}</p>
          <div class="regel prijsregel">${rest}</div>`;
      });
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

function incidentBuffDef(id) {
  const inc = INCIDENTS.find((i) => `incident-${i.id}` === id);
  return inc
    ? { icon: "⚠️", name: "Storing", desc: inc.text }
    : { icon: "❔", name: "Onbekend", desc: "" };
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
let incidentDef = null;
const incidentProgress = el("incident-progress");

on("incident:start", ({ def }) => {
  incidentDef = def;
  incidentText.textContent = def.text;
  incidentFix.textContent = `${def.fixLabel} (${fmt(G.incident.cost)})`;
  incidentIgnore.textContent = def.ignoreLabel;
  incidentEl.hidden = false;
  blip(220, 0.2, 0.06);
});

on("incident:end", ({ how }) => {
  incidentEl.hidden = true;
  if (how === "fixed") toast({ title: "Opgelost", text: "Het netwerk draait weer op volle kracht.", icon: "🔧", tone: "goed" });
  else if (incidentDef) toast({ title: "Storing blijft", text: "Je productie ligt even lager.", icon: "⚠️", tone: "slecht" });
  incidentDef = null;
});

incidentFix.addEventListener("click", () => {
  if (!fixIncident()) toast({ title: "Te weinig packets", text: "Je kunt het noodherstel nu niet betalen.", tone: "slecht" });
});
incidentIgnore.addEventListener("click", ignoreIncident);

function syncIncident() {
  if (!G.incident) return;
  const totaal = G.incident.until - G.incident.startedAt;
  const over = Math.max(0, G.incident.until - Date.now());
  incidentProgress.style.transform = `scaleX(${over / totaal})`;
  incidentFix.disabled = G.packets < G.incident.cost;
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

export function logboek(tekst, toon = "") {
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
    row.innerHTML = `<span>${b.icon}</span><span class="rack-units">${units}</span><span class="rack-aantal">${fmt(n)}</span>`;
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

let packetEl = null;
let packetTimer = null;

on("golden:spawn", (info) => {
  if (packetEl) return;
  const size = 62;
  const marge = 24;
  const x = marge + Math.random() * (window.innerWidth - size - marge * 2);
  const y = marge + 70 + Math.random() * (window.innerHeight - size - marge * 2 - 70);
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
  packetTimer = setTimeout(() => {
    goldenExpired(info);
    removePacket();
  }, info.lifetimeMs);
});

function removePacket() {
  clearTimeout(packetTimer);
  packetEl?.remove();
  packetEl = null;
}

on("buff:start", ({ def }) => {
  logboek(`${def.name} actief`, def.effect?.ppsMult < 1 || def.effect?.clickMult < 1 ? "slecht" : "goud");
  toast({ title: def.name, text: def.desc, icon: def.icon, tone: def.effect?.ppsMult < 1 || def.effect?.clickMult < 1 ? "slecht" : "goud" });
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
    save();
  });

  const slot = el("opt-slot");
  slot.value = currentSlot();
  slot.addEventListener("change", () => {
    save();
    setSlot(slot.value);
    location.reload();
  });
  const verversSloten = () => {
    for (const optie of slot.options) {
      const info = optie.value === currentSlot() ? { packets: G.packets } : slotSummary(optie.value);
      optie.textContent = info
        ? `Bestand ${optie.value} — ${fmt(info.packets)} packets`
        : `Bestand ${optie.value} — leeg`;
    }
  };
  verversSloten();
  on("sheet:open", verversSloten);

  const melding = el("opslag-melding");
  const zeg = (text, fout = false) => {
    melding.textContent = text;
    melding.classList.toggle("fout", fout);
    setTimeout(() => (melding.textContent = ""), 3000);
  };

  el("btn-save").addEventListener("click", () => {
    const ok = save();
    zeg(ok ? "Opgeslagen." : "Opslaan mislukt.", !ok);
  });
  el("btn-export").addEventListener("click", async () => {
    const code = exportSave();
    try {
      await navigator.clipboard.writeText(code);
      zeg("Code gekopieerd naar je klembord.");
    } catch {
      dialog({
        title: "Je code",
        body: `<p>Kopieer deze tekst en bewaar hem.</p><textarea class="veld" readonly>${code}</textarea>`,
        actions: [{ label: "Klaar", style: "ghost" }],
      });
    }
  });
  el("btn-import").addEventListener("click", () => {
    dialog({
      title: "Code invoeren",
      body: `<p>Plak hier de code van een ander toestel. Je huidige voortgang in dit bestand wordt overschreven.</p><textarea class="veld" id="import-veld" placeholder="SERGE1:..."></textarea>`,
      actions: [
        { label: "Annuleren", style: "ghost" },
        {
          label: "Laden",
          onClick: (body) => {
            try {
              importSave(body.querySelector("#import-veld").value);
              location.reload();
            } catch (err) {
              zeg(err.message, true);
            }
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

export function applyUiterlijk() {
  const naam = (G.options.netwerknaam || "").trim();
  netwerknaamEl.hidden = !naam;
  netwerknaamEl.textContent = naam;
  const { portret, ring, achtergrond } = G.uiterlijk;
  document.body.dataset.achtergrond = achtergrond;
  sergeBtn.dataset.portret = portret;
  sergeBtn.dataset.ring = ring;
  const bron = portret === "evolved" ? EVOLVED_SRC : STANDARD_SRC;
  if (!sergeImg.src.endsWith(bron)) sergeImg.src = bron;
}

on("uiterlijk", applyUiterlijk);

onSkin((skin) => {
  logboek(`Nieuw ${skin.soort}: ${skin.naam}`, "goud");
  const waar = { portret: "portret", ring: "ring", achtergrond: "achtergrond" }[skin.soort] || "uiterlijk";
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
    title: `Nieuw ${waar}: ${skin.naam}`,
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
  if (!sheet.hidden) renderMeer();
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
  applyUiterlijk();
  plaatsLogboek();
  showTab("winkel");
  renderAll();
  syncRack();
  syncGrafiek();
}

// --------------------------------------------------- Statistiekenpaneel

const sheet = el("sheet");
let sheetTerug = null;

export function openSheet() {
  sheetTerug = document.activeElement;
  renderMeer();
  sheet.hidden = false;
  el("sheet-sluit").focus();
  emit("sheet:open");
}

export function sluitSheet() {
  sheet.hidden = true;
  sheetTerug?.focus?.();
}

el("btn-meer").addEventListener("click", openSheet);
el("sheet-sluit").addEventListener("click", sluitSheet);
sheet.addEventListener("click", (e) => {
  if (e.target === sheet) sluitSheet();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !sheet.hidden) sluitSheet();
});

el("btn-help").addEventListener("click", () => {
  dialog({
    title: "Hoe het werkt",
    body: `<p>Klik op Serge voor packets. Koop daarmee apparaten die vanzelf packets opleveren, en upgrades die alles versnellen.</p>
           <p>Gouden packets geven een tijdelijke bonus. Rode packets zijn dat niet: die laat je staan.</p>
           <p>Tabbladen met een 🔒 vertellen zelf wat je ervoor moet doen. Onder het tandwiel rechtsboven vind je je statistieken, instellingen en opslag.</p>
           <p>Sneltoetsen: <strong>spatie</strong> klikt, <strong>1 / 2 / 3 / 4</strong> zetten het aantal per aankoop, <strong>Esc</strong> sluit een venster.</p>`,
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

