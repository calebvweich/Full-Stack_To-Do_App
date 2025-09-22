import { useState } from "react";
import "./Task.css"
import Progress from "../Progress/Progress";

export default function Task({task}) {
  // Create local state for the task to enable re-rendering
  const [taskState, setTaskState] = useState(task);

  // Handler function to toggle step completion
  const toggleStep = (stepIndex) => {
    setTaskState(prevTask => ({
      ...prevTask,
      steps: prevTask.steps.map((step, index) => 
        index === stepIndex 
          ? {...step, completed: !step.completed} 
          : step
      )
    }));
  };

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
    <div className="taskContainer">
      <div className="taskName">
        {taskState.title}<Progress pcent={pcentComplete(taskState)} />
      </div>
      {taskState.steps.map((step, index) => {
        return(
          <div key={index} className="step" onClick={() => toggleStep(index)}>
            {step.text} 
            <div className={step.completed ? "checked checkbox" : "checkbox"}/>
          </div>
        )
      })}
      <div className="step" onClick={() => console.log("Add Step")}>Add New Step +</div>
    </div>
  )
}