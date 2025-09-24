// CSS
import './TaskPage.css';

// COMPONENTS
import Button from '../../Components/Button/Button';
import Task from '../../Components/Task/Task';
import Group from '../../Components/Group/Group';
import Dialog from '../../Components/Dialog/Dialog';
import { NewTask, NewTaskHeader } from '../../Components/Dialog/NewTask/NewTask';

// LIBRARIES
import { useEffect, useState } from 'react';
import { getTasks, getGroups, deleteTask, deleteGroup } from '../../api';

export default function TaskPage() {
  // VARIABLES
  const [selectedGroup, setSelectedGroup] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTab, setDialogTab] = useState("Task")
  const groupNames = []
  const statusOptions = ["Not-Started", "In-Progress", "Completed", "On-Hold"]
  const [manageMode, setManageMode] = useState(false)
  // DB
  const [tasks, setTasks] = useState([])
  const [groups, setGroups] = useState([])

  //FUNCTIONS
  async function getUserTasks() {
    const groupRes = await getGroups()
    if (groupRes) {
      setGroups(groupRes)
    }
    const taskRes = await getTasks()
    if (taskRes) {
      setTasks(taskRes)
    }
  }
  async function handleDelete(id, toDelete) {
    if (toDelete === "task") {
      deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } else if (toDelete === "group") {
      deleteGroup(id)
      setGroups((prev) => prev.filter((group) => group._id !== id))
    } else {
      console.log("Step")
    }
  }

  // useEffect to get tasks and groups
  useEffect(() => {
    getUserTasks()
  }, [])

  return (
    <div className="body">
      <div className="options">
        <div className="filters">
          <div className="filterType">
            Group Name
            <div className="filters">
              {groups.map((group, index) => {
                return(
                  <Button key={index} text={group.name} onClick={() => setSelectedGroup(group.name)} />
                )
              })}
            </div>
          </div>
          <div className="filterType">
            Status
            <div className="filters">
              {statusOptions.map((name, index) => {
                return(
                  <Button key={index} text={name} onClick={() => setSelectedStatus(name)} />
                )
              })}
            </div>
          </div>
        </div>
        <div className="newButton">
          Manage Tasks
          <div className="manageButtons">
            <Button text={"New"} onClick={() => setDialogOpen(true)} />
            <Button text={"Manage"} onClick={() => setManageMode(!manageMode)} />
          </div>
        </div>
      </div>
      <div className="taskArea">
        {groups.map((group, index) => {
          return(
            <Group
              key={index}
              group={group}
              tasks={tasks.filter(task => task.group === group.name)}
              manageMode={manageMode}
              statusOptions={statusOptions}
              taskDeletion={handleDelete}
            />
          )
        })}
        {tasks.filter(task => task.group === "None").map((task, index) => {
          return(
            <Task
              key={index}
              task={task}
              manageMode={manageMode}
              statusOptions={statusOptions}
              taskDeletion={handleDelete}
            />
          )
        })}
      </div>
      {dialogOpen && (
        <Dialog
          close={() => setDialogOpen(false)}
          title={<NewTaskHeader tab={dialogTab} setTab={setDialogTab} />}
          content={<NewTask tab={dialogTab} />}
        />
      )}
    </div>
  );
}
