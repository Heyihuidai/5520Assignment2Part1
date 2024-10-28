import React from 'react';
import { View, Alert, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AddActivityForm from '../components/AddActivityForm';
import { useTheme } from '../context/ThemeContext';
import { deleteActivity } from '../firebase/firestoreOperations';  // for EditActivityScreen
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function EditActivityScreen({ route, navigation }) {
  const { activity } = route.params;
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this activity?",
      [
        { 
          text: "Cancel", 
          style: "cancel" 
        },
        { 
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await deleteActivity(activity.id);
              if (success) {
                navigation.goBack();
              } else {
                Alert.alert("Error", "Failed to delete activity. Please try again.");
              }
            } catch (error) {
              console.error("Delete activity error:", error);
              Alert.alert("Error", "An unexpected error occurred while deleting the activity.");
            }
          }
        }
      ]
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Edit Activity",
      headerRight: () => (
        <Pressable 
          onPress={handleDelete}
          style={({ pressed }) => [
            { marginRight: 15 },
            pressed && { opacity: 0.7 }
          ]}
          android_ripple={{
            color: themeColors.ripple,
            radius: 20,
            borderless: true
          }}
        >
          <MaterialIcons 
            name="delete" 
            size={24} 
            color={themeColors.text}
          />
        </Pressable>
      ),
    });
  }, [navigation, themeColors.text]);

  return (
    <View style={[styleHelper.screens.container, { backgroundColor: themeColors.background }]}>
      <AddActivityForm initialData={activity} isEditing={true} />
    </View>
  );
}