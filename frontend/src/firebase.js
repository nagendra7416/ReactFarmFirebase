import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAieLnQBEhq0NK9ekODp_d8Z5u8C4XpzAs",
  authDomain: "reactfarmfirebase.firebaseapp.com",
  projectId: "reactfarmfirebase",
  storageBucket: "reactfarmfirebase.appspot.com",
  messagingSenderId: "597937584857",
  appId: "1:597937584857:web:b456eb309cdd02f268dcc8",
  measurementId: "G-FRT1L2RE4H"
};


firebase.initializeApp(firebaseConfig);
export default firebase;