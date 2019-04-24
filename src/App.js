import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
// import ApiCalendar from 'react-google-calendar-api';

import { serverKey } from "./config.js";
import firebase, { auth, db, msg, st } from "./firebase";
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
        // ApiCalendar.handleAuthClick();
      } else {
        this.signOut();
      }
    });

    msg.onTokenRefresh(() => {
      msg
        .getToken()
        .then(refreshedToken => {
          console.log("Token refreshed.");
          // Indicate that the new Instance ID token has not yet been sent to the
          // app server.
          this.sendTokenToServer(false);
          // Send Instance ID token to app server.
          this.sendTokenToServer(refreshedToken);
        })
        .catch(function(err) {
          console.log("Unable to retrieve refreshed token ", err);
          // showToken("Unable to retrieve refreshed token ", err);
        });
    });
  }

  requestMsgPermission = () => {
    msg
      .requestPermission()
      .then(() => {
        return msg.getToken();
      })
      .then(currentToken => {
        if (currentToken) {
          console.log("Valid token");
          this.sendTokenToServer(currentToken);
          // updateUIForPushEnabled(currentToken);
        } else {
          // Show permission request.
          console.log(
            "No Instance ID token available. Request permission to generate one."
          );
          // Show permission UI.
          // updateUIForPushPermissionRequired();
          this.sendTokenToServer(false);
        }
      })
      .catch(err => {
        console.log("An error occurred while retrieving token. ", err);
        // showToken("Error retrieving Instance ID token. ", err);
        this.sendTokenToServer(false);
      });
    // msg.requestPermission().then(() => {
    //   msg
    //     .getToken()
    //     .then(function(currentToken) {
    //       if (currentToken) {
    //         console.log("Valid token");
    //         this.sendTokenToServer(currentToken);
    //         // updateUIForPushEnabled(currentToken);
    //       } else {
    //         // Show permission request.
    //         console.log(
    //           "No Instance ID token available. Request permission to generate one."
    //         );
    //         // Show permission UI.
    //         // updateUIForPushPermissionRequired();
    //         this.sendTokenToServer(false);
    //       }
    //     })
    //     .catch(function(err) {
    //       console.log("An error occurred while retrieving token. ", err);
    //       // showToken("Error retrieving Instance ID token. ", err);
    //       this.sendTokenToServer(false);
    //     });
    // });
    // msg
    //   .requestPermission()
    //   .then(currentToken => {
    //     console.log("Notification permission granted.", currentToken);
    //     if (currentToken) {
    //       this.sendTokenToServer(currentToken);
    //       // updateUIForPushEnabled(currentToken);
    //     } else {
    //       console.log(
    //         "No Instance ID token available. Request permission to generate one."
    //       );
    //       // Show permission UI.
    //       // updateUIForPushPermissionRequired();
    //       this.sendTokenToServer(false);
    //     }
    //   })
    //   .catch(err => {
    //     console.log("Unable to get permission to notify.", err);
    //     // showToken("Error retrieving Instance ID token. ", err);
    //     // setTokenSentToServer(false);
    //   });
  };

  pushNotification = (to, title, body) => {
    fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        Acccept: "application/json",
        "Content-Type": "application/json",
        Authorization: `key=${serverKey}`
      },
      body: JSON.stringify({
        notification: {
          title,
          body,
          click_action: "http://localhost:3000/",
          icon: "http://url-to-an-icon/icon.png"
        },
        to
      })
    });
  };

  handleNotificationForeground = payload => {
    console.log("Message received.", payload);
  };

  handleAuth = uid => {
    const user = auth.currentUser;
    db.collection("users")
      .doc(uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.loadUser(uid, true, success => {
            if (success) {
              this.setState({ uid: uid });
              this.requestMsgPermission();
            }
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
        workspaces: [],
        photo: user.photoURL
      });
  };

  sendTokenToServer = token => {
    if (token) {
      db.collection("users")
        .doc(this.state.uid)
        .set(
          {
            notificationToken: token
          },
          { merge: true }
        );
    } else {
      db.collection("users")
        .doc(this.state.uid)
        .set(
          {
            notificationToken: firebase.firestore.FieldValue.delete()
          },
          { merge: true }
        );
    }
  };

  createWorkspace = workspace => {
    db.collection("workspaces")
      .add({
        name: workspace.name,
        users: [
          ...workspace.users.filter(u => u !== this.state.uid),
          this.state.uid
        ],
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
          )
          .then(() =>
            this.loadWorkspace(docRef.id, () => {
              workspace.users.forEach(u =>
                this.addWorkspaceToUser(u, docRef.id)
              );
              this.addWorkspace(docRef.id);
            })
          );
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
      () => {
        this.saveUser();
        this.addUserToWorkspace(this.state.uid, wid);
      }
    );
  };

  addUserToWorkspace = (uid, wid) => {
    const ws = this.state.workspaces.find(w => w.id === wid);
    ws.users = [...ws.users.filter(u => u !== uid), uid];
    this.setState({
      workspaces: [...this.state.workspaces.filter(w => w.id !== wid), ws]
    });
    this.saveDoc("workspaces", wid, ws, () =>
      this.throwSnackError(
        `Could not add user - ${uid} - to workspace - ${wid}`
      )
    );
  };

  addWorkspaceToUser = (uid, wid) => {
    const user = this.state.users.find(u => u.id === uid);
    user.workspaces = [...user.workspaces.filter(w => w.id !== wid), wid];
    this.saveDoc("users", uid, user, () =>
      this.throwSnackError(`Could add workspace - ${wid} - to user ${uid}`)
    );
    // this.addUserToWorkspace(this.state.uid, wid);
  };

  leaveWorkspace = wid => {
    const ws = this.state.workspaces.find(w => w.id === wid);
    ws.users = ws.users.filter(u => u !== this.state.uid);

    //this.saveWorkspace(ws);

    this.setState(
      {
        user: {
          ...this.state.user,
          workspaces: this.state.user.workspaces.filter(w => w !== wid)
        },
        workspaces: [...this.state.workspaces.filter(w => w.id !== wid), ws]
      }
      //this.saveUser
    );
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
      .catch(err => {
        console.error("Error in getting document: ", err);
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

  loadWorkspace = (wid, callback) => {
    this.loadDoc(
      "workspaces",
      wid,
      ws => {
        const workspaces = this.state.workspaces.filter(w => w.id !== wid);
        this.setState({
          workspaces: [...workspaces, ws]
        });
        ws.users.forEach(uid => this.loadUser(uid, false));
        ws.sprints.forEach(sid => this.loadSprint(sid));
        if (callback) callback(ws);
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
        s.sprintReview = new Date(s.sprintReview);
        s.dailyScrum = new Date(s.dailyScrum);
        s.sprintPlanning = new Date(s.sprintPlanning);
        s.sprintRetrospective = new Date(s.sprintRetrospective);

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

  //PARAMETERS: file
  addImageToStorage = (file, callback) => {
    var fileName = file.name;
    var ref = st.ref("profile_images/" + fileName);

    var task = ref.put(file);

    task.on(
      "state_changed",
      function(snapshot) {
        //while uploading
      },
      function error(error) {
        console.log(error.message);
      },
      function() {
        //on complete
        task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          callback(downloadURL);
          console.log(downloadURL);
        });
      }
    );
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
    // ApiCalendar.handleSignoutClick();
  };

  uploadFile = path => {
    console.log(path);
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
            path="/workspace/:wid?/:sid?"
            render={navProps =>
              this.signedIn() ? (
                <Main
                  signOut={this.signOut}
                  functions={{
                    save: {
                      user: this.saveUser,
                      workspace: this.saveWorkspace,
                      sprint: this.saveSprint,
                      file: this.addImageToStorage
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
                      workspace: this.addWorkspace
                    },
                    leave: {
                      workspace: this.leaveWorkspace
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
