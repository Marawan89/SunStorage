const express = require("express");
const router = express.Router();
const pool = require("../../../db");

// query to get all device specifics
router.get("/", async (req, res) => {
  try {
    const deviceQr = req.query.qr;
    let query = `
      SELECT
         devices.id,
         devices.sn,
         devices.qr_code_string,
         devices.status,
         devicetypes.name AS device_type,
         devicewarranties.start_date AS start_date,
         devicewarranties.end_date AS end_date,
         GROUP_CONCAT(
            DISTINCT CONCAT(
               devicespecificsinputs.input_label,
               ': ',
               devicespecifics.
            VALUE

            ) SEPARATOR ', '
         ) AS specifics,
         users.name AS user_name,
         users.surname,
         users.email,
         departments.name AS department_name
      FROM
	      devices
      INNER JOIN devicetypes ON devices.device_type_id = devicetypes.id
      LEFT JOIN devicewarranties ON devices.id = devicewarranties.device_id
      LEFT JOIN devicespecifics ON devices.id = devicespecifics.device_id
      LEFT JOIN devicespecificsinputs ON devicespecifics.name = devicespecificsinputs.input_name
      LEFT JOIN deviceassignments ON devices.id = deviceassignments.device_id
      LEFT JOIN users ON deviceassignments.user_id = users.id
      LEFT JOIN departments ON users.department_id = departments.id
      ` + (deviceQr ? 'WHERE devices.id = ? or devices.qr_code_string = ?' : '') + `
      GROUP BY
         devices.id,
         devices.sn,
         devices.qr_code_string,
         devices.status,
         devicetypes.name,
         devicewarranties.start_date,
         devicewarranties.end_date,
         users.name,
         users.surname,
         users.email,
         departments.name
      ORDER BY
         assign_datetime desc
     `;

    // Execute the query
    const [rows] = await pool.query(query, deviceQr ? [deviceQr, deviceQr] : []);
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
    status,
    specifics,
  } = req.body;

  // Controllo per verificare se il serial_number è fornito
  if (!serial_number) {
    return res.status(400).json({ error: "Serial number cannot be null" });
  }

  try {
    // query to update devices table
    const [result] = await pool.query(
      "UPDATE devices SET sn = ?, qr_code_string = ?, device_type_id = ?, status = ?, start_date = ?, end_date = ? WHERE id = ?",
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
