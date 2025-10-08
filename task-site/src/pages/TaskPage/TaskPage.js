// CSS
import './TaskPage.css';

// COMPONENTS
import Button from '../../Components/Button/Button';
import Task from '../../Components/Task/Task';
import Group from '../../Components/Group/Group';
import { NewTask } from '../../Components/Dialog/NewTask/NewTask';

// LIBRARIES
import { useEffect, useState } from 'react';
import { getTasks, getGroups, deleteTask, deleteGroup, reorderSteps, deleteStep, reorderTasks, toggleStepCompletion, addStepToTask, setTaskStatus, newTask, newGroup, getProjects } from '../../api';
import { toast } from '../../Components/Toast/Toast';

export default function TaskPage() {
  // VARIABLES
  const [selectedGroups, setSelectedGroups] = useState([])
  const [selectedStatus, setSelectedStatus] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTab, setDialogTab] = useState("Task")
  const statusOptions = ["Not-Started", "In-Progress", "Completed", "On-Hold"]
  const [manageMode, setManageMode] = useState(false)
  const [currentProject, setCurrentProject] = useState(null)
  // DB
  const [tasks, setTasks] = useState([])
  const [groups, setGroups] = useState([])
  const [projects, setProjects] = useState([])

  //FUNCTIONS
  async function getUserTasks() {
    const projectRes = await getProjects()
    setProjects(projectRes)
    getProject(projectRes[0]._id, projectRes)
  }

  function getProject(id, datasource = projects) {
    const project = datasource.find(p => p._id === id)
    setCurrentProject(project)
    setGroups(project.groups)
    setTasks(project.tasks.map(t => ({ ...t, steps: [...t.steps].sort(function(a,b){return a.order - b.order})})))
  }

  async function addTask(name,group,steps,dueDate) {
    const res = await newTask(name,group,currentProject._id,steps,dueDate);
    if (res) {
      setTasks([ ...tasks, res ])
    } else {
      console.log("Failed: ", res);
    }
  }

  async function addGroup(name) {
    const res = await newGroup(name, currentProject._id);
    if (res) {
      setGroups([ ...groups, res ])
    } else {
      console.log("Failed: ", res);
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
    const oldTask = tasks.find(t => t._id === oldTaskId)
    const oldTaskSteps = oldTask.steps.filter(s => s._id !== stepId)
    const newTask = newTaskId === oldTaskId ? { ...oldTask, steps: oldTaskSteps} : tasks.find(t => t._id === newTaskId)
    const step = oldTask.steps.find(s => s._id === stepId)
    const newTaskSteps = [...newTask.steps]
    newTaskSteps.splice(newIndex, 0, step)
    setTasks(prev =>
      prev.map(task =>
        task._id === newTaskId
          ? { ...task, steps: newTaskSteps }
        : task._id === oldTaskId
          ? { ...task, steps: oldTaskSteps }
        : task
      )
    )
    reorderSteps(newTaskId === oldTaskId ? { [newTaskId]: newTaskSteps.map(s => s._id) } : { [oldTaskId]: oldTaskSteps.map(s => s._id), [newTaskId]: newTaskSteps.map(s => s._id) }, stepId)
  }

  function filterTask(groupId) {
    return(tasks.filter(task => task.groupId === groupId && (task.status === selectedStatus || selectedStatus === "")))
  }

  function toggleSelect(groupName) {
    setSelectedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName) // remove if already selected
        : [...prev, groupName] // add if not selected
    );
  }

  function changeStatusFilter(status) {
    setSelectedStatus(prev => (prev === status ? "" : status));
  }

  function changeStatus(taskId, status) {
    setTaskStatus(taskId, status);
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === taskId
          ? {...task, status: status}
          : task
      )
    )
  }

  // Step Functions
  async function addStep(taskId, step) {
    const newStep = await addStepToTask(taskId, step);
    setTasks(prevTasks => 
      prevTasks.map(task =>
        task._id === taskId
          ? { ...task, steps: [...task.steps, newStep] }
          : task
      )
    );
  }

  function toggleStep(taskId, stepId) {
    toggleStepCompletion(taskId, stepId)
    setTasks(prevTasks => 
      prevTasks.map(task =>
        task._id === taskId
          ? { ...task,
          steps: task.steps.map(step =>
            step._id === stepId
            ? {...step, completed: !step.completed}
            : step
          )
        } : task
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
        <div className="filterContainer">
          {groups.length > 0 &&
            <div className="filterType">
              <div className="filters">
                {groups.map((group) => {
                  return(
                    <div key={group._id} className={`${selectedGroups.includes(group._id) && "active"} filter`} onClick={() => toggleSelect(group._id)}>{group.name}</div>
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
                  <div key={index} className={`${selectedStatus === name && "active"} filter`} onClick={() => changeStatusFilter(name)}>{name}</div>
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
      <div className="projectContainer">
        <div className="projectList">
          {projects.map(project => (
            <div className="projectName" onClick={() => getProject(project._id)}>
              {project.name}
            </div>
          ))}
        </div>
        <div>+</div>
      </div>
      <div className="taskAreaContainer"
        onDrop={e => handleTaskDrop(e.dataTransfer.getData("type"), e.dataTransfer.getData("taskId"), "None")}
        onDragOver={e => e.preventDefault()}
      >
      <div className="taskArea">
        {groups.length > 0 && groups.map((group) => {
          if ((selectedGroups.includes(group._id) || selectedGroups.length === 0)) {
            return(
              <Group
                key={group._id}
                group={group}
                manageMode={manageMode}
                groupDeletion={handleDelete}
                onTaskDrop={handleTaskDrop}
              >
                {tasks.filter(t => t.groupId === group._id && (t.status === selectedStatus || selectedStatus === "")).map((task) => {
                  return(
                    <Task
                      key={task._id}
                      task={task}
                      manageMode={manageMode}
                      statusOptions={statusOptions}
                      taskDeletion={handleDelete}
                      onReorderSteps={handleReorder}
                      addStep={addStep}
                      toggleStep={toggleStep}
                      updateStatus={changeStatus}
                    />
                  )
                })}
              </Group>
            )
          } else {
            return (
              <></>
            )
          }
        })}
        {!selectedGroups.length && tasks.filter(t => !t.groupId && t.status === selectedStatus).map((task) => {
          return(
            <Task
              key={task._id}
              task={task}
              manageMode={manageMode}
              statusOptions={statusOptions}
              taskDeletion={handleDelete}
              onReorderSteps={handleReorder}
              addStep={addStep}
              toggleStep={toggleStep}
              updateStatus={changeStatus}
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
          addTask={addTask}
          addGroup={addGroup}
        />
      )}
    </div>
  );
}
