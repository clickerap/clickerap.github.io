// De bandbreedtemarkt. Koersen bewegen ook als je niet kijkt.
// Je investeert packets in een goed; je verdient of verliest op de koers,
// niet op de tijd, zodat de markt niet meegroeit met je productie.

import { G, D, earn, unlock, spend } from "../state.js";
import { fmt, fmtPct } from "../format.js";
import { toast, blip, chord } from "../ui/fx.js";
import { GOEDEREN, KOPPEN } from "../data/market.js";

export { GOEDEREN };

function markt() {
  const m = G.minigames.market;
  if (!m.prices) {
    m.prices = {};
    m.historie = {};
    for (const g of GOEDEREN) {
      m.prices[g.id] = 90 + Math.random() * 30;
      m.historie[g.id] = [m.prices[g.id]];
    }
  }
  if (!m.historie) {
    m.historie = {};
    for (const g of GOEDEREN) m.historie[g.id] = [m.prices[g.id]];
  }
  if (!m.holdings) m.holdings = {};
  return m;
}

let laatsteKop = null;

export function tickMarkt() {
  const m = markt();
  m.tick = (m.tick || 0) + 1;

  if (Math.random() < 0.045) {
    const [id, tekst, factor] = KOPPEN[Math.floor(Math.random() * KOPPEN.length)];
    m.prices[id] = clamp(m.prices[id] * factor);
    laatsteKop = tekst;
  }

  for (const g of GOEDEREN) {
    const koers = m.prices[g.id];
    const ruis = (Math.random() + Math.random() + Math.random() - 1.5) * g.vol;
    const terugval = (100 - koers) * 0.012;
    m.prices[g.id] = clamp(koers * (1 + ruis) + terugval);
    const h = m.historie[g.id];
    h.push(m.prices[g.id]);
    if (h.length > 40) h.shift();
  }
}

function clamp(v) {
  return Math.min(400, Math.max(12, v));
}

function waardeVan(id) {
  const m = markt();
  const bezit = m.holdings[id];
  if (!bezit) return 0;
  return bezit.invested * (m.prices[id] / bezit.koers);
}

function spark(id, stijgt) {
  const h = markt().historie[id] || [];
  if (h.length < 2) return "";
  const min = Math.min(...h);
  const max = Math.max(...h);
  const span = Math.max(1, max - min);
  const punten = h
    .map((v, i) => `${(i / (h.length - 1)) * 100},${22 - ((v - min) / span) * 20}`)
    .join(" ");
  return `<svg class="spark" viewBox="0 0 100 22" preserveAspectRatio="none" aria-hidden="true">
    <polyline points="${punten}" fill="none" stroke="${stijgt ? "#15803d" : "#b91c1c"}" stroke-width="1.8" vector-effect="non-scaling-stroke" />
  </svg>`;
}

export const market = {
  id: "market",
  name: "Markt",
  icon: "📈",
  eis: "Vraagt een serverrack",
  unlocked: () => (G.buildings.rack || 0) >= 1,
  render(root) {
    const m = markt();
    const totaal = GOEDEREN.reduce((sum, g) => sum + waardeVan(g.id), 0);
    root.innerHTML = `
      <div class="labo-kop">
        <h3>Bandbreedtemarkt</h3>
        <span>in bezit ${fmt(totaal)} · verzilverd ${fmt(m.profit || 0)}</span>
      </div>
      <p class="labo-uitleg">${laatsteKop || "Koersen bewegen door, ook als je dit tabblad sluit. Met + investeer je een tiende van je packets, met − verkoop je alles van dat goed. Winst telt pas als je verkoopt."}</p>
      <div class="markt" id="markt-lijst"></div>`;

    const lijst = root.querySelector("#markt-lijst");
    for (const g of GOEDEREN) {
      const koers = m.prices[g.id];
      const vorige = (m.historie[g.id] || [koers])[Math.max(0, (m.historie[g.id] || []).length - 6)] || koers;
      const verschil = (koers - vorige) / vorige;
      const bezit = waardeVan(g.id);
      const rij = document.createElement("div");
      rij.className = "markt-rij";
      rij.innerHTML = `
        <span>${g.icon} ${g.naam}</span>
        ${spark(g.id, verschil >= 0)}
        <span class="koers ${verschil >= 0 ? "op" : "neer"}">${koers.toFixed(1)}<br><small>${verschil >= 0 ? "+" : ""}${fmtPct(verschil, 1)}</small></span>
        <span class="markt-knoppen">
          <button type="button" data-koop="${g.id}" title="Investeer 10% van je packets">+</button>
          <button type="button" data-verkoop="${g.id}" title="Verkoop alles" ${bezit > 0 ? "" : "disabled"}>−</button>
        </span>`;
      if (bezit > 0) {
        const winst = bezit - m.holdings[g.id].invested;
        const label = document.createElement("span");
        label.className = "bezit";
        label.style.gridColumn = "1 / -1";
        label.innerHTML = `In bezit: ${fmt(bezit)} packets <span class="${winst >= 0 ? "op" : "neer"}">(${winst >= 0 ? "+" : ""}${fmt(winst)})</span>`;
        rij.append(label);
      }
      lijst.append(rij);
    }

    lijst.addEventListener("click", (e) => {
      const koop = e.target.dataset?.koop;
      const verkoop = e.target.dataset?.verkoop;
      if (koop) kopen(koop);
      if (verkoop) verkopen(verkoop);
      if (koop || verkoop) this.render(root);
    });
  },
};

function kopen(id) {
  const m = markt();
  const bedrag = Math.floor(G.packets * 0.1);
  if (bedrag < 1) {
    toast({ title: "Te weinig packets", text: "Je hebt niets om te investeren." });
    return;
  }
  if (!spend(bedrag)) return;
  const bestaand = m.holdings[id];
  if (bestaand) {
    // Gewogen gemiddelde inkoopkoers, zodat bijkopen eerlijk blijft.
    const nieuweWaarde = waardeVan(id) + bedrag;
    bestaand.koers = m.prices[id];
    bestaand.invested = nieuweWaarde;
  } else {
    m.holdings[id] = { invested: bedrag, koers: m.prices[id] };
  }
  blip(500, 0.05);
}

function verkopen(id) {
  const m = markt();
  const bezit = m.holdings[id];
  if (!bezit) return;
  const opbrengst = waardeVan(id);
  const winst = opbrengst - bezit.invested;
  earn(opbrengst, { lifetime: winst > 0 });
  m.profit = (m.profit || 0) + winst;
  delete m.holdings[id];
  if (winst > 0) {
    unlock("beurs-winst");
    chord([620, 820]);
    if (winst > Math.max(1e4, D.pps * 3600)) unlock("beurs-fortuin");
  } else {
    blip(260, 0.1, 0.04);
  }
  toast({
    title: winst >= 0 ? "Verkocht met winst" : "Verkocht met verlies",
    text: `${fmt(opbrengst)} packets terug (${winst >= 0 ? "+" : ""}${fmt(winst)}).`,
    icon: "📈",
    tone: winst >= 0 ? "goed" : "slecht",
  });
}

export function startMarkt() {
  markt();
  setInterval(tickMarkt, 5000);
}
