// Muziek op de achtergrond, ter plekke gespeeld met Web Audio: er zijn geen
// bestanden. Een planner kijkt tien keer per seconde vooruit en zet de noten
// van de volgende maat klaar. Elk nummer is een lus van een paar maten, met
// hier en daar wat toeval, zodat het niet elke keer precies hetzelfde klinkt.
//
// Het speelt alleen als Geluid aanstaat en het tabblad in beeld is.

import { audioContext } from "./fx.js";

const heeftDom = typeof document !== "undefined";
const VOLUME = 0.55;
const VOORUIT = 0.4; // hoeveel seconden de planner vooruit plant

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
const kans = (p) => Math.random() < p;
const kies = (lijst) => lijst[Math.floor(Math.random() * lijst.length)];

// ---------------------------------------------------------- Instrumenten
// Elk instrument krijgt `m`: de audiocontext en de uitgang van het nummer.

// Een gain-node staat op 1 tot zijn eerste automatie. Een bron die net niet
// op een hele sample begint, lekt daardoor één sample op vol volume door: een
// harde tik. Daarom begint elk volume op 0.
function volume(ac) {
  const g = ac.createGain();
  g.gain.value = 0;
  return g;
}

let ruisBuffer = null;
function ruis(ac) {
  if (!ruisBuffer || ruisBuffer.sampleRate !== ac.sampleRate) {
    ruisBuffer = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const data = ruisBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return ruisBuffer;
}

// Eén noot. `tokkel` sterft meteen uit, zoals een snaar; anders houdt de noot
// aan tot vlak voor het einde.
function noot(m, { t, f, duur, type = "sine", vol = 0.05, aan = 0.01, tokkel = false, detune = 0, filter = 0, naar = m.bus }) {
  const { ac } = m;
  const osc = ac.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(f, t);
  if (detune) osc.detune.setValueAtTime(detune, t);
  const g = volume(ac);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + aan);
  if (!tokkel) g.gain.setValueAtTime(vol, t + Math.max(aan, duur * 0.7));
  g.gain.exponentialRampToValueAtTime(0.0001, t + duur);
  let kop = osc;
  if (filter) {
    const fl = ac.createBiquadFilter();
    fl.type = "lowpass";
    fl.frequency.setValueAtTime(filter, t);
    osc.connect(fl);
    kop = fl;
  }
  kop.connect(g).connect(naar);
  osc.start(t);
  osc.stop(t + duur + 0.05);
  return osc;
}

// Een stoot ruis door een filter: hihats, snares, tikjes en kraakjes.
function stoot(m, { t, duur, vol, type = "highpass", freq = 7000, q = 1, naar = m.bus }) {
  const { ac } = m;
  const bron = ac.createBufferSource();
  bron.buffer = ruis(ac);
  const fl = ac.createBiquadFilter();
  fl.type = type;
  fl.frequency.setValueAtTime(freq, t);
  fl.Q.setValueAtTime(q, t);
  const g = volume(ac);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duur);
  bron.connect(fl).connect(g).connect(naar);
  bron.start(t, Math.random() * 1.5);
  bron.stop(t + duur + 0.02);
}

function kick(m, t, vol = 0.5) {
  const { ac } = m;
  const osc = ac.createOscillator();
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(42, t + 0.16);
  const g = volume(ac);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
  osc.connect(g).connect(m.bus);
  osc.start(t);
  osc.stop(t + 0.35);
}

function snare(m, t, vol = 0.12, staart = 0.16) {
  stoot(m, { t, duur: staart, vol, type: "bandpass", freq: 1700, q: 0.7 });
  noot(m, { t, f: 190, duur: 0.08, type: "triangle", vol: vol * 0.6, tokkel: true });
}

function hihat(m, t, vol = 0.03, open = false) {
  stoot(m, { t, duur: open ? 0.12 : 0.035, vol, freq: 7500 });
}

// Een akkoord: elke noot twee keer, een fractie ontstemd, zodat het breed klinkt.
function akkoord(m, t, noten, { duur, vol, type = "sawtooth", aan = 0.3, filter = 1400, spreid = 7, tokkel = false }) {
  for (const n of noten) {
    for (const d of [-spreid, spreid]) noot(m, { t, f: hz(n), duur, type, vol, aan, detune: d, filter, tokkel });
  }
}

// Een klokje: een paar boventonen die elk op hun eigen tempo uitsterven.
function klokje(m, t, f, vol = 0.03) {
  for (const [factor, v, duur] of [[1, 1, 2.4], [2.76, 0.45, 1.3], [5.4, 0.25, 0.7], [8.93, 0.12, 0.4]]) {
    noot(m, { t, f: f * factor, duur, vol: vol * v, aan: 0.004, tokkel: true });
  }
}

// ------------------------------------------------------------- Nummers
// `maat(m, t, i, tel)` plant maat i in, die begint op tijd t. `tel` is de
// duur van één tel in seconden. `volume` brengt alle nummers op ongeveer
// dezelfde sterkte, een stuk zachter dan een klik.

const PENTA = [0, 2, 4, 7, 9];

const NUMMERS = {
  // Ventilatoren, het brommen van de stroom en af en toe een harde schijf.
  serverruimte: {
    bpm: 60,
    volume: 0.6,
    start(m) {
      const { ac } = m;
      const bron = ac.createBufferSource();
      bron.buffer = ruis(ac);
      bron.loop = true;
      const fl = ac.createBiquadFilter();
      fl.type = "lowpass";
      fl.frequency.value = 380;
      const g = ac.createGain();
      g.gain.value = 0.2;
      bron.connect(fl).connect(g).connect(m.bus);
      bron.start();
      m.bronnen.push(bron);
      // In België is het stroomnet 50 hertz. Dat hoor je.
      for (const [f, v] of [[50, 0.05], [100, 0.022], [150, 0.008]]) {
        const osc = ac.createOscillator();
        osc.frequency.value = f;
        const og = ac.createGain();
        og.gain.value = v;
        osc.connect(og).connect(m.bus);
        osc.start();
        m.bronnen.push(osc);
      }
    },
    maat(m, t, i) {
      if (kans(0.7)) {
        let x = t + Math.random() * 3;
        for (let k = 0; k < 2 + Math.floor(Math.random() * 6); k++) {
          stoot(m, { t: x, duur: 0.012, vol: 0.05 + Math.random() * 0.05, type: "bandpass", freq: 2600 + Math.random() * 1400, q: 4 });
          x += 0.03 + Math.random() * 0.09;
        }
      }
      if (i % 4 === 3 && kans(0.6)) noot(m, { t: t + 2, f: 1000, duur: 0.09, type: "square", vol: 0.008 });
      if (i % 8 === 5) {
        noot(m, { t: t + 1, f: 880, duur: 0.07, type: "square", vol: 0.006 });
        noot(m, { t: t + 1.12, f: 1320, duur: 0.1, type: "square", vol: 0.006 });
      }
    },
  },

  // Rustige akkoorden met een loom ritme en wat kraakjes van een plaat.
  lofi: {
    bpm: 74,
    volume: 0.7,
    start(m) {
      const warm = m.ac.createBiquadFilter();
      warm.type = "lowpass";
      warm.frequency.value = 2100;
      warm.connect(m.uit);
      m.bus = warm;
    },
    maat(m, t, i, tel) {
      const AKKOORDEN = [[50, 53, 57, 60, 64], [43, 53, 59, 64], [48, 52, 55, 59, 62], [45, 55, 60, 64, 71]];
      const ak = AKKOORDEN[i % 4];
      const swing = tel * 0.09;
      for (const n of ak.slice(1)) {
        noot(m, { t, f: hz(n), duur: tel * 3.6, vol: 0.028, aan: 0.02, tokkel: true });
        noot(m, { t, f: hz(n + 12), duur: tel * 1.2, vol: 0.006, aan: 0.01, tokkel: true });
      }
      if (kans(0.6)) for (const n of ak.slice(2)) noot(m, { t: t + tel * 2.5 + swing, f: hz(n), duur: tel * 1.4, vol: 0.016, tokkel: true });
      const grond = ak[0] >= 48 ? ak[0] - 12 : ak[0];
      noot(m, { t, f: hz(grond), duur: tel * 2.2, vol: 0.12, aan: 0.02, tokkel: true });
      noot(m, { t: t + tel * 3.5 + swing, f: hz(grond + 7), duur: tel * 0.5, vol: 0.08, tokkel: true });
      for (const b of [0, 1.75, 2.5]) kick(m, t + tel * b, 0.32);
      for (const b of [1, 3]) stoot(m, { t: t + tel * b, duur: 0.14, vol: 0.06, type: "bandpass", freq: 1400, q: 0.8 });
      for (let k = 0; k < 8; k++) hihat(m, t + tel * (k / 2) + (k % 2 ? swing : 0), 0.012 + Math.random() * 0.01);
      for (let b = 0; b < 4; b++) {
        if (!kans(0.35)) continue;
        noot(m, { t: t + tel * b + (b % 2 ? swing : 0), f: hz(72 + kies(PENTA) + kies([0, 12])), duur: tel * 0.9, type: "triangle", vol: 0.022, tokkel: true });
      }
      // Kraakjes van de plaat.
      for (let k = 0; k < 14; k++) stoot(m, { t: t + Math.random() * tel * 4, duur: 0.004, vol: 0.02 + Math.random() * 0.04, freq: 3000 });
    },
  },

  // Bossanova voor in de lift.
  lift: {
    bpm: 112,
    volume: 1.6,
    maat(m, t, i, tel) {
      const AKKOORDEN = [[48, 52, 55, 59], [45, 52, 55, 60], [50, 53, 57, 60], [43, 53, 59, 62]];
      const MELODIE = [
        [76, 0, 79, 0, 83, 0, 81, 79],
        [76, 0, 0, 72, 74, 0, 76, 0],
        [77, 0, 81, 0, 84, 0, 83, 81],
        [79, 0, 0, 77, 76, 74, 0, 0],
      ];
      const ak = AKKOORDEN[i % 4];
      const grond = ak[0] - 12;
      noot(m, { t, f: hz(grond), duur: tel * 1.4, type: "triangle", vol: 0.1, tokkel: true });
      noot(m, { t: t + tel * 2, f: hz(grond + 7), duur: tel * 1.4, type: "triangle", vol: 0.09, tokkel: true });
      const stoten = i % 2 ? [0.5, 2, 3] : [0, 1.5, 3];
      for (const b of stoten) for (const n of ak.slice(1)) noot(m, { t: t + tel * b, f: hz(n + 12), duur: tel * 0.35, type: "triangle", vol: 0.016, filter: 2600, tokkel: true });
      for (const b of [1.5, 3.5]) stoot(m, { t: t + tel * b, duur: 0.02, vol: 0.05, type: "bandpass", freq: 1900, q: 3 });
      for (let k = 0; k < 8; k++) stoot(m, { t: t + tel * (k / 2), duur: 0.05, vol: k % 2 ? 0.012 : 0.008, freq: 6500 });
      const lijn = MELODIE[i % 4];
      lijn.forEach((n, k) => {
        if (!n) return;
        let lengte = 1;
        while (k + lengte < 8 && !lijn[k + lengte]) lengte++;
        const start = t + tel * (k / 2);
        noot(m, { t: start, f: hz(n), duur: tel * lengte * 0.5 + 0.2, vol: 0.035, aan: 0.005, tokkel: true });
        noot(m, { t: start, f: hz(n) * 4, duur: 0.25, vol: 0.004, aan: 0.003, tokkel: true });
      });
    },
  },

  // Een deuntje uit een oude spelcomputer.
  chiptune: {
    bpm: 150,
    volume: 1.7,
    maat(m, t, i, tel) {
      const WORTELS = [45, 41, 48, 43];
      const MELODIE = [
        [69, 72, 76, 81, 79, 76, 72, 76],
        [65, 69, 72, 77, 76, 72, 69, 72],
        [67, 72, 76, 79, 81, 79, 76, 72],
        [71, 74, 79, 83, 81, 79, 74, 71],
      ];
      const DRIEKLANK = [[0, 3, 7], [0, 4, 7], [0, 4, 7], [0, 4, 7]];
      const w = WORTELS[i % 4];
      for (let k = 0; k < 8; k++) noot(m, { t: t + tel * (k / 2), f: hz(w + (k % 2 ? 12 : 0) - 12), duur: tel * 0.45, type: "triangle", vol: 0.075, tokkel: true });
      if (Math.floor(i / 4) % 2 === 0) {
        MELODIE[i % 4].forEach((n, k) => noot(m, { t: t + tel * (k / 2), f: hz(n), duur: tel * 0.42, type: "square", vol: 0.016, tokkel: true }));
      } else {
        // De tweede keer: snelle arpeggio's, zoals een spelcomputer akkoorden speelt.
        const d = DRIEKLANK[i % 4];
        for (let k = 0; k < 16; k++) noot(m, { t: t + tel * (k / 4), f: hz(w + 24 + d[k % 3] + (k >= 8 ? 12 : 0)), duur: tel * 0.22, type: "square", vol: 0.012, tokkel: true });
      }
      for (const b of [0, 2]) noot(m, { t: t + tel * b, f: 160, duur: 0.1, type: "triangle", vol: 0.14, tokkel: true });
      for (const b of [1, 3]) stoot(m, { t: t + tel * b, duur: 0.09, vol: 0.05, freq: 3000 });
      for (let k = 0; k < 8; k++) stoot(m, { t: t + tel * (k / 2), duur: 0.02, vol: 0.014, freq: 9000 });
    },
  },

  // Neon, een zonsondergang en een bas die maar doorgaat.
  synthwave: {
    bpm: 92,
    volume: 0.63,
    maat(m, t, i, tel) {
      const AKKOORDEN = [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62]];
      const BAS = [45, 41, 48, 43];
      const ak = AKKOORDEN[i % 4];
      akkoord(m, t, ak, { duur: tel * 4, vol: 0.009, aan: 0.6, filter: 1300 });
      for (let k = 0; k < 8; k++) noot(m, { t: t + tel * (k / 2), f: hz(BAS[i % 4] - 12), duur: tel * 0.4, type: "sawtooth", vol: 0.05, filter: 520, tokkel: true });
      kick(m, t, 0.45);
      kick(m, t + tel * 2, 0.45);
      for (const b of [1, 3]) snare(m, t + tel * b, 0.1, 0.34);
      for (let k = 0; k < 8; k++) hihat(m, t + tel * (k / 2), k % 2 ? 0.016 : 0.01);
      if (i >= 4) {
        for (let k = 0; k < 16; k++) {
          const n = ak[[0, 1, 2, 1][k % 4]] + 12 + (k >= 8 ? 12 : 0);
          noot(m, { t: t + tel * (k / 4), f: hz(n), duur: tel * 0.22, type: "square", vol: 0.006, filter: 2800, tokkel: true });
        }
      }
    },
  },

  // Vier op de vloer, met een zure bas die langzaam openbloeit.
  techno: {
    bpm: 128,
    volume: 0.45,
    maat(m, t, i, tel) {
      const PATROON = [33, 33, 45, 33, 36, 33, 45, 43, 33, 33, 48, 33, 40, 33, 45, 43];
      const ACCENT = [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0];
      for (let b = 0; b < 4; b++) kick(m, t + tel * b, 0.5);
      for (let b = 0; b < 4; b++) hihat(m, t + tel * (b + 0.5), 0.028, true);
      for (let k = 0; k < 16; k++) if (k % 4 !== 2) hihat(m, t + tel * (k / 4), 0.007);
      for (const b of [1, 3]) for (const d of [0, 0.012, 0.024]) stoot(m, { t: t + tel * b + d, duur: 0.07, vol: 0.05, type: "bandpass", freq: 1200, q: 0.9 });
      // De zure bas: een zaagtand door een filter dat bij elke noot opengaat.
      const open = 260 + 1300 * (0.5 - 0.5 * Math.cos((2 * Math.PI * (i % 16)) / 16));
      if (i >= 2) {
        PATROON.forEach((n, k) => {
          const start = t + tel * (k / 4);
          const osc = m.ac.createOscillator();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(hz(n), start);
          const fl = m.ac.createBiquadFilter();
          fl.type = "lowpass";
          fl.Q.value = 11;
          fl.frequency.setValueAtTime(open * (ACCENT[k] ? 3 : 1.8), start);
          fl.frequency.exponentialRampToValueAtTime(open, start + 0.12);
          const g = volume(m.ac);
          g.gain.setValueAtTime(ACCENT[k] ? 0.045 : 0.03, start);
          g.gain.exponentialRampToValueAtTime(0.0001, start + tel * 0.24);
          osc.connect(fl).connect(g).connect(m.bus);
          osc.start(start);
          osc.stop(start + tel * 0.26);
        });
      }
      if (i % 2 === 1) akkoord(m, t + tel * 1.5, [57, 60, 64, 67], { duur: tel * 0.5, vol: 0.012, aan: 0.005, filter: 1800, tokkel: true });
    },
  },

  // Het laatste level: snel, in mineur, en vol spanning.
  eindbaas: {
    bpm: 168,
    volume: 0.43,
    maat(m, t, i, tel) {
      const WORTELS = [38, 34, 36, 33];
      const MELODIE = [
        [74, 0, 77, 81, 0, 79, 77, 76],
        [74, 0, 70, 74, 0, 77, 76, 74],
        [72, 0, 76, 79, 0, 77, 76, 72],
        [73, 76, 79, 81, 79, 76, 73, 69],
      ];
      const r = WORTELS[i % 4];
      [0, 0, 12, 0, 0, 12, 10, 12].forEach((d, k) => noot(m, { t: t + tel * (k / 2), f: hz(r + d), duur: tel * 0.42, type: "triangle", vol: 0.08, tokkel: true }));
      const lijn = MELODIE[i % 4];
      const tweede = Math.floor(i / 4) % 2 === 1;
      lijn.forEach((n, k) => {
        if (!n) return;
        const start = t + tel * (k / 2);
        const lang = k < 7 && !lijn[k + 1] ? tel * 0.95 : tel * 0.45;
        noot(m, { t: start, f: hz(n + (tweede ? 12 : 0)), duur: lang, type: "square", vol: 0.014, tokkel: true });
        if (tweede) noot(m, { t: start, f: hz(n + 8), duur: lang, type: "square", vol: 0.007, tokkel: true });
      });
      for (const b of [0, 0.75, 2, 2.75]) kick(m, t + tel * b, 0.4);
      for (const b of [1, 3]) snare(m, t + tel * b, 0.11);
      for (let k = 0; k < 8; k++) hihat(m, t + tel * (k / 2), 0.014);
    },
  },

  // Trage klanken met een echo, ergens tussen twee sterren.
  ruimte: {
    bpm: 66,
    volume: 0.8,
    start(m) {
      const { ac } = m;
      const echo = ac.createDelay(2);
      echo.delayTime.value = (60 / 66) * 0.75;
      const terug = ac.createGain();
      terug.gain.value = 0.42;
      const zacht = ac.createBiquadFilter();
      zacht.type = "lowpass";
      zacht.frequency.value = 2400;
      echo.connect(zacht).connect(terug).connect(echo);
      zacht.connect(m.uit);
      m.echo = echo;
      // Een lus met een echo houdt zichzelf in leven; bij het stoppen knippen
      // we hem door.
      m.los.push(echo, zacht, terug);
    },
    maat(m, t, i, tel) {
      const AKKOORDEN = [[52, 55, 59, 62, 66], [48, 55, 59, 64], [45, 52, 55, 59, 60], [47, 52, 54, 59]];
      const ak = AKKOORDEN[i % 4];
      akkoord(m, t, ak.slice(1), { duur: tel * 4.2, vol: 0.008, type: "triangle", aan: 1.4, filter: 1600, spreid: 9 });
      noot(m, { t, f: hz(ak[0] - 12), duur: tel * 4.2, vol: 0.06, aan: 0.8 });
      const volgorde = [0, 1, 2, 3, 4, 3, 2, 1];
      for (let k = 0; k < 16; k++) {
        const n = ak[volgorde[k % 8] % ak.length] + 12 + (k >= 8 && i % 2 ? 12 : 0);
        noot(m, { t: t + tel * (k / 4), f: hz(n), duur: tel * 0.3, type: "sine", vol: 0.018, tokkel: true });
        noot(m, { t: t + tel * (k / 4), f: hz(n), duur: tel * 0.3, type: "sine", vol: 0.012, tokkel: true, naar: m.echo });
      }
    },
  },

  // Een koor en klokjes.
  hemels: {
    bpm: 56,
    volume: 1.3,
    maat(m, t, i, tel) {
      const AKKOORDEN = [[48, 55, 60, 64, 67], [45, 57, 60, 64, 69], [41, 57, 60, 65, 69], [43, 55, 59, 62, 67]];
      const ak = AKKOORDEN[i % 4];
      for (const n of ak) {
        for (const d of [-6, 0, 6]) noot(m, { t, f: hz(n), duur: tel * 4.4, vol: n < 50 ? 0.012 : 0.007, aan: 1.6, detune: d });
      }
      for (let b = 0; b < 4; b++) {
        if (!kans(b === 0 ? 0.9 : 0.4)) continue;
        klokje(m, t + tel * b + (kans(0.5) ? tel / 2 : 0), hz(kies(ak.slice(2)) + 12), 0.024);
      }
    },
  },
};

// ------------------------------------------------------------- Planner

let sessie = null;
let gewenst = { soort: "geen", aan: false };

function planIn(s, tot) {
  const tel = 60 / s.nummer.bpm;
  const maatduur = tel * 4;
  while (s.volgende < tot) {
    s.nummer.maat(s.m, s.volgende, s.maat, tel);
    s.volgende += maatduur;
    s.maat++;
  }
}

function begin(id, ac) {
  const nummer = NUMMERS[id];
  // Het volume komt zacht op, zodat een nummer nooit met een klap begint.
  const uit = ac.createGain();
  uit.gain.setValueAtTime(0.0001, ac.currentTime);
  uit.gain.exponentialRampToValueAtTime(VOLUME * (nummer.volume || 1), ac.currentTime + 1.5);
  uit.connect(ac.destination);
  const m = { ac, uit, bus: uit, bronnen: [], los: [], einde: uit };
  nummer.start?.(m);
  return { id, m, nummer, volgende: ac.currentTime + 0.12, maat: 0, timer: 0 };
}

function stop() {
  if (!sessie) return;
  const { m, timer } = sessie;
  clearInterval(timer);
  const nu = m.ac.currentTime;
  m.uit.gain.cancelScheduledValues(nu);
  m.uit.gain.setValueAtTime(Math.max(0.0001, m.uit.gain.value), nu);
  m.uit.gain.exponentialRampToValueAtTime(0.0001, nu + 0.4);
  setTimeout(() => {
    for (const bron of m.bronnen) {
      try {
        bron.stop();
      } catch {
        // Al gestopt.
      }
    }
    for (const node of m.los) node.disconnect();
    m.einde.disconnect();
  }, 700);
  sessie = null;
}

function werkBij() {
  const moet = gewenst.aan && NUMMERS[gewenst.soort] && !(heeftDom && document.hidden);
  if (!moet) return stop();
  if (sessie?.id === gewenst.soort) return;
  stop();
  const ac = audioContext();
  if (!ac) return;
  const s = begin(gewenst.soort, ac);
  sessie = s;
  planIn(s, ac.currentTime + VOORUIT);
  s.timer = setInterval(() => planIn(s, ac.currentTime + VOORUIT), 100);
}

export function stelMuziekIn({ soort, aan }) {
  gewenst = { soort, aan };
  werkBij();
}

// Voor de tests: speel een nummer in een OfflineAudioContext, zonder planner.
export function speelOffline(ac, id, seconden) {
  const s = begin(id, ac);
  planIn(s, seconden);
  return s.maat;
}

export const NUMMER_IDS = Object.keys(NUMMERS);

if (heeftDom) {
  document.addEventListener("visibilitychange", werkBij);
  // Een browser speelt pas geluid na een klik of een toets. Wie de muziek
  // bij het laden al aan had staan, hoort ze vanaf de eerste klik.
  const wek = () => {
    if (sessie && sessie.m.ac.state === "suspended") sessie.m.ac.resume();
  };
  document.addEventListener("pointerdown", wek);
  document.addEventListener("keydown", wek);
}
