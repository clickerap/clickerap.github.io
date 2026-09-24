// De cursus. Geen spel, maar de theorie waar de rest van het labo op leunt:
// lees een hoofdstuk, snap de overhoring, snap de terminal.
//
// De beloning komt pas onderaan het hoofdstuk, en de knop daarvoor gaat pas
// open na een minimale leestijd. Doorklikken levert dus niets meer op.

import { G, D, earn, unlock } from "../state.js";
import { fmt } from "../format.js";
import { toast, chord } from "../ui/fx.js";
import { HOOFDSTUKKEN, HOOFDSTUK_BY_ID } from "../data/cursus.js";
import { esc } from "../html.js";
import { INFO_KNOP } from "./info.js";

// Snel lezen is zo'n acht woorden per seconde. Korter dan dat telt niet.
const WOORDEN_PER_SECONDE = 8;
const MIN_LEESTIJD = 8;
const MAX_LEESTIJD = 45;

function staat() {
  const c = G.minigames.cursus || (G.minigames.cursus = { gelezen: {}, open: null });
  if (!c.gelezen) c.gelezen = {};
  return c;
}

function blokHtml(blok) {
  switch (blok.t) {
    case "p":
      return `<p class="cursus-p">${esc(blok.tekst)}</p>`;
    case "lijst":
      return `<ul class="cursus-lijst">${blok.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
    case "code":
      return `<pre class="cursus-code">${blok.regels.map(esc).join("\n")}</pre>`;
    case "serge":
      return `<p class="cursus-serge"><strong>Serge zegt:</strong> ${esc(blok.tekst)}</p>`;
    case "tabel":
      return `<div class="cursus-tabelvak"><table class="cursus-tabel">
        <thead><tr>${blok.kop.map((k) => `<th>${esc(k)}</th>`).join("")}</tr></thead>
        <tbody>${blok.rijen.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></div>`;
    default:
      return "";
  }
}

function woordenIn(hoofdstuk) {
  const teksten = hoofdstuk.inhoud.flatMap((b) => [b.tekst, ...(b.items || []), ...(b.regels || []), ...(b.kop || []), ...(b.rijen || []).flat()]);
  return teksten.filter(Boolean).join(" ").split(/\s+/).length;
}

export function leestijd(hoofdstuk) {
  return Math.min(MAX_LEESTIJD, Math.max(MIN_LEESTIJD, Math.round(woordenIn(hoofdstuk) / WOORDEN_PER_SECONDE)));
}

function beloning() {
  return Math.max(1000, D.pps * 30) * D.minigameReward;
}

function markeerGelezen(c, id) {
  if (c.gelezen[id]) return null;
  c.gelezen[id] = true;
  const winst = beloning();
  earn(winst);
  unlock("cursus-1");
  if (HOOFDSTUKKEN.every((h) => c.gelezen[h.id])) unlock("cursus-alles");
  chord([560, 740]);
  toast({
    title: "Hoofdstuk gelezen",
    text: `${fmt(winst)} packets. Serge vindt lezen ook werk.`,
    icon: "📚",
    tone: "goed",
  });
  return winst;
}

// Wanneer het open hoofdstuk geopend werd; de leestijd telt vanaf dan.
let geopend = { id: null, sinds: 0 };

export const cursus = {
  id: "cursus",
  name: "Cursus",
  icon: "📚",
  eis: "Altijd open",
  unlocked: () => true,
  info: [
    { kop: "Wat is het", tekst: "Korte hoofdstukken over de basis van netwerken, om tussendoor te lezen. Ze leggen uit wat de overhoring vraagt en wat je in de terminal typt." },
    {
      kop: "Wat levert het op",
      punten: [
        `Lees je een hoofdstuk voor het eerst uit, dan krijg je een halve minuut van je productie, en minstens 1.000 packets.`,
        `De knop onderaan gaat pas open na een korte leestijd: ${MIN_LEESTIJD} tot ${MAX_LEESTIJD} seconden, naargelang de lengte. Doorklikken levert dus niets op.`,
        "Opnieuw lezen mag altijd, maar elk hoofdstuk betaalt maar één keer.",
      ],
    },
  ],

  render(root) {
    const c = staat();
    const gelezen = HOOFDSTUKKEN.filter((h) => c.gelezen[h.id]).length;

    if (!c.open || !HOOFDSTUK_BY_ID[c.open]) {
      root.innerHTML = `
        <div class="labo-kop">
          <h3>Cursus</h3>
          ${INFO_KNOP}
          <span>${gelezen} van de ${HOOFDSTUKKEN.length} gelezen</span>
        </div>
        <p class="labo-uitleg">De basis van netwerken, in stukjes die je tussendoor leest. Elk hoofdstuk dat je voor het eerst uitleest levert packets op — en helpt bij de overhoring hiernaast.</p>
        <div class="cursus-index">
          ${HOOFDSTUKKEN.map((h, i) => `
            <button type="button" class="cursus-item${c.gelezen[h.id] ? " gelezen" : ""}" data-open="${h.id}">
              <span class="cursus-nr">${i + 1}</span>
              <span class="cursus-tekst">
                <strong>${h.icoon} ${esc(h.titel)}</strong>
                <span>${esc(h.korte)}</span>
              </span>
              <span class="cursus-vink" aria-label="${c.gelezen[h.id] ? "gelezen" : ""}">${c.gelezen[h.id] ? "✓" : ""}</span>
            </button>`).join("")}
        </div>`;

      root.querySelectorAll("[data-open]").forEach((knop) => {
        knop.addEventListener("click", () => {
          c.open = knop.dataset.open;
          this.render(root);
        });
      });
      return;
    }

    const h = HOOFDSTUK_BY_ID[c.open];
    const index = HOOFDSTUKKEN.indexOf(h);
    const vorige = HOOFDSTUKKEN[index - 1];
    const volgende = HOOFDSTUKKEN[index + 1];
    if (geopend.id !== h.id) geopend = { id: h.id, sinds: Date.now() };

    root.innerHTML = `
      <div class="labo-kop">
        <h3>${h.icoon} ${esc(h.titel)}</h3>
        ${INFO_KNOP}
        <span>hoofdstuk ${index + 1} van ${HOOFDSTUKKEN.length}</span>
      </div>
      <button type="button" class="btn ghost small" id="cursus-terug" style="align-self:flex-start">← Alle hoofdstukken</button>
      <article class="cursus-blad">${h.inhoud.map(blokHtml).join("")}</article>
      <button type="button" class="btn groen" id="cursus-gelezen"></button>
      <div class="knoprij" style="justify-content:space-between">
        ${vorige ? `<button type="button" class="btn ghost small" data-ga="${vorige.id}">← ${esc(vorige.titel)}</button>` : "<span></span>"}
        ${volgende ? `<button type="button" class="btn small" data-ga="${volgende.id}">${esc(volgende.titel)} →</button>` : "<span></span>"}
      </div>`;

    root.querySelector("#cursus-terug").addEventListener("click", () => {
      c.open = null;
      this.render(root);
    });
    root.querySelector("#cursus-gelezen").addEventListener("click", () => {
      if (markeerGelezen(c, h.id) !== null) this.update(root);
    });
    root.querySelectorAll("[data-ga]").forEach((knop) => {
      knop.addEventListener("click", () => {
        c.open = knop.dataset.ga;
        this.render(root);
        root.closest(".tabpanels")?.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
    this.update(root);
  },

  // Houdt de knop onderaan bij: dicht tijdens de leestijd, daarna open.
  update(root) {
    const knop = root.querySelector("#cursus-gelezen");
    if (!knop) return;
    const c = staat();
    const h = HOOFDSTUK_BY_ID[c.open];
    if (!h) return;
    let tekst;
    if (c.gelezen[h.id]) {
      knop.disabled = true;
      tekst = "Gelezen ✓";
    } else {
      const nog = Math.ceil(leestijd(h) - (Date.now() - geopend.sinds) / 1000);
      knop.disabled = nog > 0;
      tekst = nog > 0 ? `Eerst even lezen… (${nog} s)` : `Uitgelezen: ${fmt(beloning())} packets`;
    }
    if (knop.textContent !== tekst) knop.textContent = tekst;
  },
};
