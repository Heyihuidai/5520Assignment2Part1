import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';
import { addActivity, updateActivity } from '../firebase/firestoreOperations';

export default function AddActivityForm({ initialData, isEditing }) {
  // State for dropdown picker
  const [open, setOpen] = useState(false);
  const [activityType, setActivityType] = useState(null);
  const [items, setItems] = useState([
    {label: 'Walking', value: 'Walking'},
    {label: 'Running', value: 'Running'},
    {label: 'Swimming', value: 'Swimming'},
    {label: 'Weights', value: 'Weights'},
    {label: 'Yoga', value: 'Yoga'},
    {label: 'Cycling', value: 'Cycling'},
    {label: 'Hiking', value: 'Hiking'},
    {label: 'Other', value: 'Other'},
  ]);
  
  // State for form inputs
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);

  // Hooks for navigation and theming
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  // Initialize form with existing data when editing
  useEffect(() => {
    if (initialData) {
      setActivityType(initialData.activityType);
      setDuration(initialData.duration.toString());
      setDate(new Date(initialData.date));
      setIsSpecial(initialData.isSpecial || false);
    }
  }, [initialData]);

  // Handle form submission
  const handleSave = async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    // Validate inputs
    if (!activityType) {
      Alert.alert("Alert", "Please select an activity.");
      return;
    }
    if (!duration || isNaN(duration) || parseInt(duration, 10) <= 0) {
      Alert.alert("Alert", "Please enter a valid duration (greater than 0).");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const activityData = {
        activityType,
        duration: parseInt(duration, 10),
        date: date.toISOString().split('T')[0],
        isSpecial,
      };

      let success;
      if (isEditing) {
        success = await updateActivity(initialData.id, activityData);
      } else {
        success = await addActivity(activityData);
      }
      
      if (success) {
        navigation.goBack();
      } else {
        Alert.alert("Error", `Failed to ${isEditing ? 'update' : 'add'} activity. Please try again.`);
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} activity:`, error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle date change
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View style={styleHelper.forms.container}>
      {/* Activity dropdown */}
      <Text style={[styleHelper.forms.label, { color: themeColors.text }]}>Activity *</Text>
      <DropDownPicker
        open={open}
        value={activityType}
        items={items}
        setOpen={setOpen}
        setValue={setActivityType}
        setItems={setItems}
        placeholder="Select An Activity"
        style={styleHelper.forms.dropdownInput}
        textStyle={styleHelper.forms.dropdownText}
        dropDownContainerStyle={[
          styleHelper.forms.dropdownContainer,
          { maxHeight: 200 }
        ]}
      />

      {/* Duration input */}
      <Text style={[styleHelper.forms.label, { color: themeColors.text }]}>Duration (min) *</Text>
      <TextInput
        style={[styleHelper.forms.input, { color: themeColors.text }]}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        placeholder="Enter duration"
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