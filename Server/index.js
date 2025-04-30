const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your_jwt_secret';

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 25060, 
    ssl: {
      rejectUnauthorized: false
    }
  });

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'Lauren' && password === 'Lauren') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

// Middleware to protect routes
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get('/api/summary-data', verifyToken, (req, res) => {
  db.query('SELECT country, willing_to_trust_percent, willing_to_accept_percent FROM ai_trust_acceptance', (err, results) => {
    if (err) return res.status(500).json({ error: err });

     const formatted = results.map(row => ({
      country: row.country,
      trust: row.willing_to_trust_percent,
      accept: row.willing_to_accept_percent
    }));

    res.json(formatted);
  });
});



app.get('/api/report-data', verifyToken, (req, res) => {
  db.query('SELECT year, market_size_billion FROM ai_market_size ORDER BY year ASC', (err, results) => {
    if (err) {
      console.error('SQL ERROR:', err);
      return res.status(500).json({ error: err.message });
    }

    const formatted = results.map(row => ({
      label: row.year.toString(),
      value: parseFloat(row.market_size_billion)
    }));

    res.json(formatted);
  });
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

