// De studieboom. Studiepunten geef je hier uit; wat je koopt blijft voor altijd,
// ook na een volgende keer afstuderen.

// Tien takken, van boven naar beneden in de boom. Elke tak heeft zes
// knooppunten die steeds meer kosten. Aan het eind van twee naburige takken
// zit een kruisknoop die ze allebei vraagt, en helemaal rechts het doctoraat,
// dat alle kruisknopen vraagt.
export const BRANCHES = [
  { id: "studie", name: "Studie", icon: "🎓", desc: "Meer rendement uit elk diploma." },
  { id: "praktijk", name: "Praktijk", icon: "🔧", desc: "Klikken en labo's." },
  { id: "geluk", name: "Geluk", icon: "🍀", desc: "Gouden packets, vaker en sterker." },
  { id: "beheer", name: "Beheer", icon: "🌙", desc: "Je netwerk draait door terwijl jij weg bent." },
  { id: "netwerken", name: "Netwerken", icon: "🔀", desc: "Kabels, switches, routers en glas." },
  { id: "datacenter", name: "Datacenter", icon: "🏢", desc: "Racks, virtualisatie en software-defined alles." },
  { id: "cloud", name: "Cloud", icon: "☁️", desc: "Containers, quantum en megastructuren." },
  { id: "security", name: "Security", icon: "🛡️", desc: "Identiteit, firewalls en rode packets." },
  { id: "labo", name: "Labo", icon: "🧪", desc: "Opdrachten sneller en rijker." },
  { id: "economie", name: "Economie", icon: "💶", desc: "Goedkoper bouwen en slimmer verkopen." },
];

// De prijs per kolom, voor elke tak dezelfde.
const PRIJS = [1, 4, 10, 25, 60, 140];
const rij = (branch) => BRANCHES.findIndex((b) => b.id === branch);

// Eén knooppunt in een tak. `kolom` is hoe diep in de tak; de rij volgt uit de tak.
const k = (branch, kolom, id, name, icon, desc, note, effect) => ({
  id, branch, name, icon, desc, note, effect,
  cost: PRIJS[kolom],
  pos: [kolom, rij(branch)],
  needs: kolom === 0 ? [] : [`${id.replace(/\d+$/, "")}${kolom}`],
});

export const NODES = [
  // Studie
  k("studie", 0, "s1", "Inschrijving", "🖊️", "Je staat officieel ingeschreven.", "Alles produceert 5% meer.", { allMult: 1.05 }),
  k("studie", 1, "s2", "Vrijstelling", "📄", "Een vak dat je niet opnieuw hoeft te volgen.", "Begin elke run met 10.000 packets.", { startPackets: 1e4 }),
  k("studie", 2, "s3", "Studietoelage", "💶", "Er komt geld binnen dat je niet hoeft terug te betalen.", "Begin elke run met 5 miljoen packets.", { startPackets: 5e6 }),
  k("studie", 3, "s4", "Bindend advies", "📌", "Doorzetten was het juiste advies.", "Alles produceert 10% meer.", { allMult: 1.1 }),
  k("studie", 4, "s5", "Onderzoeksbeurs", "🔬", "Je onderzoek wordt betaald door iemand anders.", "Je krijgt 15% meer studiepunten bij het afstuderen.", { ectsGain: 1.15 }),
  k("studie", 5, "s6", "Emeritus", "🏛️", "Je hoeft niets meer, je mag alles nog.", "Nog eens 25% meer studiepunten en 15% meer productie.", { ectsGain: 1.25, allMult: 1.15 }),

  // Praktijk
  k("praktijk", 0, "p1", "Handigheid", "✋", "Je weet inmiddels waar je moet zijn.", "Klikkracht x2.", { clickMult: 2 }),
  k("praktijk", 1, "p2", "Spiergeheugen", "💪", "Je vinger denkt niet meer na.", "Klikkracht x2.", { clickMult: 2 }),
  k("praktijk", 2, "p3", "Labo-ervaring", "🧪", "Je hebt de opstelling al drie keer gedaan.", "Minigames leveren 25% meer op.", { minigameReward: 1.25 }),
  k("praktijk", 3, "p4", "Examentraining", "📝", "Oude examens zijn de beste voorbereiding.", "Minigames leveren nog eens 25% meer op.", { minigameReward: 1.25 }),
  k("praktijk", 4, "p5", "Meesterschap", "🥇", "Je klikt niet meer, je dirigeert.", "Elke klik levert er 2% van je productie per seconde bij.", { clickFromPps: 0.02 }),
  k("praktijk", 5, "p6", "Serge's zegen", "🙌", "Hij zegt niets. Hij knikt alleen.", "Alles produceert 25% meer.", { allMult: 1.25 }),

  // Geluk
  k("geluk", 0, "g1", "Voorgevoel", "🔮", "Je weet net iets eerder waar je moet kijken.", "Gouden packets verschijnen 15% vaker.", { goldenFreq: 1.15 }),
  k("geluk", 1, "g2", "Tweede kans", "⏱️", "Ze wachten iets langer op je.", "Gouden packets blijven 25% langer staan.", { goldenDuration: 1.25 }),
  k("geluk", 2, "g3", "Gouden uur", "🌅", "Alles valt even mee.", "Buffs werken 25% sterker.", { goldenPower: 1.25 }),
  k("geluk", 3, "g4", "Vaste hand", "🤝", "Wat je vasthebt laat je niet los.", "Buffs duren 25% langer.", { buffDuration: 1.25 }),
  k("geluk", 4, "g5", "Meervoudig", "🎲", "Twee dingen tegelijk is ook een ding.", "15% meer kans op een dubbele buff.", { goldenDouble: 0.15 }),
  k("geluk", 5, "g6", "Gouden regen", "🌧️", "Je begint met de wind mee.", "Elke run start met een gratis buff.", { startBuff: true }),

  // Beheer
  k("beheer", 0, "b1", "Nachtploeg", "🌜", "Iemand houdt 's nachts een oogje op de boel.", "Offline tijd telt tot 4 uur mee.", { offlineCap: 4 * 3600 }),
  k("beheer", 1, "b2", "Monitoring", "📟", "Grafieken die niemand bekijkt, tot het misgaat.", "Offline productie stijgt naar 60%.", { offlineRate: 0.6 }),
  k("beheer", 2, "b3", "Automatisering", "🤖", "Wat twee keer met de hand ging, gaat nu vanzelf.", "Offline tijd telt tot 8 uur mee.", { offlineCap: 8 * 3600 }),
  k("beheer", 3, "b4", "Draaiboek", "📘", "Elke storing heeft een pagina.", "Offline productie stijgt naar 80%.", { offlineRate: 0.8 }),
  k("beheer", 4, "b5", "Lights-out", "🔦", "Het datacenter heeft geen mens meer nodig. Ook geen licht.", "Offline tijd telt volledig mee, tot 24 uur.", { offlineCap: 24 * 3600, offlineRate: 1 }),
  k("beheer", 5, "b6", "Zelfherstel", "🩹", "Het netwerk repareert zichzelf voor jij het merkt.", "Incidenten lossen na 30 seconden vanzelf op.", { autoIncident: true }),

  // Netwerken
  k("netwerken", 0, "n1", "Kabeltester", "🔌", "Eindelijk weet je welke kabel waar naartoe gaat.", "Netwerkapparaten produceren 15% meer.", { vakMult: { vak: "netwerken", x: 1.15 } }),
  k("netwerken", 1, "n2", "Patchplan", "🗺️", "Elke poort een label, elk label klopt.", "Patchkabels en switches produceren de helft meer.", { buildingMult: [{ id: "patchkabel", x: 1.5 }, { id: "switch", x: 1.5 }] }),
  k("netwerken", 2, "n3", "Area 0", "🧭", "OSPF zonder een enkele fout in de configuratie.", "Netwerkapparaten produceren nog eens 15% meer.", { vakMult: { vak: "netwerken", x: 1.15 } }),
  k("netwerken", 3, "n4", "Glas tot in de klas", "🧵", "Elk lokaal een eigen vezel.", "Routers en glasvezel produceren de helft meer.", { buildingMult: [{ id: "router", x: 1.5 }, { id: "fiber", x: 1.5 }] }),
  k("netwerken", 4, "n5", "Tier 1-provider", "🌐", "Je betaalt niemand meer voor transit.", "Dark fiber, zeekabels en satellieten produceren de helft meer.", { buildingMult: [{ id: "darkfiber", x: 1.5 }, { id: "subsea", x: 1.5 }, { id: "satellite", x: 1.5 }] }),
  k("netwerken", 5, "n6", "Backbone", "🦴", "Alles loopt over jouw ruggengraat.", "Netwerkapparaten +30%, en alles 5% meer.", { vakMult: { vak: "netwerken", x: 1.3 }, allMult: 1.05 }),

  // Datacenter
  k("datacenter", 0, "d1", "Kabelgoot", "🗄️", "Geen kabel ligt nog op de vloer.", "Datacenterapparaten produceren 15% meer.", { vakMult: { vak: "sddc", x: 1.15 } }),
  k("datacenter", 1, "d2", "Koude gang", "❄️", "Warme lucht links, koude lucht rechts.", "Serverracks en datacenters produceren de helft meer.", { buildingMult: [{ id: "rack", x: 1.5 }, { id: "datacenter", x: 1.5 }] }),
  k("datacenter", 2, "d3", "Hyperconvergentie", "🧩", "Rekenkracht, opslag en netwerk in één doos.", "Datacenterapparaten produceren nog eens 15% meer.", { vakMult: { vak: "sddc", x: 1.15 } }),
  k("datacenter", 3, "d4", "Live migration", "🚚", "De server verhuist terwijl hij draait.", "Proxmox- en vSphere-clusters produceren de helft meer.", { buildingMult: [{ id: "proxmox", x: 1.5 }, { id: "vsphere", x: 1.5 }] }),
  k("datacenter", 4, "d5", "Software-defined", "🎛️", "Het netwerk is een stuk code geworden.", "SDN-controllers produceren dubbel zoveel.", { buildingMult: { id: "sdn", x: 2 } }),
  k("datacenter", 5, "d6", "Tier IV", "🏗️", "Alles dubbel, ook wat al dubbel was.", "Datacenterapparaten +30%, en alles 5% meer.", { vakMult: { vak: "sddc", x: 1.3 }, allMult: 1.05 }),

  // Cloud
  k("cloud", 0, "c1", "Eerste container", "📦", "Hij draait. Niemand weet waar precies.", "Cloudapparaten produceren 15% meer.", { vakMult: { vak: "cloud", x: 1.15 } }),
  k("cloud", 1, "c2", "Autoscaling", "📈", "Meer bezoekers, meer servers, vanzelf.", "Kubernetes en hyperscalers produceren de helft meer.", { buildingMult: [{ id: "k8s", x: 1.5 }, { id: "hyperscaler", x: 1.5 }] }),
  k("cloud", 2, "c3", "Multi-region", "🗾", "Als Frankfurt uitvalt, draait Dublin door.", "Cloudapparaten produceren nog eens 15% meer.", { vakMult: { vak: "cloud", x: 1.15 } }),
  k("cloud", 3, "c4", "Quantumsprong", "⚛️", "De bits zijn nul, één, en een beetje allebei.", "Quantum links en AI NetOps produceren de helft meer.", { buildingMult: [{ id: "quantum", x: 1.5 }, { id: "neural", x: 1.5 }] }),
  k("cloud", 4, "c5", "Megastructuur", "🌞", "Je bouwt om een ster heen. En daarna door een ander universum.", "Dyson-datacenters en Parallel VPN's produceren de helft meer.", { buildingMult: [{ id: "dyson", x: 1.5 }, { id: "multiverse", x: 1.5 }] }),
  k("cloud", 5, "c6", "Planetaire cloud", "🪐", "Latency tussen planeten wordt een probleem voor later.", "Cloudapparaten +30%, en alles 5% meer.", { vakMult: { vak: "cloud", x: 1.3 }, allMult: 1.05 }),

  // Security
  k("security", 0, "v1", "Wachtwoordbeleid", "🔑", "Minstens twaalf tekens, en niet Serge123.", "Securityapparaten produceren 15% meer.", { vakMult: { vak: "security", x: 1.15 } }),
  k("security", 1, "v2", "Honeypot", "🍯", "Een nepserver waar aanvallers in trappen.", "Active Directory en firewalls produceren de helft meer.", { buildingMult: [{ id: "ad", x: 1.5 }, { id: "firewall", x: 1.5 }] }),
  k("security", 2, "v3", "Segmentatie", "🧱", "Wie in het gastennetwerk zit, komt nergens anders.", "Securityapparaten produceren nog eens 15% meer.", { vakMult: { vak: "security", x: 1.15 } }),
  k("security", 3, "v4", "Threat intel", "🕵️", "Je weet welke aanval eraan komt voor hij er is.", "Het SOC produceert de helft meer; rode packets verliezen 60% van hun kracht.", { buildingMult: { id: "soc", x: 1.5 }, ddosResist: 0.6 }),
  k("security", 4, "v5", "Red team", "🎯", "Je laat je eigen netwerk aanvallen. Met toestemming.", "Securityapparaten produceren 30% meer.", { vakMult: { vak: "security", x: 1.3 } }),
  k("security", 5, "v6", "Zero-day-schild", "🛡️", "Ook wat nog niemand kent, houd je tegen.", "Rode packets verliezen 90% van hun kracht, en alles 5% meer.", { ddosResist: 0.9, allMult: 1.05 }),

  // Labo
  k("labo", 0, "l1", "Studiemaatje", "👯", "Samen gaat het sneller.", "Opdrachten in het labo komen 15% sneller.", { laboTempo: 0.85 }),
  k("labo", 1, "l2", "Spiekbriefje", "📃", "Alleen voor noodgevallen. Het is altijd een noodgeval.", "Minigames leveren 20% meer op.", { minigameReward: 1.2 }),
  k("labo", 2, "l3", "Werkplaats", "🛠️", "Een vaste tafel, en al het gereedschap binnen handbereik.", "Opdrachten in het labo komen nog eens 15% sneller.", { laboTempo: 0.85 }),
  k("labo", 3, "l4", "Beursvergunning", "📜", "Je mag officieel meer inzetten.", "Je mag op de markt twee keer zoveel inzetten per goed.", { marktLimiet: 2 }),
  k("labo", 4, "l5", "Labo-assistent", "🥼", "Iemand anders ruimt de kabels op.", "Minigames leveren 30% meer op.", { minigameReward: 1.3 }),
  k("labo", 5, "l6", "Onderzoeksgroep", "🧬", "Je labo heeft nu een eigen naam op de deur.", "Opdrachten 20% sneller, en alles 5% meer.", { laboTempo: 0.8, allMult: 1.05 }),

  // Economie
  k("economie", 0, "e1", "Schoolkorting", "🏷️", "Met je studentenkaart is alles goedkoper.", "Apparaten zijn 5% goedkoper.", { costMult: 0.95 }),
  k("economie", 1, "e2", "Tweedehands", "♻️", "Een goede gebruikte switch is ook een switch.", "Verkopen levert de helft van de prijs op in plaats van een kwart.", { sellRate: 0.5 }),
  k("economie", 2, "e3", "Grootinkoop", "🚚", "Honderd switches tegelijk, met korting.", "Apparaten zijn nog eens 8% goedkoper.", { costMult: 0.92 }),
  k("economie", 3, "e4", "Startkapitaal", "💼", "Je begint niet meer met lege handen.", "Begin elke run met 25 patchkabels, 15 switches en 10 routers.", { startBuildings: { patchkabel: 25, switch: 15, router: 10 } }),
  k("economie", 4, "e5", "Aanbesteding", "📑", "Drie offertes, en je kiest de goedkoopste.", "Apparaten zijn nog eens 10% goedkoper.", { costMult: 0.9 }),
  k("economie", 5, "e6", "Monopolie", "🎩", "Er is maar één leverancier. Dat ben jij.", "Begin elke run ook met 10 glasvezels en 5 serverracks, en alles 5% meer.", { startBuildings: { fiber: 10, rack: 5 }, allMult: 1.05 }),

  // Kruisknopen: elk vraagt het laatste knooppunt van twee naburige takken.
  { id: "x1", branch: "kruis", name: "Didactiek", icon: "🧑‍🏫", cost: 300, pos: [6, 0.5], needs: ["s6", "p6"], desc: "Je kunt het niet alleen, je kunt het ook uitleggen.", note: "Klikkracht x3, en 10% meer studiepunten.", effect: { clickMult: 3, ectsGain: 1.1 } },
  { id: "x2", branch: "kruis", name: "Gelukkige nachten", icon: "🌠", cost: 300, pos: [6, 2.5], needs: ["g6", "b6"], desc: "Terwijl jij slaapt, valt het goud van de hemel.", note: "Gouden packets 20% vaker, en offline tijd telt tot 48 uur mee.", effect: { goldenFreq: 1.2, offlineCap: 48 * 3600, offlineRate: 1 } },
  { id: "x3", branch: "kruis", name: "Netwerkarchitect", icon: "📐", cost: 300, pos: [6, 4.5], needs: ["n6", "d6"], desc: "Je tekent het netwerk, en daarna bestaat het.", note: "Synergieën tussen apparaten de helft sterker; netwerken en datacenter +20%.", effect: { synergyMult: 1.5, vakMult: [{ vak: "netwerken", x: 1.2 }, { vak: "sddc", x: 1.2 }] } },
  { id: "x4", branch: "kruis", name: "Zero trust", icon: "🔐", cost: 300, pos: [6, 6.5], needs: ["c6", "v6"], desc: "Niemand is te vertrouwen. Zelfs Serge niet.", note: "Cloud en security +20%, en rode packets doen niets meer.", effect: { vakMult: [{ vak: "cloud", x: 1.2 }, { vak: "security", x: 1.2 }], ddosResist: 1 } },
  { id: "x5", branch: "kruis", name: "Spin-off", icon: "🚀", cost: 300, pos: [6, 8.5], needs: ["l6", "e6"], desc: "Je labo wordt een bedrijf.", note: "Apparaten 10% goedkoper, en minigames leveren de helft meer op.", effect: { costMult: 0.9, minigameReward: 1.5 } },

  // Het doctoraat, helemaal rechts.
  { id: "dr", branch: "kruis", name: "Doctoraat", icon: "🎓", cost: 700, pos: [7, 4.5], needs: ["x1", "x2", "x3", "x4", "x5"], desc: "Dr. Serge. Hij stond erop dat je het zo zou noemen.", note: "Alles produceert 50% meer, en je krijgt 25% meer studiepunten.", effect: { allMult: 1.5, ectsGain: 1.25 } },
];

export const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

// Studiepunten volgen het aantal cijfers van je totaal, niet het totaal zelf:
//
//   punten = 0,3 x (cijfers - 9)^3,   met cijfers = log10(totaal verdiend)
//
// Tot versie 5 was het de derdemachtswortel van het totaal. Maar in dit spel
// levert elk volgend apparaat zo'n zeven keer meer op dan het vorige, dus een
// stap verder in de winkel verdubbelde je punten, en de bonus uit die punten
// bracht je bij de volgende run weer een stap verder. Na vijf keer afstuderen
// verdubbelden de punten elk kwartier, tot honderden miljoenen. Nu krijg je
// voor elk extra cijfer iets meer punten dan voor het vorige, en kom je rond
// de 3.000 uit als je alles gebouwd hebt: net genoeg voor de hele studieboom.
// Nareken met `npm run balans`.
const PUNTEN_FACTOR = 0.3;
const PUNTEN_MACHT = 3;
const PUNTEN_START = 9;

export function ectsFor(lifetime, gainMult = 1) {
  const cijfers = Math.log10(Math.max(1, lifetime));
  if (cijfers <= PUNTEN_START) return 0;
  // Een piepkleine relatieve marge, anders geeft precies de drempel soms
  // 0,9999999 punt door afronding.
  return Math.floor(PUNTEN_FACTOR * Math.pow(cijfers - PUNTEN_START, PUNTEN_MACHT) * gainMult * (1 + 1e-12));
}

// Hoeveel je in totaal nodig hebt voor `n` studiepunten.
export function lifetimeForEcts(n, gainMult = 1) {
  return Math.pow(10, PUNTEN_START + Math.pow(n / gainMult / PUNTEN_FACTOR, 1 / PUNTEN_MACHT));
}

// Het eerste studiepunt komt rond 31 miljard. Het tabblad Studie gaat al
// eerder open, zodat je ziet waar je naartoe werkt.
export const ECTS_BASIS = lifetimeForEcts(1);
export const STUDIE_OPEN = 3e9;

// Elk studiepunt dat je ooit kreeg, geeft blijvend 10% extra productie, ook
// als je het alweer hebt uitgegeven.
export const BONUS_PER_PUNT = 0.1;
