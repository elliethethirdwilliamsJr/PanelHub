import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWR5l-q2vFE-VEqX7LT6K_5bIPBk6oiRw",
  authDomain: "paneldrop-2d6dc.firebaseapp.com",
  projectId: "paneldrop-2d6dc",
  storageBucket: "paneldrop-2d6dc.firebasestorage.app",
  messagingSenderId: "1078330788736",
  appId: "1:1078330788736:web:8ccd76ee1e5e12ee6d25ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
