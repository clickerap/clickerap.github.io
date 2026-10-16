// Levende achtergronden op een canvas: Netwerkkaart, Glasvezel, Datacenter,
// Warpsprong, Zeebodem, Lavalamp, Blokjes, Aquarium, Meteorenregen, Vuurwerk
// en Heelal.
//
// Elke scène tekent zijn vaste deel (lucht, lijnen, vezels) één keer op een
// apart canvas. Elke stap kopieert dat beeld en tekent alleen wat beweegt
// erover: packets of lichtpulsen. Het canvas bestaat alleen zolang zo'n
// achtergrond aanstaat. Met animaties uit blijft er een stilstaand beeld staan.

const STAP_MS = 33; // ongeveer dertig beelden per seconde

const willekeurig = (min, max) => min + Math.random() * (max - min);
const kies = (lijst) => lijst[Math.floor(Math.random() * lijst.length)];

function lucht(k, breedte, hoogte, boven, onder) {
  const verloop = k.createLinearGradient(0, 0, breedte * 0.4, hoogte);
  verloop.addColorStop(0, boven);
  verloop.addColorStop(1, onder);
  k.fillStyle = verloop;
  k.fillRect(0, 0, breedte, hoogte);
}

// ------------------------------------------------------------ Netwerkkaart
// Knooppunten verbonden met hun buren. Packets reizen van knoop naar knoop;
// een knoop licht kort op als er een aankomt.

const netwerk = {
  bouw(k, breedte, hoogte) {
    const afstand = Math.max(90, Math.min(150, Math.sqrt((breedte * hoogte) / 70)));
    const knopen = [];
    for (let y = afstand / 2, rij = 0; y < hoogte + afstand / 2; y += afstand * 0.87, rij++) {
      for (let x = (rij % 2) * afstand * 0.5; x < breedte + afstand / 2; x += afstand) {
        if (Math.random() < 0.18) continue;
        knopen.push({ x: x + willekeurig(-0.3, 0.3) * afstand, y: y + willekeurig(-0.3, 0.3) * afstand, buren: [], gloed: 0, groot: Math.random() < 0.12 });
      }
    }
    // Elke knoop verbindt met zijn twee à drie dichtste buren.
    for (const a of knopen) {
      const dichtbij = knopen
        .filter((b) => b !== a)
        .map((b) => ({ b, d: Math.hypot(b.x - a.x, b.y - a.y) }))
        .sort((p, q) => p.d - q.d)
        .slice(0, Math.random() < 0.4 ? 3 : 2);
      for (const { b, d } of dichtbij) {
        if (d > afstand * 1.9 || a.buren.includes(b)) continue;
        a.buren.push(b);
        b.buren.push(a);
      }
    }
    lucht(k, breedte, hoogte, "#0c2447", "#020617");
    k.strokeStyle = "rgba(147, 197, 253, 0.16)";
    k.lineWidth = 1.2;
    k.beginPath();
    for (const a of knopen) {
      for (const b of a.buren) {
        if (b.x < a.x) continue;
        k.moveTo(a.x, a.y);
        k.lineTo(b.x, b.y);
      }
    }
    k.stroke();
    for (const a of knopen) {
      k.fillStyle = a.groot ? "rgba(191, 219, 254, 0.7)" : "rgba(147, 197, 253, 0.45)";
      k.beginPath();
      k.arc(a.x, a.y, a.groot ? 4 : 2.5, 0, Math.PI * 2);
      k.fill();
    }
    const verbonden = knopen.filter((a) => a.buren.length);
    const nieuw = () => {
      const van = kies(verbonden);
      return { van, naar: kies(van.buren), t: Math.random(), snelheid: willekeurig(0.012, 0.03), kleur: kies(["#67e8f9", "#6ee7a8", "#fcd34d", "#c4b5fd"]) };
    };
    return { knopen, packets: verbonden.length ? Array.from({ length: Math.round(verbonden.length * 0.35) }, nieuw) : [] };
  },

  stap(s) {
    for (const k of s.knopen) k.gloed *= 0.9;
    for (const p of s.packets) {
      p.t += p.snelheid;
      if (p.t < 1) continue;
      // Aangekomen: de knoop licht op, en het packet reist verder, liefst niet
      // meteen terug waar het vandaan kwam.
      p.naar.gloed = 1;
      const verder = p.naar.buren.filter((b) => b !== p.van);
      p.van = p.naar;
      p.naar = kies(verder.length ? verder : p.van.buren);
      p.t = 0;
    }
  },

  teken(ctx, s) {
    for (const k of s.knopen) {
      if (k.gloed <= 0.02) continue;
      ctx.fillStyle = `rgba(165, 243, 252, ${k.gloed * 0.5})`;
      ctx.beginPath();
      ctx.arc(k.x, k.y, 4 + k.gloed * 9, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.lineWidth = 2;
    for (const p of s.packets) {
      const x = p.van.x + (p.naar.x - p.van.x) * p.t;
      const y = p.van.y + (p.naar.y - p.van.y) * p.t;
      const terug = Math.max(0, p.t - 0.12);
      ctx.strokeStyle = p.kleur;
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.moveTo(p.van.x + (p.naar.x - p.van.x) * terug, p.van.y + (p.naar.y - p.van.y) * terug);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = p.kleur;
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};

// --------------------------------------------------------------- Glasvezel
// Een bundel vezels die linksonder uit het scherm komt en naar boven en
// rechts uitwaaiert. Door elke vezel schieten pulsen licht, met een staart.

const glasvezel = {
  bouw(k, breedte, hoogte) {
    const aantal = Math.round(Math.min(70, Math.max(26, breedte / 26)));
    const kleuren = ["#67e8f9", "#a78bfa", "#f472b6", "#6ee7a8", "#93c5fd"];
    const vezels = [];
    for (let i = 0; i < aantal; i++) {
      // Van een punt net buiten beeld linksonder, naar de boven- of rechterrand.
      const begin = { x: willekeurig(-0.12, 0.05) * breedte, y: hoogte * willekeurig(1.02, 1.12) };
      const f = i / (aantal - 1);
      const eind = f < 0.55
        ? { x: breedte * (0.05 + (f / 0.55) * 1.0), y: -20 }
        : { x: breedte + 20, y: hoogte * ((f - 0.55) / 0.45) * 0.95 };
      const buig = { x: begin.x + (eind.x - begin.x) * willekeurig(0.15, 0.45), y: begin.y + (eind.y - begin.y) * willekeurig(0.55, 0.85) };
      const punten = [];
      for (let j = 0; j <= 80; j++) {
        const t = j / 80;
        punten.push({
          x: (1 - t) ** 2 * begin.x + 2 * (1 - t) * t * buig.x + t ** 2 * eind.x,
          y: (1 - t) ** 2 * begin.y + 2 * (1 - t) * t * buig.y + t ** 2 * eind.y,
        });
      }
      const kleur = kies(kleuren);
      const pulsen = Array.from({ length: Math.random() < 0.35 ? 2 : 1 }, () => ({ s: Math.random() * 1.4 - 0.2, snelheid: willekeurig(0.004, 0.011) }));
      vezels.push({ punten, kleur, pulsen });
    }
    lucht(k, breedte, hoogte, "#0b1e3a", "#02040c");
    k.lineWidth = 1.4;
    for (const v of vezels) {
      k.strokeStyle = "rgba(125, 211, 252, 0.09)";
      k.beginPath();
      v.punten.forEach((p, j) => (j ? k.lineTo(p.x, p.y) : k.moveTo(p.x, p.y)));
      k.stroke();
    }
    return { vezels };
  },

  stap(s) {
    for (const v of s.vezels) {
      for (const p of v.pulsen) {
        p.s += p.snelheid;
        if (p.s > 1.25) {
          p.s = -willekeurig(0.05, 0.6);
          p.snelheid = willekeurig(0.004, 0.011);
        }
      }
    }
  },

  teken(ctx, s) {
    ctx.lineCap = "round";
    for (const v of s.vezels) {
      const n = v.punten.length - 1;
      for (const p of v.pulsen) {
        const kop = Math.round(p.s * n);
        const staart = kop - 14;
        if (kop < 1 || staart > n) continue;
        ctx.strokeStyle = v.kleur;
        // Van de staart naar de kop steeds feller.
        for (let j = Math.max(1, staart); j <= Math.min(n, kop); j++) {
          const f = (j - staart) / (kop - staart);
          ctx.globalAlpha = f * 0.9;
          ctx.lineWidth = 1 + f * 2.4;
          ctx.beginPath();
          ctx.moveTo(v.punten[j - 1].x, v.punten[j - 1].y);
          ctx.lineTo(v.punten[j].x, v.punten[j].y);
          ctx.stroke();
        }
        if (kop <= n) {
          const k = v.punten[kop];
          ctx.globalAlpha = 0.25;
          ctx.fillStyle = v.kleur;
          ctx.beginPath();
          ctx.arc(k.x, k.y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#f0f9ff";
          ctx.beginPath();
          ctx.arc(k.x, k.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
  },
};

// -------------------------------------------------------------- Datacenter
// Een rij racks van vooraan gezien. De kasten zelf staan vast; de lampjes
// knipperen elk in hun eigen ritme: groen voor een link, oranje voor
// activiteit, soms blauw voor een identificatielampje.

const datacenter = {
  bouw(k, breedte, hoogte) {
    const rackBreedte = 74;
    const unit = 16;
    const tussen = 14;
    lucht(k, breedte, hoogte, "#0b1626", "#03060c");
    // Koude lucht die van boven in de gang valt.
    const koud = k.createLinearGradient(0, 0, 0, hoogte);
    koud.addColorStop(0, "rgba(56, 189, 248, 0.14)");
    koud.addColorStop(0.5, "rgba(56, 189, 248, 0)");
    k.fillStyle = koud;
    k.fillRect(0, 0, breedte, hoogte);
    const lampjes = [];
    for (let x = 10; x < breedte; x += rackBreedte + tussen) {
      k.fillStyle = "#111c2b";
      k.fillRect(x, 0, rackBreedte, hoogte);
      k.fillStyle = "#1c2a3d";
      k.fillRect(x, 0, 5, hoogte);
      k.fillRect(x + rackBreedte - 5, 0, 5, hoogte);
      for (let y = 10; y < hoogte - unit; y += unit + 2) {
        // Niet elke plek in het rack is bezet.
        if (Math.random() < 0.15) continue;
        k.fillStyle = "#18263a";
        k.fillRect(x + 8, y, rackBreedte - 16, unit);
        k.fillStyle = "rgba(255, 255, 255, 0.04)";
        k.fillRect(x + 8, y, rackBreedte - 16, 1);
        const aantal = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < aantal; i++) {
          const r = Math.random();
          lampjes.push({
            x: x + rackBreedte - 16 - i * 7,
            y: y + unit / 2 - 1.5,
            kleur: r < 0.6 ? "#4ade80" : r < 0.93 ? "#fbbf24" : "#60a5fa",
            aan: Math.random() < 0.6,
            kans: r < 0.6 ? 0.02 : 0.2,
          });
        }
      }
    }
    return { lampjes };
  },

  stap(s) {
    for (const l of s.lampjes) if (Math.random() < l.kans) l.aan = !l.aan;
  },

  teken(ctx, s) {
    for (const l of s.lampjes) {
      if (!l.aan) continue;
      ctx.fillStyle = l.kleur;
      ctx.fillRect(l.x, l.y, 3, 3);
    }
  },
};

// ------------------------------------------------------------------- Warp
// Sterren die vanuit het midden naar je toe schieten. Elke ster wordt een
// streep van waar hij net was naar waar hij nu is.

const warp = {
  bouw(k, breedte, hoogte) {
    lucht(k, breedte, hoogte, "#0a0620", "#000000");
    const gloed = k.createRadialGradient(breedte / 2, hoogte / 2, 0, breedte / 2, hoogte / 2, Math.max(breedte, hoogte) * 0.5);
    gloed.addColorStop(0, "rgba(129, 140, 248, 0.25)");
    gloed.addColorStop(1, "rgba(129, 140, 248, 0)");
    k.fillStyle = gloed;
    k.fillRect(0, 0, breedte, hoogte);
    const nieuw = (verspreid) => ({ x: willekeurig(-1, 1), y: willekeurig(-1, 1), z: verspreid ? willekeurig(0.05, 1) : 1, pz: null });
    return { breedte, hoogte, nieuw, sterren: Array.from({ length: Math.round(Math.min(700, (breedte * hoogte) / 1800)) }, () => nieuw(true)) };
  },

  stap(s) {
    for (let i = 0; i < s.sterren.length; i++) {
      const st = s.sterren[i];
      st.pz = st.z;
      st.z -= 0.016;
      if (st.z <= 0.03) s.sterren[i] = s.nieuw(false);
    }
  },

  teken(ctx, s) {
    const mx = s.breedte / 2;
    const my = s.hoogte / 2;
    const schaal = Math.max(s.breedte, s.hoogte) * 0.5;
    ctx.lineCap = "round";
    for (const st of s.sterren) {
      const x = mx + (st.x / st.z) * schaal;
      const y = my + (st.y / st.z) * schaal;
      // Een langere streep dan één stap: zo voelt het als lichtsnelheid.
      const pz = Math.min(1, (st.pz ?? st.z) + 0.02);
      const px = mx + (st.x / pz) * schaal;
      const py = my + (st.y / pz) * schaal;
      const helder = Math.min(1, 0.25 + (1 - st.z) * 1.6);
      ctx.strokeStyle = `rgba(${200 + Math.round(55 * helder)}, ${210 + Math.round(45 * helder)}, 255, ${helder})`;
      ctx.lineWidth = 0.6 + helder * 2;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  },
};

// --------------------------------------------------------------- Zeebodem
// Diep water met lichtbundels van boven. Over de bodem loopt een zeekabel
// waar pulsen licht doorheen trekken, en er stijgen bellen op.

const zeebodem = {
  bouw(k, breedte, hoogte) {
    const water = k.createLinearGradient(0, 0, 0, hoogte);
    water.addColorStop(0, "#0e4a6e");
    water.addColorStop(0.55, "#072b47");
    water.addColorStop(1, "#020c18");
    k.fillStyle = water;
    k.fillRect(0, 0, breedte, hoogte);
    // Schuine lichtbundels van het oppervlak.
    for (let i = 0; i < 6; i++) {
      const x = willekeurig(0, breedte);
      const bundel = k.createLinearGradient(x, 0, x - 120, hoogte * 0.8);
      bundel.addColorStop(0, "rgba(186, 230, 253, 0.12)");
      bundel.addColorStop(1, "rgba(186, 230, 253, 0)");
      k.fillStyle = bundel;
      k.beginPath();
      k.moveTo(x - 30, 0);
      k.lineTo(x + 40, 0);
      k.lineTo(x - 80, hoogte * 0.85);
      k.lineTo(x - 260, hoogte * 0.85);
      k.closePath();
      k.fill();
    }
    // De bodem en de kabel die erover golft.
    const bodem = hoogte * 0.9;
    k.fillStyle = "#0b1a24";
    k.beginPath();
    k.moveTo(0, hoogte);
    for (let x = 0; x <= breedte; x += 40) k.lineTo(x, bodem + Math.sin(x / 90) * 8 + 10);
    k.lineTo(breedte, hoogte);
    k.fill();
    const kabel = [];
    for (let x = -20; x <= breedte + 20; x += 6) kabel.push({ x, y: bodem + Math.sin(x / 140) * 12 - 4 });
    k.strokeStyle = "#020608";
    k.lineWidth = 9;
    k.lineCap = "round";
    k.beginPath();
    kabel.forEach((p, i) => (i ? k.lineTo(p.x, p.y) : k.moveTo(p.x, p.y)));
    k.stroke();
    k.strokeStyle = "#1f2f3a";
    k.lineWidth = 5;
    k.stroke();
    const bel = (verspreid) => ({ x: willekeurig(0, breedte), y: verspreid ? willekeurig(0, hoogte) : bodem + willekeurig(0, 20), r: willekeurig(1.5, 5), v: willekeurig(0.4, 1.3), fase: willekeurig(0, 6.3) });
    return {
      hoogte,
      kabel,
      bel,
      bellen: Array.from({ length: Math.round(Math.min(90, breedte / 16)) }, () => bel(true)),
      pulsen: Array.from({ length: 3 }, (_, i) => ({ s: i / 3, v: willekeurig(0.002, 0.004), kleur: kies(["#67e8f9", "#a7f3d0", "#c4b5fd"]) })),
    };
  },

  stap(s) {
    for (let i = 0; i < s.bellen.length; i++) {
      const b = s.bellen[i];
      b.y -= b.v;
      b.fase += 0.05;
      b.x += Math.sin(b.fase) * 0.35;
      if (b.y < -10) s.bellen[i] = s.bel(false);
    }
    for (const p of s.pulsen) p.s = (p.s + p.v) % 1;
  },

  teken(ctx, s) {
    ctx.lineWidth = 1.2;
    for (const b of s.bellen) {
      ctx.strokeStyle = `rgba(186, 230, 253, ${0.25 + b.r / 14})`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.lineCap = "round";
    for (const p of s.pulsen) {
      const kop = Math.floor(p.s * (s.kabel.length - 1));
      for (let j = Math.max(1, kop - 18); j <= kop; j++) {
        const f = (j - (kop - 18)) / 18;
        ctx.globalAlpha = f;
        ctx.strokeStyle = p.kleur;
        ctx.lineWidth = 2 + f * 2;
        ctx.beginPath();
        ctx.moveTo(s.kabel[j - 1].x, s.kabel[j - 1].y);
        ctx.lineTo(s.kabel[j].x, s.kabel[j].y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  },
};

// --------------------------------------------------------------- Lavalamp
// Grote warme bellen die elk in hun eigen tempo stijgen en zakken. Waar ze
// elkaar raken, lichten ze samen op.

const lavalamp = {
  bouw(k, breedte, hoogte) {
    const achter = k.createLinearGradient(0, 0, 0, hoogte);
    achter.addColorStop(0, "#3b0764");
    achter.addColorStop(0.6, "#7f1d1d");
    achter.addColorStop(1, "#431407");
    k.fillStyle = achter;
    k.fillRect(0, 0, breedte, hoogte);
    const aantal = Math.round(Math.min(11, Math.max(6, breedte / 160)));
    const bellen = Array.from({ length: aantal }, (_, i) => ({
      x: ((i + 0.5) / aantal) * breedte + willekeurig(-40, 40),
      r: willekeurig(90, 190),
      periode: willekeurig(900, 1800),
      fase: willekeurig(0, 6.3),
      kleur: kies([[251, 146, 60], [250, 204, 21], [244, 63, 94], [236, 72, 153]]),
    }));
    return { breedte, hoogte, bellen, tik: 0 };
  },

  stap(s) {
    s.tik++;
  },

  teken(ctx, s) {
    ctx.globalCompositeOperation = "lighter";
    for (const b of s.bellen) {
      const y = s.hoogte / 2 + Math.sin(s.tik / (b.periode / 6.28) + b.fase) * (s.hoogte / 2 + b.r * 0.3);
      const x = b.x + Math.sin(s.tik / 300 + b.fase) * 30;
      const [r, g, bl] = b.kleur;
      const gloed = ctx.createRadialGradient(x, y, 0, x, y, b.r);
      gloed.addColorStop(0, `rgba(${r}, ${g}, ${bl}, 0.75)`);
      gloed.addColorStop(0.55, `rgba(${r}, ${g}, ${bl}, 0.45)`);
      gloed.addColorStop(1, `rgba(${r}, ${g}, ${bl}, 0)`);
      ctx.fillStyle = gloed;
      ctx.beginPath();
      ctx.arc(x, y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  },
};

// ----------------------------------------------------------------- Blokjes
// Vallende blokken die netjes op elkaar landen. Is een rij vol, dan licht hij
// op en verdwijnt hij, en zakt alles erboven een rij.

const BLOKVORMEN = [
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [1, 1]],
  [[0, 0], [0, 1], [1, 1], [2, 1]],
  [[2, 0], [0, 1], [1, 1], [2, 1]],
  [[1, 0], [2, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [1, 1], [2, 1]],
];
const BLOKKLEUREN = ["#22d3ee", "#facc15", "#a78bfa", "#3b82f6", "#fb923c", "#4ade80", "#f87171"];

const blokjes = {
  bouw(k, breedte, hoogte) {
    lucht(k, breedte, hoogte, "#111827", "#030712");
    const maat = 26;
    const kolommen = Math.ceil(breedte / maat);
    const rijen = Math.ceil(hoogte / maat);
    k.strokeStyle = "rgba(148, 163, 184, 0.06)";
    for (let x = 0; x <= kolommen; x++) {
      k.beginPath();
      k.moveTo(x * maat, 0);
      k.lineTo(x * maat, hoogte);
      k.stroke();
    }
    // Een lage stapel om mee te beginnen.
    const veld = Array.from({ length: rijen }, (_, r) => Array.from({ length: kolommen }, () => (r > rijen - 4 && Math.random() < 0.55 ? kies(BLOKKLEUREN) : null)));
    const s = { maat, kolommen, rijen, veld, vallend: [], flits: [] };
    for (let i = 0; i < Math.max(3, Math.floor(kolommen / 6)); i++) s.vallend.push(nieuwBlok(s, true));
    return s;
  },

  stap(s) {
    for (let i = 0; i < s.vallend.length; i++) {
      const b = s.vallend[i];
      b.tik++;
      if (b.tik % 4) continue;
      const kan = b.cellen.every(([x, y]) => {
        const nx = b.x + x;
        const ny = b.y + y + 1;
        return ny < s.rijen && !s.veld[ny]?.[nx];
      });
      if (kan) {
        b.y++;
        continue;
      }
      // Geland: in het veld zetten, volle rijen weghalen, een nieuw blok.
      for (const [x, y] of b.cellen) if (b.y + y >= 0 && s.veld[b.y + y]) s.veld[b.y + y][b.x + x] = b.kleur;
      for (let r = s.rijen - 1; r >= 0; r--) {
        if (s.veld[r].filter(Boolean).length >= s.kolommen * 0.8) {
          s.flits.push({ r, t: 12 });
          s.veld.splice(r, 1);
          s.veld.unshift(Array.from({ length: s.kolommen }, () => null));
          r++;
        }
      }
      // Te hoog opgestapeld: begin opnieuw met een lege bodem.
      if (s.veld.slice(0, 3).some((rij) => rij.some(Boolean))) s.veld = s.veld.map(() => Array.from({ length: s.kolommen }, () => null));
      s.vallend[i] = nieuwBlok(s, false);
    }
    for (const f of s.flits) f.t--;
    s.flits = s.flits.filter((f) => f.t > 0);
  },

  teken(ctx, s) {
    const m = s.maat;
    const cel = (x, y, kleur) => {
      ctx.fillStyle = kleur;
      ctx.fillRect(x * m + 1, y * m + 1, m - 2, m - 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.fillRect(x * m + 1, y * m + 1, m - 2, 4);
    };
    ctx.globalAlpha = 0.55;
    for (let r = 0; r < s.rijen; r++) for (let c = 0; c < s.kolommen; c++) if (s.veld[r][c]) cel(c, r, s.veld[r][c]);
    ctx.globalAlpha = 0.85;
    for (const b of s.vallend) for (const [x, y] of b.cellen) if (b.y + y >= 0) cel(b.x + x, b.y + y, b.kleur);
    for (const f of s.flits) {
      ctx.globalAlpha = f.t / 12;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, f.r * m, s.kolommen * m, m);
    }
    ctx.globalAlpha = 1;
  },
};

function nieuwBlok(s, verspreid) {
  const cellen = kies(BLOKVORMEN);
  return { cellen, kleur: kies(BLOKKLEUREN), x: Math.floor(Math.random() * (s.kolommen - 3)), y: verspreid ? Math.floor(Math.random() * s.rijen * 0.6) - 2 : -2, tik: Math.floor(Math.random() * 4) };
}

// --------------------------------------------------------------- Aquarium
// Vissen die rustig heen en weer zwemmen, planten die wiegen, en bellen.

const aquarium = {
  bouw(k, breedte, hoogte) {
    const water = k.createLinearGradient(0, 0, 0, hoogte);
    water.addColorStop(0, "#0ea5e9");
    water.addColorStop(0.5, "#0369a1");
    water.addColorStop(1, "#0c4a6e");
    k.fillStyle = water;
    k.fillRect(0, 0, breedte, hoogte);
    // Zand en stenen op de bodem.
    k.fillStyle = "#c2a878";
    k.beginPath();
    k.moveTo(0, hoogte);
    for (let x = 0; x <= breedte; x += 30) k.lineTo(x, hoogte * 0.93 + Math.sin(x / 70) * 8);
    k.lineTo(breedte, hoogte);
    k.fill();
    for (let i = 0; i < breedte / 90; i++) {
      k.fillStyle = kies(["#64748b", "#475569", "#94a3b8"]);
      k.beginPath();
      k.ellipse(willekeurig(0, breedte), hoogte * willekeurig(0.93, 0.98), willekeurig(8, 22), willekeurig(5, 12), 0, 0, Math.PI * 2);
      k.fill();
    }
    const vissen = Array.from({ length: Math.round(Math.min(22, breedte / 90)) }, () => ({
      x: willekeurig(0, breedte),
      y: willekeurig(hoogte * 0.1, hoogte * 0.82),
      v: willekeurig(0.4, 1.3) * (Math.random() < 0.5 ? -1 : 1),
      fase: willekeurig(0, 6.3),
      teken: kies(["🐟", "🐠", "🐡", "🐟", "🐠", "🦑", "🐙"]),
      maat: willekeurig(22, 40),
    }));
    const planten = Array.from({ length: Math.round(breedte / 70) }, () => ({ x: willekeurig(0, breedte), h: willekeurig(60, 170), fase: willekeurig(0, 6.3), kleur: kies(["#16a34a", "#15803d", "#22c55e"]) }));
    const bel = () => ({ x: willekeurig(0, breedte), y: hoogte + willekeurig(0, 200), r: willekeurig(2, 5), v: willekeurig(0.5, 1.4) });
    return { breedte, hoogte, vissen, planten, bellen: Array.from({ length: 40 }, bel), bel, tik: 0 };
  },

  stap(s) {
    s.tik++;
    for (const v of s.vissen) {
      v.x += v.v;
      v.fase += 0.04;
      if (v.x < -60) v.x = s.breedte + 50;
      if (v.x > s.breedte + 60) v.x = -50;
    }
    for (let i = 0; i < s.bellen.length; i++) {
      const b = s.bellen[i];
      b.y -= b.v;
      b.x += Math.sin((b.y + i) / 30) * 0.4;
      if (b.y < -10) s.bellen[i] = s.bel();
    }
  },

  teken(ctx, s) {
    for (const p of s.planten) {
      const zwaai = Math.sin(s.tik / 40 + p.fase) * 12;
      ctx.strokeStyle = p.kleur;
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(p.x, s.hoogte);
      ctx.quadraticCurveTo(p.x + zwaai, s.hoogte - p.h / 2, p.x + zwaai * 1.6, s.hoogte - p.h);
      ctx.stroke();
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const v of s.vissen) {
      ctx.save();
      ctx.translate(v.x, v.y + Math.sin(v.fase) * 6);
      // De emoji kijken naar links; wie naar rechts zwemt, wordt gespiegeld.
      if (v.v > 0) ctx.scale(-1, 1);
      ctx.font = `${v.maat}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
      ctx.fillText(v.teken, 0, 0);
      ctx.restore();
    }
    ctx.strokeStyle = "rgba(224, 242, 254, 0.6)";
    ctx.lineWidth = 1;
    for (const b of s.bellen) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.stroke();
    }
  },
};

// ---------------------------------------------------------- Meteorenregen
// Een stille sterrenhemel waar telkens een vallende ster doorheen schiet.

const meteoren = {
  bouw(k, breedte, hoogte) {
    lucht(k, breedte, hoogte, "#0f172a", "#020617");
    for (let i = 0; i < (breedte * hoogte) / 3500; i++) {
      k.fillStyle = `rgba(255, 255, 255, ${willekeurig(0.2, 0.9)})`;
      k.beginPath();
      k.arc(willekeurig(0, breedte), willekeurig(0, hoogte), willekeurig(0.4, 1.4), 0, Math.PI * 2);
      k.fill();
    }
    return { breedte, hoogte, strepen: [] };
  },

  stap(s) {
    if (Math.random() < 0.05) {
      const hoek = willekeurig(0.5, 0.9);
      const snelheid = willekeurig(12, 20);
      s.strepen.push({ x: willekeurig(s.breedte * 0.1, s.breedte * 1.1), y: willekeurig(-50, s.hoogte * 0.4), vx: -Math.cos(hoek) * snelheid, vy: Math.sin(hoek) * snelheid, leven: 1 });
    }
    for (const m of s.strepen) {
      m.x += m.vx;
      m.y += m.vy;
      m.leven -= 0.018;
    }
    s.strepen = s.strepen.filter((m) => m.leven > 0);
  },

  teken(ctx, s) {
    ctx.lineCap = "round";
    for (const m of s.strepen) {
      const staart = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 9, m.y - m.vy * 9);
      staart.addColorStop(0, `rgba(255, 255, 255, ${m.leven})`);
      staart.addColorStop(1, "rgba(165, 180, 252, 0)");
      ctx.strokeStyle = staart;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 9, m.y - m.vy * 9);
      ctx.stroke();
    }
  },
};

// ---------------------------------------------------------------- Vuurwerk
// Pijlen die opstijgen en openbarsten in vonken die langzaam uitdoven.

const vuurwerk = {
  bouw(k, breedte, hoogte) {
    lucht(k, breedte, hoogte, "#0b1026", "#01030a");
    // Silhouet van een stad onderaan.
    k.fillStyle = "#050814";
    let x = 0;
    while (x < breedte) {
      const b = willekeurig(30, 80);
      const h = willekeurig(40, 150);
      k.fillRect(x, hoogte - h, b, h);
      k.fillStyle = "rgba(253, 224, 71, 0.35)";
      for (let r = hoogte - h + 8; r < hoogte - 8; r += 14) for (let c = x + 6; c < x + b - 6; c += 12) if (Math.random() < 0.25) k.fillRect(c, r, 4, 6);
      k.fillStyle = "#050814";
      x += b + 2;
    }
    return { breedte, hoogte, pijlen: [], vonken: [] };
  },

  stap(s) {
    if (Math.random() < 0.035 && s.pijlen.length < 4) {
      s.pijlen.push({ x: willekeurig(s.breedte * 0.1, s.breedte * 0.9), y: s.hoogte, vy: -willekeurig(9, 13), top: willekeurig(s.hoogte * 0.12, s.hoogte * 0.45), kleur: kies(["#f472b6", "#facc15", "#4ade80", "#38bdf8", "#a78bfa", "#fb923c", "#ffffff"]) });
    }
    for (const p of s.pijlen) {
      p.y += p.vy;
      if (p.y <= p.top) {
        p.klaar = true;
        const n = 46;
        for (let i = 0; i < n; i++) {
          const hoek = (Math.PI * 2 * i) / n;
          const kracht = willekeurig(2, 4.5);
          s.vonken.push({ x: p.x, y: p.y, vx: Math.cos(hoek) * kracht, vy: Math.sin(hoek) * kracht, leven: 1, kleur: p.kleur });
        }
      }
    }
    s.pijlen = s.pijlen.filter((p) => !p.klaar);
    for (const v of s.vonken) {
      v.x += v.vx;
      v.y += v.vy;
      v.vx *= 0.97;
      v.vy = v.vy * 0.97 + 0.05;
      v.leven -= 0.014;
    }
    s.vonken = s.vonken.filter((v) => v.leven > 0);
  },

  teken(ctx, s) {
    for (const p of s.pijlen) {
      ctx.fillStyle = "#fef3c7";
      ctx.fillRect(p.x - 1, p.y, 2, 10);
    }
    for (const v of s.vonken) {
      ctx.globalAlpha = Math.max(0, v.leven);
      ctx.fillStyle = v.kleur;
      ctx.beginPath();
      ctx.arc(v.x, v.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  },
};

// ------------------------------------------------------------------ Heelal
// Een spiraalstelsel van duizenden sterren dat langzaam om zijn kern draait.

const heelal = {
  bouw(k, breedte, hoogte) {
    lucht(k, breedte, hoogte, "#0a0418", "#000000");
    for (let i = 0; i < (breedte * hoogte) / 5000; i++) {
      k.fillStyle = `rgba(255, 255, 255, ${willekeurig(0.15, 0.6)})`;
      k.fillRect(willekeurig(0, breedte), willekeurig(0, hoogte), 1, 1);
    }
    const straal = Math.max(breedte, hoogte) * 0.55;
    const sterren = Array.from({ length: 1400 }, () => {
      const arm = Math.floor(Math.random() * 3);
      const r = Math.pow(Math.random(), 1.6) * straal;
      const hoek = arm * ((Math.PI * 2) / 3) + r / (straal * 0.22) + willekeurig(-0.35, 0.35);
      const warm = r < straal * 0.18;
      return { r, hoek, kleur: warm ? kies(["#fde68a", "#fbcfe8", "#ffffff"]) : kies(["#c7d2fe", "#a5b4fc", "#f0abfc", "#ffffff", "#93c5fd"]), grootte: willekeurig(0.6, 1.8) };
    });
    return { mx: breedte / 2, my: hoogte / 2, sterren, draai: 0, straal };
  },

  stap(s) {
    s.draai += 0.0009;
  },

  teken(ctx, s) {
    const kern = ctx.createRadialGradient(s.mx, s.my, 0, s.mx, s.my, s.straal * 0.3);
    kern.addColorStop(0, "rgba(253, 230, 138, 0.35)");
    kern.addColorStop(1, "rgba(253, 230, 138, 0)");
    ctx.fillStyle = kern;
    ctx.fillRect(s.mx - s.straal * 0.3, s.my - s.straal * 0.3, s.straal * 0.6, s.straal * 0.6);
    for (const st of s.sterren) {
      // Binnenste sterren draaien sneller, zoals in een echt stelsel.
      const h = st.hoek + s.draai * (1 + (s.straal / (st.r + 60)) * 0.6);
      ctx.fillStyle = st.kleur;
      ctx.globalAlpha = 0.75;
      ctx.fillRect(s.mx + Math.cos(h) * st.r, s.my + Math.sin(h) * st.r * 0.55, st.grootte, st.grootte);
    }
    ctx.globalAlpha = 1;
  },
};

const SCENES = { netwerk, glasvezel, datacenter, warp, zeebodem, lavalamp, blokjes, aquarium, meteoren, vuurwerk, heelal };
export const LEVENDE_ACHTERGRONDEN = Object.keys(SCENES);

// --------------------------------------------------------------- Motor

let canvas = null;
let ctx = null;
let vast = null;
let scene = null;
let staat = null;
let raf = 0;
let vorige = 0;

function pasAan() {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const breedte = window.innerWidth;
  const hoogte = window.innerHeight;
  canvas.width = Math.ceil(breedte * dpr);
  canvas.height = Math.ceil(hoogte * dpr);
  vast = document.createElement("canvas");
  vast.width = canvas.width;
  vast.height = canvas.height;
  const k = vast.getContext("2d");
  k.setTransform(dpr, 0, 0, dpr, 0, 0);
  staat = SCENES[scene].bouw(k, breedte, hoogte);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function teken() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(vast, 0, 0);
  ctx.restore();
  SCENES[scene].teken(ctx, staat);
}

function lus(nu) {
  raf = requestAnimationFrame(lus);
  if (nu - vorige < STAP_MS) return;
  // Na een pauze (ander tabblad) niet alle gemiste stappen inhalen.
  vorige = nu - vorige > STAP_MS * 4 ? nu : vorige + STAP_MS;
  SCENES[scene].stap(staat);
  teken();
}

function opnieuw() {
  if (!canvas) return;
  pasAan();
  teken();
}

function opruimen() {
  cancelAnimationFrame(raf);
  raf = 0;
  window.removeEventListener("resize", opnieuw);
  canvas?.remove();
  canvas = ctx = vast = staat = scene = null;
}

// Zet een levende achtergrond aan (`scene` is een van LEVENDE_ACHTERGRONDEN)
// of uit (null). `beweging` volgt de instelling Animaties en de systeemvoorkeur.
export function stelLevendIn({ scene: gewenst, beweging }) {
  if (!SCENES[gewenst]) {
    opruimen();
    return;
  }
  if (!canvas || scene !== gewenst) {
    opruimen();
    canvas = document.createElement("canvas");
    canvas.className = "achtergrondcanvas";
    canvas.setAttribute("aria-hidden", "true");
    ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      canvas = null;
      return;
    }
    scene = gewenst;
    document.body.prepend(canvas);
    window.addEventListener("resize", opnieuw);
    pasAan();
    // Alvast een stukje vooruit, zodat er meteen iets onderweg is.
    for (let i = 0; i < 20; i++) SCENES[scene].stap(staat);
    teken();
  }
  cancelAnimationFrame(raf);
  raf = 0;
  if (beweging) {
    vorige = performance.now();
    raf = requestAnimationFrame(lus);
  }
}
