// firebase/firebaseSetup.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB_SFBdjSj7RazoEaKfExZl7JPVzIuR08Y",
  authDomain: "assignment2part2-53cf6.firebaseapp.com",
  projectId: "assignment2part2-53cf6",
  storageBucket: "assignment2part2-53cf6.appspot.com",
  messagingSenderId: "177984686736",
  appId: "1:177984686736:web:e23388f4d03edec64ea615"
};

let app;
let db;

const initializeFirebase = async () => {
  try {
    console.log('📌 Project ID:', firebaseConfig.projectId);
    console.log('🔧 Firebase Apps:', getApps().length);

    // Initialize Firebase app
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log('🆕 Created new Firebase app');
    } else {
      app = getApp();
      console.log('♻️ Retrieved existing Firebase app');
    }

    // Initialize Firestore
    db = getFirestore(app);
    
    // Enable offline persistence
    try {
      await enableIndexedDbPersistence(db);
      console.log('📱 Offline persistence enabled');
    } catch (err) {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ The current browser doesn\'t support persistence.');
      }
    }

    console.log('✅ Firestore initialized successfully');
    return { app, db };
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    throw error;
  }
};

// Initialize Firebase immediately
const firebaseInstance = initializeFirebase();

// Export a function to get the initialized instances
export const getFirebaseInstances = async () => {
  try {
    const instances = await firebaseInstance;
    if (!instances.db) {
      throw new Error('Firestore instance not initialized');
    }
    return instances;
  } catch (error) {
    console.error('Failed to get Firebase instances:', error);
    throw error;
  }
};