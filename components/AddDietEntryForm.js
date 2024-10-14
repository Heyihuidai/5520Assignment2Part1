import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function AddDietEntryForm() {
  // State for form inputs
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Hooks for navigation, data management, and theming
  const navigation = useNavigation();
  const { addDietEntry } = useData();
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  // Handle form submission
  const handleSave = () => {
    // Validate inputs
    if (!description || !calories) {
      alert('Please fill in all fields');
      return;
    }

    const caloriesNum = parseInt(calories, 10);
    if (isNaN(caloriesNum) || caloriesNum < 0) {
      alert('Please enter a valid number of calories');
      return;
    }

    // Create and save new diet entry
    const newEntry = {
      description,
      calories: caloriesNum,
      date: date.toISOString().split('T')[0],
      isSpecial: caloriesNum > 800
    };

    addDietEntry(newEntry);
    navigation.goBack();
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

      {/* Form buttons */}
      <View style={styleHelper.forms.buttonContainer}>
        <TouchableOpacity 
          style={styleHelper.forms.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styleHelper.forms.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styleHelper.forms.saveButton}
          onPress={handleSave}
        >
          <Text style={styleHelper.forms.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}