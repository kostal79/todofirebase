import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration

const firebaseConfig = {


};

//Initialize Firebase / 
const app = initializeApp(firebaseConfig);

//Firestore/ 
const db = getFirestore(app);

//Storage /
export const storage = getStorage(app);


export default db
