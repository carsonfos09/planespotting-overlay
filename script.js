/* -----------------------------------------------------------
   FINAL: script.js - no AllOrigins proxy, direct HTTPS Weatherstack
   - Now Spotting (top-left) updates every 10s with cache-busting
   - Weather updates hourly directly from Weatherstack HTTPS API
   - Time updates every second
   - Ticker displays your custom message and scrolls
   ----------------------------------------------------------- */

/* ===== CONFIG - DO NOT CHANGE BELOW UNLESS YOU KNOW WHAT YOU'RE DOING ===== */
const GOOGLE_SHEET_CSV_BASE = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTm21g5xvevVszFZYv8ajDgZ0IuMvQh3BgtgzbL_WH4QoqB_4LUO7yI2csaFTDj41vGqJVGGO5NR0Ns/pub?gid=679478748&single=true&output=csv';
const WEATHERSTACK_KEY = '5fb5688ea7730de79b414572ecbb2638';

/* Polling intervals */
const SHEET_POLL_MS = 10000;     // 10 seconds
const WEATHER_POLL_MS = 3600000; // 1 hour

/* ===== DOM references (set after DOM ready) ===== */
let nowLeftEl, nowRightEl, weatherInfoEl, currentTimeEl, flightTickerEl;

/* ===== Minimal CSV row parser (handles quoted fields) ===== */
function parseCsvRow(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
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

/* ===== Now Spotting: fetch CSV with cache buster ===== */
async function fetchAndRenderSheet() {
  try {
    // Append cache buster param to prevent caching
    const url = GOOGLE_SHEET_CSV_BASE + '&nocache=' + Date.now();
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error('Sheet fetch failed:', res.status, res.statusText);
      return;
    }
    const text = await res.text();

    const rows = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
      .split('\n').map(r => r.trim()).filter(r => r.length > 0);
    if (rows.length === 0) {
      console.warn('Sheet CSV empty');
      return;
    }

    const headers = parseCsvRow(rows[0]);
    const secondRow = rows[1] ? parseCsvRow(rows[1]) : [];

    nowLeftEl.innerHTML = '';
    nowRightEl.innerHTML = '';

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

/* ===== Weather: direct HTTPS call to Weatherstack ===== */
async function fetchWeatherStack() {
  if (!WEATHERSTACK_KEY || WEATHERSTACK_KEY.trim() === '') {
    weatherInfoEl.textContent = 'NO WEATHER API KEY';
    return;
  }

  try {
    const wsUrl = `https://api.weatherstack.com/current?access_key=${encodeURIComponent(WEATHERSTACK_KEY)}&query=San Diego&units=f`;
    const res = await fetch(wsUrl, { cache: "no-store" });
    if (!res.ok) {
      console.error('Weather fetch failed:', res.status, res.statusText);
      weatherInfoEl.textContent = 'WEATHER ERROR';
      return;
    }

    const data = await res.json();
    if (!data || data.error) {
      console.warn('Weatherstack returned error:', data && data.error);
      weatherInfoEl.textContent = 'WEATHER DATA UNAVAILABLE';
      return;
    }

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

/* ===== Ticker text ===== */
function setTickerText() {
  if (!flightTickerEl) return;
  flightTickerEl.textContent = 'WELCOME TO SAN DIEGO PLANESPOTTING! LIVE FROM THE LAUREL TRAVEL CENTER ON LAUREL ST & KETTNER BLVD IN DOWNTOWN SAN DIEGO.';
}

/* ===== Initialize DOM and polling ===== */
document.addEventListener('DOMContentLoaded', () => {
  nowLeftEl = document.getElementById('now-spotting-left');
  nowRightEl = document.getElementById('now-spotting-right');
  weatherInfoEl = document.getElementById('weather-info');
  currentTimeEl = document.getElementById('current-time');
  flightTickerEl = document.getElementById('flight-ticker');

  if (!nowLeftEl || !nowRightEl) console.error('Now spotting column elements missing from DOM.');
  if (!weatherInfoEl) console.error('Weather element missing from DOM.');
  if (!currentTimeEl) console.error('Time element missing from DOM.');
  if (!flightTickerEl) console.error('Ticker element missing from DOM.');

  updateTime();
  setInterval(updateTime, 1000);

  fetchAndRenderSheet();
  setInterval(fetchAndRenderSheet, SHEET_POLL_MS);

  fetchWeatherStack();
  setInterval(fetchWeatherStack, WEATHER_POLL_MS);

  setTickerText();
});
