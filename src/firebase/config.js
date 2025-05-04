import firebase from 'firebase/app';
import 'firebase/firestore'

// import { getFirestore } from "firebase/firestore";

// import firestore from '@react-native-firebase/firestore';

// live 
// const firebaseConfig = {
//   apiKey: "AIzaSyAA0gCznkmWMbpCUUVUvbT54f7d3buWnSc",
//   authDomain: "order-management-6c79e.firebaseapp.com",
//   projectId: "order-management-6c79e",
//   storageBucket: "order-management-6c79e.appspot.com",
//   messagingSenderId: "57117072785",
//   appId: "1:57117072785:web:061228ad1c8b10acbdce30"
// };
// var orderCountID = "THEk7rT9KuE1JEROCgU3";

// test 
const firebaseConfig = {
  apiKey: "AIzaSyCUivngIG4b_93g3n9YBupd7jEfVZFrzaI",
  authDomain: "order-management-f063a.firebaseapp.com",
  projectId: "order-management-f063a",
  storageBucket: "order-management-f063a.appspot.com",
  messagingSenderId: "1036716277261",
  appId: "1:1036716277261:web:bcc543edae7aad19e29f44"
};
var orderCountID = "y4JTEbcUbJRIx45a7WlF";

if (!firebase.apps.length) {
  console.log('Connected with Firebase')
}

firebase.initializeApp(firebaseConfig);


// const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed


export {firebase, orderCountID}