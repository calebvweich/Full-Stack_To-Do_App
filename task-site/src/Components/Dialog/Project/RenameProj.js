import { useState } from "react"
import Dialog from "../Dialog"

export default function RenameProjDialog({ close, renameProj, projToRename }) {
  const [name, setName] = useState(projToRename.name)
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
          <button onClick={() => {renameProj(projToRename._id, name); close()}}>Rename</button>
        </div>
      }
    />
  )
}