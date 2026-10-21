// Een playtest zoals een speler het spel speelt: klikken, kopen, upgraden,
// afstuderen, de studieboom en de minigames, allemaal via de echte knoppen
// en de echte invoer. Alleen de tijd spoelen we af en toe door, door packets
// toe te voegen.

import { test } from "node:test";
import assert from "node:assert/strict";
import { openSpel, staat } from "./hulp.mjs";

const spel = (page, fn, arg) => page.evaluate(fn, arg);
// Doorspoelen: zoveel packets erbij alsof je een tijd had gespeeld.
const spoelDoor = (page, packets, lifetime = packets) =>
  spel(page, async ({ packets, lifetime }) => {
    const { G, recompute } = await import("/js/state.js");
    G.packets += packets;
    G.stats.lifetime += lifetime;
    G.stats.runLifetime += lifetime;
    recompute();
  }, { packets, lifetime });
// Wachten tot iets in de spelstaat klopt. waitForFunction wacht niet op een
// async functie, dus zelf pollen.
async function wachtOp(page, fn, ms = 5000) {
  const eind = Date.now() + ms;
  while (Date.now() < eind) {
    if (await page.evaluate(fn)) return;
    await page.waitForTimeout(100);
  }
  throw new Error(`wachtOp: ${fn}`);
}
const sluitVensters = (page) => page.evaluate(() => document.querySelectorAll("dialog[open]").forEach((d) => d.close()));
// Klikken zoals een speler: springt er een venster voor (een nieuw portret,
// welkom terug), dan eerst dat wegklikken.
async function klik(page, sel, opties = {}) {
  for (let poging = 0; poging < 5; poging++) {
    await sluitVensters(page);
    try {
      await page.click(sel, { timeout: 2000, ...opties });
      return;
    } catch {
      await page.waitForTimeout(150);
    }
  }
  await page.click(sel, opties);
}

test("playtest: van de eerste klik tot afstuderen en de studieboom", async () => {
  const { page, context, fouten } = await openSpel();

  // 1. Klikken levert packets op, in een tempo dat een mens haalt (sneller
  // telt bewust niet mee, tegen autoclickers).
  for (let i = 0; i < 25; i++) {
    await klik(page, "#egres");
    await page.waitForTimeout(70);
  }
  let s = await staat(page);
  assert.equal(s.clicks, 25);
  assert.ok(s.packets >= 25, `na 25 kliks ${s.packets} packets`);

  // 2. De eerste patchkabel in de winkel.
  await spoelDoor(page, 50);
  await klik(page, '.shopitem:has-text("Patchkabel")');
  s = await staat(page);
  assert.equal(s.buildings.patchkabel, 1);
  assert.ok(s.pps > 0, "een patchkabel levert iets op");

  // 3. Per tien kopen, met de knop bovenaan.
  await spoelDoor(page, 1e6);
  await klik(page, '[data-amount="10"]');
  await klik(page, '.shopitem:has-text("Patchkabel")');
  await klik(page, '.shopitem:has-text("Netwerk Switch")');
  s = await staat(page);
  assert.equal(s.buildings.patchkabel, 11);
  assert.equal(s.buildings.switch, 10);
  const ppsVoorUpgrade = s.pps;

  // 4. Een upgrade kopen in het tweede tabblad.
  // Met een muis koopt één klik op de tegel hem meteen; op een telefoon kies
  // je eerst en koop je met de knop eronder.
  await klik(page, "#upgrades-tab");
  await klik(page, ".uptegel.betaalbaar");
  const upgrades = await spel(page, async () => Object.keys((await import("/js/state.js")).G.upgrades).length);
  assert.ok(upgrades >= 1, "de upgrade is gekocht");
  s = await staat(page);
  assert.ok(s.pps >= ppsVoorUpgrade, "een upgrade maakt het nooit slechter");

  // 5. Afstuderen via de studiekaart.
  await spoelDoor(page, 0, 1e13);
  // Het tabblad gaat bij de volgende tik open.
  await page.waitForSelector("#studie-tab:not(.op-slot)");
  await klik(page, "#studie-tab");
  await klik(page, "#graduate-btn");
  await page.click('#modal-actions button:has-text("Afstuderen")');
  const naAfstuderen = await spel(page, async () => {
    const { G } = await import("/js/state.js");
    return { prestige: G.prestige, ects: G.ects, patchkabel: G.buildings.patchkabel || 0, packets: G.packets };
  });
  assert.ok(naAfstuderen.prestige > 0 && naAfstuderen.ects === naAfstuderen.prestige, "studiepunten gekregen");
  assert.equal(naAfstuderen.patchkabel, 0, "de apparaten zijn weg");

  // 6. De studieboom met de muis: eerst de voorganger, dan de rest.
  await sluitVensters(page);
  const p2 = page.locator('.boom .node[data-id="p2"]');
  await sluitVensters(page);
  await p2.click({ force: true });
  assert.equal(await spel(page, async () => !!(await import("/js/state.js")).G.nodes.p2), false, "p2 zonder p1 gaat niet");
  const klikVoor = await spel(page, async () => (await import("/js/state.js")).D.clickValue);
  await klik(page, '.boom .node[data-id="p1"]', { force: true });
  await klik(page, '.boom .node[data-id="s1"]', { force: true });
  const naBoom = await spel(page, async () => {
    const { G, D } = await import("/js/state.js");
    return { p1: !!G.nodes.p1, s1: !!G.nodes.s1, klik: D.clickValue, ects: G.ects };
  });
  assert.ok(naBoom.p1 && naBoom.s1, "knooppunten gekocht");
  assert.ok(naBoom.klik > klikVoor, "Praktijk maakt een klik meer waard");
  assert.equal(naBoom.ects, naAfstuderen.ects - 2, "de knooppunten kosten één punt per stuk");
  assert.equal(await page.getAttribute('.boom .node[data-id="p1"]', "class").then((c) => c.includes("bezit")), true, "de knop toont dat je hem hebt");

  // 7. Alles blijft na herladen.
  await spel(page, async () => (await import("/js/save.js")).save());
  await page.reload();
  await page.waitForFunction(() => typeof window.egres?.pps === "number");
  const naHerladen = await spel(page, async () => {
    const { G } = await import("/js/state.js");
    return { prestige: G.prestige, p1: !!G.nodes.p1, s1: !!G.nodes.s1, clicks: G.stats.clicks };
  });
  assert.equal(naHerladen.prestige, naAfstuderen.prestige);
  assert.ok(naHerladen.p1 && naHerladen.s1);
  assert.equal(naHerladen.clicks, 25);

  assert.deepEqual(fouten, []);
  await context.close();
});

test("playtest: de terminal en de overhoring via de echte invoer", async () => {
  const { page, context, fouten } = await openSpel();
  await spoelDoor(page, 1e7, 1e7);
  await klik(page, '.shopitem:has-text("Patchkabel")');
  await klik(page, '.shopitem:has-text("Netwerk Switch")');

  // Terminal: de opdracht die er ligt, intikken zoals een leerling dat zou doen.
  await klik(page, "#labo-tab");
  assert.equal((await staat(page)).buildings.switch, 1, "een switch gekocht");
  await klik(page, '#labo button[data-id="cli"]');
  await page.waitForSelector("#term-in");
  await wachtOp(page, async () => !!(await import("/js/state.js")).G.minigames.cli.opdracht);
  for (let ronde = 0; ronde < 3; ronde++) {
    const opdracht = await spel(page, async () => {
      const { G } = await import("/js/state.js");
      const { TAKEN } = await import("/js/data/terminal.js");
      const o = G.minigames.cli.opdracht;
      return o ? { soort: o.soort, regels: TAKEN[o.soort].oplossing(o) } : null;
    });
    assert.ok(opdracht, "er ligt een opdracht klaar");
    const voor = await staat(page);
    for (const regel of opdracht.regels) {
      await page.fill("#term-in", regel);
      await page.press("#term-in", "Enter");
    }
    const na = await spel(page, async () => {
      const { G } = await import("/js/state.js");
      return { gedaan: G.minigames.cli.gedaan, packets: G.packets, opdracht: G.minigames.cli.opdracht };
    });
    assert.equal(na.gedaan, ronde + 1, `${opdracht.soort} telt als afgewerkt`);
    assert.ok(na.packets > voor.packets, `${opdracht.soort} levert packets op`);
    assert.equal(na.opdracht, null, "de opdracht is weg");
    // Niet wachten op de volgende: de wachttijd voorbij zetten.
    await spel(page, async () => {
      (await import("/js/state.js")).G.minigames.cli.nextAt = 0;
    });
    await wachtOp(page, async () => !!(await import("/js/state.js")).G.minigames.cli.opdracht);
  }

  // Overhoring: een antwoord kiezen. Wat de uitleg zegt, moet kloppen met wat
  // er met je packets en je reeks gebeurt.
  await klik(page, '#labo button[data-id="quiz"]');
  for (let ronde = 0; ronde < 4; ronde++) {
    await spel(page, async () => {
      (await import("/js/state.js")).G.minigames.quiz.nextAt = 0;
    });
    // Na een antwoord blijft de uitleg even staan, met de knoppen van die
    // vraag uitgeschakeld. Pas een knop die je kunt aanklikken hoort bij de
    // nieuwe vraag.
    await page.waitForSelector(".quiz-optie:not([disabled])", { timeout: 8000 });
    const voor = await spel(page, async () => {
      const { G } = await import("/js/state.js");
      return { packets: G.packets, reeks: G.minigames.quiz.streak, goed: G.minigames.quiz.correct, fout: G.minigames.quiz.wrong };
    });
    await sluitVensters(page);
    // Niet elke vraag heeft vier antwoorden (juist of fout heeft er twee).
    const opties = page.locator(".quiz-optie:not([disabled])");
    await opties.nth(ronde % (await opties.count())).click();
    const na = await spel(page, async () => {
      const { G } = await import("/js/state.js");
      return { packets: G.packets, reeks: G.minigames.quiz.streak, goed: G.minigames.quiz.correct, fout: G.minigames.quiz.wrong };
    });
    const uitleg = await page.textContent("#labo");
    if (na.goed === voor.goed + 1) {
      assert.ok(na.packets > voor.packets && na.reeks === voor.reeks + 1, "goed antwoord: beloning en reeks");
      assert.match(uitleg, /Goed/);
    } else {
      assert.equal(na.fout, voor.fout + 1, "een antwoord telt altijd ergens mee");
      assert.equal(na.reeks, 0, "fout antwoord: reeks weg");
      assert.match(uitleg, /Fout/);
    }
  }

  assert.deepEqual(fouten, []);
  await context.close();
});

test("alles verkopen zet de verkoopstand uit, zodat je weer kunt kopen", async () => {
  const { page, context, fouten } = await openSpel();
  await spoelDoor(page, 1e4);
  await klik(page, '.shopitem:has-text("Patchkabel")');
  await klik(page, '.shopitem:has-text("Patchkabel")');
  assert.equal((await staat(page)).buildings.patchkabel, 2);

  // Verkoopstand aan, en alles verkopen.
  await klik(page, "#sell-toggle");
  await klik(page, '.shopitem:has-text("Patchkabel")');
  await klik(page, '.shopitem:has-text("Patchkabel")');
  assert.equal((await staat(page)).buildings.patchkabel || 0, 0, "alles verkocht");

  // De balk is weg, dus de verkoopstand moet ook uit zijn.
  await page.waitForFunction(() => document.querySelector(".shopbar").hidden);
  await wachtOp(page, async () => !(await import("/js/state.js")).G.options.sellMode);
  assert.equal(await page.getAttribute("#sell-toggle", "aria-pressed"), "false");
  await klik(page, '.shopitem:has-text("Patchkabel")');
  assert.equal((await staat(page)).buildings.patchkabel, 1, "kopen kan weer");

  // Ook na afstuderen met de verkoopstand aan zit je niet vast.
  await klik(page, "#sell-toggle");
  await spel(page, async () => {
    const { G, recompute, graduate } = await import("/js/state.js");
    G.stats.lifetime = 1e13;
    recompute();
    graduate();
    recompute();
    G.packets = 1e4;
  });
  await wachtOp(page, async () => !(await import("/js/state.js")).G.options.sellMode);
  await klik(page, '.shopitem:has-text("Patchkabel")');
  assert.equal((await staat(page)).buildings.patchkabel, 1, "kopen kan na afstuderen");

  assert.deepEqual(fouten, []);
  await context.close();
});
