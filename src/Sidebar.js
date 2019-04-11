import React from "react";
import { Link } from "react-router-dom";

const WorkspaceElement = ({ workspace }) => {
  return (
    <div className="WorkspaceElement">
      <Link to={`/workspace/${workspace.id}`}>{workspace.name}</Link>
    </div>
  );
};

const Sidebar = ({ workspaces }) => {
  return (
    <div className="Sidebar">
      <h1>Workspaces</h1>
      <ul id="workspaces">
        {workspaces.map((workspace, index) => (
          <WorkspaceElement key={index} workspace={workspace} />
        ))}
        <WorkspaceElement workspace={{ id: "", name: "Create new" }} />
      </ul>
    </div>
  );
};

export default Sidebar;
