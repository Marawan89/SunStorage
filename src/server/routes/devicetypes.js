const express = require("express");
const router = express.Router();
const pool = require("../../../db");
const writeLog = require("../../../logger");


// route to create a new device type
router.post("/", async (req, res) => {
  const { name, inputs } = req.body;

  // Check if inputs is an array and has at least one input
  if (!Array.isArray(inputs) || inputs.length === 0) {
    return res.status(400).json({
      error: "Devi aggiungere almeno un input per il tipo di device.",
    });
  }

  try {
    // Check if the devicetype already exists
    const [existingDeviceType] = await pool.query(
      "SELECT * FROM devicetypes WHERE name = ?",
      [name]
    );
    if (existingDeviceType.length > 0) {
      return res
        .status(400)
        .json({ error: "Questo tipo di device esiste già" });
    }

    // Insert the new devicetype
    const [result] = await pool.query(
      "INSERT INTO devicetypes (name) VALUES (?)",
      [name]
    );

    const deviceTypeId = result.insertId;

    // Insert associated inputs
    const inputPromises = inputs.map((input) => {
      return pool.query(
        "INSERT INTO devicespecificsinputs (device_type_id, input_name, input_label, input_type, input_values, input_placeholder) VALUES (?, ?, ?, ?, ?, ?)",
        [
          deviceTypeId,
          input.name,
          input.label,
          input.type,
          JSON.stringify(input.values),
          input.placeholder,
        ]
      );
    });

    await Promise.all(inputPromises);

    res
      .status(200)
      .json({ message: "Device type created successfully", id: deviceTypeId });
  } catch (error) {
    console.error("Error creating device type:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the device type" });
  }
});

// route to read all device types
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM devicetypes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// route to read a single device type by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [deviceTypeRows] = await pool.query(
      "SELECT * FROM devicetypes WHERE id = ?",
      [id]
    );
    if (deviceTypeRows.length === 0) {
      return res.status(404).json({ error: "Device type not found" });
    }

    const deviceType = deviceTypeRows[0];

    // Get the associated inputs
    const [inputRows] = await pool.query(
      "SELECT * FROM devicespecificsinputs WHERE device_type_id = ?",
      [id]
    );

    deviceType.inputs = inputRows.map((input) => ({
      name: input.input_name,
      label: input.input_label,
      type: input.input_type,
      values: JSON.parse(input.input_values), // Parse the JSON string back to an array
      placeholder: input.input_placeholder,
    }));

    res.json(deviceType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// route to update a device type by id, including specific inputs
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, inputs } = req.body;

  try {
    // Update the device type name
    const [result] = await pool.query(
      "UPDATE devicetypes SET name = ? WHERE id = ?",
      [name, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Device type not found" });
    }

    // Delete existing inputs for the device type
    await pool.query(
      "DELETE FROM devicespecificsinputs WHERE device_type_id = ?",
      [id]
    );

    // Insert updated inputs
    for (const input of inputs) {
      await pool.query(
        "INSERT INTO devicespecificsinputs (device_type_id, input_name, input_label, input_type, input_values, input_placeholder) VALUES (?, ?, ?, ?, ?, ?)",
        [
          id,
          input.name,
          input.label,
          input.type,
          JSON.stringify(input.values),
          input.placeholder,
        ]
      );
    }

    await writeLog(
      id,
      "DEVICE_EDITED",
      `Modifica del tipo di dispositivo: ${name}`
    );
    res.json({ message: "Device type updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// route to delete a device type by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM devicetypes WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Device type not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// route to check if a device type has assigned devices
router.get("/:id/devices", async (req, res) => {
  const { id } = req.params;
  try {
    // Controllo se ci sono dispositivi associati a questo tipo di dispositivo
    const [assignedDevices] = await pool.query(
      "SELECT * FROM devices WHERE device_type_id = ?",
      [id]
    );

    // Restituisci i dispositivi assegnati
    res.json(assignedDevices);
  } catch (error) {
    console.error(
      "Errore durante il controllo dei dispositivi assegnati:",
      error
    );
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
