import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzQdLWaL9igZ3YYSzCkt0ANWkvUEYWKnM",
  authDomain: "attendance-app-d215e.firebaseapp.com",
  projectId: "attendance-app-d215e",
  storageBucket: "attendance-app-d215e.firebasestorage.app",
  messagingSenderId: "31107838129",
  appId: "1:31107838129:web:905a38215ab9bc9fe53290",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { app };
