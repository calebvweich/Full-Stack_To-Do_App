export default function TaskHeader({ logout, currentProject }) {
  return(
    <header className="appHeader">
      <div className="account">
        <button>Account</button>
        <div className="headerText">{currentProject && currentProject.name}</div>
      </div>
      <div className="logoutButton">
        <button onClick={logout}>Log Out</button>
      </div>
    </header>
    // <div className="projectList">
    //   {projectList.map(p => {
    //     return (
    //       <button key={p._id} onClick={() => switchProject(p._id)}>{p.name}</button>
    //     )
    //   })}
    // </div>
  )
}