import "./Button.css"

export default function Button({text, onClick}) {
  return(
    <div className="buttonContainer" onClick={onClick}>
      <div className="buttonText">{text}</div>
    </div>
  )
}