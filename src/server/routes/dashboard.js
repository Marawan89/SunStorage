const express = require("express");
const router = express.Router();
const pool = require("../../../db");

// Route per contare tutti i devices under repair
router.get("/totalUnderRepair", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as totalUnderRepair FROM devices where status = 'under repair'"
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route per contare i device per ogni tipo
router.get("/countByType", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT devicetypes.name as deviceType, COUNT(devices.id) as count FROM devices JOIN devicetypes ON devices.device_type_id = devicetypes.id GROUP BY devicetypes.name"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route per contare il numero totale di device types
router.get("/totalDeviceTypes", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as totalDeviceTypes FROM devicetypes"
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route per contare i devices con garanzia scaduta e stato non dismissed
router.get("/expiredWarrantyDevices", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as expiredWarrantyDevices FROM devicewarranties JOIN devices ON devices.id = devicewarranties.device_id WHERE devicewarranties.end_date < CURRENT_DATE AND devices.status =! 'dismissed';"
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route per contare i devices con garanzia valida che possono essere assegnati a qualcuno
router.get("/validWarrantyDevices", async (req, res) => {
   try {
     const [rows] = await pool.query(
       "SELECT COUNT(*) AS validWarrantyDevices FROM devicewarranties JOIN devices ON devices.id = devicewarranties.device_id WHERE devicewarranties.end_date > CURRENT_DATE AND devices. STATUS = 'free';"
     );
     res.json(rows[0]);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 });

module.exports = router;
