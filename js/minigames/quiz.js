// Serge's overhoring: subnetvragen, willekeurig opgesteld en zelf nagerekend.
// Goed antwoord levert packets op; een reeks goede antwoorden levert meer.

import { G, D, earn, unlock } from "../state.js";
import { fmt, fmtTime } from "../format.js";
import { toast, blip, chord } from "../ui/fx.js";
import { INFO_KNOP } from "./info.js";

const COOLDOWN = 150; // seconden tussen twee beloonde vragen
const UITLEG_MS = 2600; // hoe lang het antwoord in beeld blijft

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

export const GENERATORS = [
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
];

export function nieuweVraag() {
  const gen = GENERATORS[rnd(GENERATORS.length)]();
  const opties = shuffle([gen.goed, ...gen.fout]).slice(0, 4);
  if (!opties.includes(gen.goed)) opties[0] = gen.goed;
  return { ...gen, opties: shuffle(opties) };
}

function beloning() {
  const basis = Math.max(500, D.pps * 90);
  const reeks = 1 + Math.min(2, G.minigames.quiz.streak * 0.12);
  return basis * reeks * D.minigameReward;
}

// De open vraag blijft staan tot je hem beantwoordt, ook als je even naar
// een andere opdracht gaat. Na een antwoord blijft de uitleg kort in beeld.
let huidig = null;
let uitslag = null;

export const quiz = {
  id: "quiz",
  name: "Overhoring",
  icon: "📝",
  eis: "Vraagt 5.000 packets",
  unlocked: () => G.stats.lifetime >= 5e3,
  info: [
    { kop: "Wat is het", tekst: "Serge stelt één subnetvraag tegelijk, met vier antwoorden om uit te kiezen. De hoofdstukken over IP-adressen en subnetten in de cursus helpen." },
    {
      kop: "Soorten vragen",
      punten: [
        "Het netwerkadres of het broadcastadres van een adres met een prefix.",
        "Hoeveel bruikbare hostadressen een prefix heeft.",
        "Welk subnetmasker bij een prefix hoort.",
        "Het kleinste subnet waar een aantal hosts in past.",
        "Of twee adressen in hetzelfde subnet zitten.",
      ],
    },
    {
      kop: "Beloning",
      punten: [
        "Een goed antwoord levert anderhalve minuut van je productie op, en minstens 500 packets.",
        "Elk goed antwoord op rij telt 12% extra, tot drie keer zoveel.",
        `Na een goed antwoord komt de volgende vraag na ${COOLDOWN / 60 === 2.5 ? "tweeënhalve minuut" : `${COOLDOWN} seconden`}. Na een fout antwoord wacht je half zo lang, en begint je reeks opnieuw.`,
      ],
    },
  ],

  render(root) {
    root.innerHTML = `
      <div class="labo-kop">
        <h3>Serge's overhoring</h3>
        ${INFO_KNOP}
        <span id="quiz-reeks"></span>
      </div>
      <p class="labo-uitleg">Eén subnetvraag per keer. Goed antwoord levert packets op en je reeks telt door. Fout antwoord zet de reeks op nul.</p>
      <div class="vraag" id="quiz-vraag"></div>
      <div class="quiz-opties" id="quiz-opties"></div>
      <p class="melding" id="quiz-melding" role="status"></p>`;
    this.vul(root);
  },

  vul(root) {
    const q = G.minigames.quiz;
    const vraagEl = root.querySelector("#quiz-vraag");
    const optiesEl = root.querySelector("#quiz-opties");
    const melding = root.querySelector("#quiz-melding");
    root.querySelector("#quiz-reeks").textContent = `reeks ${fmt(q.streak)} · beste ${fmt(q.best)}`;
    optiesEl.innerHTML = "";
    if (uitslag && Date.now() >= uitslag.tot) uitslag = null;

    if (uitslag) {
      vraagEl.innerHTML = "<b></b>";
      vraagEl.firstChild.textContent = uitslag.vraag.vraag;
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
    if (over > 0) {
      vraagEl.textContent = "Serge zoekt een nieuwe vraag.";
      melding.classList.remove("fout");
      melding.textContent = `Volgende vraag over ${fmtTime(over)}.`;
      return;
    }

    if (!huidig) huidig = nieuweVraag();
    vraagEl.innerHTML = "<b></b>";
    vraagEl.firstChild.textContent = huidig.vraag;
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
    if (goed) {
      const winst = beloning();
      earn(winst);
      q.streak++;
      q.correct++;
      q.best = Math.max(q.best, q.streak);
      q.nextAt = Date.now() + COOLDOWN * 1000;
      tekst = `Goed. ${fmt(winst)} packets erbij. ${vraag.uitleg}`;
      chord([620, 820, 1040]);
      unlock("quiz-1");
      if (q.streak >= 10) unlock("quiz-10");
      if (q.streak >= 25) unlock("quiz-25");
    } else {
      q.wrong++;
      q.streak = 0;
      q.nextAt = Date.now() + (COOLDOWN / 2) * 1000;
      tekst = `Fout. ${vraag.uitleg}`;
      blip(200, 0.16, 0.05);
      toast({ title: "Serge zucht", text: "Nog eens rustig nakijken.", icon: "📐" });
    }
    uitslag = { vraag, gekozen: optie, goed, tekst, tot: Date.now() + UITLEG_MS };
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
