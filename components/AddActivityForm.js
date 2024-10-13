import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function AddActivityForm() {
  const [activityType, setActivityType] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation();
  const { addActivity } = useData();
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  const handleSave = () => {
    if (!activityType || !duration) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const durationNum = parseInt(duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Error', 'Please enter a valid duration');
      return;
    }

    const newActivity = {
      activityType,
      duration: durationNum,
      date: date.toISOString().split('T')[0],
      isSpecial: (activityType === 'Running' || activityType === 'Weight Training') && durationNum > 60
    };

    addActivity(newActivity);
    navigation.goBack();
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <View style={[styleHelper.forms.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styleHelper.forms.label, { color: themeColors.text }]}>Activity Type:</Text>
      <Picker
        selectedValue={activityType}
        onValueChange={(itemValue) => setActivityType(itemValue)}
        style={[styleHelper.forms.picker, { color: themeColors.text }]}
      >
        <Picker.Item label="Select an activity" value="" />
        <Picker.Item label="Walking" value="Walking" />
        <Picker.Item label="Running" value="Running" />
        <Picker.Item label="Swimming" value="Swimming" />
        <Picker.Item label="Weight Training" value="Weight Training" />
        <Picker.Item label="Yoga" value="Yoga" />
        <Picker.Item label="Cycling" value="Cycling" />
        <Picker.Item label="Hiking" value="Hiking" />
      </Picker>

      <Text style={[styleHelper.forms.label, { color: themeColors.text }]}>Duration (minutes):</Text>
      <TextInput
        style={[styleHelper.forms.input, { color: themeColors.text, borderColor: themeColors.text }]}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        placeholder="Enter duration"
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