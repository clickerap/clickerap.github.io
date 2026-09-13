// Uiterlijk: drie losse keuzes die je vrij combineert.
//
//   portret      welke foto en welke bewerking erop
//   ring         de rand om de foto
//   achtergrond  de kleuren van de pagina
//
// eis   krijgt de spelstaat en geeft terug of het ding ontgrendeld is
// hoe   de tekst die je ziet zolang het op slot zit
//
// Wat je ontgrendelt blijft voor altijd, ook na afstuderen.

export const PORTRETTEN = [
  {
    id: "serge",
    naam: "Serge",
    beschrijving: "De foto zoals hij hoort.",
    hoe: null,
    eis: () => true,
  },
  {
    id: "archief",
    naam: "Archief",
    beschrijving: "Alsof hij al jaren aan de muur hangt.",
    hoe: "Koop 25 upgrades",
    eis: (g) => g.stats.upgrades >= 25,
  },
  {
    id: "blauwdruk",
    naam: "Blauwdruk",
    beschrijving: "Serge als netwerktekening.",
    hoe: "Bezit 250 apparaten tegelijk",
    eis: (g) => g.totalBuildings >= 250,
  },
  {
    id: "neon",
    naam: "Neon",
    beschrijving: "Alle kleuren een slag harder.",
    hoe: "Klik 50 gouden packets",
    eis: (g) => g.stats.goldenClicks >= 50,
  },
  {
    id: "nacht",
    naam: "Nachtdienst",
    beschrijving: "Het serverlokaal om drie uur 's nachts.",
    hoe: "Speel tussen drie en vier uur 's nachts",
    eis: (g) => !!g.achievements["egg-nacht"],
  },
  {
    id: "matrix",
    naam: "Matrix",
    beschrijving: "Serge, gerenderd in groene regen.",
    hoe: "Bereik een miljoen packets per seconde",
    eis: (g) => g.pps >= 1e6,
  },
  {
    id: "roentgen",
    naam: "Röntgen",
    beschrijving: "Alles omgekeerd. Kijk er niet te lang naar.",
    hoe: "Klik honderdduizend keer",
    eis: (g) => !!g.achievements["klik-100k"],
  },
  {
    id: "poster",
    naam: "Poster",
    beschrijving: "Harde kleuren, zoals aan de muur van het lokaal.",
    hoe: "Koop 75 upgrades",
    eis: (g) => g.stats.upgrades >= 75,
  },
  {
    id: "evolved",
    naam: "Geëvolueerd",
    beschrijving: "De vorm die Serge aanneemt voorbij een miljard packets.",
    hoe: "Verdien in totaal een miljard packets",
    eis: (g) => g.stats.lifetime >= 1e9,
    feest: {
      titel: "Serge is geëvolueerd",
      tekst: "Een miljard packets door zijn netwerk. Er is iets met hem gebeurd — je vindt hem onder het tandwiel, bij Uiterlijk.",
    },
  },
];

export const RINGEN = [
  { id: "blauw", naam: "Blauw", beschrijving: "De vertrouwde rand.", hoe: null, eis: () => true },
  { id: "goud", naam: "Goud", beschrijving: "Voor de gouden-packetjager.", hoe: "Klik 25 gouden packets", eis: (g) => g.stats.goldenClicks >= 25 },
  { id: "cyaan", naam: "Cyaan", beschrijving: "De kleur van een werkende poort.", hoe: "Zet een interface volledig goed op in de terminal", eis: (g) => !!g.achievements["cli-config"] },
  { id: "groen", naam: "Groen", beschrijving: "Uit de patchkast.", hoe: "Ontdek je eerste protocol", eis: (g) => !!g.achievements["patch-protocol"] },
  { id: "indigo", naam: "Indigo", beschrijving: "Voor wie het netwerk 's nachts laat doordraaien.", hoe: "Kom terug na een uur weg te zijn geweest", eis: (g) => !!g.achievements.offline },
  { id: "roze", naam: "Roze", beschrijving: "Omdat het kan.", hoe: "Haal 40 prestaties", eis: (g) => g.stats.achievements >= 40 },
  { id: "wit", naam: "Wit", beschrijving: "Rustig, strak, klaar.", hoe: "Bezit 500 apparaten tegelijk", eis: (g) => g.totalBuildings >= 500 },
  { id: "matrix", naam: "Terminalgroen", beschrijving: "De kleur van een console die het doet.", hoe: "Typ de Konami-code", eis: (g) => !!g.achievements["egg-konami"] },
  { id: "rood", naam: "Alarmrood", beschrijving: "Voor wie rode packets links laat liggen.", hoe: "Negeer tien rode packets", eis: (g) => g.stats.ddosIgnored >= 10 },
  { id: "koper", naam: "Koper", beschrijving: "Warm en ouderwets, net als UTP.", hoe: "Klik 200 gouden packets", eis: (g) => g.stats.goldenClicks >= 200 },
  { id: "zwart", naam: "Mat zwart", beschrijving: "Zoals elk rack in elk datacenter.", hoe: "Bezit 1.000 apparaten tegelijk", eis: (g) => g.totalBuildings >= 1000 },
  { id: "regenboog", naam: "Regenboog", beschrijving: "Een ring die alle kleuren doorloopt.", hoe: "Studeer één keer af", eis: (g) => g.prestige >= 1 },
];

export const ACHTERGRONDEN = [
  { id: "klas", naam: "Klaslokaal", beschrijving: "Het vertrouwde blauw.", hoe: null, eis: () => true },
  { id: "mint", naam: "Mint", beschrijving: "Koel en fris, als een goed gekoelde gang.", hoe: "Verdien in totaal een miljoen packets", eis: (g) => g.stats.lifetime >= 1e6 },
  { id: "zonsopgang", naam: "Vroege dienst", beschrijving: "Geel en roze, van voor de koffie.", hoe: "Klik tienduizend keer", eis: (g) => !!g.achievements["klik-10k"] },
  { id: "serverlokaal", naam: "Serverlokaal", beschrijving: "Donker, koel en groen verlicht.", hoe: "Tien goede antwoorden op rij bij de overhoring", eis: (g) => !!g.achievements["quiz-10"] },
  { id: "patchkast", naam: "Patchkast", beschrijving: "Het groen van een volle kabelgoot.", hoe: "Ontdek vier protocollen", eis: (g) => g.protocollen >= 4 },
  { id: "koper", naam: "Koper", beschrijving: "Warm, ouderwets en betrouwbaar.", hoe: "Koop 50 upgrades", eis: (g) => g.stats.upgrades >= 50 },
  { id: "zonsondergang", naam: "Zonsondergang", beschrijving: "Roze tot paars, na een goede handelsdag.", hoe: "Maak winst op de bandbreedtemarkt", eis: (g) => !!g.achievements["beurs-winst"] },
  { id: "staal", naam: "Staal", beschrijving: "Grijs op grijs, zoals het rack zelf.", hoe: "Haal 100 prestaties", eis: (g) => g.stats.achievements >= 100 },
  { id: "diepteruimte", naam: "Diepe ruimte", beschrijving: "Voorbij de laatste satelliet.", hoe: "Koop je eerste singulariteit", eis: (g) => (g.buildings.singularity || 0) >= 1 },
  { id: "oceaan", naam: "Oceaan", beschrijving: "Diep water, met een kabel erdoorheen.", hoe: "Koop je eerste zeekabel", eis: (g) => (g.buildings.subsea || 0) >= 1 },
  { id: "matrix", naam: "Matrix", beschrijving: "Zwart met groen. Je weet waarom.", hoe: "Voer rm -rf / uit in de terminal", eis: (g) => !!g.achievements["egg-rm"] },
  { id: "nevel", naam: "Nevel", beschrijving: "Paars en stil, ergens ver weg.", hoe: "Verzamel 25 studiepunten", eis: (g) => g.prestige >= 25 },
  { id: "regenboog", naam: "Regenboog", beschrijving: "Alles tegelijk. Niet subtiel, wel verdiend.", hoe: "Studeer één keer af", eis: (g) => g.prestige >= 1 },
];

export const UITERLIJK = { portret: PORTRETTEN, ring: RINGEN, achtergrond: ACHTERGRONDEN };
export const SOORTNAMEN = { portret: "Portret", ring: "Ring", achtergrond: "Achtergrond" };
export const STANDAARD = { portret: "serge", ring: "blauw", achtergrond: "klas" };

export const ALLE_SKINS = Object.entries(UITERLIJK).flatMap(([soort, lijst]) =>
  lijst.map((s) => ({ ...s, soort }))
);
