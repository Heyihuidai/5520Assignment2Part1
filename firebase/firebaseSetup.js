import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentSingleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB_SFBdjSj7RazoEaKfExZl7JPVzIuR08Y",
  authDomain: "assignment2part2-53cf6.firebaseapp.com",
  projectId: "assignment2part2-53cf6",
  storageBucket: "assignment2part2-53cf6.appspot.com",
  messagingSenderId: "177984686736",
  appId: "1:177984686736:web:e23388f4d03edec64ea615"
};

// Initialize Firebase with logging
let app;
let db;

try {
  console.log('🔥 Initializing Firebase...');
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');

  console.log('📚 Initializing Firestore...');
  // Initialize Firestore with mobile-optimized settings
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true, // This helps with React Native
    useFetchStreams: false, // Better compatibility with React Native
  });
  
  console.log('✅ Firestore initialized successfully', {
    projectId: db?._databaseId?.projectId
  });

} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
  throw error;
}

if (!db) {
  throw new Error('Firestore failed to initialize properly');
}

export { db, app };