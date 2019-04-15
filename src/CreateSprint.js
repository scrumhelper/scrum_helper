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
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import FindUser from "./FindUser";
import UserList from "./UserList";
import Stepper from "./Stepper";

class CreateSprint extends React.Component {
  state = {
    activeStep: 0,
    scrumMaster: null,
    productOwner: null,
    team: []
  };

  componentDidUpdate(prevProps) {
    if (prevProps.open === false && this.props.open === true) {
      this.setState({
        activeStep: 0,
        scrumMaster: null,
        productOwner: null,
        team: []
      });
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  updateChecked = checked => {
    this.setState({ team: checked });
  };

  getSteps = () => {
    return ["Determine Roles", "Upload Artifacts", "Schedule Events", "Start!"];
  };

  handleNext = () => {
    if (this.state.activeStep + 1 === this.getSteps().length) {
      this.props.functions.create.sprint({
        name: this.state.newName,
        users: this.state.checked
      });
      this.props.handleClose();
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
          <div style={{ display: "flex", flexDirection: "column" }}>
            <FormControl variant="outlined" style={{ minWidth: 120 }}>
              <InputLabel htmlFor="productOwner">Product Owner</InputLabel>
              <Select
                value={this.state.productOwner}
                onChange={this.handleChange}
                inputProps={{
                  name: "productOwner",
                  id: "productOwner"
                }}
              >
                {this.props.users.map(u => (
                  <MenuItem value={u.id} key={u.id}>
                    {u.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl style={{ minWidth: 120 }}>
              <InputLabel htmlFor="scrumMaster">Scrum Master</InputLabel>
              <Select
                value={this.state.scrumMaster}
                onChange={this.handleChange}
                inputProps={{
                  name: "scrumMaster",
                  id: "scrumMaster"
                }}
              >
                {this.props.users.map(u => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div>
              <Typography variant="h5">Select Team Members</Typography>
              <UserList
                users={this.props.users}
                checkable={true}
                updateChecked={this.updateChecked}
              />
            </div>
          </div>
        );
      case 1:
        return <div />;
      case 2:
        return <div />;
      case 3:
        return (
          <div>
            <Typography>{`Your new sprint: ${
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
      <Dialog
        onClose={this.props.handleClose}
        open={this.props.open}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle id="Create Workspace">Create Workspace</DialogTitle>
        <Stepper
          getSteps={this.getSteps}
          getStepContent={this.getStepContent}
          continue={() =>
            this.state.scrumMaster === null ||
            this.state.productOwner === null ||
            this.state.team.length === 0
          }
          activeStep={this.state.activeStep}
          handleNext={this.handleNext}
          handleBack={this.handleBack}
          cancel={this.props.handleClose}
        />
      </Dialog>
    );
  }
}

export default CreateSprint;
