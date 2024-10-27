import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { activitiesHelper } from '../firebase/firestoreHelper';
import ItemsList from '../components/ItemsList';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function ActivitiesScreen() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  useEffect(() => {
    let isMounted = true;

    const initializeActivities = async () => {
      try {
        console.log('🚀 Initializing activities subscription...');
        
        const unsubscribe = await activitiesHelper.subscribeToActivities(
          (updatedActivities) => {
            if (isMounted) {
              console.log('📦 Received activities update:', updatedActivities.length);
              setActivities(updatedActivities);
              setLoading(false);
            }
          },
          (error) => {
            if (isMounted) {
              const errorMsg = `Failed to load activities: ${error.message}`;
              console.error('❌', errorMsg);
              setError(errorMsg);
              setLoading(false);
              Alert.alert('Error', errorMsg);
            }
          }
        );

        return unsubscribe;
      } catch (error) {
        if (isMounted) {
          const errorMsg = `Failed to initialize activities: ${error.message}`;
          console.error('❌', errorMsg);
          setError(errorMsg);
          setLoading(false);
          Alert.alert('Error', errorMsg);
        }
        return () => {}; // Return empty cleanup function in case of error
      }
    };

    const cleanup = initializeActivities();

    return () => {
      isMounted = false;
      cleanup.then(unsubscribe => {
        if (unsubscribe) {
          console.log('🧹 Cleaning up activities subscription');
          unsubscribe();
        }
      });
    };
  }, []);

  // Render error state
  if (error) {
    return (
      <View style={[styleHelper.screens.container, { backgroundColor: themeColors.background }]}>
        <Text style={{ color: themeColors.error, padding: 16, textAlign: 'center' }}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styleHelper.screens.container, { backgroundColor: themeColors.background }]}>
      <ItemsList
        type="activity"
        data={activities}
        loading={loading}
        error={error}
      />
    </View>
  );
}