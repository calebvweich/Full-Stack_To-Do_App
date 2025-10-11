import "./Group.css"

import { useState } from "react"
import { DeleteDialog } from "../Dialog/Delete/Delete"
import { MdDeleteOutline } from "react-icons/md";

export default function Group({group, manageMode, groupDeletion, onTaskDrop, children}) {
  const [deleteInfo, setDeleteInfo] = useState(null)
  const handleDrop = (e, type, taskId) => {
    e.stopPropagation()
    onTaskDrop(type, taskId, group._id);
  };
  return(
    <div
      className="groupContainer"
    >
      <div className="groupName"
        onDrop={e => handleDrop(e, e.dataTransfer.getData("type"), e.dataTransfer.getData("taskId"))}
        onDragOver={e => e.preventDefault()}
      >
          {group.name}
          {manageMode && <button onClick={() => setDeleteInfo({"object": group, "type": "group", "extra": null})}><MdDeleteOutline /></button>}
      </div>
      <div className="groupedTasks"
        onDrop={e => handleDrop(e, e.dataTransfer.getData("type"), e.dataTransfer.getData("taskId"))}
        onDragOver={e => e.preventDefault()}
      >
        {children}
      </div>
      {deleteInfo &&
        <DeleteDialog
          toDelete={deleteInfo}
          handleDelete={groupDeletion}
          close={() => setDeleteInfo(null)}
        />
      }
    </div>
  )
}