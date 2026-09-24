// De regels van een werkorder, zonder scherm: puzzels maken, kabels leggen en
// nakijken. De patchkast, de save en de tests gebruiken dit allemaal.
//
// Een goot van n bij n vakken heeft vakken 0 tot n*n, rij voor rij. Een kabel
// is een lijst vakken die begint bij een aansluiting van zijn paar en telkens
// één vak opschuift (boven, onder, links of rechts). Hij is verbonden als hij
// eindigt bij de andere aansluiting van hetzelfde paar.

import { VERBINDINGEN, MATEN, LOKALEN, NOTITIES } from "../data/patch.js";

// ------------------------------------------------------------ Toeval

// Een vaste reeks per zaadje: dezelfde order ziet er na herladen hetzelfde uit.
export function maakRng(zaad) {
  let a = zaad >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const kies = (rng, lijst) => lijst[Math.floor(rng() * lijst.length)];

function schud(rng, lijst) {
  const uit = [...lijst];
  for (let i = uit.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [uit[i], uit[j]] = [uit[j], uit[i]];
  }
  return uit;
}

// ------------------------------------------------------------ Vakken

export function buren(n, vak) {
  const rij = Math.floor(vak / n);
  const kol = vak % n;
  const uit = [];
  if (rij > 0) uit.push(vak - n);
  if (rij < n - 1) uit.push(vak + n);
  if (kol > 0) uit.push(vak - 1);
  if (kol < n - 1) uit.push(vak + 1);
  return uit;
}

export function naast(n, a, b) {
  const d = Math.abs(a - b);
  return (d === n) || (d === 1 && Math.floor(a / n) === Math.floor(b / n));
}

// ------------------------------------------------------------ Puzzels maken
//
// Eerst één slang door alle vakken (een hamiltonpad). Die begint als een
// zigzag en wordt daarna door elkaar geschud met "backbite"-zetten: het uiteinde
// bijt in een buurvak van de slang, en het stuk daarachter draait om. Het pad
// blijft zo altijd door elk vak lopen. Daarna knippen we de slang in stukken;
// elk stuk wordt een kabel, en zijn twee uiteinden de aansluitingen. Een goot
// heeft dus altijd een oplossing die elk vak vult.

function zigzag(n) {
  const pad = [];
  for (let rij = 0; rij < n; rij++) {
    for (let k = 0; k < n; k++) pad.push(rij * n + (rij % 2 ? n - 1 - k : k));
  }
  return pad;
}

function backbite(n, pad, rng) {
  if (rng() < 0.5) pad.reverse();
  const eind = pad[pad.length - 1];
  const doel = kies(rng, buren(n, eind));
  if (doel === pad[pad.length - 2]) return;
  const k = pad.indexOf(doel);
  const staart = pad.splice(k + 1).reverse();
  pad.push(...staart);
}

function hamiltonpad(n, rng) {
  const pad = zigzag(n);
  for (let i = 0; i < 24 * n * n; i++) backbite(n, pad, rng);
  return pad;
}

// Knip de slang in `aantal` stukken van minstens drie vakken, op willekeurige
// plaatsen: zo zijn er korte en heel lange kabels. Twee aansluitingen van
// hetzelfde paar mogen niet naast elkaar liggen, anders valt er niets te puzzelen.
function knip(n, pad, aantal, rng) {
  const vrij = pad.length - 3 * aantal;
  for (let poging = 0; poging < 60; poging++) {
    const punten = Array.from({ length: aantal - 1 }, () => Math.floor(rng() * (vrij + 1))).sort((x, y) => x - y);
    const lengtes = [];
    let vorige = 0;
    for (const punt of punten) {
      lengtes.push(3 + punt - vorige);
      vorige = punt;
    }
    lengtes.push(3 + vrij - vorige);
    const stukken = [];
    let begin = 0;
    for (const lengte of lengtes) {
      stukken.push(pad.slice(begin, begin + lengte));
      begin += lengte;
    }
    if (stukken.every((s) => !naast(n, s[0], s[s.length - 1]))) return stukken;
  }
  return null;
}

// Een complete werkorder uit een maat en een zaadje.
export function maakPuzzel(n, zaad) {
  const maat = MATEN[n];
  if (!maat) throw new Error(`Geen goot van ${n} bij ${n}.`);
  const rng = maakRng(zaad);
  const [min, max] = maat.paren;
  const aantal = min + Math.floor(rng() * (max - min + 1));
  let stukken = null;
  while (!stukken) stukken = knip(n, hamiltonpad(n, rng), aantal, rng);
  const soorten = schud(rng, VERBINDINGEN).slice(0, aantal);
  const paren = stukken.map((stuk, i) => ({ soort: soorten[i].id, a: stuk[0], b: stuk[stuk.length - 1] }));
  // Vaste volgorde op het scherm: van linksboven naar rechtsonder.
  const volgorde = paren.map((_, i) => i).sort((x, y) => Math.min(paren[x].a, paren[x].b) - Math.min(paren[y].a, paren[y].b));
  return {
    n,
    paren: volgorde.map((i) => paren[i]),
    oplossing: volgorde.map((i) => stukken[i]),
    lokaal: kies(rng, LOKALEN),
    notitie: kies(rng, NOTITIES),
  };
}

// ------------------------------------------------------------ Nakijken

// Het paar waar een vak een aansluiting van is, of -1.
export function aansluitingOp(puzzel, vak) {
  return puzzel.paren.findIndex((p) => p.a === vak || p.b === vak);
}

export function overkant(paar, vak) {
  return vak === paar.a ? paar.b : paar.a;
}

export function verbonden(puzzel, kabels, i) {
  const kabel = kabels[i];
  const paar = puzzel.paren[i];
  return !!kabel && kabel.length >= 2 && (kabel[0] === paar.a || kabel[0] === paar.b) && kabel[kabel.length - 1] === overkant(paar, kabel[0]);
}

export function aantalVerbonden(puzzel, kabels) {
  return puzzel.paren.reduce((som, _, i) => som + (verbonden(puzzel, kabels, i) ? 1 : 0), 0);
}

// Hoeveel vakken er bezet zijn: door een kabel of door een aansluiting.
export function bezetting(puzzel, kabels) {
  const bezet = new Set();
  for (const p of puzzel.paren) bezet.add(p.a).add(p.b);
  for (const kabel of kabels) for (const vak of kabel || []) bezet.add(vak);
  return bezet.size / (puzzel.n * puzzel.n);
}

export function alleVerbonden(puzzel, kabels) {
  return aantalVerbonden(puzzel, kabels) === puzzel.paren.length;
}

export function luchtdicht(puzzel, kabels) {
  return alleVerbonden(puzzel, kabels) && bezetting(puzzel, kabels) === 1;
}

// Kabels uit een save: alles wat niet klopt, gaat eruit. Een kabel moet bij een
// eigen aansluiting beginnen, telkens één vak opschuiven, geen andere
// aansluiting raken en nergens over een andere kabel lopen.
export function schoneKabels(puzzel, bron) {
  const { n, paren } = puzzel;
  const bezet = new Set();
  return paren.map((paar, i) => {
    const kabel = Array.isArray(bron) && Array.isArray(bron[i]) ? bron[i] : [];
    if (kabel.length < 2 || kabel.length > n * n) return [];
    if (kabel[0] !== paar.a && kabel[0] !== paar.b) return [];
    const doel = overkant(paar, kabel[0]);
    const gezien = new Set();
    for (let k = 0; k < kabel.length; k++) {
      const vak = kabel[k];
      if (!Number.isInteger(vak) || vak < 0 || vak >= n * n || gezien.has(vak) || bezet.has(vak)) return [];
      if (k > 0 && !naast(n, kabel[k - 1], vak)) return [];
      const eigenaar = aansluitingOp(puzzel, vak);
      if (eigenaar !== -1 && eigenaar !== i) return [];
      if (vak === doel && k !== kabel.length - 1) return [];
      gezien.add(vak);
    }
    for (const vak of gezien) bezet.add(vak);
    return [...kabel];
  });
}

// ------------------------------------------------------------ Leggen
//
// Een kabel leggen gaat zoals in Flow: je begint bij een aansluiting of ergens
// op een bestaande kabel en sleept vak voor vak. Terug over je eigen kabel maakt
// hem korter. Over een andere kabel heen knipt die andere kabel af, maar alleen
// zolang je eroverheen ligt: trek je terug, dan komt hij weer tevoorschijn.

export class Legger {
  constructor(puzzel, kabels) {
    this.puzzel = puzzel;
    this.kabels = puzzel.paren.map((_, i) => [...(kabels?.[i] || [])]);
    this.actief = null;
  }

  // Begin te slepen op een vak. Geeft false als daar niets te pakken is.
  begin(vak) {
    const paar = aansluitingOp(this.puzzel, vak);
    if (paar !== -1) {
      this.actief = { i: paar, pad: [vak], basis: this.kabels };
      return true;
    }
    const i = this.kabels.findIndex((k) => k.includes(vak));
    if (i === -1) return false;
    const kabel = this.kabels[i];
    this.actief = { i, pad: kabel.slice(0, kabel.indexOf(vak) + 1), basis: this.kabels };
    return true;
  }

  // Eén vak verder slepen. Geeft true als de kabel veranderde.
  stap(vak) {
    const a = this.actief;
    if (!a) return false;
    const { n, paren } = this.puzzel;
    const pad = a.pad;
    const laatste = pad[pad.length - 1];
    if (vak === laatste || !naast(n, laatste, vak)) return false;
    const terug = pad.indexOf(vak);
    if (terug !== -1) {
      pad.length = terug + 1;
      return true;
    }
    const doel = overkant(paren[a.i], pad[0]);
    if (laatste === doel && pad.length > 1) return false;
    const eigenaar = aansluitingOp(this.puzzel, vak);
    if (eigenaar !== -1 && vak !== doel) return false;
    pad.push(vak);
    return true;
  }

  // Naar een vak dat verder weg ligt, bijvoorbeeld na een snelle beweging:
  // stap voor stap, eerst langs de as met het grootste verschil.
  naar(vak) {
    const { n } = this.puzzel;
    let veranderd = false;
    for (let veilig = 0; veilig < 2 * n && this.actief; veilig++) {
      const laatste = this.actief.pad[this.actief.pad.length - 1];
      if (laatste === vak) break;
      const dr = Math.floor(vak / n) - Math.floor(laatste / n);
      const dk = (vak % n) - (laatste % n);
      const opties = [];
      if (dr) opties.push(laatste + Math.sign(dr) * n);
      if (dk) opties.push(laatste + Math.sign(dk));
      if (Math.abs(dk) > Math.abs(dr)) opties.reverse();
      if (!opties.some((o) => this.stap(o))) break;
      veranderd = true;
    }
    return veranderd;
  }

  // Wat er nu op het scherm hoort: de kabel die je sleept, en de andere kabels
  // afgeknipt waar die eronder zou liggen.
  weergave() {
    const a = this.actief;
    if (!a) return this.kabels;
    const bezet = new Set(a.pad);
    return a.basis.map((kabel, j) => {
      if (j === a.i) return a.pad;
      const k = kabel.findIndex((vak) => bezet.has(vak));
      return k === -1 ? kabel : kabel.slice(0, k);
    });
  }

  // Loslaten: wat je sleepte, blijft liggen.
  los() {
    if (!this.actief) return;
    this.kabels = this.weergave().map((k) => (k.length >= 2 ? [...k] : []));
    this.actief = null;
  }

  // Terug naar hoe het was voor je begon te slepen.
  annuleer() {
    this.actief = null;
  }

  wis(i) {
    if (i >= 0 && i < this.kabels.length) this.kabels[i] = [];
  }

  wisAlles() {
    this.actief = null;
    this.kabels = this.kabels.map(() => []);
  }

  // Serge legt één kabel zoals in zijn oplossing. Eerst een paar dat nog niet
  // verbonden is; liggen ze allemaal, dan een kabel die anders loopt dan bij
  // hem. Geeft het nummer van het paar, of -1 als er niets te verbeteren valt.
  hulp() {
    const { paren, oplossing } = this.puzzel;
    const zoals = (i) => {
      const k = this.kabels[i];
      const o = oplossing[i];
      return k.length === o.length && (k.every((v, j) => v === o[j]) || k.every((v, j) => v === o[o.length - 1 - j]));
    };
    let i = paren.findIndex((_, j) => !verbonden(this.puzzel, this.kabels, j));
    if (i === -1) i = paren.findIndex((_, j) => !zoals(j));
    if (i === -1) return -1;
    this.actief = { i, pad: [...oplossing[i]], basis: this.kabels };
    this.los();
    return i;
  }
}
