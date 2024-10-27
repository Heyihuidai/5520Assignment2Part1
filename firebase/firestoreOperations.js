import { 
    collection, 
    addDoc, 
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot
  } from 'firebase/firestore';
  import { db } from './firebaseSetup';
  
  // Activities Operations
  export const addActivity = async (activity) => {
    try {
      const duration = parseInt(activity.duration);
      if (isNaN(duration) || duration <= 0) {
        return false;
      }
  
      const isSpecial = (activity.activityType === 'Running' || activity.activityType === 'Weights') && duration > 60;
      
      const activityData = {
        ...activity,
        duration,
        isSpecial,
        date: activity.date,
        createdAt: serverTimestamp()
      };
  
      await addDoc(collection(db, 'activities'), activityData);
      return true;
    } catch (error) {
      console.error('Error adding activity:', error);
      return false;
    }
  };
  
  export const updateActivity = async (id, activityData) => {
    try {
      const activityRef = doc(db, 'activities', id);
      const duration = parseInt(activityData.duration);
      
      if (isNaN(duration) || duration <= 0) {
        return false;
      }
  
      const isSpecial = (activityData.activityType === 'Running' || 
                        activityData.activityType === 'Weights') && 
                        duration > 60;
  
      const updateData = {
        ...activityData,
        duration,
        isSpecial,
        date: activityData.date,
        updatedAt: serverTimestamp()
      };
  
      await updateDoc(activityRef, updateData);
      return true;
    } catch (error) {
      console.error('Error updating activity:', error);
      return false;
    }
  };
  
  export const deleteActivity = async (id) => {
    try {
      await deleteDoc(doc(db, 'activities', id));
      return true;
    } catch (error) {
      console.error('Error deleting activity:', error);
      return false;
    }
  };
  
  export const subscribeToActivities = (onData, onError) => {
    const q = query(
      collection(db, 'activities'),
      orderBy('date', 'desc')
    );
  
    return onSnapshot(q, 
      (snapshot) => {
        const activities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        onData(activities);
      },
      onError
    );
  };
  
  // Diet Entries Operations
  export const addDietEntry = async (entry) => {
    try {
      const calories = parseInt(entry.calories);
      if (isNaN(calories) || calories < 0) {
        return false;
      }
  
      const isSpecial = calories > 800;
      
      const dietData = {
        ...entry,
        calories,
        isSpecial,
        date: entry.date,
        createdAt: serverTimestamp()
      };
  
      await addDoc(collection(db, 'dietEntries'), dietData);
      return true;
    } catch (error) {
      console.error('Error adding diet entry:', error);
      return false;
    }
  };
  
  export const updateDietEntry = async (id, entryData) => {
    try {
      const entryRef = doc(db, 'dietEntries', id);
      const calories = parseInt(entryData.calories);
      
      if (isNaN(calories) || calories < 0) {
        return false;
      }
  
      const isSpecial = calories > 800;
  
      const updateData = {
        ...entryData,
        calories,
        isSpecial,
        date: entryData.date,
        updatedAt: serverTimestamp()
      };
  
      await updateDoc(entryRef, updateData);
      return true;
    } catch (error) {
      console.error('Error updating diet entry:', error);
      return false;
    }
  };
  
  export const deleteDietEntry = async (id) => {
    try {
      await deleteDoc(doc(db, 'dietEntries', id));
      return true;
    } catch (error) {
      console.error('Error deleting diet entry:', error);
      return false;
    }
  };
  
  export const subscribeToDietEntries = (onData, onError) => {
    const q = query(
      collection(db, 'dietEntries'),
      orderBy('date', 'desc')
    );
  
    return onSnapshot(q, 
      (snapshot) => {
        const entries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        onData(entries);
      },
      onError
    );
  };