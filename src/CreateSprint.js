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
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import Select from "@material-ui/core/Select";

import FindUser from "./FindUser";
import UserList from "./UserList";
import Stepper from "./Stepper";

class CreateSprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      scrumMaster: "",
      productOwner: "",
      team: [],
      productBacklog: null,
      sprintBacklog: null,
      openSprintBacklog: false,
      openProductBacklog: false
    };

    this.productBacklog = React.createRef();
    this.sprintBacklog = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open === false && this.props.open === true) {
      this.setState({
        activeStep: 0,
        scrumMaster: "",
        productOwner: "",
        team: [],
        productBacklog: null,
        sprintBacklog: null
      });
    }
  }

  openSprintBacklog = () => {
    this.setState({
      openSprintBacklog: true
    });
  };

  handleSprintClose = () => {
    this.setState({
      openSprintBacklog: false
    });
  };

  openProductBacklog = () => {
    this.setState({
      openProductBacklog: true
    });
  };

  handleProductClose = () => {
    this.setState({
      openProductBacklog: false
    });
  };

  updateProductBacklog = () => {
    console.log(this.productBacklog);
    this.setState(
      {
        productBacklog: this.productBacklog.current.files[0]
      },
      this.handleProductClose
    );
  };

  updateSprintBacklog = () => {
    console.log(this.sprintBacklog);
    this.setState(
      {
        sprintBacklog: this.sprintBacklog.current.files[0]
      },
      this.handleSprintClose
    );
  };

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
          <Card style={{ margin: 10, padding: 20 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <FormControl
                variant="outlined"
                style={{ minWidth: 120, margin: 5 }}
              >
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
              <FormControl style={{ minWidth: 120, margin: 5 }}>
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
              <Divider style={{ marginTop: 10, marginBottom: 10 }} />
              <div>
                <Typography>Select Team Members</Typography>
                <UserList
                  users={this.props.users}
                  checkable={true}
                  updateChecked={this.updateChecked}
                />
              </div>
            </div>
          </Card>
        );
      case 1:
        return (
          <Card style={{ margin: 10, padding: 20 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button onClick={this.openProductBacklog}>
                Upload Product Backlog
              </Button>
              <Button onClick={this.openSprintBacklog}>
                Upload Sprint Backlog
              </Button>
            </div>
          </Card>
        );
      case 2:
        return <div />;
      case 3:
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography>{`Your new sprint: ${this.state.newName}`}</Typography>
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
            (this.state.activeStep === 0 &&
              (this.state.scrumMaster === "" ||
                this.state.productOwner === "" ||
                this.state.team.length === 0)) ||
            (this.state.activeStep === 1 &&
              (this.productBacklog === null || this.sprintBacklog === null))
          }
          activeStep={this.state.activeStep}
          handleNext={this.handleNext}
          handleBack={this.handleBack}
          cancel={this.props.handleClose}
        />
        <Dialog
          open={this.state.openProductBacklog}
          onClose={this.handleProductClose}
        >
          <DialogTitle>Upload Product Backlog</DialogTitle>
          <DialogContent>
            <input type="file" ref={this.productBacklog} />
            <Button variant="contained" onClick={this.updateProductBacklog}>
              Submit
            </Button>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.openSprintBacklog}
          onClose={this.handleSprintClose}
        >
          <DialogTitle>Upload Sprint Backlog</DialogTitle>
          <DialogContent>
            <input type="file" ref={this.sprintBacklog} />
            <Button variant="contained" onClick={this.updateSprintBacklog}>
              Submit
            </Button>
          </DialogContent>
        </Dialog>
      </Dialog>
    );
  }

  handleSubmit = () => {
    console.log(this.input);
    console.log(this.productBacklog);
    console.log(this.sprintBacklog);
  };
}

export default CreateSprint;
