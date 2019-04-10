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
    workspace: null,
    sprint: null
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
          this.loadUser(uid, true, user => {
            this.setState({ user, uid: uid });
          });
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

  createWorkspace = () => {
    db.collection("workspaces")
      .add({
        users: [this.state.user.id],
        sprints: []
      })
      .then(docRef => {
        db.collection("workspaces")
          .doc(docRef.id)
          .set(
            {
              name: docRef.id,
              id: docRef.id
            },
            { merge: true }
          );
        this.addWorkspace(docRef.id);
        this.loadWorkspace(docRef.id);
      });
  };

  createSprint = () => {
    db.collection("sprints")
      .add({
        artifacts: {
          productBacklog: null,
          sprintBacklog: null,
          sprintRetrospective: null,
          sprintPlanning: null
        },
        roles: {
          scrumMaster: null,
          productOwner: null,
          team: [this.state.uid]
        },
        events: {
          sprintReview: null,
          dailyScrum: null,
          sprintPlanning: null,
          sprintRetrospective: null
        }
      })
      .then(docRef => {
        db.collection("sprints")
          .doc(docRef.id)
          .set(
            {
              id: docRef.id
            },
            { merge: true }
          );

        this.addSprint(docRef.id);
        this.loadSprint(docRef.id);
      });
  };

  addWorkspace = wid => {
    this.setState(
      {
        user: {
          ...this.state.user,
          workspaces: [...this.state.user.workspaces, wid]
        }
      },
      this.saveUser
    );
  };

  addSprint = sid => {
    this.setState(
      {
        workspace: {
          ...this.state.workspace,
          sprints: [...this.state.workspace.sprints, sid]
        }
      },
      this.saveWorkspace
    );
  };

  loadDoc = (collection, id, callback) => {
    db.collection(collection)
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          callback(doc.data());
        } else {
          console.log(`No such document in ${collection} with id: ${id}`);
        }
      })
      .catch(error => console.error("Error in getting document: ", error));
  };

  loadWorkspace = (wid, callback) => {
    this.loadDoc("workspaces", wid, ws => {
      ws.users = ws.users.map(uid => this.loadUser(uid));
      ws.sprints = ws.sprints.map(sid => this.loadSprint(sid));

      callback(ws);
    });
  };

  loadUser = (uid, complete, callback) => {
    this.loadDoc("users", uid, user => {
      if (complete)
        user.workspaces.forEach(wid =>
          this.loadWorkspace(wid, ws =>
            this.setState({
              user: {
                ...this.state.user,
                workspaces: [...this.state.workspaces, ws]
              }
            })
          )
        );

      callback(user);
    });
  };

  loadSprint = (sid, callback) => {
    this.loadDoc("sprints", sid, s => {
      s.roles.scrumMaster = this.state.workspace.users.find(
        u => u.id == s.roles.scrumMaster
      );
      s.roles.productOwner = this.state.workspace.users.find(
        u => u.id == s.roles.productOwner
      );

      s.events.sprintReview = new Date(s.events.sprintReview);
      s.events.dailyScrum = new Date(s.events.dailyScrum);
      s.events.sprintPlanning = new Date(s.events.sprintPlanning);
      s.events.sprintRetrospective = new Date(s.events.sprintRetrospective);

      callback(s);
    });
  };

  saveDoc = (collection, id, obj) => {
    db.collection(collection)
      .doc(id)
      .set(obj)
      .then(() => console.log("Document successfully written!"))
      .catch(error => console.err("Error writing document: ", error));
  };

  saveUser = () => {
    this.saveDoc("users", this.state.uid, this.state.user);
  };

  saveWorkspace = () => {
    this.saveDoc("workspaces", this.state.workspace.id, this.state.workspace);
  };

  saveSprint = () => {
    this.saveDoc("sprints", this.state.sprint.id, this.state.sprint);
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
                    }
                  }}
                  user={this.state.user}
                  workspace={this.state.workspace}
                  sprint={this.state.sprint}
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
      </div>
    );
  }
}

export default App;
