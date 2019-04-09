import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore'
import config from "./config.js";

const app = firebase.initializeApp(config);
const firestore = firebase.firestore();

export const auth = app.auth();
export const githubAuthProvider = new firebase.auth.GithubAuthProvider();
