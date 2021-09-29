import * as firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyBfU6otZewrMsRdb2QTgGObZC5xZB259Uc",
    authDomain: "signal-clone-19d36.firebaseapp.com",
    projectId: "signal-clone-19d36",
    storageBucket: "signal-clone-19d36.appspot.com",
    messagingSenderId: "269882881578",
    appId: "1:269882881578:web:8acf50bfc53890cab1b553"
};

let app;

if (firebase.default.apps.length === 0) {
    app = firebase.default.initializeApp(firebaseConfig)
} else {
    app = firebase.default.app()
}

const db = app.firestore()
const auth = firebase.default.auth()

export { db, auth }