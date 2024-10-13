import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './app/context/ThemeContext';
import { DataProvider } from './app/context/DataContext';

import AppNavigator from './app/navigation/AppNavigator'; 

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