import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import { auth } from "./middleware/auth.js";
import taskRoutes from "./routes/tasks.js"

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors())
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes)

// Example protected route
app.get("/api/protected", auth, (req, res) => {
  res.json({ msg: `Hello ${req.user.username}, this is protected data.` });
});


// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.listen(5000, () => console.log("Server running on port 5000"));
