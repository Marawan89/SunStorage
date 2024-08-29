const express = require("express");
const router = express.Router();
const pool = require("../../../db");

// Route per ottenere i dettagli di un dispositivo specifico tramite codice QR
router.get("/qr/:qrCode", async (req, res) => {
   const qrCode = req.params.qrCode;
 
   try {
     // Query per ottenere i dettagli di base del dispositivo
     let query = `
       SELECT
         devices.id,
         devices.sn,
         devices.qr_code_string,
         devices.status,
         devicetypes.name AS device_type_name,
         devicewarranties.start_date AS start_date,
         devicewarranties.end_date AS end_date
       FROM
         devices
       INNER JOIN
         devicetypes ON devices.device_type_id = devicetypes.id
       LEFT JOIN
         devicewarranties ON devices.id = devicewarranties.device_id
       WHERE
         devices.qr_code_string = ?
     `;
 
     const [rowsDevices] = await pool.query(query, [qrCode]);
 
     if (rowsDevices.length === 0) {
       return res.status(404).json({ error: "Device not found" });
     }
 
     const device = {
       ...rowsDevices[0],
       devicespecifics: null,
       devicewarranty: null,
       devicelogs: null,
       deviceassignments: null,
     };
 
     // Ottieni i dettagli specifici del dispositivo
     const [rowsSpecifics] = await pool.query(
       "SELECT devicespecificsinputs.input_name as name, devicespecifics.value, devicespecificsinputs.input_label FROM devicespecifics INNER JOIN devicespecificsinputs ON devicespecifics.devicespecific_input_id = devicespecificsinputs.id WHERE device_id = ?",
       [device.id]
     );
     if (rowsSpecifics.length !== 0) {
       device.devicespecifics = rowsSpecifics;
     }
 
     // Ottieni la garanzia del dispositivo
     const [rowsWarranties] = await pool.query(
       "SELECT * FROM devicewarranties WHERE device_id = ?",
       [device.id]
     );
     if (rowsWarranties.length !== 0) {
       device.devicewarranty = rowsWarranties[0];
     }
 
     // Ottieni i log del dispositivo
     const [rowsLogs] = await pool.query(
       "SELECT * FROM devicelogs WHERE device_id = ?",
       [device.id]
     );
     if (rowsLogs.length !== 0) {
       device.devicelogs = rowsLogs;
     }
 
     // Ottieni gli assignment del dispositivo
     const [rowsAssignments] = await pool.query(
       `SELECT 
          deviceassignments.*, 
          users.*, 
          departments.name as department_name 
        FROM 
          deviceassignments 
        INNER JOIN 
          users ON deviceassignments.user_id = users.id 
        INNER JOIN 
          departments ON departments.id = users.department_id 
        WHERE 
          device_id = ? 
        ORDER BY 
          deviceassignments.assign_datetime DESC`,
       [device.id]
     );
     if (rowsAssignments.length !== 0) {
       device.deviceassignments = rowsAssignments;
     }
 
     res.json(device);
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
