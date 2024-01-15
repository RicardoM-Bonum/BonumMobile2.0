import Toast from 'react-native-root-toast';

const displayToast = (message, type) => {
  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0
  })
};

export default displayToast;
