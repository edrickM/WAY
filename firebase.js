
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyCayaoGsBZ6B9iKZifudLY90lqAX_X787A",
  authDomain: "where-are-you-app-ca8ab.firebaseapp.com",
  projectId: "where-are-you-app-ca8ab",
  storageBucket: "where-are-you-app-ca8ab.appspot.com",
  messagingSenderId: "498185032525",
  appId: "1:498185032525:web:6bd93a108fdea9c87b5d04",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = app.firestore();

export { auth, db };
