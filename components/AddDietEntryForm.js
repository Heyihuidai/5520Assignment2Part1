import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function AddDietEntryForm() {
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation();
  const { addDietEntry } = useData();
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  const handleSave = () => {
    if (!description || !calories) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const caloriesNum = parseInt(calories, 10);
    if (isNaN(caloriesNum) || caloriesNum < 0) {
      Alert.alert('Error', 'Please enter a valid number of calories');
      return;
    }

    const newEntry = {
      description,
      calories: caloriesNum,
      date: date.toISOString().split('T')[0],
      isSpecial: caloriesNum > 800
    };

    addDietEntry(newEntry);
    navigation.goBack();
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <View style={[styleHelper.forms.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styleHelper.forms.label, { color: themeColors.text }]}>Description:</Text>
      <TextInput
        style={[styleHelper.forms.input, { color: themeColors.text, borderColor: themeColors.text }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter food description"
        placeholderTextColor={themeColors.text}
      />

      <Text style={[styleHelper.forms.label, { color: themeColors.text }]}>Calories:</Text>
      <TextInput
        style={[styleHelper.forms.input, { color: themeColors.text, borderColor: themeColors.text }]}
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
        placeholder="Enter calories"
        placeholderTextColor={themeColors.text}
      />

      <Text style={[styleHelper.forms.label, { color: themeColors.text }]}>Date:</Text>
      <Button title="Select date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <Text style={[styleHelper.forms.dateText, { color: themeColors.text }]}>
        Selected date: {date.toISOString().split('T')[0]}
      </Text>

      <Button title="Save" onPress={handleSave} />
    </View>
  );
}