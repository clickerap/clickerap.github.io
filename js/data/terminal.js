// Vaste gegevens van de terminal. Zonder DOM, zodat ook het laden van een save
// en de tests ze kunnen gebruiken.

export const POORTEN = ["gi0/1", "gi0/2", "gi0/3", "gi0/4", "gi0/5", "gi0/6", "gi0/7", "gi0/8"];
export const MODI = ["user", "enable", "config", "iface"];

export function geldigAdres(tekst) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(String(tekst)) && String(tekst).split(".").every((d) => Number(d) <= 255);
}

// gi0/1, g0/1, gig0/1, GigabitEthernet0/1 en GigabitEthernet 0/1 zijn hetzelfde
// ding. Alleen de acht poorten die deze switch heeft tellen.
export function normaliseerPoort(tekst) {
  const m = String(tekst).toLowerCase().replace(/\s+/g, "").match(/^(?:g|gi|gig|gigabit|gigabitethernet)(\d+\/\d+)$/);
  const naam = m ? `gi${m[1]}` : null;
  return POORTEN.includes(naam) ? naam : null;
}
