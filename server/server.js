import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Device 1 configuration
const apiKey1 = process.env.GOVEE_API_KEY1;
const device1 = process.env.DEVICE_MAC1;
const model1 = process.env.DEVICE_MODEL;

// Device 2 configuration
const apiKey2 = process.env.GOVEE_API_KEY2;
const device2 = process.env.DEVICE_MAC2;
const model2 = process.env.DEVICE_MODEL;

const goveeUrl = "https://developer-api.govee.com/v1/devices/control";

const app = express();
const port = 5001;

app.use(cors());
app.use(json());

// Route to change color on both devices
app.post("/change-color", async (req, res) => {
  const { r, g, b } = req.body;
  console.log("Received RGB:", r, g, b);

  const payload1 = {
    device: device1,
    model: model1,
    cmd: {
      name: "color",
      value: { r, g, b },
    },
  };

  const payload2 = {
    device: device2,
    model: model2,
    cmd: {
      name: "color",
      value: { r, g, b },
    },
  };

  try {
    const [response1, response2] = await Promise.all([
      fetch(goveeUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Govee-API-Key": apiKey1,
        },
        body: JSON.stringify(payload1),
      }),
      fetch(goveeUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Govee-API-Key": apiKey2,
        },
        body: JSON.stringify(payload2),
      }),
    ]);

    if (!response1.ok) {
      const errorText = await response1.text();
      throw new Error(`Device 1 error: ${errorText}`);
    }
    if (!response2.ok) {
      const errorText = await response2.text();
      throw new Error(`Device 2 error: ${errorText}`);
    }

    const data1 = await response1.json();
    const data2 = await response2.json();

    res.json({
      success: true,
      data: { device1: data1, device2: data2 },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// route to turn off both devices
app.post("/turn-off", async (req, res) => {
  const payload1 = {
    device: device1,
    model: model1,
    cmd: {
      name: "turn",
      value: "off",
    },
  };

  const payload2 = {
    device: device2,
    model: model2,
    cmd: {
      name: "turn",
      value: "off",
    },
  };

  try {
    const [response1, response2] = await Promise.all([
      fetch(goveeUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Govee-API-Key": apiKey1,
        },
        body: JSON.stringify(payload1),
      }),
      fetch(goveeUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Govee-API-Key": apiKey2,
        },
        body: JSON.stringify(payload2),
      }),
    ]);

    if (!response1.ok) {
      const errorText = await response1.text();
      throw new Error(`Device 1 error: ${errorText}`);
    }
    if (!response2.ok) {
      const errorText = await response2.text();
      throw new Error(`Device 2 error: ${errorText}`);
    }

    const data1 = await response1.json();
    const data2 = await response2.json();

    res.json({
      success: true,
      data: { device1: data1, device2: data2 },
    });
  } catch (error) {
    console.error("Turn-off error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
