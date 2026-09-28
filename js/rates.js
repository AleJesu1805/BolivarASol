const rateSources = {
  ves: {
    url: "https://ve.dolarapi.com/v1/dolares/oficial",
    storageKey: "valorBsLocal",
    selectRate: (data) => data.promedio,
    storeRate: (data) => data.promedio,
    restoreRate: Number,
  },
  pen: {
    url: "https://v6.exchangerate-api.com/v6/916af0932b27a81eeb3ed6bd/pair/PEN/USD",
    storageKey: "valorPenLocal",
    selectRate: (data) => 1 / data.conversion_rate,
    storeRate: (data) => data.conversion_rate,
    restoreRate: (value) => 1 / Number(value),
  },
};

function readStoredRate(source) {
  try {
    const storedValue = localStorage.getItem(source.storageKey);
    const rate = storedValue === null ? null : source.restoreRate(storedValue);
    return Number.isFinite(rate) && rate > 0 ? rate : null;
  } catch {
    return null;
  }
}

async function fetchRate(source) {
  try {
    const response = await fetch(source.url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const rate = source.selectRate(data);
    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error("La API devolvió una tasa inválida");
    }

    try {
      localStorage.setItem(source.storageKey, String(source.storeRate(data)));
    } catch {
      // La app sigue funcionando aunque el almacenamiento local no esté disponible.
    }

    return rate;
  } catch (error) {
    console.warn(`No se pudo actualizar ${source.storageKey}:`, error);
    return readStoredRate(source);
  }
}

export async function fetchExchangeRates() {
  const entries = await Promise.all(
    Object.entries(rateSources).map(async ([currency, source]) => [
      currency,
      await fetchRate(source),
    ]),
  );
  const rates = Object.fromEntries(entries);

  if (Object.values(rates).some((rate) => rate === null)) {
    throw new Error("No hay una tasa válida en línea ni guardada localmente");
  }

  return rates;
}
