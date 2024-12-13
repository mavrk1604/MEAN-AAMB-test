const { Schema, model } = require('mongoose');

const TaskSchema = Schema(
  {
    title: { type: String, required: true, minlength: 3 },
    description: { type: String, maxlength: 500 },
    status: { type: String, required: true, enum: ["Pending", "In Progress", "Completed"] },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    dueDate: { type: Date, required: true },
    tags: { type: [String], default: [] },
    history: [
      {
        updatedAt: { type: Date, default: Date.now },
        changes: {
          type: Map,
          of: Schema.Types.Mixed,
        },
      },
    ],
  },
  { timestamps: true }
);

const Task = model('Task', TaskSchema);
module.exports = Task;
