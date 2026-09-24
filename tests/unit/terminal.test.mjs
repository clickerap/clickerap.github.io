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

// ------------------------------------------------ Soorten opdrachten

import { TAKEN, nieuweTaak, schoonOpdracht, kiesTaak } from "../../js/data/terminal.js";

function leegSwitch() {
  return { hostname: "SERGE", mode: "user", iface: null, vlanId: null, interfaces: {}, vlans: {}, banner: null, secret: false, gateway: null, vorige: null, opdracht: null, nextAt: 0, gedaan: 0 };
}

test("elke soort opdracht is op te lossen met de commando's van de switch", () => {
  for (const soort of Object.keys(TAKEN)) {
    for (let i = 0; i < 50; i++) {
      const cli = leegSwitch();
      cli.opdracht = nieuweTaak(cli, soort);
      // Een opdracht overleeft het nakijken van een save ongeschonden.
      assert.deepEqual(schoonOpdracht(cli.opdracht), cli.opdracht, soort);
      assert.equal(TAKEN[soort].klaar(cli, cli.opdracht), false, `${soort} is al klaar voor je begint`);
      const tekst = TAKEN[soort].tekst(cli.opdracht);
      typ(cli, ...TAKEN[soort].oplossing(cli.opdracht));
      assert.equal(cli.gedaan, 1, `${soort}: ${tekst}`);
      assert.equal(cli.opdracht, null);
    }
  }
});

test("foutzoeken: de fout staat klaar, en show toont hem", () => {
  const cli = leegSwitch();
  cli.opdracht = nieuweTaak(cli, "herstel");
  cli.opdracht.fout = "masker";
  TAKEN.herstel.voorbereid(cli, cli.opdracht);
  assert.equal(cli.interfaces[cli.opdracht.poort].mask, "255.255.0.0");
  const uit = typ(cli, "en", "show running-config");
  assert.match(uit, new RegExp(`ip address ${cli.opdracht.ip.replaceAll(".", "\\.")} 255\\.255\\.0\\.0`));
  // Alleen bewaren zonder te herstellen, levert niets op.
  typ(cli, "wr");
  assert.equal(cli.gedaan, 0);
});

test("VLAN's: aanmaken, een naam geven, een poort erin, en show vlan", () => {
  const cli = leegSwitch();
  typ(cli, "en", "conf t", "vlan 20", "name LEERLINGEN", "exit", "int gi0/4", "switchport mode access", "switchport access vlan 20", "end");
  assert.equal(cli.vlans[20], "LEERLINGEN");
  assert.equal(cli.interfaces["gi0/4"].vlan, 20);
  const uit = typ(cli, "show vlan brief");
  assert.match(uit, /20\s+LEERLINGEN\s+active\s+gi0\/4/);
  // Een VLAN dat nog niet bestaat, wordt gemaakt zoals op een echte switch.
  const meer = typ(cli, "conf t", "int gi0/5", "sw acc vl 30");
  assert.match(meer, /Creating vlan 30/);
  assert.match(typ(cli, "vlan 1"), /standaard-VLAN/);
});

test("banner, gateway en secret", () => {
  const cli = leegSwitch();
  typ(cli, "en", "conf t", "banner motd #Alleen voor bevoegden#", "ip default-gateway 10.9.9.254", "enable secret geheim");
  assert.equal(cli.banner, "Alleen voor bevoegden");
  assert.equal(cli.gateway, "10.9.9.254");
  assert.equal(cli.secret, true);
  const uit = typ(cli, "do show run");
  const config = uit.slice(uit.lastIndexOf("do show run"));
  assert.match(config, /enable secret 5/);
  assert.doesNotMatch(config, /geheim/, "een wachtwoord komt nooit leesbaar in de configuratie");
});

test("opdrachten wisselen af en worden moeilijker", () => {
  const cli = leegSwitch();
  assert.equal(kiesTaak(cli), "adres", "de eerste opdracht is altijd een adres");
  cli.gedaan = 10;
  cli.vorige = "vlan";
  const soorten = new Set(Array.from({ length: 400 }, () => kiesTaak(cli)));
  assert.ok(!soorten.has("vlan"), "nooit twee keer na elkaar dezelfde soort");
  assert.ok(soorten.size >= 8, `${soorten.size} verschillende soorten`);
  cli.secret = true;
  assert.ok(!Array.from({ length: 200 }, () => kiesTaak(cli)).includes("secret"));
});
