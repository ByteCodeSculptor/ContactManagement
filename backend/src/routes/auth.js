const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Imports the shared database connection

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // 1. Authorized Domains List
  const authorizedDomains = ['@gmail.com', '@outlook.com', '@yahoo.com'];
  const isAuthorized = authorizedDomains.some(domain => email.toLowerCase().endsWith(domain));

  if (!isAuthorized) {
    return res.status(400).json({ 
      error: "Unauthorized Email", 
      message: "Registration is only permitted for @gmail.com, @outlook.com, or @yahoo.com addresses." 
    });
  }

  // 2. Password Validation (At least 8 chars, 1 number, 1 special character)
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      error: "Weak Password", 
      message: "Password must be at least 8 characters long and include at least one number and one special character." 
    });
  }

  try {
    // 3. Hash and Save
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error("Registration Error:", err);
    if (err.code === '23505') {
        return res.status(400).json({ error: "User already exists" });
    }
    res.status(500).json({ error: "Server error during registration" });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists in the database
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
        return res.status(400).json({ error: "Invalid Credentials" });
    }

    // Verify the password using bcrypt
    const validPass = await bcrypt.compare(password, user.rows[0].password);
    if (!validPass) {
        return res.status(400).json({ error: "Invalid Credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
        { id: user.rows[0].id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );

    res.json({ 
        token, 
        user: { id: user.rows[0].id, email: user.rows[0].email } 
    });
  } catch (err) {
    console.error("Login Error Detail:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;