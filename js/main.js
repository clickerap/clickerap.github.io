// Startpunt. Laadt de save, zet de interface op en start de motor.

import { G, D, recompute, checkAchievements, earn, unlock } from "./state.js";
import { load, save, offlineYield, neemTabbladOver } from "./save.js";
import { setNotation, fmt, fmtTime } from "./format.js";
import { start, forceGolden, markActivity, nextNews, nieuweRun } from "./engine.js";
import { initShell, frameSync, showTab } from "./ui/shell.js";
import { renderLabo, initLabo, stopLabo } from "./minigames/index.js";
import { toast, dialog, houVenstersVast } from "./ui/fx.js";
import { toonOpstart } from "./ui/opstart.js";
import { initEggs, initConsole } from "./eggs.js";
import { on, emit } from "./bus.js";

// Staat het spel al open in een ander tabblad op hetzelfde bestand, dan slaat
// dat tabblad eerst op en stopt het. Pas daarna laden we.
await neemTabbladOver({
  bijOvername: () => {
    dialog({
      title: "Verder in een ander tabblad",
      body: "<p>Je hebt Serge Clicker in een ander tabblad geopend. Dit tabblad slaat niets meer op, zodat ze elkaars voortgang niet overschrijven.</p><p>Herlaad deze pagina om hier verder te spelen.</p>",
      actions: [
        { label: "Sluiten", style: "ghost" },
        { label: "Hier verder spelen", onClick: () => location.reload() },
      ],
    });
  },
});

const resultaat = load();
// Het opstartscherm zo vroeg mogelijk, zodat je het spel er niet eerst
// even onder ziet. Vensters zoals "Welkom terug" wachten tot het weg is.
houVenstersVast(toonOpstart(G.uiterlijk.opstart));
setNotation(G.options.notation);
recompute();
checkAchievements();

initShell();
initEggs();
initConsole();
initLabo();

on("tab", (naam) => {
  if (naam === "labo") renderLabo();
  else stopLabo();
});
// Het labo tekent zichzelf opnieuw zodra je het tabblad weer opent.
on("graduated", () => {
  nieuweRun();
  save();
});
on("cheat:goud", forceGolden);

// Offline opbrengst
if (resultaat.away && resultaat.away > 60) {
  const { seconds, amount } = offlineYield(resultaat.away);
  if (amount > 0) {
    earn(amount);
    if (resultaat.away >= 3600) unlock("offline");
    dialog({
      title: "Welkom terug",
      body: `<p>Je was ${fmtTime(resultaat.away)} weg. Je netwerk heeft ondertussen doorgedraaid.</p>
             <p><strong>${fmt(amount)} packets</strong> erbij, over ${fmtTime(seconds)} aan productie.</p>`,
      actions: [{ label: "Verder", style: "" }],
    });
  }
}

if (resultaat.migrated) {
  toast({
    title: "Oude voortgang overgezet",
    text: "Je packets, apparaten en kliks zijn meegenomen naar de nieuwe versie.",
    icon: "📦",
    tone: "goed",
  });
}
if (resultaat.corrupt) {
  toast({ title: "Save onleesbaar", text: "Er is opnieuw begonnen. De oude save staat apart bewaard.", tone: "slecht" });
}
if (resultaat.opslag === false) {
  toast({
    title: "Opslaan lukt niet",
    text: "Deze browser blokkeert opslag. Je kunt spelen, maar je voortgang blijft niet bewaard.",
    tone: "slecht",
  });
}
if (!resultaat.loaded) {
  showTab("winkel");
}

// Interface bijwerken: los van de spelklok, tien keer per seconde is genoeg.
setInterval(frameSync, 100);
frameSync();

// Activiteit bijhouden voor de "geduld"-prestatie.
for (const type of ["pointerdown", "keydown"]) {
  document.addEventListener(type, markActivity, { passive: true });
}

// pagehide vuurt ook op telefoons betrouwbaar, en laat de back/forward-cache
// intact (beforeunload doet dat in Firefox niet).
window.addEventListener("pagehide", () => save());
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") save();
});

start();

// Meteen een eerste logregel, niet pas na twaalf seconden.
emit("news", nextNews());

// Voor wie in de console rondkijkt: hallo. Er valt hier meer te vinden.
window.serge = {
  get pps() {
    return D.pps;
  },
  get packets() {
    return G.packets;
  },
  hint: "Zeven keer op het versienummer, onder het tandwiel.",
};
