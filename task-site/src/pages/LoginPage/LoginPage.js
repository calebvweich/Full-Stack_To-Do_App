import { useState } from "react"
import { login, register } from "../../api";
import "./LoginPage.css"

function Login({validate}) {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await login(username, password);
    if (res.token) {
      validate(res.token)
    } else {
      console.log("Failed: ", res);
    }
  }

  return(
    <form onSubmit={handleSubmit}>
      <label>Email</label><br/>
      <input
        type="username"
        value={username}
        onChange={(e) => setusername(e.target.value)}
      />
      <br/><label>Password</label><br/>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br/><button type="submit">Login</button>
    </form>
  )
}
function Register({validate}) {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await register(username, name, password);
    if (res.token) {
      validate(res.token)
    } else {
      console.log("Failed: ", res);
    }
  }

  return(
    <form onSubmit={handleSubmit}>
      <label>Email</label><br/>
      <input
        type="username"
        value={username}
        onChange={(e) => setusername(e.target.value)}
      />
      <br/><label>Name</label><br/>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br/><label>Password</label><br/>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br/><button type="submit">Login</button>
    </form>
  )
}

export default function LoginPage({validate}) {
  const [selectedTab, setSelectedTab] = useState("Login")
  return(
    <div className="loginContainer">
      <div className="loginHeader">
        <div className={selectedTab === "Login" ? "selected loginHeaderText" : "loginHeaderText"} onClick={() => setSelectedTab("Login")}>Login</div>
        <div className={selectedTab === "Register" ? "selected loginHeaderText" : "loginHeaderText"} onClick={() => setSelectedTab("Register")}>Register</div>
      </div>
      {selectedTab === "Login" ? (
        <Login validate={validate} />
      ) : (
        <Register validate={validate} />
      )}
    </div>
  )
}