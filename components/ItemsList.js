import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

// ItemsList: A reusable component to display a list of activities or diet entries
export default function ItemsList({ type, data, loading }) {
  // Get current theme mode
  const { isDarkMode } = useTheme();
  // Get theme colors based on current mode
  const themeColors = getThemeColors(isDarkMode);

  // Add loading state handling
  if (loading) {
    return (
      <View style={[styleHelper.itemsList.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={themeColors.tabIcon} />
      </View>
    );
  }

  // Render individual list item
  const renderItem = ({ item }) => (
    <View style={[
      styleHelper.itemsList.item, 
      { backgroundColor: themeColors.listItemBackground }
    ]}>
      <View style={styleHelper.itemsList.itemHeader}>
        {/* Display activity type or diet entry description */}
        <Text style={[styleHelper.itemsList.itemTitle, { color: themeColors.text }]}>
          {type === 'activity' ? item.activityType : item.description}
        </Text>
        {/* Display warning icon for special items */}
        {item.isSpecial && (
          <Ionicons name="warning" size={20} color={themeColors.tabIcon} />
        )}
      </View>
      <View style={styleHelper.itemsList.itemDetails}>
        {/* Display duration for activities or calories for diet entries */}
        <Text style={[styleHelper.itemsList.itemText, { color: themeColors.text }]}>
          {type === 'activity' ? `${item.duration} min` : `${item.calories} cal`}
        </Text>
        {/* Display date for all entries */}
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
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{
        marginTop: styleHelper.spacing.medium,
        marginHorizontal: styleHelper.spacing.medium,
      }}
      ListEmptyComponent={
        // Display message when list is empty
        <Text style={[styleHelper.itemsList.emptyText, { color: themeColors.text }]}>
          No {type} entries yet.
        </Text>
      }
    />
  );
}