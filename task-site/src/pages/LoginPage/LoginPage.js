import { useState } from "react"
import "./LoginPage.css"

function Login() {
  return(
    <div>Login</div>
  )
}
function Register() {
  return(
    <div>Register</div>
  )
}

export default function LoginPage() {
  const [selectedTab, setSelectedTab] = useState("Login")
  return(
    <div className="loginContainer">
      <div className="loginHeader">
        <div className={selectedTab === "Login" ? "selected loginHeaderText" : "loginHeaderText"} onClick={() => setSelectedTab("Login")}>Login</div>
        <div className={selectedTab === "Register" ? "selected loginHeaderText" : "loginHeaderText"} onClick={() => setSelectedTab("Register")}>Register</div>
      </div>
      {selectedTab === "Login" ? (
        <Login />
      ) : (
        <Register />
      )}
    </div>
  )
}