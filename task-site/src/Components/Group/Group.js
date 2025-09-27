import "./Group.css"

import Task from "../Task/Task"
import Button from "../Button/Button"
import { useState } from "react"
import Dialog from "../Dialog/Dialog"
import { DeleteDialog, DeleteDialogHeader } from "../Dialog/Delete/Delete"

export default function Group({group, tasks, manageMode, statusOptions, taskDeletion, onReorderSteps, onTaskDrop}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteInfo, setDeleteInfo] = useState(null)
  const handleDrop = (type, taskId) => {
    onTaskDrop(type, taskId, group.name);
  };
  return(
    <div
      className="groupContainer"
      onDrop={e => handleDrop(e.dataTransfer.getData("type"), e.dataTransfer.getData("taskId"))}
      onDragOver={e => e.preventDefault()}
    >
      <div className="groupName">
          {group.name}
          {manageMode && <Button text={"A"} onClick={() => setDeleteInfo({"object": group, "type": "group", "extra": null})} />}
      </div>
      <div className="groupedTasks">
        {tasks ? tasks.map((task) => {
          return(
            <Task
              key={task._id}
              task={task}
              manageMode={manageMode}
              statusOptions={statusOptions}
              taskDeletion={taskDeletion}
              onReorderSteps={onReorderSteps}
            />
          )
        })
          :
          <div>None</div>
        }
      </div>
      {deleteInfo &&
        <Dialog
          close={() => setDeleteInfo(null)}
          title={<DeleteDialogHeader toDelete={deleteInfo} />}
          content={<DeleteDialog toDelete={deleteInfo} handleDelete={taskDeletion} close={() => setDeleteInfo(false)} />}
        />
      }
    </div>
  )
}