const express = require("express");
const router = express.Router();
const pool = require("../../../db");

// Create a new device warranty
router.post("/", async (req, res) => {
  const { device_id, start_date, end_date } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO devicewarranties (device_id, start_date, end_date) VALUES (?, ?, ?)",
      [device_id, start_date, end_date]
    );
    res
      .status(201)
      .json({ id: result.insertId, device_id, start_date, end_date });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read all device warranties
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM devicewarranties");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read a single device warranty by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM devicewarranties WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Device warranty not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a device warranty by id
router.patch("/:id", async (req, res) => {
const { id } = req.params;
const { device_id, start_date, end_date } = req.body;
try {
   const [result] = await pool.query(
      "UPDATE devicewarranties SET device_id = ?, start_date = ?, end_date = ? WHERE id = ?",
      [device_id, start_date, end_date, id]
   );
   if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Device warranty not found" });
   }
   await writeLog(id, "DEVICE_MODIFICATION", "Modifica della garanzia del dispositivo");
   res.json({ id, device_id, start_date, end_date });
} catch (error) {
   res.status(400).json({ error: error.message });
}
});


// Delete a device warranty by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      "DELETE FROM devicewarranties WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Device warranty not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
