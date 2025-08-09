// ===== CONFIG SECTION =====
// Replace these with your actual keys & links:
const aviationApiKey = 'ba001d604284a700ba4b2c54f5d3b7ff';    // <-- Replace this
const googleSheetCsv = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTm21g5xvevVszFZYv8ajDgZ0IuMvQh3BgtgzbL_WH4QoqB_4LUO7yI2csaFTDj41vGqJVGGO5NR0Ns/pub?gid=679478748&single=true&output=csv';    // <-- Replace this
const weatherApiKey = '5fb5688ea7730de79b414572ecbb2638';    // <-- Replace this

const weatherCityId = 5391811; // San Diego city ID for OpenWeatherMap
const weatherUnits = 'imperial'; // 'imperial' for °F, 'metric' for °C

// ===== DOM ELEMENTS =====
const currentTimeEl = document.getElementById('current-time');
const weatherInfoEl = document.getElementById('weather-info');

// ===== TIME FUNCTION =====
function updateTime() {
  const now = new Date();
  currentTimeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}

// ===== WEATHER FUNCTION =====
async function fetchWeather() {
  if (!weatherApiKey || weatherApiKey.trim() === '') {
    weatherInfoEl.textContent = 'NO WEATHER API KEY';
    return;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${weatherCityId}&units=${weatherUnits}&appid=${weatherApiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.weather || !data.main) {
      weatherInfoEl.textContent = 'WEATHER DATA UNAVAILABLE';
      return;
    }

    const description = data.weather[0].description.toUpperCase();
    const temp = Math.round(data.main.temp);
    weatherInfoEl.textContent = `${description} | ${temp}°F`;
  } catch (err) {
    console.error('Error fetching weather:', err);
    weatherInfoEl.textContent = 'ERROR LOADING WEATHER';
  }
}

// ===== FLIGHT DATA FUNCTION (placeholder) =====
async function fetchFlights() {
  console.log('Fetching flight data...');
  // TODO: Add your AviationStack API fetch code here using aviationApiKey and googleSheetCsv
}

// ===== INIT FUNCTIONS ON DOM LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  // Start live time updating
  updateTime();
  setInterval(updateTime, 1000);

  // Fetch weather immediately and every hour
  fetchWeather();
  setInterval(fetchWeather, 3600000); // 3600000ms = 1 hour

  // Fetch flight data immediately and every 30 minutes
  fetchFlights();
  setInterval(fetchFlights, 1800000); // 1800000ms = 30 minutes
});
