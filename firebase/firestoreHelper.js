import { 
  collection, 
  query,
  orderBy,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from './firebaseSetup';

// Keep these utility functions
const verifyFirestoreInstance = () => {
  if (!db) {
    console.error('❌ Firestore db instance is undefined!');
    throw new Error('Firestore not properly initialized');
  }

  console.log('🔥 Firestore instance details:', {
    projectId: db?._databaseId?.projectId,
    settings: db?.settings
  });
  return true;
};

// Verify instance on module load
verifyFirestoreInstance();

// Utility functions that can be used by firestoreOperations
export const firestoreHelper = {
  addTimestamps: (data, isNew = true) => ({
    ...data,
    updatedAt: serverTimestamp(),
    ...(isNew ? { createdAt: serverTimestamp() } : {})
  }),

  createQuery: (collectionRef, options = {}) => {
    const queryConstraints = [
      orderBy(options.orderBy || 'date', options.orderDirection || 'desc')
    ];

    if (options.where) {
      options.where.forEach(({ field, operator, value }) => {
        queryConstraints.push(where(field, operator, value));
      });
    }

    return query(collectionRef, ...queryConstraints);
  },

  getCollectionRef: (collectionName) => {
    if (!collectionName) throw new Error('Collection name is required');
    return collection(db, collectionName);
  },

  logError: (operation, collectionName, error) => {
    console.error(`❌ Error in ${operation} for ${collectionName}:`, {
      error: error.message,
      code: error.code,
      stack: error.stack
    });
  },

  logSuccess: (operation, collectionName, data) => {
    console.log(`✅ ${operation} successful for ${collectionName}:`, data);
  }
};