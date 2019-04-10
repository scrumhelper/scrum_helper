import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import firebaseui from "firebaseui";
import { auth, githubAuthProvider } from "./firebase";
import "./SignIn.css";

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
      <div className="signin">
        <div>
          <div>
            <h1>Scrum Helper</h1>
            <button onClick={() => this.auth(githubAuthProvider)}>
              <p>Sign In</p>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SignIn;
