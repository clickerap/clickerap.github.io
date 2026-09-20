// Een terminal die zich gedraagt als een switch die nog opgezet moet worden.
//
// De commando's worden opgelost zoals een echte IOS-CLI dat doet: elk woord
// mag afgekort worden tot het nog eenduidig is, Tab vult aan, en ? laat zien
// wat er op deze plek mag staan. Daarnaast staat er altijd een werkopdracht
// open, zodat de terminal meer is dan een grap.

import { G, D, earn, unlock } from "../state.js";
import { fmt, fmtTime } from "../format.js";
import { toast, chord, blip } from "../ui/fx.js";
import { egg } from "../eggs.js";

const PROMPTS = {
  user: (h) => `${h}>`,
  enable: (h) => `${h}#`,
  config: (h) => `${h}(config)#`,
  iface: (h, i) => `${h}(config-if${i ? `-${i}` : ""})#`,
};

const POORTEN = ["gi0/1", "gi0/2", "gi0/3", "gi0/4", "gi0/5", "gi0/6", "gi0/7", "gi0/8"];
const COOLDOWN = 150;

let uitvoer = [];
let historie = [];
let historiePos = -1;

function schrijf(tekst, klasse = "uit") {
  uitvoer.push({ tekst, klasse });
  if (uitvoer.length > 300) uitvoer = uitvoer.slice(-300);
}

function staat() {
  const cli = G.minigames.cli;
  if (!cli.interfaces) cli.interfaces = {};
  if (!cli.hostname) cli.hostname = "SERGE";
  if (!cli.mode) cli.mode = "user";
  return cli;
}

function poort(cli, naam) {
  if (!cli.interfaces[naam]) cli.interfaces[naam] = { ip: null, mask: null, up: false, omschrijving: null };
  return cli.interfaces[naam];
}

// gi0/1, g0/1, gig0/1 en GigabitEthernet0/1 zijn hetzelfde ding.
function normaliseerPoort(tekst) {
  const m = String(tekst).toLowerCase().match(/^(?:g|gi|gig|gigabit|gigabitethernet)\s*(\d+\/\d+)$/);
  return m ? `gi${m[1]}` : null;
}

function geldigAdres(tekst) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(tekst) && tekst.split(".").every((d) => Number(d) <= 255);
}

// --------------------------------------------------------------- Opdracht

function nieuweOpdracht(cli) {
  const vrij = POORTEN.filter((p) => !cli.interfaces[p]?.up);
  const naam = vrij.length ? vrij[Math.floor(Math.random() * vrij.length)] : POORTEN[Math.floor(Math.random() * POORTEN.length)];
  const derde = 1 + Math.floor(Math.random() * 250);
  cli.opdracht = {
    poort: naam,
    ip: `10.${derde}.${1 + Math.floor(Math.random() * 250)}.1`,
    mask: "255.255.255.0",
  };
  return cli.opdracht;
}

export function opdrachtTekst(cli) {
  if (!cli.opdracht) return null;
  const o = cli.opdracht;
  return `Zet ${o.poort} op ${o.ip} ${o.mask}, breng hem up en bewaar de configuratie.`;
}

function controleerOpdracht(cli) {
  const o = cli.opdracht;
  if (!o) return false;
  const p = cli.interfaces[o.poort];
  return !!(p && p.ip === o.ip && p.mask === o.mask && p.up);
}

function beloonOpdracht(cli) {
  const winst = Math.max(2500, D.pps * 120) * D.minigameReward;
  earn(winst);
  cli.gedaan = (cli.gedaan || 0) + 1;
  cli.nextAt = Date.now() + COOLDOWN * 1000;
  cli.opdracht = null;
  schrijf(`% Opdracht afgerond: ${fmt(winst)} packets`, "ok");
  chord([620, 820, 1040]);
  unlock("cli-config");
  if (cli.gedaan >= 10) unlock("cli-tien");
  toast({ title: "Opdracht afgerond", text: `${fmt(winst)} packets. Serge kijkt het na en knikt.`, icon: "⌨️", tone: "goed" });
}

// -------------------------------------------------------------- Grammatica
// Elke tak is een woord dat hier mag staan. `arg` betekent: hierna volgt
// iets vrijs (een naam, een adres). `doe` voert het uit.

function grammatica(cli) {
  const tonen = {
    "ip": {
      hulp: "IP-informatie",
      kinderen: {
        "interface": { hulp: "Overzicht van de interfaces", kinderen: { brief: { hulp: "Kort overzicht", doe: () => toonPoorten(cli) } }, doe: () => toonPoorten(cli) },
        "route": { hulp: "Routeringstabel", doe: () => schrijf("Gateway of last resort is not set\n\nC    10.0.0.0/8 is directly connected, gi0/1") },
      },
    },
    "running-config": { hulp: "De huidige configuratie", doe: () => toonConfig(cli) },
    "version": { hulp: "Versie en uptime", doe: () => toonVersie() },
    "mac": { hulp: "MAC-adressen", kinderen: { "address-table": { hulp: "Geleerde adressen", doe: () => schrijf("Alle adressen zijn geleerd. En weer vergeten. En weer geleerd.") } } },
    "clock": { hulp: "De klok", doe: () => schrijf(new Date().toLocaleString("nl-BE")) },
  };

  const gedeeld = {
    "show": { hulp: "Informatie tonen", kinderen: tonen },
    "ping": { hulp: "Bereikbaarheid testen", arg: "adres", doe: (a) => doePing(a[0]) },
    "clear": { hulp: "Scherm leegmaken", doe: () => { uitvoer = []; } },
  };

  if (cli.mode === "user") {
    return { ...gedeeld, enable: { hulp: "Naar bevoorrechte modus", doe: () => { cli.mode = "enable"; schrijf("% Bevoorrechte modus actief.", "ok"); } } };
  }

  if (cli.mode === "enable") {
    return {
      ...gedeeld,
      configure: { hulp: "Configuratiemodus", kinderen: { terminal: { hulp: "Via deze terminal", doe: () => { cli.mode = "config"; schrijf("Enter configuration commands, one per line. End with CNTL/Z."); } } } },
      write: { hulp: "Configuratie bewaren", kinderen: { memory: { hulp: "Naar startup-config", doe: () => bewaar(cli) } }, doe: () => bewaar(cli) },
      disable: { hulp: "Terug naar gebruikersmodus", doe: () => { cli.mode = "user"; } },
      reload: { hulp: "Opnieuw opstarten", doe: () => schrijf("% Dat gaan we niet doen tijdens de les.", "err") },
    };
  }

  if (cli.mode === "config") {
    return {
      ...gedeeld,
      interface: { hulp: "Een interface kiezen", arg: "naam", doe: (a) => kiesPoort(cli, a[0]) },
      hostname: { hulp: "De naam van dit apparaat", arg: "naam", doe: (a) => { cli.hostname = (a[0] || "SERGE").slice(0, 16).toUpperCase(); } },
      exit: { hulp: "Een niveau terug", doe: () => { cli.mode = "enable"; } },
      end: { hulp: "Terug naar bevoorrechte modus", doe: () => { cli.mode = "enable"; } },
    };
  }

  // interfacemodus
  return {
    ...gedeeld,
    ip: { hulp: "Adressering", kinderen: { address: { hulp: "Adres en masker instellen", arg: "adres masker", doe: (a) => zetAdres(cli, a) } } },
    no: {
      hulp: "Iets ongedaan maken",
      kinderen: {
        shutdown: { hulp: "De interface aanzetten", doe: () => zetUp(cli, true) },
        "ip": { hulp: "Adres weghalen", kinderen: { address: { hulp: "Adres weghalen", doe: () => { const p = poort(cli, cli.iface); p.ip = null; p.mask = null; schrijf("% Adres verwijderd."); } } } },
        description: { hulp: "Omschrijving weghalen", doe: () => { poort(cli, cli.iface).omschrijving = null; } },
      },
    },
    shutdown: { hulp: "De interface uitzetten", doe: () => zetUp(cli, false) },
    description: { hulp: "Omschrijving instellen", arg: "tekst", doe: (a) => { poort(cli, cli.iface).omschrijving = a.join(" "); schrijf("% Omschrijving ingesteld. Serge waardeert dit meer dan je denkt.", "ok"); } },
    exit: { hulp: "Een niveau terug", doe: () => { cli.mode = "config"; cli.iface = null; } },
    end: { hulp: "Terug naar bevoorrechte modus", doe: () => { cli.mode = "enable"; cli.iface = null; } },
  };
}

// ------------------------------------------------------------- Uitvoeren

function toonPoorten(cli) {
  schrijf("Interface  IP-Address      Status  Protocol");
  const namen = Object.keys(cli.interfaces);
  if (!namen.length) {
    schrijf(`${"gi0/1".padEnd(11)}${"unassigned".padEnd(16)}${"down".padEnd(8)}down`);
    return;
  }
  for (const naam of namen.sort()) {
    const p = cli.interfaces[naam];
    schrijf(`${naam.padEnd(11)}${(p.ip || "unassigned").padEnd(16)}${(p.up ? "up" : "down").padEnd(8)}${p.up ? "up" : "down"}`);
  }
}

function toonConfig(cli) {
  const regels = [`hostname ${cli.hostname}`, "!"];
  for (const [naam, p] of Object.entries(cli.interfaces)) {
    regels.push(`interface ${naam}`);
    if (p.omschrijving) regels.push(` description ${p.omschrijving}`);
    regels.push(p.ip ? ` ip address ${p.ip} ${p.mask}` : " no ip address");
    regels.push(p.up ? " no shutdown" : " shutdown", "!");
  }
  regels.push("end");
  schrijf(regels.join("\n"));
}

function toonVersie() {
  schrijf(
    `Serge Clicker CLI, versie 2.0\nUptime: ${Math.floor(G.stats.playTime / 60)} minuten\nProductie: ${fmt(D.pps)} packets/seconde\nApparaten: ${fmt(D.totalBuildings)}`
  );
}

function doePing(doel = "8.8.8.8") {
  if (!geldigAdres(doel)) return schrijf("% Dat is geen geldig adres.", "err");
  for (let i = 0; i < 4; i++) {
    schrijf(`Reply from ${doel}: bytes=32 time=${1 + Math.floor(Math.random() * 12)}ms TTL=${118 + Math.floor(Math.random() * 8)}`);
  }
  schrijf("Success rate is 100 percent (4/4)", "ok");
  egg("egg-ping", "Reply from 8.8.8.8", "Het werkt. Het werkt altijd, tot het niet werkt.", D.pps * 30);
}

function kiesPoort(cli, naam) {
  const p = normaliseerPoort(naam || "");
  if (!p) return schrijf("% Onbekende interface. Probeer gi0/1.", "err");
  poort(cli, p);
  cli.iface = p;
  cli.mode = "iface";
}

function zetAdres(cli, args) {
  const [ip, mask] = args;
  if (!ip || !mask) return schrijf("% ip address <adres> <masker>", "err");
  if (!geldigAdres(ip) || !geldigAdres(mask)) return schrijf("% Dat is geen geldig adres of masker.", "err");
  const p = poort(cli, cli.iface);
  p.ip = ip;
  p.mask = mask;
  schrijf("% Adres ingesteld.", "ok");
}

function zetUp(cli, aan) {
  const p = poort(cli, cli.iface);
  if (aan && p.up) {
    schrijf("% Die stond al aan.", "err");
    egg("egg-noshut", "no shutdown", "Een interface die al aanstond nog eens aanzetten.", D.pps * 40);
    return;
  }
  p.up = aan;
  schrijf(
    aan
      ? `%LINK-3-UPDOWN: Interface ${cli.iface}, changed state to up`
      : `%LINK-5-CHANGED: Interface ${cli.iface}, changed state to administratively down`,
    aan ? "ok" : "uit"
  );
}

function bewaar(cli) {
  schrijf("Building configuration...\n[OK]", "ok");
  if (controleerOpdracht(cli)) {
    beloonOpdracht(cli);
  } else if (cli.opdracht) {
    schrijf(`% De opdracht is nog niet af: ${opdrachtTekst(cli)}`, "err");
  }
}

// ------------------------------------------------- Woorden oplossen en Tab

function kandidaten(knoop, woord) {
  const keys = Object.keys(knoop || {});
  if (!woord) return keys;
  const exact = keys.filter((k) => k === woord);
  return exact.length ? exact : keys.filter((k) => k.startsWith(woord));
}

function gemeenschappelijk(lijst) {
  if (!lijst.length) return "";
  let prefix = lijst[0];
  for (const woord of lijst.slice(1)) {
    while (!woord.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

// Loopt de ingetypte woorden langs de boom. Geeft terug waar je uitkomt.
// Sleutelwoorden worden kleingeschreven vergeleken, maar wat er als vrije
// tekst achteraan staat houdt zijn hoofdletters.
function volg(boom, woorden, origineel = woorden) {
  let knoop = { kinderen: boom };
  const pad = [];
  for (let i = 0; i < woorden.length; i++) {
    const woord = woorden[i];
    if (!knoop.kinderen) return { knoop, pad, rest: origineel.slice(i), status: "arg" };
    const opties = kandidaten(knoop.kinderen, woord);
    if (!opties.length) return { knoop, pad, rest: origineel.slice(i), status: "onbekend" };
    if (opties.length > 1) return { knoop, pad, rest: origineel.slice(i), status: "dubbelzinnig", opties };
    pad.push(opties[0]);
    knoop = knoop.kinderen[opties[0]];
    if (knoop.arg) return { knoop, pad, rest: origineel.slice(i + 1), status: "arg" };
  }
  return { knoop, pad, rest: [], status: "ok" };
}

export function vulAan(regel, cli) {
  const eindigtOpSpatie = /\s$/.test(regel);
  const woorden = regel.trim().split(/\s+/).filter(Boolean);
  const boom = grammatica(cli);
  const gedaan = eindigtOpSpatie ? woorden : woorden.slice(0, -1);
  const deel = eindigtOpSpatie ? "" : woorden[woorden.length - 1] || "";

  const plek = volg(boom, gedaan);
  if (plek.status !== "ok" || !plek.knoop.kinderen) return { regel, opties: [] };

  const opties = kandidaten(plek.knoop.kinderen, deel);
  if (!opties.length) return { regel, opties: [] };
  if (opties.length === 1) {
    return { regel: [...gedaan, opties[0]].join(" ") + " ", opties: [] };
  }
  const prefix = gemeenschappelijk(opties);
  return {
    regel: prefix.length > deel.length ? [...gedaan, prefix].join(" ") : regel,
    opties: opties.map((o) => [o, plek.knoop.kinderen[o].hulp || ""]),
  };
}

export function hulpVoor(regel, cli) {
  const eindigtOpSpatie = /\s$/.test(regel);
  const woorden = regel.trim().split(/\s+/).filter(Boolean);
  const gedaan = eindigtOpSpatie ? woorden : woorden.slice(0, -1);
  const deel = eindigtOpSpatie ? "" : woorden[woorden.length - 1] || "";
  const plek = volg(grammatica(cli), gedaan);
  if (plek.status === "arg" && plek.knoop.arg) return [[`<${plek.knoop.arg}>`, "vrij in te vullen"]];
  if (!plek.knoop.kinderen) return [];
  return kandidaten(plek.knoop.kinderen, deel).map((k) => [k, plek.knoop.kinderen[k].hulp || ""]);
}

// -------------------------------------------------------------- Invoerregel

function verwerk(regel, cli) {
  const invoer = regel.trim();
  if (!invoer) return;
  const laag = invoer.toLowerCase();
  schrijf(`${PROMPTS[cli.mode](cli.hostname, cli.iface)} ${invoer}`, "in");
  unlock("cli-1");

  // Dingen die niet in de handleiding staan.
  if (laag.startsWith("sudo")) {
    schrijf("% Dit is geen Linux. Serge kijkt op van zijn scherm.", "err");
    return egg("egg-sudo", "sudo", "Verkeerd besturingssysteem, juiste instelling.", D.pps * 60);
  }
  if (laag === "cisco" || laag === "cisco cisco") {
    schrijf("% Wachtwoord 'cisco' op een productieapparaat. Serge kijkt teleurgesteld.", "err");
    return egg("egg-cisco", "Vendor lock-in", "Standaardwachtwoorden zijn geen wachtwoorden.", D.pps * 45);
  }
  if (laag.startsWith("rm -rf")) {
    schrijf("% Weet je het zeker? ... Te laat.", "err");
    schrijf("% Grapje. Er is niets weg. Wel iets geleerd.");
    return egg("egg-rm", "rm -rf /", "Op een switch valt er gelukkig weinig te verwijderen.", D.pps * 120);
  }
  if (laag === "?" || laag === "help") {
    toonHulp(hulpVoor("", cli));
    return;
  }

  const plek = volg(grammatica(cli), laag.split(/\s+/), invoer.split(/\s+/));

  if (plek.status === "dubbelzinnig") {
    schrijf(`% Ambiguous command: "${plek.rest[0]}" — ${plek.opties.join(", ")}`, "err");
    return;
  }
  if (plek.status === "onbekend") {
    schrijf(`% Invalid input detected at "${plek.rest[0]}". Typ ? voor de mogelijkheden.`, "err");
    blip(220, 0.08, 0.04);
    return;
  }
  if (plek.status === "arg") {
    if (!plek.knoop.doe) return schrijf("% Incomplete command.", "err");
    plek.knoop.doe(plek.rest);
    return;
  }
  if (!plek.knoop.doe) {
    schrijf("% Incomplete command. Mogelijk vervolg:", "err");
    toonHulp(Object.entries(plek.knoop.kinderen || {}).map(([k, v]) => [k, v.hulp || ""]));
    return;
  }
  plek.knoop.doe([]);
}

function toonHulp(paren) {
  if (!paren.length) return schrijf("% Hier valt niets meer in te vullen.", "err");
  schrijf(paren.map(([woord, hulp]) => `  ${woord.padEnd(18)}${hulp}`).join("\n"));
}

// ------------------------------------------------------------------ Paneel

export const terminal = {
  id: "cli",
  eis: "Vraagt een switch",
  unlocked: () => (G.buildings.switch || 0) >= 1,
  name: "Terminal",
  icon: "⌨️",
  stop() {
    clearInterval(this.tikker);
    this.tikker = null;
  },
  render(root) {
    clearInterval(this.tikker);
    const cli = staat();
    const klaarVoorOpdracht = Date.now() >= (cli.nextAt || 0);
    if (!cli.opdracht && klaarVoorOpdracht) nieuweOpdracht(cli);

    if (!uitvoer.length) {
      schrijf("Serge Clicker CLI — afkortingen werken, Tab vult aan, ? toont de mogelijkheden.");
      schrijf("Begin met 'en', dan 'conf t'.");
    }

    root.innerHTML = `
      <div class="labo-kop">
        <h3>Terminal</h3>
        <span id="term-status"></span>
      </div>
      <p class="labo-uitleg" id="term-opdracht"></p>
      <div class="terminal" id="term">
        <div id="term-uit"></div>
        <div class="terminal-regel">
          <span id="prompt"></span>
          <input id="term-in" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Commando" />
        </div>
      </div>`;

    const term = root.querySelector("#term");
    const uitvoerEl = root.querySelector("#term-uit");
    const statusEl = root.querySelector("#term-status");
    const opdrachtEl = root.querySelector("#term-opdracht");
    const invoer = root.querySelector("#term-in");
    const prompt = root.querySelector("#prompt");

    const teken = () => {
      uitvoerEl.innerHTML = uitvoer
        .map((r) => `<div class="${r.klasse}">${r.tekst.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]))}</div>`)
        .join("");
      term.scrollTop = term.scrollHeight;
      prompt.textContent = PROMPTS[cli.mode](cli.hostname, cli.iface);
      const up = Object.values(cli.interfaces).filter((p) => p.up).length;
      statusEl.textContent = `${up} ${up === 1 ? "poort" : "poorten"} up · ${cli.gedaan || 0} ${(cli.gedaan || 0) === 1 ? "opdracht" : "opdrachten"}`;
      if (cli.opdracht) {
        opdrachtEl.innerHTML = `<strong>Opdracht.</strong> ${opdrachtTekst(cli)}`;
      } else {
        const over = ((cli.nextAt || 0) - Date.now()) / 1000;
        opdrachtEl.textContent = over > 0
          ? `Serge schrijft een nieuwe opdracht uit. Nog ${fmtTime(over)}.`
          : "Serge denkt na over je volgende opdracht.";
      }
    };

    term.addEventListener("click", (e) => {
      if (e.target !== invoer) invoer.focus();
    });

    invoer.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const { regel, opties } = vulAan(invoer.value, cli);
        invoer.value = regel;
        if (opties.length) {
          schrijf(`${PROMPTS[cli.mode](cli.hostname, cli.iface)} ${invoer.value}`, "in");
          toonHulp(opties);
          teken();
        }
        return;
      }
      if (e.key === "?") {
        e.preventDefault();
        schrijf(`${PROMPTS[cli.mode](cli.hostname, cli.iface)} ${invoer.value}?`, "in");
        toonHulp(hulpVoor(invoer.value, cli));
        teken();
        return;
      }
      if (e.key === "Enter") {
        const regel = invoer.value;
        if (regel.trim()) {
          historie.unshift(regel);
          historie = historie.slice(0, 40);
        }
        historiePos = -1;
        verwerk(regel, cli);
        invoer.value = "";
        teken();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        historiePos = Math.min(historie.length - 1, historiePos + 1);
        invoer.value = historie[historiePos] || "";
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        historiePos = Math.max(-1, historiePos - 1);
        invoer.value = historiePos === -1 ? "" : historie[historiePos];
      }
    });

    teken();
    this.tikker = setInterval(teken, 1000);
  },
};
