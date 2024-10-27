import { firestoreHelper } from './firestoreHelper';

export const setupTestData = async () => {
  try {
    console.log('🎯 Starting test data setup...');

    // Test activity items
    const activityItems = [
      {
        name: 'Morning Run',
        duration: 30,
        type: 'cardio',
        calories: 300,
        description: 'Morning jog in the park'
      },
      {
        name: 'Evening Yoga',
        duration: 45,
        type: 'flexibility',
        calories: 150,
        description: 'Relaxing yoga session'
      }
    ];

    // Test diet items
    const dietItems = [
      {
        name: 'Breakfast Smoothie',
        calories: 250,
        type: 'breakfast',
        protein: 15,
        carbs: 30,
        fat: 8,
        description: 'Banana and protein smoothie'
      },
      {
        name: 'Grilled Chicken Salad',
        calories: 400,
        type: 'lunch',
        protein: 35,
        carbs: 15,
        fat: 12,
        description: 'Healthy lunch option'
      }
    ];

    // Add activities
    console.log('📝 Adding test activities...');
    const activityPromises = activityItems.map(item => 
      firestoreHelper.addItem('activities', item)
    );
    await Promise.all(activityPromises);
    
    // Add diet items
    console.log('📝 Adding test diet items...');
    const dietPromises = dietItems.map(item => 
      firestoreHelper.addItem('diet', item)
    );
    await Promise.all(dietPromises);

    console.log('✅ Test data setup complete!');
  } catch (error) {
    console.error('❌ Error setting up test data:', {
      error: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};