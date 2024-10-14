import React, { createContext, useState, useContext } from 'react';
import { styleHelper } from '../helper/styleHelper';

// ThemeContext: Manages app-wide theme state (light/dark mode)
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggles between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Provides theme colors based on current mode
  const theme = {
    colors: isDarkMode ? styleHelper.colors.dark : styleHelper.colors.light,
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy theme access in components
export const useTheme = () => useContext(ThemeContext);