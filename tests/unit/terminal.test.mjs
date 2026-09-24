import { test } from "node:test";
import assert from "node:assert/strict";
import { G } from "../../js/state.js";
import { vulAan, hulpVoor, verwerk, uitvoerRegels } from "../../js/minigames/terminal.js";
import { normaliseerPoort } from "../../js/data/terminal.js";

function nieuweSwitch(opdracht = { poort: "gi0/3", ip: "10.42.7.1", mask: "255.255.255.0" }) {
  return { hostname: "SERGE", mode: "user", iface: null, interfaces: {}, opdracht, nextAt: 0, gedaan: 0 };
}

function typ(cli, ...regels) {
  for (const regel of regels) verwerk(regel, cli);
  return uitvoerRegels().join("\n");
}

test("afkortingen werken zoals op een echt apparaat", () => {
  const cli = nieuweSwitch();
  typ(cli, "en", "conf t", "int gi0/3");
  assert.equal(cli.mode, "iface");
  assert.equal(cli.iface, "gi0/3");
});

test("een volledige opdracht levert packets op", () => {
  const cli = nieuweSwitch();
  const voor = G.packets;
  typ(cli, "en", "conf t", "int gi0/3", "ip add 10.42.7.1 255.255.255.0", "no shut", "end", "wr");
  assert.equal(cli.gedaan, 1);
  assert.equal(cli.opdracht, null);
  assert.ok(G.packets > voor);
});

test("copy running-config startup-config bewaart ook", () => {
  const cli = nieuweSwitch({ poort: "gi0/1", ip: "10.1.1.1", mask: "255.255.255.0" });
  typ(cli, "en", "conf t", "int gi0/1", "ip address 10.1.1.1 255.255.255.0", "no shutdown", "end", "copy run start");
  assert.equal(cli.gedaan, 1);
});

test("do voert commando's uit de bevoorrechte modus uit", () => {
  const cli = nieuweSwitch({ poort: "gi0/2", ip: "10.2.2.1", mask: "255.255.255.0" });
  typ(cli, "en", "conf t", "int gi0/2", "ip add 10.2.2.1 255.255.255.0", "no shut");
  const uit = typ(cli, "do show ip int brief");
  assert.match(uit, /gi0\/2\s+10\.2\.2\.1\s+up/);
  typ(cli, "do wr");
  assert.equal(cli.gedaan, 1);
  assert.equal(cli.mode, "iface");
});

test("GigabitEthernet met een spatie, en van interface naar interface", () => {
  const cli = nieuweSwitch();
  typ(cli, "en", "conf t", "interface GigabitEthernet 0/5");
  assert.equal(cli.iface, "gi0/5");
  typ(cli, "int gi0/6");
  assert.equal(cli.iface, "gi0/6");
  assert.equal(normaliseerPoort("gi0/9"), null);
});

test("een hostnaam volgt de regels van een echt apparaat", () => {
  const cli = nieuweSwitch();
  typ(cli, "en", "conf t", "hostname core-sw1");
  assert.equal(cli.hostname, "CORE-SW1");
  const uit = typ(cli, "hostname <b>kapot</b>");
  assert.equal(cli.hostname, "CORE-SW1");
  assert.match(uit, /Een hostnaam begint met een letter/);
});

test("Tab vult aan en ? toont wat er mag", () => {
  const cli = nieuweSwitch();
  cli.mode = "enable";
  assert.equal(vulAan("conf", cli).regel, "configure ");
  assert.equal(vulAan("co", cli).opties.length, 2);
  assert.deepEqual(hulpVoor("copy ", cli).map(([woord]) => woord), ["running-config"]);
  cli.mode = "config";
  assert.deepEqual(hulpVoor("hostname ", cli), [["<naam>", "vrij in te vullen"]]);
});

test("onbekende en dubbelzinnige invoer geeft een nette melding", () => {
  const cli = nieuweSwitch();
  cli.mode = "enable";
  assert.match(typ(cli, "blabla"), /Invalid input detected at "blabla"/);
  assert.match(typ(cli, "co"), /Ambiguous command: "co"/);
});
