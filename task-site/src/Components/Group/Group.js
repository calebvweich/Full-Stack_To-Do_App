import "./Group.css"

import Task from "../Task/Task"
import Button from "../Button/Button"
import { useState } from "react"
import { DeleteDialog } from "../Dialog/Delete/Delete"
import { MdDeleteOutline } from "react-icons/md";

export default function Group({group, manageMode, groupDeletion, onTaskDrop, children}) {
  const [deleteInfo, setDeleteInfo] = useState(null)
  const handleDrop = (e, type, taskId) => {
    e.stopPropagation()
    onTaskDrop(type, taskId, group.name);
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
          {manageMode && <Button text={<MdDeleteOutline />} onClick={() => setDeleteInfo({"object": group, "type": "group", "extra": null})} />}
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