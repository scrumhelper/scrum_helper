import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore'
import config from "./config.js";

const app = firebase.initializeApp(config);

export const auth = app.auth();
export const db = app.firestore();
export const githubAuthProvider = new firebase.auth.GithubAuthProvider();
