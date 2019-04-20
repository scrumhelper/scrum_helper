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
import WorkspaceList from "./WorkspaceList";
import Workspace from "./Workspace";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workspace: this.newWorkspace(),
      sprints: [],
      left: false
    };
  }

  newWorkspace() {
    return {
      id: null,
      name: "",
      users: [],
      sprints: []
    };
  }

  toggleDrawer = (side, open) => {
    this.setState({
      [side]: open
    });
  };

  createSprint = sprint => {
    db.collection("sprints")
      .add({ id: "sprint 1" })
      // .add({
      //   artifacts: {
      //     productBacklog: null,
      //     sprintBacklog: null,
      //     sprintRetrospective: null,
      //     sprintPlanning: null
      //   },
      //   roles: {
      //     scrumMaster: null,
      //     productOwner: null,
      //     team: [this.state.uid]
      //   },
      //   events: {
      //     sprintReview: null,
      //     dailyScrum: null,
      //     sprintPlanning: null,
      //     sprintRetrospective: null
      //   }
      // })
      .then(docRef => {
        db.collection("sprints")
          .doc(docRef.id)
          .set(
            {
              id: docRef.id
            },
            { merge: true }
          );

        this.addSprintToWorkspace(docRef.id, sprint);
        this.props.functions.load.sprint(docRef.id, () =>
          this.setState({
            sprints: [
              ...this.state.sprints,
              this.props.globals.sprints.find(s => s.id === docRef.id)
            ]
          })
        );
      });
  };

  addSprintToWorkspace = sid => {
    this.setState(
      {
        workspace: {
          ...this.state.workspace,
          sprints: [...this.state.workspace.sprints, sid]
        }
      },
      () => this.props.functions.save.workspace(this.state.workspace)
    );
  };

  componentDidUpdate = () => {
    const newID = this.props.match.params.wid || null;
    const oldID = this.state.workspace.id || null;

    if (newID !== oldID) {
      if (oldID !== null)
        this.props.functions.save.workspace(this.state.workspace);
      if (newID === null)
        this.setState({
          workspace: this.newWorkspace()
        });
      else
        this.setState(
          {
            workspace: this.props.globals.workspaces.find(w => w.id === newID)
          },
          () => {
            if (this.state.workspace !== null) {
              this.setState({
                sprints: this.state.workspace.sprints.map(s =>
                  this.props.globals.sprints.find(sp => sp.id === s)
                )
              });
            } else {
              this.props.history.go("/workspace");
            }
          }
        );
    }
  };

  render() {
    return (
      <div style={{ backgroundColor: "#eee", height: "100vh" }}>
        <AppBar position="sticky">
          <Toolbar style={{ backgroundColor: "black", color: "white" }}>
            <IconButton
              aria-label="Menu"
              color="inherit"
              style={{ marginLeft: -12, marginRight: 20 }}
              onClick={() => this.toggleDrawer("left", true)}
            >
              <Menu />
            </IconButton>
            <Typography style={{ flexGrow: 1 }} color="inherit">
              {this.state.workspace.id === null
                ? "Scrum Helper"
                : this.state.workspace.name}
            </Typography>
            {this.props.user === null ? (
              <Button color="inherit">Login</Button>
            ) : (
              <Button color="inherit" onClick={() => this.props.signOut()}>
                Sign out
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <SwipeableDrawer
          open={this.state.left}
          onClose={() => this.toggleDrawer("left", false)}
          onOpen={() => this.toggleDrawer("left", true)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={() => this.toggleDrawer("left", false)}
            onKeyDown={() => this.toggleDrawer("left", false)}
          >
            <Sidebar
              workspaces={this.props.globals.workspaces}
              close={() => this.toggleDrawer("left", false)}
            />
          </div>
        </SwipeableDrawer>
        <div>
          <Switch>
            <Route
              path={`/workspace/:wid/:sid`}
              render={navProps => (
                <Sprint
                  functions={this.props.functions}
                  globals={this.props.globals}
                  createSprint={this.createSprint}
                  workspace={this.state.workspace}
                  sprints={this.state.sprints}
                  {...navProps}
                />
              )}
            />
            <Route
              path={`/workspace/:wid`}
              render={navProps => (
                <Workspace
                  functions={this.props.functions}
                  globals={this.props.globals}
                  createSprint={this.createSprint}
                  workspace={this.state.workspace}
                  sprints={this.state.sprints}
                  users={[
                    ...this.props.globals.users,
                    this.props.globals.user
                  ].filter(u => this.state.workspace.users.find(v => v  === u.id))}
                  {...navProps}
                />
              )}
            />
            <Route
              path={`/workspace`}
              render={navProps => (
                <WorkspaceList
                  functions={this.props.functions}
                  globals={this.props.globals}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Main;
