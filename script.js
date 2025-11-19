document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elementen ---
  const scoreEl = document.getElementById("score");
  const spsEl = document.getElementById("sps");
  const bodyEl = document.body;
  const clickableImage = document.getElementById("clickable-image");
  const clickableContainer = document.getElementById("clickable-container");
  const imageErrorEl = document.getElementById("image-error");
  const achievementsContainer = document.getElementById(
    "achievements-container"
  );
  const toastEl = document.getElementById("toast-notification");
  const toastTitleEl = document.getElementById("toast-title");
  const toastDescriptionEl = document.getElementById("toast-description");

  // Nieuwe DOM Elementen
  const newsTickerEl = document.getElementById("news-ticker");
  const statClicksEl = document.getElementById("stat-clicks");
  const statTotalEl = document.getElementById("stat-total");
  const statPowerEl = document.getElementById("stat-power");
  const statUpgradesEl = document.getElementById("stat-upgrades");
  const statGoldenClicksEl = document.getElementById("stat-golden-clicks"); // Nieuwe statistiek
  const statGoldenValueEl = document.getElementById("stat-golden-value");
  const evolvePanelEl = document.getElementById("evolve-panel");
  const evolveBtn = document.getElementById("evolve-btn");
  const evolveCostEl = document.getElementById("evolve-cost");
  const saveBtn = document.getElementById("save-btn");
  const loadBtn = document.getElementById("load-btn");
  const resetBtn = document.getElementById("reset-btn");
  const saveFeedbackEl = document.getElementById("save-feedback");
  const cheatControlsEl = document.getElementById("cheat-controls");
  const cheatInputEl = document.getElementById("cheat-input");
  const cheatBtn = document.getElementById("cheat-btn");
  const cheatFeedbackEl = document.getElementById("cheat-feedback");
  const goldenPacketEl = document.getElementById("golden-packet");

  // Upgrade 1: Snellere CPU
  const buyClickerBtn = document.getElementById("buy-clicker");
  const clickerCostEl = document.getElementById("clicker-cost");
  const clickerCountEl = document.getElementById("clicker-count");

  // Upgrade: Geoptimaliseerde Code
  const buyCodeBtn = document.getElementById("buy-code");
  const codeCostEl = document.getElementById("code-cost");
  const codeCountEl = document.getElementById("code-count");

  // Nieuw: GUI
  const buyGuiBtn = document.getElementById("buy-gui");
  const guiCostEl = document.getElementById("gui-cost");
  const guiCountEl = document.getElementById("gui-count");

  // Upgrade 2: Netwerk Switch
  const buyAutoClickerBtn = document.getElementById("buy-auto-clicker");
  const autoClickerCostEl = document.getElementById("auto-clicker-cost");
  const autoClickerCountEl = document.getElementById("auto-clicker-count");

  // Upgrade 3: Core Router
  const buySuperClickerBtn = document.getElementById("buy-super-clicker");
  const superClickerCostEl = document.getElementById("super-clicker-cost");
  const superClickerCountEl = document.getElementById("super-clicker-count");

  // Upgrade 4: Glasvezel
  const buyFiberBtn = document.getElementById("buy-fiber");
  const fiberCostEl = document.getElementById("fiber-cost");
  const fiberCountEl = document.getElementById("fiber-count");

  // Upgrade 5: Datacenter
  const buyDatacenterBtn = document.getElementById("buy-datacenter");
  const datacenterCostEl = document.getElementById("datacenter-cost");
  const datacenterCountEl = document.getElementById("datacenter-count");

  // Upgrade 6: Serge's Brein
  const buyBrainBtn = document.getElementById("buy-brain");
  const brainCostEl = document.getElementById("brain-cost");
  const brainCountEl = document.getElementById("brain-count");

  // Nieuw: Active Directory
  const buyAdBtn = document.getElementById("buy-ad");
  const adCostEl = document.getElementById("ad-cost");
  const adCountEl = document.getElementById("ad-count");

  // Nieuw: Proxmox
  const buyProxmoxBtn = document.getElementById("buy-proxmox");
  const proxmoxCostEl = document.getElementById("proxmox-cost");
  const proxmoxCountEl = document.getElementById("proxmox-count");

  // Upgrade 7: Quantum Link
  const buyQuantumBtn = document.getElementById("buy-quantum");
  const quantumCostEl = document.getElementById("quantum-cost");
  const quantumCountEl = document.getElementById("quantum-count");

  // Nieuw: Hyper-V
  const buyHypervBtn = document.getElementById("buy-hyperv");
  const hypervCostEl = document.getElementById("hyperv-cost");
  const hypervCountEl = document.getElementById("hyperv-count");

  // Upgrade 8: AI Admin
  const buyAiBtn = document.getElementById("buy-ai");
  const aiCostEl = document.getElementById("ai-cost");
  const aiCountEl = document.getElementById("ai-count");

  // Upgrade 9: Singularity
  const buySingularityBtn = document.getElementById("buy-singularity");
  const singularityCostEl = document.getElementById("singularity-cost");
  const singularityCountEl = document.getElementById("singularity-count");

  // Nieuwe Gouden Packet Upgrades
  const buySnifferBtn = document.getElementById("buy-sniffer");
  const snifferCostEl = document.getElementById("sniffer-cost");
  const snifferCountEl = document.getElementById("sniffer-count");
  const buyMultiplierBtn = document.getElementById("buy-multiplier");
  const multiplierCostEl = document.getElementById("multiplier-cost");
  const multiplierCountEl = document.getElementById("multiplier-count");

  // Evolved Items Wrapper
  const evolvedItemsWrapper = document.getElementById("evolved-items-wrapper");

  // Evolved Item 1
  const buyRainbowRouterBtn = document.getElementById("buy-rainbow-router");
  const rainbowRouterCostEl = document.getElementById("rainbow-router-cost");
  const rainbowRouterCountEl = document.getElementById("rainbow-router-count");

  // Evolved Item 2
  const buyGalacticFirewallBtn = document.getElementById(
    "buy-galactic-firewall"
  );
  const galacticFirewallCostEl = document.getElementById(
    "galactic-firewall-cost"
  );
  const galacticFirewallCountEl = document.getElementById(
    "galactic-firewall-count"
  );

  // Evolved Item 3
  const buyTimeServerBtn = document.getElementById("buy-time-server");
  const timeServerCostEl = document.getElementById("time-server-cost");
  const timeServerCountEl = document.getElementById("time-server-count");

  // Evolved Item 4
  const buyParallelVpnBtn = document.getElementById("buy-parallel-vpn");
  const parallelVpnCostEl = document.getElementById("parallel-vpn-cost");
  const parallelVpnCountEl = document.getElementById("parallel-vpn-count");

  // Evolved Item 5
  const buyGodModeBtn = document.getElementById("buy-god-mode");
  const godModeCostEl = document.getElementById("god-mode-cost");
  const godModeCountEl = document.getElementById("god-mode-count");

  // --- Spel Variabelen ---
  let score = 0;
  let scorePerSecond = 0;
  let clickPower = 1;
  let totalManualClicks = 0;
  let totalPacketsGenerated = 0; // Totaal ooit verdiend
  let clickMultiplier = 1.0; // Multiplier voor klikken

  let clickerCost = 25;
  let clickerCount = 0;

  let codeCost = 1000;
  let codeCount = 0;

  let guiCost = 50000;
  let guiCount = 0;

  let autoClickerCost = 50;
  let autoClickerCount = 0;

  let superClickerCost = 500;
  let superClickerCount = 0;

  let fiberCost = 8000;
  let fiberCount = 0;

  let datacenterCost = 100000;
  let datacenterCount = 0;

  let brainCost = 1000000;
  let brainCount = 0;

  let adCost = 8000000;
  let adCount = 0;

  let proxmoxCost = 5000000;
  let proxmoxCount = 0;

  let quantumCost = 12000000;
  let quantumCount = 0;

  let hypervCost = 20000000;
  let hypervCount = 0;

  let aiCost = 75000000;
  let aiCount = 0;

  let singularityCost = 500000000;
  let singularityCount = 0;

  let snifferCost = 500000;
  let snifferCount = 0;
  let multiplierCost = 2000000;
  let multiplierCount = 0;

  let goldenPacketTimer = null;
  let goldenPacketHideTimer = null; // Nieuwe timer voor het verbergen
  let goldenPacketActive = false;
  let goldenPacketClicks = 0;
  let goldenPacketTotalValue = 0;
  let goldenPacketBonusMultiplier = 1.0;
  let goldenPacketChance = 0.05; // 5% basiskans per 30s
  let currentRunChanceBonus = 0; // Bad luck protection bonus

  const EVOLVE_COST = 1_000_000_000;
  const evolvedImageSrc = "Gemini_Generated_Image_jsk7ebjsk7ebjsk7.png";
  const originalImageSrc = clickableImage
    ? clickableImage.getAttribute("src")
    : "";
  let hasEvolved = false;

  const saveKey = "sergeClickerSave";
  let cheatUnlockClicks = 0;
  const cheatUnlockTarget = 20;
  let cheatUnlocked = false;
  let hasUsedCheat = false;

  // Evolved Upgrades
  let rainbowRouterCost = 2500000000; // 2.5 Miljard
  let rainbowRouterCount = 0;

  let galacticFirewallCost = 10000000000; // 10 Miljard
  let galacticFirewallCount = 0;

  let timeServerCost = 50000000000; // 50 Miljard
  let timeServerCount = 0;

  let parallelVpnCost = 250000000000; // 250 Miljard
  let parallelVpnCount = 0;

  let godModeCost = 1000000000000; // 1 Biljoen
  let godModeCount = 0;

  // --- Formatter helpers ---
  const numberFormatterCache = {};
  const magnitudeLabels = [
  // --- De Astronomische Grote Jongens ---
  { value: 1e100, short: "googol", word: "googol" },        // 10^100
  { value: 1e60, short: "dec", word: "deciljoen" },         // 10^60
  { value: 1e54, short: "non", word: "noniljoen" },         // 10^54
  { value: 1e48, short: "oct", word: "octiljoen" },         // 10^48
  { value: 1e42, short: "sept", word: "septiljoen" },       // 10^42
  { value: 1e36, short: "sext", word: "sextiljoen" },       // 10^36
  
  // --- De "Klassieke" Grote Getallen ---
  { value: 1e33, short: "qntld", word: "quintiljard" },     // 10^33
  { value: 1e30, short: "qntln", word: "quintiljoen" },     // 10^30
  { value: 1e27, short: "qdrld", word: "quadriljard" },     // 10^27
  { value: 1e24, short: "qdrln", word: "quadriljoen" },     // 10^24
  { value: 1e21, short: "trld", word: "triljard" },         // 10^21
  { value: 1e18, short: "trln", word: "triljoen" },         // 10^18 (Dit was jouw getal!)
  { value: 1e15, short: "bld", word: "biljard" },           // 10^15
  
  // --- Je originele lijst (met syntax update) ---
  { value: 1_000_000_000_000, short: "bln", word: "biljoen" }, // 10^12
  { value: 1_000_000_000, short: "mld", word: "miljard" },     // 10^9
  { value: 1_000_000, short: "mlj", word: "miljoen" },         // 10^6
  { value: 1_000, short: "k", word: "duizend" },               // 10^3
];

  function getNumberFormatter(decimals = 0) {
    if (!numberFormatterCache[decimals]) {
      numberFormatterCache[decimals] = new Intl.NumberFormat("nl-NL", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
    return numberFormatterCache[decimals];
  }

  function formatShortNumber(value, options = {}) {
    const { smallDecimals = 0 } = options;
    const absValue = Math.abs(value);
    const magnitude = magnitudeLabels.find((mag) => absValue >= mag.value);
    if (!magnitude) {
      return getNumberFormatter(smallDecimals).format(value);
    }

    const relativeValue = value / magnitude.value;
    const relativeFormatter = new Intl.NumberFormat("nl-NL", {
      minimumFractionDigits:
        Math.abs(relativeValue) >= 100
          ? 0
          : Math.abs(relativeValue) >= 10
          ? 1
          : 2,
      maximumFractionDigits:
        Math.abs(relativeValue) >= 100
          ? 0
          : Math.abs(relativeValue) >= 10
          ? 1
          : 2,
    });
    return `${relativeFormatter.format(relativeValue)}${magnitude.short}`;
  }

  function formatNumberWithWords(value, options = {}) {
    const { decimals = 0 } = options;
    const formatter = getNumberFormatter(decimals);
    const baseFormatted = formatter.format(value);
    const absValue = Math.abs(value);

    const magnitude = magnitudeLabels.find((mag) => absValue >= mag.value);
    if (!magnitude) return baseFormatted;

    const relativeValue = value / magnitude.value;
    const relativeFormatter = new Intl.NumberFormat("nl-NL", {
      minimumFractionDigits: 0,
      maximumFractionDigits:
        Math.abs(relativeValue) >= 100
          ? 0
          : Math.abs(relativeValue) >= 10
          ? 1
          : 2,
    });
    const relativeFormatted = relativeFormatter.format(relativeValue);

    return `${baseFormatted} (${relativeFormatted} ${magnitude.short})`;
  }

  function parseCheatAmount(token) {
    if (token === undefined) {
      throw new Error("Geef ook een getal mee.");
    }
    const normalized = token.replace(",", ".");
    const amount = Number(normalized);
    if (Number.isNaN(amount)) {
      throw new Error(`'${token}' is geen geldig getal.`);
    }
    return amount;
  }

  function executeCheatCommand(rawCommand) {
    if (!rawCommand || !rawCommand.trim()) {
      showCheatFeedback("Typ een commando.", true);
      return;
    }

    const parts = rawCommand.trim().split(/\s+/);
    const command = parts[0].toLowerCase();

    let commandExecuted = false;
    try {
      switch (command) {
        case "help":
          showCheatFeedback(
            "Commando's: add, set, pps, power, multiplier, golden, unlockall",
            false
          );
          break;

        case "add":
        case "addscore": {
          const amount = parseCheatAmount(parts[1]);
          score += amount;
          if (amount > 0) totalPacketsGenerated += amount;
          updateUI();
          checkAchievements();
          showCheatFeedback(`+${formatShortNumber(amount)} toegevoegd.`);
          commandExecuted = true;
          break;
        }

        case "set":
        case "setscore": {
          const amount = Math.max(0, parseCheatAmount(parts[1]));
          score = amount;
          if (amount > totalPacketsGenerated) {
            totalPacketsGenerated = amount;
          }
          updateUI();
          checkAchievements();
          showCheatFeedback(`Score ingesteld op ${formatShortNumber(amount)}.`);
          commandExecuted = true;
          break;
        }

        case "pps": {
          const amount = Math.max(0, parseCheatAmount(parts[1]));
          scorePerSecond = amount;
          updateUI();
          checkAchievements();
          showCheatFeedback(`PPS ingesteld op ${formatShortNumber(amount)}.`);
          commandExecuted = true;
          break;
        }

        case "power": {
          const amount = Math.max(1, Math.floor(parseCheatAmount(parts[1])));
          clickPower = amount;
          updateUI();
          showCheatFeedback(`Klikkracht is nu ${formatShortNumber(amount)}.`);
          commandExecuted = true;
          break;
        }

        case "multiplier": {
          const amount = Math.max(0.01, parseCheatAmount(parts[1]));
          clickMultiplier = amount;
          updateUI();
          showCheatFeedback(`Multiplier is nu x${amount.toFixed(2)}.`);
          commandExecuted = true;
          break;
        }

        case "golden": {
          let chance = parseCheatAmount(parts[1]);
          if (chance > 1) {
            chance = chance / 100;
          }
          goldenPacketChance = Math.min(1, Math.max(0, chance));
          showCheatFeedback(
            `Gouden packet kans ingesteld op ${(
              goldenPacketChance * 100
            ).toFixed(1)}%.`
          );
          commandExecuted = true;
          break;
        }

        case "unlockall": {
          Object.keys(achievementData).forEach((id) => unlockAchievement(id));
          renderAchievements();
          showCheatFeedback("Alle prestaties ontgrendeld.");
          commandExecuted = true;
          break;
        }

        default:
          showCheatFeedback("Onbekend commando. Typ 'help' voor opties.", true);
      }
    } catch (error) {
      showCheatFeedback(
        error?.message || "Cheat commando mislukt. Probeer opnieuw.",
        true
      );
    } finally {
      if (commandExecuted) {
        hasUsedCheat = true;
        checkAchievements();
      }
      if (cheatInputEl) {
        cheatInputEl.value = "";
      }
    }
  }

  // --- News Ticker Berichten ---
  const newsTickerMessages = [
    "Serge analyseert de netwerk-packets...",
    "Router R1 heeft een firmware update nodig.",
    "Ping naar 8.8.8.8 succesvol.",
    "Nieuwe VLAN aangemaakt.",
    "Waarschuwing: Hoge CPU-belasting op de core switch.",
    "Packet verstuurd... Packet ontvangen.",
    "Heeft iemand de server opnieuw opgestart?",
    "Access-list 'DENY_ALL' toegepast. Oeps.",
    "Nieuwe kabel besteld.",
    "Serge overweegt een upgrade naar WiFi 7.",
    "De servers draaien op volle toeren dankzij Serge's optimalisaties!",
    "Nieuwe AI-algoritmes detecteren ongewone netwerkactiviteit... of is het een bug?",
    "Hacker Space: Toegang geweigerd. Probeer een sterker wachtwoord.",
    "Glasvezelkabels gloeien van de activiteit, de bandbreedte is enorm!",
    "Quantum Link tot stand gebracht. De toekomst van netwerken is hier.",
    "Een datacenter is zojuist geüpgraded. Meer packets onderweg!",
    "Serge's Brein verwerkt miljarden packets per seconde. Indrukwekkend.",
    "Active Directory is nu online, alle gebruikers zijn geauthenticeerd.",
    "Proxmox Cluster: nieuwe virtuele machines worden uitgerold.",
    "Hyper-V Farm is uitgebreid, de virtualisatie is ongeëvenaard.",
    "Een gouden packet is gespot! Snel klikken!",
    "De Singularity is nabij... of is het al begonnen?",
    "Netwerkverkeer stijgt exponentieel, Serge houdt het nauwlettend in de gaten.",
    "Nieuwe security patch geïnstalleerd. De verdediging is sterker dan ooit.",
    "Energieverbruik van het datacenter is historisch hoog, maar de efficiëntie ook.",
    "De matrix is geladen. Klaar voor meer packets?",
    "Snelheid is geen probleem meer, met Serge aan het roer van het netwerk.",
    "De cyberwereld is onveilig, maar Serge's netwerk is een fort.",
    "Geruchten over een nieuw, nog krachtiger packet circuleren...",
    "De verbinding is zo stabiel dat je er een huis op kunt bouwen.",
    "Serge is een legende in de netwerkindustrie, zijn naam klinkt overal.",
  ];

  // --- Evolved News Ticker Berichten ---
  const evolvedNewsTickerMessages = [
    "Serge is nu één met het universum.",
    "Regenbogen stromen door de glasvezelkabels.",
    "De packets hebben nu een lichtsnelheid bereikt.",
    "Het internet is nu 100% Serge-powered.",
    "Aliens bellen: ze willen hun bandbreedte terug.",
    "De matrix is herschreven in regenboogkleuren.",
    "Oneindige packets... en nog steeds niet genoeg.",
    "Tijd en ruimte buigen voor de netwerksnelheid.",
    "Serge heeft het einde van het internet bereikt (en het is mooi).",
    "404 Error: Limiet niet gevonden.",
    "De cloud is nu een regenboogwolk.",
    "Ping: 0ms. Overal. Altijd.",
    "Cybersecurity is nu overbodig; niemand durft Serge aan te vallen.",
    "De servers draaien op pure kosmische energie.",
    "Elke klik creëert een nieuw universum.",
    "De firewall blokkeert nu ook slechte vibes.",
    "Serge's aura verlicht het hele datacenter.",
    "De bits en bytes dansen de tango.",
    "Upload voltooid: Bewustzijn geüpload naar het netwerk.",
    "Het is geen bug, het is een transcendentale feature.",
  ];

  // --- Achievement Systeem ---
  let achievements = {}; // Wordt geladen of gereset

  const achievementData = {
    "click-1": {
      title: "Eerste Packet",
      description: "Je hebt je eerste packet verstuurd!",
      icon: "🖱️",
      elId: "ach-click-1",
    },
    "click-100": {
      title: "Packet Pusher",
      description: "Verstuur 100 packets handmatig.",
      icon: "💨",
      elId: "ach-click-100",
    },
    "click-1000": {
      title: "Klik-specialist",
      description: "Verstuur 1.000 packets handmatig.",
      icon: "💥",
      elId: "ach-click-1000",
    },
    "click-10000": {
      title: " RSI",
      description: "Verstuur 10.000 packets handmatig.",
      icon: "🦾",
      elId: "ach-click-10000",
    },

    "total-1M": {
      title: "Packet Miljonair",
      description: "Verdien 1 miljoen packets in totaal.",
      icon: "💰",
      elId: "ach-total-1M",
    },
    "total-1B": {
      title: "Packet Miljardair",
      description: "Verdien 1 miljard packets in totaal.",
      icon: "🏦",
      elId: "ach-total-1B",
    },

    "buy-1-cpu": {
      title: "CPU Upgrade",
      description: "Koop je eerste Snellere CPU.",
      icon: "⚙️",
      elId: "ach-buy-1-cpu",
    },
    "buy-1-switch": {
      title: "Nieuw Netwerk",
      description: "Koop je eerste Netwerk Switch.",
      icon: "🔄",
      elId: "ach-buy-1-switch",
    },
    "buy-1-fiber": {
      title: "Verbonden met Licht",
      description: "Koop je eerste Glasvezel Backbone.",
      icon: "✨",
      elId: "ach-buy-1-fiber",
    },
    "buy-1-datacenter": {
      title: "Big Data",
      description: "Koop je eerste Datacenter.",
      icon: "🏢",
      elId: "ach-buy-1-datacenter",
    },
    "buy-1-gui": {
      title: "Mooi Klikken",
      description: "Koop de Intuïtieve GUI upgrade.",
      icon: "🖱️",
      elId: "ach-buy-1-gui",
    },
    "buy-1-ad": {
      title: "Domain Admin",
      description: "Installeer je eerste Active Directory.",
      icon: "📂",
      elId: "ach-buy-1-ad",
    },
    "buy-1-proxmox": {
      title: "Virtuele Held",
      description: "Koop je eerste Proxmox Cluster.",
      icon: "🖥️",
      elId: "ach-buy-1-proxmox",
    },
    "buy-1-quantum": {
      title: "Kwantumverstrengeling",
      description: "Koop je eerste Quantum Link.",
      icon: "🌌",
      elId: "ach-buy-1-quantum",
    },
    "buy-1-ai": {
      title: "Skynet",
      description: "Koop je eerste AI Netwerk Admin.",
      icon: "🤖",
      elId: "ach-buy-1-ai",
    },
    "buy-1-singularity": {
      title: "Het Einde",
      description: "Koop je eerste The Singularity.",
      icon: "🌀",
      elId: "ach-buy-1-singularity",
    },
    "evolve-serge": {
      title: "Regenboog Ascensie",
      description: "Evolve Serge naar zijn definitieve vorm.",
      icon: "🌈",
      elId: "ach-evolve-serge",
    },
    "golden-1": {
      title: "Gouden Vangst",
      description: "Klik op je eerste Gouden Packet.",
      icon: "📦",
      elId: "ach-golden-1",
    },
    "golden-10": {
      title: "Packet Jager",
      description: "Klik op 10 Gouden Packets.",
      icon: "🎯",
      elId: "ach-golden-10",
    },

    "sps-1": {
      title: "Geautomatiseerd",
      description: "Bereik 1 packet per seconde.",
      icon: "🤖",
      elId: "ach-sps-1",
    },
    "sps-10": {
      title: "Backbone",
      description: "Bereik 10 packets per seconde.",
      icon: "🚀",
      elId: "ach-sps-10",
    },
    "sps-50": {
      title: "High-Speed Netwerk",
      description: "Bereik 50 packets per seconde.",
      icon: "🚄",
      elId: "ach-sps-50",
    },
    "sps-200": {
      title: "Datacenter Eigenaar",
      description: "Bereik 200 packets per seconde.",
      icon: "🏭",
      elId: "ach-sps-200",
    },
    "sps-1000": {
      title: "Internetsnelheid",
      description: "Bereik 1.000 packets per seconde.",
      icon: "⚡",
      elId: "ach-sps-1000",
    },
    "sps-10000": {
      title: "Lichtsnelheid",
      description: "Bereik 10.000 packets per seconde.",
      icon: "💡",
      elId: "ach-sps-10000",
    },
    "sps-100000": {
      title: "De Matrix",
      description: "Bereik 100.000 packets per seconde.",
      icon: "🌀",
      elId: "ach-sps-100000",
    },
    // ... bestaande achievements hierboven ...

    // --- NIEUWE EVOLVED ACHIEVEMENTS ---
    "buy-1-rainbow": {
      title: "Full Spectrum",
      description: "Bezit een Regenboog Router.",
      icon: "🌈",
      elId: "ach-buy-1-rainbow",
    },
    "buy-1-galactic": {
      title: "Alien Technologie",
      description: "Bezit een Galactische Firewall.",
      icon: "🪐",
      elId: "ach-buy-1-galactic",
    },
    "buy-1-time": {
      title: "Back to the Future",
      description: "Bezit een Tijd Reizende Server.",
      icon: "⏳",
      elId: "ach-buy-1-time",
    },
    "buy-1-parallel": {
      title: "Multiversum",
      description: "Bezit een Parallel Universum VPN.",
      icon: "🌌",
      elId: "ach-buy-1-parallel",
    },
    "buy-1-god": {
      title: "Almacht",
      description: "Bezit de God Mode Terminal.",
      icon: "⚡",
      elId: "ach-buy-1-god",
    },

    // --- CHEAT ACHIEVEMENT ---
    "cheater-detected": {
      title: "Valsspeler!",
      description: "Je hebt de console gebruikt. Foei!",
      icon: "⚠️",
      elId: "ach-cheater-detected",
    },
  };

  function initializeAchievements() {
    let defaultAchievements = {};
    for (const id in achievementData) {
      defaultAchievements[id] = false;
    }
    return defaultAchievements;
  }

  // Bouw de achievement lijst in HTML
  function renderAchievements() {
    achievementsContainer.innerHTML = ""; // Leegmaken voor load
    for (const id in achievementData) {
      const ach = achievementData[id];
      const achEl = document.createElement("div");
      achEl.className = "achievement-item";
      achEl.id = ach.elId;

      // Pas de 'locked' of 'unlocked' klasse toe op basis van de save data
      if (achievements[id]) {
        achEl.classList.add("unlocked");
      } else {
        achEl.classList.add("locked");
      }

      achEl.innerHTML = `
                <span class="text-3xl">${ach.icon}</span>
                <div>
                    <h4 class="font-semibold text-gray-800">${ach.title}</h4>
                    <p class="text-sm text-gray-600">${ach.description}</p>
                </div>
            `;
      achievementsContainer.prepend(achEl);

      if (ach.elId === "ach-click-1") {
        achEl.addEventListener("click", handleSecretAchievementClick);
      }
    }
  }

  // Toon een toast notificatie
  let toastTimeout;
  function showToast(title, description, type = "success") {
    clearTimeout(toastTimeout); // Reset timer als er al een toast is

    toastTitleEl.textContent = title;
    toastDescriptionEl.textContent = description;

    // Verander kleur op basis van type
    if (type === "success") {
      toastEl.classList.remove("bg-blue-500");
      toastEl.classList.add("bg-green-500");
    } else if (type === "info") {
      toastEl.classList.remove("bg-green-500");
      toastEl.classList.add("bg-blue-500");
    }

    toastEl.classList.add("show");

    toastTimeout = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 3000); // Verberg na 3 seconden
  }

  function showSaveFeedback(message) {
    saveFeedbackEl.textContent = message;
    setTimeout(() => {
      saveFeedbackEl.textContent = "";
    }, 2000);
  }

  function showCheatFeedback(message, isError = false) {
    if (!cheatFeedbackEl) return;
    cheatFeedbackEl.textContent = message;
    cheatFeedbackEl.style.color = isError ? "#dc2626" : "#059669";
    clearTimeout(showCheatFeedback.timeoutId);
    showCheatFeedback.timeoutId = setTimeout(() => {
      cheatFeedbackEl.textContent = "";
    }, 4000);
  }

  function revealCheatControls() {
    if (!cheatControlsEl || cheatUnlocked) return;
    cheatUnlocked = true;
    cheatControlsEl.classList.remove("hidden");
    showToast(
      "Cheat menu ontgrendeld!",
      "Druk op Enter om commands te runnen.",
      "info"
    );
  }

  function handleSecretAchievementClick() {
    if (cheatUnlocked) return;
    cheatUnlockClicks += 1;
    if (cheatUnlockClicks >= cheatUnlockTarget) {
      revealCheatControls();
    }
  }

  function updateEvolveButton() {
    if (!evolvePanelEl) return;
    const shouldShowPanel = singularityCount > 0 && !hasEvolved;
    evolvePanelEl.classList.toggle("hidden", !shouldShowPanel);
    if (evolveBtn) {
      if (shouldShowPanel) {
        const canAfford = score >= EVOLVE_COST;
        evolveBtn.disabled = !canAfford;
      } else {
        evolveBtn.disabled = true;
      }
    }
  }

  function applyEvolvedTheme() {
    if (bodyEl) {
      bodyEl.classList.add("rainbow-mode");
    }
    if (clickableImage) {
      clickableImage.classList.add("evolved");
      if (evolvedImageSrc) {
        clickableImage.src = evolvedImageSrc;
      }
    }
    if (evolvePanelEl) {
      evolvePanelEl.classList.add("hidden");
    }
    if (evolvedItemsWrapper) {
      evolvedItemsWrapper.classList.remove("hidden");
    }
  }

  function handleEvolveClick() {
    if (hasEvolved || !evolveBtn) return;
    if (score < EVOLVE_COST) {
      showToast(
        "Niet genoeg packets",
        `Je hebt ${formatNumberWithWords(score)} / ${formatNumberWithWords(
          EVOLVE_COST
        )} packets.`,
        "info"
      );
      return;
    }
    score -= EVOLVE_COST;
    hasEvolved = true;
    applyEvolvedTheme();
    showToast(
      "Serge geëvolueerd!",
      "Welkom bij het regenboogtijdperk.",
      "success"
    );
    updateUI();
    checkAchievements();
  }

  // Ontgrendel een achievement
  function unlockAchievement(id) {
    if (achievements[id]) return; // Al ontgrendeld

    achievements[id] = true;
    const achEl = document.getElementById(achievementData[id].elId);
    if (achEl) {
      achievementsContainer.prepend(achEl); // Verplaats naar bovenaan
      achEl.classList.remove("locked");
      achEl.classList.add("unlocked");
    }
    showToast(
      `Prestatie: ${achievementData[id].title}`,
      achievementData[id].description,
      "success"
    );
  }

  // Controleer of achievements zijn behaald
  function checkAchievements() {
    // Klik-gebaseerd
    if (!achievements["click-1"] && totalManualClicks >= 1)
      unlockAchievement("click-1");
    if (!achievements["click-100"] && totalManualClicks >= 100)
      unlockAchievement("click-100");
    if (!achievements["click-1000"] && totalManualClicks >= 1000)
      unlockAchievement("click-1000");
    if (!achievements["click-10000"] && totalManualClicks >= 10000)
      unlockAchievement("click-10000");

    // Totaal-gebaseerd
    if (!achievements["total-1M"] && totalPacketsGenerated >= 1000000)
      unlockAchievement("total-1M");
    if (!achievements["total-1B"] && totalPacketsGenerated >= 1000000000)
      unlockAchievement("total-1B");

    // Koop-gebaseerd
    if (!achievements["buy-1-cpu"] && clickerCount >= 1)
      unlockAchievement("buy-1-cpu");
    if (!achievements["buy-1-switch"] && autoClickerCount >= 1)
      unlockAchievement("buy-1-switch");
    if (!achievements["buy-1-fiber"] && fiberCount >= 1)
      unlockAchievement("buy-1-fiber");
    if (!achievements["buy-1-datacenter"] && datacenterCount >= 1)
      unlockAchievement("buy-1-datacenter");
    if (!achievements["buy-1-gui"] && guiCount >= 1)
      unlockAchievement("buy-1-gui");
    if (!achievements["buy-1-ad"] && adCount >= 1)
      unlockAchievement("buy-1-ad");
    if (!achievements["buy-1-proxmox"] && proxmoxCount >= 1)
      unlockAchievement("buy-1-proxmox");
    if (!achievements["buy-1-quantum"] && quantumCount >= 1)
      unlockAchievement("buy-1-quantum");
    if (!achievements["buy-1-ai"] && aiCount >= 1)
      unlockAchievement("buy-1-ai");

    // Gouden Packet
    if (!achievements["golden-1"] && goldenPacketClicks >= 1)
      unlockAchievement("golden-1");
    if (!achievements["golden-10"] && goldenPacketClicks >= 10)
      unlockAchievement("golden-10");

    if (!achievements["evolve-serge"] && hasEvolved)
      unlockAchievement("evolve-serge");
    // if (!achievements["cheat-master"] && hasUsedCheat)
    //   unlockAchievement("cheat-master");

    // SPS-gebaseerd
    if (!achievements["sps-1"] && scorePerSecond >= 1)
      unlockAchievement("sps-1");
    if (!achievements["sps-10"] && scorePerSecond >= 10)
      unlockAchievement("sps-10");
    if (!achievements["sps-50"] && scorePerSecond >= 50)
      unlockAchievement("sps-50");
    if (!achievements["sps-200"] && scorePerSecond >= 200)
      unlockAchievement("sps-200");
    if (!achievements["sps-1000"] && scorePerSecond >= 1000)
      unlockAchievement("sps-1000");
    if (!achievements["sps-10000"] && scorePerSecond >= 10000)
      unlockAchievement("sps-10000");
    if (!achievements["sps-100000"] && scorePerSecond >= 100000)
      unlockAchievement("sps-100000");

    // ... bestaande checks ...

    // --- Checks voor Evolved Items ---
    if (!achievements["buy-1-rainbow"] && rainbowRouterCount >= 1)
      unlockAchievement("buy-1-rainbow");

    if (!achievements["buy-1-galactic"] && galacticFirewallCount >= 1)
      unlockAchievement("buy-1-galactic");

    if (!achievements["buy-1-time"] && timeServerCount >= 1)
      unlockAchievement("buy-1-time");

    if (!achievements["buy-1-parallel"] && parallelVpnCount >= 1)
      unlockAchievement("buy-1-parallel");

    if (!achievements["buy-1-god"] && godModeCount >= 1)
      unlockAchievement("buy-1-god");

    // --- Check voor Cheats ---
    // 'hasUsedCheat' wordt automatisch true als iemand een commando invoert (zie executeCheatCommand functie)
    if (!achievements["cheater-detected"] && hasUsedCheat)
      unlockAchievement("cheater-detected");
  }

  // --- Functies ---

  // Update alle UI-elementen (score, kosten, knoppen, stats)
  function updateUI() {
    // Gebruik Math.floor om alleen hele punten te tonen
    scoreEl.textContent = formatShortNumber(Math.floor(score));
    // Toon SPS met alleen verkorte woordnotatie
    spsEl.textContent = formatShortNumber(scorePerSecond, { smallDecimals: 1 });

    // Update kosten en aantallen in de winkel
    clickerCostEl.textContent = formatNumberWithWords(clickerCost);
    clickerCountEl.textContent = formatNumberWithWords(clickerCount);
    codeCostEl.textContent = formatNumberWithWords(codeCost);
    codeCountEl.textContent = formatNumberWithWords(codeCount);
    guiCostEl.textContent = formatNumberWithWords(guiCost);
    guiCountEl.textContent = formatNumberWithWords(guiCount);
    autoClickerCostEl.textContent = formatNumberWithWords(autoClickerCost);
    autoClickerCountEl.textContent = formatNumberWithWords(autoClickerCount);
    superClickerCostEl.textContent = formatNumberWithWords(superClickerCost);
    superClickerCountEl.textContent = formatNumberWithWords(superClickerCount);
    fiberCostEl.textContent = formatNumberWithWords(fiberCost);
    fiberCountEl.textContent = formatNumberWithWords(fiberCount);
    datacenterCostEl.textContent = formatNumberWithWords(datacenterCost);
    datacenterCountEl.textContent = formatNumberWithWords(datacenterCount);
    brainCostEl.textContent = formatNumberWithWords(brainCost);
    brainCountEl.textContent = formatNumberWithWords(brainCount);
    adCostEl.textContent = formatNumberWithWords(adCost);
    adCountEl.textContent = formatNumberWithWords(adCount);
    proxmoxCostEl.textContent = formatNumberWithWords(proxmoxCost);
    proxmoxCountEl.textContent = formatNumberWithWords(proxmoxCount);
    quantumCostEl.textContent = formatNumberWithWords(quantumCost);
    quantumCountEl.textContent = formatNumberWithWords(quantumCount);
    hypervCostEl.textContent = formatNumberWithWords(hypervCost);
    hypervCountEl.textContent = formatNumberWithWords(hypervCount);
    aiCostEl.textContent = formatNumberWithWords(aiCost);
    aiCountEl.textContent = formatNumberWithWords(aiCount);
    singularityCostEl.textContent = formatNumberWithWords(singularityCost);
    singularityCountEl.textContent = formatNumberWithWords(singularityCount);
    snifferCostEl.textContent = formatNumberWithWords(snifferCost);
    snifferCountEl.textContent = formatNumberWithWords(snifferCount);
    multiplierCostEl.textContent = formatNumberWithWords(multiplierCost);
    multiplierCountEl.textContent = formatNumberWithWords(multiplierCount);

    // Evolved Upgrades Updates
    rainbowRouterCostEl.textContent = formatShortNumber(rainbowRouterCost);
    rainbowRouterCountEl.textContent =
      formatNumberWithWords(rainbowRouterCount);
    buyRainbowRouterBtn.disabled = score < rainbowRouterCost;
    buyRainbowRouterBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < rainbowRouterCost);

    galacticFirewallCostEl.textContent =
      formatShortNumber(galacticFirewallCost);
    galacticFirewallCountEl.textContent = formatNumberWithWords(
      galacticFirewallCount
    );
    buyGalacticFirewallBtn.disabled = score < galacticFirewallCost;
    buyGalacticFirewallBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < galacticFirewallCost);

    timeServerCostEl.textContent = formatShortNumber(timeServerCost);
    timeServerCountEl.textContent = formatNumberWithWords(timeServerCount);
    buyTimeServerBtn.disabled = score < timeServerCost;
    buyTimeServerBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < timeServerCost);

    parallelVpnCostEl.textContent = formatShortNumber(parallelVpnCost);
    parallelVpnCountEl.textContent = formatNumberWithWords(parallelVpnCount);
    buyParallelVpnBtn.disabled = score < parallelVpnCost;
    buyParallelVpnBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < parallelVpnCost);

    godModeCostEl.textContent = formatShortNumber(godModeCost);
    godModeCountEl.textContent = formatNumberWithWords(godModeCount);
    buyGodModeBtn.disabled = score < godModeCost;
    buyGodModeBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < godModeCost);
    // Schakel knoppen uit als er niet genoeg punten zijn
    buyClickerBtn.disabled = score < clickerCost;
    buyClickerBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < clickerCost);

    buyCodeBtn.disabled = score < codeCost;
    buyCodeBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < codeCost);

    buyGuiBtn.disabled = score < guiCost;
    buyGuiBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < guiCost);

    buyAutoClickerBtn.disabled = score < autoClickerCost;
    buyAutoClickerBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < autoClickerCost);

    buySuperClickerBtn.disabled = score < superClickerCost;
    buySuperClickerBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < superClickerCost);

    buyFiberBtn.disabled = score < fiberCost;
    buyFiberBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < fiberCost);

    buyDatacenterBtn.disabled = score < datacenterCost;
    buyDatacenterBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < datacenterCost);

    buyBrainBtn.disabled = score < brainCost;
    buyBrainBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < brainCost);

    buyAdBtn.disabled = score < adCost;
    buyAdBtn.closest(".shop-item").classList.toggle("disabled", score < adCost);

    buyProxmoxBtn.disabled = score < proxmoxCost;
    buyProxmoxBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < proxmoxCost);

    buyQuantumBtn.disabled = score < quantumCost;
    buyQuantumBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < quantumCost);

    buyHypervBtn.disabled = score < hypervCost;
    buyHypervBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < hypervCost);

    buyAiBtn.disabled = score < aiCost;
    buyAiBtn.closest(".shop-item").classList.toggle("disabled", score < aiCost);

    buySingularityBtn.disabled = score < singularityCost;
    buySingularityBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < singularityCost);

    buySnifferBtn.disabled = score < snifferCost || goldenPacketChance >= 0.25;
    buySnifferBtn
      .closest(".shop-item")
      .classList.toggle(
        "disabled",
        score < snifferCost || goldenPacketChance >= 0.25
      );
    if (goldenPacketChance >= 0.25) {
        buySnifferBtn.textContent = "MAX";
    }

    buyMultiplierBtn.disabled = score < multiplierCost;
    buyMultiplierBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < multiplierCost);

    // Update Statistieken
    statClicksEl.textContent = formatNumberWithWords(totalManualClicks);
    statTotalEl.textContent = formatNumberWithWords(
      Math.floor(totalPacketsGenerated)
    );
    const displayedPower = Math.ceil(clickPower * clickMultiplier);
    statPowerEl.textContent = `${formatNumberWithWords(
      displayedPower
    )} (x${clickMultiplier.toFixed(2)})`;
    statGoldenClicksEl.textContent = formatNumberWithWords(goldenPacketClicks); // Update nieuwe statistiek
    statGoldenValueEl.textContent = formatNumberWithWords(
      goldenPacketTotalValue
    );
    const totalUpgrades =
      clickerCount +
      codeCount +
      guiCount +
      autoClickerCount +
      superClickerCount +
      fiberCount +
      datacenterCount +
      brainCount +
      adCount +
      proxmoxCount +
      quantumCount +
      hypervCount +
      aiCount +
      singularityCount +
      snifferCount +
      multiplierCount;
    statUpgradesEl.textContent = formatNumberWithWords(totalUpgrades);

    if (evolveCostEl) {
      evolveCostEl.textContent = formatShortNumber(EVOLVE_COST);
    }
    updateEvolveButton();
  }

  // Wordt uitgevoerd wanneer op de afbeelding wordt geklikt
  function handleClick(event) {
    const clickValue = Math.ceil(clickPower * clickMultiplier); // Bereken klikwaarde
    score += clickValue;
    totalManualClicks++;
    totalPacketsGenerated += clickValue; // Voeg toe aan totaal

    showFloatingText(event.clientX, event.clientY, clickValue); // Toon tekst
    createClickBurst(event.clientX, event.clientY); // Toon explosie

    // Nieuwe wobble animatie
    clickableImage.classList.remove("click-wobble"); // Verwijder om opnieuw te triggeren
    void clickableImage.offsetWidth; // Forceer reflow
    clickableImage.classList.add("click-wobble"); // Voeg toe

    // Score pop animatie
    scoreEl.classList.add("score-pop");
    setTimeout(() => scoreEl.classList.remove("score-pop"), 150);

    updateUI();
    checkAchievements(); // Controleer na klik
  }

  // Toont de zwevende "+1" tekst
  function showFloatingText(x, y, amount) {
    const textEl = document.createElement("div");
    textEl.className = "floating-text";
    textEl.textContent = `+${amount}`;

    // Voeg toe aan de body zodat het overal kan zijn
    document.body.appendChild(textEl);

    // Positioneer op de kliklocatie
    // De CSS-klasse .floating-text en de bijbehorende animatie
    // bevatten 'transform: translate(-50%, -50%)'.
    // Dit centreert het element automatisch op de 'left' en 'top' coördinaten.
    const randomX = (Math.random() - 0.5) * 40; // Willekeurige spreiding
    textEl.style.left = `${x + randomX}px`;
    textEl.style.top = `${y}px`;

    // De 'transform' wordt nu volledig door de CSS-animatie beheerd.

    // Verwijder het element na de animatie
    setTimeout(() => {
      textEl.remove();
    }, 1100); // Iets langer dan de animatieduur
  }

  // Creëert een 'burst' van deeltjes
  function createClickBurst(x, y) {
    for (let i = 0; i < 5; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      document.body.appendChild(particle);

      particle.style.left = x + "px";
      particle.style.top = y + "px";

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 40 + 40; // 40 tot 80px afstand
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      particle.style.setProperty("--tx", tx + "px");
      particle.style.setProperty("--ty", ty + "px");

      setTimeout(() => particle.remove(), 1000); // Verwijder na 1s
    }
  }

  // Koop "Snellere CPU"
  function buyClicker() {
    if (score >= clickerCost) {
      score -= clickerCost;
      clickPower++;
      clickerCount++;
      clickerCost = Math.ceil(clickerCost * 1.25);
      updateUI();
      checkAchievements();
    }
  }

  // Koop "Geoptimaliseerde Code"
  function buyCode() {
    if (score >= codeCost) {
      score -= codeCost;
      clickMultiplier += 0.05; // Voeg 5% toe aan multiplier
      codeCount++;
      codeCost = Math.ceil(codeCost * 1.5);
      updateUI();
      checkAchievements();
    }
  }

  // Koop "Intuïtieve GUI"
  function buyGui() {
    if (score >= guiCost) {
      score -= guiCost;
      clickPower += 10;
      guiCount++;
      guiCost = Math.ceil(guiCost * 1.6);
      updateUI();
      checkAchievements();
    }
  }

  // Koop "Netwerk Switch"
  function buyAutoClicker() {
    if (score >= autoClickerCost) {
      score -= autoClickerCost;
      scorePerSecond += 1;
      autoClickerCount++;
      autoClickerCost = Math.ceil(autoClickerCost * 1.3);
      updateUI();
      checkAchievements();
    }
  }

  // Koop "Core Router"
  function buySuperClicker() {
    if (score >= superClickerCost) {
      score -= superClickerCost;
      scorePerSecond += 5;
      superClickerCount++;
      superClickerCost = Math.ceil(superClickerCost * 1.35);
      updateUI();
      checkAchievements();
    }
  }

  // Koop "Glasvezel Backbone"
  function buyFiber() {
    if (score >= fiberCost) {
      score -= fiberCost;
      scorePerSecond += 50;
      fiberCount++;
      fiberCost = Math.ceil(fiberCost * 1.4);
      updateUI();
      checkAchievements();
    }
  }

  // Koop "Datacenter"
  function buyDatacenter() {
    if (score >= datacenterCost) {
      score -= datacenterCost;
      scorePerSecond += 250;
      datacenterCount++;
      datacenterCost = Math.ceil(datacenterCost * 1.45);
      updateUI();
      checkAchievements();
    }
  }

  // Koop "Serge's Brein"
  function buyBrain() {
    if (score >= brainCost) {
      score -= brainCost;
      scorePerSecond += 1000;
      brainCount++;
      brainCost = Math.ceil(brainCost * 1.5);
      updateUI();
      checkAchievements();
    }
  }

  // Koop "Active Directory"
  function buyActiveDirectory() {
    if (score >= adCost) {
      score -= adCost;
      scorePerSecond += 7500; // Aangepaste waarde
      adCount++;
      adCost = Math.ceil(adCost * 1.51); // Aangepaste multiplier
      updateUI();
      checkAchievements();
    }
  }

  // Koop "Proxmox Cluster"
  function buyProxmox() {
    if (score >= proxmoxCost) {
      score -= proxmoxCost;
      scorePerSecond += 5000;
      proxmoxCount++;
      proxmoxCost = Math.ceil(proxmoxCost * 1.52);
      updateUI();
      checkAchievements();
    }
  }

  // Koop "Quantum Link"
  function buyQuantum() {
    if (score >= quantumCost) {
      score -= quantumCost;
      scorePerSecond += 10000;
      quantumCount++;
      quantumCost = Math.ceil(quantumCost * 1.55);
      updateUI();
      checkAchievements();
    }
  }

  // Koop "Hyper-V Farm"
  function buyHyperv() {
    if (score >= hypervCost) {
      score -= hypervCost;
      scorePerSecond += 15000;
      hypervCount++;
      hypervCost = Math.ceil(hypervCost * 1.58);
      updateUI();
      checkAchievements();
    }
  }

  // Koop "AI Admin"
  function buyAi() {
    if (score >= aiCost) {
      score -= aiCost;
      scorePerSecond += 50000;
      aiCount++;
      aiCost = Math.ceil(aiCost * 1.6);
      updateUI();
      checkAchievements();
    }
  }

  // Koop "Singularity"
  function buySingularity() {
    if (score >= singularityCost) {
      score -= singularityCost;
      scorePerSecond += 250000;
      singularityCount++;
      singularityCost = Math.ceil(singularityCost * 1.65);
      updateUI();
      checkAchievements();
    }
  }

  // Koop "Packet Sniffer"
  function buySniffer() {
    if (goldenPacketChance >= 0.25) return; // Cap op 25%

    if (score >= snifferCost) {
      score -= snifferCost;
      snifferCount++;
      goldenPacketChance += 0.01; // Verhoog kans met 1%
      if (goldenPacketChance > 0.25) goldenPacketChance = 0.25; // Hard cap
      snifferCost = Math.ceil(snifferCost * 1.8);
      updateUI();
      checkAchievements();
    }
  }

  // Koop "Gouden Multiplier"
  function buyMultiplier() {
    if (score >= multiplierCost) {
      score -= multiplierCost;
      multiplierCount++;
      goldenPacketBonusMultiplier += 0.1; // Verhoog bonus met 10%
      multiplierCost = Math.ceil(multiplierCost * 2.0);
      updateUI();
      checkAchievements();
    }
  }

  function buyRainbowRouter() {
    if (score >= rainbowRouterCost) {
      score -= rainbowRouterCost;
      scorePerSecond += 1000000; // +1 Miljoen
      rainbowRouterCount++;
      rainbowRouterCost = Math.ceil(rainbowRouterCost * 1.5);
      updateUI();
      checkAchievements();
    }
  }

  function buyGalacticFirewall() {
    if (score >= galacticFirewallCost) {
      score -= galacticFirewallCost;
      scorePerSecond += 5000000; // +5 Miljoen
      galacticFirewallCount++;
      galacticFirewallCost = Math.ceil(galacticFirewallCost * 1.5);
      updateUI();
      checkAchievements();
    }
  }

  function buyTimeServer() {
    if (score >= timeServerCost) {
      score -= timeServerCost;
      scorePerSecond += 25000000; // +25 Miljoen
      timeServerCount++;
      timeServerCost = Math.ceil(timeServerCost * 1.5);
      updateUI();
      checkAchievements();
    }
  }

  function buyParallelVpn() {
    if (score >= parallelVpnCost) {
      score -= parallelVpnCost;
      scorePerSecond += 150000000; // +150 Miljoen
      parallelVpnCount++;
      parallelVpnCost = Math.ceil(parallelVpnCost * 1.5);
      updateUI();
      checkAchievements();
    }
  }

  function buyGodMode() {
    if (score >= godModeCost) {
      score -= godModeCost;
      scorePerSecond += 1000000000; // +1 Biljoen
      godModeCount++;
      godModeCost = Math.ceil(godModeCost * 1.5);
      updateUI();
      checkAchievements();
    }
  }

  // De hoofd-spelloop (voor automatische punten)
  function gameLoop() {
    const packetsThisTick = scorePerSecond / 10;
    score += packetsThisTick;
    totalPacketsGenerated += packetsThisTick; // Voeg toe aan totaal
    updateUI();
    checkAchievements(); // Controleer continu voor SPS-achievements
  }

  // News Ticker Loop
  function updateNewsTicker() {
    const messages = hasEvolved ? evolvedNewsTickerMessages : newsTickerMessages;
    const message = messages[Math.floor(Math.random() * messages.length)];
    newsTickerEl.textContent = message;
  }

  // --- Gouden Packet Systeem ---
  function startGoldenPacketTimer() {
    if (goldenPacketActive) return; // Er is er al een

    // Clear bestaande timers voor de zekerheid
    clearTimeout(goldenPacketTimer);
    clearTimeout(goldenPacketHideTimer);

    // Minimaal 15s, maximaal 60s wachttijd (was 15-75s)
    const minTime = 15000;
    const maxTime = 60000;
    const randomTime = Math.random() * (maxTime - minTime) + minTime;

    goldenPacketTimer = setTimeout(() => {
      // Bad Luck Protection:
      // Effectieve kans = basiskans + bonus
      const effectiveChance = goldenPacketChance + currentRunChanceBonus;

      if (Math.random() < effectiveChance) {
        // Succes!
        spawnGoldenPacket();
        currentRunChanceBonus = 0; // Reset bonus
      } else {
        // Helaas, volgende keer meer kans
        currentRunChanceBonus += 0.005; // +0.5% per fail
        startGoldenPacketTimer(); // Probeer opnieuw
      }
    }, randomTime);
  }

  function spawnGoldenPacket() {
    goldenPacketActive = true;
    clearTimeout(goldenPacketTimer); // Stop de spawn timer

    // Willekeurige positie binnen het venster (viewport)
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Zorg dat het niet te dicht bij de randen komt
    const top = Math.random() * (vh - 200) + 50; // 50px van boven/onder
    const left = Math.random() * (vw - 200) + 50; // 50px van links/rechts

    goldenPacketEl.style.top = `${top}px`;
    goldenPacketEl.style.left = `${left}px`;
    goldenPacketEl.classList.remove("hidden");

    // Verdwijnt na 8 seconden
    clearTimeout(goldenPacketHideTimer); // Reset hide timer
    goldenPacketHideTimer = setTimeout(() => {
      hideGoldenPacket();
    }, 8000);
  }

  function handleClickGoldenPacket() {
    if (!goldenPacketActive) return;

    clearTimeout(goldenPacketHideTimer); // Stop de hide timer direct!

    // Bonus: 10 minuten (600 seconden) aan SPS + 15% van klikkracht
    const spsBonus = scorePerSecond * 600;
    const clickBonus = Math.ceil(clickPower * clickMultiplier) * 0.15;
    const totalBonus = Math.ceil(
      (spsBonus + clickBonus) * goldenPacketBonusMultiplier
    );

    score += totalBonus;
    totalPacketsGenerated += totalBonus;
    goldenPacketClicks++;
    goldenPacketTotalValue += totalBonus;

    showToast(
      `Gouden Packet!`,
      `+${formatNumberWithWords(totalBonus)} packets!`,
      "info"
    );
    hideGoldenPacket();
    checkAchievements();
  }

  function hideGoldenPacket() {
    goldenPacketActive = false;
    goldenPacketEl.classList.add("hidden");
    clearTimeout(goldenPacketHideTimer); // Clear timer
    startGoldenPacketTimer(); // Start de timer voor de volgende
  }

  // --- Save/Load Systeem ---
  function saveGame() {
    const saveData = {
      score,
      scorePerSecond,
      clickPower,
      totalManualClicks,
      totalPacketsGenerated,
      clickMultiplier,
      clickerCost,
      clickerCount,
      codeCost,
      codeCount,
      guiCost,
      guiCount,
      autoClickerCost,
      autoClickerCount,
      superClickerCost,
      superClickerCount,
      fiberCost,
      fiberCount,
      datacenterCost,
      datacenterCount,
      brainCost,
      brainCount,
      adCost,
      adCount,
      proxmoxCost,
      proxmoxCount,
      quantumCost,
      quantumCount,
      hypervCost,
      hypervCount,
      aiCost,
      aiCount,
      singularityCost,
      singularityCount,
      snifferCost,
      snifferCount,
      multiplierCost,
      multiplierCount,
      goldenPacketClicks,
      goldenPacketTotalValue,
      goldenPacketBonusMultiplier,
      goldenPacketChance,
      achievements,
      hasEvolved,
      hasUsedCheat,
      // ... bestaande data
      rainbowRouterCost,
      rainbowRouterCount,
      galacticFirewallCost,
      galacticFirewallCount,
      timeServerCost,
      timeServerCount,
      parallelVpnCost,
      parallelVpnCount,
      godModeCost,
      godModeCount,
      // ...
    };
    localStorage.setItem(saveKey, JSON.stringify(saveData));
    showSaveFeedback("Spel opgeslagen!");
  }

  function loadGame() {
    const savedData = localStorage.getItem(saveKey);
    if (savedData) {
      const data = JSON.parse(savedData);

      score = data.score || 0;
      scorePerSecond = data.scorePerSecond || 0;
      clickPower = data.clickPower || 1;
      totalManualClicks = data.totalManualClicks || 0;
      totalPacketsGenerated = data.totalPacketsGenerated || 0;
      clickMultiplier = data.clickMultiplier || 1.0;

      clickerCost = data.clickerCost || 25;
      clickerCount = data.clickerCount || 0;
      codeCost = data.codeCost || 1000;
      codeCount = data.codeCount || 0;
      guiCost = data.guiCost || 50000;
      guiCount = data.guiCount || 0;
      autoClickerCost = data.autoClickerCost || 50;
      autoClickerCount = data.autoClickerCount || 0;
      superClickerCost = data.superClickerCost || 500;
      superClickerCount = data.superClickerCount || 0;
      fiberCost = data.fiberCost || 8000;
      fiberCount = data.fiberCount || 0;
      datacenterCost = data.datacenterCost || 100000;
      datacenterCount = data.datacenterCount || 0;
      brainCost = data.brainCost || 1000000;
      brainCount = data.brainCount || 0;

      adCost = data.adCost || 1500000;
      adCount = data.adCount || 0;
      proxmoxCost = data.proxmoxCost || 5000000;
      proxmoxCount = data.proxmoxCount || 0;
      quantumCost = data.quantumCost || 12000000;
      quantumCount = data.quantumCount || 0;
      hypervCost = data.hypervCost || 20000000;
      hypervCount = data.hypervCount || 0;
      aiCost = data.aiCost || 75000000;
      aiCount = data.aiCount || 0;
      singularityCost = data.singularityCost || 500000000;
      singularityCount = data.singularityCount || 0;

      // Zorg voor compatibiliteit met oude saves
      snifferCost = data.snifferCost || 500000;
      snifferCount = data.snifferCount || 0;
      multiplierCost = data.multiplierCost || 2000000;
      multiplierCount = data.multiplierCount || 0;
      goldenPacketClicks = data.goldenPacketClicks || 0;
      goldenPacketTotalValue = data.goldenPacketTotalValue || 0;
      goldenPacketBonusMultiplier = data.goldenPacketBonusMultiplier || 1.0;
      goldenPacketChance = data.goldenPacketChance || 0.05;
      hasEvolved = Boolean(data.hasEvolved);
      hasUsedCheat = Boolean(data.hasUsedCheat);
      rainbowRouterCost = data.rainbowRouterCost || 2500000000;
      rainbowRouterCount = data.rainbowRouterCount || 0;
      galacticFirewallCost = data.galacticFirewallCost || 10000000000;
      galacticFirewallCount = data.galacticFirewallCount || 0;
      timeServerCost = data.timeServerCost || 50000000000;
      timeServerCount = data.timeServerCount || 0;
      parallelVpnCost = data.parallelVpnCost || 250000000000;
      parallelVpnCount = data.parallelVpnCount || 0;
      godModeCost = data.godModeCost || 1000000000000;
      godModeCount = data.godModeCount || 0;
      if (hasEvolved) {
        applyEvolvedTheme();
      }

      // Laad achievements en zorg dat nieuwe achievements worden herkend
      achievements = Object.assign(initializeAchievements(), data.achievements);

      showToast("Spel geladen!", "Welkom terug.", "info");
    } else {
      // Geen save file, initialiseer achievements
      achievements = initializeAchievements();
    }
  }

  function resetGame() {
    // We gebruiken geen confirm()
    const confirmed = prompt(
      "Weet je het zeker? Typ 'RESET' om al je voortgang te wissen."
    );
    if (confirmed === "RESET") {
      localStorage.removeItem(saveKey);
      location.reload();
    } else {
      showToast("Reset geannuleerd", "Je voortgang is veilig.", "info");
    }
  }

  // Controleer of de afbeelding correct is geladen
  clickableImage.onerror = () => {
    clickableImage.classList.add("hidden"); // Verberg de kapotte afbeelding
    imageErrorEl.classList.remove("hidden"); // Toon de foutmelding
  };

  // --- Event Listeners ---
  clickableImage.addEventListener("click", handleClick);

  // Koop knoppen (luister naar het hele item-vak)
  buyClickerBtn.closest(".shop-item").addEventListener("click", buyClicker);
  buyCodeBtn.closest(".shop-item").addEventListener("click", buyCode);
  buyGuiBtn.closest(".shop-item").addEventListener("click", buyGui);
  buyAutoClickerBtn
    .closest(".shop-item")
    .addEventListener("click", buyAutoClicker);
  buySuperClickerBtn
    .closest(".shop-item")
    .addEventListener("click", buySuperClicker);
  buyFiberBtn.closest(".shop-item").addEventListener("click", buyFiber);
  buyDatacenterBtn
    .closest(".shop-item")
    .addEventListener("click", buyDatacenter);
  buyBrainBtn.closest(".shop-item").addEventListener("click", buyBrain);
  buyAdBtn.closest(".shop-item").addEventListener("click", buyActiveDirectory);
  buyProxmoxBtn.closest(".shop-item").addEventListener("click", buyProxmox);
  buyQuantumBtn.closest(".shop-item").addEventListener("click", buyQuantum);
  buyHypervBtn.closest(".shop-item").addEventListener("click", buyHyperv);
  buyAiBtn.closest(".shop-item").addEventListener("click", buyAi);
  buySingularityBtn
    .closest(".shop-item")
    .addEventListener("click", buySingularity);
  buySnifferBtn.closest(".shop-item").addEventListener("click", buySniffer);
  buyMultiplierBtn
    .closest(".shop-item")
    .addEventListener("click", buyMultiplier);

  buyRainbowRouterBtn
    .closest(".shop-item")
    .addEventListener("click", buyRainbowRouter);
  buyGalacticFirewallBtn
    .closest(".shop-item")
    .addEventListener("click", buyGalacticFirewall);
  buyTimeServerBtn
    .closest(".shop-item")
    .addEventListener("click", buyTimeServer);
  buyParallelVpnBtn
    .closest(".shop-item")
    .addEventListener("click", buyParallelVpn);
  buyGodModeBtn.closest(".shop-item").addEventListener("click", buyGodMode);

  // Gouden Packet
  goldenPacketEl.addEventListener("click", handleClickGoldenPacket);

  // Save/Load knoppen
  saveBtn.addEventListener("click", saveGame);
  loadBtn.addEventListener("click", () => {
    location.reload(); // Laden gebeurt automatisch bij DOMContentLoaded
  });
  resetBtn.addEventListener("click", resetGame);

  function handleCheatSubmit() {
    if (!cheatInputEl) return;
    executeCheatCommand(cheatInputEl.value);
  }

  if (cheatBtn && cheatInputEl) {
    cheatBtn.addEventListener("click", handleCheatSubmit);
    cheatInputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleCheatSubmit();
      }
    });
  }

  if (evolveBtn) {
    evolveBtn.addEventListener("click", handleEvolveClick);
  }

  // --- Spel Starten ---
  loadGame(); // Laad voortgang (of start nieuw)
  renderAchievements(); // Bouw de prestatielijst
  setInterval(gameLoop, 100); // Update 10 keer per seconde
  setInterval(updateNewsTicker, 5000); // Update nieuws elke 5s
  setInterval(saveGame, 30000); // Auto-save elke 30s

  startGoldenPacketTimer(); // Start de timer voor de gouden packets
  updateNewsTicker(); // Roep meteen aan voor eerste bericht
  updateUI(); // Zet de initiële UI-waarden
});


