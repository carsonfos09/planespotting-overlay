const rotationCSVUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTm21g5xvevVszFZYv8ajDgZ0IuMvQh3BgtgzbL_WH4QoqB_4LUO7yI2csaFTDj41vGqJVGGO5NR0Ns/pub?gid=0&single=true&output=csv";  // Replace with your published CSV link for the 'flights' sheet
const nowSpottingCSVUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTm21g5xvevVszFZYv8ajDgZ0IuMvQh3BgtgzbL_WH4QoqB_4LUO7yI2csaFTDj41vGqJVGGO5NR0Ns/pub?gid=679478748&single=true&output=csv";  // Replace with your published CSV link for the 'now spotting' sheet

// Simple CSV parser function: parses CSV text into an array of objects
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines.shift().split(',');
  return lines.map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, i) => {
      obj[header.trim()] = values[i].trim();
      return obj;
    }, {});
  });
}

async function fetchRotation() {
  try {
    const res = await fetch(rotationCSVUrl);
    const text = await res.text();
    const data = parseCSV(text);

    let tickerHTML = "";
    data.forEach(flight => {
      tickerHTML += `${flight["Flight #"]} | ${flight["Airline"]} | ${flight["Aircraft"]} | ${flight["Route"]} | ${flight["Time"]} | ${flight["Status"]} — `;
    });

    document.getElementById("ticker-content").innerText = tickerHTML;
  } catch (err) {
    console.error("Rotation fetch error:", err);
  }
}

async function fetchNowSpotting() {
  try {
    const res = await fetch(nowSpottingCSVUrl);
    const text = await res.text();
    const data = parseCSV(text);

    if (data.length > 0) {
      const flight = data[0];
      document.getElementById("ns-flight").innerText = flight["Flight #"];
      document.getElementById("ns-airline").innerText = flight["Airline"];
      document.getElementById("ns-aircraft").innerText = flight["Aircraft"];
      document.getElementById("ns-route").innerText = flight["Route"];
      document.getElementById("ns-duration").innerText = flight["Duration"];
    }
  } catch (err) {
    console.error("Now Spotting fetch error:", err);
  }
}

// Initial fetches and refresh every 30 seconds
fetchRotation();
fetchNowSpotting();
setInterval(fetchRotation, 30000);
setInterval(fetchNowSpotting, 30000);
