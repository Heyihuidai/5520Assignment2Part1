import React from 'react';
import { View, Alert, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AddDietEntryForm from '../components/AddDietEntryForm';
import { useTheme } from '../context/ThemeContext';
import { deleteDietEntry } from '../firebase/firestoreOperations';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function EditDietEntryScreen({ route, navigation }) {
  const { entry } = route.params;
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this entry?",
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
              const success = await deleteDietEntry(entry.id);
              if (success) {
                navigation.goBack();
              } else {
                Alert.alert("Error", "Failed to delete diet entry. Please try again.");
              }
            } catch (error) {
              console.error("Delete diet entry error:", error);
              Alert.alert("Error", "An unexpected error occurred while deleting the entry.");
            }
          }
        }
      ]
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Edit Diet Entry",
      headerRight: () => (
        <TouchableOpacity 
          onPress={handleDelete}
          style={{ marginRight: 15 }}
        >
          <MaterialIcons 
            name="delete" 
            size={24} 
            color={themeColors.text}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, themeColors.text]);

  return (
    <View style={[styleHelper.screens.container, { backgroundColor: themeColors.background }]}>
      <AddDietEntryForm initialData={entry} isEditing={true} />
    </View>
  );
}