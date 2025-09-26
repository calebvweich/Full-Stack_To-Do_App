import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
  order: { type: Number, required: true, default: false }
})

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, required: true },
  group: { type: String, required: true },
  steps: [stepSchema],
  dueDate: { type: String, required: true }
})

export default mongoose.model("Task", taskSchema);