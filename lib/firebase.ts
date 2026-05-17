import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyALxS3QpHwyrHU_7eEQh1ab4Foeq1envGY",
  authDomain: "tiffin-62938.firebaseapp.com",
  projectId: "tiffin-62938",
  storageBucket: "tiffin-62938.firebasestorage.app",
  messagingSenderId: "392628109006",
  appId: "1:392628109006:web:affcea3ae0e18700c81a9f",
  measurementId: "G-PZCCM1RPNE",
  databaseURL: "https://tiffin-62938-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Initialize analytics only in browser
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, database, analytics };
