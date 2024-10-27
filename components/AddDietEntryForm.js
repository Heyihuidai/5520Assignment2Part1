import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import { addDietEntry, updateDietEntry } from '../firebase/firestoreOperations'
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function AddDietEntryForm({ initialData, isEditing }) {
  // State for form inputs
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);

  // Hooks for navigation, data management, and theming
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  // Initialize form with existing data when editing
  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
      setCalories(initialData.calories.toString());
      setDate(new Date(initialData.date));
      setIsSpecial(initialData.isSpecial || false);
    }
  }, [initialData]);

  // Process form submission
  const processSubmission = async () => {
    try {
      setIsSubmitting(true);

      const entryData = {
        description,
        calories: parseInt(calories, 10),
        date: date.toISOString().split('T')[0],
        isSpecial,
      };

      let success;
      if (isEditing) {
        success = await updateDietEntry(initialData.id, entryData);
      } else {
        success = await addDietEntry(entryData);
      }
      
      if (success) {
        navigation.goBack();
      } else {
        Alert.alert("Error", `Failed to ${isEditing ? 'update' : 'add'} diet entry. Please try again.`);
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} diet entry:`, error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission with confirmation for updates
  const handleSave = async () => {
    if (isSubmitting) return;

    // Validate inputs
    if (!description || !calories) {
      Alert.alert("Alert", "Please fill in all fields");
      return;
    }

    const caloriesNum = parseInt(calories, 10);
    if (isNaN(caloriesNum) || caloriesNum < 0) {
      Alert.alert("Alert", "Please enter a valid number of calories");
      return;
    }

    if (isEditing) {
      Alert.alert(
        "Important",
        "Are you sure you want to save these changes?",
        [
          { 
            text: "No", 
            style: "cancel" 
          },
          { 
            text: "Yes",
            onPress: processSubmission
          }
        ],
        { cancelable: false }
      );
    } else {
      await processSubmission();
    }
  };

  // Handle date change
  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setShowDatePicker(false);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View style={styleHelper.forms.container}>
      {/* Description input */}
      <Text style={[styleHelper.forms.label, { color: themeColors.text }]}>Description *</Text>
      <TextInput
        style={[styleHelper.forms.input, { color: themeColors.text }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter food description"
        placeholderTextColor={themeColors.text}
      />

      {/* Calories input */}
      <Text style={[styleHelper.forms.label, { color: themeColors.text }]}>Calories *</Text>
      <TextInput
        style={[styleHelper.forms.input, { color: themeColors.text }]}
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
        placeholder="Enter calories"
        placeholderTextColor={themeColors.text}
      />

      {/* Date picker */}
      <Text style={[styleHelper.forms.label, { color: themeColors.text }]}>Date *</Text>
      <TouchableOpacity
        style={styleHelper.forms.dateInput}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: themeColors.text }}>{formatDate(date)}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="inline"
          onChange={onChangeDate}
          style={styleHelper.forms.datePicker}
        />
      )}

      {/* Special checkbox (only shown in edit mode) */}
      {isEditing && (
        <View style={styleHelper.forms.checkboxContainer}>
          <Checkbox
            value={isSpecial}
            onValueChange={setIsSpecial}
            style={styleHelper.forms.checkbox}
          />
          <Text style={[styleHelper.forms.checkboxLabel, { color: themeColors.text }]}>
            Mark as Special
          </Text>
        </View>
      )}

      {/* Form buttons */}
      <View style={styleHelper.forms.buttonContainer}>
        <TouchableOpacity 
          style={styleHelper.forms.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          <Text style={styleHelper.forms.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styleHelper.forms.saveButton,
            isSubmitting && { opacity: 0.7 }
          ]}
          onPress={handleSave}
          disabled={isSubmitting}
        >
          <Text style={styleHelper.forms.saveButtonText}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}