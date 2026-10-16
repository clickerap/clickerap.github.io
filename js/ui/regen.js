// Digitale regen voor de achtergrond Matrix.
//
// Eén canvas achter alles, dat alleen bestaat zolang dat thema aanstaat. Elke
// kolom laat tekens vallen: een lichte kop, met een groene staart die langzaam
// wegzakt in het kleurverloop. Japanse tekens zoals in de film, met nullen,
// enen en hex ertussen. Rekenwerk per stap: één vlak en een paar tekens per
// kolom. Met animaties uit blijft er een stilstaand beeld van de regen staan.

const KATAKANA = "ｦｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
const BINAIR = "01";
const HEX = "0123456789ABCDEF";

const GROOTTE = 17; // pixels per teken
const STAP_MS = 60; // ruim zestien stappen per seconde
const VERVAAG = 0.085; // hoe snel de staart wegzakt
const LETTER = `600 ${GROOTTE - 3}px "IBM Plex Mono", "Hiragino Kaku Gothic ProN", "Yu Gothic", "MS Gothic", "Noto Sans JP", monospace`;

// Kleuren van het thema zelf, zodat de regen en de ring bij elkaar horen.
const KOP = "#ecfdf3";
const STAART = "#22c55e";
const ACHTER_BOVEN = "#0b3a1d";
const ACHTER_ONDER = "#000000";

let canvas = null;
let ctx = null;
let achtergrond = null;
let kolommen = [];
let rijen = 0;
let breedte = 0;
let hoogte = 0;
let raf = 0;
let vorige = 0;
let stappen = 0;

function teken() {
  const r = Math.random();
  if (r < 0.58) return KATAKANA[Math.floor(Math.random() * KATAKANA.length)];
  if (r < 0.82) return BINAIR[Math.floor(Math.random() * BINAIR.length)];
  return HEX[Math.floor(Math.random() * HEX.length)];
}

function nieuweKolom(verspreid) {
  return {
    y: verspreid ? -Math.random() * rijen * 1.2 : -Math.random() * 12,
    snelheid: 0.35 + Math.random() * 0.8,
    rij: null,
    teken: null,
  };
}

function pasAan() {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  breedte = window.innerWidth;
  hoogte = window.innerHeight;
  canvas.width = Math.ceil(breedte * dpr);
  canvas.height = Math.ceil(hoogte * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  rijen = Math.ceil(hoogte / GROOTTE) + 1;
  const aantal = Math.ceil(breedte / GROOTTE);
  kolommen = Array.from({ length: aantal }, (_, i) => kolommen[i] || nieuweKolom(true));
  achtergrond = ctx.createLinearGradient(0, 0, breedte * 0.35, hoogte);
  achtergrond.addColorStop(0, ACHTER_BOVEN);
  achtergrond.addColorStop(1, ACHTER_ONDER);
  ctx.globalAlpha = 1;
  ctx.fillStyle = achtergrond;
  ctx.fillRect(0, 0, breedte, hoogte);
  ctx.font = LETTER;
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
}

// Japanse tekens staan in de film in spiegelbeeld; wij doen dat na.
function schrijf(t, x, y) {
  if (KATAKANA.includes(t)) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(-1, 1);
    ctx.fillText(t, 0, 0);
    ctx.restore();
  } else {
    ctx.fillText(t, x, y);
  }
}

function stap() {
  stappen++;
  // De staart zakt weg door er telkens een beetje achtergrond overheen te
  // leggen. Af en toe wat steviger, anders blijft er een groen waas hangen.
  ctx.globalAlpha = stappen % 40 === 0 ? 0.3 : VERVAAG;
  ctx.fillStyle = achtergrond;
  ctx.fillRect(0, 0, breedte, hoogte);
  ctx.globalAlpha = 1;

  for (let i = 0; i < kolommen.length; i++) {
    const k = kolommen[i];
    k.y += k.snelheid;
    const rij = Math.floor(k.y);
    if (rij === k.rij || rij < 0) continue;
    const x = i * GROOTTE + GROOTTE / 2;
    // De vorige kop wordt staart, en een enkele keer verandert een teken
    // onderweg, zoals in het origineel.
    if (k.teken !== null) {
      ctx.fillStyle = STAART;
      schrijf(Math.random() < 0.08 ? teken() : k.teken, x, k.rij * GROOTTE);
    }
    k.teken = teken();
    k.rij = rij;
    ctx.fillStyle = KOP;
    schrijf(k.teken, x, rij * GROOTTE);
    if (rij > rijen && Math.random() < 0.04) kolommen[i] = nieuweKolom(false);
  }
}

function lus(nu) {
  raf = requestAnimationFrame(lus);
  if (nu - vorige < STAP_MS) return;
  // Na een pauze (ander tabblad) niet alle gemiste stappen inhalen.
  vorige = nu - vorige > STAP_MS * 4 ? nu : vorige + STAP_MS;
  stap();
}

function stop() {
  cancelAnimationFrame(raf);
  raf = 0;
}

function opruimen() {
  stop();
  window.removeEventListener("resize", opnieuw);
  canvas?.remove();
  canvas = null;
  ctx = null;
  kolommen = [];
}

function opnieuw() {
  if (!canvas) return;
  pasAan();
  vooruit();
}

// Laat de regen alvast een tijdje vallen, zodat het scherm meteen vol staat.
// Zonder animaties is dit ook het beeld dat blijft staan.
function vooruit() {
  for (let i = 0; i < rijen * 1.4; i++) stap();
}

// Zet de regen aan of uit. `beweging` volgt de instelling Animaties en de
// systeemvoorkeur voor minder beweging.
export function stelRegenIn({ aan, beweging }) {
  if (!aan) {
    opruimen();
    return;
  }
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.className = "matrixregen";
    canvas.setAttribute("aria-hidden", "true");
    ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      canvas = null;
      return;
    }
    document.body.prepend(canvas);
    window.addEventListener("resize", opnieuw);
    pasAan();
    vooruit();
  }
  stop();
  if (beweging) {
    vorige = performance.now();
    raf = requestAnimationFrame(lus);
  }
}
