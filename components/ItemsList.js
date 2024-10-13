import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function ItemsList({ type }) {
  const { activities, dietEntries } = useData();
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  const data = type === 'activity' ? activities : dietEntries;

  const renderItem = ({ item }) => (
    <View style={[styles.item, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.itemText, { color: themeColors.text }]}>
        {type === 'activity' ? item.activityType : item.description}
      </Text>
      <Text style={[styles.itemText, { color: themeColors.text }]}>
        {type === 'activity' ? `${item.duration} min` : `${item.calories} cal`}
      </Text>
      <Text style={[styles.itemText, { color: themeColors.text }]}>
        {item.date}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={
        <Text style={[styles.emptyText, { color: themeColors.text }]}>
          No {type} entries yet.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: styleHelper.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: styleHelper.fontSize.medium,
    marginBottom: styleHelper.spacing.small,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: styleHelper.spacing.large,
    fontSize: styleHelper.fontSize.medium,
  },
});