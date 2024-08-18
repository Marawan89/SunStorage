const express = require("express");
const router = express.Router();
const pool = require("../../../db");

// Rotta per ottenere la panoramica dei dispositivi assegnati
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT
         users.name AS user_name,
         users.surname,
         users.email,
         departments.name AS department_name,
         devices.sn
      FROM
         deviceassignments
      JOIN users ON deviceassignments.user_id = users.id
      JOIN departments ON users.department_id = departments.id
      JOIN devices ON deviceassignments.device_id = devices.id;
    `;

    const [results] = await pool.query(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching assigned devices overview:", error);
    res.status(500).send("Server error");
  }
}); // modifcato il nome di department name e user name perche avevano entrambi il campo name e creavano conflitto

module.exports = router;
