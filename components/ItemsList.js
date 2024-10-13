import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function ItemsList({ type }) {
  const { activities, dietEntries } = useData();
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  const data = type === 'activity' ? activities : dietEntries;

  const isSpecial = (item) => {
    if (type === 'activity') {
      return (item.activityType === 'Running' || item.activityType === 'Weights') && item.duration > 60;
    } else {
      return item.calories > 800;
    }
  };

  const renderItem = ({ item }) => (
    <View style={[
      styleHelper.itemsList.item, 
      { backgroundColor: themeColors.listItemBackground }
    ]}>
      <View style={styleHelper.itemsList.itemHeader}>
        <Text style={[styleHelper.itemsList.itemTitle, { color: themeColors.text }]}>
          {type === 'activity' ? item.activityType : item.description}
        </Text>
        {isSpecial(item) && (
          <Ionicons name="warning" size={20} color={themeColors.tabIcon} />
        )}
      </View>
      <View style={styleHelper.itemsList.itemDetails}>
        <Text style={[styleHelper.itemsList.itemText, { color: themeColors.text }]}>
          {type === 'activity' ? `${item.duration} min` : `${item.calories} cal`}
        </Text>
        <Text style={[styleHelper.itemsList.itemText, { color: themeColors.text }]}>
          {item.date}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={
        <Text style={[styleHelper.itemsList.emptyText, { color: themeColors.text }]}>
          No {type} entries yet.
        </Text>
      }
    />
  );
}