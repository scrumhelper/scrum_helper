import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Zoom from "@material-ui/core/Zoom";
import Fab from "@material-ui/core/Fab";
import { Add, Create } from "@material-ui/icons";

import CreateWorkspace from "./CreateWorkspace";
import JoinWorkspace from "./JoinWorkspace";
import WorkspaceCard from "./WorkspaceCard";

class WorkspaceList extends React.Component {
  state = {
    create: false,
    join: false
  };

  createWorkspace = () => {
    this.setState({ create: true });
  };

  joinWorkspace = () => {
    this.setState({ join: true });
  };

  handleCloseJoin = () => {
    this.setState({ join: false });
  };

  handleCloseCreate = () => {
    this.setState({ create: false });
  };

  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          {this.props.globals.workspaces
            .filter(w => w.users.find(u => u === this.props.globals.user.id))
            .map((w, index) => (
              <WorkspaceCard key={index} {...w} />
            ))}
        </div>
        <Zoom in={true} style={{ position: "fixed", bottom: 20, right: 20 }}>
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              flexWrap: "nowrap",
              justifyContent: "right"
            }}
          >
            <Fab
              variant="extended"
              color="primary"
              onClick={this.joinWorkspace}
              style={{ margin: 8 }}
            >
              <Add /> Join Workspace
            </Fab>
            <Fab
              variant="extended"
              color="primary"
              onClick={this.createWorkspace}
              style={{ margin: 8 }}
            >
              <Create /> Create Workspace
            </Fab>
          </div>
        </Zoom>
        <CreateWorkspace
          globals={this.props.globals}
          functions={this.props.functions}
          handleClose={this.handleCloseCreate}
          open={this.state.create}
        />
        <JoinWorkspace
          globals={this.props.globals}
          functions={this.props.functions}
          handleClose={this.handleCloseJoin}
          open={this.state.join}
        />
      </div>
    );
  }
}

export default WorkspaceList;
