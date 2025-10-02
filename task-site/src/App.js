// CSS
import './App.css';

// COMPONENTS
import Button from './Components/Button/Button';

// PAGES
import TaskPage from "./pages/TaskPage/TaskPage"
import LoginPage from './pages/LoginPage/LoginPage';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState } from 'react';
import { useEffect } from 'react';
import { toast, ToastProvider } from './Components/Toast/Toast';


function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  //FUNCTIONS
  function logout() {
    localStorage.setItem("token", null)
    setToken(null)
  }

  function login(token) {
    localStorage.setItem("token", token)
    setToken(token)
  }
  
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);
  

  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="app">
          <header className="appHeader">
            <div className="account">
              <Button text={"Account"} onClick={() => toast.info("Account Settings")} />
              <div className="headerText">Welcome Name</div>
            </div>
            <div className="logoutButton">
              <Button text={"Log Out"} onClick={logout} />
            </div>
          </header>
          <Routes>
            <Route path="/" element={token != null ? <Navigate to="/tasks" /> : <LoginPage validate={login} />}/>
            <Route path="/tasks" element={token != null ? <TaskPage /> : <Navigate to="/" />}/>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
