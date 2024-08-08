const express = require("express");
const router = express.Router();
const pool = require("../../../db");

router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT
         devices.sn,
         devices.qr_code_string,
         devicetypes.name,
         devicewarranties.start_date,
         devicewarranties.end_date
      FROM
         devices
      INNER JOIN devicetypes ON devices.device_type_id = devicetypes.id
      LEFT JOIN devicewarranties ON devices.id = devicewarranties.device_id
    `;

    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 

module.exports = router;
