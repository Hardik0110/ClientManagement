import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYbggFHnuykcfWj9tHyoa4sxcbEdFrf7Y",
  authDomain: "client-management-dashbo-bdbb8.firebaseapp.com",
  databaseURL: "https://client-management-dashbo-bdbb8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "client-management-dashbo-bdbb8",
  storageBucket: "client-management-dashbo-bdbb8.firebasestorage.app",
  messagingSenderId: "452429575474",
  appId: "1:452429575474:web:d9b7b6632c760cd9f8532b",
  measurementId: "G-7R3SDFKBD0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);

// Export the app instance
export default app;