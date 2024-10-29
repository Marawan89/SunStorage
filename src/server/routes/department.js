const express = require("express");
const router = express.Router();
const pool = require("../../../db");

// route to create a new department
router.post("/", async (req, res) => {
  const { name } = req.body;
  console.log(req.body);
  try {
    // Check if the department already exists
    const [existingDepartment] = await pool.query(
      "SELECT * FROM departments WHERE name = ?",
      [name]
    );
    if (existingDepartment.length > 0) {
      return res.status(400).json({ error: "Questo Department esiste già" });
    }

    // Insert the new department
    const [result] = await pool.query(
      "INSERT INTO departments (name) VALUES (?)",
      [name]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// route to read all departments
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM departments");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// route to read all users of a department
router.get("/:id/users", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE department_id = ?",
      [id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// route to read a single department by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM departments WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Department not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// route to update a department by id
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE departments SET name = ? WHERE id = ?",
      [name, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Department not found" });
    }
    res.json({ id, name });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// route to delete a department by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // get users of the department
    const [users] = await pool.query(
      "SELECT id FROM users WHERE department_id = ?",
      [id]
    );

    if (users.length > 0) {
      // Check if any users have assigned devices
      const userIds = users.map((user) => user.id);
      const [assignedDevices] = await pool.query(
        "SELECT DISTINCT device_id FROM deviceassignments WHERE user_id IN (?)",
        [userIds]
      );

      if (assignedDevices.length > 0) {
        return res.status(400).json({
          error:
            "Questo reparto contiene almeno una persona a cui è assegnato un dispositivo, quindi non può essere cancellato.",
        });
      }

      // If no devices are assigned, you can proceed to delete users
      await pool.query("DELETE FROM users WHERE department_id = ?", [id]);
    }

    // delete the department
    const [deleteResult] = await pool.query(
      "DELETE FROM departments WHERE id = ?",
      [id]
    );
    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
