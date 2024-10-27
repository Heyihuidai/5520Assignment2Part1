import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function ItemsList({ type, data, loading, error, onRetry }) {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  if (error) {
    return (
      <View style={[styleHelper.itemsList.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styleHelper.itemsList.errorText, { color: themeColors.error }]}>
          {error}
        </Text>
        {onRetry && (
          <TouchableOpacity 
            onPress={onRetry}
            style={styleHelper.itemsList.retryButton}
          >
            <Text style={[styleHelper.itemsList.retryText, { color: themeColors.tabIcon }]}>
              Try Again
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styleHelper.itemsList.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={themeColors.tabIcon} />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={[
      styleHelper.itemsList.item, 
      { backgroundColor: themeColors.listItemBackground }
    ]}>
      <View style={styleHelper.itemsList.itemHeader}>
        <Text style={[styleHelper.itemsList.itemTitle, { color: themeColors.text }]}>
          {type === 'activity' ? item.name : item.name}
        </Text>
        {item.isSpecial && (
          <Ionicons name="warning" size={20} color={themeColors.tabIcon} />
        )}
      </View>
      <View style={styleHelper.itemsList.itemDetails}>
        <Text style={[styleHelper.itemsList.itemText, { color: themeColors.text }]}>
          {type === 'activity' ? `${item.duration} min` : `${item.calories} cal`}
        </Text>
        <Text style={[styleHelper.itemsList.itemDescription, { color: themeColors.text }]}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      contentContainerStyle={{
        marginTop: styleHelper.spacing.medium,
        marginHorizontal: styleHelper.spacing.medium,
      }}
      ListEmptyComponent={
        <Text style={[styleHelper.itemsList.emptyText, { color: themeColors.text }]}>
          No {type} entries yet.
        </Text>
      }
    />
  );
}