import "./Task.css"

import { useState } from "react";
import Progress from "../Progress/Progress";
import { DeleteDialog } from "../Dialog/Delete/Delete";
import { MdDeleteOutline, MdCheckCircle, MdCheckCircleOutline } from "react-icons/md";

export default function Task({task, manageMode, statusOptions, taskDeletion, onReorderSteps, addStep, updateStatus, toggleStep}) {
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

  function handleTaskDragStart(e) {
    e.dataTransfer.setData("type", "task");
    e.dataTransfer.setData("taskId", task._id);
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

  return(
    <div
      className="taskContainer"
      draggable
      onDragStart={handleTaskDragStart}
    >
      <div className="taskName">
        <div>
          <div>{task.name}</div>
          {manageMode ? 
            <select value={task.status} onChange={(e) => updateStatus(task._id, e.target.value)}>
              {statusOptions.map((option, index) => {
                return(
                  <option key={index} value={option}>{option}</option>
              )})}
            </select>
            :
            <div>{task.status}</div>
          }
        </div>
        {manageMode ? <button onClick={() => setDeleteInfo({"object": task, type: "task"})}><MdDeleteOutline /></button> : <Progress pcent={pcentComplete(task)} />}
      </div>
      <div className="stepsList">
        {task.steps.map((step, index) => {
          return(
            <div
              key={index}
              className={`${step.completed && `stepCompleted`} step stepHover`}
              onClick={() => manageMode ? setDeleteInfo({"object": step, type: "step", extra: task._id}) : toggleStep(task._id, step._id)}
              draggable
              onDragStart={(e) => handleDragStart(e, step._id, task._id)}
              onDragOver={(e) => e.preventDefault()} // allow drop
              onDrop={(e) => handleDrop(e, task._id, index)}
            >
              {step.name}
              {step.completed ? <MdCheckCircle /> : <MdCheckCircleOutline />}
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