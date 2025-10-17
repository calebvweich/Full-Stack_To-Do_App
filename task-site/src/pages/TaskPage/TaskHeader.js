import { useState, useEffect, useRef } from "react";
import { MdAppRegistration, MdCheckCircle, MdCheckCircleOutline, MdEditSquare, MdDeleteOutline } from "react-icons/md";
import NewProjectDialog from "../../Components/Dialog/Project/NewProject";
import RenameProjDialog from "../../Components/Dialog/Project/RenameProj";
import { DeleteDialog } from "../../Components/Dialog/Delete/Delete";
export default function TaskHeader({ logout, currentProject, projectList, switchProject, addProject, renameProject, deleteProj }) {
  const [showList, setShowList] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [projToRename, setProjToRename] = useState(null);
  const [deleteInfo, setDeleteInfo] = useState(null)
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
            <div className="projectSelect" key={p._id}>
              <button className="projectSelect" onClick={() => handleSwitch(p._id)}>
                {p._id === currentProject._id ? <MdCheckCircle /> : <MdCheckCircleOutline />}{p.name}
              </button>
              <span className="flex">
                <button className="projectSelect" onClick={() => setProjToRename(p)}>{<MdEditSquare />}</button>
                <button className="projectSelect" onClick={() => setDeleteInfo(p)}>{<MdDeleteOutline />}</button>
              </span>
            </div>
          )
        })}
        <button className="projectSelect" onClick={() => setShowNewDialog(true)}>New Project</button>
        {showNewDialog &&
        <NewProjectDialog close={() => setShowNewDialog(false)} addProject={handleAddProject} />
        }
        {projToRename &&
        <RenameProjDialog close={() => setProjToRename(null)} renameProj={renameProject} projToRename={projToRename} />
        }
        {deleteInfo &&
        <DeleteDialog toDelete={{ object: deleteInfo, type: "project" }} handleDelete={deleteProj} close={() => setDeleteInfo(null)} />
        }
      </div>}
    </>
  )
}