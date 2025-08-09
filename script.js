// Globals for control panel inputs
let aviationApiKey = 'ba001d604284a700ba4b2c54f5d3b7ff';
let googleSheetCsv = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTm21g5xvevVszFZYv8ajDgZ0IuMvQh3BgtgzbL_WH4QoqB_4LUO7yI2csaFTDj41vGqJVGGO5NR0Ns/pub?gid=679478748&single=true&output=csv';
let weatherApiKey = '5fb5688ea7730de79b414572ecbb2638';
let tickerSpeed = 50; // ms per step

// Elements
const flightTicker = document.getElementById('flight-ticker');
const flightNumberEl = document.getElementById('flightNumber');
const airlineEl = document.getElementById('airline');
const aircraftEl = document.getElementById('aircraft');
const routeEl = document.getElementById('route');

const currentTimeEl = document.getElementById('current-time');
const weatherInfoEl = document.getElementById('weather-info');

const aviationInput = document.getElementById('aviationApiKey');
const googleSheetInput = document.getElementById('googleSheetCsv');
const weatherInput = document.getElementById('weatherApiKey');
const tickerSpeedInput = document.getElementById('tickerSpeed');
const applyBtn = document.getElementById('applySettings');

let tickerPosition = 0;
let tickerText = '';
let tickerAnimationFrame;

// Initialize control panel defaults
function initControls() {
  aviationInput.value = '';
  googleSheetInput.value = '';
  weatherInput.value = '';
  tickerSpeedInput.value = tickerSpeed;
}

// Fetch flights data from AviationStack API
async function fetchFlights() {
  if (!aviationApiKey) return;

  try {
    // Example endpoint for departures & arrivals for San Diego (IATA: SAN)
    const url = `https://api.aviationstack.com/v1/flights?access_key=${aviationApiKey}&dep_iata=SAN&arr_iata=SAN&limit=15`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.data) return;

    // Build ticker string: FlightNumber | Airline | Route | Aircraft ...
    tickerText = data.data
      .map(
        (f) =>
          `${f.flight.iata || 'N/A'} | ${f.airline.name || 'N/A'} | ${
            f.departure.iata || 'N/A'
          }-${f.arrival.iata || 'N/A'} | ${f.aircraft.registration || 'N/A'}`
      )
      .join('    —    ');

    flightTicker.textContent = tickerText;
  } catch (err) {
    console.error('Error fetching flights:', err);
    tickerText = 'ERROR FETCHING FLIGHTS';
    flightTicker.textContent = tickerText;
  }
}

// Fetch Google Sheet CSV and parse second row to show in NOW SPOTTING box
async function fetchSheetData() {
  if (!googleSheetCsv) return;

  try {
    const res = await fetch(googleSheetCsv);
    const text = await res.text();

    // CSV parsing basic (assumes no commas inside fields)
    const rows = text.trim().split('\n');
    const headers = rows[0].split(',');
    const secondRow = rows[1].split(',');

    // Set text in NOW SPOTTING columns, match header order you gave
    // Flight Number, Airline, Aircraft, Route
    // Find indexes dynamically:
    const flightIdx = headers.findIndex((h) => h.toLowerCase() === 'flight number');
    const airlineIdx = headers.findIndex((h) => h.toLowerCase() === 'airline');
    const aircraftIdx = headers.findIndex((h) => h.toLowerCase() === 'aircraft');
    const routeIdx = headers.findIndex((h) => h.toLowerCase() === 'route');

    flightNumberEl.textContent = secondRow[flightIdx] || '-';
    airlineEl.textContent = secondRow[airlineIdx] || '-';
    aircraftEl.textContent = secondRow[aircraftIdx] || '-';
    routeEl.textContent = secondRow[routeIdx] || '-';
  } catch (err) {
    console.error('Error fetching Google Sheet:', err);
    flightNumberEl.textContent = '-';
    airlineEl.textContent = '-';
    aircraftEl.textContent = '-';
    routeEl.textContent = '-';
  }
}

// Update live time every second
document.addEventListener('DOMContentLoaded', () => {
  updateTime(); // show time immediately
  setInterval(updateTime, 1000); // refresh every second
});

}

// Fetch live weather from OpenWeatherMap API for San Diego
async function fetchWeather() {
  if (!weatherApiKey) {
    weatherInfoEl.textContent = 'No weather API key';
    return;
  }

  try {
    // San Diego city ID: 5391811 (OpenWeatherMap)
    const url = `https://api.openweathermap.org/data/2.5/weather?id=5391811&appid=${weatherApiKey}&units=imperial`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.weather || !data.main) {
      weatherInfoEl.textContent = 'Weather data unavailable';
      return;
    }

    const description = data.weather[0].description.toUpperCase();
    const temp = Math.round(data.main.temp);
    weatherInfoEl.textContent = `${description} | ${temp}°F`;
  } catch (err) {
    console.error('Error fetching weather:', err);
    weatherInfoEl.textContent = 'Error loading weather';
  }
}

// Animate flight ticker (scrolling text)
function animateTicker() {
  const containerWidth = flightTicker.parentElement.offsetWidth;
  const textWidth = flightTicker.scrollWidth;

  tickerPosition -= 1; // Move left 1px per frame, adjust for speed later

  if (-tickerPosition > textWidth) {
    tickerPosition = containerWidth;
  }

  flightTicker.style.transform = `translateX(${tickerPosition}px)`;

  tickerAnimationFrame = setTimeout(animateTicker, tickerSpeed);
}

// Apply control panel settings and start fetching data
function applySettings() {
  aviationApiKey = aviationInput.value.trim();
  googleSheetCsv = googleSheetInput.value.trim();
  weatherApiKey = weatherInput.value.trim();
  tickerSpeed = parseInt(tickerSpeedInput.value, 10) || 50;

  clearTimeout(tickerAnimationFrame);

  fetchFlights();
  fetchSheetData();
  fetchWeather();

  animateTicker();
}

// Initial setup
initControls();
applySettings();
updateTime();
setInterval(updateTime, 1000); // Update clock every second

// Refresh flights and sheet data every 30 minutes (1800000 ms)
setInterval(() => {
  fetchFlights();
  fetchSheetData();
}, 1800000);

// Refresh weather every 1 hour (3600000 ms)
setInterval(() => {
  fetchWeather();
}, 3600000);

applyBtn.addEventListener('click', applySettings);
