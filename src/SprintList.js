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
      <div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          {this.props.sprints.map((s, index) => (
            <SprintCard
              key={index}
              sprint={s}
              workspace={this.props.workspace}
            />
          ))}
        </div>
        <Zoom in={true} style={{position: 'fixed', bottom: 20, right: 20}}>
          <Fab variant="extended" color="primary">
            <Add /> Create Sprint
          </Fab>
        </Zoom>
      </div>
    );
  }
}

export default SprintList;
