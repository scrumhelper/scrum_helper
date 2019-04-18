import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

function SprintCard(props) {
  return (
    <Card style={{ minWidth: 275, margin: 20 }}>
      <CardContent>
        <Typography>{`Sprint ID: ${props.sprint.id}`}</Typography>
        <Typography>{"Scrum Master"}</Typography>
        <Typography>{"From: "}</Typography>
        <Typography>{"To: "}</Typography>
      </CardContent>
      <CardActions>
        <Link to={`/workspace/${props.workspace.id}/${props.sprint.id}`}>
          <Button>View More</Button>
        </Link>
      </CardActions>
    </Card>
  );
}

class SprintList extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center"
        }}
      >
        {this.props.sprints.length > 0 ? (
          this.props.sprints.map((s, index) => (
            <SprintCard
              key={index}
              sprint={s}
              workspace={this.props.workspace}
            />
          ))
        ) : (
          <div>
            <Typography>No sprints! Start a new one!</Typography>
          </div>
        )}
      </div>
    );
  }
}

export default SprintList;
