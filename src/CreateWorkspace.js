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
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";

class CreateWorkspace extends React.Component {
  state = {
    newName: "",
    newID: "",
    newUser: "",
    checked: [],
    activeStep: 0,
    open: false
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  handleToggle = id => {
    const currentIndex = this.state.checked.indexOf(id);
    const newChecked = [...this.state.checked];

    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({ checked: newChecked });
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
            <List>
              {this.props.globals.users.map((u, index) => (
                <ListItem key={index} button>
                  {/*<ListItemAvatar>
                    <ListItemAvatar alt={`Avatar`} />
                  </ListItemAvatar>*/}
                  <ListItemText primary={u.name} />
                  <ListItemSecondaryAction>
                    <Checkbox
                      onChange={() => this.handleToggle(u.id)}
                      checked={this.state.checked.indexOf(u.id) !== -1}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <div>
              <div>
                <TextField
                  id="newUser"
                  name="newUser"
                  label="User id"
                  required={true}
                  onChange={this.handleChange("newUser")}
                  margin="normal"
                  variant="outlined"
                  inputProps={{ newUser: this.state.newUser }}
                />
              </div>
              <div style={{ paddingTop: 20, paddingBottom: 20 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    this.props.functions.load.user(
                      this.state.newUser,
                      false,
                      success => !success && this.handleOpen()
                    )
                  }
                >
                  Search
                </Button>
              </div>
            </div>
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              open={this.state.open}
              autoHideDuration={6000}
              onClose={this.handleClose}
              message={<span id="message-id">User Not Found</span>}
              action={[
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  onClick={this.handleClose}
                >
                  <Close />
                </IconButton>
              ]}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <Typography>{`Your new workspace: ${
              this.state.newName
            }`}</Typography>
            <Typography>{"Users"}</Typography>
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
                  <Typography>
                    {this.getStepContent(this.state.activeStep)}
                  </Typography>
                  <div>
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
