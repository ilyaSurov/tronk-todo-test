// backend/models/Task.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

let db;

const dbPath = path.join(__dirname, "..", "database", "database.sqlite");

function initDb() {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("SQLite init error:", err);
    } else {
      console.log("Connected to SQLite DB");
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      dueDate TEXT NOT NULL,
      isCompleted BOOLEAN NOT NULL DEFAULT 0,
      createdBy TEXT NOT NULL
    )
  `);
}

function setupDatabase() {
  initDb();
}

function getAllTasks() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM tasks", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function getTaskById(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM tasks WHERE id = ?", id, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function createTask(task) {
  const { title, description, dueDate, isCompleted, createdBy } = task;
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO tasks (title, description, dueDate, isCompleted, createdBy)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, dueDate, isCompleted, createdBy],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
}

function updateTask(id, updates) {
  const keys = Object.keys(updates);
  const values = keys.map((k) => updates[k]);
  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE tasks SET ${setClause} WHERE id = ?`,
      [...values, id],
      function (err) {
        if (err) reject(err);
        else resolve({ id, changes: this.changes });
      }
    );
  });
}

function deleteTask(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM tasks WHERE id = ?", id, function (err) {
      if (err) reject(err);
      else resolve({ id, changes: this.changes });
    });
  });
}

module.exports = {
  setupDatabase,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};