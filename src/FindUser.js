import React from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class FindUser extends React.Component {
  state = {
    newUser: ""
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    return (
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
          />
        </div>
        <div style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              this.props.functions.load.user(this.state.newUser, false)
            }
          >
            <Typography>Search</Typography>
          </Button>
        </div>
      </div>
    );
  }
}

export default FindUser;
