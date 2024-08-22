const express = require("express");
const router = express.Router();
const pool = require("../../../db");
const writeLog = require("../../../logger");

// route to create a new device
router.post("/", async (req, res) => {
  const { device_type_id, sn, qr_code_string } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO devices (device_type_id, sn, qr_code_string) VALUES (?, ?, ?)",
      [device_type_id, sn, qr_code_string]
    );
    await writeLog(result.insertId, "DEVICE_CREATION", "Device creato");
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

router.get("/details", async (req, res) => {
   var devices = []; 
   try {
     const [rowsDevices] = await pool.query(
       "SELECT devices.*, devicetypes.name as device_type_name FROM devices INNER JOIN devicetypes ON devicetypes.id = devices.device_type_id");
     if (rowsDevices.affectedRows === 0) {
       return res.status(404).json({ error: "Devices not found" });
     }
     
     for (var i=0; i<rowsDevices.length; i++){
      var rowDevice = rowsDevices[i];
      var device = {
         ...rowDevice,
         devicespecifics: null,
         devicewarranty: null,
         devicelogs: null,
         deviceassignments: null,
      };
 
      const [rowsSpecifics] = await pool.query(
         "SELECT devicespecificsinputs.input_name as name, devicespecifics.value, devicespecificsinputs.input_label FROM devicespecifics INNER JOIN devicespecificsinputs ON devicespecifics.devicespecific_input_id = devicespecificsinputs.id WHERE device_id = ?",
         [rowDevice.id]
      );
      if (rowsSpecifics.length !== 0) {
         device.devicespecifics = rowsSpecifics;
      }
   
      const [rowsWarranties] = await pool.query(
         "SELECT * FROM devicewarranties WHERE device_id = ?",
         [rowDevice.id]
      );
      if (rowsWarranties.length !== 0) {
         device.devicewarranty = rowsWarranties[0];
      }
   
      const [rowsLogs] = await pool.query(
         "SELECT * FROM devicelogs WHERE device_id = ?",
         [rowDevice.id]
      );
      if (rowsLogs.length !== 0) {
         device.devicelogs = rowsLogs;
      }
   
      const [rowsAssignments] = await pool.query(
         "SELECT deviceassignments.*, users.*, departments.name as department_name FROM deviceassignments INNER JOIN users ON deviceassignments.user_id = users.id INNER JOIN departments ON departments.id = users.department_id WHERE device_id = ? ORDER BY deviceassignments.assign_datetime DESC",
         [rowDevice.id]
      );
      if (rowsAssignments.length !== 0) {
         device.deviceassignments = rowsAssignments;
      }

      devices.push(device);
     }
     
 
     res.json(devices);

   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 });

// route to read a single device by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT devices.*, devicetypes.name as device_type_name FROM devices INNER JOIN devicetypes ON devicetypes.id = devices.device_type_id WHERE devices.id = ?",
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

// route to read a single device specifics
router.get("/:id/devicespecifics", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT devicespecificsinputs.input_name as name, devicespecifics.value, devicespecificsinputs.input_label FROM devicespecifics INNER JOIN devicespecificsinputs ON devicespecifics.devicespecific_input_id = devicespecificsinputs.id WHERE device_id = ?",
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

// route to read a single device specifics
router.get("/:id/logs", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM devicelogs WHERE device_id = ?",
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

// route to read a single device assignements
router.get("/:id/assignments", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT deviceassignments.*, users.*, departments.name as department_name FROM deviceassignments INNER JOIN users ON deviceassignments.user_id = users.id INNER JOIN departments ON departments.id = users.department_id WHERE device_id = ? ORDER BY deviceassignments.assign_datetime DESC",
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

router.get("/:id/details", async (req, res) => {
  const { id } = req.params;
  var device = {
    device: null,
    devicespecifics: null,
    devicewarranty: null,
    devicelogs: null,
    deviceassignments: null,
  };
  try {
    const [rowsDevice] = await pool.query(
      "SELECT devices.*, devicetypes.name as device_type_name FROM devices INNER JOIN devicetypes ON devicetypes.id = devices.device_type_id WHERE devices.id = ?",
      [id]
    );
    if (rowsDevice.affectedRows === 0) {
      return res.status(404).json({ error: "Device not found" });
    }

    device = rowsDevice[0];

    const [rowsSpecifics] = await pool.query(
      "SELECT devicespecificsinputs.input_name as name, devicespecifics.value, devicespecificsinputs.input_label FROM devicespecifics INNER JOIN devicespecificsinputs ON devicespecifics.devicespecific_input_id = devicespecificsinputs.id WHERE device_id = ?",
      [id]
    );
    if (rowsSpecifics.length !== 0) {
      device.devicespecifics = rowsSpecifics;
    }

    const [rowsWarranties] = await pool.query(
      "SELECT * FROM devicewarranties WHERE device_id = ?",
      [id]
    );
    if (rowsWarranties.length !== 0) {
      device.devicewarranty = rowsWarranties[0];
    }

    const [rowsLogs] = await pool.query(
      "SELECT * FROM devicelogs WHERE device_id = ?",
      [id]
    );
    if (rowsLogs.length !== 0) {
      device.devicelogs = rowsLogs;
    }

    const [rowsAssignments] = await pool.query(
      "SELECT deviceassignments.*, users.*, departments.name as department_name FROM deviceassignments INNER JOIN users ON deviceassignments.user_id = users.id INNER JOIN departments ON departments.id = users.department_id WHERE device_id = ? ORDER BY deviceassignments.assign_datetime DESC",
      [id]
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
    await writeLog(id, "DEVICE_STATUS", "Passato in status: " + status);
    res.status(200).json({ id, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
