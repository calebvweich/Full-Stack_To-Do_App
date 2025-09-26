import express from "express";
import task from "../models/task.js";
import group from "../models/group.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// New Task
router.post("/newTask", auth, async (req, res) => {
  try {
    console.log(req.body)
    const { name, group, steps, dueDate } = req.body;
    const newTask = new task({
      userId: req.user.id,
      name: name,
      status: "Not-Started",
      group: group,
      steps: steps,
      dueDate: dueDate,
    })
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// New Group
router.post("/newGroup", auth, async (req, res) => {
  try {
    const { name } = req.body;
    const newGroup = new group({
      userId: req.user.id,
      name: name
    })
    await newGroup.save();
    res.status(201).json(newGroup)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// Get Tasks
router.get("/getTasks", auth, async (req, res) => {
  try {
    const userTasks = await task.find({ userId: req.user.id })
    userTasks.forEach(task => {
      task.steps.sort((a, b) => a.order - b.order)
    })
    res.json(userTasks)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// Get Groups
router.get("/getGroups", auth, async (req, res) => {
  try {
    const userGroups = await group.find({ userId: req.user.id })
    res.json(userGroups)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// Delete Task
router.delete("/task/:id", async (req, res) => {
  await task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// Delete Group
router.delete("/group/:id", async (req, res) => {
  const currentGroup = await group.findById(req.params.id)
  const currentTasks = await task.find({ "group": { $eq: currentGroup.name }})
  currentTasks.forEach(async toDel => {
    console.log(toDel)
    await task.findByIdAndDelete(toDel._id)
  })
  await group.findByIdAndDelete(req.params.id);
  res.json({ message: "Group deleted" });
});

// Reorder Steps
router.patch("/:taskId/steps/reorder", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { order } = req.body; // array of stepIds in new order

    const currentTask = await task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // update each step's order
    order.forEach((stepId, index) => {
      const step = currentTask.steps.id(stepId);
      if (step) {
        step.order = index;
      }
    });

    await currentTask.save();

    // return fresh array of plain objects with string _id
    const steps = currentTask.steps
      .sort((a, b) => a.order - b.order)
      .map(step => ({
        ...step.toObject(),
        _id: step._id.toString()
      }));

    res.status(200).json(steps);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:taskId/steps/:stepId", async (req, res) => {
  try {
    const { taskId, stepId } = req.params;
    const currentTask = await task.findById(taskId)
    const currentStep = currentTask.steps.id(stepId)
    currentStep.completed = !currentStep.completed
    await currentTask.save()
    res.status(200)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
})

router.post("/:taskId/newStep", auth, async (req, res) => {
  try {
    const { taskId } = req.params
    const { name } = req.body;
    const currentTask = await task.findById(taskId);
    const nextOrder = currentTask.steps.length;
    currentTask.steps.push({ name: name, order: nextOrder });
    await currentTask.save();
    res.status(200).json(currentTask);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
})

router.delete("/:taskId/deleteStep/:stepId", auth, async (req, res) => {
  try {
    const { taskId, stepId } = req.params;
    const currentTask = await task.findById(taskId)
    currentTask.steps = currentTask.steps.filter(step => step._id != stepId)
    await currentTask.save()
    res.status(200);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
})

export default router;