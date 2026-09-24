// De bandbreedtemarkt: zes goederen met koersen die elke vijf seconden
// bewegen, ook als je naar iets anders kijkt.
//
// Je koopt voor een paar minuten productie, niet voor een deel van je bank.
// Zo groeit de markt mee met wat je netwerk doet, en wordt hij geen
// geldmachine voor wie veel heeft opgespaard. Nieuws beweegt de koersen meteen;
// geruchten doen dat later, en niet altijd. Een positie kan zichzelf verkopen
// bij een ingestelde winst of verliesgrens.
//
// Een positie is een aantal eenheden (`stuks`) met wat je ervoor betaalde
// (`inleg`). De gemiddelde aankoopkoers is dus inleg / stuks.

import { G, D, earn, unlock, spend } from "../state.js";
import { fmt, fmtPct } from "../format.js";
import { toast, blip, chord } from "../ui/fx.js";
import { emit } from "../bus.js";
import { esc } from "../html.js";
import { GOEDEREN, GOED_BY_ID, KOPPEN, MARKT } from "../data/market.js";
import { INFO_KNOP } from "./info.js";

// --------------------------------------------------------------- Staat

function markt() {
  const m = G.minigames.market;
  if (!m.prices) {
    m.prices = {};
    m.historie = {};
    for (const g of GOEDEREN) m.prices[g.id] = 90 + Math.random() * 30;
  }
  m.historie ||= {};
  for (const g of GOEDEREN) if (!m.historie[g.id]?.length) m.historie[g.id] = [m.prices[g.id]];
  m.holdings ||= {};
  m.trend ||= {};
  m.nieuws ||= [];
  m.geruchten ||= [];
  m.stats ||= { verkopen: 0, gewonnen: 0, besteWinst: 0 };
  return m;
}

const clamp = (v) => Math.min(MARKT.maxKoers, Math.max(MARKT.minKoers, v));

// Productie zonder tijdelijke buffs: een burst maakt je positie niet groter.
function basisPps() {
  return D.buffPps > 0 ? D.pps / D.buffPps : D.pps;
}

const perMinuut = () => basisPps() * 60;

export function limiet() {
  return Math.max(2000, perMinuut() * MARKT.limietMinuten * (D.marktLimiet || 1));
}

export function waardeVan(id) {
  const m = markt();
  const h = m.holdings[id];
  return h ? h.stuks * m.prices[id] : 0;
}

export function rendement(id) {
  const h = markt().holdings[id];
  return h && h.inleg > 0 ? waardeVan(id) / h.inleg - 1 : 0;
}

export function ruimte(id) {
  return Math.max(0, limiet() - waardeVan(id));
}

// Hoeveel een koopknop van zoveel minuten nu echt inzet.
export function inzetVoor(minuten, id) {
  return Math.floor(Math.min(Math.max(100, perMinuut() * minuten), ruimte(id), G.packets));
}

// Koers van een paar tikken geleden, voor de verandering in de lijst.
function koersVoor(id, tikken) {
  const reeks = markt().historie[id];
  return reeks[Math.max(0, reeks.length - 1 - tikken)];
}

// --------------------------------------------------------------- Nieuws

function bericht(kop, soort) {
  const m = markt();
  m.nieuws.unshift({ kop, soort, tijd: Date.now() });
  if (m.nieuws.length > 8) m.nieuws.length = 8;
}

function nieuwBericht() {
  const m = markt();
  // Niet twee geruchten tegelijk over hetzelfde goed.
  const bezet = new Set(m.geruchten.map((r) => KOPPEN[r.kop].goed));
  const kandidaten = KOPPEN.map((_, i) => i).filter((i) => !(KOPPEN[i].gerucht && bezet.has(KOPPEN[i].goed)));
  const kop = kandidaten[Math.floor(Math.random() * kandidaten.length)];
  const def = KOPPEN[kop];
  if (def.gerucht) {
    const [min, max] = MARKT.geruchtNa;
    m.geruchten.push({ kop, opTick: m.tick + min + Math.floor(Math.random() * (max - min + 1)), waar: Math.random() < MARKT.geruchtWaar });
    bericht(kop, "gerucht");
  } else {
    m.prices[def.goed] = clamp(m.prices[def.goed] * def.factor);
    bericht(kop, "nu");
  }
}

function besliesGeruchten() {
  const m = markt();
  const nog = [];
  for (const r of m.geruchten) {
    if (r.opTick > m.tick) {
      nog.push(r);
      continue;
    }
    const def = KOPPEN[r.kop];
    if (r.waar) m.prices[def.goed] = clamp(m.prices[def.goed] * def.factor);
    bericht(r.kop, r.waar ? "bevestigd" : "ontkend");
    // Wie kocht op een gerucht dat omhoog wees en uitkwam, had voorkennis.
    const h = m.holdings[def.goed];
    if (h && h.gerucht === r.kop) {
      if (r.waar && def.factor > 1) h.voorkennis = true;
      delete h.gerucht;
    }
  }
  m.geruchten = nog;
}

function nieuweTrend() {
  if (Math.random() < 0.4) return 0;
  const sterkte = 0.003 + Math.random() * (MARKT.trendMax - 0.003);
  return Math.random() < 0.5 ? sterkte : -sterkte;
}

// --------------------------------------------------------------- Tikken

let laatsteTik = Date.now();

export function tickMarkt() {
  const m = markt();
  m.tick = (m.tick || 0) + 1;
  laatsteTik = Date.now();
  besliesGeruchten();
  if (Math.random() < MARKT.nieuwsKans) nieuwBericht();

  for (const g of GOEDEREN) {
    if (m.trend[g.id] === undefined || Math.random() < MARKT.trendKans) m.trend[g.id] = nieuweTrend();
    const koers = m.prices[g.id];
    const ruis = (Math.random() + Math.random() + Math.random() - 1.5) * g.vol;
    m.prices[g.id] = clamp(koers * (1 + ruis + m.trend[g.id]) + (100 - koers) * MARKT.terugval);
    const reeks = m.historie[g.id];
    reeks.push(m.prices[g.id]);
    if (reeks.length > MARKT.historie) reeks.splice(0, reeks.length - MARKT.historie);
  }

  // Orders gaan ook af als je naar iets anders kijkt.
  for (const [id, h] of Object.entries(m.holdings)) {
    const r = rendement(id);
    if (h.winstBij && r >= h.winstBij) verkopen(id, 1, "winst");
    else if (h.verliesBij && r <= -h.verliesBij) verkopen(id, 1, "verlies");
  }
}

// ----------------------------------------------------------- Handelen

export function kopen(id, minuten) {
  const m = markt();
  const g = GOED_BY_ID[id];
  if (!g) return false;
  const bedrag = inzetVoor(minuten, id);
  if (bedrag < 1) {
    toast({
      title: "Kopen lukt niet",
      text: ruimte(id) < 1
        ? `Je hebt al een kwartier productie in ${g.naam}. Verkoop eerst iets.`
        : "Je hebt niet genoeg packets.",
      tone: "slecht",
    });
    return false;
  }
  if (!spend(bedrag)) return false;
  const koers = m.prices[id];
  const h = m.holdings[id] || (m.holdings[id] = { stuks: 0, inleg: 0 });
  h.stuks += bedrag / koers;
  h.inleg += bedrag;
  // Kopen terwijl er een gerucht over dit goed rondgaat: dat onthouden we.
  const gerucht = m.geruchten.find((r) => KOPPEN[r.kop].goed === id);
  if (gerucht) h.gerucht = gerucht.kop;
  blip(500, 0.05);
  emit("markt", { tekst: `Markt: ${fmt(bedrag)} in ${g.naam} gekocht op ${fmt(koers, { decimals: 1 })}`, toon: "" });
  return true;
}

// Verkoop een deel van een positie (1 = alles). Je inleg krijg je terug zonder
// dat hij als verdiend telt; alleen de winst gaat mee in je totaal, en dus in
// je studiepunten.
let sessieWinst = 0;

export function verkopen(id, deel = 1, reden = "hand") {
  const m = markt();
  const h = m.holdings[id];
  const g = GOED_BY_ID[id];
  if (!h || !g) return false;
  const aandeel = Math.min(1, Math.max(0, deel));
  const opbrengst = h.stuks * aandeel * m.prices[id];
  const kostprijs = h.inleg * aandeel;
  const winst = opbrengst - kostprijs;
  earn(Math.min(opbrengst, kostprijs), { lifetime: false });
  if (winst > 0) earn(winst);
  m.profit = (m.profit || 0) + winst;
  m.stats.verkopen++;

  const voorkennis = h.voorkennis;
  const rest = h.stuks * (1 - aandeel);
  if (aandeel >= 1 || rest * m.prices[id] < 1) delete m.holdings[id];
  else {
    h.stuks = rest;
    h.inleg *= 1 - aandeel;
  }

  if (winst > 0) {
    m.stats.gewonnen++;
    m.stats.besteWinst = Math.max(m.stats.besteWinst || 0, winst);
    sessieWinst += winst;
    unlock("beurs-winst");
    if (m.stats.gewonnen >= 10) unlock("beurs-tien");
    if (voorkennis) unlock("beurs-gerucht");
    if (sessieWinst > Math.max(1e4, perMinuut() * 60)) unlock("beurs-fortuin");
    chord([620, 820]);
  } else {
    blip(260, 0.1, 0.04);
  }
  if (reden !== "hand") unlock("beurs-automaat");

  const wat = reden === "winst" ? "Winstorder" : reden === "verlies" ? "Verliesgrens" : aandeel < 1 ? "Helft verkocht" : "Verkocht";
  const tekst = `${g.naam}: ${fmt(opbrengst)} terug, ${winst >= 0 ? "+" : ""}${fmt(winst)}.`;
  toast({ title: `${wat} ${winst >= 0 ? "met winst" : "met verlies"}`, text: tekst, icon: g.icon, tone: winst >= 0 ? "goed" : "slecht" });
  emit("markt", { tekst: `${wat}: ${tekst}`, toon: winst >= 0 ? "goed" : "slecht" });
  return true;
}

// Een automatische verkoop instellen; 0 zet hem uit, een andere waarde dan de
// vaste stappen wordt genegeerd.
export function zetOrder(id, soort, waarde) {
  const h = markt().holdings[id];
  if (!h) return;
  const [sleutel, toegestaan] = soort === "winst" ? ["winstBij", MARKT.winstOrders] : ["verliesBij", MARKT.verliesOrders];
  if (waarde === 0) delete h[sleutel];
  else if (toegestaan.includes(waarde)) h[sleutel] = waarde;
}

// ------------------------------------------------------------ Weergave

function punten(reeks, breedte, hoogte, min, max) {
  const span = Math.max(1e-9, max - min);
  const stap = breedte / Math.max(1, reeks.length - 1);
  return reeks.map((v, i) => `${(i * stap).toFixed(1)},${(3 + (1 - (v - min) / span) * (hoogte - 6)).toFixed(1)}`);
}

function miniGrafiek(id) {
  const reeks = markt().historie[id];
  if (reeks.length < 2) return "";
  const richting = reeks[reeks.length - 1] >= reeks[0] ? "op" : "neer";
  return `<svg class="beurs-mini" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
    <polyline class="${richting}" points="${punten(reeks, 100, 24, Math.min(...reeks), Math.max(...reeks)).join(" ")}" /></svg>`;
}

// De grote grafiek, met je gemiddelde aankoopkoers als stippellijn.
function groteGrafiek(root, id) {
  const m = markt();
  const reeks = m.historie[id];
  const h = m.holdings[id];
  const instap = h ? h.inleg / h.stuks : null;
  const min = Math.min(...reeks, instap ?? Infinity);
  const max = Math.max(...reeks, instap ?? -Infinity);
  const richting = reeks[reeks.length - 1] >= reeks[0] ? "op" : "neer";
  const lijn = reeks.length > 1 ? punten(reeks, 300, 120, min, max) : [];
  const y = (v) => 3 + (1 - (v - min) / Math.max(1e-9, max - min)) * 114;
  root.querySelector("#beurs-grafiek").innerHTML = lijn.length
    ? `<polygon class="vlak ${richting}" points="0,120 ${lijn.join(" ")} 300,120" />
       ${instap ? `<line class="instap" x1="0" x2="300" y1="${y(instap).toFixed(1)}" y2="${y(instap).toFixed(1)}" />` : ""}
       <polyline class="${richting}" points="${lijn.join(" ")}" />`
    : "";
  root.querySelector("#beurs-max").textContent = fmt(max, { decimals: 1 });
  root.querySelector("#beurs-min").textContent = fmt(min, { decimals: 1 });
  const label = root.querySelector("#beurs-instap");
  label.hidden = !instap;
  if (instap) {
    label.textContent = `instap ${fmt(instap, { decimals: 1 })}`;
    label.style.top = `${((y(instap) / 120) * 100).toFixed(1)}%`;
  }
}

function tijdVan(ms) {
  return new Date(ms).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" });
}

// Het label vóór een bericht: de richting, of wat er met een gerucht gebeurde.
function tagVan(item) {
  const def = KOPPEN[item.kop];
  const goed = GOED_BY_ID[def.goed];
  const richting = def.factor > 1 ? "op" : "neer";
  const pijl = def.factor > 1 ? "▲" : "▼";
  if (item.soort === "gerucht") return `<span class="beurs-tag gerucht">Gerucht · ${esc(goed.naam)}</span>`;
  if (item.soort === "ontkend") return `<span class="beurs-tag">Ontkend · ${esc(goed.naam)}</span>`;
  const woord = item.soort === "bevestigd" ? "Bevestigd" : `${pijl} ${fmtPct(Math.abs(def.factor - 1), 0)}`;
  return `<span class="beurs-tag ${richting}">${woord} · ${esc(goed.naam)}</span>`;
}

function berichtHtml(item) {
  return `${tagVan(item)} <span>${esc(KOPPEN[item.kop].tekst)}</span> <time>${tijdVan(item.tijd)}</time>`;
}

function verschilHtml(nu, toen) {
  const v = toen > 0 ? nu / toen - 1 : 0;
  if (Math.abs(v) < 0.0005) return `<span>0,0%</span>`;
  return `<span class="${v > 0 ? "op" : "neer"}">${v > 0 ? "▲" : "▼"} ${fmtPct(Math.abs(v), 1)}</span>`;
}

function zet(el, tekst) {
  if (el.textContent !== tekst) el.textContent = tekst;
}
const getekendHtml = new WeakMap();
function zetHtml(el, html) {
  if (getekendHtml.get(el) !== html) {
    getekendHtml.set(el, html);
    el.innerHTML = html;
  }
}

// Een koers licht even op als hij verandert: het enige bewegende moment.
function flits(el, richting) {
  if (!G.options.motion || !richting) return;
  el.classList.remove("flits-op", "flits-neer");
  void el.offsetWidth;
  el.classList.add(`flits-${richting}`);
}

let gekozen = GOEDEREN[0].id;
let getekendeTik = -1;
let getekendeKoersen = {};

export const market = {
  id: "market",
  name: "Markt",
  icon: "📈",
  eis: "Vraagt een serverrack",
  unlocked: () => (G.buildings.rack || 0) >= 1,
  info: [
    { kop: "Wat is het", tekst: `Zes goederen met koersen die elke ${MARKT.tikMs / 1000} seconden bewegen, ook als je naar iets anders kijkt. Koop laag, verkoop hoog.` },
    {
      kop: "Kopen en verkopen",
      punten: [
        "Kies een goed in de lijst; eronder zie je zijn grafiek en je positie.",
        `Je koopt voor ${MARKT.koopMinuten.join(", ").replace(/, (?=[^,]*$)/, " of ")} minuten van je productie. Per goed zet je hooguit ${MARKT.limietMinuten} minuten productie in.`,
        "Verkopen kan voor de helft of voor alles.",
        "Alleen je winst telt mee als verdiend, en dus voor je studiepunten. Je inleg krijg je gewoon terug.",
      ],
    },
    {
      kop: "Nieuws en geruchten",
      punten: [
        "Nieuws duwt een koers meteen omhoog of omlaag.",
        `Een gerucht werkt pas later: na ${MARKT.geruchtNa.map((n) => (n * MARKT.tikMs) / 1000).join(" tot ")} seconden blijkt of het klopt, en dat doet het ${Math.round(MARKT.geruchtWaar * 10)} op de 10 keer.`,
        "Elk goed heeft ook een trend die af en toe omslaat, en elke koers trekt langzaam terug naar 100.",
      ],
    },
    { kop: "Vanzelf verkopen", tekst: `Na een aankoop kun je een positie vanzelf laten verkopen bij ${MARKT.winstOrders.map((w) => `+${Math.round(w * 100)}%`).join(", ")} winst, of bij ${MARKT.verliesOrders.map((w) => `−${Math.round(w * 100)}%`).join(" of ")} verlies. Dat gebeurt ook als je naar een ander tabblad kijkt, zolang het spel openstaat.` },
  ],

  render(root) {
    markt();
    if (!GOED_BY_ID[gekozen]) gekozen = GOEDEREN[0].id;
    root.innerHTML = `
      <div class="labo-kop">
        <h3>Bandbreedtemarkt</h3>
        ${INFO_KNOP}
        <span id="beurs-klok"></span>
      </div>
      <div class="beurs">
        <p class="beurs-status" id="beurs-status"></p>
        <p class="beurs-nieuws" id="beurs-nieuws" aria-live="polite"></p>

        <div class="beurs-bord" role="group" aria-label="Koersen">
          <div class="beurs-bordkop" aria-hidden="true">
            <span>Goed</span><span>5 min</span><span>Koers</span><span>1 min</span><span>Positie</span>
          </div>
          ${GOEDEREN.map((g) => `
            <button type="button" class="beurs-rij" data-goed="${g.id}" aria-pressed="false">
              <span class="beurs-naam"><span aria-hidden="true">${g.icon}</span> ${esc(g.naam)}</span>
              <span class="beurs-mini-vak"></span>
              <span class="beurs-koers"></span>
              <span class="beurs-delta"></span>
              <span class="beurs-positie"></span>
            </button>`).join("")}
        </div>

        <section class="beurs-detail" aria-labelledby="beurs-detailnaam">
          <div class="beurs-detailkop">
            <h4 id="beurs-detailnaam"></h4>
            <span class="beurs-grootkoers" id="beurs-grootkoers"></span>
            <span class="beurs-delta" id="beurs-grootdelta"></span>
          </div>
          <p class="beurs-profiel" id="beurs-profiel"></p>
          <div class="beurs-grafiekvak">
            <svg class="beurs-grafiek" id="beurs-grafiek" viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden="true"></svg>
            <span class="beurs-as boven" id="beurs-max"></span>
            <span class="beurs-as onder" id="beurs-min"></span>
            <span class="beurs-instap" id="beurs-instap" hidden></span>
          </div>
          <p class="beurs-positieregel" id="beurs-positieregel"></p>
          <div class="beurs-order">
            <div class="beurs-orderregel">
              <span class="beurs-label">Kopen, in minuten productie</span>
              <div class="beurs-knoppen">
                ${MARKT.koopMinuten.map((min) => `<button type="button" class="beurs-knop koop" data-koop="${min}"><span>${min} min</span><small></small></button>`).join("")}
              </div>
            </div>
            <div class="beurs-orderregel">
              <span class="beurs-label">Verkopen</span>
              <div class="beurs-knoppen">
                <button type="button" class="beurs-knop" data-verkoop="0.5">De helft</button>
                <button type="button" class="beurs-knop" data-verkoop="1">Alles</button>
              </div>
            </div>
            <div class="beurs-orderregel">
              <span class="beurs-label" id="beurs-label-winst">Vanzelf verkopen bij winst</span>
              <div class="segmented beurs-seg" role="group" aria-labelledby="beurs-label-winst" data-order="winst">
                <button type="button" data-waarde="0">uit</button>
                ${MARKT.winstOrders.map((w) => `<button type="button" data-waarde="${w}">+${Math.round(w * 100)}%</button>`).join("")}
              </div>
            </div>
            <div class="beurs-orderregel">
              <span class="beurs-label" id="beurs-label-verlies">en bij verlies</span>
              <div class="segmented beurs-seg" role="group" aria-labelledby="beurs-label-verlies" data-order="verlies">
                <button type="button" data-waarde="0">uit</button>
                ${MARKT.verliesOrders.map((w) => `<button type="button" data-waarde="${w}">−${Math.round(w * 100)}%</button>`).join("")}
              </div>
            </div>
          </div>
          <p class="beurs-hint" id="beurs-hint"></p>
        </section>

        <div class="beurs-archiefvak">
          <h4 class="beurs-archiefkop">Nieuws</h4>
          <ol class="beurs-archief" id="beurs-archief"></ol>
        </div>
      </div>`;

    root.querySelector(".beurs-bord").addEventListener("click", (e) => {
      const rij = e.target.closest("[data-goed]");
      if (!rij) return;
      gekozen = rij.dataset.goed;
      this.update(root, true);
    });
    root.querySelector(".beurs-order").addEventListener("click", (e) => {
      const knop = e.target.closest("button");
      if (!knop || knop.disabled) return;
      if (knop.dataset.koop) kopen(gekozen, Number(knop.dataset.koop));
      else if (knop.dataset.verkoop) verkopen(gekozen, Number(knop.dataset.verkoop));
      else if (knop.dataset.waarde !== undefined) zetOrder(gekozen, knop.closest("[data-order]").dataset.order, Number(knop.dataset.waarde));
      this.update(root, true);
    });
    getekendeTik = -1;
    getekendeKoersen = {};
    this.update(root, true);
  },

  // Elke seconde: klok, status en knoppen. Koersen en grafieken alleen als de
  // markt een tik verder is, of als je een ander goed kiest.
  update(root, alles = false) {
    const bord = root.querySelector(".beurs-bord");
    if (!bord) return;
    const m = markt();
    const nieuweTik = m.tick !== getekendeTik;
    getekendeTik = m.tick;

    const over = Math.max(0, Math.ceil((laatsteTik + MARKT.tikMs - Date.now()) / 1000));
    zet(root.querySelector("#beurs-klok"), `nieuwe koersen over ${over} s`);

    // Status: wat je portefeuille waard is, en wat je al binnenhaalde.
    const posities = Object.keys(m.holdings);
    const waarde = posities.reduce((som, id) => som + waardeVan(id), 0);
    const inleg = posities.reduce((som, id) => som + m.holdings[id].inleg, 0);
    const gerealiseerd = m.profit || 0;
    const winstHtml = `gerealiseerd <strong class="${gerealiseerd < 0 ? "neer" : ""}">${gerealiseerd >= 0 ? "+" : ""}${fmt(gerealiseerd)}</strong>`;
    zetHtml(root.querySelector("#beurs-status"), posities.length
      ? `Portefeuille <strong>${fmt(waarde)}</strong> ${verschilHtml(waarde, inleg)} · ${winstHtml}`
      : `Nog niets belegd. Per goed zet je hooguit een kwartier productie in. · ${winstHtml}`);

    const laatste = m.nieuws[0];
    zetHtml(root.querySelector("#beurs-nieuws"), laatste ? berichtHtml(laatste) : "Nog geen nieuws. De markt is rustig.");

    // De koerslijst.
    for (const rij of bord.querySelectorAll(".beurs-rij")) {
      const id = rij.dataset.goed;
      const koers = m.prices[id];
      rij.setAttribute("aria-pressed", String(id === gekozen));
      if (alles || nieuweTik) {
        const koersEl = rij.querySelector(".beurs-koers");
        zet(koersEl, fmt(koers, { decimals: 1 }));
        const vorige = getekendeKoersen[id];
        if (vorige !== undefined && koers !== vorige) flits(koersEl, koers > vorige ? "op" : "neer");
        getekendeKoersen[id] = koers;
        zetHtml(rij.querySelector(".beurs-delta"), verschilHtml(koers, koersVoor(id, 12)));
        zetHtml(rij.querySelector(".beurs-mini-vak"), miniGrafiek(id));
      }
      const h = m.holdings[id];
      const r = rendement(id);
      zetHtml(rij.querySelector(".beurs-positie"), h
        ? `<span class="${r >= 0 ? "op" : "neer"}">${r >= 0 ? "+" : "−"}${fmtPct(Math.abs(r), 0)}</span>`
        : "");
    }

    // Het gekozen goed.
    const g = GOED_BY_ID[gekozen];
    const koers = m.prices[gekozen];
    const h = m.holdings[gekozen];
    zetHtml(root.querySelector("#beurs-detailnaam"), `<span aria-hidden="true">${g.icon}</span> ${esc(g.naam)}`);
    const groot = root.querySelector("#beurs-grootkoers");
    const vorigeGroot = Number(groot.dataset.koers);
    zet(groot, fmt(koers, { decimals: 1 }));
    if (nieuweTik && groot.dataset.koers && koers !== vorigeGroot) flits(groot, koers > vorigeGroot ? "op" : "neer");
    groot.dataset.koers = String(koers);
    zetHtml(root.querySelector("#beurs-grootdelta"), verschilHtml(koers, koersVoor(gekozen, 12)));
    zet(root.querySelector("#beurs-profiel"), g.profiel);
    if (alles || nieuweTik) groteGrafiek(root, gekozen);

    zet(root.querySelector("#beurs-positieregel"), h
      ? `Je hebt ${fmt(waardeVan(gekozen))} aan ${g.naam}, gekocht op gemiddeld ${fmt(h.inleg / h.stuks, { decimals: 1 })}. Ingelegd: ${fmt(h.inleg)}, dat is ${rendement(gekozen) >= 0 ? "+" : "−"}${fmtPct(Math.abs(rendement(gekozen)), 1)}.`
      : `Je hebt nog geen ${g.naam}.`);

    for (const knop of root.querySelectorAll("[data-koop]")) {
      const bedrag = inzetVoor(Number(knop.dataset.koop), gekozen);
      knop.disabled = bedrag < 1;
      zet(knop.querySelector("small"), bedrag >= 1 ? fmt(bedrag) : "geen ruimte");
      knop.setAttribute("aria-label", bedrag >= 1
        ? `Koop ${g.naam} voor ${knop.dataset.koop} minuten productie: ${fmt(bedrag)} packets`
        : `Koop ${g.naam}: geen ruimte meer`);
    }
    for (const knop of root.querySelectorAll("[data-verkoop]")) knop.disabled = !h;
    for (const groep of root.querySelectorAll("[data-order]")) {
      const huidig = h ? (groep.dataset.order === "winst" ? h.winstBij : h.verliesBij) || 0 : 0;
      for (const knop of groep.querySelectorAll("button")) {
        const aan = Number(knop.dataset.waarde) === huidig;
        knop.disabled = !h;
        knop.classList.toggle("on", aan && !!h);
        knop.setAttribute("aria-pressed", String(aan && !!h));
      }
    }

    let hint;
    if (!h) hint = "Kies een goed in de lijst en koop voor een paar minuten productie. Na de aankoop kun je automatische verkooporders instellen.";
    else {
      const minuten = ruimte(gekozen) / Math.max(1e-9, perMinuut());
      const orders = [h.winstBij && `bij +${Math.round(h.winstBij * 100)}%`, h.verliesBij && `bij −${Math.round(h.verliesBij * 100)}%`].filter(Boolean);
      hint = `${minuten >= 1 ? `Nog ruimte voor ${fmt(Math.floor(minuten))} min productie in ${g.naam}.` : "Je zit aan het maximum van een kwartier productie."}${orders.length ? ` Verkoopt vanzelf ${orders.join(" of ")}.` : ""}`;
    }
    zet(root.querySelector("#beurs-hint"), hint);

    // Het nieuws van de laatste minuten.
    zetHtml(root.querySelector("#beurs-archief"), m.nieuws.length
      ? m.nieuws.map((item) => `<li>${berichtHtml(item)}</li>`).join("")
      : `<li class="leeg">Nog geen nieuws.</li>`);
  },
};

export function startMarkt() {
  markt();
  setInterval(tickMarkt, MARKT.tikMs);
}
