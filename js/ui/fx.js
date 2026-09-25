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
  // De stijl uit Uiterlijk hangt aan de melding zelf, zodat een melding die
  // al in beeld is niet halverwege van uiterlijk verandert.
  const stijl = G.uiterlijk?.melding;
  el.className = `toast ${tone}${stijl && stijl !== "standaard" ? ` stijl-${stijl}` : ""}`.trim();
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

// De stijl komt uit Uiterlijk. Sommige stijlen gebruiken --dx en --draai om
// elk getal een eigen richting te geven.
export function floatText(x, y, text, stijl = G.uiterlijk?.zweeftekst) {
  if (!heeftDom) return;
  const el = document.createElement("span");
  el.className = stijl && stijl !== "standaard" ? `zweef zweef-${stijl}` : "zweef";
  el.textContent = text;
  el.dataset.tekst = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.setProperty("--dx", `${Math.round(Math.random() * 60 - 30)}px`);
  el.style.setProperty("--draai", `${Math.round(Math.random() * 16 - 8)}deg`);
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

// Het klikeffect dat je onder Uiterlijk kiest. Elk deeltje is een span met
// een CSS-animatie; ze ruimen zichzelf op. Met animaties uit: niets.
function deeltje(klasse, x, y, props = {}, levensduur = 900, tekst = "") {
  const el = document.createElement("span");
  el.className = klasse;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  for (const [k, v] of Object.entries(props)) el.style.setProperty(k, v);
  if (tekst) el.textContent = tekst;
  $("fx").append(el);
  setTimeout(() => el.remove(), levensduur);
  return el;
}

const willekeurig = (min, max) => min + Math.random() * (max - min);
const kies = (lijst) => lijst[Math.floor(Math.random() * lijst.length)];
const CONFETTI = ["#f472b6", "#facc15", "#4ade80", "#38bdf8", "#a78bfa", "#fb923c"];
const HEADERS = ["#38bdf8", "#4ade80", "#facc15", "#f472b6"];

const KLIKEFFECTEN = {
  vonken: (x, y) => sparks(x, y, 8),
  bits: (x, y) => {
    for (let i = 0; i < 8; i++) {
      const hoek = -Math.PI / 2 + willekeurig(-1.2, 1.2);
      const afstand = willekeurig(45, 95);
      deeltje("fx-bit", x, y, { "--dx": `${Math.cos(hoek) * afstand}px`, "--dy": `${Math.sin(hoek) * afstand}px`, "--draai": `${willekeurig(-40, 40)}deg` }, 850, Math.random() < 0.5 ? "0" : "1");
    }
  },
  ping: (x, y) => {
    deeltje("fx-ping", x, y, {}, 900);
    deeltje("fx-ping na", x, y, {}, 1100);
  },
  pakketjes: (x, y) => {
    for (let i = 0; i < 5; i++) {
      deeltje("fx-pakket", x, y, {
        "--dx": `${willekeurig(-110, 110)}px`,
        "--hoog": `${willekeurig(-90, -50)}px`,
        "--val": `${willekeurig(40, 90)}px`,
        "--kop": kies(HEADERS),
      }, 950);
    }
  },
  confetti: (x, y) => {
    for (let i = 0; i < 14; i++) {
      deeltje("fx-confetti", x, y, {
        "--dx": `${willekeurig(-120, 120)}px`,
        "--hoog": `${willekeurig(-110, -40)}px`,
        "--val": `${willekeurig(60, 140)}px`,
        "--draai": `${willekeurig(-540, 540)}deg`,
        background: kies(CONFETTI),
      }, 1300);
    }
  },
  vuurwerk: (x, y) => {
    deeltje("fx-flits", x, y, {}, 500);
    const n = 16;
    for (let i = 0; i < n; i++) {
      const hoek = (Math.PI * 2 * i) / n + willekeurig(-0.12, 0.12);
      const afstand = willekeurig(70, 120);
      deeltje("fx-vuur", x, y, {
        "--dx": `${Math.cos(hoek) * afstand}px`,
        "--dy": `${Math.sin(hoek) * afstand}px`,
        "--hoek": `${(hoek * 180) / Math.PI}deg`,
        background: kies(["#fde68a", "#fbbf24", "#fff7ed", "#fb923c"]),
      }, 1000);
    }
  },
};

Object.assign(KLIKEFFECTEN, {
  hartjes: (x, y) => {
    for (let i = 0; i < 6; i++) {
      deeltje("fx-hart", x + willekeurig(-18, 18), y, {
        "--dx": `${willekeurig(-50, 50)}px`,
        "--dy": `${willekeurig(-120, -70)}px`,
        "--grootte": `${willekeurig(14, 26)}px`,
        color: kies(["#f472b6", "#fb7185", "#ef4444", "#f9a8d4"]),
        "animation-delay": `${i * 40}ms`,
      }, 1300, "♥");
    }
  },
  emoji: (x, y) => {
    for (let i = 0; i < 5; i++) {
      const hoek = -Math.PI / 2 + willekeurig(-1.3, 1.3);
      const afstand = willekeurig(60, 110);
      deeltje("fx-emoji", x, y, { "--dx": `${Math.cos(hoek) * afstand}px`, "--dy": `${Math.sin(hoek) * afstand}px`, "--draai": `${willekeurig(-120, 120)}deg` }, 950, kies(["☕", "🍕", "🐧", "💾", "🖱️", "📎", "🍩", "🔌"]));
    }
  },
  glitch: (x, y) => {
    for (let i = 0; i < 8; i++) {
      deeltje("fx-glitch", x + willekeurig(-70, 50), y + willekeurig(-40, 40), {
        width: `${willekeurig(18, 80)}px`,
        height: `${willekeurig(3, 14)}px`,
        background: kies(["#22d3ee", "#f0abfc", "#ffffff", "#a3e635"]),
        "animation-delay": `${willekeurig(0, 120)}ms`,
      }, 520);
    }
  },
  laser: (x, y) => {
    const draai = willekeurig(0, 90);
    for (let i = 0; i < 4; i++) deeltje("fx-laser", x, y, { "--hoek": `${draai + i * 90}deg` }, 800);
  },
  zwartgat: (x, y) => {
    deeltje("fx-gat", x, y, {}, 800);
    for (let i = 0; i < 12; i++) {
      const hoek = willekeurig(0, Math.PI * 2);
      const afstand = willekeurig(70, 120);
      deeltje("fx-zuig", x, y, { "--dx": `${Math.cos(hoek) * afstand}px`, "--dy": `${Math.sin(hoek) * afstand}px`, background: kies(["#c4b5fd", "#f0abfc", "#e0f2fe"]) }, 750);
    }
  },
});

// Een bliksemschicht als SVG-pad: een zigzag van het midden naar buiten.
function schicht(x, y, hoek, lengte) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  el.setAttribute("class", "fx-schicht");
  el.setAttribute("width", String(lengte));
  el.setAttribute("height", "40");
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.setProperty("--hoek", `${hoek}deg`);
  let d = "M0 20";
  for (let i = 1; i <= 6; i++) d += ` L${(lengte / 6) * i} ${20 + willekeurig(-12, 12)}`;
  const pad = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pad.setAttribute("d", d);
  el.append(pad);
  $("fx").append(el);
  setTimeout(() => el.remove(), 450);
}

Object.assign(KLIKEFFECTEN, {
  bubbels: (x, y) => {
    for (let i = 0; i < 6; i++) {
      deeltje("fx-bubbel", x + willekeurig(-30, 30), y + willekeurig(-10, 10), {
        "--dx": `${willekeurig(-30, 30)}px`,
        "--dy": `${willekeurig(-150, -90)}px`,
        "--grootte": `${willekeurig(10, 24)}px`,
        "animation-delay": `${i * 50}ms`,
      }, 1400);
    }
  },
  pixels: (x, y) => {
    for (let i = 0; i < 12; i++) {
      const hoek = (Math.PI * 2 * i) / 12;
      const afstand = willekeurig(50, 90);
      deeltje("fx-pixel", x, y, {
        "--dx": `${Math.round((Math.cos(hoek) * afstand) / 8) * 8}px`,
        "--dy": `${Math.round((Math.sin(hoek) * afstand) / 8) * 8}px`,
        background: kies(["#22d3ee", "#facc15", "#f472b6", "#4ade80", "#ffffff"]),
      }, 700);
    }
  },
  regenboogschok: (x, y) => {
    deeltje("fx-schok", x, y, {}, 800);
  },
  bliksem: (x, y) => {
    const draai = willekeurig(0, 360);
    for (let i = 0; i < 3; i++) schicht(x, y, draai + i * 120 + willekeurig(-20, 20), willekeurig(90, 140));
    deeltje("fx-flits", x, y, { filter: "hue-rotate(160deg)" }, 500);
  },
  supernova: (x, y) => {
    deeltje("fx-nova", x, y, {}, 900);
    deeltje("fx-schokgolf", x, y, {}, 900);
    for (let i = 0; i < 18; i++) {
      const hoek = (Math.PI * 2 * i) / 18;
      const afstand = willekeurig(80, 140);
      deeltje("fx-vuur", x, y, {
        "--dx": `${Math.cos(hoek) * afstand}px`,
        "--dy": `${Math.sin(hoek) * afstand}px`,
        "--hoek": `${(hoek * 180) / Math.PI}deg`,
        background: kies(["#ffffff", "#bae6fd", "#c4b5fd", "#fde68a"]),
      }, 1000);
    }
  },
  oerknal: (x, y) => {
    deeltje("fx-oerflits", x, y, {}, 700);
    deeltje("fx-schok", x, y, {}, 800);
    deeltje("fx-schokgolf", x, y, { "animation-delay": "120ms" }, 1000);
    for (let i = 0; i < 24; i++) {
      const hoek = willekeurig(0, Math.PI * 2);
      const afstand = willekeurig(60, 170);
      deeltje("fx-ster", x, y, {
        "--dx": `${Math.cos(hoek) * afstand}px`,
        "--dy": `${Math.sin(hoek) * afstand}px`,
        "--draai": `${willekeurig(-360, 360)}deg`,
        color: `hsl(${Math.floor(willekeurig(0, 360))} 95% 70%)`,
      }, 1200, "✦");
    }
  },
});

Object.assign(KLIKEFFECTEN, {
  sneeuw: (x, y) => {
    for (let i = 0; i < 9; i++) {
      const hoek = willekeurig(0, Math.PI * 2);
      const afstand = willekeurig(40, 90);
      deeltje("fx-sneeuw", x, y, {
        "--dx": `${Math.cos(hoek) * afstand}px`,
        "--dy": `${Math.sin(hoek) * afstand * 0.6 + 40}px`,
        "--draai": `${willekeurig(-180, 180)}deg`,
        "font-size": `${willekeurig(12, 20)}px`,
      }, 1300, "❄");
    }
  },
  noten: (x, y) => {
    for (let i = 0; i < 4; i++) {
      deeltje("fx-noot", x + willekeurig(-20, 20), y, {
        "--dx": `${willekeurig(-40, 40)}px`,
        "--kleur": kies(["#f472b6", "#a78bfa", "#38bdf8", "#facc15", "#4ade80"]),
        "animation-delay": `${i * 70}ms`,
      }, 1400, kies(["♪", "♫", "♬", "♩"]));
    }
  },
  portaal: (x, y) => {
    deeltje("fx-portaal", x, y, {}, 950);
    for (let i = 0; i < 6; i++) {
      const hoek = (Math.PI * 2 * i) / 6;
      deeltje("vonk", x, y, { "--dx": `${Math.cos(hoek) * 60}px`, "--dy": `${Math.sin(hoek) * 60}px`, background: kies(["#a3e635", "#4ade80", "#2dd4bf"]) }, 700);
    }
  },
});

export function klikEffect(soort, x, y) {
  if (!heeftDom || !G.options.motion) return;
  (KLIKEFFECTEN[soort] || KLIKEFFECTEN.vonken)(x, y);
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
// De muziek speelt via dezelfde audiocontext.
export { ctx as audioContext };

export function blip(freq = 620, duration = 0.05, gain = 0.05) {
  if (!G.options.sound) return;
  const ac = ctx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  // Op 0 beginnen: anders lekt er vlak voor de start één sample op vol volume door.
  vol.gain.value = 0;
  osc.type = "triangle";
  osc.frequency.value = freq;
  vol.gain.setValueAtTime(gain, ac.currentTime);
  vol.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
  osc.connect(vol).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + duration);
}

// Eén toon met een eigen golfvorm, die eventueel van toonhoogte glijdt.
function toon({ type = "triangle", van, naar = van, duur, gain, na = 0 }) {
  const ac = ctx();
  if (!ac) return;
  const start = ac.currentTime + na;
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  vol.gain.value = 0;
  osc.type = type;
  osc.frequency.setValueAtTime(van, start);
  if (naar !== van) osc.frequency.exponentialRampToValueAtTime(naar, start + duur);
  vol.gain.setValueAtTime(gain, start);
  vol.gain.exponentialRampToValueAtTime(0.0001, start + duur);
  osc.connect(vol).connect(ac.destination);
  osc.start(start);
  osc.stop(start + duur);
}

// Een tikje ruis, voor het mechanische toetsenbord.
let ruis = null;
function tik() {
  const ac = ctx();
  if (!ac) return;
  if (!ruis) {
    ruis = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.03), ac.sampleRate);
    const data = ruis.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 2;
  }
  const bron = ac.createBufferSource();
  bron.buffer = ruis;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2600 + Math.random() * 900;
  const vol = ac.createGain();
  vol.gain.value = 0.35;
  bron.connect(filter).connect(vol).connect(ac.destination);
  bron.start();
  toon({ type: "sine", van: 170, naar: 90, duur: 0.03, gain: 0.05 });
}

const KLIKGELUIDEN = {
  blip: () => blip(560 + Math.random() * 90, 0.04, 0.035),
  toetsenbord: tik,
  chiptune: () => {
    const basis = kies([523, 587, 659, 784]);
    toon({ type: "square", van: basis, duur: 0.04, gain: 0.022 });
    toon({ type: "square", van: basis * 1.5, duur: 0.05, gain: 0.02, na: 0.04 });
  },
  modem: () => {
    toon({ type: "sawtooth", van: 1100 + Math.random() * 300, naar: 2300, duur: 0.07, gain: 0.012 });
    toon({ type: "square", van: 1800, naar: 1200, duur: 0.05, gain: 0.008, na: 0.03 });
  },
  druppel: () => toon({ type: "sine", van: 1300 + Math.random() * 200, naar: 380, duur: 0.1, gain: 0.06 }),
};

// Een pentatonische toonladder: welke tonen je ook na elkaar speelt, het klinkt.
const PENTATONISCH = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760];
// Ode an die Freude, noot voor noot.
const LIEDJE = [659, 659, 698, 784, 784, 698, 659, 587, 523, 523, 587, 659, 659, 587, 587,
  659, 659, 698, 784, 784, 698, 659, 587, 523, 523, 587, 659, 587, 523, 523];
let noot = 0;

Object.assign(KLIKGELUIDEN, {
  harp: () => {
    const f = kies(PENTATONISCH);
    toon({ type: "triangle", van: f, duur: 0.45, gain: 0.05 });
    toon({ type: "sine", van: f * 2, duur: 0.25, gain: 0.015 });
  },
  melodie: () => {
    const f = LIEDJE[noot++ % LIEDJE.length];
    toon({ type: "triangle", van: f, duur: 0.3, gain: 0.055 });
    toon({ type: "sine", van: f / 2, duur: 0.3, gain: 0.02 });
  },
  kassa: () => {
    tik();
    toon({ type: "sine", van: 2637, duur: 0.35, gain: 0.035, na: 0.05 });
    toon({ type: "sine", van: 3520, duur: 0.3, gain: 0.025, na: 0.08 });
  },
  pew: () => toon({ type: "square", van: 1700, naar: 180, duur: 0.13, gain: 0.025 }),
  robot: () => {
    for (let i = 0; i < 3; i++) toon({ type: "square", van: kies([330, 440, 587, 698, 880]), duur: 0.03, gain: 0.02, na: i * 0.04 });
  },
});

Object.assign(KLIKGELUIDEN, {
  deurbel: () => {
    toon({ type: "sine", van: 659, duur: 0.45, gain: 0.05 });
    toon({ type: "sine", van: 523, duur: 0.6, gain: 0.05, na: 0.22 });
  },
  muntje: () => {
    toon({ type: "square", van: 988, duur: 0.07, gain: 0.02 });
    toon({ type: "square", van: 1319, duur: 0.22, gain: 0.02, na: 0.07 });
  },
  xylofoon: () => {
    const f = kies([784, 880, 988, 1047, 1175, 1319, 1568]);
    toon({ type: "sine", van: f, duur: 0.25, gain: 0.06 });
    toon({ type: "triangle", van: f * 3, duur: 0.06, gain: 0.015 });
  },
  miauw: () => {
    // Omhoog en weer omlaag, met een klein trillinkje.
    toon({ type: "sawtooth", van: 520, naar: 900, duur: 0.12, gain: 0.018 });
    toon({ type: "sawtooth", van: 900, naar: 420, duur: 0.22, gain: 0.018, na: 0.12 });
  },
  subwoofer: () => {
    toon({ type: "sine", van: 110, naar: 38, duur: 0.28, gain: 0.12 });
    tik();
  },
  hemelkoor: () => {
    // Een zacht akkoord van licht ontstemde tonen: een koor in de verte.
    const grond = kies([261.63, 293.66, 329.63, 349.23]);
    for (const [factor, gain] of [[1, 0.025], [1.25, 0.02], [1.5, 0.02], [2, 0.012]]) {
      toon({ type: "sine", van: grond * factor, duur: 0.9, gain });
      toon({ type: "sine", van: grond * factor * 1.004, duur: 0.9, gain: gain * 0.7 });
    }
  },
});

// Een stoot ruis door een filter, voor de beatbox en het zwaard. Een eigen,
// vlakke ruis: die van het toetsenbord sterft al na een fractie uit.
let vlakkeRuis = null;
function ruisStoot({ freq, naar = freq, type = "highpass", duur, gain, q = 1 }) {
  const ac = ctx();
  if (!ac) return;
  if (!vlakkeRuis) {
    vlakkeRuis = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.5), ac.sampleRate);
    const data = vlakkeRuis.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const bron = ac.createBufferSource();
  bron.buffer = vlakkeRuis;
  bron.loop = true;
  const filter = ac.createBiquadFilter();
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(freq, ac.currentTime);
  if (naar !== freq) filter.frequency.exponentialRampToValueAtTime(naar, ac.currentTime + duur);
  const vol = ac.createGain();
  vol.gain.value = 0;
  vol.gain.setValueAtTime(gain, ac.currentTime);
  vol.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duur);
  bron.connect(filter).connect(vol).connect(ac.destination);
  bron.start();
  bron.stop(ac.currentTime + duur + 0.02);
}

const BEAT = ["boem", "tss", "boem", "boem", "tss", "ka"];
let beatStap = 0;

Object.assign(KLIKGELUIDEN, {
  beatbox: () => {
    const klank = BEAT[beatStap++ % BEAT.length];
    if (klank === "boem") toon({ type: "sine", van: 150, naar: 48, duur: 0.18, gain: 0.16 });
    if (klank === "tss") ruisStoot({ freq: 7000, duur: 0.07, gain: 0.07 });
    if (klank === "ka") ruisStoot({ freq: 1800, type: "bandpass", duur: 0.09, gain: 0.12, q: 1.2 });
  },
  zwaard: () => {
    // Een zoem van twee ontstemde tonen, en een zwiep die opengaat.
    toon({ type: "sawtooth", van: 92, naar: 128, duur: 0.32, gain: 0.018 });
    toon({ type: "sawtooth", van: 95, naar: 132, duur: 0.32, gain: 0.018 });
    ruisStoot({ freq: 500, naar: 3200, type: "bandpass", duur: 0.22, gain: 0.08, q: 2 });
  },
  theremin: () => {
    const ac = ctx();
    if (!ac) return;
    const nu = ac.currentTime;
    const f = kies([392, 440, 523.25, 587.33, 659.25]);
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f, nu);
    osc.frequency.exponentialRampToValueAtTime(f * 1.26, nu + 0.45);
    // Het beven: een trage oscillator die de toonhoogte laat schommelen.
    const lfo = ac.createOscillator();
    lfo.frequency.value = 6;
    const diepte = ac.createGain();
    diepte.gain.value = 9;
    lfo.connect(diepte).connect(osc.frequency);
    const vol = ac.createGain();
    vol.gain.value = 0;
    vol.gain.setValueAtTime(0.0001, nu);
    vol.gain.exponentialRampToValueAtTime(0.05, nu + 0.08);
    vol.gain.exponentialRampToValueAtTime(0.0001, nu + 0.6);
    osc.connect(vol).connect(ac.destination);
    osc.start(nu);
    lfo.start(nu);
    osc.stop(nu + 0.62);
    lfo.stop(nu + 0.62);
  },
});

export function klikGeluid(soort) {
  if (!G.options.sound) return;
  (KLIKGELUIDEN[soort] || KLIKGELUIDEN.blip)();
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
let vastGehouden = false;

// Zolang het opstartscherm er ligt, wachten de vensters.
export function houVenstersVast(belofte) {
  vastGehouden = true;
  belofte.then(() => {
    vastGehouden = false;
    if (!huidig) toonVolgende();
  });
}

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
  if (!huidig && !vastGehouden) toonVolgende();
}

function toonVolgende() {
  if (!heeftDom) return;
  bereidVoor();
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
