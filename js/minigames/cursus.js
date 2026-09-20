// De cursus. Geen spel, maar de theorie waar de rest van het labo op leunt:
// lees een hoofdstuk, snap de overhoring, snap de terminal.

import { G, D, earn, unlock } from "../state.js";
import { fmt } from "../format.js";
import { toast, chord } from "../ui/fx.js";
import { HOOFDSTUKKEN, HOOFDSTUK_BY_ID } from "../data/cursus.js";

function staat() {
  const c = G.minigames.cursus || (G.minigames.cursus = { gelezen: {}, open: null });
  if (!c.gelezen) c.gelezen = {};
  return c;
}

function ontsnap(tekst) {
  return String(tekst).replace(/[&<>]/g, (k) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[k]));
}

function blokHtml(blok) {
  switch (blok.t) {
    case "p":
      return `<p class="cursus-p">${ontsnap(blok.tekst)}</p>`;
    case "lijst":
      return `<ul class="cursus-lijst">${blok.items.map((i) => `<li>${ontsnap(i)}</li>`).join("")}</ul>`;
    case "code":
      return `<pre class="cursus-code">${blok.regels.map(ontsnap).join("\n")}</pre>`;
    case "serge":
      return `<p class="cursus-serge"><strong>Serge zegt:</strong> ${ontsnap(blok.tekst)}</p>`;
    case "tabel":
      return `<div class="cursus-tabelvak"><table class="cursus-tabel">
        <thead><tr>${blok.kop.map((k) => `<th>${ontsnap(k)}</th>`).join("")}</tr></thead>
        <tbody>${blok.rijen.map((r) => `<tr>${r.map((c) => `<td>${ontsnap(c)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></div>`;
    default:
      return "";
  }
}

function markeerGelezen(c, id) {
  if (c.gelezen[id]) return null;
  c.gelezen[id] = true;
  const winst = Math.max(1000, D.pps * 30) * D.minigameReward;
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

export const cursus = {
  id: "cursus",
  name: "Cursus",
  icon: "📚",
  eis: "Altijd open",
  unlocked: () => true,
  render(root) {
    const c = staat();
    const gelezen = HOOFDSTUKKEN.filter((h) => c.gelezen[h.id]).length;

    if (!c.open || !HOOFDSTUK_BY_ID[c.open]) {
      root.innerHTML = `
        <div class="labo-kop">
          <h3>Cursus</h3>
          <span>${gelezen} van de ${HOOFDSTUKKEN.length} gelezen</span>
        </div>
        <p class="labo-uitleg">De basis van netwerken, in stukjes die je tussendoor leest. Elk hoofdstuk dat je voor het eerst uitleest levert packets op — en helpt bij de overhoring hiernaast.</p>
        <div class="cursus-index">
          ${HOOFDSTUKKEN.map((h, i) => `
            <button type="button" class="cursus-item${c.gelezen[h.id] ? " gelezen" : ""}" data-open="${h.id}">
              <span class="cursus-nr">${i + 1}</span>
              <span class="cursus-tekst">
                <strong>${h.icoon} ${ontsnap(h.titel)}</strong>
                <span>${ontsnap(h.korte)}</span>
              </span>
              <span class="cursus-vink">${c.gelezen[h.id] ? "✓" : ""}</span>
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
    markeerGelezen(c, h.id);

    root.innerHTML = `
      <div class="labo-kop">
        <h3>${h.icoon} ${ontsnap(h.titel)}</h3>
        <span>hoofdstuk ${index + 1} van ${HOOFDSTUKKEN.length}</span>
      </div>
      <button type="button" class="btn ghost small" id="cursus-terug" style="align-self:flex-start">← Alle hoofdstukken</button>
      <article class="cursus-blad">${h.inhoud.map(blokHtml).join("")}</article>
      <div class="knoprij" style="justify-content:space-between">
        ${vorige ? `<button type="button" class="btn ghost small" data-ga="${vorige.id}">← ${ontsnap(vorige.titel)}</button>` : "<span></span>"}
        ${volgende ? `<button type="button" class="btn small" data-ga="${volgende.id}">${ontsnap(volgende.titel)} →</button>` : "<span></span>"}
      </div>`;

    root.querySelector("#cursus-terug").addEventListener("click", () => {
      c.open = null;
      this.render(root);
    });
    root.querySelectorAll("[data-ga]").forEach((knop) => {
      knop.addEventListener("click", () => {
        c.open = knop.dataset.ga;
        this.render(root);
        root.closest(".tabpanels")?.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  },
};
