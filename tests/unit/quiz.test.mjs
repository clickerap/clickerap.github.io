// De overhoring stelt zijn vragen zelf op. Hier rekenen we elke soort vraag
// onafhankelijk na, zodat een fout in een generator meteen opvalt.

import { test } from "node:test";
import assert from "node:assert/strict";
import { GENERATORS, REKENVRAGEN, nieuweVraag, intToIp, ipToInt, maskInt } from "../../js/minigames/quiz.js";
import { FEITEN, ONDERWERPEN, POORTNUMMERS, OSI, OSI_PROTOCOLLEN } from "../../js/data/vragen.js";

const HERHALINGEN = 1500;

function juistAntwoord(vraag) {
  let m;
  const net = (ip, p) => (ipToInt(ip) & maskInt(p)) >>> 0;
  const bc = (ip, p) => (net(ip, p) | (~maskInt(p) >>> 0)) >>> 0;
  if ((m = vraag.match(/netwerkadres van ([\d.]+)\/(\d+)/))) return intToIp(net(m[1], Number(m[2])));
  if ((m = vraag.match(/broadcastadres van ([\d.]+)\/(\d+)/))) return intToIp(bc(m[1], Number(m[2])));
  if ((m = vraag.match(/eerste bruikbare hostadres in het subnet van ([\d.]+)\/(\d+)/))) return intToIp(net(m[1], Number(m[2])) + 1);
  if ((m = vraag.match(/laatste bruikbare hostadres in het subnet van ([\d.]+)\/(\d+)/))) return intToIp(bc(m[1], Number(m[2])) - 1);
  if ((m = vraag.match(/hostadressen heeft een \/(\d+)/))) return String(2 ** (32 - Number(m[1])) - 2);
  if ((m = vraag.match(/subnetmasker hoort bij \/(\d+)/))) return intToIp(maskInt(Number(m[1])));
  if ((m = vraag.match(/prefix hoort bij het masker ([\d.]+)/))) {
    return `/${ipToInt(m[1]).toString(2).replace(/0/g, "").length}`;
  }
  if ((m = vraag.match(/wildcardmasker hoort bij \/(\d+)/))) {
    return intToIp(0xffffffff - maskInt(Number(m[1])));
  }
  if ((m = vraag.match(/van een \/\d+ (\d+) bits? leent/))) return String(2 ** Number(m[1]));
  if ((m = vraag.match(/adressen telt een \/(\d+) in totaal/))) return String(2 ** (32 - Number(m[1])));
  if ((m = vraag.match(/kleinste subnet waar (\d+) hosts/))) {
    const nodig = Number(m[1]);
    for (let prefix = 32; prefix >= 0; prefix--) {
      if (2 ** (32 - prefix) - 2 >= nodig) return `/${prefix}`;
    }
  }
  if ((m = vraag.match(/Zitten ([\d.]+) en ([\d.]+) met een \/(\d+)/))) {
    return net(m[1], Number(m[3])) === net(m[2], Number(m[3])) ? "Ja" : "Nee";
  }
  if ((m = vraag.match(/Hoe schrijf je (\d+) binair/))) return Number(m[1]).toString(2).padStart(8, "0");
  if ((m = vraag.match(/decimaal getal is ([01]{8})\?/))) return String(parseInt(m[1], 2));
  if ((m = vraag.match(/decimaal getal is 0x([0-9A-F]{2})\?/))) return String(parseInt(m[1], 16));
  if ((m = vraag.match(/Hoe schrijf je (\d+) hexadecimaal/))) return Number(m[1]).toString(16).toUpperCase().padStart(2, "0");
  if ((m = vraag.match(/protocol gebruikt standaard poort (\d+)/))) return POORTNUMMERS.find((p) => p.poort === Number(m[1])).naam;
  if ((m = vraag.match(/Op welke poort luistert (.+) standaard/))) return String(POORTNUMMERS.find((p) => p.naam === m[1]).poort);
  if ((m = vraag.match(/Gebruikt (.+) TCP of UDP/))) return POORTNUMMERS.find((p) => p.naam === m[1]).tp;
  if ((m = vraag.match(/Hoe heet laag (\d) van het OSI-model/))) return OSI[Number(m[1]) - 1].naam;
  if ((m = vraag.match(/stukje data op de (.+)\?/))) return OSI.find((l) => l.naam.toLowerCase() === m[1]).pdu;
  if ((m = vraag.match(/laag van het OSI-model werkt een (.+)\?/))) return `Laag ${OSI.find((l) => l.apparaat?.toLowerCase() === m[1]).laag}`;
  if ((m = vraag.match(/laag van het OSI-model hoort (.+)\?/))) return `Laag ${OSI_PROTOCOLLEN.find((p) => p.naam === m[1]).laag}`;
  if ((m = vraag.match(/Hoe schrijf je ([0-9a-f:]+) zo kort mogelijk/))) return null; // hieronder apart
  throw new Error(`Onbekende vraag: ${vraag}`);
}

// Een korte IPv6-schrijfwijze terug uitschrijven, om hem na te kijken.
function voluit(kort) {
  if ((kort.match(/::/g) || []).length > 1) return null;
  const [links, rechts] = kort.includes("::") ? kort.split("::") : [kort, null];
  const l = links ? links.split(":") : [];
  const r = rechts ? rechts.split(":") : [];
  const nullen = rechts === null ? 0 : 8 - l.length - r.length;
  const groepen = [...l, ...Array(Math.max(0, nullen)).fill("0"), ...r];
  if (groepen.length !== 8) return null;
  return groepen.map((g) => g.padStart(4, "0")).join(":");
}

test("elke rekenvraag geeft het juiste antwoord", () => {
  for (const [onderwerp, lijst] of Object.entries(REKENVRAGEN)) {
    for (const gen of lijst) {
      for (let i = 0; i < HERHALINGEN; i++) {
        const v = gen();
        const juist = juistAntwoord(v.vraag);
        if (juist !== null) assert.equal(v.goed, juist, `${onderwerp}: ${v.vraag}`);
        for (const fout of v.fout) assert.notEqual(fout, v.goed, `${onderwerp}: ${v.vraag}`);
      }
    }
  }
  assert.equal(GENERATORS, REKENVRAGEN.subnetten);
});

test("IPv6 afkorten: het goede antwoord is het adres, en zo kort als het mag", () => {
  for (let i = 0; i < HERHALINGEN; i++) {
    const v = REKENVRAGEN.ipv6[0]();
    const vol = v.vraag.match(/schrijf je ([0-9a-f:]+) zo kort/)[1];
    assert.equal(voluit(v.goed), vol, v.goed);
    assert.doesNotMatch(v.goed, /(^|:)0[0-9a-f]/, "geen voorloopnullen");
    for (const fout of v.fout) {
      const terug = voluit(fout);
      // Een fout antwoord is ongeldig, een ander adres, of langer dan nodig.
      assert.ok(terug !== vol || fout.length > v.goed.length, `${fout} is niet fout genoeg`);
    }
  }
});

test("elke vaste vraag heeft één goed antwoord en unieke foute", () => {
  const onderwerpen = new Set(ONDERWERPEN.map((o) => o.id));
  const vragen = new Set();
  for (const f of FEITEN) {
    assert.ok(onderwerpen.has(f.onderwerp), f.vraag);
    assert.ok(!vragen.has(f.vraag), `dubbel: ${f.vraag}`);
    vragen.add(f.vraag);
    assert.equal(f.fout.length, 3, f.vraag);
    assert.equal(new Set([f.goed, ...f.fout]).size, 4, f.vraag);
    assert.ok(f.uitleg.length > 10, f.vraag);
  }
  assert.ok(FEITEN.length >= 70, `${FEITEN.length} vaste vragen`);
});

test("het juiste antwoord staat er altijd tussen, en geen optie dubbel", () => {
  for (let i = 0; i < HERHALINGEN * 3; i++) {
    const v = nieuweVraag();
    assert.ok(v.opties.includes(v.goed), v.vraag);
    assert.equal(new Set(v.opties).size, v.opties.length, `${v.vraag}: ${v.opties.join(", ")}`);
    assert.ok(v.opties.length >= 2 && v.opties.length <= 4);
  }
});

test("per onderwerp komen alleen vragen van dat onderwerp, en elk onderwerp heeft vragen", () => {
  for (const o of ONDERWERPEN) {
    for (let i = 0; i < 40; i++) assert.equal(nieuweVraag(o.id).onderwerp, o.id);
  }
});

test("dezelfde vraag komt niet snel terug", () => {
  const reeks = Array.from({ length: 20 }, () => nieuweVraag("kabels").vraag);
  // Kabels heeft veertien vaste vragen: binnen veertien geen herhaling.
  const eerste = reeks.slice(0, 14);
  assert.equal(new Set(eerste).size, eerste.length, eerste.join(" | "));
});
