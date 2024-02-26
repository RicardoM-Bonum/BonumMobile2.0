import Toast from 'react-native-toast-message';

const displayToast = (message, type) => {
  Toast.show({
    type,
    text1: message,
    position: 'bottom',
    visibilityTime: 5000,
  });
};

export default displayToast;
