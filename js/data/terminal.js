// Vaste gegevens van de terminal. Zonder DOM, zodat ook het laden van een save
// en de tests ze kunnen gebruiken.

export const POORTEN = ["gi0/1", "gi0/2", "gi0/3", "gi0/4", "gi0/5", "gi0/6", "gi0/7", "gi0/8"];
export const MODI = ["user", "enable", "config", "iface", "vlan"];

export function geldigAdres(tekst) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(String(tekst)) && String(tekst).split(".").every((d) => Number(d) <= 255);
}

// gi0/1, g0/1, gig0/1, GigabitEthernet0/1 en GigabitEthernet 0/1 zijn hetzelfde
// ding. Alleen de acht poorten die deze switch heeft tellen.
export function normaliseerPoort(tekst) {
  const m = String(tekst).toLowerCase().replace(/\s+/g, "").match(/^(?:g|gi|gig|gigabit|gigabitethernet)(\d+\/\d+)$/);
  const naam = m ? `gi${m[1]}` : null;
  return POORTEN.includes(naam) ? naam : null;
}

// VLAN 1 is de standaard en bestaat altijd; 2 tot en met 4094 mag je zelf maken.
export const geldigeVlan = (n) => Number.isInteger(n) && n >= 2 && n <= 4094;
export const geldigeVlannaam = (t) => typeof t === "string" && /^[A-Za-z0-9_-]{1,32}$/.test(t);
export const geldigeHostnaam = (t) => typeof t === "string" && /^[a-z][a-z0-9-]{0,15}$/i.test(t);
export const geldigeTekst = (t) => typeof t === "string" && t.length > 0 && t.length <= 60 && /^[\p{L}\p{N} .,'!?-]+$/u.test(t);

// ------------------------------------------------------------ Opdrachten
//
// Elke soort opdracht heeft:
//   naam        het labeltje boven de opdracht
//   niveau      vanaf hoeveel afgewerkte opdrachten hij kan komen (0 tot 3)
//   seconden    hoeveel seconden productie hij oplevert
//   velden      wat er in de opdracht staat, voor het nakijken van een save
//   maak        de details, willekeurig
//   voorbereid  optioneel: zet de switch klaar, bijvoorbeeld met een fout
//   tekst       de opdracht zoals Serge hem uitschrijft
//   klaar       of de switch nu doet wat gevraagd is
//   oplossing   een reeks commando's die de opdracht oplost, voor de tests

const kies = (lijst) => lijst[Math.floor(Math.random() * lijst.length)];
const getal = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const zelfde = (a, b) => String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();

const MASKERS = ["255.255.255.0", "255.255.255.128", "255.255.255.192", "255.255.255.224", "255.255.255.240"];
const HOSTNAMEN = ["SW-B204", "SW-AULA", "CORE-01", "SW-LABO", "SW-REFTER", "SW-BIB", "EDGE-02", "SW-SPORTHAL", "SW-DIRECTIE"];
const VLANNAMEN = ["LEERLINGEN", "PERSONEEL", "PRINTERS", "CAMERAS", "GASTEN", "BEHEER", "VOIP", "LABO", "DIRECTIE", "WIFI"];
const OMSCHRIJVINGEN = ["Printer B.204", "Access point aula", "Uplink naar core", "Beamer lokaal A.012", "Camera ingang", "Pc van Serge", "Digibord B.215", "Telefoon secretariaat", "Server labo"];
const BANNERS = ["Alleen voor bevoegden", "Eigendom van Serge", "Niet aankomen", "Welkom in het labo", "Geen toegang zonder toestemming"];

const adres = () => `10.${getal(1, 250)}.${getal(1, 250)}.1`;
const poortVoor = (o) => [`interface ${o.poort}`];

export const TAKEN = {
  adres: {
    naam: "Adressering",
    niveau: 0,
    seconden: 120,
    velden: ["poort", "ip", "mask"],
    maak: () => ({ poort: kies(POORTEN), ip: adres(), mask: kies(MASKERS) }),
    tekst: (o) => `Zet ${o.poort} op ${o.ip} ${o.mask}, breng hem up en bewaar de configuratie.`,
    klaar: (cli, o) => {
      const p = cli.interfaces[o.poort];
      return !!(p && p.ip === o.ip && p.mask === o.mask && p.up);
    },
    oplossing: (o) => ["enable", "conf t", ...poortVoor(o), `ip address ${o.ip} ${o.mask}`, "no shutdown", "end", "write memory"],
  },
  hostnaam: {
    naam: "Hostnaam",
    niveau: 1,
    seconden: 90,
    velden: ["naam"],
    maak: (cli) => ({ naam: kies(HOSTNAMEN.filter((h) => h !== cli.hostname)) }),
    tekst: (o) => `Deze switch hangt nu in een ander lokaal. Geef hem de naam ${o.naam} en bewaar de configuratie.`,
    klaar: (cli, o) => zelfde(cli.hostname, o.naam),
    oplossing: (o) => ["enable", "conf t", `hostname ${o.naam}`, "end", "write memory"],
  },
  omschrijving: {
    naam: "Documentatie",
    niveau: 1,
    seconden: 90,
    velden: ["poort", "tekst"],
    maak: () => ({ poort: kies(POORTEN), tekst: kies(OMSCHRIJVINGEN) }),
    tekst: (o) => `Zet de omschrijving "${o.tekst}" op ${o.poort}, zodat de volgende collega weet wat eraan hangt. Bewaar daarna.`,
    klaar: (cli, o) => zelfde(cli.interfaces[o.poort]?.omschrijving, o.tekst),
    oplossing: (o) => ["enable", "conf t", ...poortVoor(o), `description ${o.tekst}`, "end", "write memory"],
  },
  uitzetten: {
    naam: "Beveiliging",
    niveau: 2,
    seconden: 90,
    velden: ["poort"],
    maak: () => ({ poort: kies(POORTEN) }),
    // Iemand heeft de poort open laten staan.
    voorbereid: (cli, o) => {
      cli.interfaces[o.poort] = { ...(cli.interfaces[o.poort] || { ip: null, mask: null, omschrijving: null }), up: true };
    },
    tekst: (o) => `Op ${o.poort} hangt niets meer, maar de poort staat nog open. Zet hem uit en bewaar: een ongebruikte poort hoort dicht.`,
    klaar: (cli, o) => cli.interfaces[o.poort]?.up === false,
    oplossing: (o) => ["enable", "conf t", ...poortVoor(o), "shutdown", "end", "write memory"],
  },
  vlan: {
    naam: "VLAN",
    niveau: 2,
    seconden: 120,
    velden: ["vlan", "naam"],
    maak: () => ({ vlan: kies([10, 20, 30, 40, 50, 60, 99, 100, 110, 200]), naam: kies(VLANNAMEN) }),
    tekst: (o) => `Maak VLAN ${o.vlan} aan met de naam ${o.naam}, en bewaar de configuratie.`,
    klaar: (cli, o) => zelfde(cli.vlans?.[o.vlan], o.naam),
    oplossing: (o) => ["enable", "conf t", `vlan ${o.vlan}`, `name ${o.naam}`, "end", "write memory"],
  },
  toegang: {
    naam: "Accesspoort",
    niveau: 2,
    seconden: 150,
    velden: ["poort", "vlan"],
    maak: () => ({ poort: kies(POORTEN), vlan: kies([10, 20, 30, 40, 50, 99]) }),
    tekst: (o) => `Zet ${o.poort} als accesspoort in VLAN ${o.vlan} en bewaar de configuratie.`,
    klaar: (cli, o) => cli.interfaces[o.poort]?.modus === "access" && cli.interfaces[o.poort]?.vlan === o.vlan,
    oplossing: (o) => ["enable", "conf t", ...poortVoor(o), "switchport mode access", `switchport access vlan ${o.vlan}`, "end", "write memory"],
  },
  gateway: {
    naam: "Gateway",
    niveau: 2,
    seconden: 120,
    velden: ["ip"],
    maak: () => ({ ip: `10.${getal(1, 250)}.${getal(1, 250)}.254` }),
    tekst: (o) => `De switch moet zijn beheerverkeer naar ${o.ip} sturen. Stel dat in als default gateway en bewaar.`,
    klaar: (cli, o) => cli.gateway === o.ip,
    oplossing: (o) => ["enable", "conf t", `ip default-gateway ${o.ip}`, "end", "write memory"],
  },
  banner: {
    naam: "Banner",
    niveau: 3,
    seconden: 120,
    velden: ["tekst"],
    maak: () => ({ tekst: kies(BANNERS) }),
    tekst: (o) => `Wie inlogt, moet een waarschuwing zien. Zet een banner motd met de tekst "${o.tekst}" en bewaar.`,
    klaar: (cli, o) => String(cli.banner || "").toLowerCase().includes(o.tekst.toLowerCase()),
    oplossing: (o) => ["enable", "conf t", `banner motd #${o.tekst}#`, "end", "write memory"],
  },
  secret: {
    naam: "Wachtwoord",
    niveau: 3,
    seconden: 120,
    velden: [],
    maak: () => ({}),
    tekst: () => "Iedereen kan hier zomaar enable typen. Beveilig de bevoorrechte modus met enable secret en bewaar.",
    klaar: (cli) => cli.secret === true,
    oplossing: () => ["enable", "conf t", "enable secret Serge2026", "end", "write memory"],
  },
  herstel: {
    naam: "Foutzoeken",
    niveau: 3,
    seconden: 180,
    velden: ["poort", "ip", "mask", "fout"],
    maak: () => ({ poort: kies(POORTEN), ip: adres(), mask: "255.255.255.0", fout: kies(["masker", "down", "adres"]) }),
    // Zet de fout klaar: een verkeerd masker, een verkeerd adres of een poort
    // die uit staat. Welke het is, staat niet in de opdracht.
    voorbereid: (cli, o) => {
      const [a, b, c] = o.ip.split(".");
      cli.interfaces[o.poort] = {
        ip: o.fout === "adres" ? `${a}.${b}.${(Number(c) + 1) % 250 || 1}.1` : o.ip,
        mask: o.fout === "masker" ? "255.255.0.0" : o.mask,
        up: o.fout !== "down",
        omschrijving: "Lokaal zonder verbinding",
      };
    },
    tekst: (o) => `Het lokaal aan ${o.poort} heeft geen verbinding meer. Het adres hoort ${o.ip} ${o.mask} te zijn. Zoek de fout met de show-commando's, los ze op en bewaar.`,
    klaar: (cli, o) => {
      const p = cli.interfaces[o.poort];
      return !!(p && p.ip === o.ip && p.mask === o.mask && p.up);
    },
    oplossing: (o) => ["enable", "show ip interface brief", "conf t", ...poortVoor(o), `ip address ${o.ip} ${o.mask}`, "no shutdown", "end", "write memory"],
  },
  combo: {
    naam: "VLAN en poort",
    niveau: 3,
    seconden: 210,
    velden: ["vlan", "naam", "poort"],
    maak: () => ({ vlan: kies([20, 30, 40, 60, 99, 150]), naam: kies(VLANNAMEN), poort: kies(POORTEN) }),
    tekst: (o) => `Nieuw lokaal: maak VLAN ${o.vlan} met de naam ${o.naam}, zet ${o.poort} erin als accesspoort en bewaar.`,
    klaar: (cli, o) => zelfde(cli.vlans?.[o.vlan], o.naam) && cli.interfaces[o.poort]?.modus === "access" && cli.interfaces[o.poort]?.vlan === o.vlan,
    oplossing: (o) => ["enable", "conf t", `vlan ${o.vlan}`, `name ${o.naam}`, "exit", ...poortVoor(o), "switchport mode access", `switchport access vlan ${o.vlan}`, "end", "write memory"],
  },
};

// Hoe verder je bent, hoe meer soorten opdrachten er kunnen komen. Nooit twee
// keer na elkaar dezelfde soort, en een wachtwoord zet je maar één keer.
export function niveauVan(gedaan) {
  return gedaan >= 6 ? 3 : gedaan >= 3 ? 2 : gedaan >= 1 ? 1 : 0;
}

export function kiesTaak(cli) {
  const niveau = niveauVan(cli.gedaan || 0);
  const kan = Object.keys(TAKEN).filter((soort) => TAKEN[soort].niveau <= niveau && soort !== cli.vorige && !(soort === "secret" && cli.secret));
  return kies(kan.length ? kan : ["adres"]);
}

export function nieuweTaak(cli, soort = kiesTaak(cli)) {
  const taak = TAKEN[soort];
  const opdracht = { soort, ...taak.maak(cli) };
  taak.voorbereid?.(cli, opdracht);
  return opdracht;
}

// Voor het nakijken van een save. Een opdracht zonder soort komt uit een
// oudere versie, toen er alleen adressen waren.
const VELDEN = {
  poort: (v) => POORTEN.includes(v),
  ip: geldigAdres,
  mask: geldigAdres,
  naam: geldigeVlannaam,
  tekst: geldigeTekst,
  vlan: geldigeVlan,
  fout: (v) => ["masker", "down", "adres"].includes(v),
};

export function schoonOpdracht(op) {
  if (!op || typeof op !== "object" || Array.isArray(op)) return null;
  const soort = op.soort === undefined ? "adres" : op.soort;
  const taak = Object.hasOwn(TAKEN, soort) ? TAKEN[soort] : null;
  if (!taak) return null;
  const uit = { soort };
  for (const veld of taak.velden) {
    if (!VELDEN[veld](op[veld])) return null;
    uit[veld] = op[veld];
  }
  return uit;
}
