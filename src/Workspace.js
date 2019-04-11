import React from "react";
import firebase, { auth, db } from "./firebase";
import { Link, Switch, Route } from "react-router-dom";
import TextField from "@material-ui/core/TextField";

import Sprint from "./Sprint";

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workspace: this.newWorkspace(),
      sprints: [],
      newName: "",
      newID: ""
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
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
              this.props.sprints.find(s => s.id == docRef.id)
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

  newWorkspace() {
    return {
      id: null,
      name: "",
      users: [],
      sprints: []
    };
  }

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
            workspace: this.props.workspaces.find(w => w.id == newID)
          },
          () => {
            this.setState({
              sprints: this.state.workspace.sprints.map(s =>
                this.props.sprints.find(sp => sp.id == s)
              )
            });
          }
        );
    }
  };

  render() {
    if (this.state.workspace.id == null) {
      return (
        <div>
          <form
            onSubmit={event => {
              event.preventDefault();
              console.log(this.state.newName);
              this.props.functions.create.workspace(this.state.newName);
            }}
          >
            <div>Create a new workspace!</div>
            <TextField
              id="name"
              name="name"
              label="Workspace Name"
              required={true}
              onChange={this.handleChange("newName")}
              margin="normal"
              variant="outlined"
              inputProps={{ name: this.state.newName }}
            />
            <button>Create</button>
          </form>
          <form
            onSubmit={event => {
              event.preventDefault();
              console.log(this.state.newID);
              this.props.functions.add.workspace(this.state.newID);
            }}
          >
            <div>Join a workspace!</div>
            <TextField
              id="id"
              name="id"
              required={true}
              label="Workspace ID"
              onChange={this.handleChange("newID")}
              margin="normal"
              variant="outlined"
              inputProps={{ id: this.state.newID }}
            />
            <button>Join</button>
          </form>
        </div>
      );
    }
    return (
      <div>
        <Switch>
          <Route
            path={`/workspace/${this.state.workspace.id}/:sid`}
            render={navProps => (
              <Sprint
                functions={this.props.functions}
                createSprint={this.createSprint}
                workspace={this.state.workspace}
                sprints={this.state.sprints}
                {...navProps}
              />
            )}
          />
          }
          <Route
            path={`/workspace/${this.state.workspace.id}`}
            render={navProps => (
              <Sprint
                functions={this.props.functions}
                createSprint={this.createSprint}
                workspace={this.state.workspace}
                sprints={this.state.sprints}
                {...navProps}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default Workspace;
