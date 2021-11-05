import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAHcGhxuPSw4IxM6HvvOyQZiXBq3n38CnI",
  authDomain: "instagram-15651.firebaseapp.com",
  projectId: "instagram-15651",
  storageBucket: "instagram-15651.appspot.com",
  messagingSenderId: "568578638991",
  appId: "1:568578638991:web:12a98a0171ef48490d9cfa"
};

const app = initializeApp(firebaseConfig);
export default app
export const db = getFirestore()
export const auth = getAuth()
export const storage = getStorage()