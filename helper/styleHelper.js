export const styleHelper = {
  colors: {
    light: {
      primary: '#5e35b1',
      background: '#e6e1f2',
      text: '#000000',
    },
    dark: {
      primary: '#5e35b1',
      background: '#121212',
      text: '#ffffff',
    }
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
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
  },
  forms: {
    container: {
      flex: 1,
      padding: 16,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
    },
    input: {
      height: 40,
      borderWidth: 1,
      borderRadius: 4,
      marginBottom: 16,
      paddingHorizontal: 8,
    },
    picker: {
      marginBottom: 16,
    },
    dateText: {
      marginTop: 8,
      marginBottom: 16,
    },
  },
  screens: {
    container: {
      flex: 1,
    },
    formContainer: {
      flex: 1,
      padding: 20,
    },
    addButton: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      backgroundColor: 'white',
      borderRadius: 30,
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    setting: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    settingText: {
      fontSize: 16,
    },
  },
};

export const getThemeColors = (isDarkMode) => {
  if (!styleHelper || !styleHelper.colors) {
    console.error('styleHelper or styleHelper.colors is undefined');
    return {};
  }
  
  return {
    background: isDarkMode ? styleHelper.colors.dark.background : styleHelper.colors.light.background,
    text: isDarkMode ? styleHelper.colors.dark.text : styleHelper.colors.light.text,
  };
};