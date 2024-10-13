import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [dietEntries, setDietEntries] = useState([]);

  const addActivity = (activity) => {
    setActivities(prevActivities => [...prevActivities, activity]);
  };

  const addDietEntry = (entry) => {
    setDietEntries(prevEntries => [...prevEntries, entry]);
  };

  return (
    <DataContext.Provider value={{ activities, dietEntries, addActivity, addDietEntry }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);