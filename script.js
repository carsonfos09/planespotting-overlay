const rotationAPI = "https://script.google.com/macros/s/AKfycbwqeRs2qtcXjIV--KZNZ1SU4MrV3o5sCq5p_90R2HdCebrMt8wNxdtmyNsjzIF7L45L7g/exec?sheet=flights"; 
const nowSpottingAPI = "https://script.google.com/macros/s/AKfycbwqeRs2qtcXjIV--KZNZ1SU4MrV3o5sCq5p_90R2HdCebrMt8wNxdtmyNsjzIF7L45L7g/exec?sheet=now_spotting"; 

async function fetchRotation() {
    try {
        const res = await fetch(rotationAPI);
        const data = await res.json();

        let tickerHTML = "";
        data.forEach(flight => {
            tickerHTML += `${flight.Flight} | ${flight.Airline} | ${flight.Aircraft} | ${flight.Route} | ${flight.Time} | ${flight.Status} — `;
        });

        document.getElementById("ticker-content").innerText = tickerHTML;
    } catch (err) {
        console.error("Rotation fetch error:", err);
    }
}

async function fetchNowSpotting() {
    try {
        const res = await fetch(nowSpottingAPI);
        const data = await res.json();

        if (data.length > 0) {
            const f = data[0];
            document.getElementById("ns-flight").innerText = f.Flight;
            document.getElementById("ns-airline").innerText = f.Airline;
            document.getElementById("ns-aircraft").innerText = f.Aircraft;
            document.getElementById("ns-route").innerText = f.Route;
        }
    } catch (err) {
        console.error("Now Spotting fetch error:", err);
    }
}

// Refresh every 30 seconds
fetchRotation();
fetchNowSpotting();
setInterval(fetchRotation, 30000);
setInterval(fetchNowSpotting, 30000);
