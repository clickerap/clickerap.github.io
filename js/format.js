// Getalnotatie. Nederlandse lange schaal: miljoen, miljard, biljoen, biljard, ...
// Drie standen, instelbaar via Opties: "kort", "voluit" en "wetenschappelijk".

// Lange schaal, per stap van duizend.
const SCALE = [
  { value: 1e6, short: "mln", word: "miljoen" },
  { value: 1e9, short: "mld", word: "miljard" },
  { value: 1e12, short: "bln", word: "biljoen" },
  { value: 1e15, short: "bld", word: "biljard" },
  { value: 1e18, short: "trl", word: "triljoen" },
  { value: 1e21, short: "trd", word: "triljard" },
  { value: 1e24, short: "qad", word: "quadriljoen" },
  { value: 1e27, short: "qdd", word: "quadriljard" },
  { value: 1e30, short: "qnt", word: "quintiljoen" },
  { value: 1e33, short: "qtd", word: "quintiljard" },
  { value: 1e36, short: "sxt", word: "sextiljoen" },
  { value: 1e39, short: "sxd", word: "sextiljard" },
  { value: 1e42, short: "spt", word: "septiljoen" },
  { value: 1e45, short: "spd", word: "septiljard" },
  { value: 1e48, short: "oct", word: "octiljoen" },
  { value: 1e51, short: "ocd", word: "octiljard" },
  { value: 1e54, short: "non", word: "noniljoen" },
  { value: 1e57, short: "nod", word: "noniljard" },
  { value: 1e60, short: "dec", word: "deciljoen" },
  { value: 1e63, short: "ded", word: "deciljard" },
];

const formatters = new Map();

function fixed(value, decimals) {
  const key = decimals;
  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat("nl-NL", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    );
  }
  return formatters.get(key).format(value);
}

function magnitudeFor(abs) {
  for (let i = SCALE.length - 1; i >= 0; i--) {
    if (abs >= SCALE[i].value) return SCALE[i];
  }
  return null;
}

export let notation = "kort";

export function setNotation(next) {
  notation = next === "voluit" || next === "wetenschappelijk" ? next : "kort";
}

// Hoofdformatter. Alles wat een getal op het scherm zet loopt hierlangs.
export function fmt(value, options = {}) {
  const { decimals = null, forceSign = false } = options;
  if (!Number.isFinite(value)) return "∞";

  const sign = value < 0 ? "-" : forceSign ? "+" : "";
  const abs = Math.abs(value);

  if (notation === "wetenschappelijk" && abs >= 1e6) {
    return sign + abs.toExponential(2).replace("e+", "e");
  }

  // Onder het miljoen tonen we het getal gewoon voluit; dat leest prettiger
  // dan "65,8 k" en scheelt niets aan breedte.
  if (notation === "voluit" || abs < 1e6) {
    if (abs < 1e6) {
      // Hele getallen krijgen geen decimalen, kleine breuken wel één.
      const heel = Math.abs(abs - Math.round(abs)) < 1e-9;
      const d = decimals !== null ? decimals : heel ? 0 : abs < 10 ? 1 : 0;
      return sign + fixed(abs, d);
    }
    return sign + fixed(Math.floor(abs), 0);
  }

  const mag = magnitudeFor(abs);
  if (!mag) return sign + fixed(Math.floor(abs), 0);
  const scaled = abs / mag.value;
  const d = decimals !== null ? decimals : scaled < 10 ? 2 : scaled < 100 ? 1 : 0;
  return `${sign}${fixed(scaled, d)} ${mag.short}`;
}

// Voluit uitgeschreven, voor tooltips en tekstregels: "1,25 miljard".
export function fmtLong(value) {
  if (!Number.isFinite(value)) return "oneindig";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs < 1e6) return sign + fixed(Math.floor(abs), 0);
  const mag = magnitudeFor(abs);
  if (!mag) return sign + fixed(Math.floor(abs), 0);
  const scaled = abs / mag.value;
  return `${sign}${fixed(scaled, scaled < 10 ? 2 : 1)} ${mag.word}`;
}

// Percentages: 0.075 -> "7,5%"
export function fmtPct(fraction, decimals = 1) {
  return `${fixed(fraction * 100, decimals)}%`;
}

// Duur in seconden -> "3u 12m" / "45s"
export function fmtTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  const s = Math.floor(seconds);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}u ${m % 60}m`;
  const d = Math.floor(h / 24);
  if (d < 365) return `${d}d ${h % 24}u`;
  return `${Math.floor(d / 365)}j ${d % 365}d`;
}

// Hoe lang duurt het nog voor je dit kunt betalen?
export function fmtEta(missing, perSecond) {
  if (missing <= 0) return "nu te koop";
  if (perSecond <= 0) return "blijf klikken";
  return `over ${fmtTime(missing / perSecond)}`;
}
