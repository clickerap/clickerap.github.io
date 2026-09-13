// Tooltips, meldingen en klik-effecten.

import { G } from "../state.js";

const tooltipEl = document.getElementById("tooltip");
const toaster = document.getElementById("toaster");
const fxLayer = document.getElementById("fx");

export const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

let activeSource = null;
let activeRender = null;

export function attachTooltip(el, render) {
  if (!hoverCapable) return;
  el.addEventListener("pointerenter", () => showTooltip(el, render));
  el.addEventListener("pointerleave", () => hideTooltip(el));
  el.addEventListener("focus", () => showTooltip(el, render));
  el.addEventListener("blur", () => hideTooltip(el));
}

export function showTooltip(el, render) {
  activeSource = el;
  activeRender = render;
  tooltipEl.innerHTML = render();
  tooltipEl.hidden = false;
  position(el);
}

function position(el) {
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

export function hideTooltip(el) {
  if (el && activeSource !== el) return;
  activeSource = null;
  activeRender = null;
  tooltipEl.hidden = true;
}

// Na een aankoop verandert de prijs; de tooltip die openstaat moet mee.
export function refreshTooltip() {
  if (!activeSource || !activeRender) return;
  if (!activeSource.isConnected) {
    hideTooltip();
    return;
  }
  tooltipEl.innerHTML = activeRender();
  position(activeSource);
}

// --- Meldingen ---

export function toast({ title, text, icon = "", tone = "" }) {
  const el = document.createElement("div");
  el.className = `toast ${tone}`.trim();
  el.innerHTML = `${icon ? `<span class="ikoon">${icon}</span>` : ""}<h4></h4>${text ? "<p></p>" : ""}`;
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

// --- Klik-effecten ---

export function floatText(x, y, text) {
  const el = document.createElement("span");
  el.className = "zweef";
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  fxLayer.append(el);
  setTimeout(() => el.remove(), 1200);
}

const VONKKLEUREN = ["#38bdf8", "#3b82f6", "#6366f1", "#22d3ee", "#facc15"];

export function sparks(x, y, count = 8) {
  if (!G.options.motion) return;
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
    fxLayer.append(el);
    setTimeout(() => el.remove(), 700);
  }
}

// --- Geluid ---
// Web Audio, geen bestanden. Standaard uit.

let audio = null;
function ctx() {
  if (!audio) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
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

// --- Dialoog ---

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const modalActions = document.getElementById("modal-actions");
let lastFocus = null;

export function dialog({ title, body, actions }) {
  lastFocus = document.activeElement;
  modalTitle.textContent = title;
  modalBody.innerHTML = body;
  modalActions.innerHTML = "";
  for (const action of actions) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `btn ${action.style || "ghost"}`;
    btn.textContent = action.label;
    btn.addEventListener("click", () => {
      closeDialog();
      action.onClick?.(modalBody);
    });
    modalActions.append(btn);
  }
  modal.hidden = false;
  modalActions.querySelector("button")?.focus();
}

export function closeDialog() {
  modal.hidden = true;
  lastFocus?.focus?.();
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeDialog();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeDialog();
});
