import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { Link } from "react-router-dom";

import UserList from "./UserList";
import SprintCard from "./SprintCard";

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
              users={this.props.users}
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
