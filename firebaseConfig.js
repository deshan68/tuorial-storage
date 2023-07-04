import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1ddrSry7vfNhVKKcML-3OL8T4KKC31gc",
  authDomain: "storage-2-expo.firebaseapp.com",
  projectId: "storage-2-expo",
  storageBucket: "storage-2-expo.appspot.com",
  messagingSenderId: "259825490687",
  appId: "1:259825490687:web:8392d46c01f6238ae74aca",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
