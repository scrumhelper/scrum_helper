import firebase from "firebase";
import config from "./config.js";

firebase.initializeApp(config);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const msg = firebase.messaging();
export const st = firebase.storage();
// msg
//   .requestPermission()
//   .then(() => {
//     return msg.getToken();
//   })
//   .then(function(currentToken) {
//     if (currentToken) {
//       console.log("Valid token");
//       this.sendTokenToServer(currentToken);
//       // updateUIForPushEnabled(currentToken);
//     } else {
//       // Show permission request.
//       console.log(
//         "No Instance ID token available. Request permission to generate one."
//       );
//       // Show permission UI.
//       // updateUIForPushPermissionRequired();
//       this.sendTokenToServer(false);
//     }
//   })
//   .catch(function(err) {
//     console.log("An error occurred while retrieving token. ", err);
//     // showToken("Error retrieving Instance ID token. ", err);
//     this.sendTokenToServer(false);
//   });
export const githubAuthProvider = new firebase.auth.GithubAuthProvider();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export default firebase;
