// CSS
import './App.css';

// COMPONENTS
import Button from './Components/Button/Button';

// PAGES
import TaskPage from "./pages/TaskPage/TaskPage"
import LoginPage from './pages/LoginPage/LoginPage';

function App() {

  //FUNCTIONS
  

  return (
    <div className="app">
      <header className="appHeader">
        <div className="account">
          <Button content={"Account"}/>
          <div className="headerText">Welcome Name</div>
        </div>
        <div className="logoutButton">
          <Button content={"LogOut"} />
        </div>
      </header>
      <LoginPage />
    </div>
  );
}

export default App;
