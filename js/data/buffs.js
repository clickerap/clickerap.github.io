// Buffs komen uit gouden packets. Een buff is altijd tijdelijk; het effect
// wordt in state.recompute() over je productie heen gelegd.

export const BUFFS = [
  {
    id: "burst",
    name: "Burst traffic",
    icon: "🚀",
    desc: "De lijn zit even helemaal vol.",
    duration: 77,
    weight: 26,
    effect: { ppsMult: 7 },
  },
  {
    id: "storm",
    name: "Broadcast storm",
    icon: "🌪️",
    desc: "Elke klik weerkaatst door het hele netwerk.",
    duration: 13,
    weight: 14,
    effect: { clickMult: 777 },
  },
  {
    id: "windfall",
    name: "Meewind",
    icon: "🍃",
    desc: "Alles loopt vandaag net iets soepeler.",
    duration: 300,
    weight: 18,
    effect: { ppsMult: 3 },
  },
  {
    id: "cache",
    name: "Cache hit",
    icon: "⚡",
    desc: "De volgende tien kliks komen rechtstreeks uit het geheugen.",
    charges: 10,
    weight: 14,
    effect: { clickMult: 100 },
  },
  {
    id: "overclock",
    name: "Overklok",
    icon: "🔥",
    desc: "Eén type apparaat draait ver buiten spec.",
    duration: 90,
    weight: 12,
    effect: { randomBuildingMult: 12 },
  },
  {
    id: "lucky",
    name: "Meevaller",
    icon: "🎁",
    desc: "Een kwartier productie in één keer op je rekening.",
    instant: true,
    weight: 16,
  },
];

export const BUFF_BY_ID = Object.fromEntries(BUFFS.map((b) => [b.id, b]));

// Rode packets. Je moet ze juist laten staan.
export const HAZARDS = [
  {
    id: "congestie",
    name: "Congestie",
    icon: "🐌",
    desc: "De buffers lopen vol, alles kruipt.",
    duration: 66,
    effect: { ppsMult: 0.5 },
  },
  {
    id: "flap",
    name: "Flappende poort",
    icon: "🔁",
    desc: "Up, down, up, down. Je kliks komen amper aan.",
    duration: 40,
    effect: { clickMult: 0.1 },
  },
  {
    id: "verlies",
    name: "Packet loss",
    icon: "🕳️",
    desc: "Een deel van je voorraad haalt de overkant niet.",
    instant: true,
    loss: 0.05,
  },
];

// Incidenten: een storing met twee uitwegen. Verschijnt in de logbalk,
// nooit als pop-up over je scherm heen.
export const INCIDENTS = [
  {
    id: "graafmachine",
    text: "Een graafmachine heeft de backbone geraakt.",
    fixLabel: "Noodherstel inhuren",
    ignoreLabel: "Omleiden en hopen",
    costPps: 180,
    penalty: { ppsMult: 0.7, duration: 90 },
  },
  {
    id: "koeling",
    text: "De koeling in gang B is uitgevallen.",
    fixLabel: "Monteur laten komen",
    ignoreLabel: "Deuren open en ventilator erbij",
    costPps: 150,
    penalty: { ppsMult: 0.75, duration: 80 },
  },
  {
    id: "loop",
    text: "Iemand heeft twee poorten aan elkaar geknoopt. Broadcast storm.",
    fixLabel: "Spanning Tree herzien",
    ignoreLabel: "Wachten tot het overwaait",
    costPps: 200,
    penalty: { ppsMult: 0.6, duration: 70 },
  },
  {
    id: "certificaat",
    text: "Het wildcardcertificaat is vannacht verlopen.",
    fixLabel: "Nu vernieuwen",
    ignoreLabel: "Iedereen klikt toch door de waarschuwing",
    costPps: 120,
    penalty: { ppsMult: 0.8, duration: 100 },
  },
  {
    id: "update",
    text: "Een firmware-update is halverwege blijven hangen.",
    fixLabel: "Handmatig terugrollen",
    ignoreLabel: "Opnieuw opstarten en wegkijken",
    costPps: 160,
    penalty: { ppsMult: 0.7, duration: 85 },
  },
  {
    id: "dhcp",
    text: "Er staat een tweede DHCP-server in het netwerk.",
    fixLabel: "Opsporen en uitschakelen",
    ignoreLabel: "Statische adressen uitdelen",
    costPps: 140,
    penalty: { ppsMult: 0.75, duration: 90 },
  },
];
