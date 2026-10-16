import { test } from "node:test";
import assert from "node:assert/strict";
import { fmt, fmtLong, fmtTime, fmtPct, fmtEta, setNotation } from "../../js/format.js";

test("getallen onder het miljoen staan voluit", () => {
  setNotation("kort");
  assert.equal(fmt(0), "0");
  assert.equal(fmt(15), "15");
  assert.equal(fmt(1234.4), "1.234");
  assert.equal(fmt(2.5), "2,5");
  assert.equal(fmt(999999), "999.999");
});

test("korte notatie vanaf het miljoen", () => {
  setNotation("kort");
  assert.equal(fmt(1e6), "1,00 mln");
  assert.equal(fmt(1.25e9), "1,25 mld");
  assert.equal(fmt(3.4e13), "34,0 bln");
  assert.equal(fmt(-2e6), "-2,00 mln");
  assert.equal(fmt(Infinity), "∞");
  assert.equal(fmt(NaN), "∞");
});

test("wetenschappelijke en volledige notatie", () => {
  setNotation("wetenschappelijk");
  assert.equal(fmt(1.25e9), "1.25e9");
  setNotation("voluit");
  assert.equal(fmt(1.25e9), "1.250.000.000");
  setNotation("iets-onbekends");
  assert.equal(fmt(1e6), "1,00 mln");
});

test("lange notatie, ook met een vast aantal decimalen", () => {
  assert.equal(fmtLong(1.25e9), "1,25 miljard");
  assert.equal(fmtLong(1e9, 0), "1 miljard");
  assert.equal(fmtLong(1e10), "10,0 miljard");
  assert.equal(fmtLong(5000), "5.000");
});

test("tijden, percentages en wachttijden", () => {
  assert.equal(fmtTime(45), "45s");
  assert.equal(fmtTime(125), "2m 5s");
  assert.equal(fmtTime(3 * 3600 + 12 * 60), "3u 12m");
  assert.equal(fmtTime(-1), "—");
  assert.equal(fmtPct(0.075), "7,5%");
  assert.equal(fmtEta(0, 10), "nu te koop");
  assert.equal(fmtEta(100, 0), "blijf klikken");
  assert.equal(fmtEta(100, 10), "over 10s");
});
