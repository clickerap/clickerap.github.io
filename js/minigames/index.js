// Het labo: vijf opdrachten achter één tabblad, één tegelijk in beeld.
//
// Het contract voor een opdracht:
//   render(root)   bouwt de opdracht op in root
//   update(root)   optioneel; wordt elke seconde aangeroepen zolang de
//                  opdracht in beeld is, voor klokjes en koersen
//   stop()         optioneel; opruimen als de opdracht uit beeld gaat
//   info           uitleg voor de knop "Hoe werkt het?" (zie info.js)
// Opdrachten starten zelf geen timers. Zo kan er nooit een opdracht over een
// andere heen tekenen, en draait er niets als het labo dicht is.

import { G } from "../state.js";
import { quiz } from "./quiz.js";
import { terminal } from "./terminal.js";
import { market, startMarkt } from "./market.js";
import { patch } from "./patch.js";
import { cursus } from "./cursus.js";
import { emit } from "../bus.js";
import { dialog } from "../ui/fx.js";
import { infoHtml } from "./info.js";

export const GAMES = [cursus, quiz, terminal, market, patch];

const picker = document.getElementById("labo-picker");
const stage = document.getElementById("labo-stage");
let actief = null;
let updateTimer = null;
let pickerTimer = null;

function knopInhoud(game, open) {
  return `<b aria-hidden="true">${open ? game.icon : "🔒"}</b>${game.name}${open ? "" : `<small>${game.eis}</small>`}`;
}

function kies(game) {
  if (!game.unlocked()) return;
  actief?.stop?.();
  actief = game;
  G.minigames.laatste = game.id;
  for (const btn of picker.children) {
    const aan = btn.dataset.id === game.id;
    btn.classList.toggle("on", aan);
    btn.setAttribute("aria-pressed", String(aan));
  }
  game.render(stage);
  clearInterval(updateTimer);
  updateTimer = setInterval(() => actief?.update?.(stage), 1000);
}

// De knop "Hoe werkt het?" zit in de kop van elke opdracht. Eén luisteraar op
// het podium is genoeg, ook als de opdracht zichzelf opnieuw opbouwt.
stage.addEventListener("click", (e) => {
  if (!e.target.closest("[data-info]") || !actief?.info) return;
  dialog({
    title: `${actief.icon} ${actief.name}: zo werkt het`,
    body: infoHtml(actief.info),
    actions: [{ label: "Duidelijk", style: "ghost" }],
  });
});

export function renderLabo() {
  picker.innerHTML = "";
  for (const game of GAMES) {
    const open = game.unlocked();
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.id = game.id;
    btn.disabled = !open;
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML = knopInhoud(game, open);
    btn.addEventListener("click", () => kies(game));
    picker.append(btn);
  }
  clearInterval(pickerTimer);
  pickerTimer = setInterval(syncPicker, 2000);
  const voorkeur = GAMES.find((g) => g.id === G.minigames.laatste && g.unlocked());
  const eerste = voorkeur || GAMES.find((g) => g.unlocked());
  if (eerste) kies(eerste);
  else stage.innerHTML = `<p class="labo-uitleg">Elke opdracht gaat open zodra je het bijbehorende apparaat hebt. De terminal komt als eerste, zodra je een switch koopt.</p>`;
}

// Een opdracht kan opengaan terwijl je ernaar kijkt; de knoppen moeten mee.
function syncPicker() {
  for (const btn of picker.children) {
    const game = GAMES.find((g) => g.id === btn.dataset.id);
    const open = game.unlocked();
    if (btn.disabled === !open) continue;
    btn.disabled = !open;
    btn.innerHTML = knopInhoud(game, open);
    if (open && !actief) kies(game);
  }
}

export function stopLabo() {
  actief?.stop?.();
  actief = null;
  clearInterval(updateTimer);
  clearInterval(pickerTimer);
  updateTimer = null;
  pickerTimer = null;
}

export function initLabo() {
  startMarkt();
  emit("labo:klaar");
}
