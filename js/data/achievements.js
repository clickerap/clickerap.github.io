// Prestaties. Elke behaalde prestatie verhoogt je koffiepeil, en dat peil
// bepaalt hoe sterk je assistenten zijn. Ze zijn dus niet louter sier.
//
// test    wordt elke halve seconde geëvalueerd
// manual  wordt ergens anders in de code ontgrendeld (easter eggs, minigames)
// hidden  omschrijving blijft verborgen tot je hem hebt

import { BUILDINGS } from "./buildings.js";

const list = [];
let categorie = "Overig";

function groep(naam) {
  categorie = naam;
}

function ach(id, name, icon, desc, test, extra = {}) {
  list.push({ id, name, icon, desc, test, cat: categorie, ...extra });
}

// --- Klikken ---
groep("Klikken");
ach("klik-1", "Eerste packet", "🖱️", "Verstuur je eerste packet.", (g) => g.stats.clicks >= 1);
ach("klik-100", "Packet pusher", "💨", "Klik honderd keer.", (g) => g.stats.clicks >= 100);
ach("klik-1k", "Klikspecialist", "💥", "Klik duizend keer.", (g) => g.stats.clicks >= 1000);
ach("klik-10k", "Peesontsteking", "🦾", "Klik tienduizend keer.", (g) => g.stats.clicks >= 10000);
ach("klik-100k", "Muis versleten", "🪦", "Klik honderdduizend keer.", (g) => g.stats.clicks >= 1e5);
ach("klik-1m", "Serge maakt zich zorgen", "🚑", "Klik een miljoen keer.", (g) => g.stats.clicks >= 1e6);

// --- Totaal verdiend ---
groep("Verdiend");
const totalTiers = [
  [1e3, "Eerste duizend", "🎉"],
  [1e6, "Packet-miljonair", "💰"],
  [1e9, "Packet-miljardair", "🏦"],
  [1e12, "Biljoen", "🧾"],
  [1e15, "Biljard", "📈"],
  [1e18, "Triljoen", "🛸"],
  [1e21, "Triljard", "🌌"],
  [1e24, "Quadriljoen", "🕳️"],
  [1e27, "Voorbij het telbare", "♾️"],
];
totalTiers.forEach(([amount, name, icon], i) => {
  ach(`totaal-${i}`, name, icon, `Verdien in totaal ${labelFor(amount)} packets.`, (g) => g.stats.lifetime >= amount);
});

function labelFor(n) {
  const words = {
    1e3: "duizend", 1e6: "een miljoen", 1e9: "een miljard", 1e12: "een biljoen",
    1e15: "een biljard", 1e18: "een triljoen", 1e21: "een triljard",
    1e24: "een quadriljoen", 1e27: "een quadriljard",
  };
  return words[n] || String(n);
}

// --- Productie per seconde ---
groep("Productie");
const ppsTiers = [
  [10, "Het loopt", "🚶"],
  [1e3, "Lijnsnelheid", "🏃"],
  [1e6, "Backbone", "🚄"],
  [1e9, "Lichtsnelheid", "💫"],
  [1e12, "Buiten de spec", "📡"],
  [1e15, "Onmeetbaar", "🔭"],
];
ppsTiers.forEach(([pps, name, icon], i) => {
  ach(`pps-${i}`, name, icon, `Bereik ${pps >= 1e6 ? shortLabel(pps) : pps} packets per seconde.`, (g) => g.pps >= pps);
});

function shortLabel(n) {
  if (n >= 1e15) return "een biljard";
  if (n >= 1e12) return "een biljoen";
  if (n >= 1e9) return "een miljard";
  return "een miljoen";
}

// --- Gebouwen: eerste exemplaar en een volle vijftig ---
groep("Apparaten");
for (const b of BUILDINGS) {
  ach(`bouw-${b.id}-1`, b.name, b.icon, `Koop je eerste ${b.name.toLowerCase()}.`, (g) => (g.buildings[b.id] || 0) >= 1);
  ach(`bouw-${b.id}-50`, `${b.name} x50`, b.icon, `Bezit vijftig keer ${b.name.toLowerCase()}.`, (g) => (g.buildings[b.id] || 0) >= 50);
}

ach("bouw-alle", "Volledige uitrusting", "🧰", "Bezit minstens één van elk gebouw.", (g) =>
  BUILDINGS.every((b) => (g.buildings[b.id] || 0) >= 1)
);
ach("bouw-100", "Honderd van hetzelfde", "💯", "Bezit honderd exemplaren van één gebouw.", (g) =>
  BUILDINGS.some((b) => (g.buildings[b.id] || 0) >= 100)
);
ach("bouw-500", "Vijfhonderd apparaten", "🏗️", "Bezit vijfhonderd gebouwen in totaal.", (g) => g.totalBuildings >= 500);
ach("bouw-2000", "Eigen infrastructuur", "🌐", "Bezit tweeduizend gebouwen in totaal.", (g) => g.totalBuildings >= 2000);

// --- Upgrades ---
groep("Upgrades");
ach("up-1", "Eerste verbetering", "⬆️", "Koop je eerste upgrade.", (g) => g.stats.upgrades >= 1);
ach("up-25", "Doorgevoerde wijzigingen", "🧩", "Koop 25 upgrades.", (g) => g.stats.upgrades >= 25);
ach("up-75", "Changelog", "📋", "Koop 75 upgrades.", (g) => g.stats.upgrades >= 75);
ach("up-150", "Alles gepatcht", "🩺", "Koop 150 upgrades.", (g) => g.stats.upgrades >= 150);

// --- Gouden packets ---
groep("Gouden packets");
ach("goud-1", "Gouden vangst", "✨", "Klik je eerste gouden packet.", (g) => g.stats.goldenClicks >= 1);
ach("goud-10", "Geluksvogel", "🍀", "Klik tien gouden packets.", (g) => g.stats.goldenClicks >= 10);
ach("goud-50", "Vaste klant", "🎰", "Klik vijftig gouden packets.", (g) => g.stats.goldenClicks >= 50);
ach("goud-200", "Statistisch verdacht", "🔍", "Klik tweehonderd gouden packets.", (g) => g.stats.goldenClicks >= 200);
ach("goud-ddos", "Onder vuur", "🚨", "Overleef je eerste DDoS-packet.", null, { manual: true });
ach("goud-snel", "Reactietijd", "⚡", "Klik een gouden packet binnen één seconde.", null, { manual: true });

// --- Prestige ---
groep("Studie");
ach("prestige-1", "Eerste diploma", "🎓", "Studeer één keer af.", (g) => g.prestige >= 1);
ach("prestige-5", "Vijf jaar erbij", "📚", "Verzamel vijf studiepunten.", (g) => g.prestige >= 5);
ach("prestige-25", "Levenslang leren", "🧠", "Verzamel 25 studiepunten.", (g) => g.prestige >= 25);
ach("prestige-100", "Eredoctoraat", "🏅", "Verzamel honderd studiepunten.", (g) => g.prestige >= 100);
ach("prestige-boom", "Volledig curriculum", "🌳", "Koop elk knooppunt in de studieboom.", null, { manual: true });

// --- Minigames ---
groep("Labo");
ach("quiz-1", "Eerste overhoring", "📝", "Beantwoord een subnetvraag goed.", null, { manual: true });
ach("quiz-10", "Serge knikt", "✅", "Tien goede antwoorden op rij.", null, { manual: true });
ach("quiz-25", "Subnetten in je hoofd", "🧮", "Vijfentwintig goede antwoorden op rij.", null, { manual: true });
ach("cli-1", "enable", "⌨️", "Voer je eerste commando uit in de terminal.", null, { manual: true });
ach("cli-config", "Running config", "💾", "Zet een interface volledig goed op.", null, { manual: true });
ach("beurs-winst", "Koop laag, verkoop hoog", "📈", "Maak winst op de bandbreedtemarkt.", null, { manual: true });
ach("beurs-fortuin", "Marktmanipulatie", "🤑", "Verdien een fortuin op de markt in één sessie.", null, { manual: true });
ach("patch-1", "Eerste kabel geplant", "🌱", "Plant iets in de patchkast.", null, { manual: true });
ach("patch-protocol", "Nieuw protocol", "🧬", "Ontdek een protocol door kruising.", null, { manual: true });
ach("patch-alles", "Volledige patchkast", "🗃️", "Ontdek elk protocol.", null, { manual: true });

// --- Overig ---
groep("Overig");
ach("offline", "Terug van weggeweest", "🌙", "Kom terug na een uur weg te zijn geweest.", null, { manual: true });
ach("incident-fix", "Storing verholpen", "🔧", "Los een incident op voor het uit de hand loopt.", null, { manual: true });
ach("koffie-vol", "Koffie op", "☕", "Bereik het hoogste koffiepeil.", (g) => g.koffie >= 1);
ach("verkocht", "Alles verkocht", "📉", "Verkoop honderd apparaten.", (g) => g.stats.sold >= 100);

// --- Verborgen: easter eggs ---
groep("Verborgen");
const EGG_ACHIEVEMENTS = [
  ["egg-konami", "Up, up, down, down", "🕹️", "Je kent de code nog."],
  ["egg-naam", "Naamsvermelding", "🧔", "Je typte zijn naam."],
  ["egg-neus", "Op de neus", "👃", "Precies daar, tien keer."],
  ["egg-ticker", "Persmuskiet", "📰", "Je hebt het nieuws stukgeklikt."],
  ["egg-score", "Telfout", "🔢", "Je hebt op je eigen score staan rammen."],
  ["egg-1337", "Elite", "😎", "Precies 1337 packets in bezit."],
  ["egg-42", "Het antwoord", "🐋", "Precies 42 exemplaren van één gebouw."],
  ["egg-geduld", "Geduld", "🧘", "Tien minuten open laten staan zonder te klikken."],
  ["egg-rechts", "Contextmenu", "🖲️", "Je bleef rechtsklikken."],
  ["egg-ping", "Reply from 8.8.8.8", "📶", "Je hebt gepingd."],
  ["egg-sudo", "sudo", "🔓", "Je hebt om rechten gevraagd."],
  ["egg-cisco", "Vendor lock-in", "🏷️", "Serge kijkt teleurgesteld."],
  ["egg-noshut", "no shutdown", "🔌", "Een interface die al aanstond."],
  ["egg-rm", "rm -rf /", "💀", "Je hebt het echt gedaan."],
  ["egg-1337u", "13:37", "🕐", "Op precies het juiste moment langsgekomen."],
  ["egg-nacht", "Nachtdienst", "🌃", "Tussen drie en vier 's nachts gespeeld."],
  ["egg-tokenring", "Token Ring", "💍", "Een protocol dat dood had moeten blijven."],
  ["egg-kabel", "Kabelsalade", "🍝", "Iets waar Serge nachtmerries van krijgt."],
  ["egg-console", "Achterdeur", "🚪", "Je hebt de verborgen console gevonden."],
  ["egg-versie", "Kleine lettertjes", "🔎", "Je leest zelfs de versienummers."],
];
for (const [id, name, icon, desc] of EGG_ACHIEVEMENTS) {
  ach(id, name, icon, desc, null, { manual: true, hidden: true, egg: true });
}

ach("egg-tien", "Zoeker", "🗺️", "Vind tien verborgen dingen.", (g) => g.stats.eggs >= 10, { hidden: true });
ach("egg-alles", "Alles gevonden", "🏆", "Vind alles wat verborgen is.", (g) => g.stats.eggs >= EGG_ACHIEVEMENTS.length, { hidden: true });

export const CATEGORIEEN = [...new Set(list.map((a) => a.cat))];
export const ACHIEVEMENTS = list;
export const ACHIEVEMENT_BY_ID = Object.fromEntries(list.map((a) => [a.id, a]));
export const EGG_COUNT = EGG_ACHIEVEMENTS.length;
export const KOFFIE_RANKS = [
  [0, "Geen koffie"],
  [0.1, "Slappe filterkoffie"],
  [0.2, "Automatenkoffie"],
  [0.3, "Echte filterkoffie"],
  [0.45, "Espresso"],
  [0.6, "Dubbele espresso"],
  [0.75, "Ristretto"],
  [0.9, "Koffie uit Serge's eigen thermos"],
  [1, "Puur cafeïne"],
];
