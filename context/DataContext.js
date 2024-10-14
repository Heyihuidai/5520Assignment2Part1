import React, { createContext, useState, useContext } from 'react';

// DataContext: Manages app-wide data state for activities and diet entries
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [dietEntries, setDietEntries] = useState([]);

  // Adds a new activity with special flag if conditions are met
  const addActivity = (activity) => {
    // Validate duration
    const duration = parseInt(activity.duration);
    if (isNaN(duration) || duration <= 0) {
      // Return false to indicate validation failure
      return false;
    }
  
    const isSpecial = (activity.activityType === 'Running' || activity.activityType === 'Weights') && duration > 60;
    setActivities(prevActivities => [...prevActivities, { ...activity, duration, isSpecial, id: Date.now() }]);
    return true; // Indicate successful addition
  };

  // Adds a new diet entry with special flag if calorie count is high
  const addDietEntry = (entry) => {
    const isSpecial = entry.calories > 800;
    setDietEntries(prevEntries => [...prevEntries, { ...entry, isSpecial, id: Date.now() }]);
  };

  return (
    <DataContext.Provider value={{ activities, dietEntries, addActivity, addDietEntry }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook for easy data access in components
export const useData = () => useContext(DataContext);