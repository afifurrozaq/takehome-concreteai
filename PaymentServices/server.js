const express = require('express');
const { Pool } = require('pg');
const authenticateToken = require('./middleware/authenticateToken'); // Import the middleware

const app = express();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

app.use(express.json());

function processTransaction(transaction) {
    return new Promise((resolve, reject) => {
        console.log('Transaction processing started for:', transaction);

        // Simulate long running process
        setTimeout(() => {
            // After 30 seconds, we assume the transaction is processed successfully
            console.log('transaction processed for:', transaction);
            resolve(transaction);
        }, 30000); // 30 seconds
    });
}

// Protected route: Send money (auth required)
app.post('/send', authenticateToken, async (req, res) => {
    const { accountId, amount, toAddress } = req.body;

    try {
        let transaction = { amount: amount, currency: 'USD', accountId:accountId, toAddress:toAddress };
        processTransaction(transaction)
        .then((processedTransaction) => {
            console.log('transaction processing completed for:', processedTransaction);
            
        })
        .catch((error) => {
            console.error('transaction processing failed:', error);
        });
        const result = await pool.query(
            'INSERT INTO transactions (account_id, amount, to_address, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [accountId, amount, toAddress, 'completed']
        );
        // Update the balance of the account
        await pool.query('UPDATE payment_accounts SET balance = balance - $1 WHERE id = $2', [amount, accountId]);

        res.json(result.rows[0]);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Protected route: Withdraw money (auth required)
app.post('/withdraw', authenticateToken, async (req, res) => {
    const { accountId, amount } = req.body;

    try {
        let transaction = { amount: amount, currency: 'USD', accountId:accountId, toAddress:toAddress };
        processTransaction(transaction)
        .then((processedTransaction) => {
            console.log('transaction processing completed for:', processedTransaction);
            
        })
        .catch((error) => {
            console.error('transaction processing failed:', error);
        });
    
        const result = await pool.query(
            'INSERT INTO transactions (account_id, amount, status) VALUES ($1, $2, $3) RETURNING *',
            [accountId, -amount, 'completed']
        );

        // Update the balance of the account
        await pool.query('UPDATE payment_accounts SET balance = balance - $1 WHERE id = $2', [amount, accountId]);

        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log('Payment Manager service is running on port 3001');
});
