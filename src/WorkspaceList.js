import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Zoom from "@material-ui/core/Zoom";
import Fab from "@material-ui/core/Fab";
import { Add } from "@material-ui/icons";
import CreateWorkspace from "./CreateWorkspace";

function WorkspaceCard(props) {
  return (
    <Card style={{ minWidth: 275, margin: 20 }}>
      <CardContent>
        <Typography>{`Workspace Name: ${props.workspace.name}`}</Typography>
        <Typography>{`Workspace ID: ${props.workspace.id}`}</Typography>
      </CardContent>
      <CardActions>
        <Link to={`/workspace/${props.workspace.id}`}>
          <Button>View More</Button>
        </Link>
      </CardActions>
    </Card>
  );
}

class WorkspaceList extends React.Component {
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
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          {this.props.globals.workspaces.map((w, index) => (
            <WorkspaceCard key={index} workspace={w} />
          ))}
        </div>
        <Zoom in={true} style={{ position: "fixed", bottom: 20, right: 20 }}>
          <Fab variant="extended" color="primary" onClick={this.handleOpen}>
            <Add /> Create Workspace
          </Fab>
        </Zoom>
        <CreateWorkspace
          globals={this.props.globals}
          functions={this.props.functions}
          handleClose={this.handleClose}
          open={this.state.open}
        />
      </div>
    );
  }
}

export default WorkspaceList;
