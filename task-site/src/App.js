// CSS
import './App.css';

// COMPONENTS
import Button from './Components/Button/Button';

// PAGES
import TaskPage from "./pages/TaskPage/TaskPage"

function App() {

  //FUNCTIONS
  

  return (
    <div className="app">
      <header className="appHeader">
        <div className="account">
          <Button content={"Account"}/>
          <div className="headerText">Welcome Name</div>
        </div>
        <div className="newTask">
          <Button content={"+"} />
        </div>
      </header>
      <TaskPage />
    </div>
  );
}

export default App;
