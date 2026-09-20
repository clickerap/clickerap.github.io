// Het labo: vier opdrachten achter één tabblad, één tegelijk in beeld.

import { G } from "../state.js";
import { quiz } from "./quiz.js";
import { terminal } from "./terminal.js";
import { market, startMarkt } from "./market.js";
import { patch } from "./patch.js";
import { emit } from "../bus.js";

export const GAMES = [quiz, terminal, market, patch];

const picker = document.getElementById("labo-picker");
const stage = document.getElementById("labo-stage");
let actief = null;
let hertekenTimer = null;
let pickerTimer = null;

function kies(game) {
  if (!game.unlocked()) return;
  actief = game;
  G.minigames.laatste = game.id;
  for (const btn of picker.children) btn.classList.toggle("on", btn.dataset.id === game.id);
  teken();
}

function teken() {
  clearInterval(hertekenTimer);
  if (!actief) return;
  actief.stop?.();
  actief.render(stage);
  // De markt en de patchkast lopen door; die tekenen we periodiek opnieuw.
  if (actief.id === "market") hertekenTimer = setInterval(() => actief.render(stage), 5000);
  if (actief.id === "patch") hertekenTimer = setInterval(() => actief.render(stage), 4000);
}

export function renderLabo() {
  picker.innerHTML = "";
  for (const game of GAMES) {
    const open = game.unlocked();
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.id = game.id;
    btn.disabled = !open;
    btn.innerHTML = `<b>${open ? game.icon : "🔒"}</b>${game.name}${open ? "" : `<small>${game.eis}</small>`}`;
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
    btn.innerHTML = `<b>${open ? game.icon : "🔒"}</b>${game.name}${open ? "" : `<small>${game.eis}</small>`}`;
    if (open && !actief) kies(game);
  }
}

export function stopLabo() {
  actief?.stop?.();
  clearInterval(hertekenTimer);
  clearInterval(pickerTimer);
  pickerTimer = null;
}

export function initLabo() {
  startMarkt();
  emit("labo:klaar");
}
