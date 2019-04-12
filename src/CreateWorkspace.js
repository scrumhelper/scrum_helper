import React from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepContent from "@material-ui/core/StepContent";
import StepLabel from "@material-ui/core/StepLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";

import FindUser from "./FindUser";
import UserList from "./UserList";

class CreateWorkspace extends React.Component {
  state = {
    newName: "",
    newID: "",
    checked: [],
    activeStep: 0
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  updateChecked = checked => {
    this.setState({ checked });
  };

  getSteps = () => {
    return ["Choose a workspace name", "Invite users", "Create!"];
  };

  handleNext = () => {
    if (this.state.activeStep + 1 === this.getSteps().length) {
      this.props.functions.create.workspace({
        name: this.state.newName,
        users: this.state.checked
      });
      this.props.callback();
    } else {
      this.setState({
        activeStep: this.state.activeStep + 1
      });
    }
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1
    });
  };

  getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <div>
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
          </div>
        );
      case 1:
        return (
          <div>
            <UserList
              checkable={true}
              updateChecked={this.updateChecked}
              users={this.props.globals.users}
            />
            <FindUser functions={this.props.functions} />
          </div>
        );
      case 2:
        return (
          <div>
            <Typography>{`Your new workspace: ${
              this.state.newName
            }`}</Typography>
            <Typography>{"Users"}</Typography>
            <UserList
              users={this.props.globals.users}
              uids={this.state.checked}
            />
          </div>
        );
    }
  };

  render() {
    const steps = this.getSteps();
    return (
      <div>
        <Stepper orientation="vertical" activeStep={this.state.activeStep}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <div>
                  <div>{this.getStepContent(this.state.activeStep)}</div>
                  <div>
                    <Button color="secondary" onClick={this.props.callback}>
                      Cancel
                    </Button>
                    <Button
                      disabled={this.state.activeStep === 0}
                      onClick={this.handleBack}
                    >
                      Back
                    </Button>
                    <Button
                      disabled={
                        this.state.activeStep === 0 && this.state.newName === ""
                      }
                      color="primary"
                      variant="contained"
                      onClick={this.handleNext}
                    >
                      {this.state.activeStep === steps.length - 1
                        ? "Create"
                        : "Next"}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        <div>
          {this.state.activeStep === steps.length && (
            <div>
              <Typography>All steps completed</Typography>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CreateWorkspace;
