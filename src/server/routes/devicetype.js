const express = require('express');
const router = express.Router();
const pool = require('../../../db');

// Create a new device type
router.post('/', async (req, res) => {
  const { description, model } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO devicetypes (description, model) VALUES (?, ?)', [description, model]);
    res.status(201).json({ id: result.insertId, description, model });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read all device types
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM devicetypes');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read a single device type by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM devicetypes WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Device type not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a device type by id
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { description, model } = req.body;
  try {
    const [result] = await pool.query('UPDATE devicetypes SET description = ?, model = ? WHERE id = ?', [description, model, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Device type not found' });
    }
    res.json({ id, description, model });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a device type by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM devicetypes WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Device type not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
