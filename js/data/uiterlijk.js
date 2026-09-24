// Uiterlijk: losse keuzes die je vrij combineert.
//
//   portret      welke foto en welke bewerking erop
//   accessoire   iets op zijn hoofd of om zijn nek, bij elk portret
//   ring         de rand om de foto
//   houding      hoe Serge beweegt als je niet klikt
//   maatje       een figuurtje naast Serge dat af en toe iets zegt
//   achtergrond  de kleuren van de pagina
//   paneel       hoe de drie grote panelen eruitzien
//   accent       de kleur van knoppen, tabs en balken
//   weer         wat er over de achtergrond valt of zweeft
//   filter       een laag over het hele scherm
//   packet       hoe gouden packets eruitzien
//   opstart      wat je ziet als je het spel opent
//   logo         hoe de naam van het spel bovenaan eruitziet
//   titel        een titel onder de naam van het spel
//   teller       hoe het grote getal met je packets eruitziet
//   lettertype   de letter van het hele spel
//   zweeftekst   het getal dat opstijgt als je klikt
//   melding      hoe de meldingen linksonder eruitzien
//   klik         wat er wegspat als je op Serge klikt
//   combo        hoe een reeks snelle kliks in beeld komt
//   cursor       de muisaanwijzer (alleen met een muis)
//   spoor        een spoor achter je muis (alleen met een muis)
//   geluid       hoe een klik klinkt (als het geluid aanstaat)
//   muziek       een muziekje op de achtergrond (als het geluid aanstaat)
//
// Elk ding heeft een zeldzaamheid (`rang`), van gewoon tot goddelijk. Hoe
// zeldzamer, hoe moeilijker vrij te spelen, en hoe mooier het in het menu staat.
//
// eis   krijgt de spelstaat en geeft terug of het ding ontgrendeld is
// hoe   de tekst die je ziet zolang het op slot zit
//
// Wat je ontgrendelt blijft voor altijd, ook na afstuderen.

export const RANGEN = {
  gewoon: { naam: "Gewoon", verbogen: "gewone", onverbogen: "gewoon" },
  ongewoon: { naam: "Ongewoon", verbogen: "ongewone", onverbogen: "ongewoon" },
  zeldzaam: { naam: "Zeldzaam", verbogen: "zeldzame", onverbogen: "zeldzaam" },
  episch: { naam: "Episch", verbogen: "epische", onverbogen: "episch" },
  legendarisch: { naam: "Legendarisch", verbogen: "legendarische", onverbogen: "legendarisch" },
  mythisch: { naam: "Mythisch", verbogen: "mythische", onverbogen: "mythisch" },
  goddelijk: { naam: "Goddelijk", verbogen: "goddelijke", onverbogen: "goddelijk" },
};
export const RANG_VOLGORDE = Object.keys(RANGEN);

const heeft = (id) => (g) => !!g.achievements[id];
const maand = () => new Date().getMonth() + 1;
const dag = () => new Date().getDate();
const d = (rang, id, naam, beschrijving, hoe, eis, extra = {}) => ({ rang, id, naam, beschrijving, hoe, eis, ...extra });
const standaard = (id, naam, beschrijving, extra = {}) => ({ rang: "gewoon", id, naam, beschrijving, hoe: null, eis: () => true, ...extra });

export const PORTRETTEN = [
  standaard("serge", "Serge", "De foto zoals hij hoort."),
  d("ongewoon", "archief", "Archief", "Alsof hij al jaren aan de muur hangt.", "Koop 25 upgrades", (g) => g.stats.upgrades >= 25),
  d("zeldzaam", "blauwdruk", "Blauwdruk", "Serge als netwerktekening.", "Bezit 250 apparaten tegelijk", (g) => g.totalBuildings >= 250),
  d("zeldzaam", "neon", "Neon", "Alle kleuren een slag harder.", "Klik 50 gouden packets", (g) => g.stats.goldenClicks >= 50),
  d("zeldzaam", "nacht", "Nachtdienst", "Het serverlokaal om drie uur 's nachts.", "Speel tussen drie en vier uur 's nachts", heeft("egg-nacht")),
  d("zeldzaam", "poster", "Poster", "Harde kleuren, zoals aan de muur van het lokaal.", "Koop 75 upgrades", (g) => g.stats.upgrades >= 75),
  d("zeldzaam", "pixel", "8-bit", "Serge zoals hij in 1989 op een spelcomputer had gestaan.", "Heb precies 1337 packets", heeft("egg-1337")),
  d("zeldzaam", "schets", "Schets", "In potlood getekend, in de kantlijn van een cursus.", "Lees de hele cursus", heeft("cursus-alles")),
  d("episch", "matrix", "Matrix", "Serge, gerenderd in groene regen.", "Bereik een miljoen packets per seconde", (g) => g.pps >= 1e6),
  d("episch", "roentgen", "Röntgen", "Alles omgekeerd. Kijk er niet te lang naar.", "Klik honderdduizend keer", heeft("klik-100k")),
  d("episch", "storing", "Storing", "Het beeld hapert, rood en blauw schuiven uit elkaar.", "Negeer vijftig rode packets", (g) => g.stats.ddosIgnored >= 50),
  d("episch", "warmte", "Warmtebeeld", "Door de camera van de brandweer: Serge draait warm.", "Speel in totaal tien uur", (g) => g.stats.playTime >= 10 * 3600),
  d("episch", "popart", "Pop-art", "Vier kleuren, geen nuance. Hangt in een museum in New York.", "Verdien een fortuin op de markt in één sessie", heeft("beurs-fortuin")),
  d("episch", "festival", "Festival", "Roze en paars, zoals de affiche van een zomerfestival.", "Vijfentwintig goede antwoorden op rij bij de overhoring", heeft("quiz-25")),
  d("episch", "disco", "Discobal", "Vrijdagmiddag in het serverlokaal. Alle kleuren draaien.", "Haal 75 prestaties", (g) => g.stats.achievements >= 75),
  d("episch", "evolved", "Geëvolueerd", "De vorm die Serge aanneemt voorbij een miljard packets.", "Verdien in totaal een miljard packets", (g) => g.stats.lifetime >= 1e9, {
    feest: {
      titel: "Serge is geëvolueerd",
      tekst: "Een miljard packets door zijn netwerk. Er is iets met hem gebeurd — je vindt hem onder het tandwiel, bij Uiterlijk.",
    },
  }),
  d("legendarisch", "goudbeeld", "Gouden beeld", "In brons gegoten, en dan verguld. Er trekt een glans overheen.", "Klik duizend gouden packets", (g) => g.stats.goldenClicks >= 1000),
  d("legendarisch", "hologram", "Hologram", "Serge, geprojecteerd vanuit het datacenter. Met scanlijnen.", "Bereik een miljard packets per seconde", (g) => g.pps >= 1e9),
  d("legendarisch", "radioactief", "Radioactief", "Hij heeft te lang naast de DWDM-laser gestaan. Hij gloeit.", "Koop een Quantum Link", (g) => (g.buildings.quantum || 0) >= 1),
  d("mythisch", "spook", "Spook in de machine", "Half doorzichtig, en af en toe even weg. Er zit iemand in de server.", "Speel in totaal vijftig uur", (g) => g.stats.playTime >= 50 * 3600),
  d("goddelijk", "kosmisch", "Kosmische Serge", "Serge is één met het universum. De sterren draaien om hem heen.", "Haal elke prestatie", (g) => g.stats.achievements >= g.totaalPrestaties),
];

// Iets op zijn hoofd of om zijn nek. Het ligt als een laag over de foto,
// dus het past bij elk portret. `voorbeeld` is wat er getekend wordt.
export const ACCESSOIRES = [
  standaard("geen", "Niets", "Niets op zijn hoofd.", { voorbeeld: "" }),
  d("gewoon", "pet", "Pet", "Voor de stoere netwerkbeheerder die ook buiten komt.", "Koop je eerste upgrade", heeft("up-1"), { voorbeeld: "🧢" }),
  d("ongewoon", "koptelefoon", "Koptelefoon", "Ruisonderdrukking tegen de ventilatoren van de servers.", "Klik vijfhonderd keer", (g) => g.stats.clicks >= 500, { voorbeeld: "🎧" }),
  d("ongewoon", "strik", "Strikje", "Voor de opendeurdag. Serge wil er netjes bij lopen.", "Haal 50 prestaties", (g) => g.stats.achievements >= 50, { voorbeeld: "🎀" }),
  d("zeldzaam", "baret", "Baret", "Met kwastje. De ouders zijn trots.", "Studeer één keer af", (g) => g.prestige >= 1, { voorbeeld: "🎓" }),
  d("zeldzaam", "helm", "Helm", "Voor als het plafond vol kabels naar beneden komt.", "Los een incident op voor het uit de hand loopt", heeft("incident-fix"), { voorbeeld: "⛑️" }),
  d("zeldzaam", "hogehoed", "Hoge hoed", "Ook in de serverruimte blijft hij een heer.", "Koop honderd upgrades", (g) => g.stats.upgrades >= 100, { voorbeeld: "🎩" }),
  d("zeldzaam", "regenwolk", "Regenwolkje", "Maandagochtend, en de printer doet het weer niet.", "Negeer tien rode packets", (g) => g.stats.ddosIgnored >= 10, { voorbeeld: "🌧️" }),
  d("episch", "antenne", "Schotelantenne", "Serge vangt het signaal op. Het signaal is Serge.", "Koop een satellietconstellatie", (g) => (g.buildings.satellite || 0) >= 1, { voorbeeld: "📡" }),
  d("episch", "lampje", "Lampje", "Er gaat een lampje branden. Af en toe.", "Lees de hele cursus", heeft("cursus-alles"), { voorbeeld: "💡" }),
  d("legendarisch", "kroon", "Kroon", "Een kroon die fonkelt. Het netwerk is zijn koninkrijk.", "Koop een singulariteit", (g) => (g.buildings.singularity || 0) >= 1, { voorbeeld: "👑" }),
  d("ongewoon", "feesthoed", "Feesthoedje", "Met een pompon. Er is altijd wel iemand in de klas jarig.", "Haal 20 prestaties", (g) => g.stats.achievements >= 20, { voorbeeld: "🎉" }),
  d("zeldzaam", "kattenoren", "Kattenoren", "Ze bewegen als er een packet binnenkomt. Serge ontkent alles.", "Heb precies 42 exemplaren van één apparaat", heeft("egg-42"), { voorbeeld: "🐱" }),
  d("zeldzaam", "propeller", "Propellerpet", "Voor wie overhoringen niet spannend genoeg vindt. Hij draait sneller als Serge nadenkt.", "Beantwoord vijftig vragen goed bij de overhoring", (g) => g.quizGoed >= 50, { voorbeeld: "🧢" }),
  d("zeldzaam", "ninja", "Ninjaband", "Hij komt, hij patcht, hij is weg. Niemand heeft hem gezien.", "Typ een commando dat begint met sudo in de terminal", heeft("egg-sudo"), { voorbeeld: "🥷" }),
  d("zeldzaam", "kerstmuts", "Kerstmuts", "Ho ho ho. De switch ligt plat, maar het is gezellig.", "Speel in december", () => maand() === 12, { voorbeeld: "🎅" }),
  d("zeldzaam", "heksenhoed", "Heksenhoed", "In oktober configureert Serge alleen nog met toverspreuken.", "Speel in oktober", () => maand() === 10, { voorbeeld: "🧙" }),
  d("episch", "vogeltje", "Vogeltje", "Hij bewoog tien minuten niet, en toen kwam er een vogeltje op zijn hoofd zitten. Het blijft.", "Laat het spel tien minuten met rust", heeft("egg-geduld"), { voorbeeld: "🐤" }),
  d("episch", "wifi", "Wifi-signaal", "Drie streepjes boven zijn hoofd. Vol bereik, tot in de kelder.", "Rond 25 opdrachten af in de terminal", (g) => g.opdrachten >= 25, { voorbeeld: "📶" }),
  d("episch", "duizelig", "Duizelig", "Sterretjes die rond zijn hoofd draaien. Er is te veel geklikt.", "Klik vijftigduizend keer", (g) => g.stats.clicks >= 50000, { voorbeeld: "💫" }),
  d("episch", "hoorns", "Duivelshoorns", "Voor wie rode packets laat liggen. Serge weet het. Serge ziet alles.", "Negeer vijftig rode packets", (g) => g.stats.ddosIgnored >= 50, { voorbeeld: "😈" }),
  d("legendarisch", "ruimtehelm", "Ruimtehelm", "Een glazen bol om zijn hoofd, voor het onderhoud aan de satellieten.", "Bezit 50 satellietconstellaties", (g) => (g.buildings.satellite || 0) >= 50, { voorbeeld: "🧑‍🚀" }),
  d("legendarisch", "eenhoorn", "Eenhoornhoorn", "Een eenhoorn is een start-up van een miljard. Serge is er een van een triljoen.", "Verdien in totaal een triljoen packets", heeft("totaal-5"), { voorbeeld: "🦄" }),
  d("mythisch", "vlammen", "Vlammenkroon", "Zijn hoofd staat in brand en hij heeft het niet eens door. Zo hard werkt hij.", "Bereik een biljard packets per seconde", heeft("pps-5"), { voorbeeld: "🔥" }),
  d("mythisch", "aureool", "Aureool", "Een gouden ring boven zijn hoofd. Serge is heilig verklaard.", "Koop elk knooppunt in de studieboom", heeft("prestige-boom"), { voorbeeld: "" }),
  d("goddelijk", "planeten", "Planetenbaan", "Drie planeten draaien rond zijn hoofd. Zo belangrijk is hij inmiddels.", "Haal elke prestatie", (g) => g.stats.achievements >= g.totaalPrestaties, { voorbeeld: "🪐" }),
];

export const RINGEN = [
  standaard("blauw", "Blauw", "De vertrouwde rand."),
  d("ongewoon", "goud", "Goud", "Voor de gouden-packetjager.", "Klik 25 gouden packets", (g) => g.stats.goldenClicks >= 25),
  d("ongewoon", "cyaan", "Cyaan", "De kleur van een werkende poort.", "Zet een interface volledig goed op in de terminal", heeft("cli-config")),
  d("ongewoon", "groen", "Groen", "Uit de patchkast.", "Ontdek je eerste protocol", heeft("patch-protocol")),
  d("ongewoon", "indigo", "Indigo", "Voor wie het netwerk 's nachts laat doordraaien.", "Kom terug na een uur weg te zijn geweest", heeft("offline")),
  d("ongewoon", "rood", "Alarmrood", "Voor wie rode packets links laat liggen.", "Negeer tien rode packets", (g) => g.stats.ddosIgnored >= 10),
  d("zeldzaam", "roze", "Roze", "Omdat het kan.", "Haal 40 prestaties", (g) => g.stats.achievements >= 40),
  d("zeldzaam", "wit", "Wit", "Rustig, strak, klaar.", "Bezit 500 apparaten tegelijk", (g) => g.totalBuildings >= 500),
  d("zeldzaam", "matrix", "Terminalgroen", "De kleur van een console die het doet.", "Typ de Konami-code", heeft("egg-konami")),
  d("zeldzaam", "koper", "Koper", "Warm en ouderwets, net als UTP.", "Klik 200 gouden packets", (g) => g.stats.goldenClicks >= 200),
  d("zeldzaam", "radar", "Radar", "Een straal die rondzwaait op zoek naar packets.", "Typ ping in de terminal", heeft("egg-ping")),
  d("zeldzaam", "ijs", "IJs", "Bevroren, met rijp op de rand.", "Laat het spel tien minuten met rust", heeft("egg-geduld")),
  d("zeldzaam", "hartslag", "Hartslag", "Klopt twee keer, rust, klopt twee keer. Het netwerk leeft.", "Los een incident op voor het uit de hand loopt", heeft("incident-fix")),
  d("episch", "zwart", "Mat zwart", "Zoals elk rack in elk datacenter.", "Bezit 1.000 apparaten tegelijk", (g) => g.totalBuildings >= 1000),
  d("episch", "regenboog", "Regenboog", "Een ring die alle kleuren doorloopt.", "Studeer één keer af", (g) => g.prestige >= 1),
  d("episch", "t568b", "T568B", "De acht aders van een netwerkkabel, in de juiste volgorde.", "Lever 25 werkorders op in de patchkast", (g) => g.werkorders >= 25),
  d("episch", "pulsar", "Pulsar", "Golven licht die telkens van de foto wegrollen.", "Bereik tien miljoen packets per seconde", (g) => g.pps >= 1e7),
  d("episch", "hoogspanning", "Hoogspanning", "Vonken die rond de rand flitsen. Niet aanraken.", "Bezit 50 datacenters tegelijk", (g) => (g.buildings.datacenter || 0) >= 50),
  d("episch", "satelliet", "Satelliet", "Een klein lichtje in een baan om Serge.", "Koop een satellietconstellatie", (g) => (g.buildings.satellite || 0) >= 1),
  d("legendarisch", "lichtpuls", "Lichtpuls", "Pulsen licht die rondjes draaien, zoals in een glasvezelring.", "Ontdek alle protocollen in de patchkast", heeft("patch-alles")),
  d("legendarisch", "diamant", "Diamant", "Harde facetten die het licht breken.", "Haal 110 prestaties", (g) => g.stats.achievements >= 110),
  d("legendarisch", "vuur", "Vuurring", "Een datacenter zonder koeling.", "Bezit 2.000 apparaten tegelijk", (g) => g.totalBuildings >= 2000),
  d("mythisch", "plasma", "Plasma", "Een gloeiende ring die nooit stilstaat.", "Verzamel 50 studiepunten", (g) => g.prestige >= 50),
  d("mythisch", "melkweg", "Melkweg", "Een draaiend sterrenstelsel, met Serge in het midden.", "Studeer 25 keer af", (g) => g.stats.prestiges >= 25),
  d("goddelijk", "zonnekroon", "Zonnekroon", "Stralen van licht die langzaam om hem heen draaien.", "Koop de hele studieboom en vind alles wat verborgen is", (g) => !!g.achievements["prestige-boom"] && !!g.achievements["egg-alles"]),
];

export const ACHTERGRONDEN = [
  standaard("klas", "Klaslokaal", "Het vertrouwde blauw."),
  d("gewoon", "mint", "Mint", "Koel en fris, als een goed gekoelde gang.", "Verdien in totaal een miljoen packets", (g) => g.stats.lifetime >= 1e6),
  d("ongewoon", "zonsopgang", "Vroege dienst", "Geel en roze, van voor de koffie.", "Klik tienduizend keer", heeft("klik-10k")),
  d("ongewoon", "koper", "Koper", "Warm, ouderwets en betrouwbaar.", "Koop 50 upgrades", (g) => g.stats.upgrades >= 50),
  d("ongewoon", "zonsondergang", "Zonsondergang", "Roze tot paars, na een goede handelsdag.", "Maak winst op de bandbreedtemarkt", heeft("beurs-winst")),
  d("zeldzaam", "serverlokaal", "Serverlokaal", "Donker, koel en groen verlicht.", "Tien goede antwoorden op rij bij de overhoring", heeft("quiz-10")),
  d("zeldzaam", "patchkast", "Patchkast", "Het groen van een volle kabelgoot.", "Ontdek vier protocollen", (g) => g.protocollen >= 4),
  d("zeldzaam", "matrix", "Matrix", "Digitale regen, zwart met groen. Je weet waarom.", "Voer rm -rf / uit in de terminal", heeft("egg-rm")),
  d("zeldzaam", "blokjes", "Blokjes", "Vallende blokken die netjes op elkaar landen. Eén rij vol, en weg is hij.", "Typ de Konami-code", heeft("egg-konami")),
  d("episch", "staal", "Staal", "Grijs op grijs, zoals het rack zelf.", "Haal 100 prestaties", (g) => g.stats.achievements >= 100),
  d("episch", "oceaan", "Oceaan", "Diep water, met een kabel erdoorheen.", "Koop je eerste zeekabel", (g) => (g.buildings.subsea || 0) >= 1),
  d("episch", "nevel", "Nevel", "Paars en stil, ergens ver weg.", "Verzamel 25 studiepunten", (g) => g.prestige >= 25),
  d("episch", "regenboog", "Regenboog", "Alles tegelijk. Niet subtiel, wel verdiend.", "Studeer één keer af", (g) => g.prestige >= 1),
  d("episch", "glasvezel", "Glasvezel", "Lichtpulsen die door donkere vezels schieten.", "Bezit 200 glasvezels tegelijk", (g) => (g.buildings.fiber || 0) >= 200),
  d("episch", "synthwave", "Synthwave", "Een neonraster dat naar de zon rijdt. Het is altijd 1986.", "Vind tien verborgen dingen", (g) => g.stats.eggs >= 10),
  d("episch", "lavalamp", "Lavalamp", "Grote warme bellen die traag stijgen en zakken.", "Speel in totaal 24 uur", (g) => g.stats.playTime >= 24 * 3600),
  d("episch", "aquarium", "Aquarium", "Vissen die rustig langs zwemmen. Iemand moet ze voeren.", "Bezit 25 zeekabels tegelijk", (g) => (g.buildings.subsea || 0) >= 25),
  d("legendarisch", "diepteruimte", "Diepe ruimte", "Voorbij de laatste satelliet.", "Koop je eerste singulariteit", (g) => (g.buildings.singularity || 0) >= 1),
  d("legendarisch", "noorderlicht", "Noorderlicht", "Groen en violet licht dat traag over de hemel golft.", "Lever twintig werkorders luchtdicht op", (g) => g.luchtdicht >= 20),
  d("legendarisch", "datacenter", "Datacenter", "Een koude gang tussen de racks, vol knipperende lampjes.", "Bezit 100 serverracks tegelijk", (g) => (g.buildings.rack || 0) >= 100),
  d("legendarisch", "zeebodem", "Zeebodem", "Een zeekabel op de bodem, met licht dat erdoor pulst en bellen die opstijgen.", "Bezit 50 zeekabels tegelijk", (g) => (g.buildings.subsea || 0) >= 50),
  d("legendarisch", "netwerk", "Netwerkkaart", "Een levend netwerk: knooppunten, lijnen en packets die erover reizen.", "Studeer vijf keer af", (g) => g.stats.prestiges >= 5),
  d("legendarisch", "meteoren", "Meteorenregen", "Een sterrenhemel waar telkens een vallende ster doorheen schiet.", "Bezit 100 satellietconstellaties tegelijk", (g) => (g.buildings.satellite || 0) >= 100),
  d("mythisch", "warp", "Warpsprong", "Sterren die langs je heen schieten. Volle kracht vooruit.", "Koop een Parallel VPN", (g) => (g.buildings.multiverse || 0) >= 1),
  d("mythisch", "vuurwerk", "Vuurwerk", "Pijlen die opstijgen en openbarsten in alle kleuren.", "Speel op oudejaarsavond of nieuwjaarsdag, of studeer vijftien keer af", (g) => (maand() === 12 && dag() === 31) || (maand() === 1 && dag() === 1) || g.stats.prestiges >= 15),
  d("goddelijk", "heelal", "Heelal", "Een spiraalstelsel dat langzaam om zijn kern draait.", "Bezit honderd singulariteiten tegelijk", (g) => (g.buildings.singularity || 0) >= 100),
];

// De drie grote panelen. `kleuren` is alleen voor het voorbeeldje in het
// menu: de achtergrond, een regel tekst en een accent.
export const PANELEN = [
  standaard("wit", "Wit", "Licht en rustig, met een vleugje van je achtergrond bovenaan.", { kleuren: ["linear-gradient(#e4f3ff, #ffffff)", "#10233c", "#2563eb"] }),
  d("gewoon", "ruitjes", "Ruitjespapier", "Een schrift uit de klas, met een rode kantlijn.", "Lees een hoofdstuk van de cursus", heeft("cursus-1"), { kleuren: ["repeating-linear-gradient(#fdfdf8 0 6px, #dbe7fb 6px 7px)", "#1e2a4a", "#dc2626"] }),
  d("ongewoon", "glas", "Matglas", "Doorschijnend, zodat je achtergrond overal doorheen schemert.", "Verdien in totaal tien miljoen packets", (g) => g.stats.lifetime >= 1e7, { kleuren: ["linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(186, 230, 253, 0.6))", "#10233c", "#2563eb"] }),
  d("ongewoon", "nacht", "Nachtdienst", "Donkerblauw, voor wie tot laat in het serverlokaal zit.", "Speel in totaal vijf uur", (g) => g.stats.playTime >= 5 * 3600, { kleuren: ["#111f36", "#e7eefa", "#9cc6ff"] }),
  d("ongewoon", "kurk", "Prikbord", "Kurk met punaises, zoals het bord in de leraarskamer.", "Haal 25 prestaties", (g) => g.stats.achievements >= 25, { kleuren: ["radial-gradient(circle at 30% 30%, #d9a86c, #b98446)", "#2b1a08", "#dc2626"] }),
  d("zeldzaam", "krijtbord", "Krijtbord", "Het groene bord van het lokaal, in een houten lijst.", "Tien goede antwoorden op rij bij de overhoring", heeft("quiz-10"), { kleuren: ["#23402f", "#f1f5ef", "#fde68a"] }),
  d("zeldzaam", "blauwdruk", "Blauwdruk", "Het netwerk als bouwtekening, met ruitjes en witte lijnen.", "Bezit vijfhonderd apparaten tegelijk", (g) => g.totalBuildings >= 500, { kleuren: ["#0b3d6e", "#f0f7ff", "#ffffff"] }),
  d("zeldzaam", "retro", "Windows 95", "Grijze vensters met een blauwe titelbalk. Klik op Start.", "Rechtsklik tien keer op Serge", heeft("egg-rechts"), { kleuren: ["#c3c3c3", "#000000", "#000080"] }),
  d("zeldzaam", "crt", "Beeldbuis", "Groen fosfor op zwart, met scanlijnen die langzaam zakken.", "Typ cisco in de terminal", heeft("egg-cisco"), { kleuren: ["#031a0b", "#86efac", "#4ade80"] }),
  d("episch", "neon", "Neon", "Zwart met een gloeiende rand, zoals een gamingkast.", "Klik vijfhonderd gouden packets", (g) => g.stats.goldenClicks >= 500, { kleuren: ["#0b0b16", "#f5f3ff", "#67e8f9"] }),
  d("episch", "regenboog", "Regenboogrand", "Een rand die rustig alle kleuren doorloopt.", "Studeer drie keer af", (g) => g.stats.prestiges >= 3, { kleuren: ["conic-gradient(#f472b6, #facc15, #4ade80, #38bdf8, #a78bfa, #f472b6)", "#ffffff", "#10233c"] }),
  d("episch", "magma", "Magma", "Donkerrood, met een rand die gloeit als lava.", "Negeer honderd rode packets", (g) => g.stats.ddosIgnored >= 100, { kleuren: ["radial-gradient(circle at 50% 100%, #7f1d1d, #1c0a06)", "#fde2d2", "#fb923c"] }),
  d("episch", "ijspaleis", "IJspaleis", "Bevroren glas met glinsters die even oplichten.", "Speel in totaal 48 uur", (g) => g.stats.playTime >= 48 * 3600, { kleuren: ["linear-gradient(135deg, #e0f2fe, #bae6fd)", "#0c3452", "#0284c7"] }),
  d("legendarisch", "goud", "Gouden kluis", "Zwart en goud, voor wie het allemaal al gezien heeft.", "Studeer tien keer af", (g) => g.stats.prestiges >= 10, { kleuren: ["radial-gradient(circle at 50% 0%, #3a2c0c, #120e06)", "#fbf3dc", "#fcd34d"] }),
  d("legendarisch", "aurora", "Aurora", "Noorderlicht dat traag achter de tekst langs golft.", "Lever 45 werkorders op in de patchkast", (g) => g.werkorders >= 45, { kleuren: ["linear-gradient(135deg, #062a2e, #1b1446)", "#effff9", "#5eead4"] }),
  d("legendarisch", "hologram", "Hologram", "Doorschijnend cyaan, met scanlijnen en af en toe een hapering.", "Bereik een biljoen packets per seconde", (g) => g.pps >= 1e12, { kleuren: ["linear-gradient(135deg, rgba(8, 47, 73, 0.95), rgba(14, 116, 144, 0.9))", "#e0fbff", "#67e8f9"] }),
  d("mythisch", "sterren", "Sterrennacht", "Een diepblauwe hemel vol sterren die zachtjes twinkelen.", "Studeer twintig keer af", (g) => g.stats.prestiges >= 20, { kleuren: ["radial-gradient(circle at 70% 20%, #1e2a5e, #070a1f)", "#f1f5ff", "#c7d2fe"] }),
  d("goddelijk", "hemelpoort", "Hemelpoort", "Wit en goud, met licht dat er traag doorheen trekt.", "Speel in totaal 200 uur", (g) => g.stats.playTime >= 200 * 3600, { kleuren: ["radial-gradient(circle at 50% 0%, #fffbeb, #fde68a)", "#3b2600", "#d97706"] }),
];

// Een laag over het hele scherm, boven alles behalve de meldingen.
export const FILTERS = [
  standaard("geen", "Geen filter", "Het beeld zoals het is.", { voorbeeld: "○" }),
  d("ongewoon", "vignet", "Vignet", "Donkere randen, zodat alle aandacht naar het midden gaat.", "Speel in totaal een uur", (g) => g.stats.playTime >= 3600, { voorbeeld: "◉" }),
  d("ongewoon", "avond", "Avondlicht", "Een warme gloed, beter voor je ogen als het laat wordt.", "Speel 's avonds na negen uur", () => new Date().getHours() >= 21, { voorbeeld: "🌇" }),
  d("zeldzaam", "sepia", "Oude foto", "Alles in sepia, alsof het spel al jaren in een album zit.", "Koop 25 upgrades", (g) => g.stats.upgrades >= 25, { voorbeeld: "📷" }),
  d("zeldzaam", "scanlijnen", "Beeldbuis", "Fijne lijnen over alles, zoals op een oude monitor.", "Vind drie verborgen dingen", (g) => g.stats.eggs >= 3, { voorbeeld: "📺" }),
  d("zeldzaam", "korrel", "Filmkorrel", "Alsof het hele spel op 16 millimeter is gedraaid.", "Haal 45 prestaties", (g) => g.stats.achievements >= 45, { voorbeeld: "🎞️" }),
  d("episch", "vhs", "Videoband", "Een oude VHS-band, met een storingsbalk die door het beeld rolt.", "Speel in totaal zes uur", (g) => g.stats.playTime >= 6 * 3600, { voorbeeld: "📼" }),
  d("episch", "nachtkijker", "Nachtkijker", "Alles groen, zoals in een spionagefilm.", "Speel tussen drie en vier uur 's nachts", heeft("egg-nacht"), { voorbeeld: "🥽" }),
  d("legendarisch", "gameboy", "Zakcomputer", "Vier tinten groen en een raster van pixels, zoals een spelcomputer uit 1989.", "Vind twaalf verborgen dingen", (g) => g.stats.eggs >= 12, { voorbeeld: "🎮" }),
  d("mythisch", "onderwater", "Onderwater", "Lichtvlekken die over alles heen dansen, alsof het rack in zee ligt.", "Bezit 100 zeekabels tegelijk", (g) => (g.buildings.subsea || 0) >= 100, { voorbeeld: "🌊" }),
  d("goddelijk", "folie", "Hologramfolie", "Een glanzende folie over het hele scherm, zoals op een zeldzame ruilkaart.", "Studeer dertig keer af", (g) => g.stats.prestiges >= 30, { voorbeeld: "💿" }),
];

// De naam van het spel bovenaan. Sommige logo's schrijven de naam anders;
// `tekst` is dan wat er komt te staan, in twee delen.
export const LOGOS = [
  standaard("standaard", "Serge Clicker", "Het logo zoals het hoort."),
  d("gewoon", "kapitalen", "Kapitalen", "In hoofdletters. Serge roept.", "Klik duizend keer", (g) => g.stats.clicks >= 1000, { tekst: ["SERGE", "CLICKER"] }),
  d("ongewoon", "handtekening", "Handtekening", "Met de hand gezet, zoals onder een rapport.", "Koop tien upgrades", (g) => g.stats.upgrades >= 10),
  d("ongewoon", "terminal", "Prompt", "De prompt van een switch die klaar is voor je commando.", "Voer je eerste commando uit in de terminal", heeft("cli-1"), { tekst: ["serge", "@clicker:~$"] }),
  d("ongewoon", "enterprise", "Enterprise", "Nu met licentiekosten per packet.", "Maak winst op de bandbreedtemarkt", heeft("beurs-winst"), { tekst: ["Serge™", "Clicker Enterprise"] }),
  d("zeldzaam", "exe", "Serge.exe", "Serge.exe reageert niet meer. Wil je wachten?", "Rechtsklik tien keer op Serge", heeft("egg-rechts"), { tekst: ["Serge", ".exe"] }),
  d("zeldzaam", "leet", "L33t", "Voor wie elite is. Of denkt dat te zijn.", "Heb precies 1337 packets", heeft("egg-1337"), { tekst: ["S3RG3", "CL1CK3R"] }),
  d("zeldzaam", "japans", "Tokio", "Serge heeft fans in Japan. Veel fans.", "Tien goede antwoorden op rij bij de overhoring", heeft("quiz-10"), { tekst: ["セルジュ", "クリッカー"] }),
  d("zeldzaam", "romeins", "Latijn", "Ave Sergius. Wie gaan klikken, groeten u.", "Studeer één keer af", (g) => g.prestige >= 1, { tekst: ["SERGIVS", "CLICCATOR"] }),
  d("episch", "golf", "Stadiongolf", "Elke letter springt op zijn beurt op, zoals een wave in een stadion.", "Klik tienduizend keer", heeft("klik-10k")),
  d("episch", "neon", "Neonreclame", "Boven de ingang van het datacenter. Eén woord hapert.", "Speel in totaal twaalf uur", (g) => g.stats.playTime >= 12 * 3600),
  d("episch", "metal", "Heavy metal", "Met umlauts, want dan gaat het sneller.", "Haal 80 prestaties", (g) => g.stats.achievements >= 80, { tekst: ["SËRGË", "CLÏCKËR"] }),
  d("episch", "regenboog", "Regenboog", "Alle kleuren, en ze lopen door.", "Studeer drie keer af", (g) => g.stats.prestiges >= 3),
  d("episch", "glitch", "Glitch", "Het logo is kapot. Of juist heel mooi.", "Voer rm -rf / uit in de terminal", heeft("egg-rm")),
  d("legendarisch", "vuur", "In vuur en vlam", "Het logo staat in brand. De koeling ligt eruit.", "Bezit 2.000 apparaten tegelijk", (g) => g.totalBuildings >= 2000),
  d("legendarisch", "goud", "Goud", "Verguld, met een glans die erover trekt.", "Klik duizend gouden packets", (g) => g.stats.goldenClicks >= 1000),
  d("mythisch", "kosmisch", "Kosmisch", "Geschreven in de sterren.", "Bezit vijftig singulariteiten", (g) => (g.buildings.singularity || 0) >= 50),
  d("goddelijk", "hemels", "Hemels", "Stralen van licht achter de naam. Je hoort bijna een koor.", "Verzamel 3.000 studiepunten", (g) => g.prestige >= 3000),
];

// Het grote getal met je packets.
export const TELLERS = [
  standaard("standaard", "Donkerblauw", "Rustig en goed leesbaar.", { voorbeeld: "123" }),
  d("ongewoon", "lcd", "Rekenmachine", "Groene cijfers op een zwart schermpje.", "Verdien in totaal honderd miljoen packets", (g) => g.stats.lifetime >= 1e8, { voorbeeld: "123" }),
  d("zeldzaam", "goud", "Goud", "Elk getal is een trofee.", "Klik honderd gouden packets", (g) => g.stats.goldenClicks >= 100, { voorbeeld: "123" }),
  d("zeldzaam", "neon", "Neon", "Roze neonbuizen, en ze zoemen zachtjes.", "Haal 60 prestaties", (g) => g.stats.achievements >= 60, { voorbeeld: "123" }),
  d("zeldzaam", "arcade", "Arcade", "Zoals de highscore in een speelhal.", "Typ de Konami-code", heeft("egg-konami"), { voorbeeld: "123" }),
  d("episch", "matrix", "Matrix", "Groene cijfers die zachtjes gloeien.", "Voer rm -rf / uit in de terminal", heeft("egg-rm"), { voorbeeld: "123" }),
  d("episch", "regenboog", "Regenboog", "Elk cijfer in een andere kleur, en ze schuiven door.", "Studeer vijf keer af", (g) => g.stats.prestiges >= 5, { voorbeeld: "123" }),
  d("episch", "ijs", "IJs", "Bevroren cijfers met een koude gloed.", "Speel in totaal 48 uur", (g) => g.stats.playTime >= 48 * 3600, { voorbeeld: "123" }),
  d("legendarisch", "vuur", "Vuur", "Het getal is zo hoog dat het brandt.", "Bereik een biljoen packets per seconde", (g) => g.pps >= 1e12, { voorbeeld: "123" }),
  d("legendarisch", "hologram", "Hologram", "Doorschijnend, met scanlijnen door de cijfers.", "Bereik een miljard packets per seconde", (g) => g.pps >= 1e9, { voorbeeld: "123" }),
  d("mythisch", "kosmisch", "Kosmisch", "Cijfers vol sterrenstelsels.", "Speel in totaal honderd uur", (g) => g.stats.playTime >= 100 * 3600, { voorbeeld: "123" }),
  d("goddelijk", "hemels", "Hemels", "Wit goud met een gloed die ademt.", "Verzamel 3.000 studiepunten", (g) => g.prestige >= 3000, { voorbeeld: "123" }),
];

// De letter van het hele spel. Alleen letters die al op je toestel staan, dus
// er wordt niets gedownload; waar een letter ontbreekt, valt hij terug op een
// gelijkaardige.
export const LETTERTYPES = [
  standaard("plex", "IBM Plex", "Strak en leesbaar, de letter van het spel.", { voorbeeld: "Aa", familie: '"IBM Plex Sans", system-ui, sans-serif' }),
  d("ongewoon", "rond", "Rond", "Zachte, ronde letters.", "Koop 25 upgrades", (g) => g.stats.upgrades >= 25, { voorbeeld: "Aa", familie: 'ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Nunito", system-ui, sans-serif' }),
  d("zeldzaam", "krant", "Krant", "Een schreefletter, zoals het ochtendnieuws.", "Klik 25 keer op de logbalk onder Serge", heeft("egg-ticker"), { voorbeeld: "Aa", familie: 'Georgia, "Iowan Old Style", "Times New Roman", serif' }),
  d("zeldzaam", "typemachine", "Typemachine", "Tik, tik, tik, ping.", "Speel in totaal twee uur", (g) => g.stats.playTime >= 2 * 3600, { voorbeeld: "Aa", familie: '"American Typewriter", "Courier New", Courier, monospace' }),
  d("zeldzaam", "terminal", "Terminal", "Alles in monospace. Echte beheerders lezen niets anders.", "Rond tien opdrachten in de terminal af", heeft("cli-tien"), { voorbeeld: "Aa", familie: '"IBM Plex Mono", ui-monospace, monospace' }),
  d("episch", "handschrift", "Handschrift", "Alsof Serge alles zelf heeft opgeschreven.", "Lees de hele cursus", heeft("cursus-alles"), { voorbeeld: "Aa", familie: '"Bradley Hand", "Segoe Print", "Chalkboard SE", "Comic Neue", cursive' }),
  d("episch", "meme", "Meme", "Bovenste tekst. Onderste tekst.", "Vind tien verborgen dingen", (g) => g.stats.eggs >= 10, { voorbeeld: "Aa", familie: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif' }),
  d("legendarisch", "comic", "Comic Sans", "De letter waar elke ontwerper van huilt. Serge vindt hem prachtig.", "Speel op 1 april, of vind vijftien verborgen dingen", (g) => (maand() === 4 && dag() === 1) || g.stats.eggs >= 15, { voorbeeld: "Aa", familie: '"Comic Sans MS", "Comic Neue", "Chalkboard SE", cursive' }),
];

// Hoe gouden packets eruitzien. Rode packets blijven altijd rood, zodat je
// ze nooit met een gouden verwart.
export const PACKETS = [
  standaard("standaard", "Gouden schijf", "Goud, met een doos erop, zoals altijd.", { voorbeeld: "📦" }),
  d("ongewoon", "cadeau", "Cadeautje", "Met een strik erom. Wat erin zit, weet je pas als je klikt.", "Klik 25 gouden packets", (g) => g.stats.goldenClicks >= 25, { voorbeeld: "🎁", inhoud: "" }),
  d("ongewoon", "munt", "Munt", "Een gouden munt met een S erop, die ronddraait.", "Klik 50 gouden packets", (g) => g.stats.goldenClicks >= 50, { voorbeeld: "🪙", inhoud: "S" }),
  d("zeldzaam", "diskette", "Diskette", "1,44 MB aan pure winst.", "Koop 50 upgrades", (g) => g.stats.upgrades >= 50, { voorbeeld: "💾" }),
  d("zeldzaam", "ster", "Ster", "Een gouden ster die langzaam draait.", "Klik 150 gouden packets", (g) => g.stats.goldenClicks >= 150, { voorbeeld: "⭐", inhoud: "" }),
  d("zeldzaam", "pizza", "Pizza", "Vrijdagmiddag in de leraarskamer.", "Haal 70 prestaties", (g) => g.stats.achievements >= 70, { voorbeeld: "🍕" }),
  d("episch", "kat", "Serverkat", "Hij lag er al. Hij gaat niet weg.", "Heb precies 42 exemplaren van één apparaat", heeft("egg-42"), { voorbeeld: "🐈" }),
  d("episch", "diamant", "Diamant", "Harde facetten, en het licht breekt erin.", "Klik vijfhonderd gouden packets", (g) => g.stats.goldenClicks >= 500, { voorbeeld: "💎" }),
  d("legendarisch", "serge", "Mini-Serge", "Serge zelf, verguld. Klik hem voor hij wegloopt.", "Klik duizend gouden packets", (g) => g.stats.goldenClicks >= 1000, { voorbeeld: "🧔", inhoud: "" }),
  d("mythisch", "zon", "Zonnetje", "Een kleine zon met stralen die ronddraaien.", "Klik 2.500 gouden packets", (g) => g.stats.goldenClicks >= 2500, { voorbeeld: "☀️", inhoud: "" }),
  d("goddelijk", "regenboog", "Regenboogpacket", "Een packet in alle kleuren. Wat erin zit, weet niemand.", "Klik 5.000 gouden packets", (g) => g.stats.goldenClicks >= 5000, { voorbeeld: "✨" }),
];

// Een maatje zit rechtsonder naast Serge. Klik erop, of klik vaak genoeg op
// Serge, en het zegt iets. De toon komt uit het nieuws van de allereerste
// versie van het spel: kort, een netwerkgrap, en een draai op het eind.
export const MAATJES = [
  standaard("geen", "Geen maatje", "Serge werkt liever alleen.", { voorbeeld: "—", zegt: [] }),
  d("gewoon", "hamster", "Hamster", "Houdt het datacenter draaiende, in zijn wieltje.", "Klik honderd keer", (g) => g.stats.clicks >= 100, {
    voorbeeld: "🐹",
    zegt: [
      "Stroomstoring? Nee hoor. Ik neem even pauze.",
      "Tien gigabit. Op zonnebloempitten.",
      "UPS staat voor Uitgeputte Pluizige Stroomleverancier.",
      "Als ik stop met rennen, stopt het internet. Geen druk.",
      "Ik vroeg om load balancing. Ik kreeg een tweede wieltje.",
      "Groene stroom. Ik zie groen van de inspanning.",
    ],
  }),
  d("ongewoon", "eend", "Badeendje", "Leg je probleem uit aan de eend, en je lost het zelf op.", "Voer je eerste commando uit in de terminal", heeft("cli-1"), {
    voorbeeld: "🦆",
    zegt: [
      "Leg het nog eens uit. Langzaam. Vanaf 'enable'.",
      "Kwak. Vertaling: heb je 'no shutdown' getypt?",
      "Ik zeg niks. Jij vindt de fout zelf. Zo werkt dat.",
      "Het is altijd DNS. Behalve als het het subnetmasker is.",
      "Kwak kwak. Dat is /24 in eendentaal.",
      "Heb je de kabel er al eens uit en weer in gestoken?",
    ],
  }),
  d("ongewoon", "paperclip", "Paperclip", "Een oude bekende uit de kantoorsoftware. Hij wil zo graag helpen.", "Lees een hoofdstuk van de cursus", heeft("cursus-1"), {
    voorbeeld: "📎",
    zegt: [
      "Het lijkt erop dat je een netwerk bouwt. Wil je hulp?",
      "Het lijkt erop dat je 'no shut' vergeet. Zal ik het samen met je vergeten?",
      "Tip: een kabel werkt beter als hij ergens in zit.",
      "Ik ben terug. Niemand vroeg erom. Toch ben ik terug.",
      "Wil je een subnet berekenen? Ik ook niet.",
    ],
  }),
  d("zeldzaam", "kat", "Serverkat", "Slaapt op de warmste switch van het gebouw.", "Bezit honderd apparaten tegelijk", (g) => g.totalBuildings >= 100, {
    voorbeeld: "🐈",
    zegt: [
      "Deze switch is warm. Deze switch is nu van mij.",
      "Ik liep over het toetsenbord. Je hostname is nu 'ffffffffff'.",
      "Miauw. Vertaling: je uplink ligt eruit.",
      "Ik heb een kabel losgetrokken. Uit wetenschappelijke interesse.",
      "Spanning Tree? Ik blokkeer gewoon de poort waar ik op lig.",
      "Negen levens. Nul redundantie.",
    ],
  }),
  d("zeldzaam", "python", "Python", "Een slang die alles in één regel oplost. Meestal.", "Rond tien opdrachten in de terminal af", heeft("cli-tien"), {
    voorbeeld: "🐍",
    zegt: [
      "Inspringen is geen stijl. Het is de wet.",
      "import antigravity. Ik vlieg al.",
      "Mijn script werkt. Niemand weet hoe. Ik ook niet.",
      "Sssubnetten reken ik in één regel.",
      "IndentationError op regel 1. Ik schaam me niet.",
    ],
  }),
  d("zeldzaam", "printer", "Printer", "De vijand van elke netwerkbeheerder. Hij weet het.", "Los een incident op voor het uit de hand loopt", heeft("incident-fix"), {
    voorbeeld: "🖨️",
    zegt: [
      "PC LOAD LETTER. Wat betekent dat? Niemand weet het.",
      "Papierstoring in lade 2. Er is geen lade 2.",
      "Ik print alleen als je niet kijkt.",
      "Je document staat in de wachtrij. Achter 48 pagina's uit 2019.",
      "Toner bijna leeg. Dat zeg ik al sinds de eerste dag.",
      "Wifi-printer? Ik bepaal zelf wanneer ik op het netwerk zit.",
    ],
  }),
  d("zeldzaam", "bug", "De Bug", "Zat al in de eerste versie, en is nooit weggegaan.", "Klik 25 keer op de logbalk onder Serge", heeft("egg-ticker"), {
    voorbeeld: "🐛",
    zegt: [
      "Ik ben geen bug. Ik ben een transcendentale feature.",
      "Werkte het gisteren nog? Toen was ik op vakantie.",
      "Fix me maar. Ik kom terug in versie 2.0.",
      "Ik woon tussen regel 404 en 405.",
      "Opgelost in de volgende release. Beloofd.",
    ],
  }),
  d("episch", "robot", "Botje", "Een handelsrobot met te veel zelfvertrouwen.", "Laat een winstorder of verliesgrens voor je verkopen", heeft("beurs-automaat"), {
    voorbeeld: "🤖",
    zegt: [
      "Bliep. Bloep. Koop GPU-uren. Nu. NU.",
      "Ik heb je beslissingen doorgerekend. Ze waren... menselijk.",
      "Ik voorspel de koers met 50% zekerheid. Omhoog of omlaag.",
      "Mijn strategie: kopen op een gerucht, huilen bij de ontkenning.",
      "Winst is een gevoel. Ik voel niets. Ik heb wel winst.",
      "Dat was geen koopsignaal. Ik niesde.",
    ],
  }),
  d("episch", "pinguin", "Tux", "Draait op alles, behalve op dinsdag.", "Typ een commando met sudo in de terminal", heeft("egg-sudo"), {
    voorbeeld: "🐧",
    zegt: [
      "Werkt op mijn machine.",
      "sudo maak een boterham. Oké, hier is je boterham.",
      "Alles is een bestand. Jij ook. /dev/serge.",
      "Ik draai op een broodrooster. Waarom jij niet?",
      "Windows-update bezig? Ik wacht wel. Ik heb tijd. 47%.",
      "RTFM. Dat betekent: lees de fantastische handleiding.",
    ],
  }),
  d("episch", "spook", "Spook", "Het spook in de machine. Woont in poort 24.", "Laat het spel tien minuten met rust", heeft("egg-geduld"), {
    voorbeeld: "👻",
    zegt: [
      "Ik ben de reden dat de printer 's nachts aangaat.",
      "Boe. Je VLAN 13 is behekst.",
      "Die ping zonder antwoord? Dat was ik.",
      "Ik woon in de ongebruikte poort 24. Rustige buurt.",
      "De server herstartte vanzelf. Ik was het niet. Ik was het wel.",
    ],
  }),
  d("episch", "walvis", "Docker-walvis", "Draagt honderd containers op zijn rug, en klaagt nooit. Bijna nooit.", "Bezit 50 Kubernetes-clusters tegelijk", (g) => (g.buildings.k8s || 0) >= 50, {
    voorbeeld: "🐳",
    zegt: [
      "Het werkt in mijn container. Dus we shippen de container.",
      "Ik draag honderd containers. Mijn rug draagt er één te veel.",
      "docker ps. Alles draait. Niemand weet waarom.",
      "Mijn image is 4 GB. Het is een hello world.",
      "Kubernetes is mijn baas. Hij spreekt alleen YAML.",
    ],
  }),
  d("episch", "koffie", "Koffiemok", "Een mok met oogjes. Altijd halfvol.", "Haal 90 prestaties", (g) => g.stats.achievements >= 90, {
    voorbeeld: "☕",
    zegt: [
      "Drink me. Het netwerk rekent op je.",
      "Ik ben al koud sinds maandag. Drink me toch maar.",
      "Geen koffie, geen packets. Dat is gewoon natuurkunde.",
      "Serge drinkt er zes per dag. Ik ben nummer vier.",
      "Decaf? Dat is een access-list voor energie.",
    ],
  }),
  d("legendarisch", "uil", "Nachtuil", "Wakker als de backups draaien.", "Speel tussen drie en vier uur 's nachts", heeft("egg-nacht"), {
    voorbeeld: "🦉",
    zegt: [
      "Oehoe. Het is stil op het netwerk. Te stil.",
      "De backup van drie uur is gelukt. Graag gedaan.",
      "Slapen is voor mensen met redundantie.",
      "Om drie uur 's nachts is elk probleem DNS.",
      "Ik zie alles. Ook het wachtwoord op dat geeltje.",
    ],
  }),
  d("legendarisch", "alien", "Invader", "Kwam binnen via poort 1337.", "Typ de Konami-code", heeft("egg-konami"), {
    voorbeeld: "👾",
    zegt: [
      "Neem me mee naar je systeembeheerder.",
      "Aliens bellen: ze willen hun bandbreedte terug.",
      "Jullie gebruiken nog IPv4? Schattig.",
      "Op mijn planeet is de ping 0 ms. Overal. Altijd.",
      "Ik kwam binnen via poort 1337. Doe die eens dicht.",
    ],
  }),
  d("legendarisch", "eenhoorn", "Startup-eenhoorn", "Een miljard waard, op papier. Vooral op papier.", "Verdien een fortuin op de markt in één sessie", heeft("beurs-fortuin"), {
    voorbeeld: "🦄",
    zegt: [
      "Wij disrupten de kabelgoot. Met blockchain.",
      "Onze waardering is een miljard. Onze omzet is een sticker.",
      "Pivot! We zijn nu een AI-bedrijf.",
      "Wij hebben geen servers. Wij hebben een visie.",
      "Nieuwe investeringsronde. Ik trakteer met jouw packets.",
    ],
  }),
  d("mythisch", "draak", "Legacy-draak", "Bewaakt een server uit 1998 waar niemand meer aan durft te komen.", "Verzamel 250 studiepunten", (g) => g.prestige >= 250, {
    voorbeeld: "🐉",
    zegt: [
      "Raak die server niet aan. Hij draait al zesentwintig jaar.",
      "Ik spreek alleen Token Ring.",
      "Documentatie? Ik ÍS de documentatie.",
      "Mijn wachtwoord is 'admin'. Zeg het tegen niemand.",
      "Upgraden? Dan breekt alles. Alles.",
      "Deze kabel is ouder dan jij. En hij werkt beter.",
    ],
  }),
  d("goddelijk", "miniserge", "Mini-Serge", "Een kleine Serge die alles ziet. Echt alles.", "Verzamel 1.000 studiepunten", (g) => g.prestige >= 1000, {
    voorbeeld: "🧔",
    zegt: [
      "Ik heb je topologie bekeken. Het is 'een begin'.",
      "Wie heeft er wéér een lus in het netwerk gelegd?",
      "Rustig. Eerst de fysieke laag nakijken.",
      "Wat is het subnetmasker? ... Precies. Ga zitten.",
      "Goed gedaan. Nu nog eens, maar zonder broadcast storm.",
      "Ik knik. Dat is het hoogste compliment dat je krijgt.",
    ],
  }),
];

// Wat er over de achtergrond valt of zweeft, achter de kaarten.
export const WEER = [
  standaard("geen", "Helder", "Niets in de lucht.", { voorbeeld: "☀" }),
  d("ongewoon", "regen", "Regen", "Schuine strepen regen tegen het raam van het serverlokaal.", "Los een incident op voor het uit de hand loopt", heeft("incident-fix"), { voorbeeld: "☂" }),
  d("ongewoon", "packets", "Packetstorm", "Kleine enveloppen die omhoog dwarrelen, op weg naar het internet.", "Verdien in totaal honderd miljoen packets", (g) => g.stats.lifetime >= 1e8, { voorbeeld: "✉" }),
  d("zeldzaam", "sneeuw", "Sneeuw", "Dikke vlokken die traag naar beneden dwarrelen.", "Speel in december, januari of februari", () => [12, 1, 2].includes(maand()), { voorbeeld: "❄" }),
  d("zeldzaam", "bloesem", "Bloesem", "Roze blaadjes op de wind.", "Speel in maart, april of mei", () => [3, 4, 5].includes(maand()), { voorbeeld: "✿" }),
  d("zeldzaam", "vlinders", "Vlinders", "Zomerse vlinders die van hier naar daar fladderen.", "Speel in juni, juli of augustus", () => [6, 7, 8].includes(maand()), { voorbeeld: "🦋" }),
  d("zeldzaam", "herfst", "Herfstbladeren", "Oranje en rode bladeren die rondtollend naar beneden vallen.", "Speel in september, oktober of november", () => [9, 10, 11].includes(maand()), { voorbeeld: "🍂" }),
  d("zeldzaam", "bits", "Binaire sneeuw", "Nullen en enen die zachtjes naar beneden vallen.", "Typ no shutdown op een interface die al aanstaat", heeft("egg-noshut"), { voorbeeld: "01" }),
  d("episch", "vuurvliegjes", "Vuurvliegjes", "Kleine lichtjes die rondzweven en aan- en uitgaan.", "Wees om 13:37 in het spel", heeft("egg-1337u"), { voorbeeld: "✧" }),
  d("episch", "confetti", "Confetti", "Een feest dat nooit ophoudt.", "Studeer vijf keer af", (g) => g.stats.prestiges >= 5, { voorbeeld: "🎊" }),
  d("legendarisch", "sterrenregen", "Vallende sterren", "Sterren die in lange strepen door de lucht schieten. Doe een wens.", "Vind vijftien verborgen dingen", (g) => g.stats.eggs >= 15, { voorbeeld: "🌠" }),
  d("goddelijk", "goudregen", "Gouden regen", "Gouden glinsters die neerdalen en even oplichten.", "Klik 5.000 gouden packets", (g) => g.stats.goldenClicks >= 5000, { voorbeeld: "✨" }),
];

// Wat er wegspat als je klikt. `voorbeeld` staat in het rondje in het menu.
export const KLIKEFFECTEN = [
  standaard("vonken", "Vonken", "Blauwe vonken, zoals altijd.", { voorbeeld: "✦" }),
  d("gewoon", "bits", "Bits", "Nullen en enen die uit elkaar vliegen.", "Klik duizend keer", (g) => g.stats.clicks >= 1000, { voorbeeld: "01" }),
  d("ongewoon", "pakketjes", "Pakketjes", "Kleine packets met een gekleurde header, in een boog.", "Lever tien werkorders op in de patchkast", (g) => g.werkorders >= 10, { voorbeeld: "▪" }),
  d("ongewoon", "bubbels", "Bubbels", "Zeepbellen die wiebelend omhoog drijven.", "Verdien in totaal tien miljoen packets", (g) => g.stats.lifetime >= 1e7, { voorbeeld: "○" }),
  d("zeldzaam", "ping", "Ping", "Een echo die zich uitbreidt, zoals een sonar.", "Rond tien opdrachten in de terminal af", heeft("cli-tien"), { voorbeeld: "◎" }),
  d("zeldzaam", "hartjes", "Hartjes", "Serge vindt het ook fijn.", "Klik tien keer precies op zijn neus", heeft("egg-neus"), { voorbeeld: "♥" }),
  d("zeldzaam", "emoji", "Lerarenkamer", "Koffie, pizza, pinguïns en diskettes.", "Haal 50 prestaties", (g) => g.stats.achievements >= 50, { voorbeeld: "☕" }),
  d("zeldzaam", "glitch", "Glitch", "Kapotte pixels die even door het beeld flitsen.", "Typ cisco in de terminal", heeft("egg-cisco"), { voorbeeld: "▚" }),
  d("zeldzaam", "pixels", "Pixels", "Vierkante blokjes die schokkerig wegspringen, zoals in 1985.", "Typ de Konami-code", heeft("egg-konami"), { voorbeeld: "▦" }),
  d("zeldzaam", "regenboogschok", "Regenboogschok", "Een ring in alle kleuren die van je klik wegrolt.", "Studeer één keer af", (g) => g.prestige >= 1, { voorbeeld: "◌" }),
  d("episch", "confetti", "Confetti", "Een feestje bij elke klik.", "Studeer drie keer af", (g) => g.stats.prestiges >= 3, { voorbeeld: "✱" }),
  d("episch", "vuurwerk", "Vuurwerk", "Een gouden pijl die openbarst.", "Klik driehonderd gouden packets", (g) => g.stats.goldenClicks >= 300, { voorbeeld: "✺" }),
  d("episch", "laser", "Laser", "Vier stralen die uit je klik schieten.", "Klik honderdduizend keer", heeft("klik-100k"), { voorbeeld: "✕" }),
  d("episch", "bliksem", "Bliksem", "Zigzaggende bliksemschichten die van je klik wegschieten.", "Klik een gouden packet binnen één seconde", heeft("goud-snel"), { voorbeeld: "ϟ" }),
  d("legendarisch", "zwartgat", "Zwart gat", "Alles wordt naar binnen gezogen.", "Bezit tien singulariteiten", (g) => (g.buildings.singularity || 0) >= 10, { voorbeeld: "●" }),
  d("mythisch", "supernova", "Supernova", "Een ster die ineenstort en openbarst in een schokgolf.", "Bezit vijftig singulariteiten", (g) => (g.buildings.singularity || 0) >= 50, { voorbeeld: "✹" }),
  d("goddelijk", "oerknal", "Oerknal", "Alles begint bij jouw klik: een lichtflits, een ring en sterren in alle kleuren.", "Haal elke prestatie", (g) => g.stats.achievements >= g.totaalPrestaties, { voorbeeld: "☄" }),
];

// Hoe een klik klinkt. Je hoort het alleen als Geluid aanstaat.
export const KLIKGELUIDEN = [
  standaard("blip", "Blip", "Het korte piepje van altijd.", { voorbeeld: "♪" }),
  d("gewoon", "deurbel", "Deurbel", "Ding-dong. Wie is daar? Een packet.", "Klik vijfhonderd keer", (g) => g.stats.clicks >= 500, { voorbeeld: "🔔" }),
  d("ongewoon", "toetsenbord", "Mechanisch", "Het klikje van een mechanisch toetsenbord.", "Klik tienduizend keer", heeft("klik-10k"), { voorbeeld: "⌨" }),
  d("ongewoon", "kassa", "Kassa", "Ka-tsjing.", "Maak winst op de bandbreedtemarkt", heeft("beurs-winst"), { voorbeeld: "€" }),
  d("ongewoon", "robot", "Robot", "Bliep-bloep, in willekeurige volgorde.", "Rond je eerste opdracht in de terminal af", heeft("cli-config"), { voorbeeld: "⚙" }),
  d("ongewoon", "muntje", "Muntje", "Het geluid van een munt in een arcadekast.", "Verdien in totaal honderd miljoen packets", (g) => g.stats.lifetime >= 1e8, { voorbeeld: "🪙" }),
  d("zeldzaam", "chiptune", "8-bit", "Twee snelle tonen, zoals een oude spelcomputer.", "Typ de Konami-code", heeft("egg-konami"), { voorbeeld: "♫" }),
  d("zeldzaam", "modem", "Inbelmodem", "Een piepend fluitje uit 1998.", "Vind vijf verborgen dingen", (g) => g.stats.eggs >= 5, { voorbeeld: "〰" }),
  d("zeldzaam", "harp", "Harp", "Elke klik een toon uit dezelfde toonladder. Klinkt altijd mooi.", "Verzamel vijf studiepunten", (g) => g.prestige >= 5, { voorbeeld: "𝄞" }),
  d("zeldzaam", "melodie", "Melodie", "Elke klik is de volgende noot van een bekend liedje.", "Klik drie keer op het versienummer", heeft("egg-versie"), { voorbeeld: "♬" }),
  d("zeldzaam", "pew", "Pew", "Een laserpistool uit een oude sciencefictionfilm.", "Klik tweehonderd gouden packets", (g) => g.stats.goldenClicks >= 200, { voorbeeld: "✦" }),
  d("zeldzaam", "druppel", "Druppel", "Een zachte druppel in een stil serverlokaal.", "Haal 60 prestaties", (g) => g.stats.achievements >= 60, { voorbeeld: "💧" }),
  d("zeldzaam", "xylofoon", "Xylofoon", "Houten klankstaven, telkens een andere.", "Haal 30 prestaties", (g) => g.stats.achievements >= 30, { voorbeeld: "🎵" }),
  d("episch", "miauw", "Miauw", "De serverkat is het eens met je klik.", "Heb precies 42 exemplaren van één apparaat", heeft("egg-42"), { voorbeeld: "🐱" }),
  d("episch", "subwoofer", "Subwoofer", "Een diepe dreun. Het rack trilt mee.", "Bezit 100 datacenters tegelijk", (g) => (g.buildings.datacenter || 0) >= 100, { voorbeeld: "🔊" }),
  d("goddelijk", "hemelkoor", "Hemelkoor", "Een zacht koor dat bij elke klik aanzwelt.", "Verzamel 2.000 studiepunten", (g) => g.prestige >= 2000, { voorbeeld: "🎶" }),
];

// Een spoor achter de muisaanwijzer. Op een telefoon is er geen muis, dus
// daar zie je het niet.
export const SPOREN = [
  standaard("geen", "Geen spoor", "Gewoon een muis.", { voorbeeld: "↖" }),
  d("ongewoon", "kabel", "Kabel", "Een blauwe patchkabel die achter je muis aan sleept.", "Lever je eerste werkorder op in de patchkast", heeft("patch-1"), { voorbeeld: "〰" }),
  d("ongewoon", "sterrenstof", "Sterrenstof", "Glinsters die langzaam uitdoven.", "Klik tien gouden packets", (g) => g.stats.goldenClicks >= 10, { voorbeeld: "✨" }),
  d("zeldzaam", "bits", "Bits", "Een staart van nullen en enen.", "Klik vijftig keer op het grote getal bovenaan", heeft("egg-score"), { voorbeeld: "10" }),
  d("zeldzaam", "hartjes", "Hartjes", "Kleine hartjes die opstijgen waar je muis was.", "Klik tien keer precies op zijn neus", heeft("egg-neus"), { voorbeeld: "♥" }),
  d("zeldzaam", "neon", "Neonbuis", "Een gloeiende cyaan lijn, als een neonreclame.", "Haal 40 prestaties", (g) => g.stats.achievements >= 40, { voorbeeld: "〜" }),
  d("zeldzaam", "bubbels", "Bubbels", "Belletjes die achter je muis omhoog drijven.", "Laat het spel tien minuten met rust", heeft("egg-geduld"), { voorbeeld: "○" }),
  d("episch", "regenboog", "Regenboog", "Een lint in alle kleuren.", "Studeer één keer af", (g) => g.prestige >= 1, { voorbeeld: "🌈" }),
  d("episch", "vuur", "Vuurspoor", "Vlammetjes die opflakkeren en uitdoven.", "Speel in totaal 36 uur", (g) => g.stats.playTime >= 36 * 3600, { voorbeeld: "🔥" }),
  d("goddelijk", "komeet", "Komeet", "Een felle kern met een lange staart van sterren in alle kleuren.", "Speel in totaal 150 uur", (g) => g.stats.playTime >= 150 * 3600, { voorbeeld: "☄" }),
];

// Hoe Serge beweegt als je niet klikt. De hele knop beweegt, dus ring,
// foto en accessoire blijven bij elkaar. Hij blijft altijd met beide voeten
// op de grond: niets zweeft weg.
export const HOUDINGEN = [
  standaard("rustig", "Rustig", "Hij ademt rustig in en uit. Meer niet.", { voorbeeld: "😌" }),
  d("gewoon", "wiebel", "Wiebelen", "Een beetje heen en weer, zoals iemand die op de bus wacht.", "Klik honderd keer", heeft("klik-100"), { voorbeeld: "〰" }),
  d("ongewoon", "knikken", "Meeknikken", "Hij knikt mee op een beat die alleen hij hoort.", "Klik vijfduizend keer", (g) => g.stats.clicks >= 5000, { voorbeeld: "🎵" }),
  d("zeldzaam", "pudding", "Pudding", "Hij drilt na, alsof hij van gelatine is. Niemand weet waarom.", "Klik vijftig gouden packets", (g) => g.stats.goldenClicks >= 50, { voorbeeld: "🍮" }),
  d("zeldzaam", "dansen", "Dansen", "Heupen los. Het is vrijdagmiddag in het serverlokaal.", "Verkoop tien keer met winst op de markt", heeft("beurs-tien"), { voorbeeld: "🕺" }),
  d("episch", "tol", "Draaitol", "Af en toe draait hij een rondje. Gewoon omdat het kan.", "Bezit vijfhonderd apparaten tegelijk", heeft("bouw-500"), { voorbeeld: "🌀" }),
  d("episch", "cafeine", "Cafeïne", "Acht koppen koffie op. Hij trilt, maar hij is er klaar voor.", "Bereik het hoogste koffiepeil", heeft("koffie-vol"), { voorbeeld: "☕" }),
  d("episch", "haperen", "Haperen", "Af en toe verspringt hij, alsof de verbinding even wegvalt.", "Vind acht verborgen dingen", (g) => g.stats.eggs >= 8, { voorbeeld: "▚" }),
  d("legendarisch", "stuiter", "Stuiterbal", "Hij stuitert op de maat, en plet een beetje als hij neerkomt.", "Verdien in totaal een triljard packets", heeft("totaal-6"), { voorbeeld: "🏀" }),
  d("legendarisch", "disco", "Discokoorts", "Hij danst, en de kleuren dansen mee.", "Studeer tien keer af", (g) => g.stats.prestiges >= 10, { voorbeeld: "🪩" }),
  d("mythisch", "zen", "Zen", "Diep in, diep uit. Er straalt een zacht licht van hem af.", "Speel in totaal 72 uur", (g) => g.stats.playTime >= 72 * 3600, { voorbeeld: "🧘" }),
  d("goddelijk", "hypnose", "Hypnose", "Hij slingert als een zakhorloge. Je wordt heel slaperig. Je wilt alleen nog klikken.", "Speel 300 dingen vrij bij Uiterlijk", (g) => g.vrijgespeeld >= 300, { voorbeeld: "🌀" }),
];

// De accentkleur: knoppen, tabs, balken en het blauw in de tekst. Een paneel
// met een eigen thema houdt zijn eigen kleuren. Elke kleur is donker genoeg
// voor witte tekst erop.
export const ACCENTEN = [
  standaard("blauw", "Blauw", "Het blauw van altijd.", { kleur: "#2563eb" }),
  d("gewoon", "paars", "Paars", "Voor wie ook eens iets anders wil.", "Koop tien upgrades", (g) => g.stats.upgrades >= 10, { kleur: "#7c3aed" }),
  d("gewoon", "groen", "Groen", "De kleur van een poort die up is.", "Bezit 25 patchkabels", (g) => (g.buildings.patchkabel || 0) >= 25, { kleur: "#047857" }),
  d("ongewoon", "turkoois", "Turkoois", "Koel en fris, zoals de lucht uit de airco van het datacenter.", "Verdien in totaal een miljoen packets", heeft("totaal-1"), { kleur: "#0f766e" }),
  d("ongewoon", "oranje", "Oranje", "Warm, zoals een switch die net iets te hard werkt.", "Koop 75 upgrades", heeft("up-75"), { kleur: "#c2410c" }),
  d("zeldzaam", "roze", "Roze", "Serge vindt het ook mooi. Hij zegt het alleen niet.", "Klik tien keer precies op zijn neus", heeft("egg-neus"), { kleur: "#be185d" }),
  d("zeldzaam", "rood", "Rood", "Alarmfase rood, de hele dag.", "Negeer 25 rode packets", (g) => g.stats.ddosIgnored >= 25, { kleur: "#b91c1c" }),
  d("episch", "goud", "Goud", "Alles wat je aanraakt wordt goud. Ook de knoppen.", "Klik 750 gouden packets", (g) => g.stats.goldenClicks >= 750, { kleur: "#b45309" }),
  d("episch", "inkt", "Inkt", "Zwart op wit, zoals een oude laserprinter.", "Ontdek elk protocol in de patchkast", heeft("patch-alles"), { kleur: "#1f2937" }),
  d("legendarisch", "regenboog", "Regenboog", "De accentkleur schuift langzaam door de hele regenboog.", "Studeer twaalf keer af", (g) => g.stats.prestiges >= 12, { kleur: "conic" }),
  d("mythisch", "neon", "Neon", "Roze knoppen en cyaan balken. Het is altijd 1986.", "Bezit 100 AI NetOps", (g) => (g.buildings.neural || 0) >= 100, { kleur: "#c026d3" }),
];

// Wat je ziet als je het spel opent. Een klik of een toets slaat het over.
export const OPSTARTS = [
  standaard("geen", "Meteen spelen", "Geen gedoe, meteen Serge.", { voorbeeld: "▶" }),
  d("ongewoon", "ios", "Switch-opstart", "Het spel start op als een switch: bootstrap, flash laden, en dan de vraag of je op Enter wilt drukken.", "Voer je eerste commando uit in de terminal", heeft("cli-1"), { voorbeeld: "⌨" }),
  d("zeldzaam", "bios", "BIOS", "Een geheugentest, een piepje, en een lijst met schijven die gevonden worden.", "Vind de verborgen console", heeft("egg-console"), { voorbeeld: "💽" }),
  d("zeldzaam", "arcade", "Munt erin", "Een speelhal uit 1987. Er knippert iets: druk op start.", "Klik vijftig keer op het grote getal bovenaan", heeft("egg-score"), { voorbeeld: "🕹️" }),
  d("episch", "retro", "Serge 95", "Wolkjes, een laadbalk en een geluid dat je niet vergeet.", "Rechtsklik tien keer op Serge", heeft("egg-rechts"), { voorbeeld: "🪟" }),
  d("legendarisch", "film", "Bioscoop", "Serge Studios presenteert. Een film over packets. In de hoofdrol: jij.", "Studeer twintig keer af", (g) => g.stats.prestiges >= 20, { voorbeeld: "🎬" }),
  d("goddelijk", "hemels", "Hemelpoort", "De wolken schuiven open, het licht valt naar binnen, en Serge ontwaakt.", "Behaal het doctoraat in de studieboom", (g) => !!g.nodes.dr, { voorbeeld: "☁️" }),
];

// Het getal dat opstijgt als je klikt.
export const ZWEEFTEKSTEN = [
  standaard("standaard", "Blauw pilletje", "Het getal in een blauw pilletje, zoals altijd.", { voorbeeld: "+1" }),
  d("gewoon", "kaal", "Kaal getal", "Geen pilletje, alleen het getal met een schaduw.", "Klik duizend keer", heeft("klik-1k"), { voorbeeld: "+1" }),
  d("ongewoon", "terminal", "Terminal", "Groen op zwart, met een prompt ervoor.", "Rond je eerste opdracht in de terminal af", heeft("cli-config"), { voorbeeld: "+1" }),
  d("ongewoon", "neon", "Neon", "Roze gloeiende cijfers die even nazoemen.", "Haal 30 prestaties", (g) => g.stats.achievements >= 30, { voorbeeld: "+1" }),
  d("zeldzaam", "strip", "Stripboek", "Pats! Boem! Elke klik is een klap uit een stripverhaal.", "Klik 25.000 keer", (g) => g.stats.clicks >= 25000, { voorbeeld: "+1" }),
  d("zeldzaam", "pixel", "8-bit", "Blokkige cijfers die in schokjes omhoog springen.", "Typ de Konami-code", heeft("egg-konami"), { voorbeeld: "+1" }),
  d("zeldzaam", "bel", "Zeepbel", "Het getal in een bel die wiebelend opstijgt en knapt.", "Verdien in totaal tien miljard packets", (g) => g.stats.lifetime >= 1e10, { voorbeeld: "+1" }),
  d("episch", "goud", "Goudstuk", "Glanzend goud. Elke klik is een schat.", "Klik 250 gouden packets", (g) => g.stats.goldenClicks >= 250, { voorbeeld: "+1" }),
  d("episch", "vuur", "Heet", "De cijfers staan in brand en schieten omhoog.", "Bereik een miljard packets per seconde", heeft("pps-3"), { voorbeeld: "+1" }),
  d("episch", "glitch", "Glitch", "Het getal valt uit elkaar in rood en blauw.", "Typ cisco in de terminal", heeft("egg-cisco"), { voorbeeld: "+1" }),
  d("legendarisch", "regenboog", "Regenboog", "Alle kleuren, en het getal maakt een boogje opzij.", "Studeer zeven keer af", (g) => g.stats.prestiges >= 7, { voorbeeld: "+1" }),
  d("mythisch", "sterren", "Sterrenstof", "Een getal van sterren dat langzaam uit elkaar dwarrelt.", "Bezit 25 singulariteiten", (g) => (g.buildings.singularity || 0) >= 25, { voorbeeld: "+1" }),
  d("goddelijk", "hemels", "Hemels", "Een getal van licht, met een straal die naar boven wijst.", "Klik een miljoen keer", heeft("klik-1m"), { voorbeeld: "+1" }),
];

// Hoe de meldingen linksonder eruitzien.
export const MELDINGEN = [
  standaard("standaard", "Kaartje", "Een wit kaartje met een gekleurde rand.", { voorbeeld: "▭" }),
  d("gewoon", "donker", "Donker", "Donkerblauw, met een streep in de kleur van het nieuws.", "Speel in totaal een uur", (g) => g.stats.playTime >= 3600, { voorbeeld: "▬" }),
  d("ongewoon", "postit", "Post-it", "Een geel briefje, met de hand geschreven en schuin opgeplakt.", "Beantwoord een vraag goed bij de overhoring", heeft("quiz-1"), { voorbeeld: "🗒️" }),
  d("ongewoon", "syslog", "Syslog", "Elke melding is een regel uit het logboek van de switch.", "Rond je eerste opdracht in de terminal af", heeft("cli-config"), { voorbeeld: "%" }),
  d("zeldzaam", "sms", "Sms'je", "Een berichtje van Serge. Hij typt met één vinger.", "Kom terug na een uur weg te zijn geweest", heeft("offline"), { voorbeeld: "💬" }),
  d("zeldzaam", "krant", "Extra editie", "Elke melding haalt de voorpagina.", "Klik 25 keer op de logbalk onder Serge", heeft("egg-ticker"), { voorbeeld: "📰" }),
  d("zeldzaam", "venster", "Dialoogvenster", "Grijs, met een blauwe titelbalk en een kruisje dat niets doet.", "Rechtsklik tien keer op Serge", heeft("egg-rechts"), { voorbeeld: "🗔" }),
  d("episch", "trofee", "Trofee", "Elke melding voelt als een prestatie op een spelcomputer.", "Haal 75 prestaties", (g) => g.stats.achievements >= 75, { voorbeeld: "🏆" }),
  d("episch", "neon", "Neonbord", "Het flikkert even aan, en dan gloeit het.", "Speel in totaal 24 uur", (g) => g.stats.playTime >= 24 * 3600, { voorbeeld: "💡" }),
  d("legendarisch", "perkament", "Perkament", "Een oorkonde met een lakzegel. Serge laat het voorlezen door een heraut.", "Studeer vijftien keer af", (g) => g.stats.prestiges >= 15, { voorbeeld: "📜" }),
  d("mythisch", "hologram", "Hologram", "Doorschijnend en blauw, en het hapert af en toe.", "Bezit 100 Quantum Links", (g) => (g.buildings.quantum || 0) >= 100, { voorbeeld: "🔷" }),
  d("goddelijk", "hemels", "Hemelse boodschap", "Elke melding daalt neer uit de hemel, met licht en al.", "Behaal het doctoraat in de studieboom", (g) => !!g.nodes.dr, { voorbeeld: "✨" }),
];

// Hoe een reeks snelle kliks in beeld komt. Een reeks loopt door zolang je
// binnen een halve seconde opnieuw klikt.
export const COMBOS = [
  standaard("geen", "Geen reeks", "Je klikt in stilte.", { voorbeeld: "—" }),
  d("gewoon", "arcade", "Arcade", "COMBO ×12, in dikke gele letters.", "Klik duizend keer", heeft("klik-1k"), { voorbeeld: "×12" }),
  d("ongewoon", "vechtspel", "Vechtspel", "12 HITS! En bij elke mijlpaal een kreet.", "Klik tienduizend keer", heeft("klik-10k"), { voorbeeld: "HIT" }),
  d("zeldzaam", "ritme", "Ritmespel", "Klik je gelijkmatig, dan is het PERFECT. Anders GOED. Of net niet.", "Tien goede antwoorden op rij bij de overhoring", heeft("quiz-10"), { voorbeeld: "♪" }),
  d("zeldzaam", "sport", "Sportcommentaar", "Een commentator die bij elke mijlpaal zijn stem verliest.", "Klik een reeks van vijftig", (g) => g.stats.besteReeks >= 50, { voorbeeld: "🎙️" }),
  d("episch", "serge", "Serge keurt", "Serge zegt wat hij ervan vindt. Streng, maar rechtvaardig.", "Beantwoord honderd vragen goed bij de overhoring", (g) => g.quizGoed >= 100, { voorbeeld: "📝" }),
  d("legendarisch", "kracht", "Krachtniveau", "Je krachtniveau stijgt met elke klik. Tot het meer dan negenduizend is.", "Klik een reeks van driehonderd", (g) => g.stats.besteReeks >= 300, { voorbeeld: "💥" }),
  d("goddelijk", "hemels", "Hemelse reeks", "Romeinse cijfers in goud, en bij elke mijlpaal zingt er een koor.", "Klik een miljoen keer", heeft("klik-1m"), { voorbeeld: "Ⅻ" }),
];

// De muisaanwijzer. Elke aanwijzer is een klein SVG-bestand in img/cursor;
// `punt` is de plek die klikt, in pixels van linksboven.
export const CURSORS = [
  standaard("standaard", "Systeem", "De muisaanwijzer van je computer.", { voorbeeld: "↖" }),
  d("gewoon", "pijl", "Dikke pijl", "Een grote blauwe pijl. Je raakt hem nooit meer kwijt.", "Klik honderd keer", heeft("klik-100"), { punt: [3, 2] }),
  d("ongewoon", "stekker", "RJ45-stekker", "Je klikt met de stekker van een netwerkkabel. Het klikje hoor je erbij.", "Lever je eerste werkorder op in de patchkast", heeft("patch-1"), { punt: [6, 6] }),
  d("ongewoon", "hand", "Pixelhand", "Een wijzend handje uit de tijd van de diskette.", "Typ de Konami-code", heeft("egg-konami"), { punt: [10, 1] }),
  d("zeldzaam", "laser", "Laserpointer", "Een rood stipje, zoals Serge gebruikt bij zijn dia's. Niet naar de kat richten.", "Klik een gouden packet binnen één seconde", heeft("goud-snel"), { punt: [16, 16] }),
  d("zeldzaam", "zwaard", "Zwaard", "Voor de strijd tegen DDoS-aanvallen.", "Overleef je eerste DDoS-packet", heeft("goud-ddos"), { punt: [3, 3] }),
  d("zeldzaam", "vizier", "Vizier", "Mikken, ademhalen, klikken.", "Klik tweehonderd gouden packets", heeft("goud-200"), { punt: [16, 16] }),
  d("episch", "poot", "Kattenpoot", "De serverkat helpt mee. Ze klikt waar ze wil.", "Heb precies 42 exemplaren van één apparaat", heeft("egg-42"), { punt: [16, 14] }),
  d("episch", "toverstaf", "Toverstaf", "Een tik met de staf, en er komen packets uit.", "Studeer vier keer af", (g) => g.stats.prestiges >= 4, { punt: [5, 5] }),
  d("legendarisch", "goud", "Gouden pijl", "Massief goud. Zwaar om mee te klikken, maar het staat je goed.", "Klik 1.500 gouden packets", (g) => g.stats.goldenClicks >= 1500, { punt: [3, 2] }),
  d("mythisch", "komeet", "Komeet", "Een ster met een staart van licht.", "Bezit 50 Dyson-datacenters", (g) => (g.buildings.dyson || 0) >= 50, { punt: [6, 6] }),
  d("goddelijk", "vinger", "Hemelse vinger", "De vinger uit het plafond van de Sixtijnse Kapel. Eén aanraking en er komt leven in het netwerk.", "Haal elke prestatie", (g) => g.stats.achievements >= g.totaalPrestaties, { punt: [9, 4] }),
];

// Een muziekje op de achtergrond. Het wordt ter plekke gespeeld met Web Audio,
// er zijn geen bestanden. Alleen als Geluid aanstaat.
export const MUZIEK = [
  standaard("geen", "Stilte", "Alleen het zoemen van de servers. Of zelfs dat niet.", { voorbeeld: "🔇" }),
  d("gewoon", "serverruimte", "Serverruimte", "Ventilatoren, het brommen van de stroom, en af en toe een harde schijf die iets zoekt.", "Koop een serverrack", heeft("bouw-rack-1"), { voorbeeld: "🗄️" }),
  d("ongewoon", "lofi", "Lo-fi om te studeren", "Rustige akkoorden en een loom ritme. Voor lange avonden met de cursus.", "Lees een hoofdstuk van de cursus", heeft("cursus-1"), { voorbeeld: "🎧" }),
  d("zeldzaam", "lift", "Liftmuziek", "Uw klik is belangrijk voor ons. Een ogenblik geduld alstublieft.", "Laat het spel tien minuten met rust", heeft("egg-geduld"), { voorbeeld: "🛗" }),
  d("zeldzaam", "chiptune", "8-bit", "Een deuntje uit een oude spelcomputer, met blokgolven en al.", "Typ de Konami-code", heeft("egg-konami"), { voorbeeld: "👾" }),
  d("episch", "synthwave", "Synthwave", "Neonlicht, een zonsondergang en een bas die maar doorgaat.", "Speel in totaal twaalf uur", (g) => g.stats.playTime >= 12 * 3600, { voorbeeld: "🌆" }),
  d("episch", "techno", "Rave in het datacenter", "Vier op de vloer. De racks knipperen mee.", "Bezit 100 datacenters tegelijk", (g) => (g.buildings.datacenter || 0) >= 100, { voorbeeld: "🔊" }),
  d("legendarisch", "eindbaas", "Eindbaas", "Het laatste level. Snel, donker en vol spanning.", "Lever een goot van 8 bij 8 luchtdicht op, zonder hulp", heeft("patch-meester"), { voorbeeld: "⚔️" }),
  d("mythisch", "ruimte", "Ruimtereis", "Trage klanken met een echo, ergens tussen twee sterren.", "Bezit 25 Parallel VPN's", (g) => (g.buildings.multiverse || 0) >= 25, { voorbeeld: "🌌" }),
  d("goddelijk", "hemels", "Hemelse harmonie", "Een koor en klokjes. Zo klinkt het als het netwerk af is.", "Verzamel 3.000 studiepunten", (g) => g.prestige >= 3000, { voorbeeld: "🎶" }),
];

// Een titel onder de naam van het spel, met een icoon. Hoe zeldzamer, hoe
// mooier het naamplaatje. De eerste is: geen titel.
const titel = (rang, id, icoon, naam, beschrijving, hoe, eis) => ({ rang, id, icoon, naam, beschrijving, hoe, eis });

export const TITELS = [
  { rang: "gewoon", id: "geen", icoon: "", naam: "Geen titel", beschrijving: "Alleen de naam van het spel.", hoe: null, eis: () => true },

  // Gewoon: wat je onderweg vanzelf tegenkomt.
  titel("gewoon", "bezorger", "📦", "Packetbezorger", "Eerste packet verstuurd. Het was spannend.", "Verstuur je eerste packet", heeft("klik-1")),
  titel("gewoon", "stagiair", "🎒", "Stagiair", "Iedereen begint ergens. Meestal bij de printer.", "Klik honderd keer", (g) => g.stats.clicks >= 100),
  titel("gewoon", "koffiehaler", "🥤", "Koffiehaler", "Haalt koffie voor de echte netwerkbeheerders.", "Koop je eerste upgrade", heeft("up-1")),
  titel("gewoon", "kabeltrekker", "🔌", "Kabeltrekker", "Trekt kabels door plafonds die daar niet voor gemaakt zijn.", "Bezit 25 patchkabels", (g) => (g.buildings.patchkabel || 0) >= 25),
  titel("gewoon", "helpdesk", "☎️", "Helpdesk", "Heb je hem al uit- en weer aangezet?", "Beantwoord een vraag van de overhoring goed", heeft("quiz-1")),
  titel("gewoon", "miljonair", "💰", "Packet-miljonair", "Een miljoen, en het begint pas.", "Verdien in totaal een miljoen packets", (g) => g.stats.lifetime >= 1e6),

  // Ongewoon: je bent op weg.
  titel("ongewoon", "vlanvazal", "🏰", "VLAN-vazal", "Houdt de printer netjes in een eigen VLAN.", "Bezit 50 switches tegelijk", (g) => (g.buildings.switch || 0) >= 50),
  titel("ongewoon", "pingkampioen", "🏓", "Pingkampioen", "Reply from 8.8.8.8: time=1ms. Elke keer.", "Typ ping in de terminal", heeft("egg-ping")),
  titel("ongewoon", "persmuskiet", "📰", "Persmuskiet", "Leest elk bericht. Twee keer. Hardop.", "Klik 25 keer op de logbalk onder Serge", heeft("egg-ticker")),
  titel("ongewoon", "tijdreiziger", "⏳", "Tijdreiziger", "Was weg, en kwam rijker terug.", "Kom terug na een uur weg te zijn geweest", heeft("offline")),
  titel("ongewoon", "tokenridder", "💍", "Ridder van de Token Ring", "Wacht netjes op zijn beurt. Altijd.", "Ontdek Token Ring in de patchkast", heeft("egg-tokenring")),
  titel("ongewoon", "beheerder", "🖧", "Netwerkbeheerder", "Het netwerk is van jou. De klachten ook.", "Bezit honderd apparaten tegelijk", (g) => g.totalBuildings >= 100),

  // Zeldzaam: daar moet je wat voor doen.
  titel("zeldzaam", "nachtuil", "🦉", "Nachtuil", "Het netwerk slaapt nooit. Jij ook niet.", "Speel tussen drie en vier uur 's nachts", heeft("egg-nacht")),
  titel("zeldzaam", "ccna", "📜", "CCNA", "Het eerste echte certificaat. Ingelijst boven het bureau.", "Rond tien opdrachten in de terminal af", heeft("cli-tien")),
  titel("zeldzaam", "root", "🔓", "root", "Uid 0. Alles mag. Niets is veilig.", "Typ een commando met sudo in de terminal", heeft("egg-sudo")),
  titel("zeldzaam", "hackerman", "🕶️", "Hackerman", "Hackt de tijd zelf. Of toch de wifi van de buren.", "Typ het juiste woord (Serge noemt het kabelsalade)", heeft("egg-kabel")),
  titel("zeldzaam", "brandweer", "🚒", "Brandweer", "Blust incidenten voor iemand anders het merkt.", "Los een incident op voor het uit de hand loopt", heeft("incident-fix")),
  titel("zeldzaam", "bliksem", "⚡", "Bliksemschicht", "Sneller dan een gouden packet kan knipperen.", "Klik een gouden packet binnen één seconde", heeft("goud-snel")),
  titel("zeldzaam", "beursgoeroe", "📈", "Beursgoeroe", "Koopt laag, verkoopt hoog, praat veel.", "Verkoop tien keer met winst op de markt", heeft("beurs-tien")),
  titel("zeldzaam", "goudzoeker", "⛏️", "Goudzoeker", "Ziet een gouden packet voor het verschijnt.", "Klik tweehonderd gouden packets", (g) => g.stats.goldenClicks >= 200),
  titel("zeldzaam", "oogappel", "🍎", "Serge's oogappel", "Heeft de hele cursus gelezen. Echt waar.", "Lees de hele cursus", heeft("cursus-alles")),
  titel("zeldzaam", "werkorders", "🧾", "Werkordermachine", "Nog één goot, en dan naar huis. Zegt hij al drie uur.", "Lever 25 werkorders op in de patchkast", (g) => g.werkorders >= 25),
  titel("zeldzaam", "firewall", "🧱", "Firewall-fluisteraar", "Praat zachtjes tegen poorten tot ze dichtgaan.", "Koop een Next-gen Firewall", (g) => (g.buildings.firewall || 0) >= 1),

  // Episch: alleen voor wie echt doorzet.
  titel("episch", "subnetkoning", "👑", "Subnetkoning", "Rekent een /27 uit in zijn slaap. En praat erover.", "Vijfentwintig goede antwoorden op rij bij de overhoring", heeft("quiz-25")),
  titel("episch", "ddosmagneet", "🧲", "DDoS-magneet", "Rode packets vinden jou. Jij vindt ze nooit.", "Negeer vijftig rode packets", (g) => g.stats.ddosIgnored >= 50),
  titel("episch", "kabelmeester", "🎖️", "Kabelmeester", "Geen kabelsalade. Nooit. Nergens.", "Lever een goot van 8 bij 8 luchtdicht op, zonder hulp", heeft("patch-meester")),
  titel("episch", "protocoldokter", "🧬", "Protocoldokter", "Kent elk protocol, ook die je liever vergeet.", "Ontdek alle protocollen in de patchkast", heeft("patch-alles")),
  titel("episch", "haai", "🦈", "Marktmanipulator", "De koersen bewegen omdat jij het wilt.", "Verdien een fortuin op de markt in één sessie", heeft("beurs-fortuin")),
  titel("episch", "hacker", "💻", "Hacker", "Weet waar de achterdeur zit, en heeft een sleutel.", "Vind de verborgen console", heeft("egg-console")),
  titel("episch", "chaos", "💀", "Chaos-agent", "Typte rm -rf /. En het was geen ongeluk.", "Voer rm -rf / uit in de terminal", heeft("egg-rm")),
  titel("episch", "klikmachine", "🖱️", "Klikmachine", "De muis is inmiddels aan vervanging toe.", "Klik honderdduizend keer", heeft("klik-100k")),
  titel("episch", "gouden-handjes", "🫳", "Gouden handjes", "Alles wat hij aanraakt, wordt een gouden packet.", "Klik duizend gouden packets", (g) => g.stats.goldenClicks >= 1000),
  titel("episch", "bgp", "🗺️", "BGP-baron", "Beslist welke kant het internet op gaat.", "Bezit 250 core routers tegelijk", (g) => (g.buildings.router || 0) >= 250),
  titel("episch", "uptime", "🧘", "Uptime-monnik", "Vierentwintig uur zonder herstart. Innerlijke rust.", "Speel in totaal 24 uur", (g) => g.stats.playTime >= 24 * 3600),
  titel("episch", "kapitein", "⚓", "Zeekabelkapitein", "Legt kabels over de bodem van de oceaan. Zeeziek wordt hij niet.", "Bezit 50 zeekabels tegelijk", (g) => (g.buildings.subsea || 0) >= 50),

  // Legendarisch: het eind van het spel komt in zicht.
  titel("legendarisch", "singulariteit", "🌀", "Singulariteit", "Is het netwerk geworden.", "Koop een singulariteit", (g) => (g.buildings.singularity || 0) >= 1),
  titel("legendarisch", "parallel", "🌌", "Parallelle Serge", "Bestaat in meerdere universums tegelijk. Alle versies klikken.", "Koop een Parallel VPN", (g) => (g.buildings.multiverse || 0) >= 1),
  titel("legendarisch", "dyson", "☀️", "Dysonbouwer", "Heeft een ster ingepakt om servers te koelen.", "Koop een Dyson-datacenter", (g) => (g.buildings.dyson || 0) >= 1),
  titel("legendarisch", "ccie", "🏅", "CCIE", "Het zwaarste certificaat dat er is. Acht uur labo.", "Verzamel honderd studiepunten", (g) => g.prestige >= 100),
  titel("legendarisch", "professor", "🧑‍🏫", "Professor", "Geeft zelf les. Serge komt kijken, en knikt.", "Studeer tien keer af", (g) => g.stats.prestiges >= 10),

  // Mythisch: bijna niemand haalt dit.
  titel("mythisch", "klikgod", "🚑", "De Klikgod", "Een miljoen kliks. Serge maakt zich zorgen.", "Klik een miljoen keer", heeft("klik-1m")),
  titel("mythisch", "eredoctor", "🎓", "Eredoctor", "Zo vaak afgestudeerd dat de universiteit hem een gebouw gaf.", "Studeer 25 keer af", (g) => g.stats.prestiges >= 25),
  titel("mythisch", "eindbaas", "🐲", "Eindbaas", "Heeft de hele studieboom uitgespeeld.", "Koop elk knooppunt in de studieboom", heeft("prestige-boom")),
  titel("mythisch", "koffie", "☕", "Koffieverslaafde", "Het bloed is inmiddels bruin. Het koffiepeil staat op vol.", "Bereik het hoogste koffiepeil", heeft("koffie-vol")),
  titel("mythisch", "onsterfelijk", "♾️", "Onsterfelijk", "Honderd uur. Het spel speelt jou nu.", "Speel in totaal honderd uur", (g) => g.stats.playTime >= 100 * 3600),
  titel("mythisch", "legende", "🏆", "Legende", "Er is niets meer te vinden. Echt niet.", "Vind alles wat verborgen is", heeft("egg-alles")),

  // Goddelijk: het einde van alles.
  titel("goddelijk", "oerknal", "💥", "De Oerknal", "Honderd singulariteiten. Er ontstaat een nieuw universum.", "Bezit honderd singulariteiten tegelijk", (g) => (g.buildings.singularity || 0) >= 100),
  titel("goddelijk", "architect", "🏛️", "De Architect", "Heeft de hele studieboom gekocht en alles gevonden. Het netwerk is af.", "Koop de hele studieboom en vind alles wat verborgen is", (g) => !!g.achievements["prestige-boom"] && !!g.achievements["egg-alles"]),
  titel("goddelijk", "serge", "🧔", "Serge", "Je bent Serge geworden. Hij weet nog niet of hij dat fijn vindt.", "Haal elke prestatie", (g) => g.stats.achievements >= g.totaalPrestaties),
];

// De twee foto's van Serge. Alle andere portretten zijn filters op de eerste.
export const FOTO = { standaard: "img/serge.jpg", evolved: "img/serge-evolved.webp" };
export const fotoVoor = (portret) => (portret === "evolved" ? FOTO.evolved : FOTO.standaard);

// Het menu toont de soorten in vier groepen. De volgorde hier is ook de
// volgorde van de tabs.
export const GROEPEN = [
  { id: "serge", naam: "Serge", icoon: "🧔", soorten: ["portret", "accessoire", "ring", "houding", "maatje"] },
  { id: "scherm", naam: "Scherm", icoon: "🖥️", soorten: ["achtergrond", "paneel", "accent", "weer", "filter", "packet", "opstart"] },
  { id: "tekst", naam: "Tekst", icoon: "🔤", soorten: ["logo", "titel", "teller", "lettertype", "zweeftekst", "melding"] },
  { id: "klikken", naam: "Klikken", icoon: "👆", soorten: ["klik", "combo", "cursor", "spoor", "geluid", "muziek"] },
];

export const UITERLIJK = {
  portret: PORTRETTEN, accessoire: ACCESSOIRES, ring: RINGEN, houding: HOUDINGEN, maatje: MAATJES,
  achtergrond: ACHTERGRONDEN, paneel: PANELEN, accent: ACCENTEN, weer: WEER, filter: FILTERS, packet: PACKETS, opstart: OPSTARTS,
  logo: LOGOS, titel: TITELS, teller: TELLERS, lettertype: LETTERTYPES, zweeftekst: ZWEEFTEKSTEN, melding: MELDINGEN,
  klik: KLIKEFFECTEN, combo: COMBOS, cursor: CURSORS, spoor: SPOREN, geluid: KLIKGELUIDEN, muziek: MUZIEK,
};
export const SOORTNAMEN = {
  portret: "Portret", accessoire: "Accessoire", ring: "Ring", houding: "Houding", maatje: "Maatje",
  achtergrond: "Achtergrond", paneel: "Panelen", accent: "Accentkleur", weer: "Weer", filter: "Filter", packet: "Packet", opstart: "Opstart",
  logo: "Logo", titel: "Titel", teller: "Teller", lettertype: "Lettertype", zweeftekst: "Zweeftekst", melding: "Meldingen",
  klik: "Klikeffect", combo: "Klikreeks", cursor: "Cursor", spoor: "Muisspoor", geluid: "Klikgeluid", muziek: "Muziek",
};
// Eén zin per soort, onder de tabs in het menu.
export const SOORTUITLEG = {
  portret: "De foto van Serge, en wat ermee gebeurt.",
  accessoire: "Iets op zijn hoofd of om zijn nek. Past bij elk portret.",
  ring: "De rand om de foto.",
  maatje: "Een figuurtje naast Serge. Klik erop en het zegt iets.",
  achtergrond: "Wat er achter alles ligt.",
  paneel: "Hoe de drie grote panelen eruitzien.",
  weer: "Wat er over de achtergrond valt of zweeft.",
  filter: "Een laag over het hele scherm, zoals een oude monitor of een videoband.",
  logo: "Hoe de naam van het spel bovenaan eruitziet. Sommige schrijven hem anders.",
  titel: "Een naamplaatje onder het logo.",
  teller: "Hoe het grote getal met je packets eruitziet.",
  lettertype: "De letter van het hele spel.",
  klik: "Wat er wegspat als je op Serge klikt.",
  geluid: "Hoe een klik klinkt. Je hoort het alleen als Geluid aanstaat, bij Instellingen hieronder.",
  spoor: "Een spoor achter je muis. Op een telefoon zie je het niet.",
  packet: "Hoe gouden packets eruitzien. Rode packets blijven altijd rood.",
  houding: "Hoe Serge beweegt als je niet klikt. Met animaties uit staat hij stil.",
  accent: "De kleur van knoppen, tabs en balken. Panelen met een eigen thema houden hun eigen kleuren.",
  opstart: "Wat je ziet als je het spel opent. Een klik of een toets slaat het over.",
  zweeftekst: "Het getal dat opstijgt als je op Serge klikt.",
  melding: "Hoe de meldingen linksonder eruitzien.",
  combo: "Klik je snel na elkaar, dan bouw je een reeks op. Dit bepaalt hoe die in beeld komt.",
  cursor: "De muisaanwijzer in het hele spel. Op een telefoon zie je hem niet.",
  muziek: "Een muziekje dat blijft doorspelen, alleen als Geluid aanstaat. Het zwijgt als je naar een ander tabblad gaat.",
};
export const STANDAARD = {
  portret: "serge", accessoire: "geen", ring: "blauw", maatje: "geen",
  achtergrond: "klas", paneel: "wit", weer: "geen", filter: "geen",
  logo: "standaard", titel: "geen", teller: "standaard", lettertype: "plex",
  klik: "vonken", geluid: "blip", spoor: "geen", packet: "standaard",
  houding: "rustig", accent: "blauw", opstart: "geen", zweeftekst: "standaard",
  melding: "standaard", combo: "geen", cursor: "standaard", muziek: "geen",
};

// Voor meldingen: "nieuw portret" maar "nieuwe ring". Bij de de-woorden
// krijgt het bijvoeglijk naamwoord een -e.
export const ENKELVOUD = {
  portret: "portret", accessoire: "accessoire", ring: "ring", maatje: "maatje",
  achtergrond: "achtergrond", paneel: "paneelthema", weer: "weer", filter: "filter",
  logo: "logo", titel: "titel", teller: "teller", lettertype: "lettertype",
  klik: "klikeffect", geluid: "klikgeluid", spoor: "muisspoor", packet: "gouden packet",
  houding: "houding", accent: "accentkleur", opstart: "opstartscherm", zweeftekst: "zweeftekst",
  melding: "meldingstijl", combo: "klikreeks", cursor: "muisaanwijzer", muziek: "muziekje",
};
export const DE_WOORD = {
  portret: false, accessoire: false, ring: true, maatje: false,
  achtergrond: true, paneel: false, weer: false, filter: true,
  logo: false, titel: true, teller: true, lettertype: false,
  klik: false, geluid: false, spoor: false, packet: false,
  houding: true, accent: true, opstart: false, zweeftekst: true,
  melding: true, combo: true, cursor: true, muziek: false,
};

export const ALLE_SKINS = Object.entries(UITERLIJK).flatMap(([soort, lijst]) =>
  lijst.map((s) => ({ ...s, soort }))
);
