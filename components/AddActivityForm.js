import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function AddActivityForm() {
  // State for dropdown picker
  const [open, setOpen] = useState(false);
  const [activityType, setActivityType] = useState(null);
  const [items, setItems] = useState([
    /* Activity options */
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

  // Hooks for navigation, data management, and theming
  const navigation = useNavigation();
  const { addActivity } = useData();
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  // Handle form submission
  const handleSave = () => {
    // Validate inputs
    if (!activityType) {
      Alert.alert("Alert", "Please select an activity.");
      return;
    }
    if (!duration || isNaN(duration) || parseInt(duration, 10) <= 0) {
      Alert.alert("Alert", "Please enter a valid duration (greater than 0).");
      return;
    }

    // Create and save new activity
    const newActivity = {
      activityType,
      duration: parseInt(duration, 10),
      date: date.toISOString().split('T')[0],
    };

    const success = addActivity(newActivity);
    if (success) {
      navigation.goBack();
    } else {
      Alert.alert("Alert", "Failed to add activity. Please try again.");
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
        /* DropDownPicker props */
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
        /* TextInput props */
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
          /* DateTimePicker props */
          value={date}
          mode="date"
          display="default"
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