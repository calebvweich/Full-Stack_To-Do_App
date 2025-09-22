// CSS
import './TaskPage.css';

// COMPONENTS
import Button from '../../Components/Button/Button';
import Task from '../../Components/Task/Task';
import Group from '../../Components/Group/Group';

// DATA
import tasks from '../../data/exampleTask.json'
import groups from '../../data/groupExample.json'

// LIBRARIES
import { useState } from 'react';

export default function TaskPage() {
  // VARIABLES
  const [selectedGroup, setSelectedGroup] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const groupNames = []
  groups.forEach(group => {
    groupNames.push(group.name)
  });
  const statusOptions = ["Not-Started", "In-Progress", "Completed", "On-Hold"]

  //FUNCTIONS
  

  return (
    <div className="body">
      <div className="options">
        <div className="filters">
          <div className="filterType">
            Group Name
            <div className="filters">
              {groupNames.map((name, index) => {
                return(
                  <Button key={index} content={name} />
                )
              })}
            </div>
          </div>
          <div className="filterType">
            Status
            <div className="filters">
              {statusOptions.map((name, index) => {
                return(
                  <Button key={index} content={name} />
                )
              })}
            </div>
          </div>
        </div>
        <div className="newButton">
          New Task/Group
          <Button content={"+"} />
        </div>
      </div>
      <div className="taskArea">
        {groups.map((group, index) => {
          return(
            <Group key={index} name={group.name} tasks={tasks.filter(task => task.group === group._id)}/>
          )
        })}
        {tasks.filter(task => task.group === "none").map((task, index) => {
          return(
            <Task key={index} task={task} />
          )
        })}
      </div>
    </div>
  );
}
