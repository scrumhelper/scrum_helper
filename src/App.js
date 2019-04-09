import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import "./App.css";
import { auth } from "./firebase";
import SignIn from "./SignIn";

class App extends Component {
  state = {
    user: null
  };

  componentDidMount() {
    const login = window.localStorage.getItem("login");
    if (login !== "null") {
      this.handleAuth(login);
    }

    auth.onAuthStateChanged(user => {
      if (user) {
        this.handleAuth(user.uid);
      } else {
        this.signOut();
      }
    });
  }

  handleAuth = user => {
    this.setState({ user });
    window.localStorage.setItem("login", this.state.user);
  };

  signedIn = () => {
    return this.state.user;
  };

  signOut = () => {
    window.localStorage.removeItem("login");
    this.setState({ user: null });
    auth.signOut();
  };

  render() {
    return (
      <div>
        <Switch>
          <Route
            path="/sign-in"
            render={navProps =>
              this.signedIn() ? (
                <Redirect to="/workspace" />
              ) : (
                <SignIn {...navProps} />
              )
            }
          />
          <Route
            path="workspace"
            render={navProps =>
              this.signedIn() ? <p>signedin</p> : <Redirect to="/signin" />
            }
          />
          <Route
            render={navProps =>
              this.signedIn() ? (
                <Redirect to="/workspace" />
              ) : (
                <Redirect to="/sign-in" />
              )
            }
          />
        </Switch>
      </div>
    );
  }
}

export default App;
