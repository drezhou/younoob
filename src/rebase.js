import Rebase from 're-base';
import firebase from 'firebase';

var app = firebase.initializeApp({
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  databaseURL: "YOUR_FIREBASE_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID"
});

var base = Rebase.createClass(app.database());

export const provider = new firebase.auth.GoogleAuthProvider();
export default base
