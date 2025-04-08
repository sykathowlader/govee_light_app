import React, { useState } from "react";
import "./App.css";
import { CgLogOff } from "react-icons/cg";

function App() {
  const [selectedColor, setSelectedColor] = useState(null);
  const [status, setStatus] = useState("");
  const [currentAudio, setCurrentAudio] = useState(null);

  // Base URL for API calls
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  //setting up the colors

  const colors = [
    {
      name: "Red",
      hex: "#FF0000",
      rgb: { r: 255, g: 0, b: 0 },
      audio: "/audio/hannibal_red.mp3",
    },
    {
      name: "Blue",
      hex: "#0000FF",
      rgb: { r: 0, g: 0, b: 255 },
      audio: "/audio/patrick_blue.mp3",
    },
    {
      name: "Green",
      hex: "#008000",
      rgb: { r: 0, g: 128, b: 0 },
      audio: "/audio/river_green.mp3",
    },
    {
      name: "Yellow",
      hex: "#FFFF00",
      rgb: { r: 255, g: 255, b: 0 },
      audio: "/audio/birds_yellow.mp3",
    },
    {
      name: "Orange",
      hex: "#FA3C00",
      rgb: { r: 250, g: 50, b: 0 },
      audio: "/audio/einaudi_orange.mp3",
    },
  ];

  // Function to play audio in a loop
  const playAudio = (audioSrc) => {
    // Stop any existing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0; // Reset to start
    }

    // Create and configure new audio
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
    setCurrentAudio(audio);
  };

  // Function to stop audio
  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
  };

  //handling the selection of color box click

  const handleColorSelect = async (color) => {
    setSelectedColor(color);
    setStatus("Changing color...");

    try {
      const response = await fetch(`${API_BASE_URL}/change-color`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(color.rgb),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
      if (result.success) {
        setStatus(`Color changed to ${color.name} successfully!`);
        playAudio(color.audio);
      } else {
        setStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  //handling the button to turn off the colors
  const handleTurnOff = async () => {
    setStatus("Turning off lights...");

    try {
      const response = await fetch(`${API_BASE_URL}/turn-off`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Requesting turn off");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
      if (result.success) {
        setSelectedColor(null);
        setStatus("Lights turned off successfully!");
        stopAudio();
      } else {
        setStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <h1>Which color do you want your LED lights?</h1>

      <div className="color-grid">
        {colors.map((color) => (
          <div
            key={color.name}
            className={`color-box ${
              selectedColor?.name === color.name ? "selected" : ""
            }`}
            style={{ "--background-color": color.hex }}
            onClick={() => handleColorSelect(color)}
            title={color.name}
          />
        ))}
      </div>

      <button onClick={handleTurnOff}>
        Turn Off Lights{" "}
        <span>
          <CgLogOff />
        </span>
      </button>

      {selectedColor && (
        <div className="selected-color">
          <h2>Selected Color</h2>
          <div
            className="color-preview"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <p>Name: {selectedColor.name}</p>
          <p>{status}</p>
        </div>
      )}

      {!selectedColor && status && (
        <div className="status-message">
          <p>{status}</p>
        </div>
      )}
    </div>
  );
}

export default App;
