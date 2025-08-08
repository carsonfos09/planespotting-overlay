// URL to your published Google Sheet CSVs
// Replace each with your actual published CSV link
const nowSpottingCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTm21g5xvevVszFZYv8ajDgZ0IuMvQh3BgtgzbL_WH4QoqB_4LUO7yI2csaFTDj41vGqJVGGO5NR0Ns/pub?gid=679478748&single=true&output=csv";
const tickerCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTm21g5xvevVszFZYv8ajDgZ0IuMvQh3BgtgzbL_WH4QoqB_4LUO7yI2csaFTDj41vGqJVGGO5NR0Ns/pub?gid=0&single=true&output=csv";

// Function to fetch and parse a CSV
async function fetchCSV(url) {
    const response = await fetch(url);
    const text = await response.text();
    return parseCSV(text);
}

// CSV parser
function parseCSV(text) {
    return text.trim().split("\n").map(row => row.split(","));
}

// Fade update for Now Spotting
function updateNowSpotting(text) {
    const nowSpottingEl = document.getElementById("now-spotting-text");
    nowSpottingEl.style.opacity = 0;
    setTimeout(() => {
        nowSpottingEl.textContent = text;
        nowSpottingEl.style.opacity = 1;
    }, 300); // fade timing
}

// Update Ticker
function updateTicker(text) {
    document.getElementById("ticker-text").textContent = text;
}

// Main refresh function
async function refreshData() {
    try {
        // Get Now Spotting data
        const nowSpottingRows = await fetchCSV(nowSpottingCsvUrl);
        const nowSpottingValue = nowSpottingRows[1][0]; // Row 2, Col A
        updateNowSpotting(nowSpottingValue);

        // Get Ticker data
        const tickerRows = await fetchCSV(tickerCsvUrl);
        const tickerValue = tickerRows[1][0]; // Row 2, Col A
        updateTicker(tickerValue);

    } catch (err) {
        console.error("Error fetching CSV data:", err);
    }
}

// Refresh every 30 seconds
setInterval(refreshData, 30000);

// Initial load
refreshData();
