import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyC4YoIWRi3cC1PFQIA1s4ZkaNknmJpA1Vg",
    authDomain: "cse316-wireframer.firebaseapp.com",
    databaseURL: "https://cse316-wireframer.firebaseio.com",
    projectId: "cse316-wireframer",
    storageBucket: "cse316-wireframer.appspot.com",
    messagingSenderId: "1041476086283",
    appId: "1:1041476086283:web:4db71989f4d471cfb2350e"
};
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;