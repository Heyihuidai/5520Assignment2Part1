import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import DietScreen from '../screens/DietScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddActivityScreen from '../screens/AddActivityScreen';
import AddDietEntryScreen from '../screens/AddDietEntryScreen';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { theme, isDarkMode } = useTheme();
  console.log('Theme in MainTabs:', theme);

  if (!theme || !theme.colors) {
    console.error('Theme or theme.colors is undefined');
    return null;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Activities') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Diet') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.tabIcon, // Use the new orange color
        tabBarInactiveTintColor: isDarkMode ? 'rgba(255,165,0,0.5)' : 'rgba(255,165,0,0.7)', // Semi-transparent orange
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground, // Use the new tab bar background color
          borderTopWidth: 0, // Remove the top border
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.headerText, // Use headerText color for better contrast
      })}
    >
      <Tab.Screen name="Activities" component={ActivitiesScreen} />
      <Tab.Screen name="Diet" component={DietScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.headerText, // Use headerText color for better contrast
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AddActivity" component={AddActivityScreen} />
      <Stack.Screen name="AddDietEntry" component={AddDietEntryScreen} />
    </Stack.Navigator>
  );
}