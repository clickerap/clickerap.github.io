// Tekst veilig in een HTML-template zetten. Alles wat van de speler of uit een
// save komt, gaat hier doorheen voordat het via innerHTML op het scherm komt.

const TEKENS = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function esc(tekst) {
  return String(tekst ?? "").replace(/[&<>"']/g, (teken) => TEKENS[teken]);
}
