import { useState } from "react";
import "./Task.css"
import Progress from "../Progress/Progress";
import Button from "../Button/Button";
import { useEffect } from "react";
import { addStepToTask, toggleStepCompletion } from "../../api";

export default function Task({task, manageMode, statusOptions, taskDeletion, onReorderSteps}) {
  // Create local state for the task to enable re-rendering
  const [taskState, setTaskState] = useState(task);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [newStep, setNewStep] = useState("")

  function handleDragStart(index) {
    setDraggedIndex(index);
  };

  function handleDrop(index) {
    if (draggedIndex === null) return;

    // Copy steps from current local state
    const newSteps = [...taskState.steps];
    const [moved] = newSteps.splice(draggedIndex, 1);
    newSteps.splice(index, 0, moved);

    // Reset drag index
    setDraggedIndex(null);

    // Tell parent about new order
    onReorderSteps(task._id, newSteps.map((s) => s._id));
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
    <div className="taskContainer">
      <div className="taskName">
        <div>
          <div>{taskState.title}</div>
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
        {manageMode ? <Button text={"A"} onClick={() => taskDeletion(taskState._id, "task")} /> : <Progress pcent={pcentComplete(taskState)} />}
      </div>
      {taskState.steps.map((step, index) => {
        return(
          <div
            key={index}
            className="step"
            onClick={() => manageMode ? taskDeletion(step._id, "Step", taskState._id) : toggleStep(index)}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => e.preventDefault()} // allow drop
            onDrop={() => handleDrop(index)}
          >
            {step.text} 
            <div className={step.completed ? "checked checkbox" : "checkbox"}/>
          </div>
        )
      })}
      <div
        className="step"
      >
      <input
        type="text"
        value={newStep}
        onChange={(e) => setNewStep(e.target.value)}
      />
      <button type="button" onClick={addStep}>+</button>
      </div>
    </div>
  )
}