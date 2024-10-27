import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  where 
} from "firebase/firestore";
import { db } from './firebaseSetup';

// Enhanced initial verification with detailed logging
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

// Helper function to ensure document has timestamps
const addTimestamps = (data, isNew = true) => ({
  ...data,
  updatedAt: serverTimestamp(),
  ...(isNew ? { createdAt: serverTimestamp() } : {})
});

// Helper function to create a query with optional filters
const createQuery = (collectionRef, options = {}) => {
  const queryConstraints = [
    orderBy(options.orderBy || 'createdAt', options.orderDirection || 'desc')
  ];

  if (options.where) {
    options.where.forEach(({ field, operator, value }) => {
      queryConstraints.push(where(field, operator, value));
    });
  }

  return query(collectionRef, ...queryConstraints);
};

// Test document creation function
export const addTestDocuments = async () => {
  try {
    console.log('📝 Adding test documents...');

    const testActivity = {
      name: 'Test Activity',
      description: 'Test activity description',
      type: 'test'
    };

    const testDiet = {
      name: 'Test Diet Item',
      calories: 100,
      type: 'test'
    };

    const activityRef = await firestoreHelper.addItem('activities', testActivity);
    const dietRef = await firestoreHelper.addItem('diet', testDiet);

    console.log('✅ Test documents added successfully:', {
      activity: activityRef.id,
      diet: dietRef.id
    });

    return { activityRef, dietRef };
  } catch (error) {
    console.error('❌ Error adding test documents:', {
      error: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};

export const firestoreHelper = {
  // Add item to collection
  addItem: async (collectionName, itemData) => {
    try {
      if (!collectionName) throw new Error('Collection name is required');
      if (!itemData) throw new Error('Item data is required');

      const collectionRef = collection(db, collectionName);
      console.log(`📝 Creating document in ${collectionName}:`, {
        collectionPath: collectionRef.path,
        itemFields: Object.keys(itemData)
      });

      const itemWithTimestamp = addTimestamps(itemData);
      const docRef = await addDoc(collectionRef, itemWithTimestamp);
      
      console.log(`✅ Document added to ${collectionName}:`, {
        id: docRef.id,
        path: docRef.path
      });
      
      return { id: docRef.id, ...itemWithTimestamp };
    } catch (error) {
      console.error(`❌ Error adding to ${collectionName}:`, {
        error: error.message,
        code: error.code,
        stack: error.stack
      });
      throw error;
    }
  },

  // Get items from collection
  getItems: async (collectionName, options = {}) => {
    try {
      if (!collectionName) throw new Error('Collection name is required');

      const collectionRef = collection(db, collectionName);
      const itemsQuery = createQuery(collectionRef, options);

      console.log(`📚 Fetching from ${collectionName}:`, {
        path: collectionRef.path,
        options
      });

      const snapshot = await getDocs(itemsQuery);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`📥 Retrieved from ${collectionName}:`, {
        count: items.length,
        firstItem: items[0]?.id || 'none'
      });
      
      return items;
    } catch (error) {
      console.error(`❌ Error getting ${collectionName} items:`, {
        error: error.message,
        code: error.code,
        stack: error.stack
      });
      throw error;
    }
  },

  // Delete item
  deleteItem: async (collectionName, itemId) => {
    try {
      if (!collectionName) throw new Error('Collection name is required');
      if (!itemId) throw new Error('Item ID is required');

      const docRef = doc(db, collectionName, itemId);
      
      console.log(`🗑️ Deleting from ${collectionName}:`, {
        id: itemId,
        path: docRef.path
      });

      await deleteDoc(docRef);
      console.log(`✅ Deleted from ${collectionName}:`, itemId);
    } catch (error) {
      console.error(`❌ Error deleting from ${collectionName}:`, {
        error: error.message,
        code: error.code,
        stack: error.stack
      });
      throw error;
    }
  },

  // Subscribe to collection changes
  subscribeToCollection: (collectionName, onUpdate, onError, options = {}) => {
    try {
      if (!collectionName) throw new Error('Collection name is required');
      if (!onUpdate) throw new Error('Update callback is required');

      const collectionRef = collection(db, collectionName);
      const itemsQuery = createQuery(collectionRef, options);

      console.log(`👂 Setting up ${collectionName} listener:`, {
        path: collectionRef.path,
        options
      });

      const unsubscribe = onSnapshot(
        itemsQuery,
        {
          next: (snapshot) => {
            console.log(`📡 ${collectionName} snapshot:`, {
              size: snapshot.size,
              metadata: {
                fromCache: snapshot.metadata.fromCache,
                hasPendingWrites: snapshot.metadata.hasPendingWrites
              }
            });

            const items = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

            console.log(`🔄 ${collectionName} update:`, {
              count: items.length,
              firstItem: items[0]?.id || 'none'
            });

            onUpdate(items);
          },
          error: (error) => {
            console.error(`❌ ${collectionName} listener error:`, {
              error: error.message,
              code: error.code,
              stack: error.stack
            });
            if (onError) onError(error);
          }
        }
      );

      return () => {
        console.log(`🧹 Cleaning up ${collectionName} listener`);
        unsubscribe();
      };
    } catch (error) {
      console.error(`❌ Error in ${collectionName} subscription:`, {
        error: error.message,
        code: error.code,
        stack: error.stack
      });
      if (onError) onError(error);
      throw error;
    }
  }
};