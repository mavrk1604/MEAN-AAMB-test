const Task = require("../models/Task");

const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, tags } = req.body;

  if (!title || !status || !dueDate) {
    return res.status(400).json({
      error: "Title, status, and dueDate are required."
    });
  }

  const currentDate = new Date();
  const dueDateObject = new Date(dueDate);
  if (dueDateObject < currentDate) {
    return res.status(400).json({
      error: "dueDate cannot be in the past."
    });
  }

  const taskPriority = priority || "Medium";
  const uniqueTags = [...new Set(tags)];

  try {
    const task = new Task({
      title,
      description,
      status,
      priority: taskPriority,
      dueDate,
      tags: uniqueTags,
    });

    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { status, priority, tags, startDate, endDate } = req.query;

    const filters = {};

    if (status) {
      filters.status = status;
    }
    if (priority) {
      filters.priority = priority;
    }
    if (tags) {
      filters.tags = { $in: tags.split(',') };
    }
    if (startDate || endDate) {
      const dateRange = {};
      if (startDate) {
        dateRange.$gte = new Date(startDate);
      }
      if (endDate) {
        dateRange.$lte = new Date(endDate);
      }
      filters.dueDate = dateRange;
    }

    const tasks = await Task.find(filters).sort({ dueDate: 1 });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: 'No tasks were found matching the criteria!'
      });
    }

    return res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, status, priority, description } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.status === 'Pending' && status === 'Completed') {
      return res.status(400).json({
        error: "Status cannot be changed directly from 'Pending' to 'Completed'."
      });
    }

    const changes = {};

    if (task.title !== title) {
      changes.title = { from: task.title, to: title };
    }

    if (task.status !== status) {
      changes.status = { from: task.status, to: status };
    }

    if (task.priority !== priority) {
      changes.priority = { from: task.priority, to: priority };
    }

    if (task.description !== description) {
      changes.description = { from: task.description, to: description };
    }

    if (Object.keys(changes).length > 0) {
      task.history.push({
        updatedAt: new Date(),
        changes: changes,
      });
    }

    task.title = title || task.title;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.description = description || task.description;

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
