// ===== CONFIG SECTION =====
// Replace these with your actual keys & links:
const googleSheetCsv = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTm21g5xvevVszFZYv8ajDgZ0IuMvQh3BgtgzbL_WH4QoqB_4LUO7yI2csaFTDj41vGqJVGGO5NR0Ns/pub?gid=679478748&single=true&output=csv';    // <-- Replace this
const weatherApiKey = '5fb5688ea7730de79b414572ecbb2638';    // <-- Replace this

const weatherCityId = 5391811; // San Diego city ID for OpenWeatherMap
const weatherUnits = 'imperial'; // 'imperial' for °F, 'metric' for °C

const flightTickerEl = document.getElementById('flight-ticker');

function setCustomTickerText(text) {
  flightTickerEl.textContent = text;
}

document.addEventListener('DOMContentLoaded', () => {
  const ticker = document.getElementById('flight-ticker');
  ticker.textContent = 'WELCOME TO SAN DIEGO PLANESPOTTING! LIVE FROM THE LAUREL TRAVEL CENTER ON LAUREL ST & KETTNER BLVD IN DOWNTOWN SAN DIEGO.';
});

// ===== DOM ELEMENTS =====
const currentTimeEl = document.getElementById('current-time');
const weatherInfoEl = document.getElementById('weather-info');

// ===== TIME FUNCTION =====
function updateTime() {
  const now = new Date();
  currentTimeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}
}

// ===== WEATHER FUNCTION =====
async function fetchWeather() {
  if (!weatherApiKey) {
    weatherInfoEl.textContent = 'NO WEATHER API KEY';
    return;
  }

  try {
    const url = `http://api.weatherstack.com/current?access_key=${weatherApiKey}&query=San Diego`;
    const res = await fetch(url);
    const data = await res.json();
    console.log('Weather API data:', data); // Debug log

    if (!data.current) {
      weatherInfoEl.textContent = 'WEATHER DATA UNAVAILABLE';
      return;
    }

    const description = data.current.weather_descriptions[0].toUpperCase();
    const temp = Math.round(data.current.temperature);
    weatherInfoEl.textContent = `${description} | ${temp}°F`;
  } catch {
    weatherInfoEl.textContent = 'ERROR LOADING WEATHER';
  }
}


// ===== FLIGHT DATA FUNCTION (placeholder) =====
async function fetchFlights() {
  try {
    const res = await fetch(googleSheetCsv);
    const csvText = await res.text();

    const rows = csvText.trim().split('\n');

    const headers = rows[0].split(',');
    const dataRow = rows[1] ? rows[1].split(',') : [];

    const leftCol = document.getElementById('now-spotting-left');
    const rightCol = document.getElementById('now-spotting-right');

    leftCol.innerHTML = '';
    rightCol.innerHTML = '';

    for (let i = 0; i < headers.length; i++) {
      const headerEl = document.createElement('div');
      headerEl.textContent = headers[i].toUpperCase();
      leftCol.appendChild(headerEl);

      const dataEl = document.createElement('div');
      dataEl.textContent = dataRow[i] || '';
      rightCol.appendChild(dataEl);
    }
  } catch (error) {
    console.error('Error fetching or parsing Google Sheet CSV:', error);
  }
}

}

// ===== INIT FUNCTIONS ON DOM LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  // Start live time updating
 updateTime(); // update immediately
setInterval(updateTime, 1000); // update every second

  // Fetch weather immediately and every hour
 fetchWeather();
setInterval(fetchWeather, 3600000);

  document.addEventListener('DOMContentLoaded', () => {
  fetchFlights();
  // add any other startup functions here, like updateTime() or ticker setup
});


