import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCUivngIG4b_93g3n9YBupd7jEfVZFrzaI",
  authDomain: "order-management-f063a.firebaseapp.com",
  projectId: "order-management-f063a",
  storageBucket: "order-management-f063a.appspot.com",
  messagingSenderId: "1036716277261",
  appId: "1:1036716277261:web:bcc543edae7aad19e29f44"
};

firebase.initializeApp(firebaseConfig);
export { firebase };