export const styleHelper = {
  colors: {
    light: {
      primary: '#5e35b1',
      background: '#e6e1f2',
      text: '#000000',
      inputBackground: '#d3d3d3',
      headerText: '#ffffff',
      tabIcon: '#FFA500',
      tabBarBackground: '#5e35b1',
      tabBarInactiveIcon: 'rgba(255,165,0,0.7)',
      listItemBackground: '#d3d3d3',
    },
    dark: {
      primary: '#5e35b1',
      background: '#121212',
      text: '#ffffff',
      inputBackground: '#2a2a2a',
      headerText: '#ffffff',
      tabIcon: '#FFA500',
      tabBarBackground: '#5e35b1',
      tabBarInactiveIcon: 'rgba(255,165,0,0.5)',
      listItemBackground: '#8B4513',
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
      fontWeight: '500',
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 16,
      paddingHorizontal: 12,
      justifyContent: 'center',
      backgroundColor: '#d3d3d3',
    },
    dropdownInput: {
      backgroundColor: '#d3d3d3',
      borderColor: '#d3d3d3',
      marginBottom: 16,
    },
    dropdownText: {
      fontSize: 16,
    },
    dropdownContainer: {
      backgroundColor: 'white',
      borderColor: '#dfdfdf',
    },
    dateInput: {
      height: 48,
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 16,
      paddingHorizontal: 12,
      backgroundColor: '#d3d3d3',
      justifyContent: 'center',
    },
    datePicker: {
      backgroundColor: 'white',
      marginBottom: 20,
    },
    dateText: {
      marginTop: 8,
      marginBottom: 16,
      fontSize: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      padding: 10,
      borderRadius: 5,
      width: '45%',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    cancelButton: {
      flex: 1,
      padding: 10,
      marginHorizontal: 5,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    saveButton: {
      flex: 1,
      padding: 10,
      marginHorizontal: 5,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#5e35b1', // Purple color
    },
    cancelButtonText: {
      color: '#5e35b1', // Purple color
      fontSize: 16,
      fontWeight: 'bold',
    },
    saveButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
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
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
    },
    headerText: {
      fontSize: 16,
      fontWeight: '500',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    addButton: {
      marginRight: 15,
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
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
  listItem: {
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
    },
    text: {
      fontSize: 16,
    },
    subText: {
      fontSize: 14,
      marginTop: 4,
    },
  },
  itemsList: {
    item: {
      padding: 16,
      marginBottom: 8,
      borderRadius: 8,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    itemTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
    },
    itemDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    itemText: {
      fontSize: 14,
      color: 'white',
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 32,
      fontSize: 16,
      color: 'white',
    },
  },
  modal: {
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      margin: 20,
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 16,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 16,
    }
  },
};

export const getThemeColors = (isDarkMode) => {
  if (!styleHelper || !styleHelper.colors) {
    console.error('styleHelper or styleHelper.colors is undefined');
    return {};
  }
  
  return isDarkMode ? styleHelper.colors.dark : styleHelper.colors.light;
};