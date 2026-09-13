// Een terminal die zich gedraagt als een switch die je nog moet opzetten.
// De echte commando's werken; sommige andere ook, maar anders dan je denkt.

import { G, D, earn, unlock } from "../state.js";
import { fmt } from "../format.js";
import { toast, chord, blip } from "../ui/fx.js";
import { egg } from "../eggs.js";

const PROMPTS = {
  user: (h) => `${h}>`,
  enable: (h) => `${h}#`,
  config: (h) => `${h}(config)#`,
  iface: (h) => `${h}(config-if)#`,
};

let uitvoer = [];
let historie = [];
let historiePos = -1;

function schrijf(tekst, klasse = "uit") {
  uitvoer.push({ tekst, klasse });
  if (uitvoer.length > 200) uitvoer = uitvoer.slice(-200);
}

function beloon(bedrag, reden) {
  const winst = bedrag * D.minigameReward;
  earn(winst);
  schrijf(`% ${reden}: ${fmt(winst)} packets`, "ok");
  chord([680, 900]);
}

const HELP = [
  "Beschikbare commando's:",
  "  enable                — bevoorrechte modus",
  "  configure terminal    — configuratiemodus",
  "  interface gi0/1       — interface kiezen",
  "  ip address <ip> <mask> — adres instellen",
  "  no shutdown           — interface aanzetten",
  "  description <tekst>   — omschrijving",
  "  exit                  — een niveau terug",
  "  show ip int brief     — poortoverzicht",
  "  show running-config   — de configuratie",
  "  show version          — wat hier draait",
  "  ping <ip>             — bereikbaarheid",
  "  write memory          — configuratie bewaren",
  "  clear                 — scherm leegmaken",
].join("\n");

function verwerk(regel, cli) {
  const invoer = regel.trim();
  const laag = invoer.toLowerCase();
  const woorden = laag.split(/\s+/);
  const cmd = woorden[0];

  if (!invoer) return;
  schrijf(`${PROMPTS[cli.mode](cli.hostname)} ${invoer}`, "in");
  unlock("cli-1");

  // --- Dingen die niet in de handleiding staan ---
  if (laag.startsWith("sudo")) {
    schrijf("% Dit is geen Linux. Serge kijkt op van zijn scherm.", "err");
    egg("egg-sudo", "sudo", "Verkeerd besturingssysteem, juiste instelling.", D.pps * 60);
    return;
  }
  if (laag === "cisco" || laag === "cisco cisco") {
    schrijf("% Wachtwoord 'cisco' op een productieapparaat. Serge kijkt teleurgesteld.", "err");
    egg("egg-cisco", "Vendor lock-in", "Standaardwachtwoorden zijn geen wachtwoorden.", D.pps * 45);
    return;
  }
  if (laag.startsWith("rm -rf")) {
    schrijf("% Weet je het zeker? ... Te laat.", "err");
    schrijf("% Grapje. Er is niets weg. Wel iets geleerd.", "uit");
    egg("egg-rm", "rm -rf /", "Op een switch valt er gelukkig weinig te verwijderen.", D.pps * 120);
    return;
  }
  if (cmd === "ping") {
    const doel = woorden[1] || "8.8.8.8";
    for (let i = 0; i < 4; i++) {
      schrijf(`Reply from ${doel}: bytes=32 time=${1 + Math.floor(Math.random() * 12)}ms TTL=${118 + Math.floor(Math.random() * 8)}`);
    }
    schrijf("Success rate is 100 percent (4/4)", "ok");
    egg("egg-ping", "Reply from 8.8.8.8", "Het werkt. Het werkt altijd, tot het niet werkt.", D.pps * 30);
    return;
  }

  switch (cmd) {
    case "?":
    case "help":
      schrijf(HELP);
      return;
    case "clear":
      uitvoer = [];
      return;
    case "enable":
      if (cli.mode === "user") {
        cli.mode = "enable";
        schrijf("% Bevoorrechte modus actief.", "ok");
      } else schrijf("% Je bent er al.", "err");
      return;
    case "disable":
      cli.mode = "user";
      return;
    case "configure":
      if (woorden[1] !== "terminal") return schrijf("% Bedoel je 'configure terminal'?", "err");
      if (cli.mode !== "enable") return schrijf("% Eerst 'enable'.", "err");
      cli.mode = "config";
      schrijf("Enter configuration commands, one per line. End with CNTL/Z.");
      return;
    case "interface":
      if (cli.mode !== "config") return schrijf("% Eerst 'configure terminal'.", "err");
      if (!woorden[1]) return schrijf("% Welke interface?", "err");
      cli.iface = woorden[1];
      cli.mode = "iface";
      return;
    case "description":
      if (cli.mode !== "iface") return schrijf("% Dit hoort onder een interface.", "err");
      cli.description = invoer.slice(invoer.indexOf(" ") + 1);
      schrijf("% Omschrijving ingesteld. Serge waardeert dit meer dan je denkt.", "ok");
      return;
    case "ip":
      if (cli.mode !== "iface") return schrijf("% Dit hoort onder een interface.", "err");
      if (woorden[1] !== "address" || !woorden[2] || !woorden[3]) return schrijf("% ip address <adres> <masker>", "err");
      if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(woorden[2]) || !/^(\d{1,3}\.){3}\d{1,3}$/.test(woorden[3])) {
        return schrijf("% Dat is geen geldig adres of masker.", "err");
      }
      cli.ifaceIp = woorden[2];
      cli.ifaceMask = woorden[3];
      schrijf("% Adres ingesteld.", "ok");
      controleer(cli);
      return;
    case "no":
      if (woorden[1] === "shutdown") {
        if (cli.mode !== "iface") return schrijf("% Dit hoort onder een interface.", "err");
        if (cli.ifaceUp) {
          schrijf("% Die stond al aan.", "err");
          egg("egg-noshut", "no shutdown", "Een interface die al aanstond nog eens aanzetten.", D.pps * 40);
          return;
        }
        cli.ifaceUp = true;
        schrijf(`%LINK-3-UPDOWN: Interface ${cli.iface}, changed state to up`, "ok");
        controleer(cli);
        return;
      }
      schrijf("% Onbekend commando na 'no'.", "err");
      return;
    case "exit":
    case "end":
      cli.mode = cli.mode === "iface" ? "config" : cli.mode === "config" ? "enable" : "user";
      return;
    case "show": {
      const wat = woorden.slice(1).join(" ");
      if (wat.startsWith("ip int")) {
        schrijf("Interface  IP-Address      Status  Protocol");
        schrijf(
          `${(cli.iface || "Gi0/1").padEnd(11)}${(cli.ifaceIp || "unassigned").padEnd(16)}${(cli.ifaceUp ? "up" : "down").padEnd(8)}${cli.ifaceUp ? "up" : "down"}`
        );
        return;
      }
      if (wat.startsWith("running")) {
        schrijf(`hostname ${cli.hostname}\n!\ninterface ${cli.iface || "GigabitEthernet0/1"}\n${cli.description ? ` description ${cli.description}\n` : ""} ip address ${cli.ifaceIp || "no ip address"} ${cli.ifaceMask || ""}\n ${cli.ifaceUp ? "no shutdown" : "shutdown"}\n!\nend`);
        return;
      }
      if (wat.startsWith("version")) {
        schrijf(`Serge Clicker CLI, versie 2.0\nUptime: ${Math.floor(G.stats.playTime / 60)} minuten\nProductie: ${fmt(D.pps)} packets/seconde\nApparaten: ${fmt(D.totalBuildings)}`);
        return;
      }
      if (wat.startsWith("mac")) {
        schrijf("Mac Address Table\n----------------\nAlle adressen zijn geleerd. En weer vergeten. En weer geleerd.");
        return;
      }
      schrijf("% Dat kan ik niet tonen. Probeer 'show ip int brief'.", "err");
      return;
    }
    case "write":
    case "copy":
      if (cli.mode === "user") return schrijf("% Eerst 'enable'.", "err");
      schrijf("Building configuration...\n[OK]", "ok");
      if (!cli.opgeslagen) {
        cli.opgeslagen = true;
        beloon(Math.max(1500, D.pps * 60), "Configuratie bewaard");
      }
      return;
    case "hostname":
      if (cli.mode !== "config") return schrijf("% Dit hoort in de configuratiemodus.", "err");
      cli.hostname = (woorden[1] || "SERGE").slice(0, 16).toUpperCase();
      return;
    case "shutdown":
      if (cli.mode !== "iface") return schrijf("% Dit hoort onder een interface.", "err");
      cli.ifaceUp = false;
      schrijf(`%LINK-5-CHANGED: Interface ${cli.iface}, changed state to administratively down`);
      return;
    default:
      schrijf(`% Onbekend commando: '${woorden[0]}'. Typ '?' voor een lijst.`, "err");
      blip(220, 0.08, 0.04);
  }
}

function controleer(cli) {
  if (cli.ifaceIp && cli.ifaceUp && !cli.unlocked) {
    cli.unlocked = true;
    unlock("cli-config");
    beloon(Math.max(3000, D.pps * 180), "Interface volledig opgezet");
    toast({ title: "Interface staat", text: "Adres ingesteld en de poort staat up. Zo hoort het.", icon: "🔌", tone: "goed" });
  }
}

export const terminal = {
  id: "cli",
  name: "Terminal",
  icon: "⌨️",
  eis: "Vraagt een switch",
  unlocked: () => (G.buildings.switch || 0) >= 1,
  render(root) {
    const cli = G.minigames.cli;
    if (!uitvoer.length) {
      schrijf("Serge Clicker terminal — typ '?' voor de commando's.");
      schrijf("Deze switch is nog niet opgezet. Kijk maar eens naar de interface.");
    }
    root.innerHTML = `
      <div class="labo-kop">
        <h3>Terminal</h3>
        <span id="term-status"></span>
      </div>
      <div class="terminal" id="term">
        <div id="term-uit"></div>
        <div class="terminal-regel">
          <span id="prompt"></span>
          <input id="term-in" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Commando" />
        </div>
      </div>`;

    const term = root.querySelector("#term");
    const uitvoerEl = root.querySelector("#term-uit");
    const statusEl = root.querySelector("#term-status");
    const invoer = root.querySelector("#term-in");
    const prompt = root.querySelector("#prompt");

    const teken = () => {
      uitvoerEl.innerHTML = uitvoer
        .map((r) => `<div class="${r.klasse}">${r.tekst.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]))}</div>`)
        .join("");
      term.scrollTop = term.scrollHeight;
      prompt.textContent = PROMPTS[cli.mode](cli.hostname);
      statusEl.textContent = cli.ifaceUp ? `${cli.iface || "gi0/1"} up` : "interface down";
    };

    term.addEventListener("click", (e) => {
      if (e.target !== invoer) invoer.focus();
    });
    invoer.addEventListener("keydown", (e) => {
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
      } else if (e.key === "ArrowUp") {
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
  },
};
