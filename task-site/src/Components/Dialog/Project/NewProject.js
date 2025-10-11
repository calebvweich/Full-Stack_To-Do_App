import { useState } from "react"
import Dialog from "../Dialog"

function NewProjectHeader() {
  return(
    <div>New Project</div>
  )
}

export default function NewProjectDialog({ close, addProject }) {
  const [name, setName] = useState("")
  return(
    <Dialog
      close={close}
      title={<NewProjectHeader />}
      content={
        <div className="flex">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={() => {addProject(name); close()}}>Add</button>
        </div>
      }
    />
  )
}