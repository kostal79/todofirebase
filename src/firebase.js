import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyB5LjV-EvG39YHyT5ZD6OykmVvdOtVPe4A",

  authDomain: "todoapp-8c803.firebaseapp.com",

  projectId: "todoapp-8c803",

  storageBucket: "todoapp-8c803.appspot.com",

  messagingSenderId: "557535992924",

  appId: "1:557535992924:web:372851436c5256518a5a99",

};

//Initialize Firebase / 
const app = initializeApp(firebaseConfig);

//Firestore/ 
const db = getFirestore(app);

//Storage /
export const storage = getStorage(app);


export default db