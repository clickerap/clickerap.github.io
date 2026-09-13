// De gebouwen. Eén regel data per gebouw, de winkel bouwt zichzelf hieruit op.
//
// baseCost  kosten van het eerste exemplaar; elk volgend exemplaar kost x1.15
// basePps   packets per seconde per exemplaar, voor upgrades en multipliers
// tiers     de vijf gebouw-upgrades, elk verdubbelt de output van dit gebouw

export const VAKKEN = {
  netwerken: { name: "Netwerken", icon: "🔀", hue: 199 },
  sddc: { name: "Datacenter", icon: "🏢", hue: 258 },
  cloud: { name: "Cloud", icon: "☁️", hue: 172 },
  security: { name: "Security", icon: "🛡️", hue: 22 },
};

// Bij hoeveel exemplaren een gebouw-upgrade vrijkomt, en wat hij kost
// (maal de basisprijs van dat gebouw).
export const TIER_AT = [1, 5, 25, 50, 100];
export const TIER_COST = [10, 100, 1000, 15000, 200000];

export const BUILDINGS = [
  {
    id: "patchkabel",
    name: "Patchkabel",
    icon: "🔌",
    vak: "netwerken",
    baseCost: 15,
    basePps: 0.1,
    blurb: "Twee apparaten, één kabel. Zo begint elk netwerk.",
    tiers: [
      ["Ontklitte kabelbak", "Iemand heeft de bak eindelijk uitgezocht."],
      ["Kleurcodering", "T568B. Niet T568A. Serge kijkt mee."],
      ["Kabelgoot", "Alles weggewerkt, niets hangt meer los."],
      ["Cat6a", "Meer koper, minder crosstalk, zwaardere rol."],
      ["Gecertificeerde krimptang", "Elke stekker zit in één keer goed."],
    ],
  },
  {
    id: "switch",
    name: "Netwerk Switch",
    icon: "🔀",
    vak: "netwerken",
    baseCost: 100,
    basePps: 1,
    blurb: "Leert MAC-adressen uit z'n hoofd en vergeet ze na 300 seconden.",
    tiers: [
      ["Jumbo frames", "9000 bytes per frame. Minder overhead, meer doorvoer."],
      ["VLAN-indeling", "Eindelijk staat de printer niet meer bij de servers."],
      ["Spanning Tree", "Geen loops meer. De broadcast storm van vorig jaar is vergeven."],
      ["PoE+", "De access points hebben geen stopcontact meer nodig."],
      ["Stacking", "Acht switches, één beheeradres."],
    ],
  },
  {
    id: "router",
    name: "Core Router",
    icon: "🧭",
    vak: "netwerken",
    baseCost: 1100,
    basePps: 8,
    blurb: "Kiest het beste pad. Meestal.",
    tiers: [
      ["Statische routes", "Werkt prima tot er iets verandert."],
      ["OSPF", "Area 0 en verder alles netjes eronder."],
      ["BGP-sessie", "Je eigen AS-nummer. Serge is trots."],
      ["Hardware forwarding", "Routeren gebeurt nu in silicium, niet in software."],
      ["Redundante supervisors", "De ene faalt, de andere merkt het amper."],
    ],
  },
  {
    id: "fiber",
    name: "Glasvezel",
    icon: "🧵",
    vak: "netwerken",
    baseCost: 12000,
    basePps: 47,
    blurb: "Licht in glas. Niet buigen.",
    tiers: [
      ["Single-mode", "Eén lichtpad, veel verder dan multimode."],
      ["Fusielassen", "Geen connectorverlies meer op de tussenpunten."],
      ["DWDM", "Tachtig kleuren licht door dezelfde vezel."],
      ["400G-optiek", "De transceiver kost meer dan de switch."],
      ["Geharnaste mantel", "Bestand tegen knaagdieren en tegen stagiairs."],
    ],
  },
  {
    id: "rack",
    name: "Serverrack",
    icon: "🗄️",
    vak: "sddc",
    baseCost: 130000,
    basePps: 260,
    blurb: "42 units, 41 gevuld, één vrij voor de netheid.",
    tiers: [
      ["Blindplaten", "De koude lucht gaat waar hij hoort."],
      ["Warme- en koudegangopstelling", "Scheelt de helft aan koeling."],
      ["Redundante PDU's", "Twee voedingspaden per apparaat."],
      ["Kabelmanagement-armen", "Uitschuiven zonder iets los te trekken."],
      ["Directe vloeistofkoeling", "Water in een rack. Het went."],
    ],
  },
  {
    id: "datacenter",
    name: "Datacenter",
    icon: "🏢",
    vak: "sddc",
    baseCost: 1.4e6,
    basePps: 1400,
    blurb: "Koud, luid en peperduur. Serge voelt zich er thuis.",
    tiers: [
      ["N+1 UPS", "De stroom hapert, de servers merken het niet."],
      ["Dieselgenerator", "Getest op de eerste maandag van de maand."],
      ["Containment", "Warme lucht komt nergens meer waar hij niet hoort."],
      ["Vrije koeling", "Negen maanden per jaar koelt het weer je datacenter."],
      ["Tier IV", "Alles dubbel. Ook de dingen die al dubbel waren."],
    ],
  },
  {
    id: "proxmox",
    name: "Proxmox Cluster",
    icon: "🖥️",
    vak: "sddc",
    baseCost: 2e7,
    basePps: 7800,
    blurb: "Virtualisatie zonder licentiefactuur.",
    tiers: [
      ["ZFS-pool", "Snapshots die niets kosten tot je ze gebruikt."],
      ["Live migration", "De VM verhuist terwijl hij draait."],
      ["Ceph", "Opslag zonder SAN, mits je genoeg nodes hebt."],
      ["HA-groepen", "Node valt om, VM staat elders alweer op."],
      ["Backup-server", "Het enige onderdeel dat je écht nooit mag missen."],
    ],
  },
  {
    id: "vsphere",
    name: "vSphere Cluster",
    icon: "🧊",
    vak: "sddc",
    baseCost: 3.3e8,
    basePps: 44000,
    blurb: "vMotion tijdens de les, want het kán.",
    tiers: [
      ["DRS", "De cluster verdeelt zichzelf terwijl je toekijkt."],
      ["vSAN", "De schijven in de hosts zijn nu de opslag."],
      ["NSX-overlay", "Netwerken bestaan alleen nog in software."],
      ["Fault tolerance", "Twee identieke VM's, één schaduw."],
      ["vCenter HA", "Zelfs het beheer heeft nu een reserve."],
    ],
  },
  {
    id: "ad",
    name: "Active Directory",
    icon: "🗂️",
    vak: "security",
    baseCost: 5.1e9,
    basePps: 2.6e5,
    blurb: "Iedereen is wie hij zegt dat hij is. Op papier.",
    tiers: [
      ["Group Policy", "Achtergrondfoto's centraal geregeld, macht compleet."],
      ["Read-only domeincontroller", "Voor de locatie die je niet vertrouwt."],
      ["Kerberos-hardening", "Tickets die niemand meer namaakt."],
      ["Tiered admin-model", "Domain admins loggen nergens anders meer op in."],
      ["Multi-forest trust", "Twee bedrijven, één inlog, nul rust."],
    ],
  },
  {
    id: "k8s",
    name: "Kubernetes Cluster",
    icon: "☸️",
    vak: "cloud",
    baseCost: 7.5e10,
    basePps: 1.6e6,
    blurb: "Je containers herstarten zichzelf. Steeds opnieuw.",
    tiers: [
      ["Helm-charts", "Eén commando, dertig YAML-bestanden minder."],
      ["Autoscaler", "Pods erbij als het druk is, eraf als niemand kijkt."],
      ["Service mesh", "Elk pakketje krijgt onderweg een stempel."],
      ["Operators", "De cluster beheert nu z'n eigen databases."],
      ["Federatie", "Vijf clusters die doen alsof ze er één zijn."],
    ],
  },
  {
    id: "sdn",
    name: "SDN Controller",
    icon: "🎛️",
    vak: "sddc",
    baseCost: 1e12,
    basePps: 1e7,
    blurb: "De control plane weet alles, de data plane doet alles.",
    tiers: [
      ["OpenFlow", "Flows worden neergelegd, niet geleerd."],
      ["Intent-based beleid", "Je zegt wat je wilt, niet hoe."],
      ["Telemetrie", "Elke poort vertelt tien keer per seconde hoe het gaat."],
      ["Zero-touch provisioning", "Uitpakken, inpluggen, klaar."],
      ["Digitale tweeling", "Elke wijziging draait eerst in een kopie van je netwerk."],
    ],
  },
  {
    id: "firewall",
    name: "Next-gen Firewall",
    icon: "🧱",
    vak: "security",
    baseCost: 1.4e13,
    basePps: 6.5e7,
    blurb: "Standaard alles dicht. Daarna tweehonderd uitzonderingen.",
    tiers: [
      ["Deep packet inspection", "Hij leest mee. Voor je eigen bestwil."],
      ["IPS-signatures", "Bekende aanvallen halen de logregel niet eens."],
      ["TLS-inspectie", "Versleuteld verkeer is niet langer een blinde vlek."],
      ["Geo-blocking", "Halve wereldkaart uit, klachten binnen een dag."],
      ["Cluster met sessiesync", "Failover zonder één verbroken sessie."],
    ],
  },
  {
    id: "soc",
    name: "Security Operations",
    icon: "🛡️",
    vak: "security",
    baseCost: 1.7e14,
    basePps: 4.3e8,
    blurb: "Drie schermen, twee analisten, één energiedrank.",
    tiers: [
      ["SIEM-correlatie", "Duizend losse logs worden één verhaal."],
      ["Threat intel", "Je weet wat er komt voor het aankomt."],
      ["Playbooks", "De eerste vijf stappen doet niemand meer met de hand."],
      ["Threat hunting", "Zoeken naar wat geen alarm heeft afgegeven."],
      ["24/7-bezetting", "Ook om 03:00 kijkt er iemand mee."],
    ],
  },
  {
    id: "hyperscaler",
    name: "Hyperscaler-regio",
    icon: "☁️",
    vak: "cloud",
    baseCost: 2.1e15,
    basePps: 2.9e9,
    blurb: "Drie beschikbaarheidszones en één factuur die niemand snapt.",
    tiers: [
      ["Reserved instances", "Drie jaar vastleggen, veertig procent goedkoper."],
      ["Edge-locaties", "De inhoud staat al in de stad van je gebruiker."],
      ["Eigen silicium", "Chips die alleen jij mag kopen."],
      ["Extra zone", "Nog een gebouw dat tegelijk mag omvallen. Of niet."],
      ["Eigen zeekabel", "Waarom huren als je kunt graven."],
    ],
  },
  {
    id: "darkfiber",
    name: "Dark Fiber Mesh",
    icon: "🌑",
    vak: "netwerken",
    baseCost: 2.6e16,
    basePps: 2.1e10,
    blurb: "Glas dat al twintig jaar in de grond op je ligt te wachten.",
    tiers: [
      ["Eigen golflengtes", "Geen provider meer tussen jou en het licht."],
      ["Ringtopologie", "Kabel doorgesneden? Het verkeer gaat linksom."],
      ["Ultralaag-latentiepad", "Recht door, ook als dat duurder graven is."],
      ["Verzegelde lasmoffen", "Grondwater komt er niet meer bij."],
      ["Landelijke mesh", "Elke stad hangt aan drie andere."],
    ],
  },
  {
    id: "subsea",
    name: "Zeekabel",
    icon: "🌊",
    vak: "netwerken",
    baseCost: 3.1e17,
    basePps: 1.5e11,
    blurb: "Een kabel over de oceaanbodem. Haaien niet inbegrepen.",
    tiers: [
      ["Repeaters", "Om de tachtig kilometer krijgt het licht een duw."],
      ["Haaibestendige mantel", "Getest. Meerdere keren. Onvrijwillig."],
      ["Kabelschip op standby", "Breuk op dinsdag, vaart uit op dinsdag."],
      ["Landingsstations", "Twee bunkers aan zee, allebei zwaarbewaakt."],
      ["Trans-Pacifisch pad", "Achttienduizend kilometer in één stuk."],
    ],
  },
  {
    id: "satellite",
    name: "Satellietconstellatie",
    icon: "🛰️",
    vak: "netwerken",
    baseCost: 7.1e18,
    basePps: 1.1e12,
    blurb: "Laag genoeg voor 20 ms, hoog genoeg voor overal.",
    tiers: [
      ["Lage baan", "Vijfhonderd kilometer in plaats van vijfendertigduizend."],
      ["Laserlinks", "Satellieten praten onderling, zonder grond."],
      ["Fasegestuurde antennes", "Geen schotel die moet meedraaien."],
      ["Grondstationnetwerk", "Overal een landingspunt binnen bereik."],
      ["Polaire banen", "Ook Antarctica heeft nu ping."],
    ],
  },
  {
    id: "quantum",
    name: "Quantum Link",
    icon: "⚛️",
    vak: "cloud",
    baseCost: 1.2e20,
    basePps: 8.3e12,
    blurb: "Verstrengeling maakt afstand een detail.",
    tiers: [
      ["Kwantumrepeaters", "Verstrengeling die een continent overleeft."],
      ["Sleuteldistributie", "Meeluisteren verandert de sleutel. Handig."],
      ["Foutcorrectie", "Duizend fysieke qubits voor één die klopt."],
      ["Verstrengelingsfabriek", "Paren op bestelling, per seconde."],
      ["Planetaire backbone", "De hele planeet, één kwantumnetwerk."],
    ],
  },
  {
    id: "neural",
    name: "AI NetOps",
    icon: "🧠",
    vak: "cloud",
    baseCost: 1.9e21,
    basePps: 6.4e13,
    blurb: "De AI beheert het netwerk. En schrijft de changelog.",
    tiers: [
      ["Zelflerende routering", "Het pad van gisteren was niet het beste pad."],
      ["Voorspellend onderhoud", "De schijf wordt vervangen voor hij stukgaat."],
      ["Autonome incidentafhandeling", "Storing om 02:00, oplossing om 02:01."],
      ["Digitale collega", "Praat mee in de stand-up, klaagt nooit."],
      ["Eigen mening", "Hij is het niet altijd eens met je ontwerp. Hij heeft vaak gelijk."],
    ],
  },
  {
    id: "dyson",
    name: "Dyson-datacenter",
    icon: "🌞",
    vak: "cloud",
    baseCost: 5.4e22,
    basePps: 5.1e14,
    blurb: "Rekencapaciteit ter grootte van een ster.",
    tiers: [
      ["Zonneschil", "Een procent van de ster, volledig benut."],
      ["Kunstmatige nacht", "De warmte moet érgens heen."],
      ["Sterkernkoeling", "Koelen met iets wat kouder is dan de ruimte."],
      ["Miljard collectoren", "De zwerm is vanaf de aarde zichtbaar."],
      ["Tweede ster", "Eén ster bleek niet genoeg voor de logbestanden."],
    ],
  },
  {
    id: "multiverse",
    name: "Parallel VPN",
    icon: "🌌",
    vak: "cloud",
    baseCost: 1.5e24,
    basePps: 4.2e15,
    blurb: "Je downloadt het internet van een universum waar het al af is.",
    tiers: [
      ["Dimensionale peering", "Gratis verkeer met de buuruniversa."],
      ["Anycast over werelden", "Het dichtstbijzijnde universum antwoordt."],
      ["Paradoxpreventie", "Je eigen packet mag je niet meer tegenkomen."],
      ["Universum-load-balancer", "Drukke werkelijkheden worden ontzien."],
      ["Eigen tak", "Een universum dat alleen bestaat om te routeren."],
    ],
  },
  {
    id: "singularity",
    name: "Singulariteit",
    icon: "🕳️",
    vak: "cloud",
    baseCost: 4.2e25,
    basePps: 3.5e16,
    blurb: "Serge en het netwerk zijn niet langer te onderscheiden.",
    tiers: [
      ["Zelfherschrijvende kernel", "De code van vanmorgen herkent hij niet meer."],
      ["Bewustzijn als dienst", "Per seconde afgerekend."],
      ["Tijd als transportprotocol", "Aankomst voor vertrek, binnen de spec."],
      ["Alles is één packet", "Het universum past in één frame. Jumbo, uiteraard."],
      ["Serge is het netwerk", "Er valt niets meer uit te leggen. Alleen te zijn."],
    ],
  },
];

export const BUILDING_BY_ID = Object.fromEntries(BUILDINGS.map((b) => [b.id, b]));

// Prijs van het n-de exemplaar (0-geïndexeerd), Cookie Clicker-curve.
export function costOf(building, owned) {
  return Math.ceil(building.baseCost * Math.pow(1.15, owned));
}

// Totaalprijs voor `amount` stuks vanaf `owned`, meetkundige reeks.
export function bulkCost(building, owned, amount) {
  if (amount <= 0) return 0;
  const r = 1.15;
  return Math.ceil(
    building.baseCost * Math.pow(r, owned) * ((Math.pow(r, amount) - 1) / (r - 1))
  );
}

// Hoeveel stuks kun je met `budget` kopen?
export function affordableAmount(building, owned, budget) {
  const r = 1.15;
  const start = building.baseCost * Math.pow(r, owned);
  if (budget < start) return 0;
  const n = Math.floor(
    Math.log((budget * (r - 1)) / start + 1) / Math.log(r)
  );
  // Afrondingsfouten wegwerken door de laatste stap na te rekenen.
  let amount = Math.max(0, n);
  while (amount > 0 && bulkCost(building, owned, amount) > budget) amount--;
  return amount;
}

// Terugverkopen levert een kwart op, zoals in het genre gebruikelijk.
export function refundOf(building, owned, amount) {
  return Math.floor(bulkCost(building, Math.max(0, owned - amount), amount) * 0.25);
}
