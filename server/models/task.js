import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true},
  title: { type: String, required: true},
  status: { type: String, required: true},
  group: { type: String, required: true},
  steps: { type: Array, required: true},
  dueDate: { type: String, required: true}
})

export default mongoose.model("Task", taskSchema);