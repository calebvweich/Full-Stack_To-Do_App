import "./Task.css"

import { useState } from "react";
import Progress from "../Progress/Progress";
import Button from "../Button/Button";
import { useEffect } from "react";
import { addStepToTask, setTaskStatus} from "../../api";
import { DeleteDialog } from "../Dialog/Delete/Delete";
import { MdDeleteOutline } from "react-icons/md";

export default function Task({task, manageMode, statusOptions, taskDeletion, onReorderSteps, addStep, updateStatus, toggleStep, StepDrop, TaskDrag}) {
  // Create local state for the task to enable re-rendering
  const [taskState, setTaskState] = useState(task);
  const [newStep, setNewStep] = useState("")
  const [deleteInfo, setDeleteInfo] = useState(null)

  // Step drag
  function handleDragStart(e, id, taskId) {
    e.stopPropagation();
    e.dataTransfer.setData("type", "step");
    e.dataTransfer.setData("stepId", id);
    e.dataTransfer.setData("oldTask", taskId)
  };

  // Step Drop
  function handleDrop(e, newTaskId, newIndex) {
    const type = e.dataTransfer.getData("type")
    if (type === "step") {
      onReorderSteps(e.dataTransfer.getData("stepId"), e.dataTransfer.getData("oldTask"), newTaskId, newIndex)
    }
  };

  // set new task status
  async function updateStatus(newStatus) {
    setTaskStatus(taskState._id, newStatus);
    setTaskState(prevTask => ({
      ...prevTask, status: newStatus
    }))
  }

  function handleTaskDragStart(e) {
    e.dataTransfer.setData("type", "task");
    e.dataTransfer.setData("taskId", taskState._id);
  };

  async function handleNewStep() {
    if (newStep !== "") {
      addStep(task._id, newStep)
      setNewStep("")
    }
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
            <select value={taskState.status} onChange={(e) => updateStatus(e.target.value)}>
              {statusOptions.map((option, index) => {
                return(
                  <option key={index} value={option}>{option}</option>
              )})}
            </select>
            :
            <div>{taskState.status}</div>
          }
        </div>
        {manageMode ? <Button text={<MdDeleteOutline />} onClick={() => setDeleteInfo({"object": taskState, type: "task"})} /> : <Progress pcent={pcentComplete(taskState)} />}
      </div>
      <div className="stepsList">
        {task.steps.map((step, index) => {
          return(
            <div
              key={index}
              className="step stepHover"
              onClick={() => manageMode ? setDeleteInfo({"object": step, type: "step", extra: task.id}) : toggleStep(task._id, step._id)}
              draggable
              onDragStart={(e) => handleDragStart(e, step._id, taskState._id)}
              onDragOver={(e) => e.preventDefault()} // allow drop
              onDrop={(e) => handleDrop(e, taskState._id, index)}
            >
              {step.name} 
              <div className={step.completed ? "checked checkbox" : "checkbox"}/>
            </div>
          )
        })}
      </div>
      <div className="step">
        <input
          type="text"
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
        />
        <button type="button" onClick={() => handleNewStep()}>+</button>
      </div>
      {deleteInfo &&
        <DeleteDialog
          toDelete={deleteInfo}
          handleDelete={taskDeletion}
          close={() => setDeleteInfo(null)}
        />
      }
    </div>
  )
}