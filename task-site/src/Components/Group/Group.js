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
    </div>
  )
}