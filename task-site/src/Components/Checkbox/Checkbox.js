import "./Checkbox.css"

import { useState } from "react"

export default function Checkbox() {
  const [checked, setChecked] = useState(false)
  return(
    <div className={checked ? "checked" : "checkbox"} onClick={() => setChecked(!checked)}></div>
  )
}