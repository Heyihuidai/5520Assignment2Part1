import { 
    collection, 
    addDoc, 
    deleteDoc, 
    doc, 
    getDocs, 
    onSnapshot,
    query,
    orderBy,
    serverTimestamp 
  } from "firebase/firestore";
  import { getFirebaseInstances } from './firebaseSetup';
  
  export const activitiesHelper = {
    // Create a new activity
    async addActivity(activityData) {
      try {
        const { db } = await getFirebaseInstances();
        const activityWithTimestamp = {
          ...activityData,
          createdAt: serverTimestamp(), // Use server timestamp
          updatedAt: serverTimestamp()
        };
  
        const docRef = await addDoc(collection(db, 'activities'), activityWithTimestamp);
        console.log('✅ Activity added successfully:', docRef.id);
        return { id: docRef.id, ...activityData };
      } catch (error) {
        console.error("❌ Error adding activity:", error);
        throw error;
      }
    },
  
    // Read all activities
    async getActivities() {
      try {
        const { db } = await getFirebaseInstances();
        const activitiesQuery = query(
          collection(db, 'activities'),
          orderBy('createdAt', 'desc')
        );
  
        const querySnapshot = await getDocs(activitiesQuery);
        const activities = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
  
        console.log('📥 Retrieved activities:', activities.length);
        return activities;
      } catch (error) {
        console.error("❌ Error getting activities:", error);
        throw error;
      }
    },
  
    // Delete an activity
    async deleteActivity(activityId) {
      try {
        const { db } = await getFirebaseInstances();
        await deleteDoc(doc(db, 'activities', activityId));
        console.log("✅ Activity deleted successfully:", activityId);
      } catch (error) {
        console.error("❌ Error deleting activity:", error);
        throw error;
      }
    },
  
    // Set up real-time listener for activities
    async subscribeToActivities(onUpdate, onError) {
      try {
        const { db } = await getFirebaseInstances();
        const activitiesQuery = query(
          collection(db, 'activities'),
          orderBy('createdAt', 'desc')
        );
  
        const unsubscribe = onSnapshot(
          activitiesQuery,
          (snapshot) => {
            const activities = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            console.log('🔄 Real-time update:', activities.length, 'activities');
            onUpdate(activities);
          },
          (error) => {
            console.error("❌ Real-time listener error:", error);
            if (onError) onError(error);
          }
        );
  
        return unsubscribe;
      } catch (error) {
        console.error("❌ Error setting up activities subscription:", error);
        if (onError) onError(error);
        throw error;
      }
    }
  };