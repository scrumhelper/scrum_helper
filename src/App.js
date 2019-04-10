import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import "./App.css";
import firebase, { auth, db } from "./firebase";
import SignIn from "./SignIn";
import Main from "./Main";

class App extends Component {
  state = {
    uid: null,
    user: null,
    workspace: null
  };

  componentDidMount() {
    // const login = window.localStorage.getItem("login");
    // if (login !== "null") {
    //   this.handleAuth(login);
    // }

    auth.onAuthStateChanged(user => {
      if (user) {
        this.handleAuth(user.uid);
      } else {
        this.signOut();
      }
    });
  }

  handleAuth = uid => {
    const user = auth.currentUser;
    db.collection("users")
      .doc(uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.setState({ user: doc.data(), uid: uid });
        } else {
          db.collection("users")
            .doc(uid)
            .set({
              name: user.displayName,
              email: user.email,
              id: user.uid,
              workspaces: []
            });
          this.handleAuth(uid);
        }
      });
    // window.localStorage.setItem("login", uid);
  };

  signedIn = () => {
    return this.state.uid;
  };

  signOut = () => {
    // window.localStorage.removeItem("login");
    this.setState({ uid: null, user: null, workspace: null });
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
            path="/workspace"
            render={navProps =>
              this.signedIn() ? (
                <Main signOut={this.signOut} user={this.state.user} />
              ) : (
                <Redirect to="/signin" />
              )
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
