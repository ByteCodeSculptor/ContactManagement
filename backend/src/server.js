const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');

const app = express(); // Initialized before route usage

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Path: /api/auth/register or login
app.use('/api/contacts', contactRoutes); // Path: /api/contacts

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));