const express = require('express');
const router = express.Router();
const pool = require('../../../db');

// Create a new device specific
router.post('/', async (req, res) => {
  const { device_id, description, value } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO devicespecifics (device_id, description, value) VALUES (?, ?, ?)', [device_id, description, value]);
    res.status(201).json({ id: result.insertId, device_id, description, value });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read all device specifics
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM devicespecifics');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read a single device specific by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM devicespecifics WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Device specific not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a device specific by id
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { device_id, description, value } = req.body;
  try {
    const [result] = await pool.query('UPDATE devicespecifics SET device_id = ?, description = ?, value = ? WHERE id = ?', [device_id, description, value, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Device specific not found' });
    }
    res.json({ id, device_id, description, value });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a device specific by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM devicespecifics WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Device specific not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
