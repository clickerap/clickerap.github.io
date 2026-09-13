// De studieboom. Studiepunten geef je hier uit; wat je koopt blijft voor altijd,
// ook na een volgende keer afstuderen.

export const BRANCHES = [
  { id: "studie", name: "Studie", icon: "🎓", desc: "Meer rendement uit elk diploma." },
  { id: "beheer", name: "Beheer", icon: "🌙", desc: "Je netwerk draait door terwijl jij weg bent." },
  { id: "geluk", name: "Geluk", icon: "🍀", desc: "Gouden packets, vaker en sterker." },
  { id: "praktijk", name: "Praktijk", icon: "🔧", desc: "Klikken en labo's." },
];

export const NODES = [
  // Studie
  { id: "s1", branch: "studie", name: "Inschrijving", icon: "🖊️", cost: 1, desc: "Je staat officieel ingeschreven.", note: "Alles produceert 5% meer.", effect: { allMult: 1.05 }, needs: [] },
  { id: "s2", branch: "studie", name: "Vrijstelling", icon: "📄", cost: 3, desc: "Een vak dat je niet opnieuw hoeft te volgen.", note: "Begin elke run met 10.000 packets.", effect: { startPackets: 1e4 }, needs: ["s1"] },
  { id: "s3", branch: "studie", name: "Studietoelage", icon: "💶", cost: 10, desc: "Er komt geld binnen dat je niet hoeft terug te betalen.", note: "Begin elke run met 5 miljoen packets.", effect: { startPackets: 5e6 }, needs: ["s2"] },
  { id: "s4", branch: "studie", name: "Bindend advies", icon: "📌", cost: 30, desc: "Doorzetten was het juiste advies.", note: "Alles produceert 10% meer.", effect: { allMult: 1.1 }, needs: ["s3"] },
  { id: "s5", branch: "studie", name: "Onderzoeksbeurs", icon: "🔬", cost: 100, desc: "Je onderzoek wordt betaald door iemand anders.", note: "Je krijgt 15% meer studiepunten bij het afstuderen.", effect: { ectsGain: 1.15 }, needs: ["s4"] },
  { id: "s6", branch: "studie", name: "Emeritus", icon: "🏛️", cost: 300, desc: "Je hoeft niets meer, je mag alles nog.", note: "Nog eens 25% meer studiepunten en 15% meer productie.", effect: { ectsGain: 1.25, allMult: 1.15 }, needs: ["s5"] },

  // Beheer
  { id: "b1", branch: "beheer", name: "Nachtploeg", icon: "🌜", cost: 2, desc: "Iemand houdt 's nachts een oogje op de boel.", note: "Offline tijd telt tot 4 uur mee.", effect: { offlineCap: 4 * 3600 }, needs: [] },
  { id: "b2", branch: "beheer", name: "Monitoring", icon: "📟", cost: 8, desc: "Grafieken die niemand bekijkt, tot het misgaat.", note: "Offline productie stijgt naar 60%.", effect: { offlineRate: 0.6 }, needs: ["b1"] },
  { id: "b3", branch: "beheer", name: "Automatisering", icon: "🤖", cost: 25, desc: "Wat twee keer met de hand ging, gaat nu vanzelf.", note: "Offline tijd telt tot 8 uur mee.", effect: { offlineCap: 8 * 3600 }, needs: ["b2"] },
  { id: "b4", branch: "beheer", name: "Draaiboek", icon: "📘", cost: 60, desc: "Elke storing heeft een pagina.", note: "Offline productie stijgt naar 80%.", effect: { offlineRate: 0.8 }, needs: ["b3"] },
  { id: "b5", branch: "beheer", name: "Lights-out", icon: "🔦", cost: 200, desc: "Het datacenter heeft geen mens meer nodig. Ook geen licht.", note: "Offline tijd telt volledig mee, tot 24 uur.", effect: { offlineCap: 24 * 3600, offlineRate: 1 }, needs: ["b4"] },
  { id: "b6", branch: "beheer", name: "Zelfherstel", icon: "🩹", cost: 500, desc: "Het netwerk repareert zichzelf voor jij het merkt.", note: "Incidenten lossen na 30 seconden vanzelf op.", effect: { autoIncident: true }, needs: ["b5"] },

  // Geluk
  { id: "g1", branch: "geluk", name: "Voorgevoel", icon: "🔮", cost: 2, desc: "Je weet net iets eerder waar je moet kijken.", note: "Gouden packets verschijnen 15% vaker.", effect: { goldenFreq: 1.15 }, needs: [] },
  { id: "g2", branch: "geluk", name: "Tweede kans", icon: "⏱️", cost: 8, desc: "Ze wachten iets langer op je.", note: "Gouden packets blijven 25% langer staan.", effect: { goldenDuration: 1.25 }, needs: ["g1"] },
  { id: "g3", branch: "geluk", name: "Gouden uur", icon: "🌅", cost: 25, desc: "Alles valt even mee.", note: "Buffs werken 25% sterker.", effect: { goldenPower: 1.25 }, needs: ["g2"] },
  { id: "g4", branch: "geluk", name: "Vaste hand", icon: "🤝", cost: 70, desc: "Wat je vasthebt laat je niet los.", note: "Buffs duren 25% langer.", effect: { buffDuration: 1.25 }, needs: ["g3"] },
  { id: "g5", branch: "geluk", name: "Meervoudig", icon: "🎲", cost: 220, desc: "Twee dingen tegelijk is ook een ding.", note: "15% meer kans op een dubbele buff.", effect: { goldenDouble: 0.15 }, needs: ["g4"] },
  { id: "g6", branch: "geluk", name: "Gouden regen", icon: "🌧️", cost: 600, desc: "Je begint met de wind mee.", note: "Elke run start met een gratis buff.", effect: { startBuff: true }, needs: ["g5"] },

  // Praktijk
  { id: "p1", branch: "praktijk", name: "Handigheid", icon: "✋", cost: 2, desc: "Je weet inmiddels waar je moet zijn.", note: "Klikkracht x2.", effect: { clickMult: 2 }, needs: [] },
  { id: "p2", branch: "praktijk", name: "Spiergeheugen", icon: "💪", cost: 8, desc: "Je vinger denkt niet meer na.", note: "Klikkracht x2.", effect: { clickMult: 2 }, needs: ["p1"] },
  { id: "p3", branch: "praktijk", name: "Labo-ervaring", icon: "🧪", cost: 25, desc: "Je hebt de opstelling al drie keer gedaan.", note: "Minigames leveren 50% meer op.", effect: { minigameReward: 1.5 }, needs: ["p2"] },
  { id: "p4", branch: "praktijk", name: "Examentraining", icon: "📝", cost: 70, desc: "Oude examens zijn de beste voorbereiding.", note: "Minigames leveren nog eens 50% meer op.", effect: { minigameReward: 1.5 }, needs: ["p3"] },
  { id: "p5", branch: "praktijk", name: "Meesterschap", icon: "🥇", cost: 200, desc: "Je klikt niet meer, je dirigeert.", note: "Elke klik levert er 2% van je productie per seconde bij.", effect: { clickFromPps: 0.02 }, needs: ["p4"] },
  { id: "p6", branch: "praktijk", name: "Serge's zegen", icon: "🙌", cost: 500, desc: "Hij zegt niets. Hij knikt alleen.", note: "Alles produceert 25% meer.", effect: { allMult: 1.25 }, needs: ["p5"] },
];

export const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

// Studiepunten die je zou krijgen bij het afstuderen, met wat je nu hebt.
export function ectsFor(lifetime, gainMult = 1) {
  if (lifetime < 1e12) return 0;
  return Math.floor(Math.cbrt(lifetime / 1e12) * gainMult);
}

// Hoeveel je in totaal nodig hebt voor `n` studiepunten.
export function lifetimeForEcts(n, gainMult = 1) {
  return Math.pow(n / gainMult, 3) * 1e12;
}
