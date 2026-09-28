import { convertAmount, formatAmount, parseAmount } from "./currency.js";
import { fetchExchangeRates } from "./rates.js";

const inputs = {
  usd: document.getElementById("dolar"),
  ves: document.getElementById("bolivar"),
  pen: document.getElementById("sol"),
};
const shortcutsContainer = document.getElementById("contenedorScroll");
let exchangeRates = null;

function updateFields(sourceCurrency, amount) {
  const converted = convertAmount(sourceCurrency, amount, exchangeRates);
  if (!converted) return;

  for (const [currency, input] of Object.entries(inputs)) {
    if (currency !== sourceCurrency) {
      input.value = formatAmount(converted[currency]);
    }
  }
}

function createShortcuts() {
  for (let amount = 1; amount <= 10; amount++) {
    const button = document.createElement("button");
    button.classList.add("atajo");
    button.type = "button";
    button.dataset.amount = String(amount * 5);
    button.textContent = `${amount * 5}$`;
    shortcutsContainer.appendChild(button);
  }
}

for (const [currency, input] of Object.entries(inputs)) {
  input.addEventListener("input", () => {
    updateFields(currency, parseAmount(input.value));
  });

  input.addEventListener("blur", () => {
    input.value = formatAmount(parseAmount(input.value));
  });
}

shortcutsContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-amount]");
  if (!button) return;

  const amount = Number(button.dataset.amount);
  inputs.usd.value = formatAmount(amount);
  updateFields("usd", amount);
});

createShortcuts();

fetchExchangeRates()
  .then((rates) => {
    exchangeRates = rates;
    updateFields("usd", parseAmount(inputs.usd.value));
  })
  .catch((error) => console.error("No se pudieron cargar las tasas:", error));

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch((error) => {
    console.error("No se pudo registrar el service worker:", error);
  });
}
