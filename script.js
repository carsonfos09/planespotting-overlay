// GOOGLE SHEET NOW SPOTTING FETCH
const nowSpottingURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTm21g5xvevVszFZYv8ajDgZ0IuMvQh3BgtgzbL_WH4QoqB_4LUO7yI2csaFTDj41vGqJVGGO5NR0Ns/pub?gid=679478748&single=true&output=csv";

async function updateNowSpotting() {
  try {
    const response = await fetch(nowSpottingURL);
    const data = await response.text();
    const rows = data.split("\n").map(r => r.split(","));
    const latest = rows[1] ? rows[1].join(" ") : "No data";
    document.getElementById("nowSpottingContent").textContent = latest;
  } catch (err) {
    document.getElementById("nowSpottingContent").textContent = "Error loading";
  }
}

// AVIATIONSTACK TICKER FETCH
const API_KEY = "ba001d604284a700ba4b2c54f5d3b7ff";
const airportCode = "SAN"; // San Diego Intl

async function updateTicker() {
  try {
    const arrivals = await fetch(`https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&arr_iata=${airportCode}`);
    const departures = await fetch(`https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&dep_iata=${airportCode}`);

    const arrData = (await arrivals.json()).data || [];
    const depData = (await departures.json()).data || [];

    const flightInfo = [...arrData, ...depData]
      .slice(0, 10)
      .map(f => `${f.flight.iata || ""} ${f.arrival?.airport || f.departure?.airport || ""}`)
      .join("  •  ");

    document.getElementById("tickerContent").textContent = flightInfo || "No flight data available";
  } catch (err) {
    document.getElementById("tickerContent").textContent = "Error loading flight data";
  }
}

// REFRESH INTERVALS
updateNowSpotting();
updateTicker();
setInterval(updateNowSpotting, 60000); // every 1 min
setInterval(updateTicker, 60000); // every 1 min
