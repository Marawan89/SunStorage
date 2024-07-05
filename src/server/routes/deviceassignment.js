const express = require('express');
const router = express.Router();
const pool = require('../../../db');

// Create a new device assignment
router.post('/', async (req, res) => {
  const { device_id, user_id, assign_datetime } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO deviceassignments (device_id, user_id, assign_datetime) VALUES (?, ?, ?)', [device_id, user_id, assign_datetime]);
    res.status(201).json({ id: result.insertId, device_id, user_id, assign_datetime });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read all device assignments
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM deviceassignments');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read a single device assignment by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM deviceassignments WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Device assignment not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a device assignment by id
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { device_id, user_id, assign_datetime } = req.body;
  try {
    const [result] = await pool.query('UPDATE deviceassignments SET device_id = ?, user_id = ?, assign_datetime = ? WHERE id = ?', [device_id, user_id, assign_datetime, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Device assignment not found' });
    }
    res.json({ id, device_id, user_id, assign_datetime });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a device assignment by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM deviceassignments WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Device assignment not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;