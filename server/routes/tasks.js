import express from "express";
import task from "../models/task.js";
import group from "../models/group.js";
import project from "../models/project.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// New Task
router.post("/newTask", auth, async (req, res) => {
  try {
    const { name, groupId, projectId, steps, dueDate } = req.body;
    console.log(groupId)
    const newTask = new task({
      userId: req.user.id,
      name: name,
      status: "Not-Started",
      groupId: groupId === "None" ? null : groupId,
      projectId: projectId,
      steps: steps,
      dueDate: dueDate,
    })
    groupId !== "None" && await group.findByIdAndUpdate(groupId, {
      $push: { tasks: newTask._id }
    })
    await project.findByIdAndUpdate(projectId, {
      $push: { tasks: newTask._id },
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// New Group
router.post("/newGroup", auth, async (req, res) => {
  try {
    const { name, projectId } = req.body;
    const newGroup = new group({
      userId: req.user.id,
      name: name,
      projectId: projectId,
    })
    await project.findByIdAndUpdate(projectId, {
      $push: { groups: newGroup._id },
    });
    await newGroup.save();
    res.status(201).json(newGroup)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// New Project
router.post("/projects/new/:name", auth, async (req, res) => {
  try {
    const { name } = req.params;
    const newProject = new project({
      userId: req.user.id,
      name: name
    })
    await newProject.save()
    res.status(201).json(newProject)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
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

// Get Projects
router.get("/projects/get", auth, async (req, res) => {
  try {
    const userProjects = await project.find({ userId: req.user.id })
    .populate({
      path: "groups",
      populate: {
        path: "tasks"
      }
    })
    .populate({
      path: "tasks",
      match: { groupId: { $in: [null, undefined] } },
    })
    res.status(200).json(userProjects)
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: err.message })
  }
})

// Delete Task
router.delete("/task/:id", async (req, res) => {
  try {
    await task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
});

// Delete Group
router.delete("/group/:id", async (req, res) => {
  try {
    const currentGroup = await group.findById(req.params.id)
    const currentTasks = await task.find({ "group": { $eq: currentGroup._id }})
    currentTasks.forEach(async toDel => {
      await task.findByIdAndDelete(toDel._id)
    })
    await group.findByIdAndDelete(req.params.id);
    res.json({ message: "Group deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
});

// Delete Project
router.delete("/project/delete/:id", async (req, res) => {
  try {
    await project.findOneAndDelete({ _id: id })
    res.json({ message: "Project deleted" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: err.message })
  }
})

// Reorder Tasks
router.patch("/:groupName/reorder/:taskId", async (req, res) => {
  try {
    const { groupName, taskId } = req.params;
    const currentTask = await task.findById(taskId);
    currentTask.group = groupName;
    await currentTask.save();
    res.status(200).json(groupName);
    // delete task, push task to group
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
})

// Reorder Steps
router.patch("/steps/reorder", async (req, res) => {
  try {
    // { taskId: [stepsInOrder] }
    const { tasks, stepId } = req.body; // array of stepIds in new order
    const oldTaskId = Object.keys(tasks)[0];
    const newTaskId = Object.keys(tasks)[1];
    const oldTask = await task.findById(oldTaskId);
    if (newTaskId) {
      const newTask = await task.findById(newTaskId);
      const step = oldTask.steps.filter(s => String(s._id) === stepId)[0]
      oldTask.steps = oldTask.steps.filter(s => String(s._id) !== stepId)
      newTask.steps.push(step)
      tasks[newTaskId].forEach((stepId, index) => {
        const step = newTask.steps.id(stepId);
        if (step) {
          step.order = index;
        }
      });
      await newTask.save()
    }
    tasks[oldTaskId].forEach((stepId, index) => {
      const step = oldTask.steps.id(stepId);
      if (step) {
        step.order = index;
      }
    });
    await oldTask.save()
    res.status(200);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle step stepId completion
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

// Change task taskId status
router.patch("/:taskId/status", auth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { newStatus } = req.body
    const currentTask = await task.findById(taskId);
    currentTask.status = newStatus
    await currentTask.save()
    res.status(200)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
})

// New step in task taskId
router.post("/:taskId/newStep", auth, async (req, res) => {
  try {
    const { taskId } = req.params
    const { name } = req.body;
    const currentTask = await task.findById(taskId);
    const nextOrder = currentTask.steps.length;
    currentTask.steps.push({ name: name, order: nextOrder });
    currentTask.steps.sort((a, b) => a.order - b.order)
    await currentTask.save();
    res.status(200).json(currentTask.steps.at(-1));
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
})

//Delete Step
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