// Kabels en protocollen van de patchkast.
//
// groei   seconden tot de kabel rijp is
// waarde  vermenigvuldiger op de opbrengst bij het oogsten
// paar    de twee rijpe buren die dit protocol kunnen opleveren

export const KABELS = {
  utp: { naam: "UTP", icon: "🟩", groei: 75, waarde: 25 },
  coax: { naam: "Coax", icon: "🟫", groei: 110, waarde: 45 },
  glas: { naam: "Glasvezel", icon: "🟦", groei: 165, waarde: 90 },
  stroom: { naam: "Stroomkabel", icon: "🟨", groei: 55, waarde: 15 },
};

// Ontdekkingen: twee verschillende rijpe buren naast een geoogste poort.
export const PROTOCOLLEN = {
  tokenring: { naam: "Token Ring", icon: "💍", paar: ["utp", "coax"], groei: 200, waarde: 160 },
  ethernet: { naam: "Ethernet over glas", icon: "🔷", paar: ["utp", "glas"], groei: 190, waarde: 150 },
  docsis: { naam: "DOCSIS", icon: "🟠", paar: ["coax", "glas"], groei: 210, waarde: 175 },
  poe: { naam: "Power over Ethernet", icon: "⚡", paar: ["utp", "stroom"], groei: 140, waarde: 120 },
  fddi: { naam: "FDDI", icon: "🔵", paar: ["tokenring", "glas"], groei: 260, waarde: 260 },
  pon: { naam: "GPON", icon: "🟣", paar: ["docsis", "ethernet"], groei: 300, waarde: 330 },
  infiniband: { naam: "InfiniBand", icon: "🟩", paar: ["fddi", "pon"], groei: 360, waarde: 480 },
  atm: { naam: "ATM", icon: "🏧", paar: ["infiniband", "tokenring"], groei: 420, waarde: 640 },
};
