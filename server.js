const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

// Middleware untuk parsing body dari request
app.use(express.json());

// Koneksi ke database MySQL
async function connectDB() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        return connection;
    } catch (error) {
        console.error('Error connecting to database: ', error);
        throw error;
    }
}

// Endpoint untuk mendapatkan semua pengguna
app.get('/api/users', async (req, res) => {
    try {
        const connection = await connectDB();
        const [rows] = await connection.query(`SELECT id, username, email FROM users WHERE email = 'Blair.Parisian94@gmail.com'`);
        connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users: ', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
