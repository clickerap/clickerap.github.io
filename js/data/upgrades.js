// Upgrades. De 110 gebouw-upgrades worden gegenereerd uit BUILDINGS,
// de rest staat hier met de hand omdat elke upgrade z'n eigen grap heeft.
//
// effect  wordt door state.recompute() toegepast, nooit uitgevoerd als code
// req     wanneer de upgrade in de lijst verschijnt (g = het spelstaat-object)

import { BUILDINGS, BUILDING_BY_ID, TIER_AT, TIER_COST } from "./buildings.js";

function tierUpgrades() {
  const out = [];
  for (const b of BUILDINGS) {
    b.tiers.forEach(([name, desc], i) => {
      out.push({
        id: `${b.id}-t${i + 1}`,
        name,
        icon: b.icon,
        desc,
        note: `${b.name} produceert dubbel zoveel.`,
        cost: Math.ceil(b.baseCost * TIER_COST[i]),
        kind: "gebouw",
        building: b.id,
        tier: i + 1,
        effect: { buildingMult: { id: b.id, x: 2 } },
        req: (g) => (g.buildings[b.id] || 0) >= TIER_AT[i],
      });
    });
  }
  return out;
}

const CLICK_UPGRADES = [
  {
    id: "klik-muis",
    name: "Fatsoenlijke muis",
    icon: "🖱️",
    desc: "De schoolmuis met de plakkende linkerknop gaat de kast in.",
    note: "+1 packet per klik.",
    cost: 100,
    effect: { clickFlat: 1 },
    req: (g) => g.stats.clicks >= 10,
  },
  {
    id: "klik-keyboard",
    name: "Mechanisch toetsenbord",
    icon: "⌨️",
    desc: "Hoorbaar tot in het lokaal ernaast. Dat is het punt.",
    note: "Klikkracht x2.",
    cost: 2000,
    effect: { clickMult: 2 },
    req: (g) => g.stats.clicks >= 50,
  },
  {
    id: "klik-polssteun",
    name: "Polssteun",
    icon: "🩹",
    desc: "Voorkomt dat dit spel een medisch dossier wordt.",
    note: "Klikkracht x2.",
    cost: 40000,
    effect: { clickMult: 2 },
    req: (g) => g.stats.clicks >= 200,
  },
  {
    id: "klik-macro",
    name: "Macrotoets",
    icon: "🎹",
    desc: "Eén toets, drie handelingen. Volstrekt legaal.",
    note: "Klikkracht x2.",
    cost: 900000,
    effect: { clickMult: 2 },
    req: (g) => g.stats.clicks >= 800,
  },
  {
    id: "klik-koffie",
    name: "Koffie voor de klikvinger",
    icon: "☕",
    desc: "Zwart, uit de automaat op de tweede verdieping.",
    note: "Klikkracht x2.",
    cost: 3e7,
    effect: { clickMult: 2 },
    req: (g) => g.stats.clicks >= 2000,
  },
  {
    id: "klik-dpi",
    name: "8000 dpi",
    icon: "🎯",
    desc: "Je raakt Serge nu ook als je niet kijkt.",
    note: "Klikkracht x2.",
    cost: 2e9,
    effect: { clickMult: 2 },
    req: (g) => g.stats.clicks >= 5000,
  },
  {
    id: "klik-stoel",
    name: "Ergonomische stoel",
    icon: "🪑",
    desc: "Verstelbaar in elf richtingen, gebruikt in één.",
    note: "Klikkracht x2.",
    cost: 1e12,
    effect: { clickMult: 2 },
    req: (g) => g.stats.clicks >= 12000,
  },
  {
    id: "klik-serge",
    name: "Serge's eigen muis",
    icon: "🐭",
    desc: "Uit het lokaal geleend. Hij weet het. Het is goed.",
    note: "Klikkracht x3.",
    cost: 5e15,
    effect: { clickMult: 3 },
    req: (g) => g.stats.clicks >= 25000,
  },
  {
    id: "klik-tele",
    name: "Telemetrie op je klik",
    icon: "📈",
    desc: "Elke klik wordt gemeten, en meten is meer.",
    note: "Elke klik levert er 0,1% van je productie per seconde bij.",
    cost: 3e5,
    effect: { clickFromPps: 0.001 },
    req: (g) => g.stats.clicks >= 100,
  },
  {
    id: "klik-aggregatie",
    name: "Klik-aggregatie",
    icon: "🧮",
    desc: "Losse kliks worden gebundeld voor ze het netwerk in gaan.",
    note: "Elke klik levert er 0,4% van je productie per seconde bij.",
    cost: 4e8,
    effect: { clickFromPps: 0.004 },
    req: (g) => g.upgrades["klik-tele"],
  },
  {
    id: "klik-offload",
    name: "Hardware-offload",
    icon: "🔧",
    desc: "Je vinger doet het werk niet meer, de ASIC doet het.",
    note: "Elke klik levert er 1% van je productie per seconde bij.",
    cost: 6e12,
    effect: { clickFromPps: 0.01 },
    req: (g) => g.upgrades["klik-aggregatie"],
  },
  {
    id: "klik-controlplane",
    name: "Klikken in de control plane",
    icon: "🕹️",
    desc: "Je klikt niet meer op het netwerk, je klikt ín het netwerk.",
    note: "Elke klik levert er 3% van je productie per seconde bij.",
    cost: 9e17,
    effect: { clickFromPps: 0.03 },
    req: (g) => g.upgrades["klik-offload"],
  },
];

const GOLDEN_UPGRADES = [
  {
    id: "gp-sniffer",
    name: "Packet sniffer",
    icon: "👃",
    desc: "Je ziet gouden packets aankomen voor ze er zijn.",
    note: "Gouden packets verschijnen 25% vaker.",
    cost: 5e5,
    effect: { goldenFreq: 1.25 },
    req: (g) => g.stats.goldenClicks >= 1,
  },
  {
    id: "gp-wireshark",
    name: "Capture-filter",
    icon: "🦈",
    desc: "tcp.port == 443 && frame contains \"goud\"",
    note: "Gouden packets blijven 50% langer staan.",
    cost: 5e7,
    effect: { goldenDuration: 1.5 },
    req: (g) => g.stats.goldenClicks >= 5,
  },
  {
    id: "gp-netflow",
    name: "NetFlow-export",
    icon: "📊",
    desc: "Elke stroom wordt geteld, ook de gouden.",
    note: "Buffs van gouden packets werken 30% sterker.",
    cost: 5e9,
    effect: { goldenPower: 1.3 },
    req: (g) => g.stats.goldenClicks >= 15,
  },
  {
    id: "gp-inspection",
    name: "Diepe inspectie",
    icon: "🔬",
    desc: "Tot in de payload, tot in het goud.",
    note: "Gouden packets verschijnen 25% vaker.",
    cost: 5e11,
    effect: { goldenFreq: 1.25 },
    req: (g) => g.stats.goldenClicks >= 30,
  },
  {
    id: "gp-vlan",
    name: "Gouden VLAN",
    icon: "🏅",
    desc: "VLAN 24 karaat. Alleen getagd verkeer.",
    note: "Buffs van gouden packets werken 50% sterker.",
    cost: 5e13,
    effect: { goldenPower: 1.5 },
    req: (g) => g.stats.goldenClicks >= 60,
  },
  {
    id: "gp-anomalie",
    name: "Anomaliedetectie",
    icon: "🧿",
    desc: "Twee afwijkingen tegelijk zijn geen afwijking meer, maar beleid.",
    note: "Kans dat een gouden packet twee buffs tegelijk geeft.",
    cost: 5e16,
    effect: { goldenDouble: 0.25 },
    req: (g) => g.stats.goldenClicks >= 120,
  },
  {
    id: "gp-sinkhole",
    name: "DNS-sinkhole",
    icon: "🕳️",
    desc: "Kwaad verkeer verdwijnt in een put die je zelf gegraven hebt.",
    note: "Rode packets doen half zoveel schade.",
    cost: 2e10,
    effect: { ddosResist: 0.5 },
    req: (g) => g.stats.ddosSeen >= 1,
  },
  {
    id: "gp-blackhole",
    name: "Blackhole-routing",
    icon: "⚫",
    desc: "Je stuurt de aanval naar null0 en houdt de bandbreedte.",
    note: "Rode packets aanklikken geeft voortaan een kleine bonus.",
    cost: 2e14,
    effect: { ddosReward: true },
    req: (g) => g.upgrades["gp-sinkhole"] && g.stats.ddosSeen >= 5,
  },
];

// Assistenten schalen mee met het aantal behaalde prestaties (het "koffiepeil").
const KOFFIE_UPGRADES = [
  ["koffie-stagiair", "Stagiair", "🧑‍🎓", "Mag kabels aangeven en koffie halen.", 9e6, 0.1],
  ["koffie-assistent", "Student-assistent", "🧑‍🏫", "Weet meer dan hij denkt, minder dan hij zegt.", 9e9, 0.125],
  ["koffie-beheerder", "Systeembeheerder", "🧑‍💻", "Heeft overal een script voor.", 9e12, 0.15],
  ["koffie-serge", "Serge zelf", "🧔", "Loopt langs, wijst één ding aan, alles werkt.", 9e15, 0.175],
  ["koffie-team", "Het docententeam", "👥", "Vier vakken, één koffiezetapparaat.", 9e18, 0.2],
  ["koffie-alumni", "De alumni", "🎓", "Ze komen terug. Ze komen altijd terug.", 9e21, 0.225],
].map(([id, name, icon, desc, cost, power], i) => ({
  id,
  name,
  icon,
  desc,
  note: "Je productie stijgt mee met het aantal prestaties dat je hebt.",
  cost,
  effect: { koffiePower: power },
  req: (g) => g.stats.achievements >= 5 + i * 8,
}));

// Synergie: het ene gebouw maakt het andere beter, 1% per exemplaar.
const SYNERGIE_PER_STUK = 0.01;
const SYNERGY_PAIRS = [
  ["syn-trunk", "Uplink-trunk", "🔗", "router", "switch", 4e6, "Elke switch duwt je routers vooruit."],
  ["syn-uplink", "Glasvezel-uplink", "🪢", "fiber", "router", 4e7, "Routers vragen om meer glas."],
  ["syn-toegang", "Rack-toegang", "🚪", "rack", "fiber", 4e8, "Elk paar vezels eindigt in een rack."],
  ["syn-koeling", "Koelbeleid", "❄️", "datacenter", "rack", 4e9, "Meer racks, betere luchtscheiding."],
  ["syn-hypervisor", "Hypervisor-dichtheid", "📦", "proxmox", "datacenter", 4e10, "Elk datacenter propt er nodes bij."],
  ["syn-identiteit", "Identiteitsbeheer", "🪪", "vsphere", "ad", 4e11, "Zonder AD logt niemand in op vCenter."],
  ["syn-container", "Containerplatform", "🐳", "k8s", "proxmox", 4e12, "De cluster draait op jouw eigen ijzer."],
  ["syn-overlay", "Overlay-netwerk", "🕸️", "sdn", "k8s", 4e13, "Elke pod krijgt zijn eigen virtuele draad."],
  ["syn-perimeter", "Perimeterbeleid", "🚧", "firewall", "soc", 4e14, "Het SOC schrijft de regels die de firewall draait."],
  ["syn-regio", "Regio-uitbreiding", "🗺️", "hyperscaler", "darkfiber", 4e16, "Elke donkere vezel opent een nieuwe regio."],
].map(([id, name, icon, to, from, cost, desc]) => ({
  id,
  name,
  icon,
  desc,
  note: `Elk exemplaar van ${BUILDING_BY_ID[from].name} geeft ${BUILDING_BY_ID[to].name} ${SYNERGIE_PER_STUK * 100}% extra.`,
  cost,
  effect: { synergy: { to, from, per: SYNERGIE_PER_STUK } },
  req: (g) => (g.buildings[to] || 0) >= 10 && (g.buildings[from] || 0) >= 25,
}));

const VAK_UPGRADES = [
  ["vak-netwerken", "Specialisatie Netwerken", "🔀", "netwerken", 5e13],
  ["vak-sddc", "Specialisatie Datacenter", "🏢", "sddc", 5e14],
  ["vak-security", "Specialisatie Security", "🛡️", "security", 5e15],
  ["vak-cloud", "Specialisatie Cloud", "☁️", "cloud", 5e16],
].map(([id, name, icon, vak, cost]) => ({
  id,
  name,
  icon,
  desc: "Je hebt genoeg uren in dit vak zitten om er iets van te vinden.",
  note: "Alle gebouwen van dit vak leveren dubbel.",
  cost,
  effect: { vakMult: { vak, x: 2 } },
  req: (g) => g.vakOwned[vak] >= 100,
}));

const STUDIE_UPGRADES = [
  {
    id: "st-samenvatting",
    name: "Samenvatting van vorig jaar",
    icon: "📓",
    desc: "Doorgegeven van generatie op generatie, met fouten en al.",
    note: "Alles produceert 10% meer.",
    cost: 1e11,
    effect: { allMult: 1.1 },
    req: (g) => g.prestige >= 1,
  },
  {
    id: "st-labo",
    name: "Sleutel van het labo",
    icon: "🔑",
    desc: "Officieel niet uitgeleend. Praktisch onmisbaar.",
    note: "Alles produceert 15% meer.",
    cost: 1e14,
    effect: { allMult: 1.15 },
    req: (g) => g.prestige >= 5,
  },
  {
    id: "st-herexamen",
    name: "Herexamen gehaald",
    icon: "📜",
    desc: "Niet mooi, wel geslaagd.",
    note: "Alles produceert 20% meer.",
    cost: 1e17,
    effect: { allMult: 1.2 },
    req: (g) => g.prestige >= 15,
  },
  {
    id: "st-thesis",
    name: "Eindwerk over Serge",
    icon: "🏆",
    desc: "Onderscheiding. De jury had vragen, jij had antwoorden.",
    note: "Alles produceert 25% meer.",
    cost: 1e20,
    effect: { allMult: 1.25 },
    req: (g) => g.prestige >= 40,
  },
];

export const UPGRADES = [
  ...tierUpgrades(),
  ...CLICK_UPGRADES.map((u) => ({ ...u, kind: "klik" })),
  ...GOLDEN_UPGRADES.map((u) => ({ ...u, kind: "goud" })),
  ...KOFFIE_UPGRADES.map((u) => ({ ...u, kind: "team" })),
  ...SYNERGY_PAIRS.map((u) => ({ ...u, kind: "synergie" })),
  ...VAK_UPGRADES.map((u) => ({ ...u, kind: "vak" })),
  ...STUDIE_UPGRADES.map((u) => ({ ...u, kind: "studie" })),
];

export const UPGRADE_BY_ID = Object.fromEntries(UPGRADES.map((u) => [u.id, u]));
