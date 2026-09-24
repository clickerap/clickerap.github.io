// De patchkast: werkorders uit de school. Serge legt ze in de bak, jij trekt
// de kabels. Elke order is een kabelgoot met aansluitingen die per twee bij
// elkaar horen; de regels staan in kabelgoot.js. Opgeleverde orders tellen op
// naar protocollen, en elk protocol geeft blijvend 2% extra productie.
//
// Een order betaalt een vast aantal seconden productie, afhankelijk van de
// maat van de goot. Een luchtdichte goot levert de helft meer op; elke kabel
// die Serge voor je legt, kost een vijfde.

import { G, D, earn, unlock, recompute } from "../state.js";
import { fmt, fmtTime } from "../format.js";
import { toast, chord, blip, kondigAan } from "../ui/fx.js";
import { egg } from "../eggs.js";
import { esc } from "../html.js";
import { INFO_KNOP } from "./info.js";
import { VERBINDINGEN, MATEN, WERK, DREMPELS, PROTOCOLLEN } from "../data/patch.js";
import { maakPuzzel, Legger, aansluitingOp, verbonden, aantalVerbonden, bezetting, alleVerbonden, luchtdicht } from "./kabelgoot.js";

const SOORT = Object.fromEntries(VERBINDINGEN.map((v) => [v.id, v]));
const PROTOCOL_IDS = Object.keys(PROTOCOLLEN);

// --------------------------------------------------------------- Staat

function kast() {
  const p = G.minigames.patch;
  p.discovered ||= {};
  p.wachtrij ||= [];
  p.gedaan ||= 0;
  p.luchtdicht ||= 0;
  p.nummer ||= 0;
  p.volgendeAt ||= 0;
  p.huidig ??= null;
  return p;
}

export function ontdekteAantal() {
  return Object.keys(G.minigames.patch?.discovered || {}).length;
}

// Een puzzel volgt helemaal uit zijn maat en zaadje; we maken hem één keer.
const puzzels = new Map();
export function puzzelVan(order) {
  const sleutel = `${order.n}:${order.zaad}`;
  let puzzel = puzzels.get(sleutel);
  if (!puzzel) {
    if (puzzels.size > 16) puzzels.clear();
    puzzel = maakPuzzel(order.n, order.zaad);
    puzzels.set(sleutel, puzzel);
  }
  return puzzel;
}

// Grotere goten gaan open naarmate je meer protocollen kent.
export function openMaten() {
  const aantal = ontdekteAantal();
  return Object.keys(MATEN).map(Number).filter((n) => MATEN[n].vanafProtocollen <= aantal);
}

// Liefst een maat die nog niet in de bak ligt, zodat je iets te kiezen hebt.
function nieuweOrder(p) {
  const open = openMaten();
  const anders = open.filter((n) => !p.wachtrij.some((o) => o.n === n));
  const keuze = anders.length ? anders : open;
  p.nummer += 1;
  return { nr: p.nummer, n: keuze[Math.floor(Math.random() * keuze.length)], zaad: Math.floor(Math.random() * 2 ** 32) };
}

// Elke paar minuten een order erbij, ook als het spel dicht was. Een volle bak
// wacht: de klok loopt pas weer als je er een uithaalt.
export function vulWachtrij(nu = Date.now()) {
  const p = kast();
  if (p.wachtrij.length >= WERK.wachtrij) return false;
  if (!p.volgendeAt) p.volgendeAt = nu;
  let erbij = false;
  while (p.wachtrij.length < WERK.wachtrij && p.volgendeAt <= nu) {
    p.wachtrij.push(nieuweOrder(p));
    p.volgendeAt += WERK.interval * 1000;
    erbij = true;
  }
  return erbij;
}

export function neemOrder(index = 0, nu = Date.now()) {
  const p = kast();
  if (p.huidig && !p.huidig.klaar) return false;
  const order = p.wachtrij[index];
  if (!order) return false;
  if (p.wachtrij.length >= WERK.wachtrij) p.volgendeAt = nu + WERK.interval * 1000;
  p.wachtrij.splice(index, 1);
  p.huidig = { ...order, kabels: [], hulp: 0 };
  return true;
}

// --------------------------------------------------------------- Loon

// Productie zonder tijdelijke buffs: een burst maakt een order niet meer waard.
function basisPps() {
  return D.buffPps > 0 ? D.pps / D.buffPps : D.pps;
}

export function hulpFactor(hulp) {
  return Math.max(WERK.hulpMinimum, 1 - WERK.hulpKost * hulp);
}

export function loonVoor(n, { dicht = false, hulp = 0 } = {}) {
  const seconden = MATEN[n].seconden;
  return Math.max(25 * seconden, basisPps() * seconden) * (dicht ? WERK.luchtdicht : 1) * hulpFactor(hulp) * D.minigameReward;
}

export function volgendeDrempel() {
  return DREMPELS[ontdekteAantal()] ?? null;
}

// Na genoeg werkorders komt het volgende protocol vrij, in vaste volgorde.
function ontdekProtocollen() {
  const p = kast();
  const nieuw = [];
  let aantal = ontdekteAantal();
  while (aantal < DREMPELS.length && p.gedaan >= DREMPELS[aantal]) {
    const id = PROTOCOL_IDS.find((k) => !p.discovered[k]);
    if (!id) break;
    p.discovered[id] = true;
    nieuw.push(id);
    aantal++;
  }
  if (!nieuw.length) return nieuw;
  recompute();
  unlock("patch-protocol");
  if (nieuw.includes("tokenring")) egg("egg-tokenring", "Token Ring", "Een protocol dat dood had moeten blijven. Het werkt.", D.pps * 200);
  if (aantal === PROTOCOL_IDS.length) unlock("patch-alles");
  return nieuw;
}

export function opleveren() {
  const p = kast();
  const h = p.huidig;
  if (!h || h.klaar) return null;
  const puzzel = puzzelVan(h);
  if (!alleVerbonden(puzzel, h.kabels)) return null;
  const dicht = luchtdicht(puzzel, h.kabels);
  const winst = loonVoor(h.n, { dicht, hulp: h.hulp });
  earn(winst);
  p.gedaan += 1;
  if (dicht) p.luchtdicht += 1;
  unlock("patch-1");
  if (dicht) unlock("patch-luchtdicht");
  if (dicht && h.n === 8 && h.hulp === 0) unlock("patch-meester");
  const nieuw = ontdekProtocollen();
  Object.assign(h, { klaar: true, winst, dicht, protocol: nieuw[nieuw.length - 1] || null });
  return { winst, dicht, nieuw };
}

// --------------------------------------------------------------- Bord
//
// Het bord is één SVG van 100 eenheden per vak. De vakken en aansluitingen
// worden per order één keer getekend; bij het slepen verandert alleen de laag
// met kabels, en gaan de lampjes aan of uit.

let legger = null;
let getekend = null;
let cursor = 0;
let sleepId = null;
let lampjes = new Set();

const plek = (n, vak) => [(vak % n) * 100 + 50, Math.floor(vak / n) * 100 + 50];

function bordSvg(puzzel) {
  const { n, paren } = puzzel;
  const vakken = [];
  for (let vak = 0; vak < n * n; vak++) {
    const [x, y] = plek(n, vak);
    vakken.push(`<rect class="kast-vak" x="${x - 45}" y="${y - 45}" width="90" height="90" rx="16"/><circle class="kast-ring" cx="${x}" cy="${y}" r="8"/>`);
  }
  const aansluitingen = paren.flatMap((paar, i) => [paar.a, paar.b].map((vak) => {
    const soort = SOORT[paar.soort];
    const [x, y] = plek(n, vak);
    return `<g class="kast-jack">
      <rect x="${x - 37}" y="${y - 37}" width="74" height="74" rx="17" fill="${soort.kleur}"/>
      <text x="${x}" y="${y + 1}">${soort.label}</text>
      <circle class="kast-gloed" data-lamp="${i}" cx="${x + 33}" cy="${y - 33}" r="19"/>
      <circle class="kast-led" data-lamp="${i}" cx="${x + 33}" cy="${y - 33}" r="10"/>
    </g>`;
  }));
  return `<svg class="kast-svg" viewBox="0 0 ${n * 100} ${n * 100}" aria-hidden="true" focusable="false">
    <g>${vakken.join("")}</g>
    <g class="kast-kabels"></g>
    <g>${aansluitingen.join("")}</g>
    <rect class="kast-cursor" width="94" height="94" rx="20"/>
  </svg>`;
}

function kabelSvg(n, kabel, kleur) {
  if (kabel.length < 2) return "";
  const punten = kabel.map((vak) => plek(n, vak).join(",")).join(" ");
  return `<polyline class="kabel-rand" points="${punten}"/>
    <polyline class="kabel" points="${punten}" stroke="${kleur}"/>
    <polyline class="kabel-glans" points="${punten}"/>`;
}

// Hoe een vak klinkt voor wie het niet ziet.
function beschrijf(puzzel, kabels, vak) {
  const { n, paren } = puzzel;
  const waar = `Rij ${Math.floor(vak / n) + 1}, kolom ${(vak % n) + 1}`;
  const paar = aansluitingOp(puzzel, vak);
  if (paar !== -1) {
    const soort = SOORT[paren[paar].soort];
    return `${waar}: aansluiting ${soort.label}, ${soort.naam}${verbonden(puzzel, kabels, paar) ? ", verbonden" : ""}.`;
  }
  const kabel = kabels.findIndex((k) => k.includes(vak));
  return kabel === -1 ? `${waar}: leeg.` : `${waar}: kabel ${SOORT[paren[kabel].soort].label}.`;
}

// Een lampje knippert drie keer als zijn verbinding opkomt, zoals op een switch.
function knipper(el, vertraging = 0) {
  if (!G.options.motion) return;
  el.classList.remove("knipper");
  void el.getBoundingClientRect();
  el.style.animationDelay = `${vertraging}ms`;
  el.classList.add("knipper");
}

function tekenKabels(root) {
  const bord = root.querySelector(".kast-svg");
  if (!bord || !legger) return;
  const { puzzel } = legger;
  const { n, paren } = puzzel;
  const kabels = legger.weergave();
  let html = kabels.map((kabel, i) => kabelSvg(n, kabel, SOORT[paren[i].soort].kleur)).join("");
  // Onder je vinger een zachte vlek in de kleur van de kabel die je trekt.
  if (sleepId !== null && legger.actief) {
    const [x, y] = plek(n, legger.actief.pad[legger.actief.pad.length - 1]);
    html += `<circle class="kast-vinger" cx="${x}" cy="${y}" r="46" fill="${SOORT[paren[legger.actief.i].soort].kleur}"/>`;
  }
  bord.querySelector(".kast-kabels").innerHTML = html;

  const nu = new Set(paren.map((_, i) => i).filter((i) => verbonden(puzzel, kabels, i)));
  for (const lamp of bord.querySelectorAll("[data-lamp]")) {
    const i = Number(lamp.dataset.lamp);
    lamp.classList.toggle("aan", nu.has(i));
    if (nu.has(i) && !lampjes.has(i) && lamp.classList.contains("kast-led")) knipper(lamp);
  }
  if ([...nu].some((i) => !lampjes.has(i))) blip(880, 0.06, 0.04);
  lampjes = nu;

  const [x, y] = plek(n, cursor);
  const rand = bord.querySelector(".kast-cursor");
  rand.setAttribute("x", x - 47);
  rand.setAttribute("y", y - 47);
  rand.classList.toggle("vast", !!legger.actief && sleepId === null);
}

// De kabels van de order in beeld gaan meteen naar de spelstaat, zodat een
// save halverwege je werk bewaart.
function bewaar() {
  const h = kast().huidig;
  if (h && legger) h.kabels = legger.kabels.map((k) => [...k]);
}

function werkbaar() {
  const h = kast().huidig;
  return !!legger && !!h && !h.klaar;
}

// Na een verandering: de nieuwe verbindingen melden en alles bijwerken.
function naVerandering(root, voor) {
  bewaar();
  const { puzzel } = legger;
  const na = aantalVerbonden(puzzel, legger.kabels);
  if (na > voor) {
    const alles = na === puzzel.paren.length;
    kondigAan(alles ? "Alle kabels liggen. Je kunt opleveren." : `${na} van ${puzzel.paren.length} kabels verbonden.`);
  }
  tekenKabels(root);
  tekenStaat(root);
}

function vakOnder(svg, n, e) {
  const r = svg.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  if (x < 0 || y < 0 || x >= 1 || y >= 1) return -1;
  return Math.floor(y * n) * n + Math.floor(x * n);
}

function koppelBord(root) {
  const bord = root.querySelector("#kast-bord");
  let voor = 0;

  bord.addEventListener("pointerdown", (e) => {
    const svg = bord.querySelector(".kast-svg");
    if (!werkbaar() || !svg || e.button !== 0 || sleepId !== null) return;
    const vak = vakOnder(svg, legger.puzzel.n, e);
    if (vak < 0) return;
    voor = aantalVerbonden(legger.puzzel, legger.kabels);
    if (!legger.begin(vak)) return;
    e.preventDefault();
    bord.focus({ preventScroll: true });
    bord.setPointerCapture(e.pointerId);
    sleepId = e.pointerId;
    cursor = vak;
    tekenKabels(root);
  });
  bord.addEventListener("pointermove", (e) => {
    if (e.pointerId !== sleepId || !legger?.actief) return;
    const vak = vakOnder(bord.querySelector(".kast-svg"), legger.puzzel.n, e);
    if (vak >= 0 && legger.naar(vak)) {
      cursor = legger.actief.pad[legger.actief.pad.length - 1];
      tekenKabels(root);
    }
  });
  const los = (e) => {
    if (e.pointerId !== sleepId) return;
    sleepId = null;
    if (!legger?.actief) return;
    legger.los();
    naVerandering(root, voor);
  };
  bord.addEventListener("pointerup", los);
  bord.addEventListener("pointercancel", los);

  bord.addEventListener("keydown", (e) => {
    if (!werkbaar() || sleepId !== null) return;
    const { puzzel } = legger;
    const n = puzzel.n;
    const rij = Math.floor(cursor / n);
    const kol = cursor % n;
    const doel = {
      ArrowUp: rij > 0 ? cursor - n : cursor,
      ArrowDown: rij < n - 1 ? cursor + n : cursor,
      ArrowLeft: kol > 0 ? cursor - 1 : cursor,
      ArrowRight: kol < n - 1 ? cursor + 1 : cursor,
    }[e.key];

    if (doel !== undefined) {
      e.preventDefault();
      if (doel === cursor) return;
      if (!legger.actief) {
        cursor = doel;
        tekenKabels(root);
        kondigAan(beschrijf(puzzel, legger.kabels, cursor));
        return;
      }
      if (!legger.stap(doel)) {
        kondigAan("Daar kan deze kabel niet langs.");
        return;
      }
      cursor = doel;
      // Bij de juiste aansluiting laat je vanzelf los.
      const i = legger.actief.i;
      if (verbonden(puzzel, legger.weergave(), i)) {
        legger.los();
        naVerandering(root, voor);
        return;
      }
      tekenKabels(root);
      kondigAan(beschrijf(puzzel, legger.weergave(), cursor));
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (legger.actief) {
        legger.los();
        naVerandering(root, voor);
        kondigAan("Kabel neergelegd.");
      } else {
        voor = aantalVerbonden(puzzel, legger.kabels);
        if (legger.begin(cursor)) {
          tekenKabels(root);
          kondigAan(`Kabel ${SOORT[puzzel.paren[legger.actief.i].soort].label} opgepakt. Beweeg met de pijltjes.`);
        } else {
          kondigAan("Hier ligt geen kabel of aansluiting.");
        }
      }
    } else if (e.key === "Escape" && legger.actief) {
      e.preventDefault();
      legger.annuleer();
      tekenKabels(root);
      kondigAan("Terug zoals het was.");
    } else if ((e.key === "Backspace" || e.key === "Delete") && !legger.actief) {
      e.preventDefault();
      const aansluiting = aansluitingOp(puzzel, cursor);
      const i = aansluiting !== -1 ? aansluiting : legger.kabels.findIndex((k) => k.includes(cursor));
      if (i === -1 || !legger.kabels[i].length) return;
      legger.wis(i);
      naVerandering(root, 0);
      kondigAan(`Kabel ${SOORT[puzzel.paren[i].soort].label} losgehaald.`);
    }
  });

  // Wie wegklikt terwijl hij een kabel vasthoudt, legt hem neer.
  bord.addEventListener("blur", () => {
    if (sleepId === null && legger?.actief) {
      legger.los();
      naVerandering(root, voor);
    }
  });
}

// --------------------------------------------------------------- Scherm

function zet(el, tekst) {
  if (el && el.textContent !== tekst) el.textContent = tekst;
}

// De order in beeld opnieuw opbouwen: kop, legende en bord.
function tekenOrder(root) {
  const h = kast().huidig;
  const kop = root.querySelector("#kast-order");
  const bord = root.querySelector("#kast-bord");
  getekend = h;
  sleepId = null;
  lampjes = new Set();
  if (!h) {
    legger = null;
    kop.innerHTML = `<div class="kast-titel"><h4>Geen werkorders</h4></div>`;
    root.querySelector("#kast-legende").innerHTML = "";
    bord.removeAttribute("role");
    bord.removeAttribute("tabindex");
    bord.removeAttribute("aria-label");
    bord.innerHTML = `<p class="kast-leeg">De bak is leeg. Serge brengt zo een nieuwe werkorder.</p>`;
    return;
  }
  const puzzel = puzzelVan(h);
  legger = new Legger(puzzel, h.kabels);
  cursor = Math.min(puzzel.paren[0].a, puzzel.paren[0].b);
  // Wat al verbonden was, brandt meteen; alleen nieuwe verbindingen knipperen.
  lampjes = new Set(puzzel.paren.map((_, i) => i).filter((i) => verbonden(puzzel, legger.kabels, i)));
  kop.innerHTML = `
    <div class="kast-titel">
      <h4>${esc(puzzel.lokaal)}</h4>
      <span>Werkorder ${h.nr} · ${h.n} bij ${h.n}</span>
    </div>
    <p class="kast-notitie">“${esc(puzzel.notitie)}”</p>`;
  root.querySelector("#kast-legende").innerHTML = puzzel.paren.map((paar, i) => {
    const soort = SOORT[paar.soort];
    return `<li data-legende="${i}" style="--kleur: ${soort.kleur}"><b>${soort.label}</b>${esc(soort.naam)}</li>`;
  }).join("");
  bord.setAttribute("role", "application");
  bord.setAttribute("tabindex", "0");
  bord.setAttribute("aria-label", `Kabelgoot van ${h.n} bij ${h.n}`);
  bord.setAttribute("aria-describedby", "kast-toetsen");
  bord.innerHTML = bordSvg(puzzel);
  tekenKabels(root);
  // Een opgeleverde goot laat al zijn lampjes nog één keer rondgaan.
  if (h.klaar) bord.classList.add("klaar");
  else bord.classList.remove("klaar");
}

function tekenStaat(root) {
  const p = kast();
  const h = p.huidig;
  const klaar = !!h?.klaar;
  const puzzel = h ? puzzelVan(h) : null;
  const kabels = legger ? legger.kabels : [];

  zet(root.querySelector("#kast-stand"), `${ontdekteAantal()} / ${PROTOCOL_IDS.length} protocollen · +${ontdekteAantal() * 2}%`);

  // De legende telt mee: een verbonden paar krijgt een vinkje.
  for (const li of root.querySelectorAll("[data-legende]")) {
    li.classList.toggle("aan", !!puzzel && verbonden(puzzel, kabels, Number(li.dataset.legende)));
  }

  const status = root.querySelector("#kast-status");
  const knoppen = root.querySelector("#kast-knoppen");
  const resultaat = root.querySelector("#kast-resultaat");
  status.hidden = !h || klaar;
  knoppen.hidden = !h || klaar;
  resultaat.hidden = !klaar;

  if (h && !klaar) {
    const aantal = aantalVerbonden(puzzel, kabels);
    const vol = bezetting(puzzel, kabels);
    const allemaal = aantal === puzzel.paren.length;
    zet(status, allemaal
      ? vol === 1
        ? "Luchtdicht: alle kabels liggen en de goot is vol."
        : `Alle kabels liggen. De goot is ${Math.floor(vol * 100)}% vol; vul hem helemaal voor de helft meer, of lever nu op.`
      : `${aantal} van ${puzzel.paren.length} kabels verbonden · goot ${Math.floor(vol * 100)}% vol`);
    status.classList.toggle("dicht", allemaal && vol === 1);

    const oplever = root.querySelector("#kast-oplever");
    oplever.disabled = !allemaal;
    const loon = loonVoor(h.n, { dicht: allemaal && vol === 1, hulp: h.hulp });
    zet(oplever.querySelector("small"), allemaal ? `+${fmt(loon)}` : `nog ${puzzel.paren.length - aantal} ${puzzel.paren.length - aantal === 1 ? "kabel" : "kabels"}`);

    const hulp = root.querySelector("#kast-hulp");
    hulp.disabled = allemaal && vol === 1;
    zet(hulp.querySelector("small"), `loon ${Math.round(hulpFactor(h.hulp + 1) * 100)}%`);
    root.querySelector("#kast-wis").disabled = !kabels.some((k) => k.length);
  }

  if (klaar) {
    const regels = [`<strong>Opgeleverd: +${fmt(h.winst)} packets</strong>`];
    if (h.dicht) regels.push(`<span class="kast-dicht">Luchtdicht, de helft meer</span>`);
    if (h.hulp) regels.push(`<span>Serge legde ${h.hulp === 1 ? "één kabel" : `${h.hulp} kabels`}: ${Math.round(hulpFactor(h.hulp) * 100)}% van het loon</span>`);
    if (h.protocol && PROTOCOLLEN[h.protocol]) {
      const proto = PROTOCOLLEN[h.protocol];
      regels.push(`<span class="kast-nieuw"><span aria-hidden="true">${proto.icon}</span> Nieuw protocol: ${esc(proto.naam)}. Alles produceert 2% meer.</span>`);
    }
    const html = regels.join("");
    if (resultaat.dataset.html !== html) {
      resultaat.dataset.html = html;
      resultaat.innerHTML = html;
    }
  }

  tekenBak(root, !h || klaar);
  tekenProtocollen(root);
}

// De werkbonnen in de bak. Kiezen kan pas als de order in beeld af is.
let bakSleutel = "";
function tekenBak(root, kiesbaar) {
  const p = kast();
  const lijst = root.querySelector("#kast-bonnen");
  zet(root.querySelector("#kast-bak-kop"), kiesbaar && p.wachtrij.length ? "Kies je volgende werkorder" : "In de bak");
  const sleutel = `${kiesbaar}|${p.wachtrij.map((o) => `${o.nr}:${o.zaad}`).join(",")}`;
  if (sleutel !== bakSleutel) {
    bakSleutel = sleutel;
    const bonnen = p.wachtrij.map((order, i) => {
      const puzzel = puzzelVan(order);
      const inhoud = `<b>${esc(puzzel.lokaal)}</b><span>${order.n} bij ${order.n} · ${puzzel.paren.length} kabels</span><span class="kast-bon-loon" data-maat="${order.n}"></span>`;
      return kiesbaar
        ? `<li><button type="button" class="kast-bon" data-bon="${i}">${inhoud}</button></li>`
        : `<li class="kast-bon">${inhoud}</li>`;
    });
    if (p.wachtrij.length < WERK.wachtrij) bonnen.push(`<li class="kast-bon wacht"><b>Volgende werkorder</b><span id="kast-klok"></span></li>`);
    lijst.innerHTML = bonnen.join("");
  }
  for (const loon of lijst.querySelectorAll("[data-maat]")) zet(loon, `${fmt(loonVoor(Number(loon.dataset.maat)))} packets`);
  const over = Math.max(0, ((p.volgendeAt || 0) - Date.now()) / 1000);
  zet(root.querySelector("#kast-klok"), `over ${fmtTime(over)}`);
}

let protoSleutel = "";
function tekenProtocollen(root) {
  const p = kast();
  const drempel = volgendeDrempel();
  zet(root.querySelector("#kast-proto-stand"), drempel === null
    ? `${p.gedaan} werkorders · alles ontdekt`
    : `${p.gedaan} ${p.gedaan === 1 ? "werkorder" : "werkorders"} · volgend protocol bij ${drempel}`);
  const sleutel = PROTOCOL_IDS.map((id) => (p.discovered[id] ? 1 : 0)).join("");
  if (sleutel === protoSleutel) return;
  protoSleutel = sleutel;
  let slot = 0;
  root.querySelector("#kast-proto-lijst").innerHTML = PROTOCOL_IDS.map((id) => {
    const proto = PROTOCOLLEN[id];
    if (p.discovered[id]) return `<li class="aan" title="${esc(proto.uitleg)}"><span aria-hidden="true">${proto.icon}</span>${esc(proto.naam)}</li>`;
    // Nog niet ontdekt: je ziet wanneer het volgende vrijkomt, niet welk het is.
    const bij = DREMPELS[ontdekteAantal() + slot++];
    return `<li>Bij ${bij} werkorders</li>`;
  }).join("");
}

function kiesBon(root, index) {
  if (!neemOrder(index)) return;
  tekenOrder(root);
  tekenStaat(root);
  root.querySelector("#kast-bord").focus({ preventScroll: true });
}

function lever(root) {
  const uitkomst = opleveren();
  if (!uitkomst) return;
  lampjes = new Set();
  tekenOrder(root);
  // Alle lampjes gaan nog eens rond, van linksboven naar rechtsonder.
  root.querySelectorAll(".kast-led").forEach((lamp, i) => knipper(lamp, i * 70));
  tekenStaat(root);
  chord(uitkomst.dicht ? [620, 830, 1040] : [620, 830]);
  const extra = uitkomst.dicht ? " De goot is luchtdicht." : "";
  toast({ title: "Werkorder opgeleverd", text: `${fmt(uitkomst.winst)} packets.${extra}`, icon: "🗄️", tone: "goed" });
  for (const id of uitkomst.nieuw) {
    const proto = PROTOCOLLEN[id];
    toast({ title: `Nieuw protocol: ${proto.naam}`, text: `${proto.uitleg} Alles produceert 2% meer.`, icon: proto.icon, tone: "goud" });
  }
  kondigAan(`Opgeleverd: ${fmt(uitkomst.winst)} packets.${extra}`);
  (root.querySelector("[data-bon]") || root.querySelector("#kast-resultaat")).focus({ preventScroll: true });
}

function vraagHulp(root) {
  if (!werkbaar()) return;
  const voor = aantalVerbonden(legger.puzzel, legger.kabels);
  const i = legger.hulp();
  if (i === -1) return;
  kast().huidig.hulp += 1;
  const soort = SOORT[legger.puzzel.paren[i].soort];
  kondigAan(`Serge legt de kabel ${soort.label}.`);
  naVerandering(root, voor);
}

export const patch = {
  id: "patch",
  name: "Patchkast",
  icon: "🗄️",
  eis: "Vraagt glasvezel",
  unlocked: () => (G.buildings.fiber || 0) >= 1,
  info: [
    { kop: "Wat is het", tekst: "Werkorders uit de school: in een lokaal moeten apparaten aangesloten worden. Elke order is een kabelgoot met aansluitingen die per twee bij elkaar horen." },
    {
      kop: "Kabels leggen",
      punten: [
        "Sleep van een aansluiting naar de aansluiting met hetzelfde label en dezelfde kleur, vak voor vak: naar boven, onder, links of rechts.",
        "Kabels kruisen elkaar niet. Sleep je over een andere kabel, dan wordt die afgeknipt.",
        "Terugslepen maakt je kabel korter. Begin je op een bestaande kabel, dan pak je hem daar weer op.",
        "Klopt een verbinding, dan knipperen de lampjes bij beide aansluitingen en blijven ze branden.",
        "Met het toetsenbord: pijltjes om te bewegen, Enter om een kabel op te pakken of neer te leggen, Escape om terug te zetten, Delete om een kabel los te halen.",
      ],
    },
    {
      kop: "Opleveren",
      punten: [
        `Liggen alle kabels, dan druk je op Opleveren. Een order levert ${Math.min(...Object.values(MATEN).map((m) => m.seconden))} tot ${Math.max(...Object.values(MATEN).map((m) => m.seconden))} seconden van je productie op, naargelang de maat van de goot.`,
        `Ligt elk vak van de goot vol, dan is hij luchtdicht en krijg je ${Math.round((WERK.luchtdicht - 1) * 100)}% meer. Elke goot kan luchtdicht.`,
        `Vraag Serge legt één kabel voor je, maar kost telkens ${Math.round(WERK.hulpKost * 100)}% van het loon. Je houdt altijd minstens ${Math.round(WERK.hulpMinimum * 100)}%.`,
      ],
    },
    { kop: "De bak", tekst: `Elke ${WERK.interval} seconden komt er een werkorder bij, tot er ${WERK.wachtrij} klaarliggen, ook als het spel dicht is. Na het opleveren kies je zelf welke je als volgende doet.` },
    {
      kop: "Protocollen",
      punten: [
        `Na ${DREMPELS.slice(0, -1).join(", ")} en ${DREMPELS[DREMPELS.length - 1]} opgeleverde werkorders krijg je een nieuw protocol. Elk protocol geeft blijvend 2% extra productie, ook na het afstuderen.`,
        `Met meer protocollen komen grotere goten: ${Object.entries(MATEN).filter(([, m]) => m.vanafProtocollen).map(([n, m]) => `${n} bij ${n} vanaf ${m.vanafProtocollen} ${m.vanafProtocollen === 1 ? "protocol" : "protocollen"}`).join(", ")}.`,
      ],
    },
  ],

  render(root) {
    const p = kast();
    vulWachtrij();
    if (!p.huidig) neemOrder(0);
    root.innerHTML = `
      <div class="labo-kop">
        <h3>Patchkast</h3>
        ${INFO_KNOP}
        <span id="kast-stand"></span>
      </div>
      <p class="labo-uitleg">Trek een kabel tussen de twee aansluitingen met hetzelfde label. Kabels mogen elkaar niet kruisen. Een volle goot levert de helft meer op.</p>
      <div class="kast">
        <div class="kast-order" id="kast-order"></div>
        <div class="kast-bord" id="kast-bord"></div>
        <ul class="kast-legende" id="kast-legende" aria-label="Aan te sluiten"></ul>
        <p class="kast-status" id="kast-status"></p>
        <div class="kast-knoppen" id="kast-knoppen">
          <button type="button" class="kast-knop hoofd" id="kast-oplever"><span>Opleveren</span><small></small></button>
          <button type="button" class="kast-knop" id="kast-hulp"><span>Vraag Serge</span><small></small></button>
          <button type="button" class="kast-knop stil" id="kast-wis">Alles loshalen</button>
        </div>
        <div class="kast-resultaat" id="kast-resultaat" tabindex="-1" hidden></div>
        <section class="kast-bak" aria-labelledby="kast-bak-kop">
          <h4 id="kast-bak-kop">In de bak</h4>
          <ul class="kast-bonnen" id="kast-bonnen"></ul>
        </section>
      </div>
      <section class="kast-proto" aria-labelledby="kast-proto-kop">
        <div class="kast-proto-kop">
          <h4 id="kast-proto-kop">Protocollen</h4>
          <span id="kast-proto-stand"></span>
        </div>
        <ul class="kast-proto-lijst" id="kast-proto-lijst"></ul>
      </section>
      <p class="voor-schermlezers" id="kast-toetsen">Met de pijltjes ga je van vak naar vak. Enter pakt de kabel of aansluiting onder je op en legt hem weer neer; met de pijltjes trek je hem mee. Escape zet alles terug, Delete haalt de kabel onder je los.</p>`;

    koppelBord(root);
    root.querySelector("#kast-oplever").addEventListener("click", () => lever(root));
    root.querySelector("#kast-hulp").addEventListener("click", () => vraagHulp(root));
    root.querySelector("#kast-wis").addEventListener("click", () => {
      if (!werkbaar()) return;
      legger.wisAlles();
      naVerandering(root, 0);
      kondigAan("Alle kabels losgehaald.");
    });
    root.querySelector("#kast-bonnen").addEventListener("click", (e) => {
      const bon = e.target.closest("[data-bon]");
      if (bon) kiesBon(root, Number(bon.dataset.bon));
    });

    bakSleutel = "";
    protoSleutel = "";
    tekenOrder(root);
    tekenStaat(root);
  },

  // Elke seconde: de klok van de bak, en nieuwe orders die binnenkomen.
  update(root) {
    if (!root.querySelector("#kast-bord")) return;
    const p = kast();
    vulWachtrij();
    if (!p.huidig && neemOrder(0)) tekenOrder(root);
    // Een andere save geladen, of een import: het bord hoort niet meer bij de staat.
    if (p.huidig !== getekend && sleepId === null) tekenOrder(root);
    tekenStaat(root);
  },

  stop() {
    if (legger?.actief) {
      legger.los();
      bewaar();
    }
    sleepId = null;
  },
};
