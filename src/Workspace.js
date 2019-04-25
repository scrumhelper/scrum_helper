import React from "react";
import firebase, { auth, db } from "./firebase";
import { Link, Switch, Route } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { Menu, ExitToApp } from "@material-ui/icons";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Paper from "@material-ui/core/Paper";

import Sidebar from "./Sidebar";
import CreateWorkspace from "./CreateWorkspace";
import Sprint from "./Sprint";
import SprintList from "./SprintList";
import UserList from "./UserList";
import Zoom from "@material-ui/core/Zoom";
import Fab from "@material-ui/core/Fab";
import { Add } from "@material-ui/icons";
import CreateSprint from "./CreateSprint";

class Workspace extends React.Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <div style={{ padding: 20 }}>
          <Typography variant="h5">Users</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              fetch(
                "https://us-central1-scrum-helper-73afc.cloudfunctions.net/leaveGroup",
                {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    workspace: this.props.workspace.id,
                    user: this.props.globals.user.id
                  })
                }
              );

              this.props.functions.leave.workspace(this.props.workspace.id);
              this.props.history.push("/workspace");
            }}
          >
            <ExitToApp />
            Leave Workspace
          </Button>
          <UserList users={this.props.users} />
          <Typography variant="h5">Sprints</Typography>
          <SprintList
            functions={this.props.functions}
            workspace={this.props.workspace}
            users={this.props.users}
            sprints={this.props.sprints}
          />
        </div>
        <Zoom in={true} style={{ position: "fixed", bottom: 20, right: 20 }}>
          <Fab variant="extended" color="primary" onClick={this.handleOpen}>
            <Add /> Create Sprint
          </Fab>
        </Zoom>
        <CreateSprint
          globals={this.props.globals}
          functions={this.props.functions}
          createSprint={this.props.createSprint}
          handleClose={this.handleClose}
          open={this.state.open}
          users={this.props.users}
          workspace={this.props.workspace}
        />
      </div>
    );
  }
}

export default Workspace;
