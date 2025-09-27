import { useState } from "react";
import "./Task.css"
import Progress from "../Progress/Progress";
import Button from "../Button/Button";
import { useEffect } from "react";
import { addStepToTask, toggleStepCompletion } from "../../api";
import Dialog from "../Dialog/Dialog";
import { DeleteDialog, DeleteDialogHeader } from "../Dialog/Delete/Delete";

export default function Task({task, manageMode, statusOptions, taskDeletion, onReorderSteps}) {
  // Create local state for the task to enable re-rendering
  const [taskState, setTaskState] = useState(task);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [newStep, setNewStep] = useState("")
  const [deleteInfo, setDeleteInfo] = useState(null)

  // Step drag
  function handleDragStart(e, index) {
    e.stopPropagation();
    e.dataTransfer.setData("type", "step");
    e.dataTransfer.setData("stepIndex", index);
  };

  // Step Drop
  function handleDrop(e, index) {
    const type = e.dataTransfer.getData("type")
    if (type === "step") {
      const newIndex = e.dataTransfer.getData("stepIndex")
      // Copy steps from current local state
      const newSteps = [...taskState.steps];
      const [moved] = newSteps.splice(newIndex, 1);
      newSteps.splice(index, 0, moved);

      // Tell parent about new order
      onReorderSteps(task._id, newSteps.map((s) => s._id));
    }
  };

  // Handler function to toggle step completion
  async function toggleStep(stepIndex) {
    toggleStepCompletion(taskState._id, taskState.steps[stepIndex]._id)
    setTaskState(prevTask => ({
      ...prevTask,
      steps: prevTask.steps.map((step, index) => 
        index === stepIndex 
          ? {...step, completed: !step.completed} 
          : step
      )
    }));
  };

  function handleTaskDragStart(e) {
    e.dataTransfer.setData("type", "task");
    e.dataTransfer.setData("taskId", taskState._id);
  };

  async function addStep() {
    const updatedTask = await addStepToTask(taskState._id, newStep)
    setTaskState(updatedTask)
    setNewStep("")
  }

  function pcentComplete (task) {
    var done = 0
    var total = 0
    task.steps.forEach(step => {
      total++
      if (step.completed) {
        done++
      }
    });
    return(done/total * 100)
  }

  useEffect(() => {
    setTaskState(task);
  }, [task]);

  return(
    <div
      className="taskContainer"
      draggable
      onDragStart={handleTaskDragStart}
    >
      <div className="taskName">
        <div>
          <div>{taskState.name}</div>
          {manageMode ? 
            <select>
              {statusOptions.map((option, index) => {
                return(
                  <option key={index} selected={option === taskState.status} value={option}>{option}</option>
              )})}
            </select>
            :
            <div>{taskState.status}</div>
          }
        </div>
        {manageMode ? <Button text={"A"} onClick={() => setDeleteInfo({"object": taskState, type: "task"})} /> : <Progress pcent={pcentComplete(taskState)} />}
      </div>
      {taskState.steps.map((step, index) => {
        return(
          <div
            key={index}
            className="step"
            onClick={() => manageMode ? setDeleteInfo({"object": step, type: "step", extra: taskState._id}) : toggleStep(index)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => e.preventDefault()} // allow drop
            onDrop={(e) => handleDrop(e, index)}
          >
            {step.name} 
            <div className={step.completed ? "checked checkbox" : "checkbox"}/>
          </div>
        )
      })}
      <div className="step">
        <input
          type="text"
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
        />
        <button type="button" onClick={addStep}>+</button>
      </div>
      {deleteInfo &&
        <Dialog
          close={() => setDeleteInfo(false)}
          title={<DeleteDialogHeader toDelete={deleteInfo} />}
          content={<DeleteDialog toDelete={deleteInfo} handleDelete={taskDeletion} close={() => setDeleteInfo(false)} />}
        />
      }
    </div>
  )
}