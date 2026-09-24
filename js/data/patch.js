// Werkorders voor de patchkast.
//
// Een werkorder is een kabelgoot van n bij n vakken met een paar aansluitingen
// erin. Elke aansluiting hoort bij precies één andere met hetzelfde label; je
// legt tussen die twee een kabel, zonder andere kabels te kruisen. Ligt elk vak
// van de goot vol, dan is de goot luchtdicht en betaalt de order meer uit.

// Soorten verbindingen. Elke soort komt hooguit één keer voor per werkorder,
// zodat kleur en label samen altijd één paar aanwijzen. De kleuren zijn die van
// echte patchkabels en blijven leesbaar op de donkere goot.
export const VERBINDINGEN = [
  { id: "pc", label: "PC", naam: "werkplek", kleur: "#5aa9ff" },
  { id: "tel", label: "TEL", naam: "telefoon", kleur: "#4ade80" },
  { id: "ap", label: "AP", naam: "access point", kleur: "#fb923c" },
  { id: "cam", label: "CAM", naam: "camera", kleur: "#f87171" },
  { id: "prn", label: "PRN", naam: "printer", kleur: "#c084fc" },
  { id: "brd", label: "BRD", naam: "digibord", kleur: "#facc15" },
  { id: "upl", label: "UPL", naam: "uplink", kleur: "#e2e8f0" },
  { id: "nas", label: "NAS", naam: "opslag", kleur: "#f472b6" },
];

// Maten van de goot, met het aantal kabels en wat een order oplevert in
// seconden productie. Grotere goten gaan open naarmate je protocollen hebt.
export const MATEN = {
  5: { paren: [3, 4], seconden: 60, vanafProtocollen: 0 },
  6: { paren: [4, 5], seconden: 90, vanafProtocollen: 1 },
  7: { paren: [5, 6], seconden: 120, vanafProtocollen: 3 },
  8: { paren: [6, 7], seconden: 160, vanafProtocollen: 5 },
};

export const WERK = {
  // Er liggen hooguit drie orders klaar; elke tweeënhalve minuut komt er een bij.
  wachtrij: 3,
  interval: 150,
  // Een luchtdichte goot levert de helft meer op.
  luchtdicht: 1.5,
  // Elke keer dat Serge een kabel voor je legt, kost dat een vijfde, tot je
  // nog minstens twee vijfden overhoudt.
  hulpKost: 0.2,
  hulpMinimum: 0.4,
};

// Na zoveel afgeronde werkorders komt het volgende protocol vrij. Elk protocol
// geeft blijvend 2% extra productie.
export const DREMPELS = [2, 5, 9, 14, 20, 27, 35, 45];

// In de volgorde waarin ze vrijkomen.
export const PROTOCOLLEN = {
  tokenring: { naam: "Token Ring", icon: "💍", uitleg: "Een token gaat rond; wie hem heeft, mag zenden." },
  ethernet: { naam: "Ethernet over glas", icon: "🔷", uitleg: "Dezelfde frames, maar met licht in plaats van koper." },
  poe: { naam: "Power over Ethernet", icon: "⚡", uitleg: "Stroom en data door één kabel, ideaal voor camera's en access points." },
  docsis: { naam: "DOCSIS", icon: "🟠", uitleg: "Internet over de coaxkabel van de televisie." },
  fddi: { naam: "FDDI", icon: "🔵", uitleg: "Twee glasvezelringen die elkaars fouten opvangen." },
  pon: { naam: "GPON", icon: "🟣", uitleg: "Eén glasvezel die zich passief opsplitst naar tientallen woningen." },
  infiniband: { naam: "InfiniBand", icon: "🟩", uitleg: "Supersnelle verbindingen tussen servers in een rekencentrum." },
  atm: { naam: "ATM", icon: "🏧", uitleg: "Cellen van 53 bytes, lang de ruggengraat van telefoonnetten." },
};

// Waar de werkorders vandaan komen.
export const LOKALEN = [
  "Lokaal A.012",
  "Lokaal A.108",
  "Lokaal B.204",
  "Lokaal B.215",
  "Lokaal C.003",
  "Labo netwerken",
  "Labo elektriciteit",
  "Aula",
  "Leraarskamer",
  "Secretariaat",
  "Bibliotheek",
  "Refter",
  "Sporthal",
  "Directie",
  "Serverlokaal",
];

// Wat de aanvrager erbij schreef.
export const NOTITIES = [
  "Het examen begint om tien uur.",
  "Liefst voor de middagpauze.",
  "De directie komt straks kijken.",
  "Graag zonder kabelsalade deze keer.",
  "Er komt morgen een nieuwe klas binnen.",
  "De leerlingen zeggen dat er niets werkt.",
  "Opendeurdag: alles moet werken.",
  "De vorige technicus is met pensioen.",
  "Serge heeft het beloofd aan de collega's.",
  "Er hangt al een week een briefje op de deur.",
];
