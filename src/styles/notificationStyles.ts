import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const notificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default notificationStyles;