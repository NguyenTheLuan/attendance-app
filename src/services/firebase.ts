import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYoBH6R9qugWMRV6MfDm7kOp_ZkPq5oFY",
  authDomain: "attendance-app-7e7e2.firebaseapp.com",
  projectId: "attendance-app-7e7e2",
  storageBucket: "attendance-app-7e7e2.firebasestorage.app",
  messagingSenderId: "1054785986717",
  appId: "1:1054785986717:web:3e387f5a7e6bf2d3f44a9f",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
