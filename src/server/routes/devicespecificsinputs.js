const express = require("express");
const router = express.Router();
const pool = require('../../../db');

// get all inputs for a specifics device type 
router.get("/:device_type_id", async (req, res) => {
  const { device_type_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT input_name FROM devicespecificsinputs WHERE device_type_id = ?",
      [device_type_id]
    );
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// add a new input for a specific device type
router.post("/", async (req, res) => {
  const { device_type_id, input_name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO devicespecificsinputs (device_type_id, input_name) VALUES (?, ?)",
      [device_type_id, input_name]
    );
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
