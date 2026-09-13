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
import { NODES, BRANCHES } from "../js/data/skilltree.js";
import { BUFFS, HAZARDS, INCIDENTS } from "../js/data/buffs.js";
import { KABELS, PROTOCOLLEN } from "../js/data/patch.js";
import { GOEDEREN } from "../js/data/market.js";
import { UITERLIJK, SOORTNAMEN, ALLE_SKINS } from "../js/data/uiterlijk.js";

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
p(`Dit bestand is gemaakt met \`node tools/spelgids.mjs\` en volgt de spelbestanden. Op dit moment: **${BUILDINGS.length} apparaten**, **${UPGRADES.length} upgrades**, **${ACHIEVEMENTS.length} prestaties** (waarvan ${EGG_COUNT} verborgen), **${NODES.length} knooppunten** in de studieboom en **4 opdrachten** in het labo.`);

// -------------------------------------------------------------- Basis

kop(2, "Hoe het spel werkt");
p("Je klikt op Serge en verdient packets. Met packets koop je apparaten die vanzelf packets opleveren, en upgrades die alles versnellen. Hoe verder je komt, hoe meer het spel zichzelf speelt — en hoe meer er opengaat.");
p("");
p("De volgorde waarin dingen vrijkomen:");
p("");
p("1. **Winkel** — meteen. Klik tot je zes packets hebt voor je eerste patchkabel.");
p("2. **Upgrades** — zodra je er een verdient (tien kliks geeft de eerste al).");
p("3. **Prestaties** — meteen zichtbaar, ze vullen zich vanzelf.");
p("4. **Labo** — bij 5.000 packets totaal. Daarbinnen gaat elke opdracht apart open.");
p("5. **Studie** — bij 100 miljard packets totaal. Daarna kun je afstuderen.");
p("");
p("Sneltoetsen: **spatie** klikt, **1 / 2 / 3 / 4** zetten het aantal per aankoop op 1, 10, 100 of max. Het tandwiel rechtsboven opent statistieken, instellingen en opslag.");

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
    b.instant ? "Een kwartier productie in één keer" : b.desc,
  ])
);
kop(3, "Rode packets");
p("Rode packets verschijnen pas als je ooit een miljard packets hebt verdiend of één keer bent afgestudeerd, en ongeveer één op de vijf keer. Klik je er een aan, dan krijg je een van deze drie:");
p("");
tabel(
  ["Straf", "Duur", "Effect"],
  HAZARDS.map((h) => [`${h.icon} **${h.name}**`, h.instant ? "meteen" : `${h.duration} s`, h.desc])
);
p("Laat je er een vanzelf verdwijnen, dan gebeurt er niets — en de eerste keer dat je dat doet levert het een prestatie op. Twee upgrades maken rode packets minder erg, en één maakt ze zelfs nuttig.");

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
p(`Elke prestatie die je haalt, zet je koffiepeil hoger: ${ACHIEVEMENTS.length} prestaties is een vol kopje. Op zichzelf doet dat niets — tot je assistenten koopt. Die worden sterker naarmate er meer koffie is, en dat is het krachtigste vermenigvuldiger van het hele spel.`);
p("");
tabel(["Koffiepeil", "Rang"], KOFFIE_RANKS.map(([peil, naam]) => [`${Math.round(peil * 100)}%`, naam]));

// ------------------------------------------------------------- Studie

kop(2, "Afstuderen en de studieboom");
p("Vanaf een biljoen packets totaal kun je afstuderen. Je verliest je packets, apparaten en upgrades, maar je houdt je prestaties, je koffiepeil en de hele studieboom — en je krijgt studiepunten.");
p("");
p("Het aantal punten is de derdemachtswortel van je totaal gedeeld door een biljoen. In gewone taal: elk volgend punt kost meer dan het vorige, dus verder spelen loont, maar oneindig doorgaan niet.");
p("");
p("Elk studiepunt geeft daarnaast blijvend 1% extra productie, ook de punten die je alweer uitgegeven hebt.");
for (const tak of BRANCHES) {
  kop(3, `${tak.icon} ${tak.name} — ${tak.desc}`);
  tabel(
    ["Knooppunt", "Kosten", "Effect"],
    NODES.filter((n) => n.branch === tak.id).map((n) => [`${n.icon} **${n.name}**`, `${n.cost} punten`, n.note])
  );
}

// --------------------------------------------------------------- Labo

kop(2, "Het labo");
p("Vier opdrachten achter één tabblad. Ze gaan apart open.");

kop(3, "📝 Serge's overhoring");
p("Vraagt 5.000 packets totaal. Je krijgt een subnetvraag met vier antwoorden. Goed antwoord levert packets op — minstens 500, of 90 seconden van je productie, wat het meest is — plus 12% extra per goed antwoord op rij, tot drie keer zoveel. Na een goed antwoord duurt het 2,5 minuut voor de volgende vraag; na een fout antwoord ruim een minuut, en je reeks begint opnieuw.");
p("");
p("De vragen worden ter plekke opgesteld en ter plekke nagerekend, dus ze zijn eindeloos. Zes soorten: netwerkadres, broadcastadres, aantal bruikbare hosts, subnetmasker bij een prefix, het kleinste subnet voor een aantal hosts, en of twee adressen in hetzelfde subnet zitten.");

kop(3, "⌨️ Terminal");
p("Vraagt één netwerk switch. Een nagebouwde command line die zich gedraagt als een switch die nog opgezet moet worden. Typ `?` voor de lijst. De echte volgorde werkt: `enable`, `configure terminal`, `interface gi0/1`, `ip address 10.0.0.1 255.255.255.0`, `no shutdown`. Zet je de interface volledig goed op, dan krijg je een bonus en een prestatie. `write memory` levert eenmalig ook wat op.");

kop(3, "📈 Bandbreedtemarkt");
p("Vraagt één serverrack. Zes goederen met koersen die elke vijf seconden bewegen, ook als je niet kijkt. Met **+** investeer je een tiende van je packets, met **−** verkoop je alles van dat goed. Wat je terugkrijgt hangt alleen af van hoe de koers bewoog sinds je instapte, dus je kunt de markt niet gebruiken om je productie te ontlopen.");
p("");
tabel(["Goed", "Beweeglijkheid"], GOEDEREN.map((g) => [`${g.icon} ${g.naam}`, `${Math.round(g.vol * 100)}%`]));
p("Af en toe komt er nieuws voorbij dat één koers hard omhoog of omlaag duwt. Koersen keren langzaam terug naar 100.");

kop(3, "🗄️ Patchkast");
p("Vraagt één glasvezel. Een patchpaneel van 36 poorten. Je kiest een kabelsoort, legt hem in een vrije poort en wacht tot hij rijp is. Oogsten levert packets op.");
p("");
p("Het echte doel is kruisen: staan er bij de poort die je oogst twee **verschillende rijpe** kabels naast (boven, onder, links of rechts), en vormen die samen een recept, dan heb je 55% kans om dat protocol te ontdekken. Elk ontdekt protocol geef je blijvend 2% extra productie op alles, en je kunt het daarna zelf leggen.");
p("");
tabel(
  ["Kabel", "Groeitijd", "Opbrengst"],
  Object.values(KABELS).map((k) => [`${k.icon} ${k.naam}`, `${k.groei} s`, `${k.waarde}x`])
);
p("**De recepten:**");
p("");
tabel(
  ["Protocol", "Kruising van", "Groeitijd"],
  Object.entries(PROTOCOLLEN).map(([, def]) => {
    const namen = def.paar.map((s) => (KABELS[s] || PROTOCOLLEN[s]).naam).join(" + ");
    return [`${def.icon} **${def.naam}**`, namen, `${def.groei} s`];
  })
);

// ----------------------------------------------------------- Uiterlijk

kop(2, "Uiterlijk");
p(`Onder het tandwiel rechtsboven kies je hoe je spel eruitziet. Drie losse keuzes die je vrij combineert: welke foto, welke ring eromheen en welke kleuren de pagina krijgt. Samen ${ALLE_SKINS.length} dingen om vrij te spelen, en wat je eenmaal hebt houd je ook na het afstuderen.`);
p("");
for (const soort of Object.keys(UITERLIJK)) {
  kop(3, SOORTNAMEN[soort]);
  tabel(
    [SOORTNAMEN[soort], "Hoe je hem vrijspeelt"],
    UITERLIJK[soort].map((v) => [`**${v.naam}** — ${v.beschrijving}`, v.hoe || "Heb je vanaf het begin"])
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
    ["💍 Token Ring", "Ontdek Token Ring in de patchkast (UTP naast Coax)"],
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
p("- Er zijn drie opslagbestanden. Met **Kopieer code** krijg je een tekstcode waarmee je je voortgang op een ander toestel kunt inladen.");
p("- Ben je weg geweest, dan krijg je een deel van je gemiste productie terug: standaard 40% over maximaal twee uur, op te schroeven tot 100% over 24 uur via de tak Beheer in de studieboom.");
p("- Staat het tabblad op de achtergrond, dan telt die tijd volledig mee tot een uur.");
p("- Saves van de allereerste versie van het spel worden automatisch omgezet: packets, apparaten, kliks en gouden packets komen mee, en wie destijds Evolve had gehaald krijgt daar een studiepunt voor.");
p("- Het spel gebruikt ES-modules, dus `index.html` los openen werkt niet. Via GitHub Pages of een lokale webserver wel.");

// Dubbele lege regels opruimen; de helpers voegen er soms een te veel toe.
const tekst = r.join("\n").replace(/\n{3,}/g, "\n\n").trimStart() + "\n";
writeFileSync(new URL("../SPELGIDS.md", import.meta.url), tekst, "utf8");
console.log(`SPELGIDS.md geschreven: ${tekst.split("\n").length} regels`);
