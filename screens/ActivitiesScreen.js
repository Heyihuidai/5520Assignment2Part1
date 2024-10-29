import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { subscribeToActivities } from '../firebase/firestoreOperations';
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
    const unsubscribe = subscribeToActivities(
      (updatedActivities) => {
        setActivities(updatedActivities);
        setLoading(false);
      },
      (error) => {
        console.error('Activities fetch error:', error);
        setError('Failed to load activities. Please try again.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // The subscription will automatically retry
  };

  return (
    <View style={[styleHelper.screens.container, { backgroundColor: themeColors.background }]}>
      <ItemsList
        type="activity"
        data={activities}
        loading={loading}
        error={error}
        onRetry={handleRetry}
      />
    </View>
  );
}