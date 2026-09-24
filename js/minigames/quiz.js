// Serge's overhoring: tien onderwerpen, van subnetten tot beveiliging.
//
// Rekenvragen stelt dit bestand zelf op en rekent ze zelf na; de vaste vragen
// staan in data/vragen.js. Goed antwoord levert packets op, en een reeks
// goede antwoorden levert meer. Wie niet wil wachten tot de volgende vraag,
// kan intussen oefenen: dat levert niets op, maar telt ook niet tegen je.

import { G, D, earn, unlock } from "../state.js";
import { fmt, fmtTime } from "../format.js";
import { toast, blip, chord } from "../ui/fx.js";
import { esc } from "../html.js";
import { INFO_KNOP } from "./info.js";
import { ONDERWERPEN, ONDERWERP_BY_ID, FEITEN, POORTNUMMERS, OSI, OSI_PROTOCOLLEN } from "../data/vragen.js";

const COOLDOWN = 150; // seconden tussen twee beloonde vragen
const UITLEG_MS = 3600; // hoe lang het antwoord in beeld blijft
const wachttijd = () => COOLDOWN * (D.laboTempo || 1);

export function intToIp(n) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}
export function ipToInt(ip) {
  return ip.split(".").reduce((acc, part) => ((acc << 8) + Number(part)) >>> 0, 0) >>> 0;
}
export function maskInt(prefix) {
  return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}
function randomIp(prefix) {
  const basis = [
    () => (10 << 24) + (rnd(256) << 16) + (rnd(256) << 8) + rnd(256),
    () => (172 << 24) + ((16 + rnd(16)) << 16) + (rnd(256) << 8) + rnd(256),
    () => (192 << 24) + (168 << 16) + (rnd(256) << 8) + rnd(256),
  ];
  const raw = basis[rnd(basis.length)]() >>> 0;
  // Zorg dat het adres niet toevallig het netwerkadres zelf is.
  const host = raw & ~maskInt(prefix);
  return host === 0 ? (raw | 1) >>> 0 : raw;
}
function rnd(n) {
  return Math.floor(Math.random() * n);
}
function shuffle(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
const kies = (lijst) => lijst[rnd(lijst.length)];
// Drie andere dan het goede, zonder dubbels.
const anderen = (lijst, goed, n = 3) => shuffle(lijst.filter((x) => x !== goed)).slice(0, n);

// ----------------------------------------------------------- Subnetten

const SUBNETTEN = [
  // Netwerkadres
  () => {
    const prefix = 8 + rnd(22);
    const ip = randomIp(prefix);
    const net = (ip & maskInt(prefix)) >>> 0;
    const fout = [
      intToIp((net + 1) >>> 0),
      intToIp((ip | ~maskInt(prefix)) >>> 0),
      intToIp((net - 256) >>> 0),
    ];
    return {
      vraag: `Wat is het netwerkadres van ${intToIp(ip)}/${prefix}?`,
      goed: intToIp(net),
      fout,
      uitleg: `Je maskeert het adres met ${intToIp(maskInt(prefix))}.`,
    };
  },
  // Broadcastadres
  () => {
    const prefix = 8 + rnd(22);
    const ip = randomIp(prefix);
    const net = (ip & maskInt(prefix)) >>> 0;
    const bc = (net | (~maskInt(prefix) >>> 0)) >>> 0;
    return {
      vraag: `Wat is het broadcastadres van ${intToIp(ip)}/${prefix}?`,
      goed: intToIp(bc),
      fout: [intToIp(net), intToIp((bc - 1) >>> 0), intToIp((bc + 1) >>> 0)],
      uitleg: `Alle hostbits op 1 geeft ${intToIp(bc)}.`,
    };
  },
  // Aantal bruikbare hosts
  () => {
    const prefix = 16 + rnd(14);
    const hosts = Math.pow(2, 32 - prefix) - 2;
    return {
      vraag: `Hoeveel bruikbare hostadressen heeft een /${prefix}?`,
      goed: String(hosts),
      fout: [String(hosts + 2), String(hosts + 1), String(Math.pow(2, 31 - prefix) - 2)],
      uitleg: "2^hostbits, min het netwerkadres en het broadcastadres.",
    };
  },
  // Subnetmasker
  () => {
    const prefix = 8 + rnd(23);
    const goed = intToIp(maskInt(prefix));
    return {
      vraag: `Welk subnetmasker hoort bij /${prefix}?`,
      goed,
      fout: [intToIp(maskInt(prefix + 1)), intToIp(maskInt(prefix - 1)), intToIp(maskInt(Math.max(1, prefix - 4)))],
      uitleg: `/${prefix} betekent ${prefix} bits op 1.`,
    };
  },
  // Kleinste prefix voor N hosts
  () => {
    const bits = 3 + rnd(8);
    const nodig = Math.pow(2, bits) - 2 - rnd(Math.max(1, Math.pow(2, bits - 1)));
    const prefix = 32 - Math.ceil(Math.log2(nodig + 2));
    return {
      vraag: `Wat is het kleinste subnet waar ${nodig} hosts in passen?`,
      goed: `/${prefix}`,
      fout: [`/${Math.min(32, prefix + 1)}`, `/${prefix - 1}`, `/${prefix - 2}`],
      uitleg: `Je hebt ${32 - prefix} hostbits nodig, dus /${prefix}.`,
    };
  },
  // Zelfde subnet of niet
  () => {
    const prefix = 20 + rnd(8);
    const a = randomIp(prefix);
    const zelfde = Math.random() < 0.5;
    const b = zelfde
      ? ((a & maskInt(prefix)) + 1 + rnd(Math.max(1, (~maskInt(prefix) >>> 0) - 1))) >>> 0
      : (a + Math.pow(2, 32 - prefix) + rnd(64)) >>> 0;
    const echtZelfde = ((a & maskInt(prefix)) >>> 0) === ((b & maskInt(prefix)) >>> 0);
    return {
      vraag: `Zitten ${intToIp(a)} en ${intToIp(b)} met een /${prefix} in hetzelfde subnet?`,
      goed: echtZelfde ? "Ja" : "Nee",
      fout: [echtZelfde ? "Nee" : "Ja"],
      uitleg: `${intToIp((a & maskInt(prefix)) >>> 0)} tegenover ${intToIp((b & maskInt(prefix)) >>> 0)}.`,
    };
  },
  // Eerste bruikbare host
  () => {
    const prefix = 16 + rnd(14);
    const ip = randomIp(prefix);
    const net = (ip & maskInt(prefix)) >>> 0;
    const bc = (net | (~maskInt(prefix) >>> 0)) >>> 0;
    return {
      vraag: `Wat is het eerste bruikbare hostadres in het subnet van ${intToIp(ip)}/${prefix}?`,
      goed: intToIp((net + 1) >>> 0),
      fout: [intToIp(net), intToIp((net + 2) >>> 0), intToIp((bc - 1) >>> 0)],
      uitleg: `Het netwerkadres ${intToIp(net)} plus één.`,
    };
  },
  // Laatste bruikbare host
  () => {
    const prefix = 16 + rnd(14);
    const ip = randomIp(prefix);
    const net = (ip & maskInt(prefix)) >>> 0;
    const bc = (net | (~maskInt(prefix) >>> 0)) >>> 0;
    return {
      vraag: `Wat is het laatste bruikbare hostadres in het subnet van ${intToIp(ip)}/${prefix}?`,
      goed: intToIp((bc - 1) >>> 0),
      fout: [intToIp(bc), intToIp((bc - 2) >>> 0), intToIp((net + 1) >>> 0)],
      uitleg: `Het broadcastadres ${intToIp(bc)} min één.`,
    };
  },
  // Prefix bij een masker
  () => {
    const prefix = 9 + rnd(21);
    return {
      vraag: `Welk prefix hoort bij het masker ${intToIp(maskInt(prefix))}?`,
      goed: `/${prefix}`,
      fout: [`/${prefix + 1}`, `/${prefix - 1}`, `/${prefix + 2}`],
      uitleg: `Tel de bits op 1: ${prefix}.`,
    };
  },
  // Wildcardmasker
  () => {
    const prefix = 9 + rnd(21);
    const wildcard = (~maskInt(prefix)) >>> 0;
    return {
      vraag: `Welk wildcardmasker hoort bij /${prefix}?`,
      goed: intToIp(wildcard),
      fout: [intToIp(maskInt(prefix)), intToIp((~maskInt(prefix + 1)) >>> 0), intToIp((~maskInt(prefix - 1)) >>> 0)],
      uitleg: `Het omgekeerde van het masker: 255.255.255.255 min ${intToIp(maskInt(prefix))}.`,
    };
  },
  // Subnetten door bits te lenen
  () => {
    const basis = kies([16, 24]);
    const n = 1 + rnd(6);
    const goed = 2 ** n;
    return {
      vraag: `Hoeveel subnetten krijg je als je van een /${basis} ${n} ${n === 1 ? "bit" : "bits"} leent?`,
      goed: String(goed),
      fout: [goed * 2, goed - 2, goed + 2, goed / 2].map(String),
      uitleg: `Elke geleende bit verdubbelt het aantal: 2^${n} = ${goed}. Je nieuwe prefix is /${basis + n}.`,
    };
  },
  // Grootte van een subnet
  () => {
    const prefix = 22 + rnd(9);
    const grootte = 2 ** (32 - prefix);
    return {
      vraag: `Hoeveel adressen telt een /${prefix} in totaal, netwerk- en broadcastadres inbegrepen?`,
      goed: String(grootte),
      fout: [String(grootte - 2), String(grootte * 2), String(grootte / 2)],
      uitleg: `2^${32 - prefix} = ${grootte}. Daarmee lopen de subnetten ook op.`,
    };
  },
];

// ------------------------------------------------------ Binair en hex

const bin8 = (n) => n.toString(2).padStart(8, "0");
const hex2 = (n) => n.toString(16).toUpperCase().padStart(2, "0");
function machten(n) {
  return [128, 64, 32, 16, 8, 4, 2, 1].filter((m) => n & m).join(" + ") || "0";
}
// Drie andere getallen door telkens één bit om te draaien.
function bitfouten(n) {
  return shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 3).map((b) => n ^ (1 << b));
}

const BINAIR = [
  () => {
    const n = 1 + rnd(254);
    return {
      vraag: `Hoe schrijf je ${n} binair, in 8 bits?`,
      goed: bin8(n),
      fout: bitfouten(n).map(bin8),
      uitleg: `${n} = ${machten(n)}.`,
    };
  },
  () => {
    const n = 1 + rnd(254);
    return {
      vraag: `Welk decimaal getal is ${bin8(n)}?`,
      goed: String(n),
      fout: bitfouten(n).map(String),
      uitleg: `${machten(n)} = ${n}.`,
    };
  },
  () => {
    const n = 16 + rnd(239);
    const fout = [...new Set([((n & 15) << 4) | (n >> 4), (n + 16) & 255, (n - 1 + 256) & 255, (n + 1) & 255])].filter((f) => f !== n).slice(0, 3);
    return {
      vraag: `Welk decimaal getal is 0x${hex2(n)}?`,
      goed: String(n),
      fout: fout.map(String),
      uitleg: `${hex2(n)[0]} × 16 + ${hex2(n)[1]} = ${Math.floor(n / 16)} × 16 + ${n % 16} = ${n}.`,
    };
  },
  () => {
    const n = 16 + rnd(239);
    const fout = [...new Set([((n & 15) << 4) | (n >> 4), (n + 16) & 255, (n + 1) & 255, (n - 1 + 256) & 255])].filter((f) => f !== n).slice(0, 3);
    return {
      vraag: `Hoe schrijf je ${n} hexadecimaal?`,
      goed: hex2(n),
      fout: fout.map(hex2),
      uitleg: `${n} = ${Math.floor(n / 16)} × 16 + ${n % 16}, dus ${hex2(n)}.`,
    };
  },
];

// ------------------------------------------------------------ Poorten

const mooi = (p) => `${p.poort}`;
const POORTVRAGEN = [
  () => {
    const p = kies(POORTNUMMERS);
    return {
      vraag: `Welk protocol gebruikt standaard poort ${p.poort}?`,
      goed: p.naam,
      fout: anderen(POORTNUMMERS.map((x) => x.naam), p.naam),
      uitleg: `${p.naam} luistert op poort ${p.poort}.`,
    };
  },
  () => {
    const p = kies(POORTNUMMERS);
    return {
      vraag: `Op welke poort luistert ${p.naam} standaard?`,
      goed: mooi(p),
      fout: anderen(POORTNUMMERS.map(mooi), mooi(p)),
      uitleg: `${p.naam}: poort ${p.poort}.`,
    };
  },
  () => {
    const p = kies(POORTNUMMERS.filter((x) => x.tp));
    return {
      vraag: `Gebruikt ${p.naam} TCP of UDP?`,
      goed: p.tp,
      fout: [p.tp === "TCP" ? "UDP" : "TCP"],
      uitleg: p.tp === "UDP" ? `${p.naam} gebruikt UDP: snel, zonder handshake.` : `${p.naam} gebruikt TCP: betrouwbaar, met een verbinding.`,
    };
  },
];

// ----------------------------------------------------------- OSI-model

const laag = (n) => `Laag ${n}`;
const OSIVRAGEN = [
  () => {
    const l = kies(OSI);
    return {
      vraag: `Hoe heet laag ${l.laag} van het OSI-model?`,
      goed: l.naam,
      fout: anderen(OSI.map((x) => x.naam), l.naam),
      uitleg: "Van onder naar boven: fysiek, datalink, netwerk, transport, sessie, presentatie, applicatie.",
    };
  },
  () => {
    const l = kies(OSI.filter((x) => x.pdu));
    return {
      vraag: `Hoe heet een stukje data op de ${l.naam.toLowerCase()}?`,
      goed: l.pdu,
      fout: anderen(OSI.filter((x) => x.pdu).map((x) => x.pdu), l.pdu),
      uitleg: "Bits, frames, pakketten, segmenten: van laag 1 tot laag 4.",
    };
  },
  () => {
    const l = kies(OSI.filter((x) => x.apparaat));
    return {
      vraag: `Op welke laag van het OSI-model werkt een ${l.apparaat.toLowerCase()}?`,
      goed: laag(l.laag),
      fout: anderen([1, 2, 3, 4, 7].map(laag), laag(l.laag)),
      uitleg: "Een hub herhaalt bits, een switch kijkt naar MAC-adressen, een router naar IP-adressen.",
    };
  },
  () => {
    const p = kies(OSI_PROTOCOLLEN);
    return {
      vraag: `Op welke laag van het OSI-model hoort ${p.naam}?`,
      goed: laag(p.laag),
      fout: anderen([2, 3, 4, 7].map(laag), laag(p.laag)),
      uitleg: `${p.naam} hoort op laag ${p.laag}, de ${OSI[p.laag - 1].naam.toLowerCase()}.`,
    };
  },
];

// ----------------------------------------------------------------- IPv6

// De kortste schrijfwijze: geen voorloopnullen, en de langste reeks van twee
// of meer nulgroepen wordt :: (bij een gelijke stand de eerste).
export function kortIpv6(groepen) {
  let start = -1;
  let lengte = 0;
  for (let i = 0; i < 8;) {
    if (groepen[i] !== 0) {
      i++;
      continue;
    }
    let j = i;
    while (j < 8 && groepen[j] === 0) j++;
    if (j - i >= 2 && j - i > lengte) {
      start = i;
      lengte = j - i;
    }
    i = j;
  }
  const hex = groepen.map((g) => g.toString(16));
  if (start === -1) return hex.join(":");
  return `${hex.slice(0, start).join(":")}::${hex.slice(start + lengte).join(":")}`;
}

const IPV6VRAGEN = [
  () => {
    // Een adres met een reeks nullen, groepen met voorloopnullen en een groep
    // die op een nul eindigt: zo zit elke valkuil erin.
    const groepen = [0x2001, 0x0db8, rnd(0x0fff) + 1, rnd(0xffff) + 1, rnd(0xffff) + 1, (rnd(0xfff) + 1) << 4, rnd(0xff) + 1, rnd(0xffff) + 1];
    const start = 2 + rnd(3);
    const lengte = 2 + rnd(Math.min(3, 7 - start));
    for (let i = start; i < start + lengte; i++) groepen[i] = 0;
    const vol = groepen.map((g) => g.toString(16).padStart(4, "0")).join(":");
    const goed = kortIpv6(groepen);
    // Fout 1: voorloopnullen laten staan. Fout 2: ook nullen achteraan weglaten.
    // Fout 3: de nullen weglaten zonder ::, zodat er groepen verdwijnen.
    const zonderVoor = goed.replace(/(^|:)([0-9a-f]{1,4})(?=:|$)/g, (m, sep, g) => `${sep}${g.padStart(4, "0")}`);
    const eindNul = groepen.findIndex((g) => g !== 0 && g % 16 === 0);
    const verkeerd2 = eindNul === -1 ? null : kortIpv6(groepen.map((g, i) => (i === eindNul ? g >> 4 : g)));
    const verkeerd3 = goed.replace("::", ":");
    return {
      vraag: `Hoe schrijf je ${vol} zo kort mogelijk?`,
      goed,
      fout: [zonderVoor, verkeerd2, verkeerd3].filter((f) => f && f !== goed),
      uitleg: "Voorloopnullen mogen weg, nullen achteraan niet. De langste reeks nulgroepen wordt één keer ::.",
    };
  },
];

// ------------------------------------------------------------ Samen

// De laatste vragen, zodat dezelfde niet snel terugkomt.
const recent = [];

// Per onderwerp: generators die een vraag opstellen. Vaste vragen worden er
// ook een, zodat elk onderwerp op dezelfde manier werkt. Een vaste vraag komt
// pas terug als de andere van dat onderwerp geweest zijn.
const feitVan = (onderwerp) => {
  const lijst = FEITEN.filter((f) => f.onderwerp === onderwerp);
  if (!lijst.length) return [];
  return [() => {
    const vers = lijst.filter((f) => !recent.includes(f.vraag));
    return { ...kies(vers.length ? vers : lijst) };
  }];
};

const PER_ONDERWERP = {
  subnetten: SUBNETTEN,
  binair: [...BINAIR, ...feitVan("binair")],
  osi: [...OSIVRAGEN, ...feitVan("osi")],
  poorten: POORTVRAGEN,
  protocollen: feitVan("protocollen"),
  ios: feitVan("ios"),
  switching: feitVan("switching"),
  ipv6: [...IPV6VRAGEN, ...feitVan("ipv6"), ...feitVan("ipv6")],
  kabels: feitVan("kabels"),
  beveiliging: feitVan("beveiliging"),
};

// Alle generators die zelf rekenen, voor de tests.
export const GENERATORS = SUBNETTEN;
export const REKENVRAGEN = { subnetten: SUBNETTEN, binair: BINAIR, poorten: POORTVRAGEN, osi: OSIVRAGEN, ipv6: IPV6VRAGEN };

export function nieuweVraag(onderwerp = "alles") {
  const kan = ONDERWERP_BY_ID[onderwerp] ? [onderwerp] : ONDERWERPEN.map((o) => o.id);
  let gen = null;
  for (let poging = 0; poging < 12; poging++) {
    const id = kies(kan);
    gen = { onderwerp: id, ...kies(PER_ONDERWERP[id])() };
    if (!recent.includes(gen.vraag)) break;
  }
  recent.push(gen.vraag);
  if (recent.length > 25) recent.shift();
  const fout = [...new Set(gen.fout)].filter((f) => f !== gen.goed);
  const opties = shuffle([gen.goed, ...shuffle(fout).slice(0, 3)]);
  return { ...gen, opties };
}

function beloning() {
  const basis = Math.max(500, D.pps * 90);
  // Een reeks telt 10% per goed antwoord, tot het dubbele. Tot versie 5 was
  // dat tot het drievoudige; samen met de labo-knooppunten in de studieboom
  // maakte de quiz alleen al meer dan je hele netwerk.
  const reeks = 1 + Math.min(1, G.minigames.quiz.streak * 0.1);
  return basis * reeks * D.minigameReward;
}

// De open vraag blijft staan tot je hem beantwoordt, ook als je even naar
// een andere opdracht gaat. Na een antwoord blijft de uitleg kort in beeld.
let huidig = null;
let uitslag = null;
let oefenen = false;

function onderwerpKnoppen(gekozen) {
  const knop = (id, naam, icoon) =>
    `<button type="button" data-onderwerp="${id}" aria-pressed="${id === gekozen}" class="${id === gekozen ? "on" : ""}">${icoon ? `<span aria-hidden="true">${icoon}</span> ` : ""}${esc(naam)}</button>`;
  return [knop("alles", "Alles door elkaar", ""), ...ONDERWERPEN.map((o) => knop(o.id, o.naam, o.icoon))].join("");
}

export const quiz = {
  id: "quiz",
  name: "Overhoring",
  icon: "📝",
  eis: "Vraagt 5.000 packets",
  unlocked: () => G.stats.lifetime >= 5e3,
  info: [
    { kop: "Wat is het", tekst: "Serge stelt één vraag tegelijk, met een paar antwoorden om uit te kiezen. Tien onderwerpen: subnetten, binair en hex, het OSI-model, poorten, protocollen, Cisco IOS, switching, IPv6, kabels en wifi, en beveiliging. De cursus helpt." },
    {
      kop: "Zo werkt het",
      punten: [
        "Kies bovenaan een onderwerp om gericht te oefenen, of laat alles door elkaar komen.",
        "Rekenvragen worden elke keer nieuw opgesteld, dus die kun je niet uit je hoofd leren. Een vraag die je net had, komt niet meteen terug.",
        "Terwijl je wacht op de volgende vraag, kun je oefenvragen doen. Die leveren niets op, maar tellen ook niet tegen je reeks.",
      ],
    },
    {
      kop: "Beloning",
      punten: [
        "Een goed antwoord levert anderhalve minuut van je productie op, en minstens 500 packets.",
        "Elk goed antwoord op rij telt 10% extra, tot twee keer zoveel.",
        `Na een goed antwoord komt de volgende vraag na ${COOLDOWN / 60 === 2.5 ? "tweeënhalve minuut" : `${COOLDOWN} seconden`}. Na een fout antwoord wacht je half zo lang, en begint je reeks opnieuw.`,
      ],
    },
  ],

  render(root) {
    const q = G.minigames.quiz;
    root.innerHTML = `
      <div class="labo-kop">
        <h3>Serge's overhoring</h3>
        ${INFO_KNOP}
        <span id="quiz-reeks"></span>
      </div>
      <div class="quiz-onderwerpen" role="group" aria-label="Onderwerp" id="quiz-onderwerpen">${onderwerpKnoppen(q.onderwerp || "alles")}</div>
      <div class="vraag" id="quiz-vraag"></div>
      <div class="quiz-opties" id="quiz-opties"></div>
      <p class="melding" id="quiz-melding" role="status"></p>
      <div class="quiz-oefen" id="quiz-oefen"></div>`;
    root.querySelector("#quiz-onderwerpen").addEventListener("click", (e) => {
      const knop = e.target.closest("[data-onderwerp]");
      if (!knop) return;
      q.onderwerp = knop.dataset.onderwerp;
      root.querySelector("#quiz-onderwerpen").innerHTML = onderwerpKnoppen(q.onderwerp);
      // Een nieuwe vraag in het gekozen onderwerp, tenzij je midden in een uitslag zit.
      if (!uitslag) huidig = null;
      this.vul(root);
    });
    root.querySelector("#quiz-oefen").addEventListener("click", (e) => {
      if (!e.target.closest("[data-oefen]")) return;
      oefenen = true;
      huidig = null;
      this.vul(root);
    });
    this.vul(root);
  },

  vul(root) {
    const q = G.minigames.quiz;
    const vraagEl = root.querySelector("#quiz-vraag");
    const optiesEl = root.querySelector("#quiz-opties");
    const melding = root.querySelector("#quiz-melding");
    const oefenEl = root.querySelector("#quiz-oefen");
    root.querySelector("#quiz-reeks").textContent = `reeks ${fmt(q.streak)} · beste ${fmt(q.best)}`;
    optiesEl.innerHTML = "";
    oefenEl.innerHTML = "";
    if (uitslag && Date.now() >= uitslag.tot) uitslag = null;

    const toonVraag = (v, oefen) => {
      const onderwerp = ONDERWERP_BY_ID[v.onderwerp];
      vraagEl.innerHTML = `<span class="vraag-label"></span><b></b>`;
      vraagEl.querySelector(".vraag-label").textContent = `${onderwerp ? `${onderwerp.icoon} ${onderwerp.naam}` : ""}${oefen ? " · oefenvraag, zonder beloning" : ""}`;
      vraagEl.querySelector("b").textContent = v.vraag;
    };

    if (uitslag) {
      toonVraag(uitslag.vraag, uitslag.oefen);
      for (const optie of uitslag.vraag.opties) {
        const knop = document.createElement("button");
        knop.type = "button";
        knop.className = "quiz-optie";
        knop.disabled = true;
        knop.textContent = optie;
        if (optie === uitslag.vraag.goed) knop.classList.add("goed");
        else if (optie === uitslag.gekozen) knop.classList.add("fout");
        optiesEl.append(knop);
      }
      melding.classList.toggle("fout", !uitslag.goed);
      melding.textContent = uitslag.tekst;
      return;
    }

    const over = ((q.nextAt || 0) - Date.now()) / 1000;
    if (over > 0 && !oefenen) {
      vraagEl.textContent = "Serge zoekt een nieuwe vraag.";
      melding.classList.remove("fout");
      melding.textContent = `Volgende vraag over ${fmtTime(over)}.`;
      oefenEl.innerHTML = `<button type="button" class="btn ghost small" data-oefen>Oefenvraag tussendoor</button>`;
      return;
    }
    // De wachttijd is voorbij: de volgende vraag telt weer mee.
    if (over <= 0 && oefenen) {
      oefenen = false;
      huidig = null;
    }

    if (!huidig) huidig = nieuweVraag(q.onderwerp || "alles");
    toonVraag(huidig, oefenen);
    melding.textContent = "";
    for (const optie of huidig.opties) {
      const knop = document.createElement("button");
      knop.type = "button";
      knop.className = "quiz-optie";
      knop.textContent = optie;
      knop.addEventListener("click", () => this.antwoord(root, optie));
      optiesEl.append(knop);
    }
  },

  antwoord(root, optie) {
    if (!huidig) return;
    const q = G.minigames.quiz;
    const vraag = huidig;
    huidig = null;
    const goed = optie === vraag.goed;
    let tekst;
    if (oefenen) {
      // Oefenen: je hoort meteen of het klopt, maar er verandert niets.
      tekst = `${goed ? "Goed" : "Fout"}. ${vraag.uitleg}`;
      if (goed) blip(760, 0.08, 0.04);
      else blip(220, 0.12, 0.04);
    } else if (goed) {
      const winst = beloning();
      earn(winst);
      q.streak++;
      q.correct++;
      q.best = Math.max(q.best, q.streak);
      q.nextAt = Date.now() + wachttijd() * 1000;
      tekst = `Goed. ${fmt(winst)} packets erbij. ${vraag.uitleg}`;
      chord([620, 820, 1040]);
      unlock("quiz-1");
      if (q.streak >= 10) unlock("quiz-10");
      if (q.streak >= 25) unlock("quiz-25");
    } else {
      q.wrong++;
      q.streak = 0;
      q.nextAt = Date.now() + (wachttijd() / 2) * 1000;
      tekst = `Fout. ${vraag.uitleg}`;
      blip(200, 0.16, 0.05);
      toast({ title: "Serge zucht", text: "Nog eens rustig nakijken.", icon: "📐" });
    }
    uitslag = { vraag, gekozen: optie, goed, tekst, oefen: oefenen, tot: Date.now() + UITLEG_MS };
    this.vul(root);
  },

  // Loopt alleen zolang de overhoring in beeld is.
  update(root) {
    if (uitslag) {
      if (Date.now() >= uitslag.tot) {
        uitslag = null;
        this.vul(root);
      }
      return;
    }
    if (!huidig) this.vul(root);
  },
};
