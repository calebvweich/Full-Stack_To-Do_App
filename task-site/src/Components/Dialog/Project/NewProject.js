import { useState } from "react"
import Dialog from "../Dialog"
import { toast } from "../../Toast/Toast"

export default function NewProjectDialog({ close, addProject }) {
  const [name, setName] = useState("")
  function handleSubmit() {
    if (!name) {
      toast.error("Name is required");
    } else {
      addProject(name);
      close();
    }
  }
  return(
    <Dialog
      close={close}
      title={<div>New Project</div>}
      content={
        <div className="flex">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={() => handleSubmit()}>Add</button>
        </div>
      }
    />
  )
}