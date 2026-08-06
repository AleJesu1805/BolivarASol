const inputDolar = document.getElementById('dolar');
const inputBolivar = document.getElementById('bolivar');
const inputSol = document.getElementById('sol');

let valorBolivar = null;
let valorSol = null;

const bolivar = () => fetch('https://ve.dolarapi.com/v1/dolares/oficial')
    .then(res => res.json())
    .then(data => {
        const valor = data.promedio;
        inputBolivar.value = valor;
        valorBolivar = valor;
    })
    .catch(err => console.error('Error:', err));

const sol = () => fetch('https://v6.exchangerate-api.com/v6/916af0932b27a81eeb3ed6bd/pair/PEN/USD')
    .then(res => res.json())
    .then(data => {
        const valor = 1 / data.conversion_rate;
        inputSol.value = valor;
        valorSol = valor;
    })
    .catch(err => console.error('Error:', err));

sol();
bolivar();

inputDolar.addEventListener('input', (e) => {
    let bolivarExacto = valorBolivar * inputDolar.value;
    inputBolivar.value = bolivarExacto;

    let solExacto = valorSol * inputDolar.value;
    inputSol.value = solExacto;
})

inputBolivar.addEventListener('input', (e) => {
    let dolarExacto = inputBolivar.value / valorBolivar;
    inputDolar.value = dolarExacto;

    let solExacto = valorSol * inputDolar.value;
    inputSol.value = solExacto;
})