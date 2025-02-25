import firebase from "firebase/compat/app";
import "firebase/auth";
import "firebase/compat/auth";
import "firebase/compat/database";
import { getDatabase } from "firebase/database";
import "firebase/compat/storage";
import "firebase/storage";
import "firebase/compat/analytics";
import 'firebase/compat/firestore';
import 'firebase/compat/database';

const firebaseConfig = {
    apiKey: "AIzaSyBf7wGc_gjNBhsnmyUzws-5jzQqKyw2FEM",
    authDomain: "my-seva-4a27b.firebaseapp.com",
    databaseURL: "https://my-seva-4a27b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "my-seva-4a27b",
    storageBucket: "my-seva-4a27b.appspot.com",
    messagingSenderId: "1012906063375",
    appId: "1:1012906063375:web:303a004568e44d8582157a",
    measurementId: "G-3T2JK12Q32"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
const analytics = firebase.analytics();
const db = getDatabase();
export { db, analytics };

export default firebase;
