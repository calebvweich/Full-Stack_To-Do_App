import './App.css';
import Button from './Components/Button/Button';
import Task from './Components/Task/Task';

function App() {
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
      <div className="taskArea">
        <Task taskName={"Task manager app"}/>
      </div>
    </div>
  );
}

export default App;
