if ('service worker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

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
    inputDolar.value = formatValor(num);

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
        inputBolivar.value = formatValor(valor);
        valorBolivar = valor;
        localStorage.setItem('valorBsLocal', valor);
    })
    .catch((err) => {
        console.error('Error:', err);
        const valor = localStorage.getItem('valorBsLocal');
        inputBolivar.value = formatValor(Number(valor));
        valorBolivar = valor;
    });

const sol = () => fetch('https://v6.exchangerate-api.com/v6/916af0932b27a81eeb3ed6bd/pair/PEN/USD')
    .then(res => res.json())
    .then(data => {
        let dato = data.conversion_rate;
        const valor = 1 / dato;
        inputSol.value = formatValor(valor);
        valorSol = valor;
        localStorage.setItem('valorPenLocal', dato);
    })
    .catch((err) => {
        console.error('Error:', err);
        let dato = localStorage.getItem('valorPenLocal');
        const valor = (1 / dato);
        inputSol.value = formatValor(Number(valor));
        valorSol = valor;
    });

sol();
bolivar();

inputDolar.addEventListener('input', (e) => {
    const dolarNum = parseValor(inputDolar.value);

    let bolivarExacto = valorBolivar * dolarNum;
    inputBolivar.value = formatValor(bolivarExacto);

    let solExacto = valorSol * dolarNum;
    inputSol.value = formatValor(solExacto);
});

inputBolivar.addEventListener('input', (e) => {
    const bolivarNum = parseValor(inputBolivar.value);
    let dolarExacto = bolivarNum / valorBolivar;
    inputDolar.value = formatValor(dolarExacto);

    let solExacto = valorSol * dolarExacto;
    inputSol.value = formatValor(solExacto);
});

inputSol.addEventListener('input', (e) => {
    const solNum = parseValor(inputSol.value);
    let dolarExacto = solNum / valorSol;
    inputDolar.value = formatValor(dolarExacto);

    let bolivarExacto = valorBolivar * dolarExacto;
    inputBolivar.value = formatValor(bolivarExacto);
});

[inputDolar, inputBolivar, inputSol].forEach((input) => {
    input.addEventListener('blur', () => {
        input.value = formatValor(parseValor(input.value));
    });
});