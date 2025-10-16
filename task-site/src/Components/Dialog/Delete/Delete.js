import Dialog from "../Dialog"
import "./Delete.css"

export function DeleteDialog({ toDelete, handleDelete, close }) {
  // toDelete: {object: [object id, name], type: [project/group/task/step], extra: [taskId (for step)]}
  // handleDelete: function to delete object
  // close: function to close dialog
  function deleteObject() {
    handleDelete(toDelete.object._id, toDelete.type, toDelete.extra)
    close()
  }

  return(
    <Dialog
      close={close}
      title={<div>Delete {toDelete.type}: {toDelete.object.name}?</div>}
      content={
        <div>
          <div>
            Are you sure you want to delete this {toDelete.type}?<br/>
            This action cannot be undone.
          </div>
          <div className="buttons">
            <button onClick={() => deleteObject()}>Delete</button>
          </div>
        </div>
      }
    />
  )
}