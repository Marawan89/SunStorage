const express = require("express");
const router = express.Router();
const pool = require("../../../db");
const writeLog = require("../../../logger");

// Create a new device assignment
router.post("/", async (req, res) => {
  const { device_id, user_id } = req.body;
  try {
    // start transition
    await pool.query("START TRANSACTION");

    const [resultSel] = await pool.query(
      "SELECT users.name, departments.name as department_name FROM users INNER JOIN departments ON departments.id = users.department_id WHERE users.id = ?",
      [user_id]
    );

    await writeLog(
      device_id,
      "DEVICE_ASSIGNMENT",
      "Assegnato a " +
        resultSel[0].name +
        " del dipartimento " +
        resultSel[0].department_name
    );

    // insert new assignment la nuova assegnazione
    const [result] = await pool.query(
      "INSERT INTO deviceassignments (device_id, user_id, assign_datetime) VALUES (?, ?, NOW())",
      [device_id, user_id]
    );

    // update devices status to assigned when assigned
    const [updateResult] = await pool.query(
      "UPDATE devices SET status = ? WHERE id = ?",
      ["assigned", device_id]
    );

    if (updateResult.affectedRows === 0) {
      // Se l'aggiornamento non ha avuto successo, fai il rollback della transazione
      await pool.query("ROLLBACK");
      return res
        .status(404)
        .json({ error: "Device not found or state update failed" });
    }

    // Conferma la transazione
    await pool.query("COMMIT");

    res.status(201).json({ id: result.insertId, device_id, user_id });
  } catch (error) {
    // Rollback della transazione in caso di errore
    await pool.query("ROLLBACK");
    res.status(400).json({ error: error.message });
  }
});

// Read all device assignments
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM deviceassignments");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read a single device assignment by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM deviceassignments WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Device assignment not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a device assignment by id
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { device_id, user_id, assign_datetime } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE deviceassignments SET device_id = ?, user_id = ?, assign_datetime = ? WHERE id = ?",
      [device_id, user_id, assign_datetime, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Device assignment not found" });
    }
    res.json({ id, device_id, user_id, assign_datetime });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// route to check if a device is assigned
router.get("/check/:device_id", async (req, res) => {
  const { device_id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM deviceassignments WHERE device_id = ?",
      [device_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
