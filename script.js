// ===== CONSTANTS =====
const googleSheetCsv = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTm21g5xvevVszFZYv8ajDgZ0IuMvQh3BgtgzbL_WH4QoqB_4LUO7yI2csaFTDj41vGqJVGGO5NR0Ns/pub?gid=679478748&single=true&output=csv';
const weatherApiKey = '5fb5688ea7730de79b414572ecbb2638';

// ===== ELEMENT REFERENCES =====
const currentTimeEl = document.getElementById('current-time');
const weatherInfoEl = document.getElementById('weather-info');
const flightTickerEl = document.getElementById('flight-ticker');

// ===== UPDATE TIME =====
function updateTime() {
  if (!currentTimeEl) return;
  const now = new Date();
  currentTimeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}

// ===== FETCH AND DISPLAY WEATHER =====
async function fetchWeather() {
  if (!weatherApiKey) {
    weatherInfoEl.textContent = 'NO WEATHER API KEY';
    return;
  }
  try {
    const url = `http://api.weatherstack.com/current?access_key=${weatherApiKey}&query=San Diego`;
    const res = await fetch(url);
    const data = await res.json();
    console.log('Weather API data:', data);

    if (!data.current) {
      weatherInfoEl.textContent = 'WEATHER DATA UNAVAILABLE';
      return;
    }

    const description = data.current.weather_descriptions[0].toUpperCase();
    const temp = Math.round(data.current.temperature);
    weatherInfoEl.textContent = `${description} | ${temp}°F`;
  } catch (error) {
    console.error('Error fetching weather:', error);
    weatherInfoEl.textContent = 'ERROR LOADING WEATHER';
  }
}

// ===== FETCH AND DISPLAY NOW SPOTTING DATA =====
async function fetchFlights() {
  try {
    const res = await fetch(googleSheetCsv);
    const csvText = await res.text();

    // Normalize line breaks and split rows
    const rows = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n');

    const headers = rows[0].split(',');
    const dataRow = rows[1] ? rows[1].split(',') : [];

    // Elements for the left and right columns
    const leftCol = document.getElementById('now-spotting-left');
    const rightCol = document.getElementById('now-spotting-right');

    leftCol.innerHTML = '';
    rightCol.innerHTML = '';

    for (let i = 0; i < headers.length; i++) {
      // Header cell
      const headerEl = document.createElement('div');
      headerEl.textContent = headers[i].toUpperCase();
      leftCol.appendChild(headerEl);

      // Data cell (show dash if empty)
      const dataEl = document.createElement('div');
      dataEl.textContent = dataRow[i] && dataRow[i].trim() !== '' ? dataRow[i] : '-';
      rightCol.appendChild(dataEl);
    }
  } catch (error) {
    console.error('Error fetching/parsing CSV:', error);
  }
}

// ===== SET CUSTOM TICKER TEXT =====
function setCustomTickerText() {
  if (!flightTickerEl) return;
  flightTickerEl.textContent = 'WELCOME TO SAN DIEGO PLANESPOTTING! LIVE FROM THE LAUREL TRAVEL CENTER ON LAUREL ST & KETTNER BLVD IN DOWNTOWN SAN DIEGO.';
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  updateTime();
  setInterval(updateTime, 1000);     // update time every second

  fetchWeather();
  setInterval(fetchWeather, 3600000); // update weather every hour

  fetchFlights();
  // Could add interval to refresh flights, e.g., every 30 mins if needed
  // setInterval(fetchFlights, 1800000);

  setCustomTickerText();
});
