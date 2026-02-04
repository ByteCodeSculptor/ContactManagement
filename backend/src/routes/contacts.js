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

// POST - Create Contact
router.post('/', auth, async (req, res) => {
  const { name, phone, email, company, tags, notes } = req.body;

  // Phone Validation: 10 digits, starts with 1, 6, 7, 8, 9, or 0
  const phoneRegex = /^[167890]\d{9}$/;
  if (phone && !phoneRegex.test(phone)) {
    return res.status(400).json({ 
      error: "Invalid Phone Number", 
      message: "Phone number must be 10 digits and start with 1, 6, 7, 8, 9, or 0." 
    });
  }

  try {
    const newContact = await pool.query(
      'INSERT INTO contacts (user_id, name, phone, email, company, tags, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, name, phone, email, company, tags, notes]
    );
    res.json(newContact.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT - Update Contact
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, company, tags, notes, is_favorite } = req.body;

  // Phone Validation
  const phoneRegex = /^[167890]\d{9}$/;
  if (phone && !phoneRegex.test(phone)) {
    return res.status(400).json({ 
      error: "Invalid Phone Number", 
      message: "Phone number must be 10 digits and start with 1, 6, 7, 8, 9, or 0." 
    });
  }

  try {
    const updatedContact = await pool.query(
      'UPDATE contacts SET name=$1, phone=$2, email=$3, company=$4, tags=$5, notes=$6, is_favorite=$7 WHERE id=$8 AND user_id=$9 RETURNING *',
      [name, phone, email, company, tags, notes, is_favorite, id, req.user.id]
    );
    res.json(updatedContact.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
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
