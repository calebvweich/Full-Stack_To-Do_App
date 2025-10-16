import { useState } from "react"
import Dialog from "../Dialog"
import { toast } from "../../Toast/Toast"

export default function RenameProjDialog({ close, renameProj, projToRename }) {
  const [name, setName] = useState(projToRename.name)
  function handleRename() {
    if (!name) {
      toast.error("Name cannot be blank");
    } else if (name === projToRename.name) {
      toast.info("Name unchanged");
      close();
    } else {
      renameProj(projToRename._id, name);
      close();
    }
  }
  return(
    <Dialog
      close={close}
      title={<div>Rename Project</div>}
      content={
        <div className="flex">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={() => handleRename()}>Rename</button>
        </div>
      }
    />
  )
}