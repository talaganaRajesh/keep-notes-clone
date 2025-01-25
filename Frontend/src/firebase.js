import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDUF0Dz_xvAfA2gYPEG1G-YT3MPnr-cWXo",
  authDomain: "thekeepnotes.firebaseapp.com",
  projectId: "thekeepnotes",
  storageBucket: "thekeepnotes.firebasestorage.app",
  messagingSenderId: "837408196727",
  appId: "1:837408196727:web:d51d790515f528db36de72",
  measurementId: "G-ZZQEJP1S4J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth=getAuth(app);

export{
    auth
};