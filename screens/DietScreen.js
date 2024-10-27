import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { firestoreHelper } from '../firebase/firestoreHelper';
import ItemsList from '../components/ItemsList';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function DietScreen() {
  const [dietItems, setDietItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  useEffect(() => {
    const unsubscribe = firestoreHelper.subscribeToCollection(
      'dietEntries',  // Changed from 'diet' to 'dietEntries' to match the collection name used in DataContext
      (updatedDiet) => {
        setDietItems(updatedDiet);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      {
        orderBy: 'createdAt',
        orderDirection: 'desc'
      }
    );

    return () => unsubscribe();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
  };

  return (
    <View style={[styleHelper.screens.container, { backgroundColor: themeColors.background }]}>
      <ItemsList
        type="diet"
        data={dietItems}
        loading={loading}
        error={error}
        onRetry={handleRetry}
      />
    </View>
  );
}