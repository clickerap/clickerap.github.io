// Verborgen dingen. Niets hiervan staat in de uitleg, alles geeft een prestatie.
// Wie de lijst wil weten, moet de broncode maar lezen — dat mag.

import { G, D, findEgg, earn, recompute, touch, UPGRADES, ACHIEVEMENTS } from "./state.js";
import { on, emit } from "./bus.js";
import { toast, sparks, chord } from "./ui/fx.js";
import { fmt } from "./format.js";
import { BUILDINGS } from "./data/buildings.js";
import { ALLE_SKINS } from "./data/uiterlijk.js";

function beloon(id, title, text, bonus = 0) {
  if (!findEgg(id)) return;
  if (bonus > 0) earn(bonus);
  toast({
    title: `Verborgen gevonden: ${title}`,
    text: bonus > 0 ? `${text} (+${fmt(bonus)} packets)` : text,
    icon: "🥚",
    tone: "goud",
  });
  chord([520, 700, 920, 1180]);
}

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konamiPos = 0;
let getypt = "";

function letterEggs(key) {
  getypt = (getypt + key.toLowerCase()).slice(-16);
  if (getypt.endsWith("serge")) {
    beloon("egg-naam", "Hij hoort je", "Serge kijkt even op van zijn scherm.", D.clickValue * 100);
    const img = document.getElementById("serge");
    img.animate(
      [{ transform: "rotate(0)" }, { transform: "rotate(-8deg) scale(1.05)" }, { transform: "rotate(0)" }],
      { duration: 700, easing: "cubic-bezier(.2,.8,.3,1)" }
    );
  }
  if (getypt.endsWith("hackerman")) {
    beloon("egg-kabel", "Kabelsalade", "Ergens in een patchkast krijgt iemand het koud.", D.pps * 60);
  }
}

export function initEggs() {
  document.addEventListener("keydown", (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.key === KONAMI[konamiPos] || e.key.toLowerCase() === KONAMI[konamiPos]) {
      konamiPos++;
      if (konamiPos === KONAMI.length) {
        konamiPos = 0;
        beloon("egg-konami", "Up, up, down, down", "Dertig levens zijn er niet. Wel packets.", Math.max(1000, D.pps * 300));
        for (let i = 0; i < 5; i++) {
          setTimeout(() => sparks(window.innerWidth / 2, window.innerHeight / 2, 16), i * 120);
        }
      }
    } else {
      konamiPos = e.key === KONAMI[0] ? 1 : 0;
    }
    if (e.key.length === 1) letterEggs(e.key);
  });

  // Op de neus: precies in het midden van de foto, tien keer.
  let neus = 0;
  document.getElementById("serge").addEventListener("click", (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    if (Math.hypot(dx, dy) < 0.09) {
      neus++;
      if (neus >= 10) beloon("egg-neus", "Op de neus", "Tien keer precies raak.", D.clickValue * 250);
    }
  });

  let rechts = 0;
  on("egg:rechtsklik", () => {
    rechts++;
    if (rechts >= 10) beloon("egg-rechts", "Contextmenu", "Er zit hier niets onder. Toch bleef je klikken.", D.clickValue * 120);
  });

  let ticker = 0;
  document.getElementById("news").addEventListener("click", () => {
    ticker++;
    if (ticker >= 25) beloon("egg-ticker", "Persmuskiet", "Het nieuws is nu officieel stuk.", D.pps * 45);
  });

  let scoreKlik = 0;
  document.getElementById("score").addEventListener("click", () => {
    scoreKlik++;
    if (scoreKlik >= 50) beloon("egg-score", "Telfout", "Het getal wordt er niet groter van. Dit wel.", D.pps * 90);
  });

  on("idle:long", () => beloon("egg-geduld", "Geduld", "Tien minuten niets doen. Het netwerk draaide door.", D.pps * 600));

  on("bought", ({ id }) => {
    if ((G.buildings[id] || 0) === 42) {
      beloon("egg-42", "Het antwoord", "Precies tweeënveertig. Toeval bestaat niet.", D.pps * 42);
    }
  });

  // Klokgebonden: wordt elke twintig seconden nagekeken.
  const klok = () => {
    const nu = new Date();
    if (nu.getHours() === 13 && nu.getMinutes() === 37) {
      beloon("egg-1337u", "13:37", "Je bent op precies het juiste moment langsgekomen.", D.pps * 133);
    }
    if (nu.getHours() === 3) {
      beloon("egg-nacht", "Nachtdienst", "Om deze tijd is er niemand anders in het datacenter.", D.pps * 300);
    }
    if (Math.floor(G.packets) === 1337) {
      beloon("egg-1337", "Elite", "Precies 1337 packets. Niet aankomen.", 0);
    }
  };
  setInterval(klok, 20000);
  klok();
}

// Wordt vanuit de minigames aangeroepen.
export function egg(id, title, text, bonus = 0) {
  beloon(id, title, text, bonus);
}

// --- Verborgen console ---
// Zeven keer op het versienummer in "Meer". Alleen voor testen; wie hem
// gebruikt krijgt een merkteken op zijn save, geen straf.

export function initConsole() {
  on("meer:klaar", () => {
    const versie = document.getElementById("versie");
    if (!versie || versie.dataset.gekoppeld) return;
    versie.dataset.gekoppeld = "1";
    let n = 0;
    versie.addEventListener("click", () => {
      n++;
      if (n === 3) egg("egg-versie", "Kleine lettertjes", "Er staat hier verder niets. Of toch?", 0);
      if (n === 7) openConsole(versie);
    });
    if (G.cheated) openConsole(versie);
  });
}

function openConsole(anchor) {
  if (document.getElementById("cheat-kaart")) return;
  egg("egg-console", "Achterdeur", "Je hebt de console gevonden. Serge weet van niets.", 0);
  const kaart = document.createElement("div");
  kaart.className = "kaart";
  kaart.id = "cheat-kaart";
  kaart.innerHTML = `
    <h3>Console</h3>
    <p class="panel-intro">add 1e9 · set 1000 · pps 500 · gebouw switch 100 · upgrades · prestaties · skins · punten 50 · goud · reset</p>
    <div class="knoprij" style="margin-top:10px">
      <input class="veld" id="cheat-in" placeholder="commando" autocomplete="off" style="flex:1;min-width:140px" />
      <button type="button" class="btn" id="cheat-go">Uitvoeren</button>
    </div>
    <p class="melding" id="cheat-uit"></p>`;
  anchor.closest(".kaart").after(kaart);
  const veld = document.getElementById("cheat-in");
  const uit = document.getElementById("cheat-uit");
  const run = () => {
    const antwoord = uitvoeren(veld.value);
    uit.textContent = antwoord.text;
    uit.classList.toggle("fout", !!antwoord.fout);
    veld.value = "";
  };
  document.getElementById("cheat-go").addEventListener("click", run);
  veld.addEventListener("keydown", (e) => {
    if (e.key === "Enter") run();
  });
}

function getal(token) {
  const n = Number(String(token).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function uitvoeren(raw) {
  const delen = String(raw || "").trim().split(/\s+/);
  const cmd = (delen[0] || "").toLowerCase();
  if (!cmd) return { text: "" };
  G.cheated = true;

  switch (cmd) {
    case "add": {
      const n = getal(delen[1]);
      if (n === null) return { text: "add <aantal>", fout: true };
      earn(n, { lifetime: false });
      return { text: `${fmt(n)} packets erbij.` };
    }
    case "set": {
      const n = getal(delen[1]);
      if (n === null) return { text: "set <aantal>", fout: true };
      G.packets = n;
      return { text: `Score staat op ${fmt(n)}.` };
    }
    case "gebouw": {
      const b = BUILDINGS.find((x) => x.id === delen[1]);
      const n = getal(delen[2]);
      if (!b || n === null) return { text: `gebouw <${BUILDINGS.map((x) => x.id).slice(0, 4).join("|")}|…> <aantal>`, fout: true };
      G.buildings[b.id] = Math.max(0, Math.floor(n));
      recompute();
      return { text: `${b.name}: ${fmt(n)}.` };
    }
    case "upgrades": {
      for (const u of UPGRADES) G.upgrades[u.id] = true;
      recompute();
      return { text: "Alle upgrades vrijgegeven." };
    }
    case "prestaties": {
      for (const a of ACHIEVEMENTS) G.achievements[a.id] = true;
      recompute();
      return { text: "Alle prestaties vrijgegeven." };
    }
    case "skins": {
      // Alles tegelijk, zonder een melding per ding.
      for (const skin of ALLE_SKINS) G.skins[`${skin.soort}:${skin.id}`] = true;
      touch();
      emit("uiterlijk");
      return { text: `Alle ${ALLE_SKINS.length} onderdelen van Uiterlijk vrijgegeven.` };
    }
    case "punten": {
      const n = getal(delen[1]) ?? 10;
      G.ects += n;
      G.prestige += n;
      recompute();
      return { text: `${fmt(n)} studiepunten erbij.` };
    }
    case "goud":
      emit("cheat:goud");
      return { text: "Er komt een packet aan." };
    case "pps": {
      const n = getal(delen[1]);
      if (n === null) return { text: "pps <aantal>", fout: true };
      const switchB = BUILDINGS[1];
      G.buildings[switchB.id] = Math.ceil(n / switchB.basePps);
      recompute();
      return { text: `Ongeveer ${fmt(D.pps)} p/s.` };
    }
    case "reset":
      G.buffs = [];
      recompute();
      return { text: "Buffs gewist." };
    default:
      return { text: `Onbekend commando: ${cmd}`, fout: true };
  }
}
