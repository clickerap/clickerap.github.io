// Gedeelde hulpjes voor de unit-tests.

// Een localStorage in het geheugen, zoals de browser er een heeft.
export function nepOpslag() {
  const data = new Map();
  const opslag = {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
    clear: () => data.clear(),
  };
  Object.defineProperty(globalThis, "localStorage", { value: opslag, configurable: true, writable: true });
  return data;
}

export function geblokkeerdeOpslag() {
  const fout = () => {
    throw new Error("SecurityError: opslag geblokkeerd");
  };
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get: fout,
  });
}

export function code(data) {
  return "SERGE1:" + Buffer.from(JSON.stringify(data)).toString("base64");
}
