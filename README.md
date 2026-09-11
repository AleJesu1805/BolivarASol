# BolivarASol 💱

Conversor de monedas entre **Dólar (USDT)**, **Bolívar (tasa BCV)** y **Sol peruano (PEN)**. App web ligera en HTML/CSS/JS puro, instalable como PWA.

## ¿Qué hace?

Tres campos (dólar, bolívar, sol) que se recalculan entre sí en tiempo real al escribir en cualquiera de ellos, usando las tasas del día. Incluye botones de acceso rápido (0$ a 50$) que rellenan el dólar y recalculan el resto.

## Funcionamiento local (offline)

- Al cargar la página, `script.js` pide la tasa BCV a `dolarapi.com` y la tasa PEN/USD a `exchangerate-api.com`.
- Cada tasa obtenida se guarda en `localStorage` (`valorBsLocal`, `valorPenLocal`).
- Si la petición falla (sin conexión), la app **no se rompe**: lee la última tasa guardada en `localStorage` y sigue operando con ese valor, aunque esté desactualizado.
- La conversión en sí (cálculo entre los 3 campos) no depende de red en ningún momento: solo usa las tasas ya cargadas en memoria (`valorBolivar`, `valorSol`).

## Soporte PWA

- `manifest.json` define nombre, ícono, `display: fullscreen`, orientación vertical y `start_url`, lo que permite **instalar la app** en el teléfono o escritorio.
- `sw.js` (Service Worker) implementa caché **network-first**: intenta traer cada recurso de la red y lo guarda en caché; si no hay conexión, sirve la copia cacheada.
- Si una navegación falla por completo sin red ni caché de esa página, cae de vuelta a `index.html` cacheado.
- Soporta peticiones con encabezado `Range` (útil para servir partes de archivos, como íconos) incluso en modo offline.
- Resultado: la app abre y funciona sin internet una vez visitada al menos una vez.

## Estructura

```
index.html   → interfaz (inputs + atajos)
styles.css   → tema oscuro
script.js    → conversión + consumo de APIs + fallback local
sw.js        → caché offline
manifest.json → config PWA
.github/workflows/static.yml → despliegue a GitHub Pages
```

## Uso local

No requiere build: clona el repo y abre `index.html` en el navegador (o sírvelo con `npx serve`).
