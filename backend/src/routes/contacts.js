const express = require('express');
const router = express.Router();
const pool = require('../db'); // Uses the shared database connection
const auth = require('../middleware/authMiddleware'); // Uses the shared authentication middleware

// GET all contacts (with Search and Filter) 
router.get('/', auth, async (req, res) => {
  const { search } = req.query;
  try {
    let query = 'SELECT * FROM contacts WHERE user_id = $1';
    let params = [req.user.id];

    if (search) {
      query += ' AND (name ILIKE $2 OR email ILIKE $2 OR tags ILIKE $2)';
      params.push(`%${search}%`);
    }

    const contacts = await pool.query(query + ' ORDER BY name ASC', params);
    res.json(contacts.rows);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// POST a new contact (Moved from server.js)
router.post('/', auth, async (req, res) => {
    const { name, phone, email, company, notes, tags } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO contacts (user_id, name, phone, email, company, notes, tags) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [req.user.id, name, phone, email, company, notes, tags]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: "Invalid data" });
    }
});

// UPDATE contact 
router.put('/:id', auth, async (req, res) => {
  const { name, phone, email, company, notes, tags, is_favorite } = req.body;
  try {
    const updated = await pool.query(
      `UPDATE contacts SET name=$1, phone=$2, email=$3, company=$4, notes=$5, tags=$6, is_favorite=$7 
       WHERE id=$8 AND user_id=$9 RETURNING *`,
      [name, phone, email, company, notes, tags, is_favorite, req.params.id, req.user.id]
    );
    
    if (updated.rows.length === 0) return res.status(404).json({ error: "Contact not found" });
    res.json(updated.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Data validation failed" });
  }
});

// DELETE contact 
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM contacts WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    res.json({ message: "Contact deleted" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;