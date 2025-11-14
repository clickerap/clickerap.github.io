document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elementen ---
  const scoreEl = document.getElementById("score");
  const spsEl = document.getElementById("sps");
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
  const saveBtn = document.getElementById("save-btn");
  const loadBtn = document.getElementById("load-btn");
  const resetBtn = document.getElementById("reset-btn");
  const saveFeedbackEl = document.getElementById("save-feedback");
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
  let goldenPacketActive = false;
  let goldenPacketClicks = 0;
  let goldenPacketBonusMultiplier = 1.0;
  let goldenPacketChance = 0.05; // 5% basiskans per 30s

  const saveKey = "sergeClickerSave";

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
  }

  // --- Functies ---

  // Update alle UI-elementen (score, kosten, knoppen, stats)
  function updateUI() {
    // Gebruik Math.floor om alleen hele punten te tonen
    scoreEl.textContent = Math.floor(score);
    // Toon SPS met 1 decimaal
    spsEl.textContent = scorePerSecond.toFixed(1);

    // Update kosten en aantallen in de winkel
    clickerCostEl.textContent = clickerCost;
    clickerCountEl.textContent = clickerCount;
    codeCostEl.textContent = codeCost;
    codeCountEl.textContent = codeCount;
    guiCostEl.textContent = guiCost;
    guiCountEl.textContent = guiCount;
    autoClickerCostEl.textContent = autoClickerCost;
    autoClickerCountEl.textContent = autoClickerCount;
    superClickerCostEl.textContent = superClickerCost;
    superClickerCountEl.textContent = superClickerCount;
    fiberCostEl.textContent = fiberCost;
    fiberCountEl.textContent = fiberCount;
    datacenterCostEl.textContent = datacenterCost;
    datacenterCountEl.textContent = datacenterCount;
    brainCostEl.textContent = brainCost;
    brainCountEl.textContent = brainCount;
    adCostEl.textContent = adCost;
    adCountEl.textContent = adCount;
    proxmoxCostEl.textContent = proxmoxCost;
    proxmoxCountEl.textContent = proxmoxCount;
    quantumCostEl.textContent = quantumCost;
    quantumCountEl.textContent = quantumCount;
    hypervCostEl.textContent = hypervCost;
    hypervCountEl.textContent = hypervCount;
    aiCostEl.textContent = aiCost;
    aiCountEl.textContent = aiCount;
    singularityCostEl.textContent = singularityCost;
    singularityCountEl.textContent = singularityCount;
    snifferCostEl.textContent = snifferCost;
    snifferCountEl.textContent = snifferCount;
    multiplierCostEl.textContent = multiplierCost;
    multiplierCountEl.textContent = multiplierCount;

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

    buySnifferBtn.disabled = score < snifferCost;
    buySnifferBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < snifferCost);

    buyMultiplierBtn.disabled = score < multiplierCost;
    buyMultiplierBtn
      .closest(".shop-item")
      .classList.toggle("disabled", score < multiplierCost);

    // Update Statistieken
    statClicksEl.textContent = totalManualClicks;
    statTotalEl.textContent = Math.floor(totalPacketsGenerated);
    statPowerEl.textContent = `${Math.ceil(
      clickPower * clickMultiplier
    )} (x${clickMultiplier.toFixed(2)})`;
    statGoldenClicksEl.textContent = goldenPacketClicks; // Update nieuwe statistiek
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
    statUpgradesEl.textContent = totalUpgrades;
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
    if (score >= snifferCost) {
      score -= snifferCost;
      snifferCount++;
      goldenPacketChance += 0.01; // Verhoog kans met 1%
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
    const message =
      newsTickerMessages[Math.floor(Math.random() * newsTickerMessages.length)];
    newsTickerEl.textContent = message;
  }

  // --- Gouden Packet Systeem ---
  function startGoldenPacketTimer() {
    if (goldenPacketActive) return; // Er is er al een

    const baseInterval = 30000; // 30 seconden
    // Minimaal 15s, maximaal 60s wachttijd
    const randomTime = Math.random() * (baseInterval * 2) + baseInterval / 2;

    goldenPacketTimer = setTimeout(() => {
      if (Math.random() < goldenPacketChance) {
        // Kansberekening
        spawnGoldenPacket();
      } else {
        startGoldenPacketTimer(); // Probeer opnieuw
      }
    }, randomTime);
  }

  function spawnGoldenPacket() {
    goldenPacketActive = true;

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
    setTimeout(() => {
      hideGoldenPacket();
    }, 8000);
  }

  function handleClickGoldenPacket() {
    if (!goldenPacketActive) return;

    // Bonus: 10 minuten (600 seconden) aan SPS + 15% van klikkracht
    const spsBonus = scorePerSecond * 600;
    const clickBonus = Math.ceil(clickPower * clickMultiplier) * 0.15;
    const totalBonus = Math.ceil(
      (spsBonus + clickBonus) * goldenPacketBonusMultiplier
    );

    score += totalBonus;
    totalPacketsGenerated += totalBonus;
    goldenPacketClicks++;

    showToast(`Gouden Packet!`, `+${totalBonus} packets!`, "info");
    hideGoldenPacket();
    checkAchievements();
  }

  function hideGoldenPacket() {
    goldenPacketActive = false;
    goldenPacketEl.classList.add("hidden");
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
      goldenPacketBonusMultiplier,
      goldenPacketChance,
      achievements,
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
      goldenPacketBonusMultiplier = data.goldenPacketBonusMultiplier || 1.0;
      goldenPacketChance = data.goldenPacketChance || 0.05;

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

  // Gouden Packet
  goldenPacketEl.addEventListener("click", handleClickGoldenPacket);

  // Save/Load knoppen
  saveBtn.addEventListener("click", saveGame);
  loadBtn.addEventListener("click", () => {
    location.reload(); // Laden gebeurt automatisch bij DOMContentLoaded
  });
  resetBtn.addEventListener("click", resetGame);

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






