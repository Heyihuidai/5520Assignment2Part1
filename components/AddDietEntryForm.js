import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import { addDietEntry, updateDietEntry } from '../firebase/firestoreOperations'
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function AddDietEntryForm({ initialData, isEditing }) {
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);
  const [wasInitiallySpecial, setWasInitiallySpecial] = useState(false);

  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
      setCalories(initialData.calories.toString());
      setDate(new Date(initialData.date));
      if (initialData.isSpecial === true) {
        setIsSpecial(true);
        setWasInitiallySpecial(true);
      }
    }
  }, [initialData]);

  const handleSpecialChange = async (newValue) => {
    console.log('Checkbox changed. New value:', newValue);
    console.log('Current isSpecial state:', isSpecial);
    console.log('Initial data:', initialData);
    
    setIsSpecial(newValue);
    
    // If we're unchecking the special status, update immediately in Firestore
    if (!newValue && isEditing && initialData?.id) {
      console.log('Attempting to update Firestore - removing special status');
      try {
        setIsSubmitting(true);
        const updatedData = {
          ...initialData,
          isSpecial: false,
          lastUpdated: new Date().toISOString(), // Add this to trigger a UI refresh
        };
        console.log('Data being sent to Firestore:', updatedData);
        
        const success = await updateDietEntry(initialData.id, updatedData);
        console.log('Firestore update result:', success);
        
        if (!success) {
          console.log('Update failed, reverting checkbox');
          setIsSpecial(true);
          Alert.alert("Error", "Failed to update special status. Please try again.");
        }
      } catch (error) {
        console.error("Error updating special status:", error);
        console.log('Error occurred, reverting checkbox');
        setIsSpecial(true);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const processSubmission = async () => {
    try {
      setIsSubmitting(true);

      const entryData = {
        description,
        calories: parseInt(calories, 10),
        date: date.toISOString().split('T')[0],
        isSpecial,
        lastUpdated: new Date().toISOString(), // Add this to trigger a UI refresh
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

  const handleSave = async () => {
    if (isSubmitting) return;

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

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setShowDatePicker(false);
    }
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View style={styleHelper.forms.container}>
      <Text style={[styleHelper.forms.label, { color: themeColors.text }]}>Description *</Text>
      <TextInput
        style={[styleHelper.forms.input, { color: themeColors.text }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter food description"
        placeholderTextColor={themeColors.text}
      />

      <Text style={[styleHelper.forms.label, { color: themeColors.text }]}>Calories *</Text>
      <TextInput
        style={[styleHelper.forms.input, { color: themeColors.text }]}
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
        placeholder="Enter calories"
        placeholderTextColor={themeColors.text}
      />

      <Text style={[styleHelper.forms.label, { color: themeColors.text }]}>Date *</Text>
      <Pressable
        style={({ pressed }) => [
          styleHelper.forms.dateInput,
          pressed && { opacity: 0.7 }
        ]}
        onPress={() => setShowDatePicker(true)}
        android_ripple={{ color: themeColors.ripple }}
      >
        <Text style={{ color: themeColors.text }}>{formatDate(date)}</Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="inline"
          onChange={onChangeDate}
          style={styleHelper.forms.datePicker}
        />
      )}

      {isEditing && wasInitiallySpecial && (
        <View style={styleHelper.forms.checkboxContainer}>
          <Checkbox
            value={isSpecial}
            onValueChange={handleSpecialChange}
            style={styleHelper.forms.checkbox}
            color={isSpecial ? themeColors.primary : undefined}
            disabled={isSubmitting}
          />
          <Pressable 
            onPress={() => !isSubmitting && handleSpecialChange(!isSpecial)}
            style={styleHelper.forms.checkboxLabelContainer}
          >
            <Text style={[styleHelper.forms.checkboxLabel, { color: themeColors.text }]}>
              Keep Special Status
            </Text>
          </Pressable>
        </View>
      )}

      <View style={styleHelper.forms.buttonContainer}>
        <Pressable 
          style={({ pressed }) => [
            styleHelper.forms.cancelButton,
            pressed && { opacity: 0.7 }
          ]}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
          android_ripple={{ color: '#cccccc' }}
        >
          <Text style={styleHelper.forms.cancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable 
          style={({ pressed }) => [
            styleHelper.forms.saveButton,
            pressed && { opacity: 0.7 },
            isSubmitting && { opacity: 0.7 }
          ]}
          onPress={handleSave}
          disabled={isSubmitting}
          android_ripple={{ color: '#2471cc' }}
        >
          <Text style={styleHelper.forms.saveButtonText}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Save'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}