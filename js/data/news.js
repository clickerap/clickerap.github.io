// De logbalk onder Pingo. Deels vaste regels, deels regels die naar je eigen
// spel verwijzen, zodat het niet klinkt als een willekeurige generator.

// De regels uit de eerste versie van het spel. Ze doen het nog steeds.
export const KLASSIEK = [
  "Pingo analyseert de netwerk-packets...",
  "Router R1 heeft een firmware update nodig.",
  "Ping naar 8.8.8.8 succesvol.",
  "Nieuwe VLAN aangemaakt.",
  "Waarschuwing: Hoge CPU-belasting op de core switch.",
  "Packet verstuurd... Packet ontvangen.",
  "Heeft iemand de server opnieuw opgestart?",
  "Access-list 'DENY_ALL' toegepast. Oeps.",
  "Nieuwe kabel besteld.",
  "Pingo overweegt een upgrade naar WiFi 7.",
  "De servers draaien op volle toeren dankzij Pingo's optimalisaties!",
  "Nieuwe AI-algoritmes detecteren ongewone netwerkactiviteit... of is het een bug?",
  "Hacker Space: Toegang geweigerd. Probeer een sterker wachtwoord.",
  "Glasvezelkabels gloeien van de activiteit, de bandbreedte is enorm!",
  "Quantum Link tot stand gebracht. De toekomst van netwerken is hier.",
  "Een datacenter is zojuist geüpgraded. Meer packets onderweg!",
  "Het datacenter verwerkt miljarden packets per seconde. Indrukwekkend.",
  "Active Directory is nu online, alle gebruikers zijn geauthenticeerd.",
  "Proxmox Cluster: nieuwe virtuele machines worden uitgerold.",
  "Het vSphere Cluster is uitgebreid, de virtualisatie is ongeëvenaard.",
  "Een gouden packet is gespot! Snel klikken!",
  "De Singulariteit is nabij... of is het al begonnen?",
  "Netwerkverkeer stijgt exponentieel, Pingo houdt het nauwlettend in de gaten.",
  "Nieuwe security patch geïnstalleerd. De verdediging is sterker dan ooit.",
  "Energieverbruik van het datacenter is historisch hoog, maar de efficiëntie ook.",
  "De matrix is geladen. Klaar voor meer packets?",
  "Snelheid is geen probleem meer, met Pingo aan het roer van het netwerk.",
  "De cyberwereld is onveilig, maar Pingo's netwerk is een fort.",
  "Geruchten over een nieuw, nog krachtiger packet circuleren...",
  "De verbinding is zo stabiel dat je er een huis op kunt bouwen.",
  "Pingo is een legende in de netwerkindustrie, zijn naam klinkt overal.",
];

// Deze verschenen vroeger pas na Evolve; nu komen ze erbij zodra je voorbij
// het miljard bent of een keer bent afgestudeerd.
export const TRANSCENDENT = [
  "Pingo is nu één met het universum.",
  "Regenbogen stromen door de glasvezelkabels.",
  "De packets hebben nu een lichtsnelheid bereikt.",
  "Het internet is nu 100% Pingo-powered.",
  "Aliens bellen: ze willen hun bandbreedte terug.",
  "De matrix is herschreven in regenboogkleuren.",
  "Oneindige packets... en nog steeds niet genoeg.",
  "Tijd en ruimte buigen voor de netwerksnelheid.",
  "Pingo heeft het einde van het internet bereikt (en het is mooi).",
  "404 Error: Limiet niet gevonden.",
  "De cloud is nu een regenboogwolk.",
  "Ping: 0ms. Overal. Altijd.",
  "Cybersecurity is nu overbodig; niemand durft Pingo aan te vallen.",
  "De servers draaien op pure kosmische energie.",
  "Elke klik creëert een nieuw universum.",
  "De firewall blokkeert nu ook slechte vibes.",
  "Pingo's aura verlicht het hele datacenter.",
  "De bits en bytes dansen de tango.",
  "Upload voltooid: Bewustzijn geüpload naar het netwerk.",
  "Het is geen bug, het is een transcendentale feature.",
];

export const GENERIC = [
  "Het netwerk draait. Niemand belt. Dit is het doel.",
  "Iemand vraagt of het aan het netwerk ligt. Het ligt niet aan het netwerk.",
  "De helpdesk meldt: probleem tussen stoel en toetsenbord.",
  "Pingo tekent een topologie op het bord. Iedereen knikt.",
  "De documentatie is bijgewerkt. Dat gebeurt niet vaak.",
  "Er ligt een switch in de gang. Niemand weet van wie.",
  "Kabelbeheer wordt volgende week aangepakt. Zoals elke week.",
  "De koffieautomaat hangt in hetzelfde VLAN als de printers. Bewust.",
  "Iemand heeft een kabel uit het patchpaneel getrokken om te zien wat er gebeurt.",
  "Er is een ticket gesloten zonder oplossing. Het probleem is weg.",
  "De ping naar de gateway is 0,4 ms. Pingo kijkt tevreden.",
  "Een student vraagt waarom subnetten nog bestaan. Pingo gaat zitten.",
  "De backup is getest. Dat is nieuws.",
  "Er staat een lege doos in het serverlokaal die er al twee jaar staat.",
  "De temperatuur in gang A is één graad gedaald. Feest.",
  "Er wordt gedebat over IPv6. Al zes jaar.",
  "De labo-opstelling van vorig semester staat er nog. Hij werkt nog steeds.",
  "Pingo vindt je topologie 'een begin'.",
  "Iemand heeft de firewallregels alfabetisch gesorteerd. Niemand durft iets te zeggen.",
  "Er hangt een briefje op de rackdeur: 'niet aankomen'. Het is niet van Pingo.",
  "Het label op poort 24 klopt niet. Het klopte ook vorig jaar al niet.",
  "De uptime-teller staat op iets waar Pingo stilletjes trots op is.",
];

export const PINGO = [
  "Pingo zegt: \"Teken het eerst uit. Dan pas configureren.\"",
  "Pingo zegt: \"Als je het niet kunt uitleggen, snap je het niet.\"",
  "Pingo zegt: \"Documentatie is geen extra. Documentatie is het werk.\"",
  "Pingo zegt: \"Een netwerk zonder monitoring is een gok.\"",
  "Pingo zegt: \"Werkt het? Goed. Waarom werkt het?\"",
  "Pingo zegt: \"Redundantie die je nooit test, is decoratie.\"",
  "Pingo zegt: \"De cloud is gewoon iemand anders zijn datacenter. Dat blijft zo.\"",
  "Pingo zegt: \"Eerst begrijpen, dan automatiseren.\"",
  "Pingo zegt: \"Er bestaat geen tijdelijke oplossing.\"",
  "Pingo zegt: \"Wie subnetten kan, kan netwerken.\"",
];

// {n} wordt vervangen door het aantal, {b} door de naam van het gebouw.
export const CONTEXTUAL = [
  "Er staan er inmiddels {n} van je {b}. Het gebouw begint vol te raken.",
  "De inventaris telt {n} keer {b}. De verzekeraar wil praten.",
  "Iemand heeft alle {n} exemplaren van je {b} genummerd. Met de hand.",
  "Op de plattegrond staan {n} keer {b} ingetekend. De plattegrond past niet meer op A3.",
  "Je {b} draait al weken zonder storing. Zeg het niet hardop.",
];

export const MILESTONE = [
  "De eerste packets zijn onderweg. Het is stil, maar het werkt.",
  "Je verkeer is nu zichtbaar in de grafieken van de provider.",
  "Er wordt over je netwerk gesproken op het vakoverleg.",
  "Andere scholen komen kijken hoe je het hebt aangepakt.",
  "Je netwerk staat op de kaart. Letterlijk, in de peering-database.",
  "Providers vragen jou om peering. Niet andersom.",
  "Je infrastructuur is groter dan die van het land waarin ze staat.",
  "Het verkeer van de planeet loopt via jouw apparatuur.",
  "Sterrenstelsels gebruiken jouw routeringstabel.",
  "Er is geen buitenkant meer aan je netwerk.",
];
