import TaskHeader from "./TaskHeader";
import TaskPage from "./TaskPage";
import { getProjectList } from "../../api";
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
    const newProject = projectList.find(p => p._id === id)
    localStorage.setItem("project", JSON.stringify(newProject))
    setCurrentProject(newProject)
  }

  useEffect(() => {
    getProjects()
  }, [])

  return (
    <>
      <TaskHeader logout={logout} currentProject={currentProject} />
      <TaskPage currentProject={currentProject._id} />
    </>
  )
}