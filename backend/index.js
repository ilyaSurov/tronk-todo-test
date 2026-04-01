// backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const tasksRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");
const { setupDatabase } = require("./models/Task");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS под Nuxt (пусть фронт сам пишет PORT)
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8080"],
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());

// Подготовка SQLite
setupDatabase();

app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Backend API: http://localhost:${PORT}/api`);
});

module.exports = app;