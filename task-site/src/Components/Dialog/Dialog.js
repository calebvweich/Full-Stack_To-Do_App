import "./Dialog.css"

export default function Dialog({ close, title, content }) {
  return(
    <div>
      <div className="background" onClick={close} />
      <div className="dialogContainer">
        <div className="dialogHeader">
          {title}
          <div className="closeIcon" onClick={close}>X</div>
        </div>
        <div className="dialogContent">
          {content}
        </div>
      </div>
    </div>
  )
}