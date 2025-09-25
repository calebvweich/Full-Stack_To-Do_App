import { useEffect, useState } from "react"
import "./NewTask.css"
import { newGroup, newTask, getGroups } from "../../../api"

function TaskForm({steps}) {
  const [title, setTitle] = useState("")
  const [step, setStep] = useState("")
  const [group, setGroup] = useState("None")
  const [dueDate, setDueDate] = useState(null)

  const [groupList, setGroupList] = useState([])
  async function getUserGroups() {
    const groupRes = await getGroups()
    if (groupRes) {
      groupRes.forEach(group => {
        groupList.push(group.name)
      });
      setGroupList(groupRes)
    }
  }

  async function handleSubmit() {
    const res = await newTask(title,group,steps,dueDate);
    if (res) {
      console.log(res)
    } else {
      console.log("Failed: ", res);
    }
  }

  function addStep() {
    steps.push({ "text": step, "completed": false });
    setStep("")
  }

  useEffect(() => {
    getUserGroups()
  }, [])

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
        {steps.map((step) => {
          return(
            <label key={step._id}><br/>{step.text}</label>
          )}
        )}
        <br/><label>Group</label><br/>
        <select id="groups" name="groups" onChange={(e) => setGroup(e.target.value)}>
          <option value="None">None</option>
          {groupList.map((group) => {
            return(
              <option value={group.name} key={group._id}>{group.name}</option>
            )
          })}
        </select>
        <br/><label>Due Date</label><br/>
        <input
          type="date"
          onChange={(e) => (setDueDate(e.target.value))}
        />
        <br/><br/><br/><br/><button type="submit">Submit</button>
      </form>
    </div>
  )
}

function GroupForm() {
  const [name, setName] = useState("")

  async function handleSubmit() {
    const res = await newGroup(name);
    if (res) {
      console.log(res)
    } else {
      console.log("Failed: ", res);
    }
  }

  return(
    <div className="taskFormContainer">
      <form onSubmit={handleSubmit}>
        <label>Name</label><br/>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br/><br/><br/><br/><button type="submit">Submit</button>
      </form>
    </div>
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