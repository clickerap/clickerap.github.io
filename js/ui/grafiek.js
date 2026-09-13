// De doorvoergrafiek: je productie van de afgelopen minuten, zoals elke
// monitoringpagina hem tekent. Eén lijn, een vlak eronder, geen beweging.

import { D } from "../state.js";
import { fmt } from "../format.js";

const VENSTER = 120; // seconden geschiedenis
const BREEDTE = 300;
const HOOGTE = 100;

const monsters = [];
let laatsteMeting = 0;

export function meet(nu = Date.now()) {
  if (nu - laatsteMeting < 1000) return false;
  laatsteMeting = nu;
  // De eerste meting vult het hele venster, anders staat er minutenlang een
  // bijna leeg vlak. Daarna schuift er per seconde één meting in.
  if (!monsters.length) for (let i = 0; i < VENSTER; i++) monsters.push(D.pps);
  monsters.push(D.pps);
  if (monsters.length > VENSTER) monsters.shift();
  return true;
}

function rooster(top) {
  const lijnen = [];
  for (let i = 1; i < 4; i++) {
    const y = (HOOGTE / 4) * i;
    lijnen.push(`<line class="grafiek-rooster" x1="0" y1="${y}" x2="${BREEDTE}" y2="${y}" />`);
  }
  void top;
  return lijnen.join("");
}

export function tekenGrafiek(svg, nuEl, piekEl, gemEl) {
  if (monsters.length < 2) {
    svg.innerHTML = rooster(1);
    nuEl.textContent = `${fmt(D.pps)} p/s`;
    piekEl.textContent = "meten…";
    gemEl.textContent = "";
    return;
  }

  const piek = Math.max(...monsters);
  const gemiddeld = monsters.reduce((a, b) => a + b, 0) / monsters.length;
  const top = Math.max(piek * 1.12, 0.0001);

  // De lijn loopt altijd tot de rechterrand, ook als het venster nog niet vol is.
  const stap = BREEDTE / (VENSTER - 1);
  const start = BREEDTE - (monsters.length - 1) * stap;
  const punten = monsters.map((v, i) => `${(start + i * stap).toFixed(1)},${(HOOGTE - (v / top) * HOOGTE).toFixed(1)}`);

  svg.innerHTML = `
    ${rooster(top)}
    <polygon class="grafiek-vlakje" points="${start.toFixed(1)},${HOOGTE} ${punten.join(" ")} ${BREEDTE},${HOOGTE}" />
    <polyline class="grafiek-lijn" points="${punten.join(" ")}" />`;

  nuEl.textContent = `${fmt(D.pps)} p/s`;
  piekEl.textContent = `piek ${fmt(piek)}`;
  gemEl.textContent = `gemiddeld ${fmt(gemiddeld)}`;
}

// Bewust niet aangeroepen bij het afstuderen: de terugval naar nul hoort
// gewoon in de grafiek te staan.
export function resetGrafiek() {
  monsters.length = 0;
  laatsteMeting = 0;
}
