import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { Link } from "react-router-dom";

import UserList from "./UserList";

export default function SprintCard(props) {
  return (
    <Card style={{ minWidth: 275, margin: 20 }}>
      <CardContent>
        <Typography variant="h6">{props.sprint.name}</Typography>

        <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        <Typography>Scrum Master</Typography>
        <UserList users={props.users} uids={[props.sprint.scrumMaster]} />
        <Typography>Product Owner</Typography>
        <UserList users={props.users} uids={[props.sprint.productOwner]} />

        <Typography>{`From: ${props.sprint.sprintPlanning.getMonth()}/${props.sprint.sprintPlanning.getDate()}`}</Typography>
        <Typography>{`To: ${props.sprint.sprintRetrospective.getMonth()}/${props.sprint.sprintRetrospective.getDate()}`}</Typography>
      </CardContent>
      {props.link != false && (
        <CardActions>
          <Link to={`/workspace/${props.workspace.id}/${props.sprint.id}`}>
            <Button>View More</Button>
          </Link>
        </CardActions>
      )}
    </Card>
  );
}
