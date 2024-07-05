const express = require('express');
const router = express.Router();
const pool = require('../../../db');

// Create a new user
router.post('/', async (req, res) => {
  const { department_id, first_name, last_name, email, hashed_password, is_admin, insert_datetime, update_datetime } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO users (department_id, first_name, last_name, email, hashed_password, is_admin, insert_datetime, update_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [department_id, first_name, last_name, email, hashed_password, is_admin, insert_datetime, update_datetime]);
    res.status(201).json({ id: result.insertId, department_id, first_name, last_name, email, hashed_password, is_admin, insert_datetime, update_datetime });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read a single user by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user by id
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { department_id, first_name, last_name, email, hashed_password, is_admin, insert_datetime, update_datetime } = req.body;
  try {
    const [result] = await pool.query('UPDATE users SET department_id = ?, first_name = ?, last_name = ?, email = ?, hashed_password = ?, is_admin = ?, insert_datetime = ?, update_datetime = ? WHERE id = ?', [department_id, first_name, last_name, email, hashed_password, is_admin, insert_datetime, update_datetime, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id, department_id, first_name, last_name, email, hashed_password, is_admin, insert_datetime, update_datetime });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a user by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
