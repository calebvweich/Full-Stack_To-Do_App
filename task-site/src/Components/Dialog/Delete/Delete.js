import Dialog from "../Dialog"
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
    <Dialog
      close={close}
      title={<DeleteDialogHeader toDelete={toDelete} />}
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