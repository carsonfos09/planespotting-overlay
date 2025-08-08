// Example function to update Now Spotting
function updateNowSpotting(text) {
  const box = document.getElementById('nowSpottingBox');
  const content = document.getElementById('nowSpottingContent');

  // Fade out
  box.style.opacity = 0;

  setTimeout(() => {
    content.textContent = text;
    // Fade back in
    box.style.opacity = 1;
  }, 800);
}

// Example function to update ticker
function updateTicker(text) {
  document.getElementById('tickerContent').textContent = text;
}

// DEMO: Example static updates (replace with your CSV/data logic)
updateNowSpotting("Amtrak #777 at San Diego");
updateTicker("Amtrak #777 arriving soon • BNSF Freight passing northbound");
