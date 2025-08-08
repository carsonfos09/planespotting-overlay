// --- Google Sheet Now Spotting ---
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTm21g5xvevVszFZYv8ajDgZ0IuMvQh3BgtgzbL_WH4QoqB_4LUO7yI2csaFTDj41vGqJVGGO5NR0Ns/pub?gid=679478748&single=true&output=csv';  // Replace with your published CSV URL

async function updateNowSpotting() {
  try {
    const response = await fetch(sheetURL);
    const data = await response.text();

    // Parse CSV rows
    const rows = data.split('\n').map(row => row.split(','));

    if (rows.length >= 2) {
      const headers = rows[0];
      const firstData = rows[1];

      // Build display string: Header: Value | Header: Value | ...
      const displayText = headers.map((header, i) => `${header.trim()}: ${firstData[i].trim()}`).join(' | ');

      document.getElementById('nowSpottingContent').textContent = displayText;
    } else {
      document.getElementById('nowSpottingContent').textContent = 'No data available';
    }
  } catch (error) {
    console.error('Error fetching Google Sheet:', error);
    document.getElementById('nowSpottingContent').textContent = 'Error loading data';
  }
}

// --- AviationStack Ticker ---
const API_KEY = 'ba001d604284a700ba4b2c54f5d3b7ff';
const airportCode = 'SAN';

async function updateTicker() {
  try {
    const arrivalsRes = await fetch(`https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&arr_iata=${SAN}`);
    const departuresRes = await fetch(`https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&dep_iata=${SAN}`);

    const arrivalsData = await arrivalsRes.json();
    const departuresData = await departuresRes.json();

    const arrivals = arrivalsData.data || [];
    const departures = departuresData.data || [];

    const tickerFlights = [
      ...arrivals.slice(0, 3).map(f => `Arrival: ${f.airline.name} ${f.flight.iata} from ${f.departure.iata}`),
      ...departures.slice(0, 3).map(f => `Departure: ${f.airline.name} ${f.flight.iata} to ${f.arrival.iata}`)
    ];

    document.getElementById('tickerContent').textContent = tickerFlights.join('  •  ') || 'No flight data available';
  } catch (error) {
    console.error('Error fetching ticker data:', error);
    document.getElementById('tickerContent').textContent = 'Error loading flight data';
  }
}

// Run on page load
updateNowSpotting();
updateTicker();

// Refresh intervals
setInterval(updateNowSpotting, 30000);   // every 30 sec
setInterval(updateTicker, 600000);       // every 10 min
