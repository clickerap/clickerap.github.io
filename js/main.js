// Startpunt. Laadt de save, zet de interface op en start de motor.

import { G, D, recompute, checkAchievements, earn, unlock } from "./state.js";
import { load, save, offlineYield } from "./save.js";
import { setNotation } from "./format.js";
import { start, forceGolden, markActivity } from "./engine.js";
import { initShell, frameSync, showTab } from "./ui/shell.js";
import { renderLabo, initLabo, stopLabo } from "./minigames/index.js";
import { toast, dialog } from "./ui/fx.js";
import { fmt, fmtTime } from "./format.js";
import { initEggs, initConsole } from "./eggs.js";
import { on, emit as emitBus } from "./bus.js";
const emitNews = (tekst) => emitBus("news", tekst);

const resultaat = load();
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
on("graduated", () => {
  save();
  renderLabo();
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
  toast({ title: "Save onleesbaar", text: "Er is opnieuw begonnen. Sorry.", tone: "slecht" });
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

window.addEventListener("beforeunload", () => save());
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") save();
});

start();

// Meteen een eerste logregel, niet pas na twaalf seconden.
import("./engine.js").then(({ nextNews }) => emitNews(nextNews()));

// Voor wie in de console rondkijkt: hallo. Er valt hier meer te vinden.
window.serge = {
  get pps() {
    return D.pps;
  },
  get packets() {
    return G.packets;
  },
  hint: "Zeven keer op het versienummer onder 'Meer'.",
};
