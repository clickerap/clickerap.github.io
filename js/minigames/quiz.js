// Serge's overhoring: subnetvragen, willekeurig opgesteld en zelf nagerekend.
// Goed antwoord levert packets op; een reeks goede antwoorden levert meer.

import { G, D, earn, unlock } from "../state.js";
import { fmt, fmtTime } from "../format.js";
import { toast, blip, chord } from "../ui/fx.js";

const COOLDOWN = 150; // seconden tussen twee beloonde vragen

function intToIp(n) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}
function ipToInt(ip) {
  return ip.split(".").reduce((acc, part) => ((acc << 8) + Number(part)) >>> 0, 0) >>> 0;
}
function maskInt(prefix) {
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

const GENERATORS = [
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

let huidig = null;
let beantwoord = false;

function nieuweVraag() {
  const gen = GENERATORS[rnd(GENERATORS.length)]();
  huidig = { ...gen, opties: shuffle([gen.goed, ...gen.fout]).slice(0, 4) };
  if (!huidig.opties.includes(huidig.goed)) huidig.opties[0] = huidig.goed;
  huidig.opties = shuffle(huidig.opties);
  beantwoord = false;
  return huidig;
}

function beloning() {
  const basis = Math.max(500, D.pps * 90);
  const reeks = 1 + Math.min(2, G.minigames.quiz.streak * 0.12);
  return basis * reeks * D.minigameReward;
}

export const quiz = {
  id: "quiz",
  name: "Overhoring",
  icon: "📝",
  eis: "Vraagt 5.000 packets",
  unlocked: () => G.stats.lifetime >= 5e3,
  render(root) {
    const q = G.minigames.quiz;
    const klaar = Date.now() >= (q.nextAt || 0);
    root.innerHTML = `
      <div class="labo-kop">
        <h3>Serge's overhoring</h3>
        <span>reeks ${fmt(q.streak)} · beste ${fmt(q.best)}</span>
      </div>
      <p class="labo-uitleg">Eén subnetvraag per keer. Goed antwoord levert packets op en je reeks telt door. Fout antwoord zet de reeks op nul.</p>
      <div class="vraag" id="quiz-vraag"></div>
      <div class="quiz-opties" id="quiz-opties"></div>
      <p class="melding" id="quiz-melding"></p>`;

    const vraagEl = root.querySelector("#quiz-vraag");
    const optiesEl = root.querySelector("#quiz-opties");
    const melding = root.querySelector("#quiz-melding");

    if (!klaar) {
      vraagEl.textContent = "Serge zoekt een nieuwe vraag.";
      optiesEl.innerHTML = "";
      const tik = () => {
        const over = ((q.nextAt || 0) - Date.now()) / 1000;
        if (over <= 0) {
          this.render(root);
          return;
        }
        melding.textContent = `Volgende vraag over ${fmtTime(over)}.`;
        setTimeout(tik, 1000);
      };
      tik();
      return;
    }

    const vraag = nieuweVraag();
    vraagEl.innerHTML = `<b>${vraag.vraag}</b>`;
    optiesEl.innerHTML = "";
    for (const optie of vraag.opties) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-optie";
      btn.textContent = optie;
      btn.addEventListener("click", () => {
        if (beantwoord) return;
        beantwoord = true;
        const goed = optie === vraag.goed;
        for (const knop of optiesEl.children) {
          if (knop.textContent === vraag.goed) knop.classList.add("goed");
          else if (knop === btn) knop.classList.add("fout");
        }
        if (goed) {
          const winst = beloning();
          earn(winst);
          q.streak++;
          q.correct++;
          q.best = Math.max(q.best, q.streak);
          q.nextAt = Date.now() + COOLDOWN * 1000;
          melding.classList.remove("fout");
          melding.textContent = `Goed. ${fmt(winst)} packets erbij. ${vraag.uitleg}`;
          chord([620, 820, 1040]);
          unlock("quiz-1");
          if (q.streak >= 10) unlock("quiz-10");
          if (q.streak >= 25) unlock("quiz-25");
        } else {
          q.wrong++;
          q.streak = 0;
          q.nextAt = Date.now() + (COOLDOWN / 2) * 1000;
          melding.classList.add("fout");
          melding.textContent = `Fout. ${vraag.uitleg}`;
          blip(200, 0.16, 0.05);
          toast({ title: "Serge zucht", text: "Nog eens rustig nakijken.", icon: "📐" });
        }
        setTimeout(() => this.render(root), 2600);
      });
      optiesEl.append(btn);
    }
  },
};
