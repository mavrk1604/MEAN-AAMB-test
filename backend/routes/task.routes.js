const express = require("express");
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require("../controllers/taskController");
const router = express.Router();

router.post("/create-task", createTask);
router.get("/get-tasks", getTasks);
router.get("/get-task-by-id/:id", getTaskById);
router.put("/update-task/:id", updateTask);
router.delete("/delete-task/:id", deleteTask);

module.exports = router;
