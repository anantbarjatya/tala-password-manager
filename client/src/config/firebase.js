import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            "AIzaSyBYe0R8cxR9J1oZyuBiRjn4MumAWqZKrE4",
  authDomain:        "tala-639b6.firebaseapp.com",
  projectId:         "tala-639b6",
  storageBucket:     "tala-639b6.firebasestorage.app",
  messagingSenderId: "790267447287",
  appId:             "1:790267447287:web:5eed7a1e436474175510f2"
};

const app      = initializeApp(firebaseConfig);
export const auth     = getAuth(app);
export const provider = new GoogleAuthProvider();