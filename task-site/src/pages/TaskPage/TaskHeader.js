import { useState, useEffect, useRef } from "react";
import { MdAppRegistration, MdCheckCircle, MdCheckCircleOutline } from "react-icons/md";
import NewProjectDialog from "../../Components/Dialog/Project/NewProject";
export default function TaskHeader({ logout, currentProject, projectList, switchProject, addProject }) {
  const [showList, setShowList] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const listRef = useRef(null);
  const showButton = useRef(null);
  function handleAddProject(name) {
    addProject(name);
    setShowList(false);
  }
  function handleSwitch(id) {
    switchProject(id);
    setShowList(false);
  }
  useEffect(() => {
    function handleClickOutside(event) {
      if (listRef.current && !listRef.current.contains(event.target) && !showButton.current.contains(event.target)) {
        setShowList(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return(
    <>
      <header className="appHeader">
        <div className="project">
          <div className="headerText">{currentProject && currentProject.name}</div>
          <div className="headerText projectButton" onClick={() => setShowList(!showList)} ref={showButton}><MdAppRegistration /></div>
        </div>
        <div className="logoutButton">
          <button onClick={logout}>Log Out</button>
        </div>
      </header>
      {showList &&
      <div className="projectList" ref={listRef}>
        {projectList.map(p => {
          return (
            <button key={p._id} className="projectSelect" onClick={() => handleSwitch(p._id)}>{p.name}{p._id === currentProject._id ? <MdCheckCircle /> : <MdCheckCircleOutline />}</button>
          )
        })}
        <button className="projectSelect" onClick={() => setShowDialog(true)}>New Project</button>
        {showDialog &&
        <NewProjectDialog close={() => setShowDialog(false)} addProject={handleAddProject} />
        }
      </div>}
    </>
  )
}