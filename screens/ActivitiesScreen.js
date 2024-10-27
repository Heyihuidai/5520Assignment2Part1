import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseSetup';
import ItemsList from '../components/ItemsList';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function ActivitiesScreen() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  useEffect(() => {
    console.log('🔵 Setting up activities listener...'); // Debug log
    
    const activitiesRef = collection(db, 'activities');
    const q = query(activitiesRef, orderBy('createdAt', 'desc'));

    // Set up realtime listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('📥 Received activities update:', snapshot.docs.length, 'documents'); // Debug log
      
      const activitiesData = [];
      snapshot.forEach((doc) => {
        console.log(`📄 Document ${doc.id}:`, doc.data()); // Debug log for each document
        activitiesData.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log('📋 Full activities data:', activitiesData); // Debug log for final data
      setActivities(activitiesData);
      setLoading(false);
    }, (error) => {
      console.error('❌ Error fetching activities:', error); // Debug log for errors
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      console.log('🔴 Cleaning up activities listener'); // Debug log for cleanup
      unsubscribe();
    };
  }, []);

  // Debug log when activities state updates
  useEffect(() => {
    console.log('📊 Activities state updated:', activities.length, 'items'); // Debug log for state updates
  }, [activities]);

  return (
    <View style={[styleHelper.screens.container, { backgroundColor: themeColors.background }]}>
      <ItemsList 
        type="activity" 
        data={activities} 
        loading={loading} 
      />
    </View>
  );
}