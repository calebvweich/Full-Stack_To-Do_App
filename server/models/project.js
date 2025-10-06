import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
});

projectSchema.index({ userId: 1, name: 1 }, { unique: true });

projectSchema.pre("findOneAndDelete", async function (next) {
  const projectId = this.getQuery()._id;

  await Promise.all([
    mongoose.model("Group").deleteMany({ projectId }),
    mongoose.model("Task").deleteMany({ projectId }),
  ]);

  next();
});

export default mongoose.model("Project", projectSchema);
