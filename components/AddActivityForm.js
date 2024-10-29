import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Platform, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';
import { addActivity, updateActivity } from '../firebase/firestoreOperations';
import { Pressable } from '../components/Pressable';
import { PRESSABLE_TYPES } from '../hooks/usePressableFeedback';

export default function AddActivityForm({ initialData, isEditing }) {
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
  
  const [duration, setDuration] = useState('');
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
      setActivityType(initialData.activityType);
      setDuration(initialData.duration.toString());
      setDate(new Date(initialData.date));
      if (initialData.isSpecial === true) {
        setIsSpecial(false); // Start unchecked when item is special
        setWasInitiallySpecial(true);
      }
    }
  }, [initialData]);

  const handleSpecialChange = async (newValue) => {
    console.log('Checkbox changed. New value:', newValue);
    console.log('Current isSpecial state:', isSpecial);
    console.log('Initial data:', initialData);
    
    setIsSpecial(newValue);
    
    // If we're approving the special status, update immediately in Firestore
    if (newValue && isEditing && initialData?.id) {
      console.log('Attempting to update Firestore - approving special status');
      try {
        setIsSubmitting(true);
        const updatedData = {
          ...initialData,
          isSpecial: true
        };
        console.log('Data being sent to Firestore:', updatedData);
        
        const success = await updateActivity(initialData.id, updatedData);
        console.log('Firestore update result:', success);
        
        if (!success) {
          console.log('Update failed, reverting checkbox');
          setIsSpecial(false);
          Alert.alert("Error", "Failed to update special status. Please try again.");
        }
      } catch (error) {
        console.error("Error updating special status:", error);
        console.log('Error occurred, reverting checkbox');
        setIsSpecial(false);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const processSubmission = async () => {
    try {
      setIsSubmitting(true);
      
      const activityData = {
        activityType,
        duration: parseInt(duration, 10),
        date: date.toISOString().split('T')[0],
        isSpecial,
        lastUpdated: new Date().toISOString(),
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

  const handleSave = async () => {
    if (isSubmitting) return;

    if (!activityType) {
      Alert.alert("Alert", "Please select an activity.");
      return;
    }
    if (!duration || isNaN(duration) || parseInt(duration, 10) <= 0) {
      Alert.alert("Alert", "Please enter a valid duration (greater than 0).");
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
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View style={styleHelper.forms.container}>
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

      <Text style={[styleHelper.forms.label, { color: themeColors.text }]}>Duration (min) *</Text>
      <TextInput
        style={[styleHelper.forms.input, { color: themeColors.text }]}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        placeholder="Enter duration"
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
        <View style={[
          styleHelper.forms.checkboxContainer,
          { marginHorizontal: 16 }
        ]}>
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
              This item is marked as special. Select the checkbox if you would like to approve it.
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