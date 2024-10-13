import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import DietScreen from '../screens/DietScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddActivityScreen from '../screens/AddActivityScreen';
import AddDietEntryScreen from '../screens/AddDietEntryScreen';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  const addButton = (navigation, navigateTo) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(navigateTo)}
      style={styleHelper.header?.addButton || { marginRight: 15 }}
    >
      <Text style={[
        styleHelper.header?.addButtonText || { fontSize: 16, fontWeight: 'bold' },
        { color: themeColors.headerText }
      ]}>
        Add
      </Text>
    </TouchableOpacity>
  );

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
        tabBarActiveTintColor: themeColors.tabIcon,
        tabBarInactiveTintColor: themeColors.tabBarInactiveIcon,
        tabBarStyle: {
          backgroundColor: themeColors.tabBarBackground,
          borderTopWidth: 0,
        },
        headerStyle: {
          backgroundColor: themeColors.primary,
        },
        headerTintColor: themeColors.headerText,
        headerShown: true,
      })}
    >
      <Tab.Screen 
        name="Activities" 
        component={ActivitiesScreen}
        options={({ navigation }) => ({
          headerRight: () => addButton(navigation, 'AddActivity'),
        })}
      />
      <Tab.Screen 
        name="Diet" 
        component={DietScreen}
        options={({ navigation }) => ({
          headerRight: () => addButton(navigation, 'AddDietEntry'),
        })}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.primary,
        },
        headerTintColor: themeColors.headerText,
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