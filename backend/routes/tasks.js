// backend/routes/tasks.js
const express = require("express");
const { jwtAuth } = require("../middleware/jwtAuth");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../models/Task");
const { validateTaskDto } = require("../middleware/validation");

// DTO: фронт ожидает:
// { id, title, description, dueDate, isCompleted, createdBy }

router.get("/", jwtAuth, async (req, res) => {
  try {
    const tasks = await getAllTasks();
    // Опционально: сортировка по дате/статусу
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", jwtAuth, async (req, res) => {
  const body = req.body;
  const validation = validateTaskDto(body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const created = await createTask({
      title: body.title,
      description: body.description,
      dueDate: validation.normalized.dueDate,
      isCompleted: body.isCompleted || false,
      createdBy: body.createdBy || "anonymous",
    });
    res.status(201).json({
      ...body,
      dueDate: validation.normalized.dueDate,
      id: created.id,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", jwtAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const body = req.body;
  const user = req.user;
  const validation = validateTaskDto(body, { requireCreatedBy: false });
  
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const task = await getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.createdBy !== user.email && user.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden: only creator or admin can edit this task",
      });
    }

    await updateTask(id, {
      title: body.title,
      description: body.description,
      dueDate: validation.normalized.dueDate,
      isCompleted: body.isCompleted,
    });

    res.status(200).json({
      ...body,
      dueDate: validation.normalized.dueDate,
      createdBy: task.createdBy,
      id,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", jwtAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = req.user;
  try {
    const task = await getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.createdBy !== user.email && user.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden: only creator or admin can edit this task",
      });
    }

    await deleteTask(id);
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;