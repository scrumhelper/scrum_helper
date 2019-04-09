import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import firebaseui from "firebaseui";
import { auth, githubAuthProvider } from "./firebase";
import "./SignIn.css";

//var ui = new firebaseui.auth.AuthUI(firebase.auth());
/*ui.start("#firebaseui-auth-container", {
  signInOptions: [firebase.auth.GithubAuthProvider.PROVIDER_ID]
  // Other config options...
});*/
// var uiConfig = {
//   callbacks: {
//     signInSuccessWithAuthResult: function(authResult, redirectUrl) {
//       // User successfully signed in.
//       // Return type determines whether we continue the redirect automatically
//       // or whether we leave that to developer to handle.
//       return true;
//     },
//     uiShown: function() {
//       // The widget is rendered.
//       // Hide the loader.
//       document.getElementById("loader").style.display = "none";
//     }
//   },
//   // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
//   signInFlow: "popup",
//   signInSuccessUrl: "./workspace",
//   signInOptions: [
//     // Leave the lines as is for the providers you want to offer your users.
//     //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//     //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//     firebase.auth.GithubAuthProvider.PROVIDER_ID
//     //firebase.auth.EmailAuthProvider.PROVIDER_ID,
//     //firebase.auth.PhoneAuthProvider.PROVIDER_ID
//   ],
//   // Terms of service url.
//   tosUrl: "<your-tos-url>",
//   // Privacy policy url.
//   privacyPolicyUrl: "<your-privacy-policy-url>"
// };

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
    /*    return (
      <div>
        <h1>Scrum Helper</h1>
        <div id="firebaseui-auth-container" />
        <div id="loader">Loading...</div>
      </div>
    );*/
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
