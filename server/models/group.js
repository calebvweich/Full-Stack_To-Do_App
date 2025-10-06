import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
});

export default mongoose.model("Group", groupSchema);
