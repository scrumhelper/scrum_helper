import React from "react";
import firebase, { auth, db } from "./firebase";
import { Link, Switch, Route } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { Menu } from "@material-ui/icons";
import Sidebar from "./Sidebar";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";

import CreateWorkspace from "./CreateWorkspace";
import Sprint from "./Sprint";
import SprintList from "./SprintList";

class Workspace extends React.Component {
  render() {
    return (
      <SprintList
        functions={this.props.functions}
        createSprint={this.createSprint}
        workspace={this.props.workspace}
        sprints={this.props.sprints}
      />
    );
  }
}

export default Workspace;
