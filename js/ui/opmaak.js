// De opmaak van het logo en van een accessoire. De pagina en de voorbeeldjes
// in het menu gebruiken allebei deze functies, zodat ze er hetzelfde uitzien.

import { esc } from "../html.js";
import { LOGOS, ACCESSOIRES } from "../data/uiterlijk.js";

const LOGO_BY_ID = Object.fromEntries(LOGOS.map((l) => [l.id, l]));
const ACCESSOIRE_BY_ID = Object.fromEntries(ACCESSOIRES.map((a) => [a.id, a]));

// Elke letter apart, voor logo's waarvan de letters los bewegen.
function letters(tekst, begin) {
  return [...tekst].map((l, i) => `<i style="--i: ${begin + i}">${esc(l)}</i>`).join("");
}

// De binnenkant van het logo: twee delen, de naam en "Clicker".
export function logoHtml(id) {
  const def = LOGO_BY_ID[id] || LOGO_BY_ID.standaard;
  const [een, twee] = def.tekst || ["Serge", "Clicker"];
  switch (def.id) {
    case "golf":
      return `<span class="w1">${letters(een, 0)}</span> <span class="w2">${letters(twee, een.length + 1)}</span>`;
    case "terminal":
      return `<span class="w1">${esc(een)}</span><span class="w2">${esc(twee)}</span><span class="cursor"></span>`;
    case "enterprise":
      return `<span class="w1">${esc(een)}</span> <span class="w2">Clicker <small>Enterprise Edition</small></span>`;
    case "exe":
      return `<span class="w1">${esc(een)}</span><span class="w2">${esc(twee)}</span>`;
    case "glitch":
      return `<span class="glitch" data-tekst="${esc(`${een} ${twee}`)}"><span class="w1">${esc(een)}</span> <span class="w2">${esc(twee)}</span></span>`;
    default:
      return `<span class="w1">${esc(een)}</span> <span class="w2">${esc(twee)}</span>`;
  }
}

// Hoeden en oren die als emoji niet mooi genoeg zijn, tekenen we zelf, als
// SVG in de pagina. Zonder id's, want elk accessoire staat twee keer op de
// pagina: op Serge en in het menu.
const svg = (klasse, viewBox, inhoud) => `<svg class="acc-svg ${klasse}" viewBox="${viewBox}" aria-hidden="true" focusable="false">${inhoud}</svg>`;
const VLAM = '<path d="M15 60C5 60 1 51 3 43C6 32 13 26 15 4C18 22 27 31 28 43C29 52 24 60 15 60Z" fill="#ef4444"/><path transform="translate(3.75 15) scale(.75)" d="M15 60C5 60 1 51 3 43C6 32 13 26 15 4C18 22 27 31 28 43C29 52 24 60 15 60Z" fill="#f97316"/><path d="M15 58C9 58 7 52 8 47C10 40 14 36 15 24C17 35 22 41 22 47C23 53 20 58 15 58Z" fill="#fde047"/>';
const SVGS = {
  feesthoed: () => svg("feesthoed", "0 0 60 84", '<path d="M30 10 54 76Q30 84 6 76Z" fill="#ec4899"/><path d="M30 10 54 76Q42 80 30 81Z" fill="#db2777"/><circle cx="27" cy="40" r="3" fill="#fde047"/><circle cx="36" cy="57" r="3.4" fill="#67e8f9"/><circle cx="20" cy="62" r="3" fill="#fde047"/><circle cx="32" cy="27" r="2.2" fill="#67e8f9"/><circle cx="44" cy="68" r="2.4" fill="#fde047"/><path d="M6 76Q30 84 54 76" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="30" cy="9" r="7" fill="#fde047"/><circle cx="28" cy="7" r="2.4" fill="#fff" opacity=".7"/>'),
  kattenoren: () => svg("kattenoren", "0 0 120 50", '<g class="oor links"><path d="M6 50Q8 12 30 2Q44 22 48 44Z" fill="#6b7280"/><path d="M15 43Q17 19 29 11Q37 25 40 39Z" fill="#f9a8d4"/></g><g class="oor rechts"><path d="M114 50Q112 12 90 2Q76 22 72 44Z" fill="#6b7280"/><path d="M105 43Q103 19 91 11Q83 25 80 39Z" fill="#f9a8d4"/></g>'),
  propeller: () => svg("propeller", "0 0 100 72", '<path d="M6 62Q6 20 50 14L28 62Z" fill="#ef4444"/><path d="M28 62 50 14V62Z" fill="#facc15"/><path d="M50 62V14L72 62Z" fill="#3b82f6"/><path d="M72 62 50 14Q94 20 94 62Z" fill="#22c55e"/><path d="M4 60Q50 70 96 60V66Q50 76 4 66Z" fill="#1e3a8a"/><rect x="48.5" y="4" width="3" height="10" fill="#374151"/><circle cx="50" cy="14" r="4" fill="#1f2937"/><g class="wiek"><path d="M50 5Q34 0 22 5Q34 10 50 5Z" fill="#38bdf8"/><path d="M50 5Q66 0 78 5Q66 10 50 5Z" fill="#f472b6"/></g>'),
  ninja: () => svg("ninja", "0 0 150 56", '<g class="slippen"><path d="M118 28Q134 30 148 44L143 50Q131 38 116 34Z" fill="#b91c1c"/><path d="M118 31Q126 42 130 56L123 56Q120 44 114 36Z" fill="#991b1b"/></g><path d="M8 24Q62 10 118 24V36Q62 22 8 36Z" fill="#dc2626"/><path d="M8 24Q62 10 118 24V27.5Q62 13.5 8 27.5Z" fill="#f87171"/><circle cx="118" cy="30" r="6" fill="#b91c1c"/>'),
  kerstmuts: () => svg("kerstmuts", "0 0 110 84", '<path d="M12 62Q22 14 60 8Q92 6 100 40Q86 26 72 26Q76 46 92 62Z" fill="#dc2626"/><path d="M60 8Q92 6 100 40Q86 26 72 26Q66 16 60 8Z" fill="#b91c1c"/><path d="M6 58Q52 48 98 58Q101 66 98 74Q52 64 6 74Q3 66 6 58Z" fill="#f8fafc"/><circle cx="100" cy="44" r="10" fill="#f8fafc"/><circle cx="97" cy="41" r="3.5" fill="#fff"/>'),
  heksenhoed: () => svg("heksenhoed", "0 26 120 74", '<path d="M30 82Q44 58 56 46Q66 36 92 34Q78 42 73 52Q80 66 92 82Z" fill="#4c1d95"/><path d="M73 52Q80 66 92 82H80Q73 66 68 55Z" fill="#2e1065"/><ellipse cx="60" cy="84" rx="58" ry="11" fill="#2e1065"/><path d="M31 76Q60 84 91 76L93 83Q60 91 29 83Z" fill="#f59e0b"/><rect x="54" y="75.5" width="12" height="9" rx="1.5" fill="none" stroke="#fde68a" stroke-width="2.4"/>'),
  hoorns: () => svg("hoorns", "0 0 120 50", '<path d="M18 50Q4 26 16 2Q22 24 38 40Z" fill="#dc2626"/><path d="M16 2Q22 24 38 40L33 45Q20 30 16 2Z" fill="#991b1b"/><path d="M102 50Q116 26 104 2Q98 24 82 40Z" fill="#dc2626"/><path d="M104 2Q98 24 82 40L87 45Q100 30 104 2Z" fill="#991b1b"/>'),
  eenhoorn: () => svg("eenhoorn", "0 -10 40 110", '<path d="M20 2 33 92Q20 99 7 92Z" fill="#fdf4ff"/><path d="M20 2 33 92Q26 96 20 96Z" fill="#f5d0fe"/><g fill="none" stroke-linecap="round" stroke-width="3"><path d="M11 78Q20 74 30 81" stroke="#f9a8d4"/><path d="M13 62Q20 58 28 64" stroke="#c4b5fd"/><path d="M15 46Q20 43 26 48" stroke="#99f6e4"/><path d="M16.5 31Q20 29 24 32" stroke="#fde68a"/><path d="M18 18Q20 17 22 19" stroke="#f9a8d4"/></g><path class="glim" d="M20 -9 22 -3 28 -1 22 1 20 7 18 1 12 -1 18 -3Z" fill="#fff"/>'),
  vlammen: () => svg("vlammen", "0 0 120 70", [[0, 18, 0.7], [20, 6, 0.9], [44, -2, 1.07], [72, 6, 0.9], [98, 18, 0.7]]
    .map(([x, y, s], i) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="vlam" style="--i: ${i}">${VLAM}</g></g>`).join("")),
  routerhoed: () => svg("routerhoed", "0 0 100 64", '<g stroke="#1f2937" stroke-width="2.5" stroke-linecap="round"><path d="M22 34 14 5M50 34V3M78 34 86 5"/></g><g fill="#1f2937"><circle cx="14" cy="5" r="3.5"/><circle cx="50" cy="3" r="3.5"/><circle cx="86" cy="5" r="3.5"/></g><rect x="8" y="32" width="84" height="26" rx="6" fill="#334155"/><rect x="8" y="32" width="84" height="7" rx="3.5" fill="#475569"/><g class="lampjes"><circle cx="22" cy="48" r="3.2" fill="#4ade80"/><circle cx="32" cy="48" r="3.2" fill="#4ade80"/><circle cx="42" cy="48" r="3.2" fill="#fbbf24"/><circle cx="52" cy="48" r="3.2" fill="#38bdf8"/></g><rect x="62" y="43" width="23" height="10" rx="2" fill="#0f172a"/><path d="M66 46v4M70 46v4M74 46v4M78 46v4M82 46v4" stroke="#475569" stroke-width="1.5"/>'),
  onweer: () => svg("onweer", "0 0 120 92", '<g class="druppels" stroke="#93c5fd" stroke-width="2.5" stroke-linecap="round"><path d="M36 62l-3 8M84 62l-3 8M46 68l-3 8M76 70l-3 8M94 60l-3 8"/></g><path class="flits" d="M64 52 50 74h11l-7 16 20-24H63l7-14Z" fill="#facc15" stroke="#92400e" stroke-width="1.5" stroke-linejoin="round"/><g fill="#475569"><circle cx="40" cy="36" r="20"/><circle cx="66" cy="28" r="24"/><circle cx="88" cy="40" r="17"/><rect x="22" y="36" width="84" height="22" rx="11"/></g><g fill="#64748b"><circle cx="40" cy="31" r="12"/><circle cx="64" cy="22" r="14"/></g>'),
  wifi: () => svg("wifi", "0 0 60 46", '<g fill="none" stroke-linecap="round"><g class="boog" style="--i: 2"><path d="M6 21Q30 -1 54 21" stroke="#fff" stroke-width="9"/><path d="M6 21Q30 -1 54 21" stroke="#2563eb" stroke-width="5"/></g><g class="boog" style="--i: 1"><path d="M14 30Q30 15 46 30" stroke="#fff" stroke-width="9"/><path d="M14 30Q30 15 46 30" stroke="#2563eb" stroke-width="5"/></g></g><g class="boog" style="--i: 0"><circle cx="30" cy="39" r="6" fill="#fff"/><circle cx="30" cy="39" r="3.8" fill="#2563eb"/></g>'),
};

// Wat er in het accessoire-vlak staat: meestal één emoji, soms meer.
export function accessoireHtml(id) {
  const def = ACCESSOIRE_BY_ID[id];
  // Het aureool, de koptelefoon en de ruimtehelm worden helemaal in CSS getekend.
  if (!def || ["geen", "aureool", "koptelefoon", "ruimtehelm"].includes(def.id)) return "";
  if (SVGS[def.id]) return SVGS[def.id]();
  if (def.id === "planeten") return `<span class="baan"><span class="ring"><i>🪐</i><i>🌍</i><i>🌙</i></span></span>`;
  if (def.id === "duizelig") return `<span class="baan duizel"><span class="ring"><i>⭐</i><i>💫</i><i>⭐</i></span></span>`;
  if (def.id === "antenne") return `<span class="teken">${def.voorbeeld}</span><span class="signaal"></span>`;
  if (def.id === "koffiemok") return `<span class="teken">☕</span><span class="stoom"><i></i><i></i><i></i></span>`;
  return `<span class="teken">${esc(def.voorbeeld)}</span>`;
}

// ------------------------------------------------------------- Omloop
// `n` is hoeveel er rondgaan; dat groeit met je apparaten. De meeste dingen
// blijven rechtop terwijl ze draaien; de muisjes wijzen altijd naar Serge.

const OMLOOP_TEKEN = { packets: "✉️", hartjes: "❤️", satellieten: "🛰️", koffie: "☕", munten: "S", kometen: "", pinguins: "🐧", vuurvliegjes: "" };
// De planeten, van binnen naar buiten: kleur, grootte in pixels en omlooptijd.
const PLANETEN = [
  ["#a8a29e", 6, 5], ["#fde68a", 8, 8], ["#3b82f6", 9, 11], ["#ef4444", 7, 15],
  ["#fb923c", 14, 24], ["#facc15", 12, 32], ["#67e8f9", 10, 42], ["#2563eb", 10, 52],
];

export function omloopHtml(id, n, foto) {
  if (!id || id === "geen") return "";
  if (id === "elektronen") {
    const per = 1 + Math.floor(n / 10);
    return [0, 60, -60]
      .map((r, baan) => `<span class="baantje" style="--r: ${r}deg">${Array.from({ length: per }, (_, i) => `<b style="--d: ${(-2.4 * i) / per - baan * 0.7}s"></b>`).join("")}</span>`)
      .join("");
  }
  if (id === "zonnestelsel") {
    return PLANETEN.map(([kleur, maat, tijd], i) =>
      `<span class="planeetbaan${i === 5 ? " ring" : ""}" style="--straal: ${(0.58 + i * 0.031).toFixed(3)}; --kleur: ${kleur}; --p: ${maat}px; --tijd: ${tijd}s; --a: ${(i * 137) % 360}deg"><b></b></span>`
    ).join("");
  }
  const aantal = id === "kometen" ? Math.min(6, Math.max(2, Math.round(n / 4))) : n;
  const items = Array.from({ length: aantal }, (_, i) => {
    let inhoud = OMLOOP_TEKEN[id] ?? "";
    if (id === "bits") inhoud = i % 2 ? "1" : "0";
    if (id === "noten") inhoud = ["♪", "♫", "♬", "♩"][i % 4];
    if (id === "miniserge") inhoud = `<img src="${esc(foto)}" alt="" draggable="false" />`;
    return `<i style="--a: ${((360 / aantal) * i).toFixed(1)}deg; --i: ${i}"><b>${inhoud}</b></i>`;
  });
  return `<span class="omloop-ring">${items.join("")}</span>`;
}

// ------------------------------------------------------------- Decor
// Het meeste doen de pseudo-elementen; een paar decors hebben losse lagen.

export function decorHtml(id) {
  if (id === "sonar") return "<i></i><i></i><i></i>";
  if (id === "stralenkrans") return Array.from({ length: 7 }, (_, i) => `<i style="--i: ${i}"></i>`).join("");
  if (id === "portaal" || id === "zwartgat") return "<i></i>";
  return "";
}
