import React from "react";
import { Link, Switch, Route } from "react-router-dom";
import ApiCalendar from "react-google-calendar-api";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import Calendar from "./Calendar";
import UserList from "./UserList";

class Sprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.newSprint()
    };
  }

  newSprint() {
    return {
      id: null
    };
  }

  componentDidUpdate() {
    // const newID = this.props.match.params.sid || null;
    // const oldID = this.state.sprint.id || null;
    // if (newID !== oldID) {
    //   if (oldID !== null) this.props.functions.save.sprint(this.state.sprint);
    //   if (newID === null)
    //     this.setState({
    //       sprint: this.newSprint()
    //     });
    //   else
    //     this.setState({
    //       sprint: this.props.sprints.find(s => s.id === newID)
    //     });
    // }
  }

  dateFormatter = date => {
    let dateNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    return `${
      dateNames[date.getDay()]
    } the ${date.getDate()} of ${new Intl.DateTimeFormat("en-US", {
      month: "long"
    }).format(date)} at ${this.timeFormatter(date)}`;
  };

  timeFormatter = date => {
    return `${date.getHours()}:${
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    }`;
  };

  render() {
    return (
      <div>
        <Paper>
          <div style={{ padding: 20 }}>
            <Typography variant="h3">{this.props.name}</Typography>
            <Typography variant="h4">Roles</Typography>
            <Typography variant="h5">Scrum Master</Typography>
            <UserList
              users={this.props.users}
              uids={[this.props.scrumMaster]}
            />
            <Typography variant="h5">Product Owner</Typography>
            <UserList
              users={this.props.users}
              uids={[this.props.productOwner]}
            />
            <Typography variant="h5">Current Team</Typography>
            <UserList users={this.props.users} uids={this.props.team} />
            <Typography variant="h4">Events</Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <Calendar
                  dates={[
                    this.props.sprintPlanning,
                    this.props.sprintReview,
                    this.props.sprintRetrospective
                  ]}
                />
              </div>
              <div>
                <Card
                  style={{
                    margin: 10,
                    padding: 20,
                    borderWidth: 3,
                    borderStyle: "solid",
                    borderColor: "#0000cc"
                  }}
                >
                  <Typography>Sprint Planning</Typography>
                  <Typography>
                    {this.dateFormatter(this.props.sprintPlanning)}
                  </Typography>
                </Card>
                <Card
                  style={{
                    margin: 10,
                    padding: 20,
                    borderWidth: 3,
                    borderStyle: "solid",
                    borderColor: "#000000"
                  }}
                >
                  <Typography>Daily Scrum</Typography>
                  <Typography>{`Everyday at ${this.timeFormatter(
                    this.props.dailyScrum
                  )}`}</Typography>
                </Card>
                <Card
                  style={{
                    margin: 10,
                    padding: 20,
                    borderWidth: 3,
                    borderStyle: "solid",
                    borderColor: "#cc0000"
                  }}
                >
                  <Typography>Sprint Review</Typography>
                  <Typography>
                    {this.dateFormatter(this.props.sprintReview)}
                  </Typography>
                </Card>
                <Card
                  style={{
                    margin: 10,
                    padding: 20,
                    borderWidth: 3,
                    borderStyle: "solid",
                    borderColor: "#00cc00"
                  }}
                >
                  <Typography>Sprint Retrospective</Typography>
                  <Typography>
                    {this.dateFormatter(this.props.sprintRetrospective)}
                  </Typography>
                </Card>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default Sprint;
