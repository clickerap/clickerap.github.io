// Weer en muisspoor: twee dunne canvaslagen voor Uiterlijk.
//
// Het weer ligt achter de kaarten en draait zolang er weer gekozen is. Het
// spoor ligt erboven, reageert alleen op een echte muis, en tekent alleen
// zolang er nog iets uit te doven valt; daarna staat het stil. Met animaties
// uit is er geen spoor, en blijft het weer als stilstaand beeld staan.

const STAP_MS = 33;
const willekeurig = (min, max) => min + Math.random() * (max - min);
const kies = (lijst) => lijst[Math.floor(Math.random() * lijst.length)];

function maakCanvas(klasse) {
  const canvas = document.createElement("canvas");
  canvas.className = klasse;
  canvas.setAttribute("aria-hidden", "true");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  document.body.append(canvas);
  return { canvas, ctx, breedte: 0, hoogte: 0 };
}

function pasAan(laag) {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  laag.breedte = window.innerWidth;
  laag.hoogte = window.innerHeight;
  laag.canvas.width = Math.ceil(laag.breedte * dpr);
  laag.canvas.height = Math.ceil(laag.hoogte * dpr);
  laag.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// ------------------------------------------------------------------ Weer

const WEERSOORTEN = {
  sneeuw: {
    dichtheid: 1 / 8000,
    nieuw: (b, h, verspreid) => ({ x: willekeurig(0, b), y: verspreid ? willekeurig(0, h) : -10, r: willekeurig(2, 5.5), v: willekeurig(0.4, 1.3), fase: willekeurig(0, 6.3) }),
    stap: (d) => { d.y += d.v; d.fase += 0.02; d.x += Math.sin(d.fase) * 0.4; },
    teken: (ctx, d) => {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.95, 0.5 + d.r / 10)})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  bloesem: {
    dichtheid: 1 / 30000,
    nieuw: (b, h, verspreid) => ({ x: willekeurig(-100, b), y: verspreid ? willekeurig(0, h) : -12, r: willekeurig(4, 7), v: willekeurig(0.5, 1.1), wind: willekeurig(0.3, 0.9), hoek: willekeurig(0, 6.3), draai: willekeurig(-0.04, 0.04), kleur: kies(["#fbcfe8", "#f9a8d4", "#fce7f3"]) }),
    stap: (d) => { d.y += d.v; d.x += d.wind + Math.sin(d.y / 40) * 0.5; d.hoek += d.draai; },
    teken: (ctx, d) => {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.hoek);
      ctx.fillStyle = d.kleur;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.ellipse(0, 0, d.r, d.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  regen: {
    dichtheid: 1 / 7000,
    nieuw: (b, h, verspreid) => ({ x: willekeurig(0, b + 200), y: verspreid ? willekeurig(0, h) : willekeurig(-60, -10), v: willekeurig(9, 15), lengte: willekeurig(10, 20) }),
    stap: (d) => { d.y += d.v; d.x -= d.v * 0.28; },
    teken: (ctx, d) => {
      ctx.strokeStyle = "rgba(191, 219, 254, 0.35)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.lengte * 0.28, d.y - d.lengte);
      ctx.stroke();
    },
  },
  vuurvliegjes: {
    dichtheid: 1 / 26000,
    nieuw: (b, h) => ({ x: willekeurig(0, b), y: willekeurig(0, h), vx: willekeurig(-0.4, 0.4), vy: willekeurig(-0.4, 0.4), fase: willekeurig(0, 6.3), blijft: true }),
    stap: (d, b, h) => {
      d.vx = Math.max(-0.6, Math.min(0.6, d.vx + willekeurig(-0.05, 0.05)));
      d.vy = Math.max(-0.6, Math.min(0.6, d.vy + willekeurig(-0.05, 0.05)));
      d.x = (d.x + d.vx + b) % b;
      d.y = (d.y + d.vy + h) % h;
      d.fase += 0.05;
    },
    teken: (ctx, d) => {
      const licht = Math.max(0, Math.sin(d.fase));
      if (licht < 0.05) return;
      ctx.fillStyle = `rgba(253, 224, 71, ${0.18 * licht})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(254, 249, 195, ${0.9 * licht})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  bits: {
    dichtheid: 1 / 16000,
    nieuw: (b, h, verspreid) => ({ x: willekeurig(0, b), y: verspreid ? willekeurig(0, h) : -14, v: willekeurig(0.4, 1.2), t: Math.random() < 0.5 ? "0" : "1", alfa: willekeurig(0.25, 0.6) }),
    stap: (d) => { d.y += d.v; if (Math.random() < 0.004) d.t = d.t === "0" ? "1" : "0"; },
    teken: (ctx, d) => {
      ctx.fillStyle = `rgba(167, 243, 208, ${d.alfa})`;
      ctx.fillText(d.t, d.x, d.y);
    },
  },
};

Object.assign(WEERSOORTEN, {
  // Kleine enveloppen die omhoog dwarrelen, op weg naar het internet.
  packets: {
    dichtheid: 1 / 26000,
    nieuw: (b, h, verspreid) => ({ x: willekeurig(0, b), y: verspreid ? willekeurig(0, h) : h + 20, v: willekeurig(0.4, 1), fase: willekeurig(0, 6.3), kleur: kies(["#bae6fd", "#bbf7d0", "#fde68a", "#fbcfe8"]) }),
    stap: (d) => { d.y -= d.v; d.fase += 0.03; d.x += Math.sin(d.fase) * 0.5; },
    teken: (ctx, d) => {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(Math.sin(d.fase) * 0.25);
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(-8, -5.5, 16, 11);
      ctx.strokeStyle = d.kleur;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-8, -5.5);
      ctx.lineTo(0, 1.5);
      ctx.lineTo(8, -5.5);
      ctx.stroke();
      ctx.restore();
    },
    weg: (d) => d.y < -20,
  },
  // Vlinders die fladderen: twee vleugels die open en dicht gaan.
  vlinders: {
    dichtheid: 1 / 60000,
    nieuw: (b, h) => ({ x: willekeurig(0, b), y: willekeurig(0, h), vx: willekeurig(-0.8, 0.8), vy: willekeurig(-0.5, 0.5), fase: willekeurig(0, 6.3), kleur: kies(["#fb923c", "#f472b6", "#facc15", "#60a5fa", "#a78bfa"]), blijft: true }),
    stap: (d, b, h) => {
      d.vx = Math.max(-1.2, Math.min(1.2, d.vx + willekeurig(-0.08, 0.08)));
      d.vy = Math.max(-0.9, Math.min(0.9, d.vy + willekeurig(-0.08, 0.08)));
      d.x = (d.x + d.vx + b) % b;
      d.y = (d.y + d.vy + h) % h;
      d.fase += 0.35;
    },
    teken: (ctx, d) => {
      const open = 0.3 + Math.abs(Math.sin(d.fase)) * 0.7;
      ctx.fillStyle = d.kleur;
      ctx.globalAlpha = 0.85;
      for (const kant of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(d.x + kant * 5 * open, d.y - 2, 6 * open, 5, kant * 0.5, 0, Math.PI * 2);
        ctx.ellipse(d.x + kant * 4 * open, d.y + 4, 4 * open, 3.5, kant * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#1f2937";
      ctx.fillRect(d.x - 1, d.y - 5, 2, 11);
      ctx.globalAlpha = 1;
    },
  },
  // Herfstbladeren die rondtollend naar beneden vallen.
  herfst: {
    dichtheid: 1 / 26000,
    nieuw: (b, h, verspreid) => ({ x: willekeurig(-50, b), y: verspreid ? willekeurig(0, h) : -20, r: willekeurig(6, 10), v: willekeurig(0.6, 1.3), wind: willekeurig(0.2, 0.8), hoek: willekeurig(0, 6.3), draai: willekeurig(-0.06, 0.06), kleur: kies(["#ea580c", "#dc2626", "#d97706", "#b45309", "#facc15"]) }),
    stap: (d) => { d.y += d.v; d.x += d.wind + Math.sin(d.y / 30) * 0.9; d.hoek += d.draai; },
    teken: (ctx, d) => {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.hoek);
      ctx.fillStyle = d.kleur;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(0, -d.r);
      ctx.quadraticCurveTo(d.r * 0.9, -d.r * 0.2, 0, d.r);
      ctx.quadraticCurveTo(-d.r * 0.9, -d.r * 0.2, 0, -d.r);
      ctx.fill();
      ctx.strokeStyle = "rgba(69, 26, 3, 0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -d.r);
      ctx.lineTo(0, d.r + 3);
      ctx.stroke();
      ctx.restore();
    },
  },
  // Confetti: kleine rechthoekjes die draaiend neerdalen.
  confetti: {
    dichtheid: 1 / 9000,
    nieuw: (b, h, verspreid) => ({ x: willekeurig(0, b), y: verspreid ? willekeurig(0, h) : -10, v: willekeurig(1, 2.2), hoek: willekeurig(0, 6.3), draai: willekeurig(-0.15, 0.15), kleur: kies(["#f472b6", "#facc15", "#4ade80", "#38bdf8", "#a78bfa", "#fb923c"]) }),
    stap: (d) => { d.y += d.v; d.hoek += d.draai; d.x += Math.sin(d.y / 25) * 0.6; },
    teken: (ctx, d) => {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.hoek);
      ctx.fillStyle = d.kleur;
      ctx.fillRect(-3, -5 * Math.abs(Math.cos(d.hoek * 2)) - 1, 6, 10 * Math.abs(Math.cos(d.hoek * 2)) + 2);
      ctx.restore();
    },
  },
  // Vallende sterren: een lange lichte streep, telkens ergens anders.
  sterrenregen: {
    dichtheid: 1 / 140000,
    nieuw: (b, h) => ({ x: willekeurig(b * 0.2, b * 1.2), y: willekeurig(-h * 0.3, h * 0.4), v: willekeurig(9, 15), leven: willekeurig(0.6, 1.4) }),
    stap: (d) => { d.x -= d.v * 0.8; d.y += d.v * 0.6; d.leven -= 0.012; },
    teken: (ctx, d) => {
      if (d.leven <= 0) return;
      const staart = ctx.createLinearGradient(d.x, d.y, d.x + 90, d.y - 68);
      staart.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, d.leven)})`);
      staart.addColorStop(1, "rgba(199, 210, 254, 0)");
      ctx.strokeStyle = staart;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + 90, d.y - 68);
      ctx.stroke();
    },
    weg: (d, b, h) => d.leven <= 0 || d.y > h + 80 || d.x < -120,
  },
  // Gouden regen: glinsters die neerdalen en even oplichten.
  goudregen: {
    dichtheid: 1 / 10000,
    nieuw: (b, h, verspreid) => ({ x: willekeurig(0, b), y: verspreid ? willekeurig(0, h) : -10, v: willekeurig(0.5, 1.2), fase: willekeurig(0, 6.3), r: willekeurig(1.5, 3.5) }),
    stap: (d) => { d.y += d.v; d.fase += 0.08; d.x += Math.sin(d.fase / 2) * 0.3; },
    teken: (ctx, d) => {
      const glans = 0.4 + Math.abs(Math.sin(d.fase)) * 0.6;
      ctx.fillStyle = `rgba(253, 224, 71, ${glans})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
      if (glans > 0.9) {
        ctx.strokeStyle = "rgba(255, 251, 235, 0.9)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(d.x - d.r * 3, d.y);
        ctx.lineTo(d.x + d.r * 3, d.y);
        ctx.moveTo(d.x, d.y - d.r * 3);
        ctx.lineTo(d.x, d.y + d.r * 3);
        ctx.stroke();
      }
    },
  },
});

const weer = { laag: null, soort: null, deeltjes: [], raf: 0, vorige: 0 };

function vulWeer() {
  const def = WEERSOORTEN[weer.soort];
  const { breedte: b, hoogte: h } = weer.laag;
  const aantal = Math.round(Math.min(220, b * h * def.dichtheid));
  weer.deeltjes = Array.from({ length: aantal }, () => def.nieuw(b, h, true));
}

function tekenWeer() {
  const { ctx, breedte: b, hoogte: h } = weer.laag;
  ctx.clearRect(0, 0, b, h);
  ctx.font = '600 14px "IBM Plex Mono", ui-monospace, monospace';
  const def = WEERSOORTEN[weer.soort];
  for (const d of weer.deeltjes) def.teken(ctx, d);
}

function stapWeer() {
  const def = WEERSOORTEN[weer.soort];
  const { breedte: b, hoogte: h } = weer.laag;
  for (let i = 0; i < weer.deeltjes.length; i++) {
    const d = weer.deeltjes[i];
    def.stap(d, b, h);
    const weg = def.weg ? def.weg(d, b, h) : d.y > h + 30 || d.x > b + 120 || d.x < -220;
    if (!d.blijft && weg) weer.deeltjes[i] = def.nieuw(b, h, false);
  }
  tekenWeer();
}

function weerLus(nu) {
  weer.raf = requestAnimationFrame(weerLus);
  if (nu - weer.vorige < STAP_MS) return;
  weer.vorige = nu - weer.vorige > STAP_MS * 4 ? nu : weer.vorige + STAP_MS;
  stapWeer();
}

function weerOpnieuw() {
  if (!weer.laag) return;
  pasAan(weer.laag);
  vulWeer();
  tekenWeer();
}

export function stelWeerIn({ soort, beweging }) {
  cancelAnimationFrame(weer.raf);
  weer.raf = 0;
  if (!WEERSOORTEN[soort]) {
    weer.laag?.canvas.remove();
    weer.laag = null;
    weer.soort = null;
    window.removeEventListener("resize", weerOpnieuw);
    return;
  }
  if (!weer.laag) {
    weer.laag = maakCanvas("weerlaag");
    if (!weer.laag) return;
    window.addEventListener("resize", weerOpnieuw);
    pasAan(weer.laag);
  }
  if (weer.soort !== soort) {
    weer.soort = soort;
    vulWeer();
  }
  tekenWeer();
  if (beweging) {
    weer.vorige = performance.now();
    weer.raf = requestAnimationFrame(weerLus);
  }
}

// ---------------------------------------------------------------- Spoor

const spoor = { laag: null, soort: null, punten: [], stukjes: [], raf: 0, laatste: null };
const LEVEN = 380;

function spoorBeweging(e) {
  if (e.pointerType !== "mouse" || !spoor.soort) return;
  const nu = performance.now();
  const punt = { x: e.clientX, y: e.clientY, t: nu };
  const vorige = spoor.laatste;
  spoor.laatste = punt;
  if (spoor.soort === "kabel" || spoor.soort === "regenboog" || spoor.soort === "neon" || spoor.soort === "komeet") {
    spoor.punten.push(punt);
    if (spoor.punten.length > 40) spoor.punten.shift();
    if (spoor.soort === "komeet") {
      spoor.stukjes.push({ x: punt.x + willekeurig(-4, 4), y: punt.y + willekeurig(-4, 4), vx: willekeurig(-0.4, 0.4), vy: willekeurig(-0.4, 0.4), t: nu, leven: willekeurig(600, 1100), r: willekeurig(1.5, 3.5), kleur: `hsl(${Math.floor(willekeurig(0, 360))} 95% 75%)` });
    }
  } else if (spoor.soort === "hartjes" || spoor.soort === "bubbels" || spoor.soort === "vuur") {
    if (!vorige || Math.hypot(punt.x - vorige.x, punt.y - vorige.y) > 10 || !spoor.stukjes.length) {
      const vuur = spoor.soort === "vuur";
      spoor.stukjes.push({
        x: punt.x + willekeurig(-4, 4),
        y: punt.y,
        vx: willekeurig(-0.3, 0.3),
        vy: vuur ? willekeurig(-1.6, -0.8) : willekeurig(-1, -0.4),
        t: nu,
        leven: vuur ? willekeurig(350, 600) : willekeurig(700, 1100),
        r: willekeurig(3, 7),
        kleur: vuur ? kies(["#fde047", "#fb923c", "#f97316", "#ef4444"]) : kies(["#f472b6", "#fb7185", "#f9a8d4", "#ef4444"]),
      });
    } else {
      spoor.laatste = vorige;
    }
  } else if (spoor.soort === "sterrenstof") {
    for (let i = 0; i < 2; i++) {
      spoor.stukjes.push({ x: punt.x + willekeurig(-6, 6), y: punt.y + willekeurig(-6, 6), vx: willekeurig(-0.6, 0.6), vy: willekeurig(-0.2, 0.9), t: nu, leven: willekeurig(500, 900), r: willekeurig(2, 4.5), kleur: kies(["#fde68a", "#ffffff", "#fcd34d", "#bae6fd"]) });
    }
  } else if (spoor.soort === "bits") {
    if (!vorige || Math.hypot(punt.x - vorige.x, punt.y - vorige.y) > 14 || !spoor.stukjes.length) {
      spoor.stukjes.push({ x: punt.x, y: punt.y, vx: 0, vy: 0.5, t: nu, leven: 800, tekst: Math.random() < 0.5 ? "0" : "1" });
    } else {
      spoor.laatste = vorige;
    }
  }
  if (spoor.stukjes.length > 160) spoor.stukjes.splice(0, spoor.stukjes.length - 160);
  if (!spoor.raf) spoor.raf = requestAnimationFrame(spoorLus);
}

function tekenLint(ctx, nu, kleurVoor, breedte) {
  const punten = spoor.punten;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (let i = 1; i < punten.length; i++) {
    const a = punten[i - 1];
    const b = punten[i];
    const rest = 1 - (nu - b.t) / LEVEN;
    if (rest <= 0) continue;
    ctx.globalAlpha = rest;
    ctx.strokeStyle = kleurVoor(i, punten.length);
    ctx.lineWidth = breedte * (0.3 + rest * 0.7);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function spoorLus() {
  const { ctx, breedte, hoogte } = spoor.laag;
  const nu = performance.now();
  ctx.clearRect(0, 0, breedte, hoogte);
  spoor.punten = spoor.punten.filter((p) => nu - p.t < LEVEN);
  spoor.stukjes = spoor.stukjes.filter((s) => nu - s.t < s.leven);

  if (spoor.soort === "kabel") {
    // Een donkere rand en dan de kabel zelf, zoals in de patchkast.
    tekenLint(ctx, nu, () => "#020b16", 9);
    tekenLint(ctx, nu, () => "#5aa9ff", 6);
  } else if (spoor.soort === "regenboog") {
    tekenLint(ctx, nu, (i) => `hsl(${(nu / 6 + i * 14) % 360} 90% 65%)`, 8);
  } else if (spoor.soort === "sterrenstof") {
    for (const s of spoor.stukjes) {
      const rest = 1 - (nu - s.t) / s.leven;
      s.x += s.vx;
      s.y += s.vy;
      ctx.globalAlpha = rest;
      ctx.strokeStyle = s.kleur;
      ctx.lineWidth = 1.4;
      const r = s.r * (0.5 + rest * 0.5);
      ctx.beginPath();
      ctx.moveTo(s.x - r, s.y);
      ctx.lineTo(s.x + r, s.y);
      ctx.moveTo(s.x, s.y - r);
      ctx.lineTo(s.x, s.y + r);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } else if (spoor.soort === "neon") {
    // Een brede zachte gloed, en de felle buis erbovenop.
    tekenLint(ctx, nu, () => "rgba(34, 211, 238, 0.25)", 16);
    tekenLint(ctx, nu, () => "#a5f3fc", 4);
  } else if (spoor.soort === "komeet") {
    tekenLint(ctx, nu, (i, n) => `hsla(${(nu / 5 + i * 9) % 360} 95% 70% / ${i / n})`, 10);
    const kop = spoor.punten[spoor.punten.length - 1];
    if (kop && nu - kop.t < LEVEN) {
      const gloed = ctx.createRadialGradient(kop.x, kop.y, 0, kop.x, kop.y, 18);
      gloed.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      gloed.addColorStop(1, "rgba(253, 230, 138, 0)");
      ctx.fillStyle = gloed;
      ctx.beginPath();
      ctx.arc(kop.x, kop.y, 18, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const st of spoor.stukjes) {
      st.x += st.vx;
      st.y += st.vy;
      ctx.globalAlpha = 1 - (nu - st.t) / st.leven;
      ctx.fillStyle = st.kleur;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  } else if (spoor.soort === "hartjes" || spoor.soort === "bubbels" || spoor.soort === "vuur") {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const st of spoor.stukjes) {
      st.x += st.vx;
      st.y += st.vy;
      const rest = 1 - (nu - st.t) / st.leven;
      ctx.globalAlpha = rest;
      if (spoor.soort === "hartjes") {
        ctx.fillStyle = st.kleur;
        ctx.font = `${Math.round(st.r * 2.6)}px system-ui, sans-serif`;
        ctx.fillText("♥", st.x, st.y);
      } else if (spoor.soort === "bubbels") {
        ctx.strokeStyle = "rgba(186, 230, 253, 0.9)";
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.beginPath();
        ctx.arc(st.x - st.r * 0.35, st.y - st.r * 0.35, st.r * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = st.kleur;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r * rest, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  } else if (spoor.soort === "bits") {
    ctx.font = '600 13px "IBM Plex Mono", ui-monospace, monospace';
    ctx.textAlign = "center";
    for (const s of spoor.stukjes) {
      s.y += s.vy;
      ctx.globalAlpha = 1 - (nu - s.t) / s.leven;
      ctx.fillStyle = "#22d3ee";
      ctx.fillText(s.tekst, s.x, s.y);
    }
    ctx.globalAlpha = 1;
  }

  // Niets meer te tekenen: stilzetten tot de muis weer beweegt.
  if (spoor.punten.length || spoor.stukjes.length) spoor.raf = requestAnimationFrame(spoorLus);
  else spoor.raf = 0;
}

function spoorOpnieuw() {
  if (spoor.laag) pasAan(spoor.laag);
}

export function stelSpoorIn({ soort, beweging }) {
  const aan = beweging && soort && soort !== "geen";
  if (!aan) {
    cancelAnimationFrame(spoor.raf);
    spoor.raf = 0;
    spoor.laag?.canvas.remove();
    spoor.laag = null;
    spoor.soort = null;
    spoor.punten = [];
    spoor.stukjes = [];
    window.removeEventListener("pointermove", spoorBeweging);
    window.removeEventListener("resize", spoorOpnieuw);
    return;
  }
  if (!spoor.laag) {
    spoor.laag = maakCanvas("spoorlaag");
    if (!spoor.laag) return;
    pasAan(spoor.laag);
    window.addEventListener("pointermove", spoorBeweging, { passive: true });
    window.addEventListener("resize", spoorOpnieuw);
  }
  spoor.soort = soort;
  spoor.punten = [];
  spoor.stukjes = [];
}
