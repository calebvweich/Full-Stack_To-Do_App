import "./Button.css"

export default function Button({content}) {
  return(
    <div className="buttonContainer">
      <div className="buttonText">{content}</div>
    </div>
  )
}