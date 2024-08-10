const express = require("express");
const router = express.Router();
const pool = require("../../../db");

// query to get all device specifics
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT
         devices.sn,
         devices.qr_code_string,
         devicetypes.name AS device_type,
         devicewarranties.start_date AS start_date,
         devicewarranties.end_date AS end_date,
         GROUP_CONCAT(CONCAT(devicespecifics.name, ': ', devicespecifics.value) SEPARATOR ', ') AS specifics
      FROM
         devices
      INNER JOIN devicetypes ON devices.device_type_id = devicetypes.id
      LEFT JOIN devicewarranties ON devices.id = devicewarranties.device_id
      LEFT JOIN devicespecifics ON devices.id = devicespecifics.device_id
      GROUP BY
         devices.sn, devices.qr_code_string, devicetypes.name, devicewarranties.start_date, devicewarranties.end_date;

    `;

    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
