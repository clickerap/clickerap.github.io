// De goederen op de bandbreedtemarkt en het nieuws dat de koersen beweegt.
//
// vol     hoe hard de koers per tik beweegt
// KOPPEN  [goed, krantenkop, vermenigvuldiger op de koers]

export const GOEDEREN = [
  { id: "bw", naam: "Bandbreedte", icon: "📶", vol: 0.055 },
  { id: "cpu", naam: "Rekentijd", icon: "🧮", vol: 0.07 },
  { id: "ram", naam: "Geheugen", icon: "🧠", vol: 0.045 },
  { id: "iops", naam: "Opslag-IOPS", icon: "💾", vol: 0.06 },
  { id: "gpu", naam: "GPU-uren", icon: "🎮", vol: 0.11 },
  { id: "ip", naam: "IPv4-adressen", icon: "🏷️", vol: 0.085 },
];

export const KOPPEN = [
  ["bw", "Een zeekabel ligt eruit. Bandbreedte schiet omhoog.", 1.35],
  ["gpu", "Weer een AI-bedrijf koopt alles op. GPU-uren onbetaalbaar.", 1.6],
  ["ip", "Een provider dumpt een /16 op de markt. IPv4 zakt in.", 0.62],
  ["cpu", "Nieuwe generatie processors aangekondigd. Rekentijd wordt goedkoper.", 0.7],
  ["ram", "Fabriek stil na een stroomstoring. Geheugen wordt schaars.", 1.4],
  ["iops", "Iedereen stapt over op flash. IOPS in de uitverkoop.", 0.68],
];
