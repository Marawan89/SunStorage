const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Create a new device log
router.post('/', async (req, res) => {
  const { device_id, log_datetime, log_content } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO devicelogs (device_id, log_datetime, log_content) VALUES (?, ?, ?)', [device_id, log_datetime, log_content]);
    res.status(201).json({ id: result.insertId, device_id, log_datetime, log_content });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read all device logs
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM devicelogs');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read a single device log by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM devicelogs WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Device log not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a device log by id
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { device_id, log_datetime, log_content } = req.body;
  try {
    const [result] = await pool.query('UPDATE devicelogs SET device_id = ?, log_datetime = ?, log_content = ? WHERE id = ?', [device_id, log_datetime, log_content, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Device log not found' });
    }
    res.json({ id, device_id, log_datetime, log_content });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a device log by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM devicelogs WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Device log not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;