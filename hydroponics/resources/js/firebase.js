// ========================================
// FIREBASE
// ========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";


// ========================================
// FIREBASE CONFIGURATION
// ========================================

const firebaseConfig = {

    apiKey: "AIzaSyBYcuq0d3iY5RAnA54sdA26joYAbxme_FY",

    authDomain: "hydrosmart-c8c99.firebaseapp.com",

    databaseURL:
        "https://hydrosmart-c8c99-default-rtdb.firebaseio.com/",

    projectId: "hydrosmart-c8c99",

    storageBucket:
        "hydrosmart-c8c99.firebasestorage.app",

    messagingSenderId:
        "921166226141",

    appId:
        "1:921166226141:web:a41e81929e64c684843134"

};


// ========================================
// INITIALIZE FIREBASE
// ========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const database = getDatabase(app);


// ========================================
// FIREBASE LOGIN
// ========================================

// Gamitin ang Firebase Authentication user
// na ginawa mo sa Firebase Console.

const FIREBASE_EMAIL =
    "cayaosbenny276@gmail.com";

const FIREBASE_PASSWORD =
    "benny123";


// ========================================
// FIREBASE LOGIN
// ========================================

const firebaseLogin =
    signInWithEmailAndPassword(
        auth,
        FIREBASE_EMAIL,
        FIREBASE_PASSWORD
    );


// ========================================
// EXPORT
// ========================================

export {
    database,
    firebaseLogin
};
