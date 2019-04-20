import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import { auth, googleAuthProvider } from "./firebase";

class SignIn extends Component {
  auth = provider => {
    auth
      .signInWithPopup(provider)
      .then(result => {
        var token = result.credential.accessToken;
        var user = result.user;
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
      });
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          backgroundImage:
            'url("https://picsum.photos/1500/1000?image=885&blur=50")',
          height: "100vh",
          width: "100vw",
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div
          style={{
            borderRadius: 20,
            borderColor: "black",
            borderWidth: 5,
            borderStyle: "solid",
            backgroundColor: "rgba(0, 0, 0, .5)"
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              padding: 20,
              color: "white"
            }}
          >
            <div style={{ padding: 20, color: "white" }}>
              <Typography variant="h5" color="inherit">
                Scrum Helper
              </Typography>
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.auth(googleAuthProvider)}
              style={{ padding: 10 }}
            >
              <Avatar
                alt={`Google`}
                src="https://image.flaticon.com/teams/slug/google.jpg"
              />
              <Typography
                variant="h6"
                color="inherit"
                style={{ paddingLeft: 10 }}
              >
                Sign in
              </Typography>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default SignIn;
