import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [dietEntries, setDietEntries] = useState([]);

  const addActivity = (activity) => {
    const isSpecial = (activity.activityType === 'Running' || activity.activityType === 'Weights') && activity.duration > 60;
    setActivities(prevActivities => [...prevActivities, { ...activity, isSpecial }]);
  };

  const addDietEntry = (entry) => {
    const isSpecial = entry.calories > 800;
    setDietEntries(prevEntries => [...prevEntries, { ...entry, isSpecial }]);
  };

  return (
    <DataContext.Provider value={{ activities, dietEntries, addActivity, addDietEntry }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);