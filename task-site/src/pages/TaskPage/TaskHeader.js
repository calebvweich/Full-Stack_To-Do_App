import { useState } from "react";
import { MdAppRegistration, MdCheckCircle, MdCheckCircleOutline } from "react-icons/md";
import NewProjectDialog from "../../Components/Dialog/Project/NewProject";
export default function TaskHeader({ logout, currentProject, projectList, switchProject, addProject }) {
  const [showList, setShowList] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  return(
    <>
      <header className="appHeader">
        <div className="project">
          <div className="headerText">{currentProject && currentProject.name}</div>
          <div className="headerText projectButton" onClick={() => setShowList(!showList)}><MdAppRegistration /></div>
        </div>
        <div className="logoutButton">
          <button onClick={logout}>Log Out</button>
        </div>
      </header>
      {showList &&
      <div className="projectList">
        {projectList.map(p => {
          return (
            <button key={p._id} className="projectSelect" onClick={() => switchProject(p._id)}>{p.name}{p._id === currentProject._id ? <MdCheckCircle /> : <MdCheckCircleOutline />}</button>
          )
        })}
        <button className="projectSelect" onClick={() => setShowDialog(true)}>New Project</button>
      </div>}
      {showDialog &&
      <NewProjectDialog close={() => setShowDialog(false)} addProject={addProject} />
      }
    </>
  )
}