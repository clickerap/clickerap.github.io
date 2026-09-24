// Rekent de balans door op de echte speldata.
// Draaien met:  npm run balans
//          of:  node tools/balans.mjs [uren] [kliks per seconde] [afstuderen: ja|nee]
//
// Een denkbeeldige speler heeft het tabblad de hele tijd open en klikt in een
// vast tempo. Hij koopt elke betaalbare upgrade en telkens het apparaat met de
// kortste terugverdientijd. Hij studeert af zodra dat zijn bonus uit
// studiepunten minstens verdubbelt, en koopt dan de goedkoopste knooppunten in
// de studieboom.
// Gouden packets, het labo en offline tijd tellen niet mee: de uitkomst is dus
// een bovengrens voor hoe lang het duurt.

import {
  G, D, BUILDINGS, NODES, recompute, earn, buyBuilding, buyUpgrade, availableUpgrades,
  checkAchievements, nextCost, graduate, ectsOnGraduate, buyNode, touch,
} from "../js/state.js";
import { BONUS_PER_PUNT } from "../js/data/skilltree.js";
import { fmtLong } from "../js/format.js";

const MAX_UREN = Number(process.argv[2]) || 300;
const KLIKS = Number(process.argv[3] ?? 2);
const AFSTUDEREN = process.argv[4] !== "nee";
const MIN_RUN = 20 * 60; // seconden

recompute();
const eersteKeer = {};
const afgestudeerd = [];
let t = 0;
let runStart = 0;

function koopAlles() {
  touch();
  for (const u of availableUpgrades()) if (G.packets >= u.cost) buyUpgrade(u.id);
  for (;;) {
    let beste = null;
    for (const b of BUILDINGS) {
      const kost = nextCost(b.id);
      const r = kost / (D.perBuilding[b.id] || b.basePps);
      if (!beste || r < beste.r) beste = { b, r, kost };
    }
    if (G.packets < beste.kost) break;
    buyBuilding(beste.b.id, 1);
  }
}

function koopKnooppunten() {
  for (;;) {
    const kan = NODES.filter((n) => !G.nodes[n.id] && n.needs.every((x) => G.nodes[x]) && G.ects >= n.cost)
      .sort((a, b) => a.cost - b.cost);
    if (!kan.length || !buyNode(kan[0].id)) break;
  }
}

while (t < MAX_UREN * 3600) {
  earn(D.pps);
  earn(D.clickValue * KLIKS, { handmade: true });
  G.stats.clicks += KLIKS;
  t += 1;
  if (t % 5 === 0) koopAlles();
  if (t % 10 === 0) checkAchievements();
  for (const b of BUILDINGS) if (!eersteKeer[b.id] && G.buildings[b.id] > 0) eersteKeer[b.id] = t;

  const winst = AFSTUDEREN ? ectsOnGraduate() : 0;
  // De bonus is 1 + BONUS_PER_PUNT x punten; hij verdubbelt als de winst
  // minstens even groot is als alles wat je al had, plus 1 / BONUS_PER_PUNT.
  if (winst > 0 && t - runStart >= MIN_RUN && winst >= G.prestige + 1 / BONUS_PER_PUNT) {
    graduate();
    afgestudeerd.push({ uur: t / 3600, punten: G.prestige });
    koopKnooppunten();
    runStart = t;
  }
}

const uur = (s) => (s / 3600).toFixed(1).replace(".", ",");
console.log(`Simulatie van ${MAX_UREN} uur, ${KLIKS} kliks per seconde.\n`);
console.log("Eerste keer in bezit:");
for (const b of BUILDINGS) {
  console.log(`  ${b.name.padEnd(24)} ${eersteKeer[b.id] ? `na ${uur(eersteKeer[b.id])} uur` : "niet gehaald"}`);
}
console.log(`\nAfgestudeerd: ${afgestudeerd.length} keer`);
for (const a of afgestudeerd.slice(0, 12)) console.log(`  na ${a.uur.toFixed(1).replace(".", ",")} uur, ${a.punten} studiepunten totaal`);
if (afgestudeerd.length > 12) console.log(`  ... en nog ${afgestudeerd.length - 12} keer`);
console.log(`\nAan het eind: ${fmtLong(D.pps)} per seconde, ${fmtLong(G.stats.lifetime)} verdiend, ${G.prestige} studiepunten.`);
console.log(`Vermenigvuldigers: koffie x${D.koffieMult.toFixed(2)}, studiepunten x${D.prestigeMult.toFixed(2)}, alles x${D.allMult.toFixed(2)}, ${D.aantalUpgrades} upgrades, ${D.aantalPrestaties} prestaties.`);
console.log("Bezit en opbrengst per apparaat:");
for (const b of BUILDINGS) {
  const n = G.buildings[b.id] || 0;
  if (!n) continue;
  console.log(`  ${b.name.padEnd(24)} ${String(n).padStart(4)} stuks, x${D.buildingMult[b.id].toFixed(0).padStart(6)}, ${((D.perBuilding[b.id] * n) / D.pps * 100).toFixed(1).padStart(5)}% van de productie`);
}
