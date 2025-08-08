// ----------------------
// TICKER (AviationStack)
// ----------------------
const API_KEY = 'ba001d604284a700ba4b2c54f5d3b7ff';

// URLs for arrivals and departures
const ARRIVALS_URL = `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&arr_iata=SAN`;
const DEPARTURES_URL = `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&dep_iata=SAN`;

async function fetchTickerData() {
  try {
    // Fetch arrivals & departures in parallel
    const [arrivalsRes, departuresRes] = await Promise.all([
      fetch(ARRIVALS_URL),
      fetch(DEPARTURES_URL)
    ]);

    const arrivalsData = await arrivalsRes.json();
    const departuresData = await departuresRes.json();

    const arrivals = arrivalsData.data || [];
    const departures = departuresData.data || [];

    // Build ticker text (limit to first 3 each)
    let tickerText = [
      ...arrivals.slice(0, 3).map(f => `Arrival: ${f.airline.name} ${f.flight.iata} from ${f.departure.iata}`),
      ...departures.slice(0, 3).map(f => `Departure: ${f.airline.name} ${f.flight.iata} to ${f.arrival.iata}`)
    ].join("  •  ");

    document.getElementById('tickerContent').textContent = tickerText;

  } catch (error) {
    console.error('Error fetching ticker data:', error);
    document.getElementById('tickerContent').textContent = "Error loading flight data";
  }
}

// Initial fetch when page loads
fetchTickerData();

// Refresh every 30 minutes (2 API calls each refresh)
setInterval(fetchTickerData, 30 * 60 * 1000);
