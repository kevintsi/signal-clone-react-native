import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
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