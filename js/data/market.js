// De goederen op de bandbreedtemarkt en het nieuws dat de koersen beweegt.
//
// vol      hoe hard de koers per tik beweegt (standaardafwijking ongeveer de helft)
// profiel  wat voor goed het is, voor wie het wil lezen

export const GOEDEREN = [
  { id: "bw", naam: "Bandbreedte", icon: "📶", vol: 0.055, profiel: "Rustig. Beweegt vooral als er ergens een kabel breekt." },
  { id: "cpu", naam: "Rekentijd", icon: "🧮", vol: 0.07, profiel: "Volgt nieuwe chips en drukke avonden." },
  { id: "ram", naam: "Geheugen", icon: "🧠", vol: 0.045, profiel: "Traag en voorspelbaar, tot er een fabriek stilvalt." },
  { id: "iops", naam: "Opslag-IOPS", icon: "💾", vol: 0.06, profiel: "Schiet omhoog als iedereen tegelijk backups terugzet." },
  { id: "gpu", naam: "GPU-uren", icon: "🎮", vol: 0.11, profiel: "Heftig. Elke AI-hype zet de koers op zijn kop." },
  { id: "ip", naam: "IPv4-adressen", icon: "🏷️", vol: 0.085, profiel: "Schaars en grillig. IPv6 ligt altijd op de loer." },
];

export const GOED_BY_ID = Object.fromEntries(GOEDEREN.map((g) => [g.id, g]));

// Nieuws. Een gewoon bericht werkt meteen. Een gerucht werkt pas later, en
// komt lang niet altijd uit.
//
// factor  vermenigvuldiger op de koers als het bericht (of gerucht) uitkomt
export const KOPPEN = [
  { goed: "bw", factor: 1.35, tekst: "Een zeekabel ligt eruit. Bandbreedte schiet omhoog." },
  { goed: "bw", factor: 0.75, tekst: "Nieuwe zeekabel in gebruik. Bandbreedte in overvloed." },
  { goed: "bw", factor: 1.3, gerucht: true, tekst: "Een grote backbone gaat volgende week in onderhoud." },
  { goed: "bw", factor: 0.78, gerucht: true, tekst: "Een provider zet een glasvezelring van tien terabit in de verkoop." },
  { goed: "cpu", factor: 0.7, tekst: "Nieuwe generatie processors aangekondigd. Rekentijd wordt goedkoper." },
  { goed: "cpu", factor: 1.3, tekst: "Een populaire game lanceert vanavond. Iedereen wil rekentijd." },
  { goed: "cpu", factor: 1.28, gerucht: true, tekst: "Een chipfabriek kampt met productieproblemen." },
  { goed: "ram", factor: 1.4, tekst: "Fabriek stil na een stroomstoring. Geheugen wordt schaars." },
  { goed: "ram", factor: 0.75, tekst: "Een containerschip vol geheugenchips komt aan in Antwerpen." },
  { goed: "ram", factor: 1.3, gerucht: true, tekst: "Geheugenfabrikanten praten over prijsafspraken." },
  { goed: "iops", factor: 0.68, tekst: "Iedereen stapt over op flash. IOPS in de uitverkoop." },
  { goed: "iops", factor: 1.35, tekst: "Ransomware-golf: iedereen zet tegelijk backups terug. IOPS schaars." },
  { goed: "iops", factor: 0.75, gerucht: true, tekst: "Een nieuwe generatie NVMe-schijven ligt al in het magazijn." },
  { goed: "gpu", factor: 1.6, tekst: "Weer een AI-bedrijf koopt alles op. GPU-uren onbetaalbaar." },
  { goed: "gpu", factor: 0.6, tekst: "Het AI-bedrijf van vorige maand gaat failliet. Duizenden GPU's te koop." },
  { goed: "gpu", factor: 1.45, gerucht: true, tekst: "Een techreus traint volgende week een gigantisch model." },
  { goed: "gpu", factor: 0.7, gerucht: true, tekst: "Een nieuwe chip maakt GPU's voor AI overbodig." },
  { goed: "ip", factor: 0.62, tekst: "Een provider dumpt een /16 op de markt. IPv4 zakt in." },
  { goed: "ip", factor: 1.35, tekst: "RIPE heeft geen adressen meer over. IPv4 gewilder dan ooit." },
  { goed: "ip", factor: 0.72, gerucht: true, tekst: "Een grote provider stapt volledig over op IPv6." },
  { goed: "ip", factor: 1.3, gerucht: true, tekst: "Een cloudreus zoekt een miljoen extra IPv4-adressen." },
];

// De spelregels van de markt, op één plek.
export const MARKT = {
  tikMs: 5000, // elke vijf seconden een nieuwe koers
  historie: 60, // koersen die bewaard blijven: vijf minuten
  nieuwsKans: 0.05, // kans per tik op een nieuw bericht
  geruchtWaar: 0.7, // kans dat een gerucht uitkomt
  geruchtNa: [4, 10], // na hoeveel tikken een gerucht beslist wordt
  trendKans: 0.03, // kans per tik dat een goed van richting verandert
  trendMax: 0.008, // grootste trend per tik
  terugval: 0.012, // hoe hard een koers terug naar 100 trekt
  minKoers: 12,
  maxKoers: 400,
  koopMinuten: [1, 5, 15], // inzet in minuten productie
  limietMinuten: 15, // meer dan een kwartier productie per goed mag niet
  winstOrders: [0.1, 0.25, 0.5],
  verliesOrders: [0.1, 0.25],
};
