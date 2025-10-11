// CSS
import './App.css';

// PAGES
import LoginPage from './pages/LoginPage/LoginPage';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import { toast, ToastProvider } from './Components/Toast/Toast';
import TaskLayout from './pages/TaskPage/TaskLayout';


function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  
  //FUNCTIONS
  function logout() {
    localStorage.clear()
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
          <Routes>
            <Route path="/" element={token !== null ? <Navigate to="/tasks" /> : <LoginPage validate={login} />}/>
            <Route path="/tasks" element={token !== null ? <TaskLayout logout={logout} /> : <Navigate to="/" />}/>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
