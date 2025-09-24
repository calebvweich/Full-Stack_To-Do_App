import "./Group.css"

import Task from "../Task/Task"

export default function Group({name, tasks, manageMode, statusOptions}) {
  return(
    <div className="groupContainer">
      <div className="groupName">
          {name}
      </div>
      <div className="groupedTasks">
        {tasks.map((task, index) => {
          return(
            <Task
              key={index}
              task={task}
              manageMode={manageMode}
              statusOptions={statusOptions}
            />
          )
        })}
      </div>
    </div>
  )
}