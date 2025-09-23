import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
});

export default mongoose.model("Group", groupSchema);
