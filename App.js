import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './context/ThemeContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </NavigationContainer>
  );
}