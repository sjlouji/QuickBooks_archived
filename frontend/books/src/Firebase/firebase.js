import firebase from 'firebase/app'
import 'firebase/storage'


  var firebaseConfig = {
    apiKey: "AIzaSyBktnlQZzEniyqK2TA1LnHbNsiLVDUTmSw",
    authDomain: "nextbooks-1a9f0.firebaseapp.com",
    projectId: "nextbooks-1a9f0",
    storageBucket: "nextbooks-1a9f0.appspot.com",
    messagingSenderId: "598746868482",
    appId: "1:598746868482:web:362eadd2ef498380f6301b",
    measurementId: "G-EJ5PRERRPH"
  };

  firebase.initializeApp(firebaseConfig);
  const storage = firebase.storage()

  export  {
    storage, firebase as default
  }
 