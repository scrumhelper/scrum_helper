import React from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Stepper as StepperUI } from "@material-ui/core";
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

class Stepper extends React.Component {
  state = {
    activeStep: 0
  };

  handleNext = () => {
    if (this.state.activeStep + 1 === this.props.getSteps().length) {
      this.props.finish();
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

  render() {
    const steps = this.props.getSteps();
    return (
      <div>
        <StepperUI orientation="vertical" activeStep={this.state.activeStep}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <div>
                  <div>{this.props.getStepContent(this.state.activeStep)}</div>
                  <div>
                    <Button color="secondary" onClick={this.props.cancel}>
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
                        this.props.continue()
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
        </StepperUI>
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

export default Stepper;
