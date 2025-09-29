import Button from "../../Button/Button"
import "./Delete.css"

export function DeleteDialogHeader({ toDelete }) {
  return(
    <div>Delete {toDelete.type}: {toDelete.object.name}?</div>
  )
}

export function DeleteDialog({ toDelete, handleDelete, close }) {
  function deleteObject() {
    handleDelete(toDelete.object._id, toDelete.type, toDelete.extra)
    close()
  }
  return(
    <div>
      <div>
        Are you sure you want to delete this {toDelete.type}?<br/>
        This action cannot be undone.
      </div>
      <div className="buttons">
        <button onClick={() => deleteObject()} className="inputButton">Delete</button>
      </div>
    </div>
  )
}