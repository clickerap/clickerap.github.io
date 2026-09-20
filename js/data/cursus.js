// De cursus: de basis van netwerken, in stukjes die je tussendoor leest.
//
// Elk hoofdstuk is een lijst blokken:
//   p      alinea
//   lijst  opsomming
//   tabel  kop + rijen
//   code   voorbeeld in vaste breedte
//   serge  een opmerking van Serge zelf

export const HOOFDSTUKKEN = [
  {
    id: "packets",
    titel: "Wat stuurt een netwerk rond?",
    icoon: "📦",
    korte: "Packets, frames en waarom alles in stukjes gaat",
    inhoud: [
      { t: "p", tekst: "Een netwerk verstuurt geen bestanden. Het verstuurt kleine stukjes: packets. Een foto van vier megabyte wordt opgeknipt in duizenden stukjes, en elk stukje reist apart." },
      { t: "p", tekst: "Elk packet bestaat uit twee delen. De header is het etiket: van wie komt het, naar wie gaat het, het hoeveelste stukje is het. De payload is de inhoud zelf. Aan de overkant worden de stukjes op volgorde gelegd en weer aan elkaar geplakt." },
      { t: "lijst", items: [
        "Raakt er één stukje kwijt, dan hoeft alleen dát stukje opnieuw.",
        "Duizenden gesprekken kunnen door dezelfde kabel, want niemand claimt hem voor zich alleen.",
        "Stukjes kunnen verschillende routes nemen en toch samen aankomen.",
      ] },
      { t: "p", tekst: "Op de kabel zelf heet zo'n stukje een frame. In dat frame zit het packet, en in dat packet zit je data. Elke laag doet er zijn eigen etiket omheen — dat heet inkapseling." },
      { t: "serge", tekst: "Als je snapt dat alles in stukjes gaat, snap je waarom een netwerk kan vertragen zonder stuk te zijn." },
    ],
  },
  {
    id: "osi",
    titel: "Het OSI-model",
    icoon: "🧱",
    korte: "Zeven lagen, van de kabel tot je scherm",
    inhoud: [
      { t: "p", tekst: "Het OSI-model deelt een netwerk op in zeven lagen. Elke laag heeft één taak en praat alleen met de laag erboven en eronder. Het is geen product dat je koopt; het is een manier van kijken." },
      { t: "tabel", kop: ["Laag", "Naam", "Waar het over gaat", "Voorbeeld"], rijen: [
        ["7", "Applicatie", "Waar je programma mee praat", "HTTP, DNS, SMTP"],
        ["6", "Presentatie", "Vorm en versleuteling", "TLS, JPEG"],
        ["5", "Sessie", "Een gesprek openen en sluiten", "Aanmelden, sessies"],
        ["4", "Transport", "Betrouwbaarheid en poortnummers", "TCP, UDP"],
        ["3", "Netwerk", "Adressering tussen netwerken", "IP, router"],
        ["2", "Datalink", "Adressering binnen één netwerk", "Ethernet, MAC, switch"],
        ["1", "Fysiek", "Signalen op de draad", "Koper, glas, wifi"],
      ] },
      { t: "p", tekst: "Het nut zit in het zoeken naar fouten: je begint onderaan en werkt omhoog. Kabel los is laag 1. Verkeerd VLAN is laag 2. Verkeerde gateway is laag 3. Poort dicht in de firewall is laag 4. Verlopen certificaat is laag 6." },
      { t: "serge", tekst: "Ezelsbruggetje van onder naar boven: Please Do Not Throw Sausage Pizza Away." },
    ],
  },
  {
    id: "ip",
    titel: "IP-adressen",
    icoon: "🏷️",
    korte: "32 bits, vier octetten, publiek en privé",
    inhoud: [
      { t: "p", tekst: "Een IPv4-adres is 32 bits lang. We schrijven het als vier getallen van 0 tot 255, gescheiden door punten. Elk getal is één octet van acht bits." },
      { t: "code", regels: ["192.168.1.10", "11000000.10101000.00000001.00001010"] },
      { t: "p", tekst: "Sommige adressen zijn gereserveerd voor gebruik binnen je eigen netwerk. Die mogen niet op het internet en kom je overal tegen:" },
      { t: "tabel", kop: ["Reeks", "Prefix", "Waar je hem ziet"], rijen: [
        ["10.0.0.0 – 10.255.255.255", "/8", "Grote bedrijven en scholen"],
        ["172.16.0.0 – 172.31.255.255", "/12", "Bedrijfsnetwerken, Docker"],
        ["192.168.0.0 – 192.168.255.255", "/16", "Thuis, achter je router"],
      ] },
      { t: "p", tekst: "Je router vertaalt al die privéadressen naar het ene publieke adres dat je van je provider krijgt. Dat heet NAT. Daarom kunnen twintig toestellen thuis tegelijk online met één adres naar buiten." },
      { t: "lijst", items: [
        "127.0.0.1 is localhost: je eigen toestel, de kabel komt er niet aan te pas.",
        "Een adres dat begint met 169.254 betekent meestal: geen DHCP-server gevonden.",
        "IPv6 is 128 bits en heeft geen NAT nodig, want adressen zijn er in overvloed.",
      ] },
    ],
  },
  {
    id: "masker",
    titel: "Subnetmaskers en prefixes",
    icoon: "📏",
    korte: "Welk deel is netwerk, welk deel is host",
    inhoud: [
      { t: "p", tekst: "Een adres alleen zegt niets. Je moet weten welk deel het netwerk aanduidt en welk deel het toestel. Dat doet het subnetmasker." },
      { t: "p", tekst: "Bij 255.255.255.0 zijn de eerste drie octetten netwerk en is het laatste octet host. Korter schrijf je dat als /24: vierentwintig bits staan op 1." },
      { t: "lijst", items: [
        "Netwerkadres: alle hostbits op 0. Dat is de naam van het netwerk zelf.",
        "Broadcastadres: alle hostbits op 1. Daarmee bereik je iedereen in dat netwerk.",
        "Alles daartussen zijn bruikbare adressen voor toestellen.",
      ] },
      { t: "p", tekst: "Het aantal bruikbare adressen is 2 tot de macht hostbits, min twee — want het netwerkadres en het broadcastadres zijn al bezet." },
      { t: "tabel", kop: ["Prefix", "Masker", "Blokgrootte", "Bruikbare hosts"], rijen: [
        ["/24", "255.255.255.0", "256", "254"],
        ["/25", "255.255.255.128", "128", "126"],
        ["/26", "255.255.255.192", "64", "62"],
        ["/27", "255.255.255.224", "32", "30"],
        ["/28", "255.255.255.240", "16", "14"],
        ["/29", "255.255.255.248", "8", "6"],
        ["/30", "255.255.255.252", "4", "2"],
      ] },
      { t: "serge", tekst: "Leer de blokgroottes uit je hoofd. Met 256 min het laatste octet van het masker heb je hem zo terug." },
    ],
  },
  {
    id: "subnetten",
    titel: "Zelf subnetten",
    icoon: "✂️",
    korte: "Een netwerk opdelen, stap voor stap",
    inhoud: [
      { t: "p", tekst: "Je krijgt 192.168.20.0/24 en moet vier afdelingen bedienen van elk hoogstens vijftig toestellen. Hoe deel je dat op?" },
      { t: "lijst", items: [
        "Hoeveel hosts heb je nodig? Vijftig. Zoek de eerste macht van twee die daar boven zit: 2⁶ = 64, min twee is 62. Zes hostbits dus.",
        "Prefix = 32 − 6 = /26, oftewel masker 255.255.255.192.",
        "Blokgrootte = 256 − 192 = 64. Je telt dus met stappen van 64.",
        "Vier blokken van 64 passen precies in één /24. Dat komt goed uit.",
      ] },
      { t: "p", tekst: "Alle vier de subnetten beginnen met 192.168.20. — in de tabel staat daarom alleen het laatste octet." },
      { t: "tabel", kop: ["Afdeling", "Netwerk", "Bruikbaar", "Broadcast"], rijen: [
        ["1", ".0/26", ".1 – .62", ".63"],
        ["2", ".64/26", ".65 – .126", ".127"],
        ["3", ".128/26", ".129 – .190", ".191"],
        ["4", ".192/26", ".193 – .254", ".255"],
      ] },
      { t: "p", tekst: "Omgekeerd werkt het net zo. In welk subnet ligt 192.168.20.140/26? Blokgrootte 64, dus de grenzen liggen op 0, 64, 128 en 192. Honderdveertig zit tussen 128 en 191, dus het netwerk is 192.168.20.128 en de broadcast is 192.168.20.191." },
      { t: "serge", tekst: "In de overhoring hiernaast krijg je precies dit soort vragen. Reken ze op papier na, niet met een rekenmachine." },
    ],
  },
  {
    id: "vlan",
    titel: "VLANs",
    icoon: "🔀",
    korte: "Eén switch, meerdere gescheiden netwerken",
    inhoud: [
      { t: "p", tekst: "Standaard hoort alles wat in één switch zit bij hetzelfde netwerk. Alles wat je rondroept bereikt iedereen. Met VLANs knip je die ene switch in stukken die elkaar niet zien." },
      { t: "p", tekst: "Een toestel in VLAN 10 bereikt een toestel in VLAN 20 niet, ook al zitten ze naast elkaar in dezelfde switch. Wil je toch verkeer tussen de twee, dan heb je een router of een layer 3-switch nodig." },
      { t: "tabel", kop: ["Poortsoort", "Waarvoor", "Hoe"], rijen: [
        ["Access", "Naar één toestel", "Hoort bij precies één VLAN"],
        ["Trunk", "Tussen twee switches", "Draagt meerdere VLANs met een label"],
      ] },
      { t: "p", tekst: "Dat label heet een 802.1Q-tag. Het is twaalf bits groot, dus er passen VLAN-nummers van 1 tot 4094 in. Op een trunk ziet elk frame er dus net iets anders uit: er zit een stickertje op met het VLAN-nummer." },
      { t: "lijst", items: [
        "Minder broadcast: het geroep blijft binnen zijn eigen VLAN.",
        "Scheiding: gasten, camera's en printers hoeven elkaar niet te zien.",
        "Eenvoudiger beveiligen: je zet regels tussen VLANs in plaats van per toestel.",
      ] },
    ],
  },
  {
    id: "apparaten",
    titel: "Switch, router en firewall",
    icoon: "🧭",
    korte: "Wie doet wat, en op welke laag",
    inhoud: [
      { t: "tabel", kop: ["Apparaat", "Laag", "Kijkt naar", "Doet"], rijen: [
        ["Switch", "2", "MAC-adres", "Frames binnen één netwerk naar de juiste poort"],
        ["Router", "3", "IP-adres", "Verkeer tussen verschillende netwerken"],
        ["Firewall", "3, 4 en hoger", "Adressen, poorten, inhoud", "Beslist wat er door mag"],
        ["Access point", "1 en 2", "MAC-adres", "Een switchpoort door de lucht"],
      ] },
      { t: "p", tekst: "Een switch leert vanzelf. Komt er een frame binnen op poort 5, dan onthoudt hij: dat MAC-adres hangt aan poort 5. Weet hij het adres nog niet, dan stuurt hij het frame even naar alle poorten en kijkt wie antwoordt." },
      { t: "p", tekst: "Een router kijkt niet naar MAC-adressen maar naar IP, en heeft een routeringstabel: voor elk netwerk staat erin via welke poort het te bereiken is. Weet hij het niet, dan gaat het naar de default gateway." },
      { t: "serge", tekst: "Jouw standaard gateway is het adres van je router. Alles wat niet in je eigen subnet zit, gaat daarheen. Daarom werkt niets meer als die verkeerd staat." },
    ],
  },
  {
    id: "dhcp",
    titel: "DHCP en DNS",
    icoon: "🪪",
    korte: "Hoe je een adres krijgt en hoe namen werken",
    inhoud: [
      { t: "p", tekst: "Je typt zelf nooit een IP-adres in als je op wifi gaat. Dat regelt DHCP, in vier stappen die je kunt onthouden als DORA:" },
      { t: "lijst", items: [
        "Discover — je toestel roept: is hier een DHCP-server?",
        "Offer — de server biedt een adres aan.",
        "Request — je toestel zegt: die neem ik.",
        "Acknowledge — de server bevestigt en noteert het.",
      ] },
      { t: "p", tekst: "Je krijgt niet alleen een adres, maar ook het masker, de gateway en de DNS-servers. En een lease: een houdbaarheidsdatum, waarna je het adres opnieuw moet aanvragen." },
      { t: "p", tekst: "DNS doet iets anders: het vertaalt namen naar adressen. Jij typt een naam, je toestel vraagt het aan een resolver, die vraagt door tot bij de server die het echt weet, en het antwoord wordt een tijdje bewaard. Die bewaartijd heet de TTL." },
      { t: "serge", tekst: "Als iets het niet doet en de kabel zit erin: het is DNS. Het is bijna altijd DNS." },
    ],
  },
  {
    id: "tcpudp",
    titel: "TCP, UDP en poorten",
    icoon: "🚚",
    korte: "Betrouwbaar of snel, en waar je aanbelt",
    inhoud: [
      { t: "p", tekst: "Laag 4 regelt twee dingen: bij welk programma het verkeer hoort, en of het aankomen gegarandeerd is. Het eerste doen poortnummers, het tweede is het verschil tussen TCP en UDP." },
      { t: "tabel", kop: ["", "TCP", "UDP"], rijen: [
        ["Verbinding", "Eerst opzetten", "Gewoon versturen"],
        ["Garantie", "Alles komt aan, op volgorde", "Geen garantie"],
        ["Snelheid", "Iets trager", "Sneller, minder overhead"],
        ["Gebruikt door", "Web, mail, bestanden", "Video, spraak, games, DNS"],
      ] },
      { t: "p", tekst: "TCP begint met een handdruk in drie stappen: SYN, SYN-ACK, ACK. Pas daarna gaat er data overheen. Raakt er iets kwijt, dan wordt het opnieuw gestuurd." },
      { t: "p", tekst: "Een poortnummer loopt van 0 tot 65535. De eerste 1024 zijn gereserveerd voor bekende diensten:" },
      { t: "tabel", kop: ["Poort", "Dienst"], rijen: [
        ["22", "SSH"], ["25", "SMTP"], ["53", "DNS"], ["80", "HTTP"],
        ["443", "HTTPS"], ["3389", "Extern bureaublad"],
      ] },
      { t: "serge", tekst: "Een adres brengt je naar het gebouw. Een poortnummer zegt bij welke deur je moet aanbellen." },
    ],
  },
];

export const HOOFDSTUK_BY_ID = Object.fromEntries(HOOFDSTUKKEN.map((h) => [h.id, h]));
