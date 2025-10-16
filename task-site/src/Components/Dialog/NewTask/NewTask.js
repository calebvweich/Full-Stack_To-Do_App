import { useState } from "react"
import "./NewTask.css"
import Dialog from "../Dialog"
import { toast } from "../../Toast/Toast"

function TaskForm({steps, close, groupList, addTask}) {
  const [name, setName] = useState("");
  const [step, setStep] = useState("");
  const [group, setGroup] = useState("None");
  const [dueDate, setDueDate] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name) {
      toast.error("Name is required");
    } else if (!dueDate) {
      toast.error("Due Date is required");
    } else {
      addTask(name,group,steps,dueDate);
      close();
    }
  }

  function addStep() {
    if (!step) {
      toast.error("Step cannot be blank");
    } else {
      steps.push({ "name": step, "completed": false });
      setStep("");
    }
  }

  return(
    <form className="taskFormContainer" onSubmit={handleSubmit}>
      <label>Name</label><br/>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br/><br/><label>Steps</label><br/>
      <div className="newSteps">
      <input
        type="text"
        value={step}
        onChange={(e) => setStep(e.target.value)}
      />
      <button type="button" onClick={addStep}>+</button>
      </div>
      {steps.map((step, index) => {
        return(
          <label key={index}>{step.name}<br/></label>
        )}
      )}
      <br/><label>Group</label><br/>
      <select id="groups" name="groups" onChange={(e) => setGroup(e.target.value)}>
        <option value="None">None</option>
        {groupList.map((group) => {
          return(
            <option value={group._id} key={group._id}>{group.name}</option>
          )
        })}
      </select>
      <br/><br/><label>Due Date</label><br/>
      <input
        type="date"
        onChange={(e) => (setDueDate(e.target.value))}
      />
      <div className="button">
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}

function GroupForm({close, addGroup}) {
  const [name, setName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name) {
      toast.error("Name is required");
    } else {
      addGroup(name);
      close();
    }
  }

  return(
    <form className="taskFormContainer" onSubmit={handleSubmit}>
      <label>Name</label><br/>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="button">
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}

function NewTaskHeader({tab, setTab}) {
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

export function NewTask({close, tab, groupList, setTab, addTask, addGroup}) {
  const steps = []
  return(
    <Dialog
      close={close}
      title={<NewTaskHeader tab={tab} setTab={setTab} />}
      content={
        tab === "Task" ?
          <TaskForm steps={steps} close={close} groupList={groupList} addTask={addTask} />
          :
          <GroupForm close={close} addGroup={addGroup} />
      }
    />
  )
}