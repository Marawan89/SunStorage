const express = require('express');
const router = express.Router();
const pool = require('../../../db');

// route to create a new user
router.post('/', async (req, res) => {
   const { department_id, name, surname, email } = req.body;
   try { 
     // Insert the new user
     const [result] = await pool.query('INSERT INTO users (department_id, name, surname, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [department_id, name, surname, email]);
     res.status(201).json({ id: result.insertId, department_id, name, surname, email });
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
 });

// route to read all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// route to read a single user by id
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

// route to update a user by id
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { department_id, name, surname, email } = req.body;
  try {
    const [result] = await pool.query('UPDATE users SET department_id = ?, name = ?, surname = ?, email = ?, password = ?, is_admin = ?, insert_datetime = ?, update_datetime = ? WHERE id = ?', [department_id, name, surname, email, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id, department_id, name, surname, email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// route to delete a user by id
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
