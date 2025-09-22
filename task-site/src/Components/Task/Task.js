import "./Task.css"

export default function Task({taskName, taskSteps}) {
  return(
    <div className="taskContainer">
      <div className="taskName">{taskName}</div>
    </div>
  )
}