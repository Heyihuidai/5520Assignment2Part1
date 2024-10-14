import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';

import AppNavigator from './navigation/AppNavigator'; 

export default function App() {
  return (
    // ThemeProvider: Manages the app's theme (e.g., light/dark mode)
    <ThemeProvider>
      {/* DataProvider: Manages global data state for the app */}
      <DataProvider>
        {/* NavigationContainer: Root component for React Navigation */}
        <NavigationContainer>
          {/* AppNavigator: Contains the app's navigation structure */}
          <AppNavigator />
        </NavigationContainer>
      </DataProvider>
    </ThemeProvider>
  );
}