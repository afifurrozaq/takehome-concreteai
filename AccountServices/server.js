const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const authenticateToken = require('./middleware/authenticateToken'); // Import the middleware

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

// Register a new user (no auth required)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *',
            [username, passwordHash]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login user (no auth required)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret');
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Protected route: Create payment account (auth required)
app.post('/accounts', authenticateToken, async (req, res) => {
    const { accountType } = req.body;
    const userId = req.user.userId; // req.user is populated by authenticateToken

    try {
        const result = await pool.query(
            'INSERT INTO payment_accounts (user_id, account_type) VALUES ($1, $2) RETURNING *',
            [userId, accountType]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Account Manager service is running on port 3000');
});
