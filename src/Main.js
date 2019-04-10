import React from "react";
import firebase, { db } from "./firebase";
import { Switch, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Workspace from "./Workspace";

class Main extends React.Component {
  render() {
    return (
      <div>
        <Sidebar workspaces={this.props.workspaces} />
        <Switch>
          <Route
            path="/workspace/:wid"
            render={navProps => (
              <Workspace
                functions={this.props.functions}
                workspaces={this.props.workspaces}
                sprints={this.props.sprints}
                {...navProps}
              />
            )}
          />
          <Route
            path="/workspace"
            render={navProps => (
              <Workspace
                functions={this.props.functions}
                workspaces={this.props.workspaces}
                sprints={this.props.sprints}
                {...navProps}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default Main;
