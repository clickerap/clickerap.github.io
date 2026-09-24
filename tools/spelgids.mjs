// Genereert SPELGIDS.md uit de databestanden.
// Draaien met:  node tools/spelgids.mjs
//
// Alles wat hieronder uit BUILDINGS, UPGRADES enzovoort komt, klopt dus
// automatisch met het spel. Alleen de uitleg over de easter eggs en de
// console staat met de hand in dit bestand.

import { writeFileSync } from "node:fs";
import { BUILDINGS, VAKKEN, TIER_AT, TIER_COST } from "../js/data/buildings.js";
import { UPGRADES } from "../js/data/upgrades.js";
import { ACHIEVEMENTS, CATEGORIEEN, EGG_COUNT, KOFFIE_RANKS } from "../js/data/achievements.js";
import { NODES, BRANCHES, ECTS_BASIS, STUDIE_OPEN, BONUS_PER_PUNT } from "../js/data/skilltree.js";
import { BUFFS, HAZARDS, INCIDENTS } from "../js/data/buffs.js";
import { VERBINDINGEN, MATEN, WERK, DREMPELS, PROTOCOLLEN } from "../js/data/patch.js";
import { GOEDEREN, GOED_BY_ID, KOPPEN, MARKT } from "../js/data/market.js";
import { UITERLIJK, SOORTNAMEN, ALLE_SKINS, RANGEN } from "../js/data/uiterlijk.js";
import { HOOFDSTUKKEN } from "../js/data/cursus.js";
import { TAKEN } from "../js/data/terminal.js";
import { ONDERWERPEN, FEITEN } from "../js/data/vragen.js";
import { REKENVRAGEN } from "../js/minigames/quiz.js";

const nl = new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 2 });
const SCHAAL = [
  [1e30, "quintiljoen"], [1e27, "quadriljard"], [1e24, "quadriljoen"],
  [1e21, "triljard"], [1e18, "triljoen"], [1e15, "biljard"],
  [1e12, "biljoen"], [1e9, "miljard"], [1e6, "miljoen"],
];

function getal(n) {
  if (n < 1e6) return nl.format(n);
  for (const [waarde, woord] of SCHAAL) {
    if (n >= waarde) return `${nl.format(Number((n / waarde).toPrecision(3)))} ${woord}`;
  }
  return nl.format(n);
}

const r = [];
const kop = (niveau, tekst) => { r.push(`${"#".repeat(niveau)} ${tekst}`); r.push(""); };
const p = (tekst) => { r.push(tekst); r.push(""); };
const tabel = (kolommen, rijen) => {
  r.push(`| ${kolommen.join(" | ")} |`);
  r.push(`|${kolommen.map(() => "---").join("|")}|`);
  for (const rij of rijen) r.push(`| ${rij.join(" | ")} |`);
  r.push("");
};

// ------------------------------------------------------------------ Kop

p("# Serge Clicker — volledige spelgids");
p("");
p("> **Let op: hier staat alles in, ook alle verborgen dingen.** Wil je zelf zoeken, lees dan niet verder dan het hoofdstuk over de studieboom.");
p("");
p(`Dit bestand is gemaakt met \`node tools/spelgids.mjs\` en volgt de spelbestanden. Op dit moment: **${BUILDINGS.length} apparaten**, **${UPGRADES.length} upgrades**, **${ACHIEVEMENTS.length} prestaties** (waarvan ${EGG_COUNT} verborgen), **${NODES.length} knooppunten** in de studieboom en **5 onderdelen** in het labo.`);

// -------------------------------------------------------------- Basis

kop(2, "Hoe het spel werkt");
p("Je klikt op Serge en verdient packets. Met packets koop je apparaten die vanzelf packets opleveren, en upgrades die alles versnellen. Hoe verder je komt, hoe meer het spel zichzelf speelt — en hoe meer er opengaat.");
p("");
p("De volgorde waarin dingen vrijkomen:");
p("");
p(`1. **Winkel** — meteen. Klik tot je ${BUILDINGS[0].baseCost} packets hebt voor je eerste ${BUILDINGS[0].name.toLowerCase()}.`);
p("2. **Upgrades** — zodra je er een verdient (tien kliks geeft de eerste al).");
p("3. **Prestaties** — meteen zichtbaar, ze vullen zich vanzelf.");
p("4. **Labo** — bij 5.000 packets totaal. Daarbinnen gaat elke opdracht apart open.");
p(`5. **Studie** — bij ${getal(STUDIE_OPEN)} packets totaal. Vanaf ${getal(ECTS_BASIS)} kun je voor het eerst afstuderen.`);
p("");
p("Sneltoetsen: **spatie** klikt, **1 / 2 / 3 / 4** zetten het aantal per aankoop op 1, 10, 100 of max, en **G** pakt een gouden packet. Het tandwiel rechtsboven opent statistieken, instellingen en opslag.");

// ---------------------------------------------------------- Apparaten

kop(2, "De apparaten");
p("Elk volgend exemplaar van hetzelfde apparaat kost 15% meer dan het vorige. De opbrengst hieronder is de basis, vóór upgrades, vakbonus, koffie en studiepunten.");
p("");
tabel(
  ["#", "Apparaat", "Vak", "Eerste prijs", "Opbrengst per stuk"],
  BUILDINGS.map((b, i) => [
    i + 1,
    `${b.icon} **${b.name}**`,
    VAKKEN[b.vak].name,
    getal(b.baseCost),
    `${getal(b.basePps)} p/s`,
  ])
);
p("**Vakbonus.** Elk apparaat hoort bij een vak. Elke 25 apparaten binnen één vak geven dat hele vak 2% extra productie. De vier vakken: " +
  Object.values(VAKKEN).map((v) => `${v.icon} ${v.name}`).join(", ") + ".");

// ----------------------------------------------------------- Upgrades

const perSoort = {};
for (const u of UPGRADES) (perSoort[u.kind] ||= []).push(u);

kop(2, "De upgrades");
p(`In totaal ${UPGRADES.length} stuks. Ze verschijnen vanzelf in het tabblad zodra je aan de voorwaarde voldoet, en blijven staan tot je ze koopt.`);
p("");
tabel(
  ["Soort", "Aantal", "Wat het doet"],
  [
    ["Apparaat", perSoort.gebouw.length, "Verdubbelt de opbrengst van één apparaat"],
    ["Klikken", perSoort.klik.length, "Meer packets per klik"],
    ["Gouden packets", perSoort.goud.length, "Vaker, langer of sterker"],
    ["Assistenten", perSoort.team.length, "Productie stijgt mee met je prestaties"],
    ["Synergie", perSoort.synergie.length, "Het ene apparaat maakt het andere beter"],
    ["Specialisatie", perSoort.vak.length, "Verdubbelt een heel vak"],
    ["Studie", perSoort.studie.length, "Alleen na je eerste diploma"],
  ]
);

kop(3, "Apparaat-upgrades");
p(`Elk apparaat heeft er vijf. Ze komen vrij bij ${TIER_AT.join(", ")} exemplaren en kosten respectievelijk ${TIER_COST.map((c) => `${c}x`).join(", ")} de basisprijs van dat apparaat. Elke upgrade verdubbelt de opbrengst van dat apparaat.`);
for (const b of BUILDINGS) {
  p("");
  p(`**${b.icon} ${b.name}**`);
  p("");
  for (let i = 0; i < b.tiers.length; i++) {
    p(`${i + 1}. *${b.tiers[i][0]}* — bij ${TIER_AT[i]} stuks, ${getal(b.baseCost * TIER_COST[i])} packets. ${b.tiers[i][1]}`);
  }
}

for (const [sleutel, titel] of [
  ["klik", "Klik-upgrades"],
  ["goud", "Gouden-packet-upgrades"],
  ["team", "Assistenten"],
  ["synergie", "Synergie"],
  ["vak", "Specialisaties"],
  ["studie", "Studie-upgrades"],
]) {
  kop(3, titel);
  tabel(
    ["Upgrade", "Prijs", "Effect"],
    perSoort[sleutel].map((u) => [`${u.icon} **${u.name}**`, getal(u.cost), u.note || u.desc])
  );
}

// -------------------------------------------------------------- Buffs

kop(2, "Gouden packets, rode packets en storingen");
p("Om de anderhalve tot vier minuten verschijnt er ergens op je scherm een packet. Klik je een gouden packet aan, dan krijg je een tijdelijke bonus. Rode packets moet je juist laten staan.");
p("");
kop(3, "Gouden packets");
tabel(
  ["Bonus", "Duur", "Effect"],
  BUFFS.map((b) => [
    `${b.icon} **${b.name}**`,
    b.instant ? "meteen" : b.charges ? `${b.charges} kliks` : `${b.duration} s`,
    b.desc,
  ])
);
kop(3, "Rode packets");
p("Rode packets verschijnen pas als je ooit een miljard packets hebt verdiend of één keer bent afgestudeerd, en ongeveer één op de vijf keer. Klik je er een aan, dan krijg je een van deze drie:");
p("");
tabel(
  ["Straf", "Duur", "Effect"],
  HAZARDS.map((h) => [`${h.icon} **${h.name}**`, h.instant ? "meteen" : `${h.duration} s`, h.desc])
);
p("Laat je er een vanzelf verdwijnen, dan gebeurt er niets — en de eerste keer dat je dat doet levert het een prestatie op. Twee upgrades maken rode packets minder erg, en één maakt ze zelfs nuttig. Een straf blijft staan als je de pagina herlaadt.");

kop(3, "Storingen");
p("Af en toe gaat er iets stuk in je netwerk. Je krijgt dan onder Serge twee knoppen: betalen voor noodherstel, of het laten lopen en 60 tot 100 seconden minder produceren. Reageer je niet binnen 45 seconden, dan geldt het als negeren.");
p("");
tabel(
  ["Storing", "Kosten van herstel", "Straf bij negeren"],
  INCIDENTS.map((i) => [
    i.text,
    `${i.costPps}x je productie per seconde`,
    `${Math.round((1 - i.penalty.ppsMult) * 100)}% minder gedurende ${i.penalty.duration} s`,
  ])
);

// ------------------------------------------------------------- Koffie

kop(2, "Koffie en assistenten");
p(`Elke prestatie die je haalt, zet je koffiepeil hoger: ${ACHIEVEMENTS.length - 1} prestaties is een vol kopje ("Koffie op" telt zelf niet mee). Op zichzelf doet dat niets — tot je assistenten koopt. Die worden sterker naarmate er meer koffie is, en dat is het krachtigste vermenigvuldiger van het hele spel.`);
p("");
tabel(["Koffiepeil", "Rang"], KOFFIE_RANKS.map(([peil, naam]) => [`${Math.round(peil * 100)}%`, naam]));

// ------------------------------------------------------------- Studie

kop(2, "Afstuderen en de studieboom");
p(`Vanaf ${getal(ECTS_BASIS)} packets totaal kun je afstuderen. Je verliest je packets, apparaten en upgrades, maar je houdt je prestaties, je koffiepeil en de hele studieboom — en je krijgt studiepunten.`);
p("");
p("Het aantal punten hangt af van hoeveel cijfers je totaal heeft: 0,3 × (cijfers − 9)³. Een totaal met elf cijfers geeft 2 punten, met vijftien cijfers 64, met twintig cijfers 399 en met dertig cijfers 2.778. Elk extra cijfer levert dus iets meer op dan het vorige, maar de punten schieten niet meer door het dak: wie alles gebouwd heeft, komt rond de 3.000 uit, net genoeg voor de hele studieboom.");
p("");
p(`Elk studiepunt geeft daarnaast blijvend ${Math.round(BONUS_PER_PUNT * 100)}% extra productie, ook de punten die je alweer uitgegeven hebt. Afstuderen loont het meest als je bonus uit studiepunten er minstens door verdubbelt.`);
p(`De boom heeft ${BRANCHES.length} takken van zes knooppunten. In een tak koop je van links naar rechts. Aan het eind van twee naburige takken zit een kruisknoop die ze allebei vraagt, en helemaal rechts het doctoraat, dat alle kruisknopen vraagt. Samen kost de boom ${NODES.reduce((som, n) => som + n.cost, 0)} studiepunten.`);
p("");
for (const tak of BRANCHES) {
  kop(3, `${tak.icon} ${tak.name} — ${tak.desc}`);
  tabel(
    ["Knooppunt", "Kosten", "Effect"],
    NODES.filter((n) => n.branch === tak.id).map((n) => [`${n.icon} **${n.name}**`, `${n.cost} punten`, n.note])
  );
}
kop(3, "🔗 Kruisknopen en het doctoraat");
tabel(
  ["Knooppunt", "Vraagt", "Kosten", "Effect"],
  NODES.filter((n) => n.branch === "kruis").map((n) => [
    `${n.icon} **${n.name}**`,
    n.needs.map((id) => NODES.find((x) => x.id === id).name).join(" en "),
    `${n.cost} punten`,
    n.note,
  ])
);

// --------------------------------------------------------------- Labo

kop(2, "Het labo");
p("Vijf onderdelen achter één tabblad. De cursus staat er meteen; de rest gaat apart open.");

kop(3, "📚 Cursus");
p(`Altijd beschikbaar. ${HOOFDSTUKKEN.length} korte hoofdstukken over de basis van netwerken — geen spel, maar de theorie waar de overhoring en de terminal op leunen. Elk hoofdstuk dat je voor het eerst uitleest levert packets op: minstens 1.000, of dertig seconden van je productie. De knop daarvoor staat onderaan het hoofdstuk en gaat pas open na een korte leestijd.`);
p("");
tabel(
  ["Hoofdstuk", "Waarover"],
  HOOFDSTUKKEN.map((h, i) => [`${i + 1}. ${h.icoon} **${h.titel}**`, h.korte])
);

kop(3, "📝 Serge's overhoring");
p("Vraagt 5.000 packets totaal. Je krijgt een vraag met vier antwoorden. Goed antwoord levert packets op — minstens 500, of 90 seconden van je productie, wat het meest is — plus 10% extra per goed antwoord op rij, tot twee keer zoveel. Na een goed antwoord duurt het 2,5 minuut voor de volgende vraag; na een fout antwoord de helft, en je reeks begint opnieuw. Na elk antwoord legt Serge kort uit waarom het goede antwoord klopt.");
p("");
p(`Bovenaan kies je een onderwerp, of je laat alles door elkaar komen. Er zijn ${ONDERWERPEN.length} onderwerpen. Rekenvragen — subnetten, binair en hex, poortnummers, OSI-lagen en IPv6 afkorten — worden ter plekke opgesteld en nagerekend, dus die zijn eindeloos. Daarnaast zijn er ${FEITEN.length} vaste vragen over protocollen, IOS, switching, kabels, wifi en beveiliging. Een vaste vraag komt niet terug zolang er in dat onderwerp nog andere klaarliggen.`);
p("");
tabel(
  ["Onderwerp", "Soort vragen"],
  ONDERWERPEN.map((o) => {
    const reken = REKENVRAGEN[o.id]?.length || 0;
    const vast = FEITEN.filter((f) => f.onderwerp === o.id).length;
    return [`${o.icoon} **${o.naam}**`, [reken && `${reken} ${reken === 1 ? "soort" : "soorten"} rekenvragen`, vast && `${vast} vaste vragen`].filter(Boolean).join(" en ")];
  })
);
p("");
p("**Oefenvragen.** Terwijl je wacht op de volgende vraag, kun je oefenvragen doen. Die leveren niets op, maar een fout antwoord kost je reeks ook niet.");

kop(3, "⌨️ Terminal");
p("Vraagt één netwerk switch. Een nagebouwde command line die zich gedraagt als een switch die nog opgezet moet worden — inclusief de eigenaardigheden van een echte IOS-CLI.");
p("");
p("**Afkortingen werken.** Elk woord mag je inkorten tot het nog eenduidig is, precies zoals op een echt apparaat: `en`, `conf t`, `int gi0/1`, `ip add`, `no shut`, `sh ip int br`, `wr`. Is een afkorting dubbelzinnig, dan zegt hij welke woorden er nog passen.");
p("");
p("**Tab vult aan.** Eén woord dat past wordt afgemaakt; passen er meerdere, dan vult hij aan tot waar ze gelijk zijn en toont hij de mogelijkheden. **?** laat zien wat er op deze plek mag staan, met uitleg erbij — ook midden in een commando.");
p("");
p("**Serge schrijft opdrachten uit.** Rond je er een af met `write memory`, dan krijg je packets: minstens 2.500, of anderhalve tot drieënhalve minuut van je productie, naargelang hoe moeilijk de opdracht is. Anderhalve minuut later ligt de volgende klaar. Nooit twee keer na elkaar dezelfde soort, en hoe meer opdrachten je afwerkt, hoe meer soorten er kunnen komen.");
p("");
const NA = ["meteen", "na 1 opdracht", "na 3 opdrachten", "na 6 opdrachten"];
const vanaf = (niveau) => NA[niveau] || NA[NA.length - 1];
// De voorbeelden zijn willekeurig. Met een vaste reeks getallen blijft de gids
// gelijk als je hem opnieuw maakt.
const willekeurig = Math.random;
let zaad = 7;
Math.random = () => ((zaad = (zaad * 16807) % 2147483647) - 1) / 2147483646;
tabel(
  ["Opdracht", "Komt", "Levert", "Bijvoorbeeld"],
  Object.values(TAKEN).map((t) => [`**${t.naam}**`, vanaf(t.niveau), `${nl.format(t.seconden / 60)} min productie`, t.tekst(t.maak({ hostname: "SERGE" }))])
);
Math.random = willekeurig;
p("");
p("De volledige reeks voor de eerste opdracht ziet er zo uit:");
p("");
p(["```", "en", "conf t", "int gi0/3", "ip add 10.42.7.1 255.255.255.0", "no shut", "end", "wr", "```"].join("\n"));
p("");
p("Voor de andere opdrachten kent de switch ook `hostname`, `description`, `shutdown`, `vlan` met `name`, `switchport mode access` en `switchport access vlan`, `ip default-gateway`, `banner motd #tekst#` en `enable secret`. Met `show running-config`, `show ip interface brief` en `show vlan brief` zie je wat er al staat — handig bij foutzoeken, waar Serge niet zegt wat er mis is.");
p("");
p("Ook de andere gewoontes van een echt apparaat werken: `copy run start` in plaats van `wr`, `do` voor commando's uit de bevoorrechte modus terwijl je aan het configureren bent (`do show ip int br`, `do wr`), `interface GigabitEthernet 0/1` met een spatie, en rechtstreeks van de ene interface naar de andere springen. Op een telefoon staan er knoppen voor Tab en ? onder de invoer.");

kop(3, "📈 Bandbreedtemarkt");
p(`Vraagt één serverrack. Zes goederen met koersen die elke vijf seconden bewegen, ook als je naar iets anders kijkt. Je koopt voor ${MARKT.koopMinuten.join(", ").replace(/, (\d+)$/, " of $1")} minuten productie, met hooguit ${MARKT.limietMinuten} minuten productie per goed. Zo groeit de markt mee met je netwerk, en niet met wat je hebt opgespaard. Verkopen kan voor de helft of alles. Alleen je winst telt mee als verdiend, je inleg niet.`);
p("");
p(`Na een aankoop kun je een positie vanzelf laten verkopen: bij ${MARKT.winstOrders.map((w) => `+${Math.round(w * 100)}%`).join(", ")} winst, of bij ${MARKT.verliesOrders.map((w) => `−${Math.round(w * 100)}%`).join(" of ")} verlies. Die orders gaan ook af als je naar een ander tabblad kijkt, zolang het spel openstaat.`);
p("");
tabel(
  ["Goed", "Beweeglijkheid", "Karakter"],
  GOEDEREN.map((g) => [`${g.icon} ${g.naam}`, `${Math.round(g.vol * 100)}%`, g.profiel])
);
p(`Nieuws duwt een koers meteen omhoog of omlaag. Geruchten werken pas later: na ${MARKT.geruchtNa.map((n) => n * MARKT.tikMs / 1000).join(" tot ")} seconden blijkt of ze kloppen, en ${Math.round(MARKT.geruchtWaar * 10)} op de 10 keer doen ze dat. Elk goed heeft daarnaast een trend die af en toe omslaat, en elke koers trekt langzaam terug naar 100.`);
p("");
tabel(
  ["Bericht", "Goed", "Effect"],
  KOPPEN.map((k) => [
    `${k.gerucht ? "*Gerucht:* " : ""}${k.tekst}`,
    `${GOED_BY_ID[k.goed].icon} ${GOED_BY_ID[k.goed].naam}`,
    `${k.factor > 1 ? "+" : "−"}${Math.round(Math.abs(k.factor - 1) * 100)}%${k.gerucht ? " als het uitkomt" : ""}`,
  ])
);

kop(3, "🗄️ Patchkast");
p(`Vraagt één glasvezel. Serge legt werkorders uit de school in de bak: elke ${WERK.interval} seconden één, tot er ${WERK.wachtrij} klaarliggen. Dat loopt ook door als het spel dicht is. Een werkorder is een kabelgoot met aansluitingen die per twee hetzelfde label en dezelfde kleur hebben. Je trekt een kabel van de ene aansluiting naar de andere, vak voor vak, zonder over een andere kabel of aansluiting te gaan. Sleep je over een andere kabel, dan wordt die afgeknipt.`);
p("");
p(`Liggen alle kabels, dan kun je opleveren. Ligt bovendien elk vak van de goot vol, dan is de goot **luchtdicht** en levert de order ${Math.round((WERK.luchtdicht - 1) * 100)}% meer op. Elke goot kan luchtdicht. Kom je er niet uit, dan legt **Vraag Serge** één kabel zoals in zijn oplossing; dat kost telkens ${Math.round(WERK.hulpKost * 100)}% van het loon, tot je nog ${Math.round(WERK.hulpMinimum * 100)}% overhoudt.`);
p("");
p("Een order betaalt een vast aantal seconden van je productie, zonder tijdelijke buffs. Grotere goten gaan open naarmate je meer protocollen hebt:");
p("");
tabel(
  ["Goot", "Kabels", "Loon", "Luchtdicht", "Open vanaf"],
  Object.entries(MATEN).map(([n, m]) => [
    `${n} bij ${n}`,
    `${m.paren[0]} of ${m.paren[1]}`,
    `${m.seconden} s productie`,
    `${m.seconden * WERK.luchtdicht} s productie`,
    m.vanafProtocollen ? `${m.vanafProtocollen} ${m.vanafProtocollen === 1 ? "protocol" : "protocollen"}` : "meteen",
  ])
);
p(`De aansluitingen: ${VERBINDINGEN.map((v) => `**${v.label}** (${v.naam})`).join(", ")}.`);
p("");
p("Na genoeg opgeleverde werkorders komt het volgende protocol vrij. Elk protocol geeft blijvend 2% extra productie op alles, ook na het afstuderen.");
p("");
tabel(
  ["Protocol", "Vrij na", "Wat het is"],
  Object.values(PROTOCOLLEN).map((proto, i) => [`${proto.icon} **${proto.naam}**`, `${DREMPELS[i]} werkorders`, proto.uitleg])
);

// ----------------------------------------------------------- Uiterlijk

kop(2, "Uiterlijk");
p(`Onder het tandwiel rechtsboven kies je hoe je spel eruitziet. ${Object.keys(UITERLIJK).length} losse keuzes die je vrij combineert: ${Object.values(SOORTNAMEN).map((n) => n.toLowerCase()).join(", ").replace(/, (?=[^,]*$)/, " en ")}. Samen ${ALLE_SKINS.length} dingen om vrij te spelen, elk met een zeldzaamheid: gewoon, ongewoon, zeldzaam, episch, legendarisch, mythisch of goddelijk. Wat je eenmaal hebt, houd je ook na het afstuderen. Met **Verras me** kies je van elke soort iets willekeurigs uit wat je al hebt. Sneeuw, bloesem, vlinders en herfstbladeren speel je vrij in hun seizoen, het avondlicht door 's avonds te spelen.`);
p("");
for (const soort of Object.keys(UITERLIJK)) {
  kop(3, SOORTNAMEN[soort]);
  tabel(
    [SOORTNAMEN[soort], "Hoe je hem vrijspeelt"],
    UITERLIJK[soort].map((v) => [
      `${v.icoon ? `${v.icoon} ` : ""}**${v.naam}** *(${RANGEN[v.rang].naam.toLowerCase()})* — ${v.beschrijving}`,
      v.hoe || "Heb je vanaf het begin",
    ])
  );
}
p("De geëvolueerde Serge is de opvolger van de oude Evolve-knop: bij een miljard packets verdiend krijg je een melding en kun je hem omzetten.");

// --------------------------------------------------------- Prestaties

kop(2, "Alle prestaties");
p(`${ACHIEVEMENTS.length} stuks. De verborgen staan in het volgende hoofdstuk.`);
for (const cat of CATEGORIEEN) {
  if (cat === "Verborgen") continue;
  kop(3, cat);
  tabel(
    ["Prestatie", "Hoe"],
    ACHIEVEMENTS.filter((a) => a.cat === cat).map((a) => [`${a.icon} **${a.name}**`, a.desc])
  );
}

// ------------------------------------------------------- Verborgen deel

kop(2, "Verborgen: de easter eggs");
p(`Er zitten ${EGG_COUNT} verborgen dingen in het spel. Elk levert een eigen prestatie op en meestal een handvol packets. Ze staan nergens in het spel uitgelegd — hieronder wel.`);
p("");
tabel(
  ["Prestatie", "Hoe je hem vindt"],
  [
    ["🕹️ Up, up, down, down", "Typ de Konami-code: ↑ ↑ ↓ ↓ ← → ← → b a"],
    ["🧔 Naamsvermelding", "Typ ergens in het spel het woord `serge`"],
    ["👃 Op de neus", "Klik tien keer precies in het midden van de foto"],
    ["📰 Persmuskiet", "Klik vijfentwintig keer op de zwarte logbalk onder Serge"],
    ["🔢 Telfout", "Klik vijftig keer op het grote getal bovenaan"],
    ["😎 Elite", "Zorg dat je precies 1337 packets in bezit hebt (wordt elke 20 seconden nagekeken, dus makkelijkst aan het begin)"],
    ["🐋 Het antwoord", "Bezit precies 42 exemplaren van één apparaat"],
    ["🧘 Geduld", "Laat het spel tien minuten openstaan zonder te klikken of te typen"],
    ["🖲️ Contextmenu", "Rechtsklik tien keer op Serge"],
    ["📶 Reply from 8.8.8.8", "Typ `ping` in de terminal"],
    ["🔓 sudo", "Typ een commando dat begint met `sudo` in de terminal"],
    ["🏷️ Vendor lock-in", "Typ `cisco` in de terminal"],
    ["🔌 no shutdown", "Typ `no shutdown` op een interface die al up staat"],
    ["💀 rm -rf /", "Typ `rm -rf /` in de terminal"],
    ["🍝 Kabelsalade", "Typ het woord `hackerman`"],
    ["🕐 13:37", "Wees om 13:37 in het spel"],
    ["🌃 Nachtdienst", "Speel tussen drie en vier uur 's nachts"],
    ["💍 Token Ring", `Ontdek Token Ring in de patchkast: dat gebeurt na ${DREMPELS[0]} opgeleverde werkorders`],
    ["🔎 Kleine lettertjes", "Klik drie keer op het versienummer onderaan het tandwiel-paneel"],
    ["🚪 Achterdeur", "Klik zeven keer op datzelfde versienummer"],
  ]
);
p("Haal je er tien, dan krijg je **🗺️ Zoeker**. Haal je ze allemaal, dan krijg je **🏆 Alles gevonden**. Die twee tellen niet mee als easter egg zelf.");

kop(2, "Verborgen: de console");
p("Klik in het tandwiel-paneel rechtsboven zeven keer op het versienummer onder **Over**. Er verschijnt dan een invoerveld waarmee je het spel rechtstreeks kunt aansturen. Bedoeld om te testen; wie hem gebruikt krijgt geen straf, alleen een merkteken op de save.");
p("");
tabel(
  ["Commando", "Wat het doet"],
  [
    ["`add 1e9`", "Voegt packets toe (telt niet mee voor je totaal, dus ook niet voor studiepunten)"],
    ["`set 1000`", "Zet je aantal packets op een vast getal"],
    ["`pps 500`", "Zet ongeveer die productie per seconde neer door switches bij te maken"],
    ["`gebouw switch 100`", "Zet het aantal van één apparaat. De id's staan hieronder."],
    ["`upgrades`", "Geeft alle upgrades vrij"],
    ["`prestaties`", "Geeft alle prestaties vrij"],
    ["`skins`", "Geeft alles van Uiterlijk vrij: portretten, ringen, achtergronden, klikeffecten, klikgeluiden en titels"],
    ["`punten 50`", "Voegt studiepunten toe"],
    ["`goud`", "Laat meteen een gouden packet verschijnen"],
    ["`reset`", "Wist alle actieve buffs en straffen"],
  ]
);
p("De id's voor `gebouw`: " + BUILDINGS.map((b) => `\`${b.id}\``).join(", ") + ".");
p("");
p("Onzichtbaar maar aanwezig: in de browserconsole bestaat `serge.pps`, `serge.packets` en `serge.hint`.");

kop(2, "Technisch");
p("- Je voortgang staat in localStorage van je eigen browser en wordt elke twintig seconden bewaard, plus bij het sluiten van het tabblad.");
p("- Er zijn drie opslagbestanden. Met **Kopieer code** krijg je een tekstcode waarmee je je voortgang op een ander toestel kunt inladen. Een import kun je daarna nog ongedaan maken.");
p("- Open je het spel in twee tabbladen op hetzelfde bestand, dan slaat alleen het nieuwste tabblad nog op, zodat ze elkaars voortgang niet overschrijven.");
p("- Ben je weg geweest, dan krijg je een deel van je gemiste productie terug: standaard 40% over maximaal twee uur, op te schroeven tot 100% over 24 uur via de tak Beheer in de studieboom.");
p("- Staat het tabblad op de achtergrond, dan telt die tijd volledig mee tot een uur. Een buff telt daarbij alleen zolang hij duurde.");
p("- Saves van de allereerste versie van het spel worden automatisch omgezet: packets, apparaten, kliks en gouden packets komen mee, en wie destijds Evolve had gehaald krijgt daar een studiepunt voor.");
p("- Het spel gebruikt ES-modules, dus `index.html` los openen werkt niet. Via GitHub Pages of een lokale webserver wel (`npm start`).");

// Dubbele lege regels opruimen; de helpers voegen er soms een te veel toe.
const tekst = r.join("\n").replace(/\n{3,}/g, "\n\n").trimStart() + "\n";
writeFileSync(new URL("../SPELGIDS.md", import.meta.url), tekst, "utf8");
console.log(`SPELGIDS.md geschreven: ${tekst.split("\n").length} regels`);
