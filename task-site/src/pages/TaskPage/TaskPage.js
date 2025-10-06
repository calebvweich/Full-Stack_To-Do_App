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
import { toast } from '../../Components/Toast/Toast';

export default function TaskPage() {
  // VARIABLES
  const [selectedGroups, setSelectedGroups] = useState([])
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

  async function handleReorder(stepId, oldTaskId, newTaskId, newIndex) {
    // GET TASKS FROM IDS
    // SETTASKS PREVTASKS WITH CHECKS FOR OLDTASKID AND NEWTASKID
    // IF OLDTASKID REMOVE STEPID
    // IF NEWTASKID ADD STEPID AT NEWINDEX
    const oldTask = tasks.find(t => t._id === oldTaskId)
    const newTask = newTaskId === oldTaskId ? { ...oldTask, steps: oldTask.steps.filter(s => s._id !== stepId)} : tasks.find(t => t._id === newTaskId)
    const step = oldTask.steps.find(s => s._id === stepId)
    newTask.steps.splice(newIndex, 0, step)
    setTasks(prev =>
      prev.map(task =>
        task._id === newTaskId
          ? { ...task, steps: newTask.steps }
        : task._id === oldTaskId
          ? { ...task, steps: task.steps.filter(s => s._id !== stepId) }
        : task
      )
    )




    // if (oldTaskiD === taskState._id) {
    //   console.log("Same Task")
    //   console.log(newIndex)
    // } else {
    //   console.log("Different Task")
    //   console.log(newIndex)
    // }
    // const newSteps = await reorderSteps(oldTaskId)
    // const oldTaskSteps = []
    // setTasks(prev =>
    //   prev.map(task =>
    //     task._id === oldTaskId
    //       ? { ...task, steps: newSteps } // new array reference
    //       : task
    //   )
    // )
  }

  function filterTask(groupName) {
    return(tasks.filter(task => task.group === groupName && (task.status === selectedStatus || selectedStatus === "")))
  }

  function toggleSelect(groupName) {
    setSelectedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName) // remove if already selected
        : [...prev, groupName] // add if not selected
    );
  }

  function changeStatus(status) {
  setSelectedStatus(prev => (prev === status ? "" : status));
}

  // useEffect to get tasks and groups
  useEffect(() => {
    getUserTasks()
  }, [])

  return (
    <div className="body">
      <div className="options">
        <div className="filterContainer">
          {groups.length > 0 &&
            <div className="filterType">
              <div className="filters">
                {groups.map((group) => {
                  return(
                    <div key={group._id} className={`${selectedGroups.includes(group.name) && "active"} filter`} onClick={() => toggleSelect(group.name)}>{group.name}</div>
                  )
                })}
              </div>
              Group Name
            </div>
          }
          <div className="filterType">
            <div className="filters">
              {statusOptions.map((name, index) => {
                return(
                  <div key={index} className={`${selectedStatus === name && "active"} filter`} onClick={() => changeStatus(name)}>{name}</div>
                )
              })}
            </div>
            Status
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
      <div className="taskAreaContainer"
        onDrop={e => handleTaskDrop(e.dataTransfer.getData("type"), e.dataTransfer.getData("taskId"), "None")}
        onDragOver={e => e.preventDefault()}
      >
      <div className="taskArea">
        {groups.map((group) => {
          if ((selectedGroups.includes(group.name) || selectedGroups.length === 0)) {
            return(
              <Group
                key={group._id}
                group={group}
                tasks={filterTask(group.name)}
                manageMode={manageMode}
                statusOptions={statusOptions}
                taskDeletion={handleDelete}
                onReorderSteps={handleReorder}
                onTaskDrop={handleTaskDrop}
              />
            )
          } else {
            return (
              <></>
            )
          }
        })}
        {!selectedGroups && filterTask("None").map((task) => {
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
