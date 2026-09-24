// Tooltips, meldingen, vensters en klik-effecten.
//
// Het DOM wordt pas aangeraakt als er echt iets getoond wordt. Daardoor kunnen
// de tests de spelmodules ook buiten de browser importeren.

import { G } from "../state.js";

const heeftDom = typeof document !== "undefined";
const $ = (id) => document.getElementById(id);

export const hoverCapable = typeof window !== "undefined" && !!window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

// --- Tooltips ---

let activeSource = null;
let activeRender = null;

export function attachTooltip(el, render) {
  if (!hoverCapable) return;
  el.addEventListener("pointerenter", () => showTooltip(el, render));
  el.addEventListener("pointerleave", () => hideTooltip(el));
  el.addEventListener("focus", () => showTooltip(el, render));
  el.addEventListener("blur", () => hideTooltip(el));
}

function showTooltip(el, render) {
  activeSource = el;
  activeRender = render;
  const tooltipEl = $("tooltip");
  tooltipEl.innerHTML = render();
  tooltipEl.hidden = false;
  position(el);
}

function position(el) {
  const tooltipEl = $("tooltip");
  const rect = el.getBoundingClientRect();
  const tip = tooltipEl.getBoundingClientRect();
  const gutter = 12;
  let left = rect.left - tip.width - gutter;
  if (left < gutter) left = rect.right + gutter;
  if (left + tip.width > window.innerWidth - gutter) {
    left = Math.max(gutter, window.innerWidth - tip.width - gutter);
  }
  let top = rect.top + rect.height / 2 - tip.height / 2;
  top = Math.min(Math.max(gutter, top), window.innerHeight - tip.height - gutter);
  tooltipEl.style.left = `${Math.round(left)}px`;
  tooltipEl.style.top = `${Math.round(top)}px`;
}

function hideTooltip(el) {
  if (el && activeSource !== el) return;
  activeSource = null;
  activeRender = null;
  $("tooltip").hidden = true;
}

// Na een aankoop verandert de prijs; de tooltip die openstaat moet mee.
export function refreshTooltip() {
  if (!activeSource || !activeRender) return;
  if (!activeSource.isConnected) {
    hideTooltip();
    return;
  }
  $("tooltip").innerHTML = activeRender();
  position(activeSource);
}

// --- Meldingen ---

export function toast({ title, text, icon = "", tone = "" }) {
  if (!heeftDom) return;
  const toaster = $("toaster");
  const el = document.createElement("div");
  el.className = `toast ${tone}`.trim();
  el.innerHTML = `${icon ? `<span class="ikoon" aria-hidden="true"></span>` : ""}<h4></h4>${text ? "<p></p>" : ""}`;
  if (icon) el.querySelector(".ikoon").textContent = icon;
  el.querySelector("h4").textContent = title;
  if (text) el.querySelector("p").textContent = text;
  toaster.append(el);
  const leven = 3800;
  setTimeout(() => {
    el.classList.add("weg");
    setTimeout(() => el.remove(), 220);
  }, leven);
  const max = window.innerWidth < 620 ? 2 : 3;
  while (toaster.children.length > max) toaster.firstElementChild.remove();
}

// Iets voorlezen voor wie een schermlezer gebruikt, zonder het te tonen.
export function kondigAan(tekst) {
  if (!heeftDom) return;
  const el = $("aankondiging");
  el.textContent = "";
  // Eerst leegmaken, dan vullen: zo wordt dezelfde zin ook twee keer gelezen.
  setTimeout(() => (el.textContent = tekst), 50);
}

// --- Klik-effecten ---

export function floatText(x, y, text) {
  if (!heeftDom) return;
  const el = document.createElement("span");
  el.className = "zweef";
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  $("fx").append(el);
  setTimeout(() => el.remove(), 1200);
}

const VONKKLEUREN = ["#38bdf8", "#3b82f6", "#6366f1", "#22d3ee", "#facc15"];

export function sparks(x, y, count = 8) {
  if (!heeftDom || !G.options.motion) return;
  const laag = $("fx");
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "vonk";
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist = 40 + Math.random() * 55;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    el.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    el.style.background = VONKKLEUREN[Math.floor(Math.random() * VONKKLEUREN.length)];
    laag.append(el);
    setTimeout(() => el.remove(), 700);
  }
}

// --- Geluid ---
// Web Audio, geen bestanden. Standaard uit.

let audio = null;
function ctx() {
  if (!audio) {
    const Ctor = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
    if (!Ctor) return null;
    audio = new Ctor();
  }
  if (audio.state === "suspended") audio.resume();
  return audio;
}

export function blip(freq = 620, duration = 0.05, gain = 0.05) {
  if (!G.options.sound) return;
  const ac = ctx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  vol.gain.setValueAtTime(gain, ac.currentTime);
  vol.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
  osc.connect(vol).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + duration);
}

export function chord(freqs, duration = 0.25) {
  freqs.forEach((f, i) => setTimeout(() => blip(f, duration, 0.04), i * 60));
}

// --- Vensters ---
// Eén <dialog>, met een wachtrij: komen er twee vensters tegelijk (welkom
// terug en een nieuw portret), dan zie je ze na elkaar in plaats van dat het
// tweede het eerste wegdrukt. showModal() houdt de focus binnen het venster
// en zet hem na het sluiten terug waar hij stond.

const wachtrij = [];
let huidig = null;
let voorbereid = false;

function bereidVoor() {
  if (voorbereid) return;
  voorbereid = true;
  const modal = $("modal");
  modal.addEventListener("close", () => {
    huidig = null;
    toonVolgende();
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
}

export function dialog(opties) {
  if (!heeftDom) return;
  bereidVoor();
  wachtrij.push(opties);
  if (!huidig) toonVolgende();
}

function toonVolgende() {
  huidig = wachtrij.shift() || null;
  if (!huidig) return;
  const { title, body, actions = [] } = huidig;
  const modal = $("modal");
  const lichaam = $("modal-body");
  const knoppen = $("modal-actions");
  $("modal-title").textContent = title;
  lichaam.innerHTML = body;
  knoppen.innerHTML = "";
  for (const action of actions) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `btn ${action.style || "ghost"}`;
    btn.textContent = action.label;
    btn.addEventListener("click", () => {
      // Een actie die false teruggeeft houdt het venster open, bijvoorbeeld
      // om een foutmelding te tonen.
      if (action.onClick?.(lichaam) === false) return;
      if (modal.open) modal.close();
    });
    knoppen.append(btn);
  }
  modal.showModal();
}
