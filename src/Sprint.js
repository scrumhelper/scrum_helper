import React from "react";
import { Link, Switch, Route } from "react-router-dom";
import { pdfjs, Document, Page } from "react-pdf";
// import ApiCalendar from "react-google-calendar-api";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import Calendar from "./Calendar";
import UserList from "./UserList";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;

class Sprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sprint: this.newSprint(),
      numPagesSprint: null,
      pageNumberSprint: 1,
      numPagesProduct: null,
      pageNumberProduct: 1
    };
  }

  newSprint() {
    return {
      id: null,
      scrumMaster: "",
      productOwner: "",
      team: [],
      productBacklog: null,
      sprintBacklog: null,
      openSprintBacklog: false,
      openProductBacklog: false,
      sprintReview: new Date(),
      sprintRetrospective: new Date(),
      sprintPlanning: new Date(),
      dailyScrum: new Date()
    };
  }

  componentDidMount = () => {
    this.update();
  };

  componentDidUpdate = () => {
    this.update();
  };

  update = () => {
    const newID = this.props.match.params.sid || null;
    const oldID = this.state.sprint.id || null;

    if (newID !== oldID) {
      if (oldID !== null) this.props.functions.save.sprint(this.state.sprint);
      if (newID === null) this.setState({ sprint: this.newSprint() });
      else {
        this.setState({ sprint: this.props.sprints.find(s => s.id === newID) });
      }
    }
  };

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

  onProductDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPagesProduct: numPages });
  };

  onSprintDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPagesSprint: numPages });
  };

  render() {
    return (
      <div>
        <Paper>
          <div style={{ padding: 20 }}>
            <Typography variant="h3">{this.state.sprint.name}</Typography>
            <Typography variant="h4">Roles</Typography>
            <Typography variant="h5">Scrum Master</Typography>
            <UserList
              users={this.props.users}
              uids={[this.state.sprint.scrumMaster]}
            />
            <Typography variant="h5">Product Owner</Typography>
            <UserList
              users={this.props.users}
              uids={[this.state.sprint.productOwner]}
            />
            <Typography variant="h5">Current Team</Typography>
            <UserList users={this.props.users} uids={this.state.sprint.team} />
            <Typography variant="h4">Events</Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <Calendar
                  dates={[
                    this.state.sprint.sprintPlanning,
                    this.state.sprint.sprintReview,
                    this.state.sprint.sprintRetrospective
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
                    {this.dateFormatter(this.state.sprint.sprintPlanning)}
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
                    this.state.sprint.dailyScrum
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
                    {this.dateFormatter(this.state.sprint.sprintReview)}
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
                    {this.dateFormatter(this.state.sprint.sprintRetrospective)}
                  </Typography>
                </Card>
              </div>
            </div>
            <Typography variant="h4">Artifacts</Typography>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <Typography variant="h6">Product Backlog</Typography>
              <div
                style={{
                  display: "flex",
                  height: "100vh",
                  width: "100vw",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column"
                }}
              >
                <Document
                  file={this.state.sprint.productBacklog}
                  onLoadSuccess={this.onProductDocumentLoadSuccess}
                  onItemClick={({ pageNumber }) =>
                    this.setState({ pageNumberProduct: pageNumber++ })
                  }
                >
                  <Page pageNumber={this.state.pageNumberProduct} />
                </Document>
                <div>
                  <Typography>{`Page ${this.state.pageNumberProduct} of ${
                    this.state.numPagesProduct
                  }`}</Typography>
                  <Button
                    variant="contained"
                    onClick={() =>
                      this.setState({
                        pageNumberProduct:
                          this.state.pageNumberProduct - 1 > 0
                            ? this.state.pageNumberProduct - 1
                            : this.state.pageNumberProduct
                      })
                    }
                  >
                    Previous Page
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() =>
                      this.setState({
                        pageNumberProduct:
                          this.state.pageNumberProduct + 1 <=
                          this.state.numPagesProduct
                            ? this.state.pageNumberProduct + 1
                            : this.state.pageNumberProduct
                      })
                    }
                  >
                    Next Page
                  </Button>
                </div>
              </div>
              <Typography variant="h6">Sprint Backlog</Typography>
              <div
                style={{
                  display: "flex",
                  height: "100vh",
                  width: "100vw",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column"
                }}
              >
                <Document
                  file={this.state.sprint.sprintBacklog}
                  onLoadSuccess={this.onSprintDocumentLoadSuccess}
                  onItemClick={({ pageNumber }) =>
                    this.setState({ pageNumberSprint: pageNumber++ })
                  }
                >
                  <Page pageNumber={this.state.pageNumberSprint} />
                </Document>
                <div>
                  <Typography>{`Page ${this.state.pageNumberSprint} of ${
                    this.state.numPagesSprint
                  }`}</Typography>
                  <Button
                    variant="contained"
                    onClick={() =>
                      this.setState({
                        pageNumberSprint:
                          this.state.pageNumberSprint - 1 > 0
                            ? this.state.pageNumberSprint - 1
                            : this.state.pageNumberSprint
                      })
                    }
                  >
                    Previous Page
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() =>
                      this.setState({
                        pageNumberSprint:
                          this.state.pageNumberSprint + 1 <=
                          this.state.numPagesSprint
                            ? this.state.pageNumberSprint + 1
                            : this.state.pageNumberSprint
                      })
                    }
                  >
                    Next Page
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default Sprint;
