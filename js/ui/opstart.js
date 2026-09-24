// Het opstartscherm dat je onder Uiterlijk kiest. Het ligt een paar seconden
// over het spel; een klik of een toets slaat het over. Met animaties uit staat
// alles meteen in beeld en is het sneller voorbij.

import { G } from "../state.js";
import { esc } from "../html.js";

const heeftDom = typeof document !== "undefined";

// Tekst die regel voor regel verschijnt, zoals op een echte console. Een
// regel met `@` wordt een laadbalk die zich vult.
const IOS = [
  "System Bootstrap, Version 15.2(4r)E5, RELEASE SOFTWARE (fc4)",
  "Copyright (c) 1994-2026 by Serge Systems, Inc.",
  "",
  'Loading "flash:serge-universalk9-mz.152-7.E4.bin"...',
  "@",
  "",
  "Serge Clicker IOS Software, Version 16.9.4, RELEASE SOFTWARE",
  "Switch Ports Model              SW Version",
  "------ ----- -----              ----------",
  "*    1 52    SC-3850-48P-E      16.9.4",
  "",
  "%LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to up",
  "%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up",
  "",
  "Press RETURN to get started!",
];

const BIOS = [
  "SergeBIOS v4.51PG, een energiezuinige Serge",
  "Copyright (C) 1984-2026, Serge Software, Inc.",
  "",
  "SERGE-486 CPU at 133MHz",
  "#",
  "",
  "Serge Plug and Play-uitbreiding v1.0A",
  "Detecting IDE Primary Master   ... SERGE-HDD 2.1GB",
  "Detecting IDE Primary Slave    ... Geen",
  "Detecting IDE Secondary Master ... CD-ROM 52X",
  "Detecting IDE Secondary Slave  ... Diskette met huiswerk",
  "",
  "Druk op DEL voor SETUP. Of klik, dat mag ook.",
];

const SCHERMEN = {
  ios: { duur: 3400, regels: IOS },
  bios: { duur: 3600, regels: BIOS },
  arcade: {
    duur: 3200,
    html: () => `
      <div class="op-score"><span>1UP 00000</span><span>HI 99999</span></div>
      <div class="op-titel"><span>SERGE</span><span>CLICKER</span></div>
      <p class="op-munt">MUNT ERIN</p>
      <p class="op-start">DRUK OP START</p>
      <div class="op-voet"><span>© 1987 SERGE</span><span class="op-credit">CREDIT 0</span></div>`,
  },
  retro: {
    duur: 3400,
    html: () => `
      <div class="op-wolken"></div>
      <div class="op-logo"><span class="op-embleem">🧔</span><span><b>Serge</b><sup>95</sup></span></div>
      <div class="op-laad"><i></i></div>
      <p class="op-klein">© Serge Corporation. Alle packets voorbehouden.</p>`,
  },
  film: {
    duur: 4600,
    html: () => `
      <p class="op-regel een">SERGE STUDIOS PRESENTEERT</p>
      <p class="op-regel twee">IN EEN WERELD WAAR ALLES DRAAIT OM PACKETS…</p>
      <p class="op-regel drie">…IS ER ÉÉN MAN DIE KLIKT</p>
      <div class="op-film"><span>SERGE</span><span>CLICKER</span></div>`,
  },
  hemels: {
    duur: 3800,
    html: () => `
      <div class="op-stralen"></div>
      <div class="op-wolk links"></div>
      <div class="op-wolk rechts"></div>
      <p class="op-ontwaakt">Serge ontwaakt</p>`,
  },
};

export const OPSTART_IDS = Object.keys(SCHERMEN);

// Toont het scherm en geeft een belofte die klaar is als het weg is.
export function toonOpstart(soort) {
  const scherm = SCHERMEN[soort];
  if (!heeftDom || !scherm) return Promise.resolve();
  document.querySelector(".opstart")?.remove();
  const stil = !G.options.motion || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  // Een modaal venster: dat ligt ook boven een ander venster dat openstaat,
  // zoals het menu op een telefoon.
  const el = document.createElement("dialog");
  el.className = `opstart${stil ? " stil" : ""}`;
  el.dataset.opstart = soort;
  el.setAttribute("aria-label", "Het spel start op. Klik of druk op een toets om verder te gaan.");
  document.body.append(el);

  const timers = [];
  if (scherm.regels) {
    el.innerHTML = `<pre class="op-console" aria-hidden="true"></pre>`;
    typ(el.firstElementChild, scherm.regels, stil, timers);
  } else {
    el.innerHTML = scherm.html();
    for (const kind of el.children) kind.setAttribute("aria-hidden", "true");
  }
  if (el.showModal) el.showModal();
  else el.setAttribute("open", "");

  return new Promise((klaar) => {
    let weg = false;
    const sluit = () => {
      if (weg) return;
      weg = true;
      for (const t of timers) clearTimeout(t);
      document.removeEventListener("pointerdown", sluit, true);
      document.removeEventListener("keydown", sluit, true);
      el.classList.add("weg");
      setTimeout(() => {
        if (el.open && el.close) el.close();
        el.remove();
        klaar();
      }, stil ? 0 : 380);
    };
    // Escape sluit een venster meteen; wij laten het eerst uitfaden.
    el.addEventListener("cancel", (e) => {
      e.preventDefault();
      sluit();
    });
    timers.push(setTimeout(sluit, stil ? Math.min(1400, scherm.duur) : scherm.duur));
    document.addEventListener("pointerdown", sluit, true);
    document.addEventListener("keydown", sluit, true);
  });
}

// Regel voor regel. De laadbalk van de switch vult zich met @, de BIOS telt
// zijn geheugen op.
function typ(pre, regels, stil, timers) {
  if (stil) {
    pre.textContent = regels.map((r) => (r === "@" ? "@".repeat(48) : r === "#" ? "Memory Test :  65536K OK" : r)).join("\n");
    return;
  }
  let tijd = 120;
  for (const regel of regels) {
    if (regel === "@") {
      const lijn = document.createElement("span");
      timers.push(setTimeout(() => pre.append(lijn, "\n"), tijd));
      for (let i = 1; i <= 48; i++) timers.push(setTimeout(() => (lijn.textContent = "@".repeat(i)), tijd + i * 18));
      tijd += 48 * 18 + 80;
      continue;
    }
    if (regel === "#") {
      const lijn = document.createElement("span");
      timers.push(setTimeout(() => pre.append(lijn, "\n"), tijd));
      for (let i = 0; i <= 16; i++) timers.push(setTimeout(() => (lijn.textContent = `Memory Test :  ${String(i * 4096).padStart(5, " ")}K${i === 16 ? " OK" : ""}`), tijd + i * 45));
      tijd += 16 * 45 + 120;
      continue;
    }
    timers.push(setTimeout(() => pre.insertAdjacentHTML("beforeend", `${esc(regel)}\n`), tijd));
    tijd += regel ? 90 : 40;
  }
}
