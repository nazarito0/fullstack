const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "database",
  database: process.env.DB_NAME || "postgres",
  password: process.env.DB_PASS || "password",
  port: 5432,
});

// ФУНКЦІЯ ІНІЦІАЛІЗАЦІЇ ТАБЛИЦЬ
const initDB = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("Таблиця users готова або вже існувала");
  } catch (err) {
    console.error("Помилка при створенні таблиці:", err);
  }
};

// Запускаємо ініціалізацію
initDB();

app.get("/", (req, res) => {
  res.send("Express Backend");
});

app.get("/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0] });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST user
app.post("/users", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send("Name is required");
    }
    const result = await pool.query(
      "INSERT INTO users (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
