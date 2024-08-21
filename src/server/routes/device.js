const express = require("express");
const router = express.Router();
const pool = require("../../../db");
const writeLog = require('../../../logger');

// route to create a new device
router.post("/", async (req, res) => {
  const { device_type_id, sn, qr_code_string } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO devices (device_type_id, sn, qr_code_string) VALUES (?, ?, ?)",
      [device_type_id, sn, qr_code_string]
    );
    await writeLog(result.insertId, 'DEVICE', 'Device creato');
    res
      .status(201)
      .json({ id: result.insertId, device_type_id, sn, qr_code_string });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// route to read all devices
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM devices");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// route to read a single device by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM devices WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// route to read a single device specifics
router.get("/:id/devicespecifics", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM devicespecifics WHERE device_id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// route to read a single device devicewarranties
router.get("/:id/devicewarranty", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM devicewarranties WHERE device_id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// route to update a device by id
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { device_type_id, sn, qr_code_string } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE devices SET device_type_id = ?, sn = ?, qr_code_string = ? WHERE id = ?",
      [device_type_id, sn, qr_code_string, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Device not found" });
    }
    res.json({ id, device_type_id, sn, qr_code_string });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// route to delete a device by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM devices WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Device not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update the status of a device
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE devices SET status = ? WHERE id = ?",
      [status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Device not found" });
    }
    await writeLog(id, 'DEVICE', 'Passato in status: '+ status);
    res.status(200).json({ id, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
