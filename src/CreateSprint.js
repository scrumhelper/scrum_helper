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
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker
} from "material-ui-pickers";

import Calendar from "./Calendar";
import FindUser from "./FindUser";
import UserList from "./UserList";
import SprintCard from "./SprintCard";
import Stepper from "./Stepper";
import Sprint from "./Sprint";

class CreateSprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      name: `Sprint ${this.props.workspace.sprints.length + 1}`,
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

    this.productBacklog = React.createRef();
    this.sprintBacklog = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open === false && this.props.open === true) {
      const dates = [];
      for (let i = 0; i < 4; i++) {
        dates.push(new Date());
        dates[i].setMinutes(0, 0, 0);
      }
      this.setState({
        activeStep: 0,
        name: `Sprint ${this.props.workspace.sprints.length + 1}`,
        scrumMaster: "",
        productOwner: "",
        team: [],
        productBacklog: null,
        sprintBacklog: null,
        sprintReview: dates[0],
        sprintRetrospective: dates[1],
        sprintPlanning: dates[2],
        dailyScrum: dates[3]
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
    if (this.productBacklog.current.files[0].name.indexOf(".pdf") === -1) {
      alert("Must be a pdf file!");
    } else {
      this.props.functions.save.file(
        this.productBacklog.current.files[0],
        url =>
          this.setState(
            {
              productBacklog: url
            },
            this.handleProductClose
          )
      );
    }
  };

  updateSprintBacklog = () => {
    this.props.functions.save.file(this.sprintBacklog.current.files[0], url =>
      this.setState(
        {
          sprintBacklog: url
        },
        this.handleSprintClose
      )
    );
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleDateChange = (name, date) => {
    this.setState({ [name]: date });
  };

  updateChecked = checked => {
    this.setState({ team: checked });
  };

  getSteps = () => {
    return ["Determine Roles", "Upload Artifacts", "Schedule Events", "Start!"];
  };

  handleNext = () => {
    if (this.state.activeStep + 1 === this.getSteps().length) {
      this.props.createSprint({
        name: this.state.name,
        scrumMaster: this.state.scrumMaster,
        productOwner: this.state.productOwner,
        team: this.state.team,
        productBacklog: this.state.productBacklog,
        sprintBacklog: this.state.sprintBacklog,
        sprintReview: this.state.sprintReview.toJSON(),
        sprintRetrospective: this.state.sprintRetrospective.toJSON(),
        sprintPlanning: this.state.sprintPlanning.toJSON(),
        dailyScrum: this.state.dailyScrum.toJSON()
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
        return (
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <Calendar
                  dates={[
                    this.state.sprintPlanning,
                    this.state.sprintReview,
                    this.state.sprintRetrospective
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
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <DatePicker
                        margin="normal"
                        label="Sprint Planning Date"
                        value={this.state.sprintPlanning}
                        onChange={date =>
                          this.handleDateChange("sprintPlanning", date)
                        }
                      />
                      <TimePicker
                        margin="normal"
                        label="Sprint Planning Time"
                        value={this.state.sprintPlanning}
                        onChange={date =>
                          this.handleDateChange("sprintPlanning", date)
                        }
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
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
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <TimePicker
                        margin="normal"
                        label="Daily Scrum Time"
                        value={this.state.dailyScrum}
                        onChange={date =>
                          this.handleDateChange("dailyScrum", date)
                        }
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
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
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <DatePicker
                        margin="normal"
                        label="Sprint Review Date"
                        value={this.state.sprintReview}
                        onChange={date =>
                          this.handleDateChange("sprintReview", date)
                        }
                      />
                      <TimePicker
                        margin="normal"
                        label="Sprint Review Time"
                        value={this.state.sprintReview}
                        onChange={date =>
                          this.handleDateChange("sprintReview", date)
                        }
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
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
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <DatePicker
                        margin="normal"
                        label="Sprint Retrospective Date"
                        value={this.state.sprintRetrospective}
                        onChange={date =>
                          this.handleDateChange("sprintRetrospective", date)
                        }
                      />
                      <TimePicker
                        margin="normal"
                        label="Sprint Retrospective Time"
                        value={this.state.sprintRetrospective}
                        onChange={date =>
                          this.handleDateChange("sprintRetrospective", date)
                        }
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </Card>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <SprintCard
            sprint={this.state}
            users={this.props.users}
            workspace={this.props.workspace}
            link={false}
          />
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
          continueDisabled={() =>
            (this.state.activeStep === 0 &&
              (this.state.scrumMaster === "" ||
                this.state.productOwner === "" ||
                this.state.team.length === 0)) ||
            (this.state.activeStep === 1 &&
              (this.state.productBacklog === null ||
                this.state.sprintBacklog === null)) ||
            (this.state.activeStep === 2 &&
              (this.state.sprintPlanning.getTime() < new Date().getTime() ||
                this.state.sprintPlanning.getTime() >=
                  this.state.sprintReview.getTime() ||
                this.state.sprintPlanning.getTime() >=
                  this.state.sprintRetrospective.getTime() ||
                this.state.sprintReview.getTime() >=
                  this.state.sprintRetrospective.getTime()))
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
}

export default CreateSprint;
