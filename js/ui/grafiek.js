// De doorvoergrafiek: je productie van de afgelopen minuten, zoals elke
// monitoringpagina hem tekent. Hoe hij getekend wordt, kies je onder
// Uiterlijk: een lijn, staafjes, kaarsjes, een hartslag of een sterrenbeeld.
//
// Bij het afstuderen wordt de grafiek bewust niet leeggemaakt: de terugval
// naar nul hoort er gewoon in te staan.

import { G, D } from "../state.js";
import { fmt } from "../format.js";

const VENSTER = 120; // seconden geschiedenis
const BREEDTE = 300;
const HOOGTE = 100;

const monsters = [];
let laatsteMeting = 0;
let metingen = 0; // zodat de hartslag mee naar links schuift

export function meet(nu = Date.now()) {
  if (nu - laatsteMeting < 1000) return false;
  laatsteMeting = nu;
  // De eerste meting vult het hele venster, anders staat er minutenlang een
  // bijna leeg vlak. Daarna schuift er per seconde één meting in.
  if (!monsters.length) for (let i = 0; i < VENSTER; i++) monsters.push(D.pps);
  monsters.push(D.pps);
  metingen++;
  if (monsters.length > VENSTER) monsters.shift();
  return true;
}

// Een oscilloscoop en een schrift hebben ook verticale lijnen.
function rooster(stijl) {
  const lijnen = [];
  for (let i = 1; i < 4; i++) {
    const y = (HOOGTE / 4) * i;
    lijnen.push(`<line class="grafiek-rooster" x1="0" y1="${y}" x2="${BREEDTE}" y2="${y}" />`);
  }
  if (stijl === "oscilloscoop" || stijl === "ruitjes") {
    for (let i = 1; i < 10; i++) {
      const x = (BREEDTE / 10) * i;
      lijnen.push(`<line class="grafiek-rooster" x1="${x}" y1="0" x2="${x}" y2="${HOOGTE}" />`);
    }
  }
  return lijnen.join("");
}

// Kleurverlopen voor de stijlen die ze nodig hebben. Er is maar één grafiek,
// dus de id's zijn uniek; een voorbeeldje in het menu gebruikt dezelfde.
const VERLOPEN = {
  regenboog: `<linearGradient id="grafiekRegenboog" gradientUnits="userSpaceOnUse" x1="0" x2="300" y1="0" y2="0"><stop offset="0" stop-color="#ef4444"/><stop offset=".2" stop-color="#f97316"/><stop offset=".4" stop-color="#facc15"/><stop offset=".6" stop-color="#22c55e"/><stop offset=".8" stop-color="#3b82f6"/><stop offset="1" stop-color="#a855f7"/></linearGradient>`,
  vuur: `<linearGradient id="grafiekVuur" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="100"><stop offset="0" stop-color="#fde047"/><stop offset=".45" stop-color="#f97316"/><stop offset="1" stop-color="#b91c1c" stop-opacity=".25"/></linearGradient>`,
  bergen: `<linearGradient id="grafiekBergen" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="100"><stop offset="0" stop-color="#f8fafc"/><stop offset=".22" stop-color="#e2e8f0"/><stop offset=".3" stop-color="#78716c"/><stop offset=".55" stop-color="#4d7c0f"/><stop offset="1" stop-color="#14532d"/></linearGradient>`,
  aquarium: `<linearGradient id="grafiekWater" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="100"><stop offset="0" stop-color="#7dd3fc"/><stop offset="1" stop-color="#0369a1"/></linearGradient>`,
  hemels: `<linearGradient id="grafiekGoud" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="100"><stop offset="0" stop-color="#fef3c7"/><stop offset=".5" stop-color="#fbbf24" stop-opacity=".7"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></linearGradient>`,
};

// Het hart van een hartmonitor: een tik omhoog, diep omlaag en terug, elke
// twintig seconden. Het staat bovenop je echte productie.
const HARTSLAG = [0, 0.06, -0.04, 0.42, -0.26, 0.08, 0];

const y = (v, top) => HOOGTE - (v / top) * HOOGTE;

// Tekent de reeks in de gekozen stijl. Geeft de binnenkant van de SVG.
function tekening(reeks, stijl, verschuiving = 0) {
  const piek = Math.max(...reeks);
  const top = Math.max(piek * 1.12, 0.0001);
  const stap = BREEDTE / (VENSTER - 1);
  const start = BREEDTE - (reeks.length - 1) * stap;
  const x = (i) => start + i * stap;
  const defs = VERLOPEN[stijl] ? `<defs>${VERLOPEN[stijl]}</defs>` : "";

  if (stijl === "staven") {
    const breed = stap * 4 - 2;
    const staven = [];
    for (let i = reeks.length - 1; i >= 0; i -= 4) {
      const h = (reeks[i] / top) * HOOGTE;
      staven.push(`<rect class="grafiek-staaf" x="${(x(i) - breed).toFixed(1)}" y="${(HOOGTE - h).toFixed(1)}" width="${breed.toFixed(1)}" height="${Math.max(1, h).toFixed(1)}" rx="1.5" />`);
    }
    return rooster(stijl) + staven.join("");
  }

  if (stijl === "pixel") {
    // Trapjes: de lijn springt per blok van zes seconden, op een raster van
    // acht hoog, zoals op een scherm met grote pixels.
    const blok = 6;
    let pad = "";
    for (let s = 0; s < reeks.length; s += blok) {
      const deel = reeks.slice(s, s + blok);
      const gem = deel.reduce((a, b) => a + b, 0) / deel.length;
      const py = Math.min(HOOGTE - 4, Math.round(y(gem, top) / 8) * 8 + 4);
      const x1 = x(s);
      const x2 = x(Math.min(reeks.length - 1, s + blok));
      pad += `${pad ? "L" : "M"}${x1.toFixed(1)} ${py}H${x2.toFixed(1)}`;
    }
    return `${rooster(stijl)}<path class="grafiek-lijn pixel" d="${pad}" />`;
  }

  if (stijl === "beurs") {
    const groep = 6;
    const kaarsen = [];
    for (let s = 0; s + groep <= reeks.length; s += groep) {
      const deel = reeks.slice(s, s + groep);
      const open = deel[0];
      const dicht = deel[deel.length - 1];
      const midden = x(s + groep / 2);
      const boven = y(Math.max(open, dicht), top);
      const hoogte = Math.max(2, Math.abs(y(open, top) - y(dicht, top)));
      const soort = dicht >= open ? "stijgt" : "daalt";
      kaarsen.push(
        `<line class="grafiek-lont ${soort}" x1="${midden.toFixed(1)}" y1="${y(Math.max(...deel), top).toFixed(1)}" x2="${midden.toFixed(1)}" y2="${(y(Math.min(...deel), top) + 1).toFixed(1)}" />` +
          `<rect class="grafiek-kaars ${soort}" x="${(midden - stap * 2).toFixed(1)}" y="${boven.toFixed(1)}" width="${(stap * 4).toFixed(1)}" height="${hoogte.toFixed(1)}" />`
      );
    }
    return rooster(stijl) + kaarsen.join("");
  }

  if (stijl === "sterren") {
    // Vaste achtergrondsterretjes, en elke acht seconden een ster op je lijn.
    const achtergrond = Array.from({ length: 22 }, (_, i) =>
      `<circle class="grafiek-hemel" cx="${(i * 137.5) % BREEDTE}" cy="${(i * 61.8) % HOOGTE}" r="${0.6 + (i % 3) * 0.3}" />`
    ).join("");
    const punten = [];
    for (let i = reeks.length - 1; i >= 0; i -= 8) punten.push([x(i), y(reeks[i], top) * 0.85 + 8]);
    const lijn = punten.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
    const sterren = punten.map(([px, py], i) => `<circle class="grafiek-ster" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${i === 0 ? 3.4 : 2.2}" />`).join("");
    return achtergrond + `<polyline class="grafiek-lijn" points="${lijn}" />` + sterren;
  }

  let punten;
  if (stijl === "hartmonitor") {
    // De data onderaan, zodat de tikken erboven passen.
    punten = reeks.map((v, i) => {
      const slag = HARTSLAG[(i + verschuiving) % 20] || 0;
      return [x(i), HOOGTE * 0.9 - (v / top) * HOOGTE * 0.45 - slag * HOOGTE];
    });
  } else {
    punten = reeks.map((v, i) => [x(i), y(v, top)]);
  }
  const lijn = punten.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
  const laatste = punten[punten.length - 1];
  const vlak = stijl === "hartmonitor" ? "" : `<polygon class="grafiek-vlakje" points="${start.toFixed(1)},${HOOGTE} ${lijn} ${BREEDTE},${HOOGTE}" />`;
  const punt = stijl === "hartmonitor" || stijl === "oscilloscoop" ? `<circle class="grafiek-punt" cx="${laatste[0].toFixed(1)}" cy="${laatste[1].toFixed(1)}" r="3" />` : "";
  return `${defs}${rooster(stijl)}${vlak}<polyline class="grafiek-lijn" points="${lijn}" />${punt}`;
}

export function tekenGrafiek(svg, nuEl, piekEl, gemEl) {
  const stijl = G.uiterlijk?.grafiek || "standaard";
  if (monsters.length < 2) {
    svg.innerHTML = rooster(stijl);
    nuEl.textContent = `${fmt(D.pps)} p/s`;
    piekEl.textContent = "meten…";
    gemEl.textContent = "";
    return;
  }
  const piek = Math.max(...monsters);
  const gemiddeld = monsters.reduce((a, b) => a + b, 0) / monsters.length;
  svg.innerHTML = tekening(monsters, stijl, metingen);
  nuEl.textContent = `${fmt(D.pps)} p/s`;
  piekEl.textContent = `piek ${fmt(piek)}`;
  gemEl.textContent = `gemiddeld ${fmt(gemiddeld)}`;
}

// Voor het voorbeeldje in het menu: een verzonnen reeks die trapsgewijs stijgt,
// zoals een netwerk waar je af en toe iets bij koopt.
const VOORBEELD = Array.from({ length: VENSTER }, (_, i) => 20 + Math.floor(i / 17) * 11 + (i % 17) * 0.4);
export function grafiekVoorbeeld(stijl) {
  return `<svg viewBox="0 0 ${BREEDTE} ${HOOGTE}" preserveAspectRatio="none" aria-hidden="true" focusable="false">${tekening(VOORBEELD, stijl)}</svg>`;
}
