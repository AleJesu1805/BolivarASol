const inputDolar = document.getElementById('dolar');
const inputBolivar = document.getElementById('bolivar');
const inputSol = document.getElementById('sol');

const contenedorScroll = document.getElementById('contenedorScroll');


function parseValor(str) {
    if (typeof str !== 'string') str = String(str);
    const limpio = str.trim().replace(/\./g, '').replace(',', '.');
    const num = parseFloat(limpio);
    return isNaN(num) ? 0 : num;
}

function formatValor(num) {
    if (isNaN(num)) num = 0;
    return num.toLocaleString('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function resetear(num) {
    inputDolar.value = num;

    let bolivarExacto = valorBolivar * num;
    inputBolivar.value = formatValor(bolivarExacto);

    let solExacto = valorSol * num;
    inputSol.value = formatValor(solExacto);
}

for (let i = 0; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.classList.add('atajo');
    btn.id = `btn${i}`;
    let orden = i * 5;
    btn.setAttribute('onclick', `resetear(${orden})`);
    btn.innerHTML = `${orden}$`;
    contenedorScroll.appendChild(btn);
}


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
        let dato = data.conversion_rate;
        const valor = 1 / dato;
        inputSol.value = valor;
        valorSol = valor;
    })
    .catch(err => console.error('Error:', err));

sol();
bolivar();

inputDolar.addEventListener('input', (e) => {
    let bolivarExacto = valorBolivar * parseValor(inputDolar.value);
    inputBolivar.value = formatValor(bolivarExacto);

    let solExacto = valorSol * parseValor(inputDolar.value);
    inputSol.value = formatValor(solExacto);
});

inputBolivar.addEventListener('input', (e) => {
    let dolarExacto = parseValor(inputBolivar.value) / valorBolivar;
    inputDolar.value = formatValor(dolarExacto);

    let solExacto = valorSol * parseValor(inputDolar.value);
    inputSol.value = formatValor(solExacto);
});

inputSol.addEventListener('input', (e) => {
    let dolarExacto = parseValor(inputSol.value) / valorSol;
    inputDolar.value = formatValor(dolarExacto);

    let bolivarExacto = valorBolivar * parseValor(inputDolar.value);
    inputBolivar.value = formatValor(bolivarExacto);

});