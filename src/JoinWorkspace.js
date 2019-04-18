import React from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

import UserList from "./UserList";
import Stepper from "./Stepper";
import WorkspaceCard from "./WorkspaceCard";

class JoinWorkspace extends React.Component {
  state = {
    newID: "",
    activeStep: 0,
    workspace: null
  };

  componentDidUpdate(prevProps) {
    if (prevProps.open === false && this.props.open === true) {
      this.setState({
        newID: "",
        activeStep: 0,
        workspace: null
      });
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  getSteps = () => {
    return ["Enter in workspace id", "Join!"];
  };

  handleNext = () => {
    if (this.state.activeStep == 0) {
      this.props.functions.load.workspace(this.state.newID, () => {
        const ws = this.props.globals.workspaces.find(
          w => w.id === this.state.newID
        );
        if (ws) {
          this.setState({
            activeStep: this.state.activeStep + 1,
            workspace: ws
          });
        }
      });
    } else if (this.state.activeStep + 1 === this.getSteps().length) {
      this.props.functions.add.workspace(this.state.newID);
      this.props.handleClose();
    } else {
      this.setState({
        activeStep: this.state.activeStep + 1
      });
    }
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
      newID: ""
    });
  };

  getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <div>
            <TextField
              id="newWorkspace"
              name="newWorkspace"
              label="Workspace id"
              required={true}
              onChange={this.handleChange("newID")}
              margin="normal"
              variant="outlined"
            />
          </div>
        );
      case 1:
        return (
          <div>
            <Typography>{`Workspace you are joining:`}</Typography>
            <WorkspaceCard {...this.state.workspace} link={false}/>
          </div>
        );
    }
  };

  render() {
    const steps = this.getSteps();
    return (
      <Dialog onClose={this.props.handleClose} open={this.props.open}>
        <DialogTitle>Join Workspace</DialogTitle>
        <Stepper
          getSteps={this.getSteps}
          getStepContent={this.getStepContent}
          handleNext={this.handleNext}
          handleBack={this.handleBack}
          activeStep={this.state.activeStep}
          continueDisabled={() =>
            this.state.activeStep === 0 && this.state.newID === ""
          }
          cancel={this.props.handleClose}
        />
      </Dialog>
    );
  }
}

export default JoinWorkspace;
