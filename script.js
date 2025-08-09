/* Reset & basics */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'League Spartan', sans-serif;
  text-transform: uppercase;
  color: white;
}

body {
  background-color: #2c3e70; /* matted blue */
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  overflow: hidden;
}

/* Control Panel */
#control-panel {
  position: fixed;
  top: 10px;
  left: 10px;
  background: #1f2b47;
  padding: 15px;
  border-radius: 8px;
  width: 320px;
  font-size: 14px;
  z-index: 10;
  color: white;
}

#control-panel h2 {
  margin-bottom: 10px;
  font-size: 18px;
}

#control-panel label {
  display: block;
  margin-bottom: 10px;
}

#control-panel input {
  width: 100%;
  padding: 5px;
  margin-top: 4px;
  border-radius: 4px;
  border: none;
  font-family: 'League Spartan', sans-serif;
  font-size: 14px;
}

#control-panel button {
  padding: 8px 12px;
  background-color: #1a73e8;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  font-weight: 700;
}

/* NOW SPOTTING BOX */
#now-spotting {
  position: fixed;
  left: 20px;
  top: 20%;
  background: #1f2b47;
  border-radius: 12px;
  padding: 15px 20px;
  width: 22vw;
  min-width: 280px;
  max-width: 350px;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  z-index: 5;
}

#now-spotting-header {
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 12px;
  text-align: center;
  letter-spacing: 1.5px;
}

#spotting-content {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

#headers-column div,
#data-column div {
  margin-bottom: 10px;
  font-size: 16px;
}

/* Time & Weather box */
#time-weather {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #1f2b47;
  border-radius: 10px;
  padding: 10px 15px;
  min-width: 140px;
  max-width: 180px;
  box-shadow: 0 0 8px rgba(0,0,0,0.4);
  font-size: 14px;
  text-align: center;
  z-index: 5;
}

#current-time {
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 6px;
}

/* Flight ticker */
#flight-ticker-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #1f2b47;
  overflow: hidden;
  height: 40px;
  display: flex;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.4);
  z-index: 5;
}

#flight-ticker {
  white-space: nowrap;
  display: inline-block;
  padding-left: 100%;
  will-change: transform;
  font-size: 16px;
  font-weight: 600;
}
