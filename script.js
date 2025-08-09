/* -----------------------------------------------------------
   FINAL: script.js
   - Now Spotting (top-left) updates every 15s from the CSV
   - Weather (Weatherstack) via AllOrigins HTTPS proxy -> updates hourly
   - Time updates every second
   - Ticker displays your custom message and scrolls
   ----------------------------------------------------------- */

/* ===== CONFIG - DO NOT CHANGE BELOW UNLESS YOU KNOW WHAT YOU'RE DOING ===== */
const GOOGLE_SHEET_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTm21g5xvevVszFZYv8ajDgZ0IuMvQh3BgtgzbL_WH4QoqB_4LUO7yI2csaFTDj41vGqJVGGO5NR0Ns/pub?gid=679478748&single=true&output=csv';
const WEATHERSTACK_KEY = '5fb5688ea7730de79b414572ecbb2638';

/* Use AllOrigins as a simple HTTPS proxy to avoid mixed-content / CORS issues.
   This proxies the Weatherstack HTTP endpoint over HTTPS:
   https://api.allorigins.win/raw?url=<encoded-weatherstack-url>
*/
const WEATHERSTACK_PROXY_PREFIX = 'https://api.allorigins.win/raw?url=';

/* Polling intervals */
const SHEET_POLL_MS = 15000;     // 15 seconds for near-immediate sheet updates
const WEATHER_POLL_MS = 3600000; // 1 hour for weather

/* ===== DOM references (will be set after DOM ready) ===== */
let nowLeftEl, nowRightEl, weatherInfoEl, currentTimeEl, flightTickerEl;

/* ===== Minimal CSV row parser for basic CSV (handles quoted fields) ===== */
function parseCsvRow(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      // If next char is also a quote, it's an escaped quote
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result.map(s => s.trim());
}

/* ===== Now Spotting: fetch CSV, show headers (left) and second row (right) only ===== */
async function fetchAndRenderSheet() {
  try {
    const res = await fetch(GOOGLE_SHEET_CSV, { cache: "no-store" }); // try to avoid cached responses
    if (!res.ok) {
      console.error('Sheet fetch failed:', res.status, res.statusText);
      return;
    }
    const text = await res.text();

    // Normalize line endings and split into rows
    const rows = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').map(r => r.trim()).filter(r => r.length > 0);
    if (rows.length === 0) {
      console.warn('Sheet CSV empty');
      return;
    }

    const headers = parseCsvRow(rows[0]);
    const secondRow = rows[1] ? parseCsvRow(rows[1]) : [];

    // Clear previous
    nowLeftEl.innerHTML = '';
    nowRightEl.innerHTML = '';

    // Populate columns using headers length but only values from row 2
    for (let i = 0; i < headers.length; i++) {
      const headerDiv = document.createElement('div');
      headerDiv.textContent = headers[i].toUpperCase();
      headerDiv.setAttribute('aria-hidden', 'true');
      nowLeftEl.appendChild(headerDiv);

      const val = secondRow[i] && secondRow[i].trim() !== '' ? secondRow[i] : '-';
      const valDiv = document.createElement('div');
      valDiv.textContent = val;
      nowRightEl.appendChild(valDiv);
    }

  } catch (err) {
    console.error('Error loading sheet CSV:', err);
  }
}

/* ===== Weather: use Weatherstack proxied through AllOrigins to avoid HTTPS/CORS issues ===== */
async function fetchWeatherStack() {
  if (!WEATHERSTACK_KEY || WEATHERSTACK_KEY.trim() === '') {
    weatherInfoEl.textContent = 'NO WEATHER API KEY';
    return;
  }

  try {
    // Weatherstack raw URL (http). AllOrigins will fetch it and return raw JSON over HTTPS.
    const wsUrl = `http://api.weatherstack.com/current?access_key=${encodeURIComponent(WEATHERSTACK_KEY)}&query=San Diego`;
    const proxyUrl = WEATHERSTACK_PROXY_PREFIX + encodeURIComponent(wsUrl);

    const res = await fetch(proxyUrl, { cache: "no-store" });
    if (!res.ok) {
      console.error('Weather proxy fetch failed:', res.status, res.statusText);
      weatherInfoEl.textContent = 'WEATHER ERROR';
      return;
    }

    const data = await res.json();
    // If Weatherstack returns an error object it will include "error"
    if (!data || data.error) {
      console.warn('Weatherstack returned error:', data && data.error);
      weatherInfoEl.textContent = 'WEATHER DATA UNAVAILABLE';
      return;
    }

    // Weatherstack returns current.temperature and current.weather_descriptions (array)
    const current = data.current;
    if (!current || typeof current.temperature !== 'number' || !Array.isArray(current.weather_descriptions)) {
      weatherInfoEl.textContent = 'WEATHER DATA UNAVAILABLE';
      return;
    }

    const desc = (current.weather_descriptions[0] || '').toUpperCase();
    const temp = Math.round(current.temperature);
    weatherInfoEl.textContent = `${desc} | ${temp}°F`;

  } catch (err) {
    console.error('Error fetching weather:', err);
    weatherInfoEl.textContent = 'ERROR LOADING WEATHER';
  }
}

/* ===== Time updater ===== */
function updateTime() {
  if (!currentTimeEl) return;
  const now = new Date();
  currentTimeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}

/* ===== Ticker: set your exact custom text ===== */
function setTickerText() {
  if (!flightTickerEl) return;
  // exact message requested:
  flightTickerEl.textContent = 'WELCOME TO SAN DIEGO PLANESPOTTING! LIVE FROM THE LAUREL TRAVEL CENTER ON LAUREL ST & KETTNER BLVD IN DOWNTOWN SAN DIEGO.';
  // adjust animation duration depending on text length (optional)
  // If you want a slower/faster scroll, modify CSS animation duration in style.css
}

/* ===== Initialize after DOM ready ===== */
document.addEventListener('DOMContentLoaded', () => {
  // set DOM references (safe to query now)
  nowLeftEl = document.getElementById('now-spotting-left');
  nowRightEl = document.getElementById('now-spotting-right');
  weatherInfoEl = document.getElementById('weather-info');
  currentTimeEl = document.getElementById('current-time');
  flightTickerEl = document.getElementById('flight-ticker');

  // sanity checks
  if (!nowLeftEl || !nowRightEl) console.error('Now spotting column elements missing from DOM.');
  if (!weatherInfoEl) console.error('Weather element missing from DOM.');
  if (!currentTimeEl) console.error('Time element missing from DOM.');
  if (!flightTickerEl) console.error('Ticker element missing from DOM.');

  // initial run
  updateTime();
  setInterval(updateTime, 1000);

  fetchAndRenderSheet();
  setInterval(fetchAndRenderSheet, SHEET_POLL_MS); // poll for sheet updates

  fetchWeatherStack();
  setInterval(fetchWeatherStack, WEATHER_POLL_MS);

  setTickerText();
});
