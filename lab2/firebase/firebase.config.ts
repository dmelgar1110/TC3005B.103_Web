import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBSz99l0beMXsdAGELbtKX6VwpURtzbQPo",
  authDomain: "crud-firebase-5d417.firebaseapp.com",
  projectId: "crud-firebase-5d417",
  storageBucket: "crud-firebase-5d417.firebasestorage.app",
  messagingSenderId: "150483310401",
  appId: "1:150483310401:web:92d51a0eafe945ae4833c0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };