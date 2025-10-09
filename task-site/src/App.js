// CSS
import './App.css';

// PAGES
import TaskPage from "./pages/TaskPage/TaskPage"
import LoginPage from './pages/LoginPage/LoginPage';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState } from 'react';
import { useEffect } from 'react';
import { toast, ToastProvider } from './Components/Toast/Toast';
import { newProject } from './api';


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
              <button>Account</button>
              <div className="headerText">Welcome Name</div>
            </div>
            <div className="logoutButton">
              <button onClick={logout}>Log Out</button>
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
