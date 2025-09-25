import "./Group.css"

import Task from "../Task/Task"
import Button from "../Button/Button"

export default function Group({group, tasks, manageMode, statusOptions, taskDeletion, onReorderSteps}) {
  return(
    <div className="groupContainer">
      <div className="groupName">
          {group.name}
          {manageMode && <Button text={"A"} onClick={() => taskDeletion(group._id, "group")} />}
      </div>
      <div className="groupedTasks">
        {tasks.map((task, index) => {
          return(
            <Task
              key={index}
              task={task}
              manageMode={manageMode}
              statusOptions={statusOptions}
              taskDeletion={taskDeletion}
              onReorderSteps={onReorderSteps}
            />
          )
        })}
      </div>
    </div>
  )
}