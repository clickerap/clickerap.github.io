import { test } from "node:test";
import assert from "node:assert/strict";
import { BUILDINGS, costOf, bulkCost, affordableAmount, refundOf } from "../../js/data/buildings.js";

test("bulkprijs is de som van de losse prijzen, op afronding na", () => {
  for (const b of BUILDINGS) {
    for (const owned of [0, 7, 40]) {
      let som = 0;
      for (let i = 0; i < 10; i++) som += b.baseCost * Math.pow(1.15, owned + i);
      const bulk = bulkCost(b, owned, 10);
      // bulkCost rondt één keer naar boven af; meer verschil mag er niet zijn.
      assert.ok(bulk >= som * (1 - 1e-12) && bulk - som <= 1 + som * 1e-12, `${b.id} vanaf ${owned}`);
    }
  }
});

test("affordableAmount geeft precies wat je kunt betalen", () => {
  for (const b of BUILDINGS) {
    for (const budget of [0, b.baseCost - 1, b.baseCost, b.baseCost * 50, b.baseCost * 1e6]) {
      const n = affordableAmount(b, 3, budget);
      if (n > 0) assert.ok(bulkCost(b, 3, n) <= budget, `${b.id}: ${n} past niet in ${budget}`);
      assert.ok(bulkCost(b, 3, n + 1) > budget, `${b.id}: er past er nog een bij`);
    }
  }
});

test("de prijs stijgt per exemplaar en terugverkopen levert een kwart op", () => {
  const b = BUILDINGS[0];
  assert.equal(costOf(b, 0), 15);
  assert.ok(costOf(b, 1) > costOf(b, 0));
  assert.equal(refundOf(b, 10, 10), Math.floor(bulkCost(b, 0, 10) * 0.25));
});

test("vanaf Active Directory groeit de terugverdientijd geleidelijk", () => {
  const vanaf = BUILDINGS.findIndex((b) => b.id === "ad");
  for (let i = vanaf + 1; i < BUILDINGS.length; i++) {
    const nu = BUILDINGS[i].baseCost / BUILDINGS[i].basePps;
    const vorige = BUILDINGS[i - 1].baseCost / BUILDINGS[i - 1].basePps;
    assert.ok(nu / vorige < 1.6, `${BUILDINGS[i].id} springt x${(nu / vorige).toFixed(2)}`);
  }
});
