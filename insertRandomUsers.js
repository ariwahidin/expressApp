const faker = require('faker');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Konfigurasi database dari file .env
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

// Fungsi untuk menghubungkan ke database
async function connectDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.error('Error connecting to database: ', error);
        throw error;
    }
}

// Fungsi untuk memasukkan 1000 data pengguna acak
async function insertRandomUsers() {
    const connection = await connectDB();
    const insertQuery = 'INSERT INTO users (username, email, password) VALUES ?';

    // Array untuk menyimpan data yang akan dimasukkan
    let usersData = [];

    // Generate 1000 data pengguna acak
    for (let i = 0; i < 100000; i++) {
        const name = faker.name.findName(); // Nama acak
        const email = faker.internet.email(); // Email acak
        const password = await bcrypt.hash(faker.internet.password(), 10); // Password acak, di-hash dengan bcrypt

        usersData.push([name, email, password]);
        try {
            // Eksekusi query untuk memasukkan data pengguna
            const result = await connection.query(insertQuery, [usersData]);
            console.log(`Successfully inserted ${i} random users.`);
            // connection.end(); // Tutup koneksi setelah selesai
        } catch (error) {
            console.error('Error inserting users: ', error);
            // connection.end(); // Tutup koneksi jika terjadi kesalahan
        }
    }


}

// Panggil fungsi untuk memasukkan data pengguna
insertRandomUsers();
