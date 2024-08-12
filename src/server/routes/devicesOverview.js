const express = require("express");
const router = express.Router();
const pool = require("../../../db");

// query to get all device specifics
router.get("/", async (req, res) => {
  try {
    const deviceId = req.query.id;
    let query = `
      SELECT
            devices.id,
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
    `;

    // where there is an id to pass add to the query WHERE
    if (deviceId) {
      query += ` WHERE devices.id = ?`;
    }

    query += ` GROUP BY devices.id, devices.sn, devices.qr_code_string, devicetypes.name, devicewarranties.start_date, devicewarranties.end_date;`;

    const [rows] = await pool.query(query, [deviceId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// route to update a device by id
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    serial_number,
    qr_code,
    device_type,
    warranty_start,
    warranty_end,
    specifics,
  } = req.body;

  // Controllo per verificare se il serial_number è fornito
  if (!serial_number) {
    return res.status(400).json({ error: "Serial number cannot be null" });
  }

  try {
    // query to update devices table
    const [result] = await pool.query(
      "UPDATE devices SET sn = ?, qr_code_string = ?, device_type_id = ?, start_date = ?, end_date = ? WHERE id = ?",
      [serial_number, qr_code, device_type, warranty_start, warranty_end, id]
    );

    // if there is no updated rows, the device does not exist
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Device not found" });
    }

    // updates the specifics
    if (specifics) {
      await pool.query("DELETE FROM devicespecifics WHERE device_id = ?", [id]);
      const specificsArray = specifics.split(", ").map((spec) => {
        const [name, value] = spec.split(": ");
        return { name, value };
      });

      const insertSpecificsQuery = specificsArray.map(({ name, value }) => {
        return pool.query(
          "INSERT INTO devicespecifics (device_id, name, value) VALUES (?, ?, ?)",
          [id, name, value]
        );
      });
      await Promise.all(insertSpecificsQuery);
    }

    res.json({
      id,
      serial_number,
      qr_code,
      device_type,
      warranty_start,
      warranty_end,
      specifics,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
