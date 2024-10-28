import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import { addDietEntry, updateDietEntry } from '../firebase/firestoreOperations'
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';
import { Pressable } from '../components/Pressable';
import { PRESSABLE_TYPES } from '../hooks/usePressableFeedback';

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
    
    if (!newValue && isEditing && initialData?.id) {
      console.log('Attempting to update Firestore - removing special status');
      try {
        setIsSubmitting(true);
        const updatedData = {
          ...initialData,
          isSpecial: false,
          lastUpdated: new Date().toISOString(),
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
        lastUpdated: new Date().toISOString(),
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
        type={PRESSABLE_TYPES.DATE}
        style={styleHelper.forms.dateInput}
        onPress={() => setShowDatePicker(true)}
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
            type={PRESSABLE_TYPES.CHECKBOX}
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
          type={PRESSABLE_TYPES.CANCEL}
          style={styleHelper.forms.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          <Text style={styleHelper.forms.cancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable 
          type={PRESSABLE_TYPES.SAVE}
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
        </Pressable>
      </View>
    </View>
  );
}