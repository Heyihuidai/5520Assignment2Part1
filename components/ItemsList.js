import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';
import { format } from 'date-fns';

export default function ItemsList({ type, data, loading, error, onRetry }) {
  const navigation = useNavigation();
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

  const handleItemPress = (item) => {
    if (type === 'activity') {
      navigation.navigate('EditActivity', { activity: item });
    } else {
      navigation.navigate('EditDietEntry', { entry: item });
    }
  };

  const renderItem = ({ item }) => {
    let formattedDate = 'Date not available';
    try {
      if (item.date) {
        const date = new Date(item.date);
        if (!isNaN(date.getTime())) {
          formattedDate = format(date, 'MMM dd, yyyy');
        }
      }
    } catch (error) {
      console.error('Date formatting error:', error);
    }

    return (
      <TouchableOpacity 
        onPress={() => handleItemPress(item)}
        style={[
          styleHelper.itemsList.item, 
          { backgroundColor: themeColors.listItemBackground }
        ]}
      >
        <View style={styleHelper.itemsList.itemHeader}>
          <View style={styleHelper.itemsList.headerLeft}>
            {type === 'activity' ? (
              <>
                <Text style={[styleHelper.itemsList.itemTitle, { color: themeColors.text }]}>
                  {item.activityType}
                </Text>
                <Text style={[styleHelper.itemsList.duration, { color: themeColors.textSecondary }]}>
                  {item.duration} min
                </Text>
              </>
            ) : (
              <>
                <Text style={[styleHelper.itemsList.itemTitle, { color: themeColors.text }]}>
                  {item.description}
                </Text>
                <Text style={[styleHelper.itemsList.calories, { color: themeColors.textSecondary }]}>
                  {item.calories} cal
                </Text>
              </>
            )}
          </View>
          {item.isSpecial && (
            <Ionicons 
              name="alert-circle" 
              size={24} 
              color={themeColors.warning}
              style={styleHelper.itemsList.alertIcon}
            />
          )}
        </View>
        
        <View style={styleHelper.itemsList.itemDetails}>
          {item.notes && (
            <Text style={[styleHelper.itemsList.itemDescription, { color: themeColors.textSecondary }]}>
              {item.notes}
            </Text>
          )}
          <Text style={[styleHelper.itemsList.dateText, { color: themeColors.textTertiary }]}>
            {formattedDate}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id?.toString()}
      contentContainerStyle={{
        paddingTop: styleHelper.spacing.medium,
        paddingHorizontal: styleHelper.spacing.medium,
        paddingBottom: styleHelper.spacing.large,
      }}
      ListEmptyComponent={
        <Text style={[styleHelper.itemsList.emptyText, { color: themeColors.text }]}>
          No {type === 'activity' ? 'activities' : 'diet entries'} yet.
        </Text>
      }
    />
  );
}