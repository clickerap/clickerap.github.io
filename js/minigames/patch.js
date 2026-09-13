// De patchkast. Je legt kabels in een patchpaneel, ze rijpen, en twee
// verschillende rijpe kabels naast elkaar kunnen een protocol opleveren.
// Elk ontdekt protocol geeft blijvend 2% extra productie.

import { G, D, earn, unlock, recompute } from "../state.js";
import { fmtTime } from "../format.js";
import { toast, chord } from "../ui/fx.js";
import { egg } from "../eggs.js";
import { KABELS, PROTOCOLLEN } from "../data/patch.js";

const ALLE = { ...KABELS, ...PROTOCOLLEN };
export { KABELS, PROTOCOLLEN };
const MAAT = 36;

function kast() {
  const p = G.minigames.patch;
  if (!p.grid || p.grid.length !== MAAT) p.grid = Array.from({ length: MAAT }, () => null);
  if (!p.discovered) p.discovered = {};
  return p;
}

export function ontdekteAantal() {
  return Object.keys(G.minigames.patch?.discovered || {}).length;
}

function beschikbareZaden() {
  const p = kast();
  return [...Object.keys(KABELS), ...Object.keys(p.discovered)];
}

let gekozen = "utp";

function buren(index) {
  const rij = Math.floor(index / 6);
  const kol = index % 6;
  const uit = [];
  if (rij > 0) uit.push(index - 6);
  if (rij < 5) uit.push(index + 6);
  if (kol > 0) uit.push(index - 1);
  if (kol < 5) uit.push(index + 1);
  return uit;
}

function rijp(cel) {
  return cel && Date.now() >= cel.klaar;
}

function probeerOntdekking(index) {
  const p = kast();
  const soorten = new Set();
  for (const b of buren(index)) {
    const cel = p.grid[b];
    if (rijp(cel)) soorten.add(cel.soort);
  }
  if (soorten.size < 2) return null;
  for (const [id, def] of Object.entries(PROTOCOLLEN)) {
    if (p.discovered[id]) continue;
    if (def.paar.every((s) => soorten.has(s))) {
      if (Math.random() < 0.55) {
        p.discovered[id] = true;
        recompute();
        unlock("patch-protocol");
        if (id === "tokenring") egg("egg-tokenring", "Token Ring", "Een protocol dat dood had moeten blijven. Het werkt.", D.pps * 200);
        if (Object.keys(p.discovered).length === Object.keys(PROTOCOLLEN).length) unlock("patch-alles");
        return def;
      }
      return null;
    }
  }
  return null;
}

function plant(index) {
  const p = kast();
  if (p.grid[index]) return false;
  const def = ALLE[gekozen];
  if (!def) return false;
  p.grid[index] = { soort: gekozen, gezet: Date.now(), klaar: Date.now() + def.groei * 1000 };
  p.plantedEver = (p.plantedEver || 0) + 1;
  unlock("patch-1");
  return true;
}

function oogst(index) {
  const p = kast();
  const cel = p.grid[index];
  if (!rijp(cel)) return false;
  const def = ALLE[cel.soort];
  const ontdekking = probeerOntdekking(index);
  p.grid[index] = null;
  const winst = Math.max(def.waarde * 10, D.pps * def.waarde) * D.minigameReward;
  earn(winst);
  chord([600, 800]);
  if (ontdekking) {
    toast({
      title: `Nieuw protocol: ${ontdekking.naam}`,
      text: "Je kunt het nu zelf leggen. Alles produceert 2% meer.",
      icon: ontdekking.icon,
      tone: "goud",
    });
  }
  return true;
}

export const patch = {
  id: "patch",
  name: "Patchkast",
  icon: "🗄️",
  eis: "Vraagt glasvezel",
  unlocked: () => (G.buildings.fiber || 0) >= 1,
  render(root) {
    const p = kast();
    const zaden = beschikbareZaden();
    if (!zaden.includes(gekozen)) gekozen = zaden[0];

    root.innerHTML = `
      <div class="labo-kop">
        <h3>Patchkast</h3>
        <span>${ontdekteAantal()} / ${Object.keys(PROTOCOLLEN).length} protocollen · +${ontdekteAantal() * 2}%</span>
      </div>
      <p class="labo-uitleg">Leg een kabel in een vrije poort. Als hij rijp is, oogst je hem. Twee verschillende rijpe kabels naast de poort die je oogst kunnen samen een nieuw protocol opleveren.</p>
      <div class="zaadbalk" id="zaden"></div>
      <div class="patchgrid" id="grid"></div>`;

    const zaadbalk = root.querySelector("#zaden");
    for (const id of zaden) {
      const def = ALLE[id];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `zaad${id === gekozen ? " on" : ""}`;
      btn.innerHTML = `<span>${def.icon}</span> ${def.naam} <small>${fmtTime(def.groei)}</small>`;
      btn.addEventListener("click", () => {
        gekozen = id;
        this.render(root);
      });
      zaadbalk.append(btn);
    }

    const grid = root.querySelector("#grid");
    for (let i = 0; i < MAAT; i++) {
      const cel = p.grid[i];
      const poort = document.createElement("button");
      poort.type = "button";
      poort.className = "poort";
      poort.setAttribute("aria-label", cel ? `${ALLE[cel.soort].naam}, poort ${i + 1}` : `Lege poort ${i + 1}`);
      if (cel) {
        const def = ALLE[cel.soort];
        const klaar = rijp(cel);
        poort.textContent = def.icon;
        poort.classList.toggle("rijp", klaar);
        if (!klaar) {
          const totaal = def.groei * 1000;
          const gedaan = Date.now() - cel.gezet;
          const balk = document.createElement("span");
          balk.className = "groei";
          balk.style.transform = `scaleX(${Math.min(1, gedaan / totaal)})`;
          poort.append(balk);
          poort.title = `${def.naam} — nog ${fmtTime((cel.klaar - Date.now()) / 1000)}`;
        } else {
          poort.title = `${def.naam} — klaar om te oogsten`;
        }
      }
      poort.addEventListener("click", () => {
        const gedaan = cel ? oogst(i) : plant(i);
        if (gedaan) this.render(root);
      });
      grid.append(poort);
    }
  },
};
