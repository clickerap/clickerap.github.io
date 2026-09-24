// De overhoring stelt zijn vragen zelf op. Hier rekenen we elke soort vraag
// onafhankelijk na, zodat een fout in een generator meteen opvalt.

import { test } from "node:test";
import assert from "node:assert/strict";
import { GENERATORS, nieuweVraag, intToIp, ipToInt, maskInt } from "../../js/minigames/quiz.js";

const HERHALINGEN = 2000;

function juistAntwoord(vraag) {
  let m;
  if ((m = vraag.match(/netwerkadres van ([\d.]+)\/(\d+)/))) {
    return intToIp((ipToInt(m[1]) & maskInt(Number(m[2]))) >>> 0);
  }
  if ((m = vraag.match(/broadcastadres van ([\d.]+)\/(\d+)/))) {
    const mask = maskInt(Number(m[2]));
    return intToIp(((ipToInt(m[1]) & mask) | (~mask >>> 0)) >>> 0);
  }
  if ((m = vraag.match(/hostadressen heeft een \/(\d+)/))) {
    return String(2 ** (32 - Number(m[1])) - 2);
  }
  if ((m = vraag.match(/subnetmasker hoort bij \/(\d+)/))) {
    return intToIp(maskInt(Number(m[1])));
  }
  if ((m = vraag.match(/kleinste subnet waar (\d+) hosts/))) {
    const nodig = Number(m[1]);
    for (let prefix = 32; prefix >= 0; prefix--) {
      if (2 ** (32 - prefix) - 2 >= nodig) return `/${prefix}`;
    }
  }
  if ((m = vraag.match(/Zitten ([\d.]+) en ([\d.]+) met een \/(\d+)/))) {
    const mask = maskInt(Number(m[3]));
    return (ipToInt(m[1]) & mask) === (ipToInt(m[2]) & mask) ? "Ja" : "Nee";
  }
  throw new Error(`Onbekende vraag: ${vraag}`);
}

test("elke generator geeft het juiste antwoord", () => {
  for (const gen of GENERATORS) {
    for (let i = 0; i < HERHALINGEN; i++) {
      const v = gen();
      assert.equal(v.goed, juistAntwoord(v.vraag), v.vraag);
    }
  }
});

test("het juiste antwoord staat er altijd tussen, en geen optie dubbel", () => {
  for (let i = 0; i < HERHALINGEN * 3; i++) {
    const v = nieuweVraag();
    assert.ok(v.opties.includes(v.goed), v.vraag);
    assert.equal(new Set(v.opties).size, v.opties.length, `${v.vraag}: ${v.opties.join(", ")}`);
    assert.ok(v.opties.length >= 2 && v.opties.length <= 4);
    for (const fout of v.opties.filter((o) => o !== v.goed)) {
      assert.notEqual(fout, juistAntwoord(v.vraag));
    }
  }
});
