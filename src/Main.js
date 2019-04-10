import React from "react";
import firebase, { db } from "./firebase";
import { Switch, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Workspace from "./Workspace";

class Main extends React.Component {
  render() {
    return (
      <div>
        <Sidebar wids={this.props.user.workspaces}/>
        <Switch>
          <Route
            path="/workspace/:id"
            render={navProps => <Workspace {...navProps} />}
          />
          <Route
            path="/workspace"
            render={navProps => <Workspace {...navProps} />}
          />
        </Switch>
      </div>
    );
  }
}

export default Main;
