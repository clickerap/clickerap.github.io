// Een terminal die zich gedraagt als een switch die nog opgezet moet worden.
//
// De commando's worden opgelost zoals een echte IOS-CLI dat doet: elk woord
// mag afgekort worden tot het nog eenduidig is, Tab vult aan, en ? laat zien
// wat er op deze plek mag staan. Daarnaast staat er altijd een werkopdracht
// open, zodat de terminal meer is dan een grap. Welke soorten opdrachten er
// zijn, staat in data/terminal.js.

import { G, D, earn, unlock } from "../state.js";
import { fmt, fmtTime } from "../format.js";
import { toast, chord, blip, hoverCapable } from "../ui/fx.js";
import { egg } from "../eggs.js";
import { POORTEN, TAKEN, geldigAdres, normaliseerPoort, nieuweTaak, geldigeVlan, geldigeVlannaam } from "../data/terminal.js";
import { VERSIE } from "../versie.js";
import { INFO_KNOP } from "./info.js";

const PROMPTS = {
  user: (h) => `${h}>`,
  enable: (h) => `${h}#`,
  config: (h) => `${h}(config)#`,
  iface: (h, i) => `${h}(config-if${i ? `-${i}` : ""})#`,
  vlan: (h) => `${h}(config-vlan)#`,
};

// Seconden tussen twee opdrachten; het labo in de studieboom maakt dat korter.
const COOLDOWN = 90;
const wachttijd = () => COOLDOWN * (D.laboTempo || 1);
const MAX_REGELS = 300;

// De uitvoer groeit regel voor regel. `reeks` gaat omhoog als hij geleegd of
// ingekort wordt; dan moet het scherm helemaal opnieuw, anders alleen erbij.
let uitvoer = [];
let reeks = 0;
let historie = [];
let historiePos = -1;

function schrijf(tekst, klasse = "uit") {
  uitvoer.push({ tekst, klasse });
  if (uitvoer.length > MAX_REGELS) {
    uitvoer = uitvoer.slice(-MAX_REGELS);
    reeks++;
  }
}

function leeg() {
  uitvoer = [];
  reeks++;
}

export function uitvoerRegels() {
  return uitvoer.map((r) => r.tekst);
}

function staat(cli = G.minigames.cli) {
  if (!cli.interfaces) cli.interfaces = {};
  if (!cli.hostname) cli.hostname = "SERGE";
  if (!cli.mode) cli.mode = "user";
  cli.vlans ||= {};
  // Een opdracht zonder soort komt uit een oudere versie: een adres.
  if (cli.opdracht && !cli.opdracht.soort) cli.opdracht.soort = "adres";
  return cli;
}

function poort(cli, naam) {
  if (!cli.interfaces[naam]) cli.interfaces[naam] = { ip: null, mask: null, up: false, omschrijving: null };
  return cli.interfaces[naam];
}

// --------------------------------------------------------------- Opdracht

function nieuweOpdracht(cli) {
  staat(cli);
  cli.opdracht = nieuweTaak(cli);
  cli.vorige = cli.opdracht.soort;
  return cli.opdracht;
}

const taakVan = (cli) => TAKEN[cli.opdracht?.soort] || TAKEN.adres;

export function opdrachtTekst(cli) {
  if (!cli.opdracht) return null;
  return taakVan(cli).tekst(cli.opdracht);
}

function controleerOpdracht(cli) {
  return !!cli.opdracht && taakVan(cli).klaar(staat(cli), cli.opdracht);
}

// Productie zonder tijdelijke buffs: een burst maakt een opdracht niet meer waard.
function basisPps() {
  return D.buffPps > 0 ? D.pps / D.buffPps : D.pps;
}

function beloonOpdracht(cli) {
  const seconden = taakVan(cli).seconden;
  const winst = Math.max(2500, basisPps() * seconden) * D.minigameReward;
  earn(winst);
  cli.gedaan = (cli.gedaan || 0) + 1;
  cli.nextAt = Date.now() + wachttijd() * 1000;
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

function toonCommandos(cli) {
  return {
    "ip": {
      hulp: "IP-informatie",
      kinderen: {
        "interface": { hulp: "Overzicht van de interfaces", kinderen: { brief: { hulp: "Kort overzicht", doe: () => toonPoorten(cli) } }, doe: () => toonPoorten(cli) },
        "route": { hulp: "Routeringstabel", doe: () => schrijf("Gateway of last resort is not set\n\nC    10.0.0.0/8 is directly connected, gi0/1") },
      },
    },
    "running-config": { hulp: "De huidige configuratie", doe: () => toonConfig(cli) },
    "vlan": { hulp: "De VLAN's op deze switch", kinderen: { brief: { hulp: "Kort overzicht", doe: () => toonVlans(cli) } }, doe: () => toonVlans(cli) },
    "version": { hulp: "Versie en uptime", doe: () => toonVersie() },
    "mac": { hulp: "MAC-adressen", kinderen: { "address-table": { hulp: "Geleerde adressen", doe: () => schrijf("Alle adressen zijn geleerd. En weer vergeten. En weer geleerd.") } } },
    "clock": { hulp: "De klok", doe: () => schrijf(new Date().toLocaleString("nl-BE")) },
  };
}

// Wat in de bevoorrechte modus kan. Via "do" ook vanuit de configuratie.
function execCommandos(cli) {
  return {
    "show": { hulp: "Informatie tonen", kinderen: toonCommandos(cli) },
    "ping": { hulp: "Bereikbaarheid testen", arg: "adres", doe: (a) => doePing(a[0]) },
    "write": { hulp: "Configuratie bewaren", kinderen: { memory: { hulp: "Naar startup-config", doe: () => bewaar(cli) } }, doe: () => bewaar(cli) },
    "copy": {
      hulp: "Configuratie kopiëren",
      kinderen: {
        "running-config": {
          hulp: "De huidige configuratie",
          kinderen: { "startup-config": { hulp: "Naar het opstartgeheugen", doe: () => bewaar(cli) } },
        },
      },
    },
  };
}

function grammatica(cli) {
  const gedeeld = {
    "show": { hulp: "Informatie tonen", kinderen: toonCommandos(cli) },
    "ping": { hulp: "Bereikbaarheid testen", arg: "adres", doe: (a) => doePing(a[0]) },
    "clear": { hulp: "Scherm leegmaken", doe: () => leeg() },
  };
  const interfaceKiezen = { hulp: "Een interface kiezen", arg: "naam", doe: (a) => kiesPoort(cli, a.join("")) };
  const doen = { hulp: "Een commando uit de bevoorrechte modus", kinderen: execCommandos(cli) };

  if (cli.mode === "user") {
    return { ...gedeeld, enable: { hulp: "Naar bevoorrechte modus", doe: () => { cli.mode = "enable"; schrijf("% Bevoorrechte modus actief.", "ok"); } } };
  }

  if (cli.mode === "enable") {
    return {
      ...gedeeld,
      ...execCommandos(cli),
      configure: { hulp: "Configuratiemodus", kinderen: { terminal: { hulp: "Via deze terminal", doe: () => { cli.mode = "config"; schrijf("Enter configuration commands, one per line. End with CNTL/Z."); } } } },
      disable: { hulp: "Terug naar gebruikersmodus", doe: () => { cli.mode = "user"; } },
      reload: { hulp: "Opnieuw opstarten", doe: () => schrijf("% Dat gaan we niet doen tijdens de les.", "err") },
    };
  }

  if (cli.mode === "config") {
    return {
      ...gedeeld,
      do: doen,
      interface: interfaceKiezen,
      hostname: { hulp: "De naam van dit apparaat", arg: "naam", doe: (a) => zetHostnaam(cli, a[0]) },
      vlan: { hulp: "Een VLAN maken of aanpassen", arg: "nummer", doe: (a) => kiesVlan(cli, a[0]) },
      ip: {
        hulp: "IP-instellingen van de switch",
        kinderen: { "default-gateway": { hulp: "Waar beheerverkeer naartoe gaat", arg: "adres", doe: (a) => zetGateway(cli, a[0]) } },
      },
      banner: { hulp: "Een tekst bij het inloggen", kinderen: { motd: { hulp: "Bericht van de dag", arg: "#tekst#", doe: (a) => zetBanner(cli, a.join(" ")) } } },
      enable: { hulp: "De bevoorrechte modus", kinderen: { secret: { hulp: "Beveiligen met een wachtwoord", arg: "wachtwoord", doe: (a) => zetSecret(cli, a[0]) } } },
      no: {
        hulp: "Iets ongedaan maken",
        kinderen: {
          vlan: { hulp: "Een VLAN weghalen", arg: "nummer", doe: (a) => weesVlan(cli, a[0]) },
          ip: { hulp: "IP-instellingen", kinderen: { "default-gateway": { hulp: "De gateway weghalen", doe: () => { cli.gateway = null; } } } },
          banner: { hulp: "De banner", kinderen: { motd: { hulp: "De banner weghalen", doe: () => { cli.banner = null; } } } },
        },
      },
      exit: { hulp: "Een niveau terug", doe: () => { cli.mode = "enable"; } },
      end: { hulp: "Terug naar bevoorrechte modus", doe: () => { cli.mode = "enable"; } },
    };
  }

  if (cli.mode === "vlan") {
    return {
      ...gedeeld,
      do: doen,
      name: { hulp: "De naam van dit VLAN", arg: "naam", doe: (a) => zetVlannaam(cli, a[0]) },
      vlan: { hulp: "Een ander VLAN kiezen", arg: "nummer", doe: (a) => kiesVlan(cli, a[0]) },
      interface: interfaceKiezen,
      exit: { hulp: "Terug naar de configuratie", doe: () => { cli.mode = "config"; cli.vlanId = null; } },
      end: { hulp: "Terug naar bevoorrechte modus", doe: () => { cli.mode = "enable"; cli.vlanId = null; } },
    };
  }

  // interfacemodus
  return {
    ...gedeeld,
    do: doen,
    interface: interfaceKiezen,
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
    switchport: {
      hulp: "Instellingen als switchpoort",
      kinderen: {
        mode: {
          hulp: "Access of trunk",
          kinderen: {
            access: { hulp: "Eén VLAN, voor een eindtoestel", doe: () => zetModus(cli, "access") },
            trunk: { hulp: "Alle VLAN's, naar een andere switch", doe: () => zetModus(cli, "trunk") },
          },
        },
        access: { hulp: "Het VLAN van een accesspoort", kinderen: { vlan: { hulp: "Het VLAN-nummer", arg: "nummer", doe: (a) => zetToegang(cli, a[0]) } } },
      },
    },
    description: { hulp: "Omschrijving instellen", arg: "tekst", doe: (a) => { poort(cli, cli.iface).omschrijving = a.join(" ").slice(0, 80); schrijf("% Omschrijving ingesteld. Serge waardeert dit meer dan je denkt.", "ok"); } },
    vlan: { hulp: "Een VLAN maken of aanpassen", arg: "nummer", doe: (a) => kiesVlan(cli, a[0]) },
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
  // Een secret wordt nooit leesbaar getoond, ook hier niet.
  if (cli.secret) regels.push("enable secret 5 $1$SrGe$Nv9kq0bK1wY7xL2pQ4uZ8.", "!");
  for (const [id, naam] of Object.entries(cli.vlans || {}).sort((a, b) => a[0] - b[0])) regels.push(`vlan ${id}`, ` name ${naam}`, "!");
  for (const [naam, p] of Object.entries(cli.interfaces)) {
    regels.push(`interface ${naam}`);
    if (p.omschrijving) regels.push(` description ${p.omschrijving}`);
    if (p.modus) regels.push(` switchport mode ${p.modus}`);
    if (p.vlan) regels.push(` switchport access vlan ${p.vlan}`);
    regels.push(p.ip ? ` ip address ${p.ip} ${p.mask}` : " no ip address");
    regels.push(p.up ? " no shutdown" : " shutdown", "!");
  }
  if (cli.gateway) regels.push(`ip default-gateway ${cli.gateway}`, "!");
  if (cli.banner) regels.push(`banner motd ^C${cli.banner}^C`, "!");
  regels.push("end");
  schrijf(regels.join("\n"));
}

function toonVlans(cli) {
  const inVlan = (id) => POORTEN.filter((p) => (cli.interfaces[p]?.vlan || 1) === id && cli.interfaces[p]?.modus !== "trunk").join(", ");
  const regels = ["VLAN Name                             Status    Ports", "---- -------------------------------- --------- -------------------------------"];
  regels.push(`${"1".padEnd(5)}${"default".padEnd(33)}${"active".padEnd(10)}${inVlan(1)}`);
  for (const [id, naam] of Object.entries(cli.vlans || {}).sort((a, b) => a[0] - b[0])) {
    regels.push(`${String(id).padEnd(5)}${naam.padEnd(33)}${"active".padEnd(10)}${inVlan(Number(id))}`);
  }
  schrijf(regels.join("\n"));
}

function toonVersie() {
  schrijf(
    `Serge Clicker CLI, versie ${VERSIE}\nUptime: ${Math.floor(G.stats.playTime / 60)} minuten\nProductie: ${fmt(D.pps)} packets/seconde\nApparaten: ${fmt(D.totalBuildings)}`
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
  if (!p) return schrijf(`% Onbekende interface. Deze switch heeft ${POORTEN[0]} tot en met ${POORTEN[POORTEN.length - 1]}.`, "err");
  poort(cli, p);
  cli.iface = p;
  cli.vlanId = null;
  cli.mode = "iface";
}

// Zoals op een echt apparaat: begint met een letter, dan letters, cijfers en
// streepjes.
function zetHostnaam(cli, naam) {
  if (!/^[a-z][a-z0-9-]{0,15}$/i.test(naam || "")) {
    return schrijf("% Een hostnaam begint met een letter en bevat alleen letters, cijfers en streepjes, hooguit 16.", "err");
  }
  cli.hostname = naam.toUpperCase();
}

function leesVlan(tekst) {
  const id = Number(tekst);
  return String(tekst || "").match(/^\d+$/) ? id : NaN;
}

function kiesVlan(cli, tekst) {
  const id = leesVlan(tekst);
  if (id === 1) return schrijf("% VLAN 1 is het standaard-VLAN; dat pas je niet aan.", "err");
  if (!geldigeVlan(id)) return schrijf("% Een VLAN-nummer ligt tussen 2 en 4094.", "err");
  cli.vlans ||= {};
  cli.vlans[id] ??= `VLAN${String(id).padStart(4, "0")}`;
  cli.vlanId = id;
  cli.iface = null;
  cli.mode = "vlan";
}

function weesVlan(cli, tekst) {
  const id = leesVlan(tekst);
  if (!cli.vlans?.[id]) return schrijf("% Dat VLAN bestaat niet.", "err");
  delete cli.vlans[id];
  schrijf(`% VLAN ${id} verwijderd. Poorten die erin zaten, zitten nu in geen enkel VLAN.`);
}

function zetVlannaam(cli, naam) {
  if (!geldigeVlannaam(naam || "")) return schrijf("% Een VLAN-naam is één woord: letters, cijfers, - en _, hooguit 32.", "err");
  cli.vlans[cli.vlanId] = naam;
}

function zetModus(cli, modus) {
  const p = poort(cli, cli.iface);
  p.modus = modus;
  if (modus === "trunk") delete p.vlan;
}

function zetToegang(cli, tekst) {
  const id = leesVlan(tekst);
  if (!geldigeVlan(id) && id !== 1) return schrijf("% Een VLAN-nummer ligt tussen 1 en 4094.", "err");
  const p = poort(cli, cli.iface);
  if (p.modus === "trunk") return schrijf("% Dit is een trunkpoort. Zet hem eerst op switchport mode access.", "err");
  if (id !== 1 && !cli.vlans[id]) {
    cli.vlans[id] = `VLAN${String(id).padStart(4, "0")}`;
    schrijf(`% Access VLAN does not exist. Creating vlan ${id}`);
  }
  if (id === 1) delete p.vlan;
  else p.vlan = id;
}

function zetGateway(cli, ip) {
  if (!geldigAdres(ip)) return schrijf("% Dat is geen geldig adres.", "err");
  cli.gateway = ip;
}

// banner motd #tekst#: het eerste teken is het scheidingsteken, de tekst loopt
// tot hetzelfde teken nog eens komt.
function zetBanner(cli, rest) {
  const tekst = String(rest || "").trim();
  if (!tekst) return schrijf("% banner motd #tekst#", "err");
  const teken = tekst[0];
  const eind = tekst.indexOf(teken, 1);
  const inhoud = (eind === -1 ? tekst.slice(1) : tekst.slice(1, eind)).trim().slice(0, 120);
  if (!inhoud) return schrijf("% De banner is leeg.", "err");
  cli.banner = inhoud;
  schrijf("% Banner ingesteld. Wie inlogt, ziet hem voortaan eerst.", "ok");
}

function zetSecret(cli, wachtwoord) {
  if (!wachtwoord) return schrijf("% enable secret <wachtwoord>", "err");
  if (wachtwoord.toLowerCase() === "cisco") {
    schrijf("% 'cisco' als wachtwoord? Serge fronst, maar zet het toch.", "err");
    egg("egg-cisco", "Vendor lock-in", "Standaardwachtwoorden zijn geen wachtwoorden.", D.pps * 45);
  }
  // Het wachtwoord zelf bewaren we niet; alleen dat er een is.
  cli.secret = true;
  schrijf("% De bevoorrechte modus is beveiligd.", "ok");
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

export function verwerk(regel, cli) {
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
// De uitvoer wordt alleen bijgewerkt als er iets bij kwam, en alleen dan
// scrollt hij mee naar onderen. Zo kun je terugscrollen en tekst selecteren.

let getekend = { reeks: -1, aantal: 0 };

function tekenUitvoer(root) {
  const uitEl = root.querySelector("#term-uit");
  const term = root.querySelector("#term");
  if (!uitEl) return;
  if (getekend.reeks !== reeks) {
    uitEl.innerHTML = "";
    getekend = { reeks, aantal: 0 };
  }
  if (getekend.aantal === uitvoer.length) return;
  const nieuw = document.createDocumentFragment();
  for (const regel of uitvoer.slice(getekend.aantal)) {
    const div = document.createElement("div");
    div.className = regel.klasse;
    div.textContent = regel.tekst;
    nieuw.append(div);
  }
  uitEl.append(nieuw);
  getekend.aantal = uitvoer.length;
  term.scrollTop = term.scrollHeight;
}

export const terminal = {
  id: "cli",
  eis: "Vraagt een switch",
  unlocked: () => (G.buildings.switch || 0) >= 1,
  name: "Terminal",
  icon: "⌨️",
  info: [
    { kop: "Wat is het", tekst: "Een switch die je opzet zoals een echte Cisco-switch: via de commandoregel. Bovenaan staat altijd een opdracht. Hoe meer je er afwerkt, hoe meer soorten er komen: adressen, namen, VLAN's, beveiliging en foutzoeken." },
    {
      kop: "De basis",
      punten: [
        "`enable` (kort: `en`) brengt je naar de bevoorrechte modus.",
        "`configure terminal` (`conf t`) opent de configuratiemodus.",
        "`interface gi0/3` (`int gi0/3`) kiest een poort.",
        "`end`, en dan `write memory` (`wr`), bewaart de configuratie. Pas dan kijkt Serge de opdracht na.",
      ],
    },
    {
      kop: "Wat je nodig hebt",
      punten: [
        "Op een poort: `ip address 10.20.30.1 255.255.255.0`, `no shutdown` of `shutdown`, `description Printer B.204`.",
        "Een poort in een VLAN: `switchport mode access` en dan `switchport access vlan 20`.",
        "In de configuratie: `hostname SW-AULA`, `vlan 20` en daarna `name LEERLINGEN`.",
        "Ook in de configuratie: `ip default-gateway 10.1.1.254`, `banner motd #Alleen voor bevoegden#` en `enable secret <wachtwoord>`.",
        "Bij foutzoeken tonen `show ip interface brief`, `show running-config` en `show vlan brief` wat er mis is.",
      ],
    },
    {
      kop: "Handig",
      punten: [
        "Elk woord mag je afkorten zolang het nog eenduidig is.",
        "Tab vult een woord aan, `?` toont wat er op die plek mag staan. Op een telefoon staan ze als knoppen onder de terminal.",
        "`show ip interface brief` toont alle poorten, `show running-config` de hele configuratie.",
        "Met de pijltjes omhoog en omlaag haal je vorige commando's terug.",
      ],
    },
    { kop: "Beloning", tekst: `Een afgewerkte opdracht levert anderhalve tot drieënhalve minuut van je productie op, naargelang hoe moeilijk hij is, en minstens 2.500 packets. De volgende opdracht komt ${COOLDOWN} seconden later.` },
  ],

  render(root) {
    const cli = staat();
    if (!cli.opdracht && Date.now() >= (cli.nextAt || 0)) nieuweOpdracht(cli);

    if (!uitvoer.length) {
      schrijf("Serge Clicker CLI — afkortingen werken, Tab vult aan, ? toont de mogelijkheden.");
      schrijf("Begin met 'en', dan 'conf t'.");
    }

    root.innerHTML = `
      <div class="labo-kop">
        <h3>Terminal</h3>
        ${INFO_KNOP}
        <span id="term-status"></span>
      </div>
      <p class="labo-uitleg" id="term-opdracht"></p>
      <div class="terminal" id="term">
        <div id="term-uit" role="log" aria-label="Uitvoer van de terminal"></div>
        <div class="terminal-regel">
          <span id="prompt"></span>
          <input id="term-in" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Commando" />
        </div>
      </div>
      ${hoverCapable ? "" : `<div class="term-knoppen">
        <button type="button" class="btn ghost small" data-toets="Tab">Tab</button>
        <button type="button" class="btn ghost small" data-toets="?">?</button>
      </div>`}`;

    const term = root.querySelector("#term");
    const invoer = root.querySelector("#term-in");

    const toets = (naam) => {
      if (naam === "Tab") {
        const { regel, opties } = vulAan(invoer.value, cli);
        invoer.value = regel;
        if (opties.length) {
          schrijf(`${PROMPTS[cli.mode](cli.hostname, cli.iface)} ${invoer.value}`, "in");
          toonHulp(opties);
        }
      } else if (naam === "?") {
        schrijf(`${PROMPTS[cli.mode](cli.hostname, cli.iface)} ${invoer.value}?`, "in");
        toonHulp(hulpVoor(invoer.value, cli));
      }
      this.update(root);
    };

    term.addEventListener("click", (e) => {
      // Tekst selecteren in de uitvoer mag; alleen een gewone klik zet de
      // cursor terug in de invoer.
      if (e.target !== invoer && !String(window.getSelection?.() || "")) invoer.focus();
    });

    for (const knop of root.querySelectorAll("[data-toets]")) {
      knop.addEventListener("click", () => {
        toets(knop.dataset.toets);
        invoer.focus();
      });
    }

    invoer.addEventListener("keydown", (e) => {
      if (e.key === "Tab" || e.key === "?") {
        e.preventDefault();
        toets(e.key);
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
        this.update(root);
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

    getekend = { reeks: -1, aantal: 0 };
    this.update(root);
  },

  // Elke seconde: statusregel, opdracht en prompt. De uitvoer alleen als er
  // iets bij kwam.
  update(root) {
    const cli = staat();
    if (!cli.opdracht && Date.now() >= (cli.nextAt || 0)) {
      nieuweOpdracht(cli);
      schrijf("% Serge heeft een nieuwe opdracht uitgeschreven.", "ok");
    }
    tekenUitvoer(root);
    const prompt = root.querySelector("#prompt");
    const statusEl = root.querySelector("#term-status");
    const opdrachtEl = root.querySelector("#term-opdracht");
    if (!prompt) return;
    const promptTekst = PROMPTS[cli.mode](cli.hostname, cli.iface);
    if (prompt.textContent !== promptTekst) prompt.textContent = promptTekst;
    const up = Object.values(cli.interfaces).filter((p) => p.up).length;
    const status = `${up} ${up === 1 ? "poort" : "poorten"} up · ${cli.gedaan || 0} ${(cli.gedaan || 0) === 1 ? "opdracht" : "opdrachten"}`;
    if (statusEl.textContent !== status) statusEl.textContent = status;
    if (cli.opdracht) {
      const tekst = opdrachtTekst(cli);
      if (opdrachtEl.dataset.tekst !== tekst) {
        opdrachtEl.dataset.tekst = tekst;
        opdrachtEl.innerHTML = "<strong></strong> <span></span>";
        opdrachtEl.querySelector("strong").textContent = `${taakVan(cli).naam}.`;
        opdrachtEl.querySelector("span").textContent = tekst;
      }
    } else {
      const over = ((cli.nextAt || 0) - Date.now()) / 1000;
      opdrachtEl.dataset.tekst = "";
      opdrachtEl.textContent = over > 0
        ? `Serge schrijft een nieuwe opdracht uit. Nog ${fmtTime(over)}.`
        : "Serge denkt na over je volgende opdracht.";
    }
  },
};
