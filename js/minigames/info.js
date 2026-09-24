// De knop "Hoe werkt het?" naast de titel van elke opdracht in het labo.
//
// Een opdracht zet INFO_KNOP in zijn kop en geeft zijn uitleg mee als `info`:
// een lijst blokken met een kop en tekst of een lijst punten; wat tussen
// `backticks` staat, is iets om letterlijk te typen. Het labo zelf
// (index.js) vangt de klik op en opent het venster, ook als de opdracht
// zichzelf intussen opnieuw heeft opgebouwd.

import { esc } from "../html.js";

export const INFO_KNOP = `<button type="button" class="labo-info" data-info aria-haspopup="dialog">Hoe werkt het?</button>`;

const tekst = (t) => esc(t).replace(/`([^`]+)`/g, "<code>$1</code>");

export function infoHtml(blokken) {
  return `<div class="labo-infotekst">${blokken.map((b) => `
    <section>
      <h3>${esc(b.kop)}</h3>
      ${b.tekst ? `<p>${tekst(b.tekst)}</p>` : ""}
      ${b.punten ? `<ul>${b.punten.map((p) => `<li>${tekst(p)}</li>`).join("")}</ul>` : ""}
    </section>`).join("")}</div>`;
}
