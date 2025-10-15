// CSS
import './TaskPage.css';
import TaskHeader from "./TaskHeader";
import TaskPage from "./TaskPage";
import { deleteProject, getProjectList, newProject, renameProj } from "../../api";
import { useState, useEffect } from "react";

export default function TaskLayout({ logout }) {
  const [projectList, setProjectList] = useState([])
  const [currentProject, setCurrentProject] = useState(JSON.parse(localStorage.getItem("project")))

  async function getProjects() {
    const projectRes = await getProjectList();
    setProjectList(projectRes);
    if (!currentProject) {
      localStorage.setItem("project", JSON.stringify(projectRes[0]));
      setCurrentProject(projectRes[0]);
    }
  }

  function switchProject(id) {
    const newProject = projectList.find(p => p._id === id);
    localStorage.setItem("project", JSON.stringify(newProject))
    setCurrentProject(newProject)
  }
  
  async function addProject(name) {
    const res = await newProject(name)
    setProjectList([...projectList, res])
    localStorage.setItem("project", JSON.stringify(res))
    setCurrentProject(res)
  }

  async function renameProject(id, name) {
    renameProj(id, name);
    if (currentProject._id === id) {
      setCurrentProject({ _id: id, name: name })
      localStorage.setItem("project", JSON.stringify({ _id: id, name: name }))
    }
    setProjectList(prev => prev.map(p => p._id === id ? {...p, name: name} : p))
  }

  async function deleteProj(id) {
    console.log(id)
    deleteProject(id)
    setProjectList(projectList.filter(p => p._id !== id))
    if (currentProject._id === id) {
      setCurrentProject(projectList[0])
      localStorage.setItem("project", JSON.stringify(projectList[0]))
    }
  }

  useEffect(() => {
    getProjects()
  }, [])

  return (
    <>
      <TaskHeader
        logout={logout}
        currentProject={currentProject && currentProject}
        projectList={projectList}
        switchProject={switchProject}
        addProject={addProject}
        renameProject={renameProject}
        deleteProj={deleteProj}
      />
      <TaskPage currentProject={currentProject && currentProject._id} />
    </>
  )
}