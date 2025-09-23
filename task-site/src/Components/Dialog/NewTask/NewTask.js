import { useState } from "react"
import "./NewTask.css"
import groups from "../../../data/groupExample.json"

function TaskForm({steps}) {
  const [title, setTitle] = useState("")
  const [step, setStep] = useState("")

  function handleSubmit() {
    console.log("Done")
  }

  function addStep() {
    console.log(step, steps)
    steps.push(step);
    setStep("")
  }

  return(
    <div className="taskFormContainer">
      <form onSubmit={handleSubmit}>
        <label>Title</label><br/>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br/><label>Steps</label><br/>
        <input
          type="text"
          value={step}
          onChange={(e) => setStep(e.target.value)}
        />
        <button type="button" onClick={addStep}>+</button>
        {steps.map((step, index) => {
          return(
            <label key={index}><br/>{step}</label>
          )}
        )}
        <br/><label>Group</label><br/>
        <select id="groups" name="groups">
          <option value="none">None</option>
          {groups.map((group, index) => {
            return(
              <option value={group.name} key={index}>{group.name}</option>
            )
          })}
        </select>
        <br/><label>Due Date</label><br/>
        <input
          type="date"
        />
        {/* 
          Get groups
          map groups to option
        */}
        <br/><br/><br/><br/><button type="submit">Submit</button>
      </form>
    </div>
  )
}

function GroupForm() {
  return(
    <div>Group</div>
  )
}

export function NewTaskHeader({tab, setTab}) {
  return(
    <div className="taskHeader">
      <div
        className={tab === "Task" ? "selected dialogHeaderText" : "dialogHeaderText"}
        onClick={() => setTab("Task")}
      >
        New Task
      </div>
      <div
        className={tab === "Group" ? "selected dialogHeaderText" : "dialogHeaderText"}
        onClick={() => setTab("Group")}
      >
        New Group
      </div>
    </div>
  )
}

export function NewTask({tab}) {
  const steps = []
  return(
    <div>
      {tab === "Task" ?
        <TaskForm steps={steps} />
        :
        <GroupForm />
      }
    </div>
  )
}