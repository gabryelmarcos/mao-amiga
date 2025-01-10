import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore'
import {initializeAuth, getReactNativePersistence} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBmcyjqCOMy5IIgsa-ZZaaqXMn9uR3PIIw",
  authDomain: "mao-amiga-a04a9.firebaseapp.com",
  projectId: "mao-amiga-a04a9",
  storageBucket: "mao-amiga-a04a9.firebasestorage.app",
  messagingSenderId: "322120129648",
  appId: "1:322120129648:web:b4aa5cf742acf4130c68b5",
  measurementId: "G-T21W7T145Z"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})

export {db,auth}

