import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'; 

const firebaseConfig = {
  apiKey: "AIzaSyAUvjaAOg3IDV002qVHrIvOy9hm20ob3O0",
  authDomain: "cgg-toyko.firebaseapp.com",
  projectId: "cgg-toyko",
  storageBucket: "cgg-toyko.firebasestorage.app",
  messagingSenderId: "579297442559",
  appId: "1:579297442559:web:3f7be6f6b20a5ea91baaca",
  measurementId: "G-9E3Y4CH0XS"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); 
}

export const db = firebase.firestore();
export const auth = firebase.auth();
export default firebase;
