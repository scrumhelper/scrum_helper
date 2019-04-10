import React from "react";

const WorkspaceElement = ({ wid }) => {
  return (
    <div className="WorkspaceElement">
      <h1>wid</h1>
    </div>
  );
};

const Sidebar = ({ wids }) => {
  return (
    <div className="Sidebar">
      <h1>Workspaces</h1>
      <ul id="workspaces">
        {wids.map((wid, index) => (
          <WorkspaceElement key={index} wid={wid} />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
