import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";

import firebase, { auth, db } from "./firebase";
import SignIn from "./SignIn";
import Main from "./Main";

class App extends Component {
  state = {
    uid: null,
    user: null,
    workspaces: [],
    sprints: [],
    users: [],
    snackOpen: false,
    snackMessage: ""
  };

  throwSnackError = message => {
    this.setState({ snackMessage: message }, this.openSnack);
  };

  openSnack = () => {
    this.setState({
      snackOpen: true
    });
  };

  closeSnack = () => {
    this.setState({
      snackOpen: false
    });
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
          this.loadUser(
            uid,
            true,
            success => success && this.setState({ uid: uid })
          );
        } else {
          this.createUser(user);
          this.handleAuth(uid);
        }
      });
  };

  createUser = user => {
    db.collection("users")
      .doc(user.uid)
      .set({
        name: user.displayName,
        email: user.email,
        id: user.uid,
        workspaces: []
      });
  };

  createWorkspace = workspace => {
    db.collection("workspaces")
      .add({
        name: workspace.name,
        users: [this.state.uid],
        sprints: []
      })
      .then(docRef => {
        db.collection("workspaces")
          .doc(docRef.id)
          .set(
            {
              id: docRef.id
            },
            { merge: true }
          );
        this.addWorkspaceToUser(docRef.id);
      });
  };

  addWorkspaceToUser = wid => {
    this.setState(
      {
        user: {
          ...this.state.user,
          workspaces: [...this.state.user.workspaces, wid]
        }
      },
      this.saveUser
    );
    this.loadWorkspace(wid);
  };

  loadDoc = (collection, id, success, error) => {
    db.collection(collection)
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          success(doc.data());
        } else {
          console.log(`No such document in ${collection} with id: ${id}`);
          if (error) error();
        }
      })
      .catch(error => {
        console.error("Error in getting document: ", error);
        if (error) error();
      });
  };

  loadUser = (uid, complete, callback) => {
    this.loadDoc(
      "users",
      uid,
      user => {
        if (complete)
          this.setState({ user }, () => {
            user.workspaces.forEach(wid => this.loadWorkspace(wid));
            if (callback) callback(true);
          });
        else if (
          uid !== this.state.uid &&
          !this.state.users.find(u => u.id === uid)
        )
          this.setState({ users: [...this.state.users, user] }, () => {
            if (callback) callback(true);
          });
      },
      () => {
        this.throwSnackError(`Could not find user with id: ${uid}`);
      }
    );
  };

  loadWorkspace = wid => {
    this.loadDoc(
      "workspaces",
      wid,
      ws => {
        this.setState({
          workspaces: [...this.state.workspaces.filter(w => w.id !== wid), ws]
        });
        ws.users.forEach(uid => this.loadUser(uid, false));
        ws.sprints.forEach(sid => this.loadSprint(sid));
      },
      () => {
        this.throwSnackError(`Could not find workspace with id: ${wid}`);
      }
    );
  };

  loadSprint = (sid, callback) => {
    this.loadDoc(
      "sprints",
      sid,
      s => {
        // s.events.sprintReview = new Date(s.events.sprintReview);
        // s.events.dailyScrum = new Date(s.events.dailyScrum);
        // s.events.sprintPlanning = new Date(s.events.sprintPlanning);
        // s.events.sprintRetrospective = new Date(s.events.sprintRetrospective);

        this.setState(
          {
            sprints: [...this.state.sprints.filter(s => s.id !== sid), s]
          },
          callback
        );
      },
      () => {
        this.throwSnackError(`Could not find sprint with id: ${sid}`);
      }
    );
  };

  saveDoc = (collection, id, obj, error) => {
    db.collection(collection)
      .doc(id)
      .set(obj)
      .then(() => console.log("Document successfully written!"))
      .catch(err => {
        console.err("Error writing document: ", error);
        if (error) error();
      });
  };

  saveUser = () => {
    this.saveDoc("users", this.state.uid, this.state.user, () => {
      this.throwSnackError(`Could not save user`);
    });
  };

  saveWorkspace = workspace => {
    this.saveDoc("workspaces", workspace.id, workspace, () => {
      this.throwSnackError(`Could not save workspace`);
    });
    this.setState({
      workspaces: [
        ...this.state.workspaces.filter(w => w.id !== workspace.id),
        workspace
      ]
    });
  };

  saveSprint = sprint => {
    this.saveDoc("sprints", sprint.id, sprint, () => {
      this.throwSnackError(`Could not save sprint`);
    });
    this.setState({
      sprints: [...this.state.sprints.filter(s => s.id !== sprint.id), sprint]
    });
  };

  signedIn = () => {
    return this.state.uid;
  };

  signOut = () => {
    // window.localStorage.removeItem("login");
    this.setState({
      uid: null,
      user: null,
      workspaces: [],
      sprints: [],
      users: []
    });
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
            path="/workspace/:wid?"
            render={navProps =>
              this.signedIn() ? (
                <Main
                  signOut={this.signOut}
                  functions={{
                    save: {
                      user: this.saveUser,
                      workspace: this.saveWorkspace,
                      sprint: this.saveSprint
                    },
                    load: {
                      user: this.loadUser,
                      workspace: this.loadWorkspace,
                      sprint: this.loadSprint
                    },
                    create: {
                      workspace: this.createWorkspace,
                      sprint: this.createSprint
                    },
                    add: {
                      workspace: this.addWorkspaceToUser
                    }
                  }}
                  globals={{
                    user: this.state.user,
                    workspaces: this.state.workspaces,
                    sprints: this.state.sprints,
                    users: this.state.users
                  }}
                  {...navProps}
                />
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
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={this.state.snackOpen}
          autoHideDuration={6000}
          onClose={this.closeSnack}
          message={<span id="message-id">{this.state.snackMessage}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.closeSnack}
            >
              <Close />
            </IconButton>
          ]}
        />
      </div>
    );
  }
}

export default App;
