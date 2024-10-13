export const styleHelper = {
    colors: {
      primary: '#4a90e2',
      secondary: '#f5a623',
      background: {
        light: '#ffffff',
        dark: '#121212',
      },
      text: {
        light: '#000000',
        dark: '#ffffff',
      },
    },
    spacing: {
      small: 8,
      medium: 16,
      large: 24,
    },
    fontSize: {
      small: 12,
      medium: 16,
      large: 20,
      xlarge: 24,
    },
    padding: {
      small: 5,
      medium: 10,
      large: 15,
    },
    borderRadius: {
      small: 4,
      medium: 8,
      large: 12,
    },
  };
  
  export const getThemeColors = (isDarkMode) => ({
    background: isDarkMode ? styleHelper.colors.background.dark : styleHelper.colors.background.light,
    text: isDarkMode ? styleHelper.colors.text.dark : styleHelper.colors.text.light,
  });