// De vijf tabbladen: winkel, upgrades, prestaties, studie en meer.
// Elk paneel bouwt zijn DOM één keer op en werkt daarna alleen tekst en
// klassen bij, zodat hover, focus en scrollpositie blijven staan.

import {
  G, D, BUILDINGS, BUILDING_BY_ID, VAKKEN, ACHIEVEMENTS, NODES,
  buyBuilding, sellBuilding, priceOf, availableUpgrades, buyUpgrade,
  buyNode, graduate, ectsOnGraduate, koffieRank, skinUnlocked, kiesSkin,
} from "../state.js";
import { UPGRADE_BY_ID } from "../data/upgrades.js";
import { UITERLIJK, SOORTNAMEN, SOORTUITLEG, RANGEN, RANG_VOLGORDE, FOTO, fotoVoor, GROEPEN } from "../data/uiterlijk.js";
import { logoHtml, accessoireHtml } from "./opmaak.js";
import { CATEGORIEEN } from "../data/achievements.js";
import { BRANCHES, NODE_BY_ID, lifetimeForEcts, BONUS_PER_PUNT } from "../data/skilltree.js";
import { fmt, fmtLong, fmtPct, fmtTime, fmtEta } from "../format.js";
import { attachTooltip, refreshTooltip, toast, blip, dialog, hoverCapable, klikEffect, klikGeluid, floatText } from "./fx.js";
import { toonOpstart } from "./opstart.js";
import { emit } from "../bus.js";
import { esc } from "../html.js";
import { VERSIE } from "../versie.js";

const ROMEINS = ["", "I", "II", "III", "IV", "V"];
const shopEl = document.getElementById("shop");
const upgradeTegels = document.getElementById("upgrade-tegels");
const upgradeInfo = document.getElementById("upgrade-info");
const upgradeOwned = document.getElementById("upgrade-owned");
const upgradeIntro = document.getElementById("upgrade-intro");
const ownedCount = document.getElementById("owned-count");
const achLijst = document.getElementById("ach-lijst");
const achFilterEl = document.getElementById("ach-filter");
let achFilter = "alles";
const pipUpgrades = document.getElementById("pip-upgrades");

const rows = new Map();
let shopSignature = "";
let upgradeSignature = "";
let achSignature = "";

// Alleen schrijven wat echt veranderde; dat scheelt de browser werk.
function zet(el, tekst) {
  if (el.textContent !== tekst) el.textContent = tekst;
}
function zetAttr(el, naam, waarde) {
  if (el.getAttribute(naam) !== waarde) el.setAttribute(naam, waarde);
}

// ---------------------------------------------------------------- Winkel

function visibleBuildings() {
  const out = [];
  for (let i = 0; i < BUILDINGS.length; i++) {
    const b = BUILDINGS[i];
    if (G.seen[b.id] || (G.buildings[b.id] || 0) > 0) out.push(b);
    else {
      out.push({ ...b, locked: true, vorige: i > 0 ? BUILDINGS[i - 1] : null, resterend: BUILDINGS.length - i - 1 });
      break;
    }
  }
  return out;
}

// Wat houdt het volgende apparaat nog tegen: geld, of het apparaat ervoor?
function slotStand(b) {
  if (b.vorige && (G.buildings[b.vorige.id] || 0) === 0) {
    return { tekst: `Koop eerst één ${b.vorige.name}`, deel: 0 };
  }
  const nodig = b.baseCost * 0.4;
  return {
    tekst: `Nog ${fmt(Math.max(0, nodig - G.packets))} packets`,
    deel: Math.min(1, G.packets / nodig),
  };
}

function buildingTooltip(b) {
  const owned = G.buildings[b.id] || 0;
  const each = D.perBuilding[b.id] || 0;
  const share = D.pps > 0 ? (each * owned) / D.pps : 0;
  const { amount, price } = priceOf(b.id, G.options.buyAmount, G.options.sellMode);
  const regels = [`<div class="regel"><span>Vak</span><span>${VAKKEN[b.vak].icon} ${VAKKEN[b.vak].name}</span></div>`];
  if (owned > 0) {
    regels.push(`<div class="regel"><span>Samen</span><span>${fmt(each * owned)} p/s</span></div>`);
    regels.push(`<div class="regel"><span>Aandeel</span><span>${fmtPct(share)}</span></div>`);
  }
  if (D.buildingMult[b.id] > 1.001) {
    regels.push(`<div class="regel"><span>Bonus uit upgrades</span><span>x${fmt(D.buildingMult[b.id], { decimals: 2 })}</span></div>`);
  }
  const missing = price - G.packets;
  return `
    <h4>${b.icon} ${b.name}</h4>
    <div class="regel"><span>Levert</span><span>${fmt(each)} p/s per stuk</span></div>
    ${regels.join("")}
    <p class="cursief">${b.blurb}</p>
    <div class="regel prijsregel">${
      G.options.sellMode
        ? `Verkoop ${fmt(amount)} voor ${fmt(price)} packets`
        : missing > 0
          ? `<span class="kan-niet">${fmt(price)} packets — ${fmtEta(missing, D.pps)}</span>`
          : `Koop ${fmt(amount)} voor ${fmt(price)} packets`
    }</div>`;
}

function renderShop() {
  const list = visibleBuildings();
  const signature = list.map((b) => (b.locked ? `${b.id}:lock` : b.id)).join("|") + `#${G.options.buyAmount}#${G.options.sellMode}`;
  if (signature === shopSignature) return;
  shopSignature = signature;
  shopEl.innerHTML = "";
  rows.clear();

  for (const b of list) {
    const li = document.createElement("li");

    if (b.locked) {
      li.className = `shop-locked vak-${b.vak}`;
      li.innerHTML = `
        <div class="slot-kop">
          <span class="shop-ikoon" aria-hidden="true">🔒</span>
          <span><strong>${b.name}</strong><em></em></span>
        </div>
        <div class="slot-meter"><span></span></div>
        <p class="panel-intro" style="margin-top:10px">Daarna wachten er nog ${b.resterend} apparaten op je.</p>`;
      shopEl.append(li);
      rows.set(`lock:${b.id}`, {
        li,
        locked: b,
        tekst: li.querySelector("em"),
        meter: li.querySelector(".slot-meter span"),
      });
      continue;
    }

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `shopitem vak-${b.vak}`;
    btn.innerHTML = `
      <span class="shop-ikoon" aria-hidden="true">${b.icon}</span>
      <span class="shop-naam">
        <strong>${b.name}</strong>
        <span class="shop-regel"><span class="shop-prijs"></span> <span class="effect"></span></span>
      </span>
      <span class="shop-bezit">0</span>`;
    btn.addEventListener("click", () => handleBuy(b.id));
    attachTooltip(btn, () => buildingTooltip(b));
    li.append(btn);
    shopEl.append(li);
    rows.set(b.id, {
      btn,
      effect: btn.querySelector(".effect"),
      prijs: btn.querySelector(".shop-prijs"),
      bezit: btn.querySelector(".shop-bezit"),
    });
  }
}

function syncShop() {
  for (const [key, ref] of rows) {
    if (ref.locked) {
      const stand = slotStand(ref.locked);
      zet(ref.tekst, stand.tekst);
      ref.meter.style.transform = `scaleX(${stand.deel})`;
      continue;
    }
    const b = BUILDING_BY_ID[key];
    const owned = G.buildings[key] || 0;
    const { amount, price } = priceOf(key, G.options.buyAmount, G.options.sellMode);
    const kan = G.options.sellMode ? owned > 0 : price <= G.packets && amount > 0;

    zet(ref.bezit, fmt(owned));
    zet(ref.effect, `· +${fmt(D.perBuilding[b.id] || b.basePps)}/s elk`);
    zet(ref.prijs, G.options.sellMode
      ? owned > 0 ? `+${fmt(price)} terug` : "niets te verkopen"
      : `${fmt(price)}${amount > 1 ? ` (${fmt(amount)}x)` : ""}`);
    ref.btn.classList.toggle("betaalbaar", kan && !G.options.sellMode);
    ref.btn.classList.toggle("verkoop", G.options.sellMode && owned > 0);
    ref.btn.classList.toggle("heeft", owned > 0);
    ref.btn.classList.toggle("kanniet", !kan);
    zetAttr(ref.btn, "aria-disabled", String(!kan));
  }
}

function handleBuy(id) {
  const amount = G.options.buyAmount;
  if (G.options.sellMode) {
    const sold = sellBuilding(id, amount);
    if (sold) {
      blip(340, 0.06);
      emit("bought", { id, amount: -sold });
    }
    refreshTooltip();
    return;
  }
  const bought = buyBuilding(id, amount);
  if (bought) {
    blip(520 + Math.min(240, bought * 4), 0.05);
    emit("bought", { id, amount: bought });
  }
  refreshTooltip();
}

// -------------------------------------------------------------- Upgrades

const SOORTNAAM = {
  gebouw: "Apparaat",
  klik: "Klikken",
  goud: "Gouden packets",
  team: "Assistenten",
  synergie: "Synergie",
  vak: "Specialisatie",
  studie: "Studie",
};

function upgradeTooltip(u, gekocht = false) {
  const kan = G.packets >= u.cost;
  const prijs = gekocht
    ? "Al gekocht"
    : kan
      ? `Koop voor ${fmt(u.cost)} packets`
      : `<span class="kan-niet">${fmtEta(u.cost - G.packets, D.pps)}</span>`;
  return `
    <h4>${u.icon} ${u.name}</h4>
    <div class="regel"><span>Soort</span><span>${SOORTNAAM[u.kind] || u.kind}</span></div>
    ${u.note ? `<div class="regel"><span>Effect</span><span>${u.note}</span></div>` : ""}
    <p class="cursief">${u.desc}</p>
    <div class="regel prijsregel">${prijs}</div>`;
}

// Op een muis: hover toont de details, klik koopt meteen.
// Op een aanraakscherm: eerste tik kiest en toont, tweede tik koopt.
let gekozenUpgrade = null;
let getoondeUpgrade = null;
let getoondKan = null;

function toonUpgradeInfo(u) {
  getoondeUpgrade = u;
  getoondKan = u ? G.packets >= u.cost : null;
  if (!u) {
    upgradeInfo.className = "upinfo leeg";
    upgradeInfo.textContent = hoverCapable
      ? "Beweeg over een tegel om te zien wat hij doet."
      : "Tik op een tegel om te zien wat hij doet.";
    return;
  }
  const kan = G.packets >= u.cost;
  upgradeInfo.className = "upinfo";
  upgradeInfo.innerHTML = `
    <div class="upinfo-kop">
      <strong>${u.icon} ${u.name}</strong>
      <span class="${kan ? "" : "kan-niet"}">${fmt(u.cost)}${kan ? "" : ` · ${fmtEta(u.cost - G.packets, D.pps)}`}</span>
    </div>
    <p class="upinfo-effect">${u.note || u.desc}</p>
    ${u.note ? `<p class="upinfo-tekst">${u.desc}</p>` : ""}
    ${!hoverCapable && gekozenUpgrade === u.id
      ? `<button type="button" class="btn vol small" id="upinfo-koop" ${kan ? "" : "disabled"}>${kan ? `Koop voor ${fmt(u.cost)} packets` : "Nog niet genoeg packets"}</button>`
      : ""}`;
  const koop = upgradeInfo.querySelector("#upinfo-koop");
  if (koop) koop.addEventListener("click", () => koopUpgrade(u));
}

function koopUpgrade(u) {
  if (!buyUpgrade(u.id)) return;
  blip(720, 0.09);
  emit("upgrade", u);
  toast({ title: u.name, text: u.note || u.desc, icon: u.icon, tone: "goed" });
  gekozenUpgrade = null;
  renderUpgrades();
  toonUpgradeInfo(availableUpgrades()[0] || null);
}

function renderUpgrades() {
  const list = availableUpgrades();
  const signature = list.map((u) => u.id).join("|");

  if (signature !== upgradeSignature) {
    upgradeSignature = signature;
    upgradeTegels.innerHTML = "";
    for (const u of list) {
      const tegel = document.createElement("button");
      tegel.type = "button";
      tegel.className = `uptegel soort-${u.kind}`;
      tegel.dataset.id = u.id;
      tegel.setAttribute("aria-label", `${u.name}: ${u.note || u.desc}`);
      tegel.innerHTML = `${u.icon}${u.tier ? `<i>${ROMEINS[u.tier]}</i>` : ""}`;
      tegel.addEventListener("pointerenter", () => {
        if (hoverCapable) toonUpgradeInfo(u);
      });
      tegel.addEventListener("focus", () => toonUpgradeInfo(u));
      tegel.addEventListener("click", () => {
        if (hoverCapable || gekozenUpgrade === u.id) {
          koopUpgrade(u);
          return;
        }
        gekozenUpgrade = u.id;
        for (const t of upgradeTegels.children) t.classList.toggle("gekozen", t.dataset.id === u.id);
        toonUpgradeInfo(u);
      });
      upgradeTegels.append(tegel);
    }
    upgradeIntro.textContent = list.length
      ? `${list.length} ${list.length === 1 ? "upgrade" : "upgrades"} beschikbaar. Ze werken meteen en voorgoed.`
      : "Nog geen upgrades. Koop apparaten, dan komen ze vanzelf vrij.";

    const gekocht = Object.keys(G.upgrades).filter((id) => UPGRADE_BY_ID[id]);
    ownedCount.textContent = String(gekocht.length);
    upgradeOwned.innerHTML = "";
    for (const id of gekocht) {
      const u = UPGRADE_BY_ID[id];
      const el = document.createElement("span");
      el.className = "gekocht-tegel";
      el.textContent = u.icon;
      el.setAttribute("role", "img");
      el.setAttribute("aria-label", `${u.name}: ${u.note || u.desc}`);
      attachTooltip(el, () => upgradeTooltip(u, true));
      upgradeOwned.append(el);
    }
    if (!getoondeUpgrade) toonUpgradeInfo(list[0] || null);
  }

  let betaalbaar = 0;
  for (const tegel of upgradeTegels.children) {
    const u = UPGRADE_BY_ID[tegel.dataset.id];
    const kan = G.packets >= u.cost;
    tegel.classList.toggle("betaalbaar", kan);
    tegel.classList.toggle("kanniet", !kan);
    zetAttr(tegel, "aria-disabled", String(!kan));
    if (kan) betaalbaar++;
  }
  pipUpgrades.hidden = betaalbaar === 0;
  zet(pipUpgrades, String(betaalbaar));

  // De balk onderaan moet meelopen: prijs haalbaar of niet, en het ding kan
  // net gekocht zijn door iemand anders in de lijst.
  if (getoondeUpgrade && G.upgrades[getoondeUpgrade.id]) {
    toonUpgradeInfo(list[0] || null);
  } else if (getoondeUpgrade && G.packets >= getoondeUpgrade.cost !== getoondKan) {
    toonUpgradeInfo(getoondeUpgrade);
  }
}

// ------------------------------------------------------------ Prestaties

function renderAchievements() {
  const signature = `${D.aantalPrestaties}/${ACHIEVEMENTS.length}#${achFilter}`;
  if (signature === achSignature) return;
  achSignature = signature;

  document.getElementById("koffie-rank").textContent = `☕ ${koffieRank()}`;
  document.getElementById("koffie-count").textContent = `${D.aantalPrestaties}/${ACHIEVEMENTS.length}`;
  document.getElementById("koffie-bar").style.transform = `scaleX(${D.koffie})`;
  document.getElementById("koffie-note").textContent = D.koffieMult > 1.001
    ? `Je assistenten leveren nu x${fmt(D.koffieMult, { decimals: 2 })} op alles. Meer prestaties is meer koffie is meer productie.`
    : "Elke prestatie zet je koffiepeil hoger. Zodra je assistenten hebt, werken die harder naarmate er meer koffie is.";

  const past = (a) => {
    const heeft = !!G.achievements[a.id];
    return achFilter === "alles" || (achFilter === "open" ? !heeft : heeft);
  };

  achLijst.innerHTML = "";
  for (const cat of CATEGORIEEN) {
    const alle = ACHIEVEMENTS.filter((a) => a.cat === cat);
    const inCat = alle.filter(past);
    const behaald = alle.filter((a) => G.achievements[a.id]).length;
    if (cat !== "Verborgen" && !inCat.length) continue;
    const kop = document.createElement("p");
    kop.className = "groepkop";
    kop.textContent = `${cat} · ${behaald}/${alle.length}`;
    achLijst.append(kop);

    if (cat === "Verborgen") {
      const gevonden = alle.filter((a) => G.achievements[a.id]);
      if (achFilter !== "open") for (const a of gevonden) achLijst.append(achRij(a, true));
      const rest = achFilter === "klaar" ? 0 : alle.length - gevonden.length;
      if (rest > 0) {
        const el = document.createElement("div");
        el.className = "ach uit";
        el.innerHTML = `
          <span class="ach-ikoon" aria-hidden="true">❔</span>
          <span class="ach-tekst"><strong>Nog ${rest} te vinden</strong><span>Ze staan nergens uitgelegd. Klik op rare plekken, typ rare dingen.</span></span>`;
        achLijst.append(el);
      }
      continue;
    }

    for (const a of inCat) achLijst.append(achRij(a, !!G.achievements[a.id]));
  }
}

function achRij(a, heeft) {
  const el = document.createElement("div");
  el.className = `ach ${heeft ? "aan" : "uit"}${a.egg ? " egg" : ""}`;
  el.innerHTML = `
    <span class="ach-ikoon" aria-hidden="true">${a.icon}</span>
    <span class="ach-tekst"><strong>${a.name}</strong> <span>· ${a.desc}</span></span>`;
  attachTooltip(el, () => `<h4>${a.icon} ${a.name}</h4><p class="cursief">${a.desc}</p>
    <div class="regel prijsregel">${heeft ? "Behaald" : "Nog niet behaald"}</div>`);
  return el;
}

achFilterEl.addEventListener("click", (e) => {
  const knop = e.target.closest("button");
  if (!knop) return;
  achFilter = knop.dataset.filter;
  for (const b of achFilterEl.children) {
    b.classList.toggle("on", b === knop);
    b.setAttribute("aria-pressed", String(b === knop));
  }
  renderAchievements();
});

// ---------------------------------------------------------------- Studie
// De afstudeerkaart wordt één keer opgebouwd en daarna live bijgewerkt,
// zolang het tabblad openstaat.

const treeEl = document.getElementById("tree");
const graduateCard = document.getElementById("graduate-card");
let treeBuilt = false;
let kaart = null;
let studieSleutel = "";

function bouwKaart() {
  graduateCard.innerHTML = `
    <div class="rij">
      <div>
        <h3>🎓 Afstuderen</h3>
        <p>Je begint opnieuw met niets, maar houdt je prestaties, je studieboom en je punten.</p>
      </div>
      <div class="cijfer" data-veld="winst"></div>
    </div>
    <div class="statlijst">
      <div><span>Studiepunten</span><strong data-veld="punten"></strong></div>
      <div><span>Bonus uit punten</span><strong data-veld="bonus"></strong></div>
      <div><span>Volgend punt bij</span><strong data-veld="volgende"></strong></div>
    </div>
    <button type="button" class="btn groen vol" id="graduate-btn" style="margin-top:14px"></button>`;
  const veld = (naam) => graduateCard.querySelector(`[data-veld="${naam}"]`);
  kaart = { winst: veld("winst"), punten: veld("punten"), bonus: veld("bonus"), volgende: veld("volgende"), knop: graduateCard.querySelector("#graduate-btn") };

  kaart.knop.addEventListener("click", () => {
    const winst = ectsOnGraduate();
    if (winst <= 0) return;
    dialog({
      title: "Afstuderen?",
      body: `<p>Je verliest je packets, je apparaten en je upgrades van deze run.</p>
             <p>Je houdt <strong>${fmt(D.aantalPrestaties)} prestaties</strong>, je volledige studieboom en je krijgt er <strong>${fmt(winst)} studiepunten</strong> bij.</p>`,
      actions: [
        { label: "Toch niet", style: "ghost" },
        {
          label: "Afstuderen",
          style: "groen",
          onClick: () => {
            const gained = graduate();
            if (!gained) return;
            treeBuilt = false;
            resetPanels();
            toast({ title: "Diploma behaald", text: `${fmt(gained)} studiepunten erbij. Je netwerk begint opnieuw.`, icon: "🎓", tone: "goed" });
            emit("graduated");
          },
        },
      ],
    });
  });
}

export function syncStudie(forceer = false) {
  if (!kaart) return;
  const winst = ectsOnGraduate();
  const volgende = lifetimeForEcts(G.prestige + winst + 1, D.ectsGain);
  const sleutel = `${winst}|${G.ects}|${G.prestige}|${volgende}`;
  if (!forceer && sleutel === studieSleutel) return;
  studieSleutel = sleutel;
  zet(kaart.winst, fmt(winst));
  zet(kaart.punten, `${fmt(G.ects)} vrij · ${fmt(G.prestige)} totaal`);
  zet(kaart.bonus, `+${fmtPct(G.prestige * BONUS_PER_PUNT, 0)} op alles`);
  zet(kaart.volgende, `${fmtLong(volgende)} totaal`);
  kaart.knop.disabled = winst <= 0;
  zet(kaart.knop, winst > 0 ? `Afstuderen voor ${fmt(winst)} studiepunten` : "Nog niet genoeg verdiend");
  syncTree();
}

function renderStudie() {
  if (!kaart) bouwKaart();
  if (!treeBuilt) buildTree();
  syncStudie(true);
}

// De boom is een raster: kolommen gaan dieper een tak in, rijen zijn de takken.
// Kruisknopen staan tussen twee takken in. De lijnen staan in één SVG met
// dezelfde maat als het raster, zodat ze meeschalen met het paneel.
function buildTree() {
  treeBuilt = true;
  const kolommen = Math.max(...NODES.map((n) => n.pos[0])) + 1;
  const rijen = BRANCHES.length;
  const midden = ([k, r]) => [k * 100 + 50, r * 100 + 50];
  const lijnen = NODES.flatMap((node) => node.needs.map((van) => {
    const [x1, y1] = midden(NODE_BY_ID[van].pos);
    const [x2, y2] = midden(node.pos);
    return `<line data-van="${van}" data-naar="${node.id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  })).join("");
  treeEl.innerHTML = `
    <div class="boom" style="--rijen: ${rijen}">
      <div class="boom-takken">
        ${BRANCHES.map((b) => `<span class="boom-tak" title="${esc(b.desc)}"><span aria-hidden="true">${b.icon}</span> ${esc(b.name)}</span>`).join("")}
      </div>
      <div class="boom-veld">
        <svg class="boom-lijnen" viewBox="0 0 ${kolommen * 100} ${rijen * 100}" preserveAspectRatio="none" aria-hidden="true">${lijnen}</svg>
      </div>
    </div>`;
  const veld = treeEl.querySelector(".boom-veld");
  for (const node of NODES) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `node${node.branch === "kruis" ? " groot" : ""}${node.id === "dr" ? " top" : ""}`;
    btn.dataset.id = node.id;
    btn.textContent = node.icon;
    btn.style.left = `${((node.pos[0] + 0.5) / kolommen) * 100}%`;
    btn.style.top = `${((node.pos[1] + 0.5) / rijen) * 100}%`;
    btn.setAttribute("aria-label", `${node.name}, ${node.cost} studiepunten: ${node.note}`);
    btn.addEventListener("click", () => {
      if (buyNode(node.id)) {
        blip(880, 0.12);
        toast({ title: node.name, text: node.note, icon: node.icon, tone: "goed" });
        syncStudie(true);
      }
    });
    attachTooltip(btn, () => {
      const bezit = !!G.nodes[node.id];
      const mist = node.needs.filter((n) => !G.nodes[n]).map((n) => NODE_BY_ID[n].name);
      const prijs = bezit
        ? "Al gekocht"
        : mist.length
          ? `<span class="kan-niet">Eerst: ${esc(mist.join(" en "))}</span>`
          : G.ects >= node.cost
            ? `Koop voor ${fmt(node.cost)} studiepunten`
            : `<span class="kan-niet">${fmt(node.cost)} studiepunten — je hebt er ${fmt(G.ects)}</span>`;
      return `<h4>${node.icon} ${esc(node.name)}</h4>
        <div class="regel"><span>Effect</span><span>${esc(node.note)}</span></div>
        <p class="cursief">${esc(node.desc)}</p>
        <div class="regel prijsregel">${prijs}</div>`;
    });
    veld.append(btn);
  }
}

function syncTree() {
  for (const btn of treeEl.querySelectorAll(".node")) {
    const node = NODE_BY_ID[btn.dataset.id];
    const bezit = !!G.nodes[node.id];
    const open = node.needs.every((n) => G.nodes[n]);
    const kan = !bezit && open && G.ects >= node.cost;
    btn.classList.toggle("bezit", bezit);
    btn.classList.toggle("kan", kan);
    btn.classList.toggle("kanniet", !kan && !bezit);
    zetAttr(btn, "aria-disabled", String(!kan));
  }
  for (const lijn of treeEl.querySelectorAll("line")) {
    const van = !!G.nodes[lijn.dataset.van];
    lijn.classList.toggle("aan", van);
    lijn.classList.toggle("vol", van && !!G.nodes[lijn.dataset.naar]);
  }
}

// ------------------------------------------------------------------ Meer

const meerEl = document.getElementById("meer-body");
let skinTelling = 0;
let meerBuilt = false;
const statEls = new Map();
const vakEls = new Map();

// De rijen staan vast, alleen de waarden worden bijgewerkt. Anders verspringt
// het venster twee keer per seconde en kun je niets selecteren.
const STATRIJEN = [
  ["packets", "Packets nu", () => fmt(G.packets)],
  ["pps", "Per seconde", () => `${fmt(D.pps)} p/s`],
  ["klik", "Per klik", () => fmt(D.clickValue)],
  ["kliks", "Handmatige kliks", () => fmt(G.stats.clicks)],
  ["handmade", "Zelf geklikt", () => `${fmt(G.stats.handmade)} packets`],
  ["lifetime", "Totaal ooit", () => fmt(G.stats.lifetime)],
  ["run", "Deze run", () => fmt(G.stats.runLifetime)],
  ["apparaten", "Apparaten", () => fmt(D.totalBuildings)],
  ["upgrades", "Upgrades", () => fmt(D.aantalUpgrades)],
  ["prestaties", "Prestaties", () => `${fmt(D.aantalPrestaties)} / ${ACHIEVEMENTS.length}`],
  ["goud", "Gouden packets", () => fmt(G.stats.goldenClicks)],
  ["ddos", "Rode packets genegeerd", () => fmt(G.stats.ddosIgnored)],
  ["diploma", "Keer afgestudeerd", () => fmt(G.stats.prestiges)],
  ["speeltijd", "Gespeeld", () => fmtTime(G.stats.playTime)],
  ["runtijd", "Deze run gespeeld", () => fmtTime(G.stats.runPlayTime || 0)],
  ["best", "Beste productie", () => `${fmt(G.stats.bestPps)} p/s`],
];

function rijHtml(sleutel, label) {
  return `<div><span>${label}</span><strong data-stat="${sleutel}"></strong></div>`;
}

function renderMeer() {
  if (!meerBuilt) buildMeer();
  if (Object.keys(G.skins).length !== skinTelling) {
    skinTelling = Object.keys(G.skins).length;
    renderUiterlijk();
  }
  for (const [sleutel, , waarde] of STATRIJEN) zet(statEls.get(sleutel), waarde());
  for (const [id, el] of vakEls) {
    const n = D.vakOwned[id] || 0;
    zet(el, `${fmt(n)} apparaten · +${fmtPct(Math.floor(n / 25) * 0.02, 0)}`);
  }
}

// De ring- en portretvoorbeeldjes tonen elkaars huidige keuze, zodat je ziet
// hoe de combinatie eruitziet voor je hem kiest.
function voorbeeld(soort, skin, open) {
  const foto = (portret) => `<img src="${esc(fotoVoor(portret))}" alt="" />`;
  switch (soort) {
    case "achtergrond":
      return `<span class="skin-preview" data-achtergrond="${esc(skin.id)}"></span>`;
    case "ring":
      return `<span class="skin-preview" data-ring="${esc(skin.id)}" data-portret="${esc(G.uiterlijk.portret)}">${foto(G.uiterlijk.portret)}</span>`;
    case "portret":
      return `<span class="skin-preview" data-portret="${esc(skin.id)}" data-ring="${esc(G.uiterlijk.ring)}">${foto(skin.id)}</span>`;
    case "paneel": {
      const [achter, tekst, accent] = skin.kleuren;
      return `<span class="skin-preview paneel-voorbeeld" aria-hidden="true" style="--pv-achter: ${esc(achter)}; --pv-tekst: ${esc(tekst)}; --pv-accent: ${esc(accent)}"><i></i><i></i><i></i></span>`;
    }
    case "accessoire":
      return `<span class="skin-preview acc-voorbeeld" data-portret="${esc(G.uiterlijk.portret)}" data-ring="${esc(G.uiterlijk.ring)}">${foto(G.uiterlijk.portret)}<span class="accessoire" data-accessoire="${esc(skin.id)}">${accessoireHtml(skin.id)}</span></span>`;
    case "logo":
      return `<span class="skin-preview logo-voorbeeld" aria-hidden="true"><span class="wordmark mini" data-logo="${esc(skin.id)}">${logoHtml(skin.id)}</span></span>`;
    case "teller":
      return `<span class="skin-preview teller-voorbeeld" aria-hidden="true"><span class="counter mini" data-teller="${esc(skin.id)}"><strong>1,2 mld</strong></span></span>`;
    case "lettertype":
      return `<span class="skin-preview teken" aria-hidden="true" style="font-family: ${esc(skin.familie)}">Aa</span>`;
    case "filter":
      return `<span class="skin-preview filter-voorbeeld" data-filter="${esc(skin.id)}" aria-hidden="true"><i class="kleur"></i><i class="laag"></i></span>`;
    case "packet": {
      const gezicht = skin.id === "serge" ? ` style="background-image: url('${esc(FOTO.standaard)}')"` : "";
      return `<span class="skin-preview packet-voorbeeld stijl-${esc(skin.id)}" aria-hidden="true"${gezicht}>${esc(skin.inhoud ?? skin.voorbeeld)}</span>`;
    }
    case "titel":
      return `<span class="skin-preview plaatje rang-${skin.rang}" aria-hidden="true">${open ? `${esc(skin.icoon)} ${esc(skin.naam)}` : "?"}</span>`;
    case "houding":
      return `<span class="skin-preview houding-voorbeeld" data-houding="${esc(skin.id)}" aria-hidden="true">${foto(G.uiterlijk.portret)}</span>`;
    case "accent":
      return `<span class="skin-preview accent-voorbeeld${skin.kleur.startsWith("#") ? "" : " regenboog"}" style="--a: ${esc(skin.kleur)}" aria-hidden="true"><i></i><i></i></span>`;
    case "zweeftekst":
      return `<span class="skin-preview zweef-voorbeeld" aria-hidden="true"><span class="zweef${skin.id === "standaard" ? "" : ` zweef-${esc(skin.id)}`}" data-tekst="+42">+42</span></span>`;
    case "melding":
      return `<span class="skin-preview melding-voorbeeld" aria-hidden="true"><span class="toast goed mini${skin.id === "standaard" ? "" : ` stijl-${esc(skin.id)}`}"><h4>Nieuw!</h4></span></span>`;
    case "combo":
      return skin.id === "geen"
        ? `<span class="skin-preview teken" aria-hidden="true">—</span>`
        : `<span class="skin-preview combo-voorbeeld" aria-hidden="true"><span class="combo" data-combo="${esc(skin.id)}"><b>${esc(skin.voorbeeld)}</b></span></span>`;
    case "cursor":
      return skin.punt
        ? `<span class="skin-preview cursor-voorbeeld" aria-hidden="true"><img src="img/cursor/${esc(skin.id)}.svg" alt="" /></span>`
        : `<span class="skin-preview teken" aria-hidden="true">${esc(skin.voorbeeld)}</span>`;
    case "opstart":
      return `<span class="skin-preview opstart-voorbeeld" data-opstart="${esc(skin.id)}" aria-hidden="true">${esc(skin.voorbeeld)}</span>`;
    default:
      return `<span class="skin-preview teken" aria-hidden="true">${esc(skin.voorbeeld || "")}</span>`;
  }
}

function skinKnop(soort, skin) {
  const open = skinUnlocked(soort, skin.id);
  const gekozen = G.uiterlijk[soort] === skin.id;
  return `
    <button type="button" class="skin kaart-${skin.rang}${open ? "" : " op-slot"}" data-soort="${soort}" data-id="${esc(skin.id)}"
            aria-pressed="${gekozen}" aria-disabled="${!open}"
            title="${esc(open ? skin.beschrijving : skin.hoe)}">
      ${voorbeeld(soort, skin, open)}
      <span class="skin-naam">${open ? skin.naam : "Op slot"}</span>
      <span class="skin-rang rang-tekst-${skin.rang}">${RANGEN[skin.rang].naam}</span>
      <span class="skin-hoe">${open ? skin.beschrijving : skin.hoe}</span>
    </button>`;
}

// Eén soort tegelijk in beeld. Bovenaan kies je een groep, daaronder een
// soort; beide tonen hoeveel je er al hebt.
let toonSoort = "portret";
const laatsteSoort = {};
const aantalOpen = (soort) => UITERLIJK[soort].filter((skin) => skinUnlocked(soort, skin.id)).length;
const groepVan = (soort) => GROEPEN.find((g) => g.soorten.includes(soort));

function renderUiterlijk() {
  const kaartEl = meerEl.querySelector("#uiterlijk-kaart");
  if (!kaartEl) return;
  const groep = groepVan(toonSoort);
  kaartEl.querySelector("#skin-groepen").innerHTML = GROEPEN.map((g) => {
    const open = g.soorten.reduce((som, soort) => som + aantalOpen(soort), 0);
    const totaal = g.soorten.reduce((som, soort) => som + UITERLIJK[soort].length, 0);
    const aan = g === groep;
    return `<button type="button" data-groep="${g.id}" aria-pressed="${aan}" class="${aan ? "on" : ""}"><span aria-hidden="true">${g.icoon}</span> ${g.naam} <small>${open}/${totaal}</small></button>`;
  }).join("");
  kaartEl.querySelector("#skin-tabs").innerHTML = groep.soorten
    .map((soort) => `<button type="button" data-toon="${soort}" aria-pressed="${soort === toonSoort}" class="${soort === toonSoort ? "on" : ""}">${SOORTNAMEN[soort]} <small>${aantalOpen(soort)}/${UITERLIJK[soort].length}</small></button>`)
    .join("");
  const rij = kaartEl.querySelector(".skinrij");
  rij.dataset.soort = toonSoort;
  rij.setAttribute("aria-label", SOORTNAMEN[toonSoort]);
  // Van gewoon naar goddelijk, zodat de zeldzaamste dingen onderaan wachten.
  const opVolgorde = [...UITERLIJK[toonSoort]].sort((a, b) => RANG_VOLGORDE.indexOf(a.rang) - RANG_VOLGORDE.indexOf(b.rang));
  rij.innerHTML = opVolgorde.map((skin) => skinKnop(toonSoort, skin)).join("");
  kaartEl.querySelector("#skin-hint").textContent = SOORTUITLEG[toonSoort];
  const totaal = Object.values(UITERLIJK).reduce((som, lijst) => som + lijst.length, 0);
  kaartEl.querySelector("#uiterlijk-telling").textContent =
    `${Object.keys(G.skins).length} van de ${totaal} vrijgespeeld`;
}

// Laat meteen zien of horen wat je net koos.
function probeer(soort, id, knop) {
  const r = knop.querySelector(".skin-preview").getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  if (soort === "geluid") klikGeluid(id);
  if (soort === "klik") klikEffect(id, x, y);
  if (soort === "zweeftekst") floatText(x, y - 10, "+1.337");
  if (soort === "combo") emit("reeks:voorbeeld", id);
  if (soort === "opstart") toonOpstart(id);
  if (soort === "melding") toast({ title: "Zo ziet een melding eruit", text: `Stijl: ${UITERLIJK.melding.find((m) => m.id === id).naam}.`, icon: "🎨", tone: "goed" });
  if (soort === "muziek" && id !== "geen" && !G.options.sound) {
    toast({ title: "Het geluid staat uit", text: "Zet Geluid aan bij Instellingen hieronder om de muziek te horen.", icon: "🔇" });
  }
}

// Verras me: van elke soort een willekeurig vrijgespeeld ding.
function verras() {
  for (const soort of Object.keys(UITERLIJK)) {
    const open = UITERLIJK[soort].filter((skin) => skinUnlocked(soort, skin.id));
    kiesSkin(soort, open[Math.floor(Math.random() * open.length)].id);
  }
}

function buildMeer() {
  meerBuilt = true;
  meerEl.innerHTML = `
    <div class="kaart" id="uiterlijk-kaart">
      <h3>Uiterlijk <span id="uiterlijk-telling" style="float:right;text-transform:none;letter-spacing:0;font-weight:600"></span></h3>
      <p class="panel-intro">Geef je spel een eigen gezicht. Je speelt ze vrij door te spelen; wat je eenmaal hebt, houd je ook na het afstuderen.</p>
      <div class="skin-bediening">
        <div class="skin-groepen" id="skin-groepen" role="group" aria-label="Welk deel van het spel?"></div>
        <div class="segmented skin-tabs" id="skin-tabs" role="group" aria-label="Wat wil je aanpassen?"></div>
        <button type="button" class="btn ghost small" id="skin-verras">Verras me</button>
      </div>
      <p class="panel-intro" id="skin-hint"></p>
      <div class="skinrij" role="group"></div>
      <h4 class="skin-kop"><label for="opt-netwerknaam">Netwerknaam</label></h4>
      <input class="veld" id="opt-netwerknaam" maxlength="24" placeholder="Bijvoorbeeld: Serge-net" autocomplete="off" />
      <p class="panel-intro" style="margin-top:8px">Komt onder de titel van het spel te staan. Laat leeg om hem weg te laten.</p>
    </div>
    <div class="kaart">
      <h3>Statistieken</h3>
      <div class="statlijst" id="stats-body">${STATRIJEN.map(([sleutel, label]) => rijHtml(sleutel, label)).join("")}</div>
    </div>
    <div class="kaart">
      <h3>Vakken</h3>
      <div class="statlijst" id="vak-body">${Object.entries(VAKKEN)
        .map(([id, vak]) => `<div><span>${vak.icon} ${vak.name}</span><strong data-vak="${id}"></strong></div>`)
        .join("")}</div>
      <p class="panel-intro" style="margin-top:12px">Elke 25 apparaten in een vak geven dat vak 2% extra productie.</p>
    </div>
    <div class="kaart">
      <h3>Instellingen</h3>
      <div class="keuze">
        <label for="opt-notation">Getallen</label>
        <select id="opt-notation" class="veld" style="width:auto">
          <option value="kort">Kort (1,25 mln)</option>
          <option value="voluit">Voluit (1.250.000)</option>
          <option value="wetenschappelijk">Wetenschappelijk (1.25e6)</option>
        </select>
      </div>
      <div class="keuze">
        <label for="opt-sound">Geluid</label>
        <span class="switch"><input type="checkbox" id="opt-sound" /><span></span></span>
      </div>
      <div class="keuze">
        <label for="opt-motion">Animaties</label>
        <span class="switch"><input type="checkbox" id="opt-motion" /><span></span></span>
      </div>
    </div>
    <div class="kaart">
      <h3>Opslag</h3>
      <div class="keuze">
        <label for="opt-slot">Bestand</label>
        <select id="opt-slot" class="veld" style="width:auto">
          <option value="1">Bestand 1</option>
          <option value="2">Bestand 2</option>
          <option value="3">Bestand 3</option>
        </select>
      </div>
      <div class="knoprij" style="margin-top:12px">
        <button type="button" class="btn" id="btn-save">Nu opslaan</button>
        <button type="button" class="btn ghost" id="btn-export">Kopieer code</button>
        <button type="button" class="btn ghost" id="btn-import">Code invoeren</button>
        <button type="button" class="btn ghost" id="btn-herstel" hidden>Import ongedaan maken</button>
        <button type="button" class="btn gevaar" id="btn-wipe">Alles wissen</button>
      </div>
      <p class="melding" id="opslag-melding" role="status"></p>
      <p class="panel-intro" style="margin-top:10px">Je voortgang staat in deze browser en wordt elke twintig seconden bewaard. Met de code neem je hem mee naar een ander toestel.</p>
    </div>
    <div class="kaart">
      <h3>Over</h3>
      <p class="panel-intro">Serge Clicker <span id="versie" style="cursor:default">v${VERSIE}</span> — gemaakt voor de klas.</p>
    </div>`;
  for (const [sleutel] of STATRIJEN) statEls.set(sleutel, meerEl.querySelector(`[data-stat="${sleutel}"]`));
  for (const id of Object.keys(VAKKEN)) vakEls.set(id, meerEl.querySelector(`[data-vak="${id}"]`));
  meerEl.addEventListener("click", (e) => {
    const groep = e.target.closest("[data-groep]");
    if (groep) {
      const def = GROEPEN.find((g) => g.id === groep.dataset.groep);
      toonSoort = laatsteSoort[def.id] || def.soorten[0];
      renderUiterlijk();
      meerEl.querySelector(`[data-groep="${def.id}"]`)?.focus();
      return;
    }
    const tab = e.target.closest("[data-toon]");
    if (tab) {
      toonSoort = tab.dataset.toon;
      laatsteSoort[groepVan(toonSoort).id] = toonSoort;
      renderUiterlijk();
      meerEl.querySelector(`[data-toon="${toonSoort}"]`)?.focus();
      return;
    }
    if (e.target.closest("#skin-verras")) {
      verras();
      blip(660, 0.07);
      emit("uiterlijk");
      renderUiterlijk();
      return;
    }
    const knop = e.target.closest(".skin");
    if (!knop) return;
    if (kiesSkin(knop.dataset.soort, knop.dataset.id)) {
      if (knop.dataset.soort !== "geluid") blip(660, 0.07);
      probeer(knop.dataset.soort, knop.dataset.id, knop);
      emit("uiterlijk");
      renderUiterlijk();
    }
  });
  renderUiterlijk();
  emit("meer:built");
}

// -------------------------------------------------------------- Publiek

export function renderAll() {
  renderShop();
  syncShop();
  renderUpgrades();
  renderAchievements();
}

export function syncFast() {
  syncShop();
  renderUpgrades();
  refreshTooltip();
}

export function resetPanels() {
  getoondeUpgrade = null;
  gekozenUpgrade = null;
  shopSignature = "";
  upgradeSignature = "";
  achSignature = "";
  studieSleutel = "";
  treeBuilt = false;
}

export { renderShop, renderUpgrades, renderAchievements, renderStudie, renderMeer };
