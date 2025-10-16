import { useState } from "react"
import { login, newProject, register } from "../../api";
import "./LoginPage.css"
import { toast } from "../../Components/Toast/Toast";

function Login({validate}) {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username) {
      toast.error("Username is required");
    } else if (!password) {
      toast.error("Password is required");
    }
    if (username !== "" && password !== "") {
      const res = await login(username.toLowerCase(), password);
      if (res && res.token) {
        validate(res.token);
      } else {
        console.log("Failed: ", res);
      }
    }
  }

  return(
    <form onSubmit={handleSubmit}>
      <label>Email</label><br/>
      <input
        type="email"
        value={username}
        onChange={(e) => setusername(e.target.value)}
      />
      <br/><br/><label>Password</label><br/>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="button">
        <button type="submit">Login</button>
      </div>
    </form>
  )
}
function Register({validate}) {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username) {
      toast.error("Username is required");
    } else if (!username.includes("@") || !username.includes(".")) {
      toast.error("Email must contain @ and .");
    } else if (!name) {
      toast.error("Name is required");
    } else if (!password) {
      toast.error("Password is required");
    } else {
      const res = await register(username.toLowerCase(), name, password);
      if (res && res.token) {
        await validate(res.token)
        const proj = await newProject("Default")
        localStorage.setItem("project", proj)
      } else {
        console.log("Failed: ", res);
      }
    }
  }

  return(
    <form onSubmit={handleSubmit}>
      <label>Email</label><br/>
      <input
        type="text"
        value={username}
        onChange={(e) => setusername(e.target.value)}
      />
      <br/><br/><label>Name</label><br/>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br/><br/><label>Password</label><br/>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="button">
        <button type="submit">Register</button>
      </div>
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