const numberFormatter = new Intl.NumberFormat("es-VE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function parseAmount(value) {
  const normalized = String(value).trim().replace(/\./g, "").replace(",", ".");
  const amount = Number.parseFloat(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

export function formatAmount(amount) {
  return numberFormatter.format(Number.isFinite(amount) ? amount : 0);
}

export function convertAmount(sourceCurrency, amount, rates) {
  if (!rates || rates.ves <= 0 || rates.pen <= 0) return null;

  const usd = {
    usd: amount,
    ves: amount / rates.ves,
    pen: amount / rates.pen,
  }[sourceCurrency];

  if (!Number.isFinite(usd)) return null;

  return {
    usd,
    ves: usd * rates.ves,
    pen: usd * rates.pen,
  };
}
