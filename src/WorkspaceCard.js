import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Zoom from "@material-ui/core/Zoom";
import Divider from "@material-ui/core/Divider";
import Fab from "@material-ui/core/Fab";
import { Add, Create } from "@material-ui/icons";

import CreateWorkspace from "./CreateWorkspace";
import JoinWorkspace from "./JoinWorkspace";
import UserList from "./UserList";

function WorkspaceCard(workspace) {
  return (
    <Card style={{ minWidth: 275, margin: 20 }}>
      <CardContent>
        <Typography>{`Workspace Name: ${workspace.name}`}</Typography>
        <Typography>{`Workspace ID: ${workspace.id}`}</Typography>
        <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        <Typography>{`Users`}</Typography>
        <UserList
          users={[...workspace.globals.users, workspace.globals.user]}
          uids={workspace.users}
        />
      </CardContent>
      {workspace.link !== false && (
        <CardActions>
          <Link to={`/workspace/${workspace.id}`}>
            <Button>View More</Button>
          </Link>
        </CardActions>
      )}
    </Card>
  );
}

export default WorkspaceCard;
