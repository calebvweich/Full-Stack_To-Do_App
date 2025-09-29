// CSS
import './TaskPage.css';

// COMPONENTS
import Button from '../../Components/Button/Button';
import Task from '../../Components/Task/Task';
import Group from '../../Components/Group/Group';
import { NewTask } from '../../Components/Dialog/NewTask/NewTask';

// LIBRARIES
import { useEffect, useState } from 'react';
import { getTasks, getGroups, deleteTask, deleteGroup, reorderSteps, deleteStep, reorderTasks } from '../../api';

export default function TaskPage() {
  // VARIABLES
  const [selectedGroup, setSelectedGroup] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTab, setDialogTab] = useState("Task")
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
  async function handleDelete(id, toDelete, taskId) {
    if (toDelete === "task") {
      deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } else if (toDelete === "group") {
      deleteGroup(id)
      setGroups((prev) => prev.filter((group) => group._id !== id))
    } else {
      deleteStep(taskId, id)
      setTasks(prev =>
        prev.map(task =>
          task._id === taskId
          ? {
            ...task,
            steps: task.steps.filter(step => step._id !== id)
            }
          : task
        )
      )
    }
  }

  async function handleTaskDrop(type, taskId, newGroupId) {
    if (type === "task") {
      const newGroup = await reorderTasks(newGroupId, taskId)
      setTasks(prev =>
        prev.map(task =>
          task._id === taskId ? { ...task, group: newGroup } : task
        )
      );
    }
  };

  async function handleReorder(taskId, newOrder) {
    const newSteps = await reorderSteps(taskId, newOrder)
    setTasks(prev =>
      prev.map(task =>
        task._id === taskId
          ? { ...task, steps: newSteps } // new array reference
          : task
      )
    )
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
              {groups.map((group) => {
                return(
                  <Button key={group._id} text={group.name} onClick={() => setSelectedGroup(group.name)} />
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
      <div
        className="taskArea"
        onDrop={e => handleTaskDrop(e.dataTransfer.getData("type"), e.dataTransfer.getData("taskId"), "None")}
        onDragOver={e => e.preventDefault()}
      >
        {groups.map((group) => {
          return(
            <Group
              key={group._id}
              group={group}
              tasks={tasks.filter(task => task.group === group.name)}
              manageMode={manageMode}
              statusOptions={statusOptions}
              taskDeletion={handleDelete}
              onReorderSteps={handleReorder}
              onTaskDrop={handleTaskDrop}
            />
          )
        })}
        {tasks.filter(task => task.group === "None").map((task) => {
          return(
            <Task
              key={task._id}
              task={task}
              manageMode={manageMode}
              statusOptions={statusOptions}
              taskDeletion={handleDelete}
              onReorderSteps={handleReorder}
            />
          )
        })}
      </div>
      {dialogOpen && (
        <NewTask
          close={() => setDialogOpen(false)}
          tab={dialogTab}
          setTab={setDialogTab}
        />
      )}
    </div>
  );
}
