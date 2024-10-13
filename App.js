import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';

import AppNavigator from './navigation/AppNavigator'; 

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </DataProvider>
    </ThemeProvider>
  );
}