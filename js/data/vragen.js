// De vragenbank van Serge's overhoring.
//
// Rekenvragen (subnetten, binair, IPv6 afkorten) stelt quiz.js zelf op; hier
// staan de onderwerpen, de tabellen waar vragen uit gemaakt worden, en de
// vaste vragen. Elke vaste vraag heeft één goed antwoord en drie foute die
// net geloofwaardig genoeg zijn.

export const ONDERWERPEN = [
  { id: "subnetten", naam: "Subnetten", icoon: "🧮" },
  { id: "binair", naam: "Binair en hex", icoon: "🔢" },
  { id: "osi", naam: "OSI-model", icoon: "🥞" },
  { id: "poorten", naam: "Poorten", icoon: "🚪" },
  { id: "protocollen", naam: "Protocollen", icoon: "📡" },
  { id: "ios", naam: "Cisco IOS", icoon: "⌨️" },
  { id: "switching", naam: "Switching", icoon: "🔀" },
  { id: "ipv6", naam: "IPv6", icoon: "6️⃣" },
  { id: "kabels", naam: "Kabels en wifi", icoon: "🔌" },
  { id: "beveiliging", naam: "Beveiliging", icoon: "🛡️" },
];
export const ONDERWERP_BY_ID = Object.fromEntries(ONDERWERPEN.map((o) => [o.id, o]));

// Bekende poorten. `tp` is het transportprotocol, alleen waar dat eenduidig is.
export const POORTNUMMERS = [
  { naam: "FTP", poort: 21, tp: "TCP" },
  { naam: "SSH", poort: 22, tp: "TCP" },
  { naam: "Telnet", poort: 23, tp: "TCP" },
  { naam: "SMTP", poort: 25, tp: "TCP" },
  { naam: "DNS", poort: 53 },
  { naam: "DHCP", poort: 67, tp: "UDP" },
  { naam: "TFTP", poort: 69, tp: "UDP" },
  { naam: "HTTP", poort: 80 },
  { naam: "Kerberos", poort: 88 },
  { naam: "POP3", poort: 110, tp: "TCP" },
  { naam: "NTP", poort: 123, tp: "UDP" },
  { naam: "IMAP", poort: 143, tp: "TCP" },
  { naam: "SNMP", poort: 161, tp: "UDP" },
  { naam: "LDAP", poort: 389 },
  { naam: "HTTPS", poort: 443 },
  { naam: "SMB", poort: 445, tp: "TCP" },
  { naam: "Syslog", poort: 514, tp: "UDP" },
  { naam: "RADIUS", poort: 1812, tp: "UDP" },
  { naam: "RDP", poort: 3389 },
];

// De zeven lagen, met wat er op die laag reist en wat er werkt.
export const OSI = [
  { laag: 1, naam: "Fysieke laag", pdu: "Bits", apparaat: "Hub" },
  { laag: 2, naam: "Datalinklaag", pdu: "Frames", apparaat: "Switch" },
  { laag: 3, naam: "Netwerklaag", pdu: "Pakketten", apparaat: "Router" },
  { laag: 4, naam: "Transportlaag", pdu: "Segmenten" },
  { laag: 5, naam: "Sessielaag" },
  { laag: 6, naam: "Presentatielaag" },
  { laag: 7, naam: "Applicatielaag" },
];
// Protocollen die eenduidig op één laag horen.
export const OSI_PROTOCOLLEN = [
  { naam: "HTTP", laag: 7 }, { naam: "DNS", laag: 7 }, { naam: "SSH", laag: 7 }, { naam: "SMTP", laag: 7 },
  { naam: "TCP", laag: 4 }, { naam: "UDP", laag: 4 },
  { naam: "IP", laag: 3 }, { naam: "ICMP", laag: 3 }, { naam: "OSPF", laag: 3 },
  { naam: "Ethernet", laag: 2 }, { naam: "STP", laag: 2 },
];

const v = (onderwerp, vraag, goed, fout, uitleg) => ({ onderwerp, vraag, goed, fout, uitleg });

export const FEITEN = [
  // --- OSI-model
  v("osi", "Hoeveel lagen heeft het OSI-model?", "7", ["4", "5", "8"], "Van de fysieke laag tot de applicatielaag: zeven."),
  v("osi", "Hoeveel lagen heeft het TCP/IP-model zoals de CCNA het leert?", "4", ["5", "7", "3"], "Netwerktoegang, internet, transport en applicatie."),
  v("osi", "Welke laag zorgt ervoor dat data betrouwbaar en in de juiste volgorde aankomt?", "Transportlaag", ["Netwerklaag", "Sessielaag", "Datalinklaag"], "Daar werkt TCP, met volgnummers en bevestigingen."),
  v("osi", "Op welke laag worden IP-adressen gebruikt?", "Netwerklaag", ["Datalinklaag", "Transportlaag", "Fysieke laag"], "Laag 3 regelt de logische adressering en de route."),
  v("osi", "Op welke laag worden MAC-adressen gebruikt?", "Datalinklaag", ["Netwerklaag", "Fysieke laag", "Transportlaag"], "Laag 2 regelt de fysieke adressering op het lokale netwerk."),
  v("osi", "Wat gebeurt er met data als ze door de lagen naar beneden gaat?", "Elke laag voegt een eigen header toe", ["Elke laag haalt een header weg", "De data wordt kleiner", "Er gebeurt niets"], "Dat heet encapsulatie. Aan de andere kant pelt elke laag zijn header er weer af."),

  // --- Protocollen
  v("protocollen", "Welk protocol vertaalt een domeinnaam naar een IP-adres?", "DNS", ["DHCP", "ARP", "NAT"], "DNS is het telefoonboek van het internet."),
  v("protocollen", "Welk protocol deelt automatisch IP-adressen uit aan toestellen?", "DHCP", ["DNS", "ARP", "SNMP"], "Discover, Offer, Request, Acknowledge: DORA."),
  v("protocollen", "Welk protocol zoekt het MAC-adres dat bij een IP-adres hoort?", "ARP", ["RARP", "DNS", "ICMP"], "ARP roept rond op het lokale netwerk: wie heeft dit IP-adres?"),
  v("protocollen", "Welk protocol gebruikt ping?", "ICMP", ["UDP", "ARP", "TCP"], "Ping stuurt een ICMP echo request en wacht op een echo reply."),
  v("protocollen", "Welk transportprotocol zet eerst een verbinding op met een three-way handshake?", "TCP", ["UDP", "ICMP", "IP"], "SYN, SYN-ACK, ACK. Pas dan gaat er data over."),
  v("protocollen", "Welk transportprotocol is verbindingsloos: snel, maar zonder garantie dat alles aankomt?", "UDP", ["TCP", "HTTP", "FTP"], "Handig voor bellen en streamen, waar een verloren stukje minder erg is dan vertraging."),
  v("protocollen", "Hoe gaat de three-way handshake van TCP?", "SYN, SYN-ACK, ACK", ["SYN, ACK, FIN", "HELLO, ACK, DONE", "ACK, SYN, SYN-ACK"], "Vragen, bevestigen en terugvragen, bevestigen."),
  v("protocollen", "Welke techniek laat een heel lokaal netwerk met één publiek adres het internet op?", "NAT", ["DNS", "DHCP", "ARP"], "Network Address Translation, meestal als PAT met poortnummers."),
  v("protocollen", "Welk protocol houdt de klok van netwerkapparaten gelijk?", "NTP", ["SNMP", "SMTP", "FTP"], "Juiste tijden zijn nodig voor logs en certificaten."),
  v("protocollen", "Met welk protocol volg je netwerkapparaten op en vraag je hun status op?", "SNMP", ["SMTP", "NTP", "SSH"], "Simple Network Management Protocol."),
  v("protocollen", "Welk protocol stuurt e-mail door tussen mailservers?", "SMTP", ["POP3", "IMAP", "HTTP"], "POP3 en IMAP zijn om mail op te halen, SMTP om hem te versturen."),
  v("protocollen", "Welk routeringsprotocol werkt met areas, met area 0 als ruggengraat?", "OSPF", ["RIP", "BGP", "STP"], "Open Shortest Path First, een link-state-protocol."),
  v("protocollen", "Welk routeringsprotocol verbindt de grote netwerken van het internet met elkaar?", "BGP", ["OSPF", "RIP", "EIGRP"], "Het Border Gateway Protocol, tussen autonome systemen."),
  v("protocollen", "Wat is het hoogste aantal hops dat RIP nog bereikbaar vindt?", "15", ["16", "255", "30"], "Bij 16 hops is een netwerk voor RIP onbereikbaar."),
  v("protocollen", "Wat doet HTTPS dat HTTP niet doet?", "Het verkeer versleutelen met TLS", ["Sneller laden", "UDP gebruiken", "Alleen via wifi werken"], "Niemand onderweg kan meelezen of iets aanpassen."),
  v("protocollen", "Welke standaardgateway gebruikt een toestel?", "Die van zijn eigen subnet", ["Die met het laagste adres", "Altijd 8.8.8.8", "Die van de DNS-server"], "Verkeer naar een ander netwerk gaat eerst naar de router in je eigen subnet."),

  // --- Cisco IOS
  v("ios", "Welk commando toont een kort overzicht van de interfaces met hun IP-adres?", "show ip interface brief", ["show running-config", "show vlan brief", "show mac address-table"], "Kort: sh ip int br."),
  v("ios", "Hoe bewaar je de configuratie zodat ze een herstart overleeft?", "copy running-config startup-config", ["copy startup-config running-config", "reload", "show startup-config"], "Of korter: write memory."),
  v("ios", "In welke modus zit je bij de prompt Switch(config-if)#?", "Interfaceconfiguratie", ["Globale configuratie", "Bevoorrechte modus", "Gebruikersmodus"], "Wat je nu typt, geldt voor één interface."),
  v("ios", "Welke prompt hoort bij de bevoorrechte modus?", "Switch#", ["Switch>", "Switch(config)#", "Switch(config-if)#"], "Het hekje: je mag alles bekijken en configureren."),
  v("ios", "Welk commando zet een interface aan?", "no shutdown", ["shutdown", "enable", "interface up"], "Interfaces op een router staan standaard administratief uit."),
  v("ios", "Welk commando brengt je van de bevoorrechte modus naar de configuratiemodus?", "configure terminal", ["enable", "config mode", "setup"], "Kort: conf t."),
  v("ios", "Welk commando versleutelt de wachtwoorden die nog leesbaar in de configuratie staan?", "service password-encryption", ["enable secret", "encrypt all", "no password"], "Zwakke versleuteling, maar een meekijker ziet ze zo niet meer."),
  v("ios", "Waarom gebruik je enable secret en niet enable password?", "Het wachtwoord wordt als hash bewaard", ["Het is korter", "Het werkt ook zonder console", "Het vernieuwt zichzelf"], "enable password staat leesbaar in de configuratie."),
  v("ios", "Welk commando toont de routeringstabel?", "show ip route", ["show route table", "show ip interface brief", "show arp"], "C voor direct verbonden, S voor statisch, O voor OSPF."),
  v("ios", "Welk commando toont de MAC-adrestabel van een switch?", "show mac address-table", ["show arp", "show mac", "show interfaces"], "Welk MAC-adres achter welke poort zit."),
  v("ios", "Wat doet do in de configuratiemodus?", "Een commando uit de bevoorrechte modus uitvoeren", ["De configuratie bewaren", "Een commando ongedaan maken", "Terug naar de gebruikersmodus"], "Bijvoorbeeld do show run, zonder de configuratie te verlaten."),
  v("ios", "Met welke toets vul je een commando aan op een Cisco-apparaat?", "Tab", ["Enter", "?", "Ctrl+C"], "En met ? zie je wat er op die plek mag staan."),
  v("ios", "Waar staat de startup-config?", "NVRAM", ["RAM", "Flash", "ROM"], "De running-config staat in RAM, het besturingssysteem in flash."),
  v("ios", "Waar staat de running-config?", "RAM", ["NVRAM", "Flash", "ROM"], "Daarom ben je hem kwijt bij een herstart als je niet bewaart."),
  v("ios", "Welk commando geeft een VLAN op een switch een naam?", "name, in de VLAN-configuratie", ["hostname", "description", "vlan name"], "Eerst vlan 20, dan name LEERLINGEN."),
  v("ios", "Met welk commando zet je een banner die iedereen bij het inloggen ziet?", "banner motd", ["banner login", "motd", "description"], "Message of the day, tussen twee scheidingstekens: banner motd #tekst#."),

  // --- Switching
  v("switching", "Welk protocol voorkomt loops in een netwerk met switches?", "STP", ["OSPF", "VTP", "CDP"], "Spanning Tree zet overbodige verbindingen op blokkeren."),
  v("switching", "Wat is het standaard-VLAN op een Cisco-switch?", "VLAN 1", ["VLAN 0", "VLAN 10", "VLAN 4094"], "Alle poorten zitten daar standaard in. Daarom gebruik je het beter niet."),
  v("switching", "Welke standaard zet een VLAN-tag in een frame op een trunk?", "802.1Q", ["802.11", "802.3", "802.1X"], "Een tag van 4 bytes met onder meer het VLAN-nummer."),
  v("switching", "Wat is het hoogste VLAN-nummer dat je kunt gebruiken?", "4094", ["4096", "1024", "255"], "12 bits geven 4096 waarden; 0 en 4095 zijn gereserveerd."),
  v("switching", "Waarop beslist een switch waar een frame heen moet?", "Het MAC-adres van de bestemming", ["Het IP-adres van de bestemming", "Het MAC-adres van de bron", "Het TCP-poortnummer"], "Het bron-MAC gebruikt hij om zijn tabel te vullen."),
  v("switching", "Wat doet een switch met een frame naar een MAC-adres dat hij niet kent?", "Het naar alle poorten sturen behalve de ingang", ["Het weggooien", "Het terugsturen", "Het aan de router vragen"], "Dat heet flooding."),
  v("switching", "Hoe lang onthoudt een Cisco-switch standaard een MAC-adres?", "300 seconden", ["30 seconden", "Een uur", "Voor altijd"], "Wie vijf minuten niets zegt, wordt vergeten."),
  v("switching", "Welke poortmodus draagt het verkeer van meerdere VLAN's?", "Trunk", ["Access", "Voice", "Native"], "Een accesspoort zit in één VLAN."),
  v("switching", "Wat heb je nodig om verkeer tussen twee VLAN's door te laten?", "Een router of een layer 3-switch", ["Een hub", "Een extra accesspoort", "Een repeater"], "Elk VLAN is een eigen subnet."),
  v("switching", "Hoeveel bits heeft een MAC-adres?", "48", ["32", "64", "128"], "Twaalf hexadecimale tekens."),
  v("switching", "Wat is het broadcast-MAC-adres?", "FF:FF:FF:FF:FF:FF", ["00:00:00:00:00:00", "FF:FF:FF:00:00:00", "01:00:5E:00:00:00"], "Alle bits op 1: iedereen op het lokale netwerk."),
  v("switching", "Welk deel van een MAC-adres zegt welke fabrikant het maakte?", "De eerste 24 bits", ["De laatste 24 bits", "De eerste 8 bits", "Het hele adres"], "Die heten de OUI."),
  v("switching", "Wat is een broadcastdomein?", "Het deel van het netwerk dat een broadcast bereikt", ["Eén kabel", "Alles achter één switchpoort", "Het hele internet"], "Een router of een VLAN-grens houdt een broadcast tegen."),

  // --- IPv6
  v("ipv6", "Hoeveel bits heeft een IPv6-adres?", "128", ["32", "64", "256"], "Acht groepen van 16 bits, in hexadecimaal."),
  v("ipv6", "Hoeveel bits heeft een IPv4-adres?", "32", ["16", "64", "128"], "Vier octetten van 8 bits."),
  v("ipv6", "Wat is het loopbackadres in IPv6?", "::1", ["::", "fe80::1", "127.0.0.1"], "127.0.0.1 is het loopbackadres in IPv4."),
  v("ipv6", "Met welk prefix beginnen link-local-adressen in IPv6?", "fe80::/10", ["2000::/3", "ff00::/8", "fc00::/7"], "Elke IPv6-interface maakt er zelf een."),
  v("ipv6", "Met welk prefix beginnen multicastadressen in IPv6?", "ff00::/8", ["fe80::/10", "2000::/3", "::/128"], "Broadcast bestaat niet meer in IPv6; multicast neemt het over."),
  v("ipv6", "Welke adressen zijn global unicast in IPv6?", "2000::/3", ["fe80::/10", "fc00::/7", "ff00::/8"], "De adressen die op het internet gerouteerd worden."),
  v("ipv6", "Hoe vaak mag :: in één IPv6-adres staan?", "Eén keer", ["Twee keer", "Zo vaak je wil", "Nooit"], "Anders weet niemand meer hoeveel nullen er waar weg zijn."),
  v("ipv6", "Wat vervangt ARP in IPv6?", "Neighbor Discovery", ["DHCPv6", "ICMP echo", "RARP"], "NDP gebruikt ICMPv6-berichten."),
  v("ipv6", "Hoe heet het als een toestel zelf een IPv6-adres maakt uit het prefix van de router?", "SLAAC", ["DHCP", "NAT64", "EUI-128"], "Stateless Address Autoconfiguration."),

  // --- Kabels en wifi
  v("kabels", "Hoe lang mag een UTP-kabel hoogstens zijn?", "100 meter", ["50 meter", "185 meter", "1 kilometer"], "Daarna wordt het signaal te zwak."),
  v("kabels", "Welke kleur heeft de eerste ader bij T568B?", "Wit-oranje", ["Wit-groen", "Oranje", "Blauw"], "Wit-oranje, oranje, wit-groen, blauw, wit-blauw, groen, wit-bruin, bruin."),
  v("kabels", "Welke kleur heeft de eerste ader bij T568A?", "Wit-groen", ["Wit-oranje", "Groen", "Bruin"], "T568A wisselt het oranje en het groene paar om."),
  v("kabels", "Welke kabel gebruik je tussen een pc en een switch?", "Een rechte kabel", ["Een gekruiste kabel", "Een consolekabel", "Een coaxkabel"], "Moderne poorten draaien het zelf om als het moet (auto-MDIX)."),
  v("kabels", "Met welke kabel beheer je een switch via zijn consolepoort?", "Een consolekabel (rollover)", ["Een rechte kabel", "Een gekruiste kabel", "Een glasvezelkabel"], "Of vandaag vaak een usb-consolekabel."),
  v("kabels", "Welke connector zit er aan een UTP-netwerkkabel?", "RJ45", ["RJ11", "LC", "BNC"], "RJ11 is de kleinere telefoonstekker."),
  v("kabels", "Welk soort glasvezel overbrugt de grootste afstanden?", "Single-mode", ["Multimode", "Cat6", "Coax"], "Eén lichtpad, met een laser in plaats van een led."),
  v("kabels", "Waar staat de U voor in UTP?", "Unshielded", ["Universal", "Ultra", "Uplink"], "Unshielded Twisted Pair: gedraaide paren zonder afscherming."),
  v("kabels", "Welke wifiband komt het verst?", "2,4 GHz", ["5 GHz", "6 GHz", "60 GHz"], "Lagere frequenties gaan beter door muren, maar zijn drukker."),
  v("kabels", "Hoeveel kanalen overlappen niet in de 2,4 GHz-band?", "3", ["13", "1", "24"], "Kanaal 1, 6 en 11."),
  v("kabels", "Welke IEEE-standaard hoort bij wifi?", "802.11", ["802.3", "802.1Q", "802.15"], "802.3 is Ethernet."),
  v("kabels", "Welke IEEE-standaard hoort bij Ethernet?", "802.3", ["802.11", "802.1D", "802.5"], "802.5 was Token Ring. Die bestaat nog, in de patchkast."),
  v("kabels", "Wat is de nieuwste beveiliging voor wifi?", "WPA3", ["WEP", "WPA", "WPA2"], "WEP kraak je in een paar minuten."),
  v("kabels", "Waarom zijn de aders in een UTP-kabel in elkaar gedraaid?", "Om storing en overspraak tegen te gaan", ["Om de kabel sterker te maken", "Om kleuren te sparen", "Om hem korter te maken"], "Storing werkt op beide aders van een paar ongeveer even hard, en valt zo weg."),

  // --- Beveiliging
  v("beveiliging", "Wat is phishing?", "Iemand lokken met een valse mail of site om gegevens te stelen", ["Een virus dat bestanden versleutelt", "Een server overspoelen met verkeer", "Wifi afluisteren"], "Kijk altijd naar de afzender en de link voor je klikt."),
  v("beveiliging", "Wat doet ransomware?", "Je bestanden versleutelen en losgeld vragen", ["Je wachtwoorden raden", "Je scherm op zwart zetten", "Reclame tonen"], "Goede back-ups, offline, zijn de beste verdediging."),
  v("beveiliging", "Wat is een DDoS-aanval?", "Een server overspoelen met verkeer van heel veel toestellen", ["Eén wachtwoord raden", "Een kabel doorknippen", "Een virus via usb"], "Distributed Denial of Service."),
  v("beveiliging", "Wat doet een firewall?", "Verkeer toelaten of tegenhouden volgens regels", ["IP-adressen uitdelen", "Namen vertalen", "Verkeer versnellen"], "Wat niet uitdrukkelijk mag, wordt vaak tegengehouden."),
  v("beveiliging", "Waar staat AAA voor?", "Authentication, Authorization, Accounting", ["Access, Allow, Audit", "Admin, Account, Access", "Always Approve Access"], "Wie ben je, wat mag je, en wat heb je gedaan."),
  v("beveiliging", "Wat houdt least privilege in?", "Iedereen krijgt alleen de rechten die hij nodig heeft", ["Iedereen krijgt adminrechten", "Wachtwoorden zijn kort", "Alleen de directie mag inloggen"], "Zo beperk je de schade als een account misbruikt wordt."),
  v("beveiliging", "Wat doet port security op een switch?", "Beperken welke MAC-adressen op een poort mogen", ["Poorten versleutelen", "Poorten sneller maken", "VLAN's aanmaken"], "Een onbekend toestel inpluggen zet de poort dan uit."),
  v("beveiliging", "Welk protocol gebruik je beter niet, omdat alles onversleuteld gaat?", "Telnet", ["SSH", "HTTPS", "SFTP"], "Wachtwoorden gaan bij Telnet leesbaar over het netwerk."),
  v("beveiliging", "Wat is tweestapsverificatie?", "Naast je wachtwoord nog iets dat je hebt, zoals een code op je gsm", ["Twee keer hetzelfde wachtwoord typen", "Twee wachtwoorden hebben", "Elke twee dagen een nieuw wachtwoord"], "Iets wat je weet, en iets wat je hebt."),
  v("beveiliging", "Wat is een VPN?", "Een versleutelde tunnel over een onveilig netwerk", ["Een snellere internetverbinding", "Een soort antivirus", "Een virtueel VLAN"], "Alsof je kabel rechtstreeks in het netwerk van de school zit."),
  v("beveiliging", "Wat is een sterk wachtwoord?", "Lang, uniek, en liefst een zin", ["Je geboortedatum", "Kort met één hoofdletter", "Hetzelfde als op je andere accounts"], "Lengte telt meer dan ingewikkelde tekens."),

  // --- Binair en eenheden
  v("binair", "Hoeveel bits zitten er in een byte?", "8", ["4", "16", "10"], "Een octet van een IPv4-adres is ook 8 bits."),
  v("binair", "Hoeveel Mbps is 1 Gbps?", "1000", ["100", "1024", "10000"], "Bij bits per seconde reken je in machten van 10."),
  v("binair", "Wat meet je in Mbps?", "Hoeveel miljoen bits per seconde er over gaan", ["Hoeveel megabyte er op een schijf past", "Hoe ver een signaal komt", "Hoeveel pakketten er verloren gaan"], "Bits, met een kleine b. Een grote B is een byte."),
  v("binair", "Wat is het grootste getal dat in 8 bits past?", "255", ["256", "128", "512"], "Alle acht bits op 1: 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1."),
  v("binair", "Hoeveel bits heeft één hexadecimaal teken?", "4", ["8", "2", "16"], "Van 0 tot F: zestien waarden, dus vier bits."),
];
