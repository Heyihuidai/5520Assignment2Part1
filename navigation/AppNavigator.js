import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import DietScreen from '../screens/DietScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddActivityScreen from '../screens/AddActivityScreen';
import AddDietEntryScreen from '../screens/AddDietEntryScreen';
import EditActivityScreen from '../screens/EditActivityScreen';
import EditDietEntryScreen from '../screens/EditDietEntryScreen';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';
import { Pressable } from '../components/Pressable';
import { PRESSABLE_TYPES } from '../hooks/usePressableFeedback';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  const headerButtons = (navigation, navigateTo, iconType) => (
    <View style={{ flexDirection: 'row', marginRight: 15 }}>
      <Pressable
        type={PRESSABLE_TYPES.DEFAULT}
        onPress={() => navigation.navigate(navigateTo)}
        style={{ marginRight: 2 }}
        feedbackConfig={{
          rippleColor: themeColors.ripple,
          rippleRadius: 20,
          rippleBorderless: true
        }}
      >
        <Ionicons 
          name="add"
          size={24}
          color={themeColors.headerText}
        />
      </Pressable>
      <Pressable
        type={PRESSABLE_TYPES.DEFAULT}
        feedbackConfig={{
          rippleColor: themeColors.ripple,
          rippleRadius: 20,
          rippleBorderless: true
        }}
      >
        <Ionicons 
          name={iconType === 'activity' ? 'fitness' : 'restaurant'}
          size={24}
          color={themeColors.headerText}
        />
      </Pressable>
    </View>
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
          headerRight: () => headerButtons(navigation, 'AddActivity', 'activity'),
        })}
      />
      <Tab.Screen 
        name="Diet" 
        component={DietScreen}
        options={({ navigation }) => ({
          headerRight: () => headerButtons(navigation, 'AddDietEntry', 'diet'),
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
      <Stack.Screen name="EditActivity" component={EditActivityScreen} />
      <Stack.Screen name="EditDietEntry" component={EditDietEntryScreen} />
    </Stack.Navigator>
  );
}