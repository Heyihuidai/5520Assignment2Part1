import React, { createContext, useState, useContext, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseSetup';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [dietEntries, setDietEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch activities and diet entries when the component mounts
  useEffect(() => {
    console.log('Setting up Firestore listeners...');
    const fetchData = async () => {
      try {
        // Set up real-time listeners for both collections
        const activitiesQuery = query(
          collection(db, 'activities'),
          orderBy('createdAt', 'desc')
        );

        const dietEntriesQuery = query(
          collection(db, 'dietEntries'),
          orderBy('createdAt', 'desc')
        );

        // Real-time listener for activities
        const unsubscribeActivities = onSnapshot(activitiesQuery, (snapshot) => {
          console.log('Activities snapshot received:', snapshot.docs.length, 'documents');
          const activitiesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()
          }));
          setActivities(activitiesData);
        }, (error) => {
          console.error('Activities listener error:', error);
        });

        // Real-time listener for diet entries
        const unsubscribeDiet = onSnapshot(dietEntriesQuery, (snapshot) => {
          console.log('Diet entries snapshot received:', snapshot.docs.length, 'documents');
          const dietData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()
          }));
          setDietEntries(dietData);
        }, (error) => {
          console.error('Diet entries listener error:', error);
        });

        setLoading(false);

        // Cleanup function to remove listeners
        return () => {
          unsubscribeActivities();
          unsubscribeDiet();
        };
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Local state updates for optimistic UI updates
  const updateLocalActivities = (newActivity) => {
    setActivities(prevActivities => [...prevActivities, newActivity]);
  };

  const updateLocalDietEntries = (newEntry) => {
    setDietEntries(prevEntries => [...prevEntries, newEntry]);
  };

  const addActivity = async (activity) => {
    // Validate duration
    const duration = parseInt(activity.duration);
    if (isNaN(duration) || duration <= 0) {
      return false;
    }

    try {
      const isSpecial = (activity.activityType === 'Running' || activity.activityType === 'Weights') && duration > 60;
      
      const activityData = {
        ...activity,
        duration,
        isSpecial,
        createdAt: serverTimestamp()
      };

      // Optimistic update with temporary ID
      const tempId = Date.now();
      const optimisticActivity = {
        ...activityData,
        id: tempId,
        createdAt: new Date()
      };
      updateLocalActivities(optimisticActivity);

      // Add to Firebase
      await addDoc(collection(db, 'activities'), activityData);
      return true;
    } catch (error) {
      console.error('Error adding activity:', error);
      // Rollback optimistic update on error
      setActivities(prevActivities => 
        prevActivities.filter(activity => activity.id !== tempId)
      );
      return false;
    }
  };

  const addDietEntry = async (entry) => {
    try {
      const isSpecial = entry.calories > 800;
      
      const dietData = {
        ...entry,
        isSpecial,
        createdAt: serverTimestamp()
      };

      // Optimistic update with temporary ID
      const tempId = Date.now();
      const optimisticEntry = {
        ...dietData,
        id: tempId,
        createdAt: new Date()
      };
      updateLocalDietEntries(optimisticEntry);

      // Add to Firebase
      await addDoc(collection(db, 'dietEntries'), dietData);
      return true;
    } catch (error) {
      console.error('Error adding diet entry:', error);
      // Rollback optimistic update on error
      setDietEntries(prevEntries => 
        prevEntries.filter(entry => entry.id !== tempId)
      );
      return false;
    }
  };

  return (
    <DataContext.Provider value={{ 
      activities, 
      dietEntries, 
      addActivity, 
      addDietEntry,
      loading 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

export default DataProvider;